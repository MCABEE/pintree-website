/**
 * Pintree Authentication Utilities
 * Handles access token retrieval, proactive expiry detection,
 * automatic token refreshing via USER_API_BASE/auth/refresh-token,
 * and resilient authenticated fetching.
 */

import { USER_API_BASE } from "@/config/api";

/**
 * Decode JWT token safely without external dependencies
 * @param {string} token 
 * @returns {object|null}
 */
export function decodeJwt(token) {
  if (!token || typeof token !== "string") return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4 !== 0) {
      base64 += "=";
    }
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

/**
 * Checks if a JWT token is expired or about to expire in bufferSec seconds
 * @param {string} token 
 * @param {number} bufferSec - Default 60 seconds
 * @returns {boolean}
 */
export function isTokenExpired(token, bufferSec = 60) {
  const decoded = decodeJwt(token);
  if (!decoded || !decoded.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return decoded.exp <= now + bufferSec;
}

// In-flight refresh promise singleton to avoid concurrent duplicate refresh calls
let refreshPromise = null;

/**
 * Refreshes the user access token using the HttpOnly refreshToken cookie
 * Endpoint: POST https://dev.user.pintree.co/v1/auth/refresh-token
 * @returns {Promise<string|null>} The newly minted accessToken or null
 */
export async function refreshAccessToken() {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      // 1. Try same-origin API proxy first (preserves HttpOnly cookies seamlessly without cross-site blocking)
      let res;
      try {
        res = await fetch("/api/auth/refresh-token", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });
      } catch (proxyErr) {
        res = await fetch(`${USER_API_BASE}/auth/refresh-token`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });
      }

      if (res && res.status === 404) {
        res = await fetch(`${USER_API_BASE}/auth/refresh-token`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });
      }

      const data = await res.json().catch(() => null);

      if (res.ok && data?.data?.accessToken) {
        const newToken = data.data.accessToken;

        if (typeof window !== "undefined") {
          localStorage.setItem("pintree_access_token", newToken);
          if (data.data.userId) {
            localStorage.setItem("pintree_user_id", data.data.userId);
          }
          // Also sync document cookie for middleware/SSR if applicable
          document.cookie = `pintree_token=${newToken}; path=/; max-age=${data.data.expiresIn || 86400}; SameSite=Lax`;
        }

        return newToken;
      } else {
        // Refresh token expired or not found; clean up local session gracefully
        if (typeof window !== "undefined") {
          clearAuthSession();
        }
        return null;
      }
    } catch (err) {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Clears stored authentication session and cookies
 */
export function clearAuthSession() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("pintree_access_token");
    localStorage.removeItem("pintree_user_id");
    localStorage.removeItem("pintree_user_email");
    localStorage.removeItem("pintree_user_phone");
    localStorage.removeItem("pintree_auth_email");
    localStorage.removeItem("pintree_auth_phone");
    localStorage.removeItem("pintree_login_method");
    localStorage.removeItem("pintree_login_verified");
    localStorage.removeItem("pintree_user_full_name");
    localStorage.removeItem("pintree_user_name");
    localStorage.removeItem("pintree_user_handle");
    localStorage.removeItem("pintree_user_handle_id");
    localStorage.removeItem("pintree_user_profile_image");
    localStorage.removeItem("pintree_user_avatar");
    localStorage.removeItem("pintree_email_verified");
    localStorage.removeItem("pintree_mobile_verified");
    localStorage.removeItem("pintree_signup_pending");
    document.cookie = "pintree_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
  } catch (e) {
    // ignore storage clearance errors
  }
}

/**
 * Returns a valid, non-expired access token. If expired, refreshes it automatically.
 * Returns null if user is not logged in or if the session cannot be refreshed.
 * @returns {Promise<string|null>}
 */
export async function getValidAccessToken() {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("pintree_access_token");
  // If no token is stored, user is not logged in; do NOT attempt refresh
  if (!token) {
    return null;
  }

  // Check if token is expired or expiring in <= 60 seconds
  if (isTokenExpired(token, 60)) {
    const refreshed = await refreshAccessToken();
    if (refreshed) return refreshed;
    clearAuthSession();
    return null;
  }

  return token;
}

/**
 * Performs an authenticated fetch with automatic token injection and 401 retry
 * @param {string} url
 * @param {RequestInit} options
 * @returns {Promise<Response>}
 */
export async function authenticatedFetch(url, options = {}) {
  let token = await getValidAccessToken();

  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  let res = await fetch(url, {
    ...options,
    credentials: "include",
    headers,
  });

  // If 401 Unauthorized, token might have been invalidated; attempt single refresh retry
  if (res.status === 401 && token) {
    const freshToken = await refreshAccessToken();
    if (freshToken) {
      const retryHeaders = {
        ...options.headers,
        Authorization: `Bearer ${freshToken}`,
      };
      res = await fetch(url, {
        ...options,
        credentials: "include",
        headers: retryHeaders,
      });
    } else {
      clearAuthSession();
    }
  }

  return res;
}

function extractProfileImageUrl(source) {
  if (!source || typeof source !== "object") return "";
  const candidates = [
    source.profileImageUrl,
    source.profileImage,
    source.profilePic,
    source.profilePicture,
    source.avatarUrl,
    source.avatar,
    source.photoUrl,
    source.photo,
    source.imageUrl,
    source.image,
    source.media?.url,
    source.profileMedia?.url,
  ];
  for (const val of candidates) {
    if (typeof val === "string" && val.trim()) return val.trim();
  }
  return "";
}

/**
 * Fetches the authenticated user's exact profile from /users/profile
 * and persists real name, handle, avatar, and contact details to localStorage.
 */
export async function fetchAndPersistCurrentUserProfile() {
  if (typeof window === "undefined") return null;
  const token = await getValidAccessToken();
  if (!token) return null;

  try {
    const res = await authenticatedFetch(`${USER_API_BASE}/users/profile`);
    if (!res.ok) return null;
    const json = await res.json().catch(() => null);
    const p = json?.data;
    if (!p || typeof p !== "object") return null;

    const fullName = String(p.fullName || p.name || "").trim();
    const rawHandle = String(p.handleId || p.handle || p.username || "").trim();
    const handle = rawHandle
      ? rawHandle.startsWith("@")
        ? rawHandle
        : `@${rawHandle}`
      : "";
    const email = String(
      p.email ||
      localStorage.getItem("pintree_auth_email") ||
      localStorage.getItem("pintree_user_email") ||
      ""
    ).trim();
    const phone = String(
      p.mobileNumber ||
      p.phoneNumber ||
      p.phone ||
      localStorage.getItem("pintree_auth_phone") ||
      localStorage.getItem("pintree_user_phone") ||
      ""
    ).trim();
    const userId = String(
      p.userCredentialId ||
      p.id ||
      localStorage.getItem("pintree_user_id") ||
      ""
    ).trim();
    const profileImageUrl = extractProfileImageUrl(p);

    if (userId) localStorage.setItem("pintree_user_id", userId);
    if (fullName) {
      localStorage.setItem("pintree_user_full_name", fullName);
    }
    if (handle) {
      localStorage.setItem("pintree_user_handle", handle);
    }
    if (email) localStorage.setItem("pintree_user_email", email);
    if (phone) localStorage.setItem("pintree_user_phone", phone);
    if (profileImageUrl) {
      localStorage.setItem("pintree_user_profile_image", profileImageUrl);
    } else {
      localStorage.removeItem("pintree_user_profile_image");
      localStorage.removeItem("pintree_user_avatar");
    }

    return {
      userId,
      fullName,
      handle,
      email,
      phone,
      profileImageUrl,
      rawProfile: p,
    };
  } catch (err) {
    console.warn("[fetchAndPersistCurrentUserProfile]:", err);
    return null;
  }
}
