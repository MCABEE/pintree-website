"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Footer from "@/components/Footer";

function isPhoneContact(value) {
  const trimmed = value.trim();
  if (!trimmed || trimmed.includes("@")) return false;
  return /^[\d+\s-]+$/.test(trimmed);
}

function normalizeIndianMobile(raw) {
  return String(raw || "")
    .replace(/^\+?91/, "")
    .replace(/\D/g, "")
    .slice(0, 10);
}

function contactPayload(rawContact) {
  const trimmed = rawContact.trim();
  if (trimmed.includes("@")) {
    return { email: trimmed, signUp: false };
  }
  return { mobileNumber: `+91${normalizeIndianMobile(trimmed)}`, signUp: false };
}

function apiMessage(data, fallback) {
  if (typeof data?.message === "string" && data.message) return data.message;
  if (Array.isArray(data?.error?.details) && data.error.details[0]?.message) {
    return data.error.details[0].message;
  }
  return fallback;
}

function persistSession(data, fields) {
  const accessToken = data?.data?.accessToken;
  if (!accessToken) return;

  localStorage.setItem("pintree_access_token", accessToken);
  localStorage.setItem("pintree_login_verified", "true");
  localStorage.removeItem("pintree_signup_pending");

  if (data.data.userId) {
    localStorage.setItem("pintree_user_id", data.data.userId);
  }

  if (fields.email) {
    localStorage.setItem("pintree_login_method", "email");
    localStorage.setItem("pintree_user_email", fields.email);
    localStorage.removeItem("pintree_user_phone");
  } else if (fields.mobileNumber) {
    localStorage.setItem("pintree_login_method", "mobile");
    localStorage.setItem("pintree_user_phone", fields.mobileNumber);
    localStorage.removeItem("pintree_user_email");
  }

  try {
    const parts = accessToken.split(".");
    if (parts.length >= 2) {
      const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
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
  } catch (error) {
    console.warn("JWT parse warning:", error);
  }

  const maxAge = data.data.expiresIn || 3600;
  document.cookie = `pintree_token=${accessToken}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

const inputClass =
  "h-10 w-full rounded-xl border border-neutral-200 bg-white px-3.5 text-sm text-[#131313] transition-colors placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-jakarta disabled:cursor-not-allowed disabled:opacity-60";

const buttonClass =
  "mt-2.5 flex h-10 w-full cursor-pointer items-center justify-center rounded-xl bg-[#131313] text-sm font-semibold text-white transition-all hover:bg-neutral-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 font-jakarta";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState("contact");
  const [contact, setContact] = useState("");
  const [fields, setFields] = useState(null);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const sendOtp = async (event) => {
    event.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const trimmed = contact.trim();
    if (!trimmed) {
      setErrorMsg("Please enter your email or phone number.");
      return;
    }
    if (isPhoneContact(trimmed) && normalizeIndianMobile(trimmed).length !== 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }

    const payload = contactPayload(trimmed);
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || data?.status === "error") {
        setErrorMsg(apiMessage(data, "Could not send OTP. Please try again."));
        return;
      }
      setFields({ email: payload.email, mobileNumber: payload.mobileNumber });
      setOtp("");
      setStep("otp");
    } catch {
      setErrorMsg("Could not send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (event) => {
    event.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const code = otp.trim();
    if (!/^\d{6}$/.test(code)) {
      setErrorMsg("Please enter the 6-digit verification code.");
      return;
    }
    if (!fields) {
      setStep("contact");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/validating-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signUp: false,
          otp: code,
          ...(fields.email ? { email: fields.email } : { mobileNumber: fields.mobileNumber }),
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || data?.status === "error") {
        setErrorMsg(apiMessage(data, "Invalid or expired OTP. Please try again."));
        return;
      }
      if (!data?.data?.accessToken) {
        setErrorMsg("OTP verified, but no session was returned. Please try again.");
        return;
      }
      persistSession(data, fields);
      setPassword("");
      setConfirmPassword("");
      setStep("password");
    } catch {
      setErrorMsg("Could not verify OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (event) => {
    event.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    const token = localStorage.getItem("pintree_access_token");
    if (!token) {
      setErrorMsg("Your session expired. Please verify the code again.");
      setStep("otp");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || data?.status === "error") {
        setErrorMsg(apiMessage(data, "Could not update your password. Please try again."));
        return;
      }
      setSuccessMsg(apiMessage(data, "Password updated."));
      router.push("/account");
    } catch {
      setErrorMsg("Could not update your password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const heading =
    step === "otp"
      ? "Enter the code"
      : step === "password"
        ? "Set a new password"
        : "Forgot password";

  const subheading =
    step === "otp"
      ? `We sent a code to ${fields?.email || fields?.mobileNumber || "you"}.`
      : step === "password"
        ? "Choose a password with at least 6 characters."
        : "We'll send a code to your email or phone.";

  return (
    <div className="flex flex-col bg-white text-[#131313] font-jakarta">
      <main className="relative z-20 flex min-h-[calc(100dvh-68px)] items-center justify-center px-4 py-2 sm:py-3">
        <div className="mx-auto flex w-full max-w-[520px] flex-col items-center rounded-3xl border border-[#e4e2e1] bg-white px-6 pb-6 pt-6 shadow-[0_8px_30px_-4px_rgba(19,19,19,0.04)] sm:px-8 sm:pb-7 sm:pt-7">
          <div className="w-full max-w-[420px]">
            <h1 className="mb-2 text-center font-aeonik-regular text-[28px] font-normal leading-tight tracking-tight text-[#131313] sm:text-[32px]">
              {heading}
            </h1>
            <p className="mb-4 text-center text-xs text-neutral-500 sm:mb-5">{subheading}</p>

            {errorMsg ? (
              <div className="mb-3 rounded-xl border border-red-200 bg-red-50/70 p-2.5 text-xs font-medium text-red-700">
                {errorMsg}
              </div>
            ) : null}
            {successMsg ? (
              <div className="mb-3 rounded-xl border border-emerald-200 bg-emerald-50/70 p-2.5 text-xs font-medium text-emerald-700">
                {successMsg}
              </div>
            ) : null}

            {step === "contact" ? (
              <form className="space-y-3" onSubmit={sendOtp}>
                <div>
                  <label className="mb-1 block text-left text-xs font-medium text-[#131313]" htmlFor="contact">
                    Email or phone number
                  </label>
                  <input
                    id="contact"
                    className={inputClass}
                    value={contact}
                    onChange={(event) => setContact(event.target.value)}
                    placeholder="Enter your email or phone"
                    type="text"
                    autoComplete="username"
                    disabled={isLoading}
                  />
                </div>
                <button className={buttonClass} type="submit" disabled={isLoading}>
                  {isLoading ? "Sending…" : "Send code"}
                </button>
              </form>
            ) : null}

            {step === "otp" ? (
              <form className="space-y-3" onSubmit={verifyOtp}>
                <div>
                  <label className="mb-1 block text-left text-xs font-medium text-[#131313]" htmlFor="otp">
                    Verification code
                  </label>
                  <input
                    id="otp"
                    className={`${inputClass} text-center tracking-[0.3em]`}
                    value={otp}
                    onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    disabled={isLoading}
                  />
                </div>
                <button className={buttonClass} type="submit" disabled={isLoading}>
                  {isLoading ? "Verifying…" : "Verify code"}
                </button>
                <button
                  type="button"
                  className="w-full text-center text-xs text-neutral-500 hover:text-[#131313]"
                  onClick={() => {
                    setErrorMsg("");
                    setStep("contact");
                  }}
                  disabled={isLoading}
                >
                  Use a different email or phone
                </button>
              </form>
            ) : null}

            {step === "password" ? (
              <form className="space-y-3" onSubmit={updatePassword}>
                <div>
                  <label className="mb-1 block text-left text-xs font-medium text-[#131313]" htmlFor="new-password">
                    New password
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      className={`${inputClass} pr-16`}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="At least 6 characters"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500 hover:text-[#131313]"
                      onClick={() => setShowPassword((current) => !current)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-left text-xs font-medium text-[#131313]" htmlFor="confirm-password">
                    Confirm password
                  </label>
                  <input
                    id="confirm-password"
                    className={inputClass}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Re-enter password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    disabled={isLoading}
                  />
                </div>
                <button className={buttonClass} type="submit" disabled={isLoading}>
                  {isLoading ? "Saving…" : "Update password"}
                </button>
              </form>
            ) : null}

            <p className="mt-3 text-center text-xs text-neutral-500">
              Remembered it?{" "}
              <Link className="font-semibold text-[#131313] hover:underline" href="/login">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
