import { getDeviceInfo } from "@/utils/device";
import { USER_API_BASE } from "@/config/api";

const GIS_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

let gisLoadPromise = null;

function getGoogleClientId() {
  return (
    process.env.NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
    process.env.GOOGLE_WEB_CLIENT_ID ||
    ""
  ).trim();
}

export function loadGoogleIdentityScript() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Sign-In is only available in the browser."));
  }

  if (window.google?.accounts?.id) {
    return Promise.resolve(window.google);
  }

  if (gisLoadPromise) return gisLoadPromise;

  gisLoadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${GIS_SCRIPT_SRC}"]`);
    if (existing) {
      if (window.google?.accounts?.id) {
        resolve(window.google);
        return;
      }
      existing.addEventListener("load", () => resolve(window.google), {
        once: true,
      });
      existing.addEventListener(
        "error",
        () => reject(new Error("Failed to load Google Sign-In.")),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.src = GIS_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = () => {
      gisLoadPromise = null;
      reject(new Error("Failed to load Google Sign-In."));
    };
    document.head.appendChild(script);
  });

  return gisLoadPromise;
}

function removeGoogleChooser() {
  document.getElementById("pintree-google-chooser")?.remove();
}

/**
 * Shows a real clickable Google button (required — browsers block programmatic popup clicks).
 */
function showGoogleButtonChooser(google, onCancel) {
  removeGoogleChooser();

  const overlay = document.createElement("div");
  overlay.id = "pintree-google-chooser";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Continue with Google");
  Object.assign(overlay.style, {
    position: "fixed",
    inset: "0",
    zIndex: "99999",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(19, 19, 19, 0.45)",
    padding: "16px",
  });

  const panel = document.createElement("div");
  Object.assign(panel.style, {
    width: "100%",
    maxWidth: "360px",
    background: "#fff",
    borderRadius: "16px",
    padding: "24px 20px 20px",
    boxShadow: "0 16px 40px rgba(0,0,0,0.18)",
    fontFamily: "system-ui, sans-serif",
    textAlign: "center",
  });

  const title = document.createElement("p");
  title.textContent = "Continue with Google";
  Object.assign(title.style, {
    margin: "0 0 6px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#131313",
  });

  const subtitle = document.createElement("p");
  subtitle.textContent = "Choose an account to continue to Pintree.";
  Object.assign(subtitle.style, {
    margin: "0 0 18px",
    fontSize: "13px",
    color: "#737373",
  });

  const buttonHost = document.createElement("div");
  Object.assign(buttonHost.style, {
    display: "flex",
    justifyContent: "center",
    minHeight: "44px",
  });

  const cancel = document.createElement("button");
  cancel.type = "button";
  cancel.textContent = "Cancel";
  Object.assign(cancel.style, {
    marginTop: "16px",
    background: "transparent",
    border: "none",
    color: "#737373",
    fontSize: "13px",
    cursor: "pointer",
    textDecoration: "underline",
  });
  cancel.addEventListener("click", () => {
    removeGoogleChooser();
    onCancel();
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      removeGoogleChooser();
      onCancel();
    }
  });

  panel.appendChild(title);
  panel.appendChild(subtitle);
  panel.appendChild(buttonHost);
  panel.appendChild(cancel);
  overlay.appendChild(panel);
  document.body.appendChild(overlay);

  google.accounts.id.renderButton(buttonHost, {
    type: "standard",
    theme: "outline",
    size: "large",
    text: "continue_with",
    shape: "rectangular",
    logo_alignment: "left",
    width: 320,
  });
}

/**
 * Prompts Google Identity Services and resolves with an ID token (credential).
 * Uses a visible Google button — programmatic clicks are blocked by browsers.
 */
export async function requestGoogleIdToken() {
  const clientId = getGoogleClientId();
  if (!clientId) {
    throw new Error(
      "Google Sign-In is not configured. Set GOOGLE_WEB_CLIENT_ID."
    );
  }

  const google = await loadGoogleIdentityScript();
  if (!google?.accounts?.id) {
    throw new Error("Google Sign-In is unavailable.");
  }

  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (err, token) => {
      if (settled) return;
      settled = true;
      removeGoogleChooser();
      try {
        google.accounts.id.cancel();
      } catch {
        /* ignore */
      }
      if (err) reject(err);
      else resolve(token);
    };

    google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        if (response?.credential) {
          finish(null, response.credential);
        } else {
          finish(new Error("Google Sign-In did not return a token."));
        }
      },
      auto_select: false,
      cancel_on_tap_outside: true,
      // FedCM often fails on localhost with NetworkError; use legacy GIS prompt/button.
      use_fedcm_for_prompt: false,
    });

    // Skip One Tap — go straight to a real Google button the user can click.
    // (One Tap/FedCM is flaky on localhost; fake .click() on a hidden button is popup-blocked.)
    try {
      showGoogleButtonChooser(google, () => {
        finish(new Error("Google Sign-In was cancelled."));
      });
    } catch (e) {
      finish(
        e instanceof Error
          ? e
          : new Error("Google Sign-In could not start.")
      );
    }
  });
}

export function persistGoogleSession(data) {
  if (typeof window === "undefined" || !data?.accessToken) return false;

  try {
    localStorage.setItem("pintree_access_token", data.accessToken);
    localStorage.setItem("pintree_login_method", "email");
    localStorage.setItem("pintree_login_verified", "true");
    localStorage.setItem("pintree_email_verified", "true");

    if (data.userId) {
      localStorage.setItem("pintree_user_id", data.userId);
    }
    if (data.email) {
      localStorage.setItem("pintree_user_email", data.email);
      localStorage.setItem("pintree_auth_email", data.email);
    }
    if (data.name) {
      localStorage.setItem("pintree_user_full_name", data.name);
    }
    if (data.profileImage) {
      localStorage.setItem("pintree_user_profile_image", data.profileImage);
    }

    const maxAge = data.expiresIn || 86400;
    document.cookie = `pintree_token=${data.accessToken}; path=/; max-age=${maxAge}; SameSite=Lax`;
    return true;
  } catch (err) {
    console.warn("Google session storage warning:", err);
    return false;
  }
}

export function needsGoogleProfileCompletion(data) {
  if (!data) return false;
  if (data.isNewUser === true) return true;
  const status = String(data.signUpStatus || "").toUpperCase();
  return status === "INFO_PENDING";
}

/**
 * Full Google sign-in against Pintree backend.
 * @returns {Promise<{ ok: boolean, status: number, data: object|null, message?: string }>}
 */
export async function signInWithGoogle() {
  const idToken = await requestGoogleIdToken();
  const device = getDeviceInfo();
  const payload = { idToken, device };

  let res;
  try {
    res = await fetch("/api/auth/google", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    res = await fetch(`${USER_API_BASE}/auth/google`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  }

  const data = await res.json().catch(() => null);

  if (!res.ok || (data && data.status === "error")) {
    let message =
      (typeof data?.message === "string" && data.message) ||
      (typeof data?.error === "string" && data.error) ||
      "Google Sign-In failed. Please try again.";

    // Backend rejects tokens whose `aud` is not its configured Google client ID(s)
    if (
      res.status === 401 ||
      /google authentication failed/i.test(message)
    ) {
      message =
        "Google sign-in worked, but the Pintree API rejected the token. Ask the backend team to allow this web client ID as a Google token audience: " +
        (getGoogleClientId() || "(missing GOOGLE_WEB_CLIENT_ID)");
    }
    if (res.status === 409) {
      message =
        "An account with this email already exists. Please log in with password.";
    }
    console.warn("Google auth API error:", res.status, data);
    return { ok: false, status: res.status, data, message };
  }

  if (data?.data?.accessToken) {
    persistGoogleSession(data.data);
    if (needsGoogleProfileCompletion(data.data)) {
      localStorage.setItem("pintree_signup_pending", "profile");
    } else {
      localStorage.removeItem("pintree_signup_pending");
    }
  }

  return { ok: true, status: res.status, data: data?.data || null };
}
