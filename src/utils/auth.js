/**
 * Pintree Authentication Utilities
 * Handles access token retrieval, proactive expiry detection,
 * automatic token refreshing via https://dev.user.pintree.co/v1/auth/refresh-token,
 * and resilient authenticated fetching.
 */

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
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
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
        res = await fetch("https://dev.user.pintree.co/v1/auth/refresh-token", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });
      }

      if (res && res.status === 404) {
        res = await fetch("https://dev.user.pintree.co/v1/auth/refresh-token", {
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
