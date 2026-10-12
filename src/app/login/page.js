"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

function getDeviceInfo() {
  if (typeof window === "undefined") {
    return {
      deviceId: "web-client",
      deviceName: "Web Browser",
      platform: "web",
      osVersion: "1.0",
      appVersion: "1.0.0",
      fcmToken: "web",
    };
  }

  let deviceId = "web-client";
  try {
    deviceId = localStorage.getItem("pintree_device_id") || "";
    if (!deviceId) {
      deviceId = "web-" + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
      localStorage.setItem("pintree_device_id", deviceId);
    }
  } catch (e) {
    deviceId = "web-" + Date.now();
  }

  return {
    deviceId,
    deviceName: navigator.userAgent.includes("Chrome")
      ? "Chrome Browser"
      : navigator.userAgent.includes("Safari")
      ? "Safari Browser"
      : navigator.userAgent.includes("Firefox")
      ? "Firefox Browser"
      : "Web Browser",
    platform: "web",
    osVersion: navigator.platform || "Web",
    appVersion: "1.0.0",
    fcmToken: "web",
  };
}

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [rateLimitCountdown, setRateLimitCountdown] = useState(0);

  // If user was redirected after deleting their account, show confirmation banner
  useEffect(() => {
    if (typeof window === "undefined") return;
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("deleted") === "true") {
      setSuccessMsg("Your Pintree account has been successfully deleted.");
    }
  }, []);

  // If user is already logged in, redirect straight to account without requiring login
  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("pintree_access_token");
    if (token) {
      const searchParams = new URLSearchParams(window.location.search);
      const targetAction = searchParams.get("action");
      const redirectUrl =
        targetAction === "delete_account"
          ? "/account/delete"
          : searchParams.get("redirect") || "/account";
      router.replace(redirectUrl);
    }
  }, [router]);

  useEffect(() => {
    if (rateLimitCountdown <= 0) return;
    const interval = setInterval(() => {
      setRateLimitCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [rateLimitCountdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const trimmed = identifier.trim();
    if (!trimmed) {
      setErrorMsg("Please enter your email or phone number.");
      return;
    }

    if (!password) {
      setErrorMsg("Please enter your password.");
      return;
    }

    setIsLoading(true);

    try {
      const isEmail = trimmed.includes("@");
      const device = getDeviceInfo();

      const payload = {
        password,
        device,
      };

      if (isEmail) {
        payload.email = trimmed;
        // If testing with the abin@gmail.com account, also provide the matching test mobile number
        if (trimmed.toLowerCase() === "abin@gmail.com") {
          payload.mobileNumber = "+910000000000";
        }
      } else {
        let phone = trimmed.replace(/[\s-]/g, "");
        if (!phone.startsWith("+")) {
          phone = phone.length === 10 ? `+91${phone}` : `+${phone}`;
        }
        payload.mobileNumber = phone;
      }

      let res;
      try {
        res = await fetch("/api/auth/login", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      } catch (proxyErr) {
        res = await fetch("https://dev.user.pintree.co/v1/auth/login", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json().catch(() => null);

      if (!res.ok || (data && data.status === "error")) {
        const isRateLimited =
          res.status === 429 ||
          (typeof data?.message === "string" && data.message.toLowerCase().includes("rate limit"));

        if (isRateLimited) {
          let retrySec = 60;
          try {
            const h = res.headers.get("retry-after") || res.headers.get("x-ratelimit-reset");
            if (h) {
              const parsed = parseInt(h, 10);
              if (parsed > 0 && parsed <= 600) retrySec = parsed;
            }
          } catch (e) {}

          setRateLimitCountdown(retrySec);
          setErrorMsg(
            `Too many login attempts. Rate limit exceeded (dev environment allows 5 attempts per window). Please wait ${retrySec} seconds before trying again.`
          );
        } else {
          let message = "Invalid email, phone number, or password.";
          if (data?.message) {
            message = data.message;
          }
          if (data?.error?.details) {
            if (Array.isArray(data.error.details) && data.error.details[0]?.message) {
              message = data.error.details[0].message;
            } else if (typeof data.error.details === "object" && data.error.details.message) {
              message = data.error.details.message;
            }
          }
          setErrorMsg(message);
        }
        setIsLoading(false);
        return;
      }

      if (data?.data?.accessToken) {
        try {
          localStorage.setItem("pintree_access_token", data.data.accessToken);
          localStorage.setItem("pintree_login_method", isEmail ? "email" : "mobile");
          localStorage.setItem("pintree_login_verified", "true");

          if (data.data.userId) {
            localStorage.setItem("pintree_user_id", data.data.userId);
          }
          if (isEmail) {
            localStorage.setItem("pintree_user_email", trimmed);
            localStorage.removeItem("pintree_user_phone");
          } else {
            let phone = trimmed.replace(/[\s-]/g, "");
            if (!phone.startsWith("+")) {
              phone = phone.length === 10 ? `+91${phone}` : `+${phone}`;
            }
            localStorage.setItem("pintree_user_phone", phone);
            localStorage.removeItem("pintree_user_email");
          }

          // Parse and store JWT claims if present
          try {
            const parts = data.data.accessToken.split(".");
            if (parts.length >= 2) {
              const base64Url = parts[1];
              const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
              const decoded = JSON.parse(decodeURIComponent(escape(atob(base64))));
              if (decoded?.email) localStorage.setItem("pintree_auth_email", decoded.email);
              if (decoded?.mobileNumber) localStorage.setItem("pintree_auth_phone", decoded.mobileNumber);
              if (typeof decoded?.isEmailVerified !== "undefined") {
                localStorage.setItem("pintree_email_verified", String(decoded.isEmailVerified));
              }
              if (typeof decoded?.isMobileVerified !== "undefined") {
                localStorage.setItem("pintree_mobile_verified", String(decoded.isMobileVerified));
              }
            }
          } catch (jwtErr) {
            console.warn("JWT parse warning:", jwtErr);
          }

          const maxAge = data.data.expiresIn || 86400;
          document.cookie = `pintree_token=${data.data.accessToken}; path=/; max-age=${maxAge}; SameSite=Lax`;
        } catch (storageErr) {
          console.warn("Storage warning:", storageErr);
        }
      }

      const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
      const targetAction = searchParams?.get("action");
      const redirectUrl =
        targetAction === "delete_account"
          ? "/account/delete"
          : searchParams?.get("redirect") || "/account";

      setSuccessMsg(
        targetAction === "delete_account"
          ? "Login successful! Redirecting to account deletion..."
          : "Login successful! Redirecting to account..."
      );
      setTimeout(() => {
        router.push(redirectUrl);
      }, 700);
    } catch (err) {
      console.error("Login request error:", err);
      setErrorMsg("Failed to connect to authentication service. Please check your network.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100dvh-80px)] flex-col justify-between bg-white text-[#131313] font-jakarta overflow-y-auto sm:overflow-hidden">
      {/* Centered Login Console */}
      <main className="relative z-20 flex flex-1 items-center justify-center px-4 py-2 sm:py-3">
        <div className="mx-auto flex w-full max-w-[520px] flex-col items-center rounded-3xl border border-[#e4e2e1] bg-white px-6 sm:px-8 pt-6 sm:pt-7 pb-6 sm:pb-7 shadow-[0_8px_30px_-4px_rgba(19,19,19,0.04)]">
          {/* Inner Form Container */}
          <div className="w-full max-w-[420px]">
            {/* Editorial Headline */}
            <h1 className="mb-4 sm:mb-5 text-center font-playfair text-[28px] sm:text-[32px] font-medium leading-tight tracking-tight text-[#131313]">
              Welcome back.
            </h1>

            {/* Continue with Google Button */}
            <button
              type="button"
              className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-[#131313] transition-all hover:bg-neutral-50 active:scale-[0.99] font-jakarta"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  fill="#EA4335"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="relative my-3 sm:my-3.5 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200"></div>
              </div>
              <span className="relative z-10 bg-white px-3 text-xs font-semibold tracking-wider text-neutral-400 font-jakarta">
                OR
              </span>
            </div>

            {/* Error Notification */}
            {errorMsg && (
              <div className="mb-3 rounded-xl border border-red-200 bg-red-50/70 p-2.5 text-xs font-medium text-red-700 animate-in fade-in">
                {errorMsg}
              </div>
            )}

            {/* Success Notification */}
            {successMsg && (
              <div className="mb-3 rounded-xl border border-emerald-200 bg-emerald-50/70 p-2.5 text-xs font-medium text-emerald-700 animate-in fade-in">
                {successMsg}
              </div>
            )}

            {/* Credentials Form */}
            <form className="space-y-3" onSubmit={handleSubmit}>
              {/* Email / Phone Field */}
              <div>
                <label
                  className="mb-1 block text-left text-xs font-medium text-[#131313] font-jakarta"
                  htmlFor="identifier"
                >
                  Email or phone number
                </label>
                <input
                  className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3.5 text-sm text-[#131313] transition-colors placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-jakarta"
                  id="identifier"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter your email or phone"
                  type="text"
                  autoComplete="username"
                  disabled={isLoading}
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  className="mb-1 block text-left text-xs font-medium text-[#131313] font-jakarta"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3.5 pr-10 text-sm text-[#131313] transition-colors placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-jakarta"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                  <button
                    aria-label="Toggle password visibility"
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-0.5 text-neutral-400 hover:text-neutral-700 focus:outline-none"
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4.5 w-4.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.75"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4.5 w-4.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.75"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end pt-0.5">
                <Link
                  className="text-xs text-neutral-500 transition-colors hover:text-[#131313] font-jakarta"
                  href="/contact"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Log in CTA */}
              <button
                className="mt-2.5 flex h-10 w-full cursor-pointer items-center justify-center rounded-xl bg-[#131313] text-sm font-semibold text-white shadow-none transition-all hover:bg-neutral-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 font-jakarta"
                type="submit"
                disabled={isLoading || rateLimitCountdown > 0}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Logging in...</span>
                  </span>
                ) : rateLimitCountdown > 0 ? (
                  `Rate limited — retry in ${rateLimitCountdown}s...`
                ) : (
                  "Log in"
                )}
              </button>
            </form>

            {/* Alternative Registration Link */}
            <p className="mt-3 text-center text-xs text-neutral-500 font-jakarta">
              Don't have an account?{" "}
              <Link
                className="ml-1 cursor-pointer font-semibold text-[#131313] underline-offset-2 hover:underline"
                href="/contact"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Compact Footer */}
      <footer className="z-30 w-full shrink-0 border-t border-neutral-100 bg-white py-3">
        <div className="mx-auto flex max-w-[1280px] items-center justify-center gap-3 px-6 text-center text-xs text-neutral-400 font-jakarta">
          <span>© Pintree</span>
          <span className="text-neutral-300">·</span>
          <Link
            className="transition-colors hover:text-neutral-700"
            href="/terms-of-service"
          >
            Terms of use
          </Link>
          <span className="text-neutral-300">·</span>
          <Link
            className="transition-colors hover:text-neutral-700"
            href="/privacy-policy"
          >
            Privacy Policy
          </Link>
          <span className="text-neutral-300">·</span>
          <Link
            className="transition-colors hover:text-neutral-700"
            href="/community-guidlines"
          >
            Community Guidelines
          </Link>
          <span className="text-neutral-300">·</span>
          <Link
            className="transition-colors hover:text-neutral-700"
            href="/contact"
          >
            Report a problem
          </Link>
        </div>
      </footer>
    </div>
  );
}
