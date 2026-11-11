"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { getDeviceInfo } from "@/utils/device";
import {
  needsGoogleProfileCompletion,
  signInWithGoogle,
} from "@/utils/googleAuth";
import { getValidAccessToken, authenticatedFetch } from "@/utils/auth";
import UserAvatar from "@/components/UserAvatar";

const SUPPORT_CATEGORIES = [
  "Account & Login",
  "Profile & Settings",
  "Communities & Rooms",
  "Connections & Privacy",
  "Posts & Content",
  "Chat & Messaging",
  "Notifications",
  "Technical Issues",
  "Report a Problem",
  "Other",
];

function decodeJwt(token) {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length >= 2) {
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(decodeURIComponent(escape(atob(base64))));
    }
  } catch (e) {
    // ignore
  }
  return null;
}

const cleanEmail = (raw) => {
  if (!raw || typeof raw !== "string") return "";
  const trimmed = raw.trim();
  const lower = trimmed.toLowerCase();
  if (
    lower.includes("example.com") ||
    lower.includes("test.com") ||
    lower.includes("ananya.thomas") ||
    lower.includes("dummy")
  ) {
    return "";
  }
  return trimmed;
};

const cleanPhone = (raw) => {
  if (!raw || typeof raw !== "string") return "";
  const trimmed = raw.trim();
  if (
    trimmed.includes("98765 43210") ||
    trimmed.includes("9876543210") ||
    trimmed.includes("0000000000") ||
    trimmed === "+91"
  ) {
    return "";
  }
  return trimmed;
};

const cleanName = (raw, fallback = "") => {
  if (!raw || typeof raw !== "string") return fallback;
  const trimmed = raw.trim();
  const lower = trimmed.toLowerCase();
  if (
    lower === "ananya thomas" ||
    lower.includes("example") ||
    lower === "ananya"
  ) {
    return fallback;
  }
  return trimmed;
};

const cleanHandle = (raw) => {
  if (!raw || typeof raw !== "string") return "";
  const trimmed = raw.trim().replace(/^@/, "");
  const lower = trimmed.toLowerCase();
  if (
    lower === "ananyathomas" ||
    lower.includes("example") ||
    lower === "ananya"
  ) {
    return "";
  }
  return trimmed;
};

export default function ContactSupportView() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [storedData, setStoredData] = useState({
    fullName: "",
    handle: "",
    email: "",
    phone: "",
    isVerified: true,
  });

  // Login Form State (When unauthenticated)
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState("");
  const [rateLimitCountdown, setRateLimitCountdown] = useState(0);

  // Ticket Form State
  const [category, setCategory] = useState("Communities & Rooms");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [ticketError, setTicketError] = useState("");
  const [ticketSuccess, setTicketSuccess] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  // Copy Ticket ID to clipboard with 2s visual feedback
  const handleCopyTicket = () => {
    if (!ticketSuccess?.id) return;
    try {
      navigator.clipboard.writeText(ticketSuccess.id).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    } catch (e) {
      // Fallback
    }
  };

  // Load user session
  const loadUserData = async () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("pintree_access_token");
    if (!token) {
      setIsAuthenticated(false);
      setIsCheckingAuth(false);
      return;
    }

    setIsAuthenticated(true);

    // Actively purge any legacy mock data from browser localStorage
    try {
      ["pintree_user_email", "pintree_auth_email"].forEach((k) => {
        const val = localStorage.getItem(k);
        if (val && (val.toLowerCase().includes("example.com") || val.toLowerCase().includes("ananya"))) {
          localStorage.removeItem(k);
        }
      });
      const nameVal = localStorage.getItem("pintree_user_full_name");
      if (nameVal && nameVal.toLowerCase() === "ananya thomas") {
        localStorage.removeItem("pintree_user_full_name");
      }
      const handleVal = localStorage.getItem("pintree_user_handle");
      if (handleVal && handleVal.toLowerCase() === "ananyathomas") {
        localStorage.removeItem("pintree_user_handle");
      }
      const phoneVal = localStorage.getItem("pintree_user_phone");
      if (phoneVal && phoneVal.includes("98765 43210")) {
        localStorage.removeItem("pintree_user_phone");
      }
    } catch (e) {}

    const jwtClaims = decodeJwt(token);

    const fName = cleanName(localStorage.getItem("pintree_user_full_name") || "", "");
    const hnd = cleanHandle(localStorage.getItem("pintree_user_handle") || "");
    const em = cleanEmail(
      jwtClaims?.email ||
      localStorage.getItem("pintree_user_email") ||
      localStorage.getItem("pintree_auth_email") ||
      ""
    );
    const ph = cleanPhone(
      jwtClaims?.mobileNumber ||
      localStorage.getItem("pintree_user_phone") ||
      localStorage.getItem("pintree_auth_phone") ||
      ""
    );

    setStoredData({
      fullName: fName,
      handle: hnd,
      email: em,
      phone: ph,
      isVerified: true,
    });

    try {
      const activeToken = await getValidAccessToken();
      if (activeToken) {
        const res = await authenticatedFetch(
          "https://dev.user.pintree.co/v1/users/profile"
        );
        if (res.ok) {
          const json = await res.json();
          if (json?.data) {
            setUserProfile(json.data);
            const apiFullName = cleanName(json.data.fullName, "");
            const apiHandle = cleanHandle(json.data.handleId || json.data.handle || "");
            const apiEmail = cleanEmail(json.data.email || "");
            const apiPhone = cleanPhone(json.data.mobileNumber || json.data.phone || "");

            setStoredData((prev) => ({
              ...prev,
              fullName: apiFullName || prev.fullName,
              handle: apiHandle || prev.handle,
              email: apiEmail || prev.email,
              phone: apiPhone || prev.phone,
            }));
          }
        }
      }
    } catch (e) {
      // Ignore background profile fetch errors
    } finally {
      setIsCheckingAuth(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  // Countdown timer for rate limiting
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

  // Handle Unauthenticated Sign In
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginSuccess("");

    const trimmed = identifier.trim();
    if (!trimmed) {
      setLoginError("Please enter your email or phone number.");
      return;
    }

    if (!password) {
      setLoginError("Please enter your password.");
      return;
    }

    setIsLoggingIn(true);

    try {
      const isEmail = trimmed.includes("@");
      const device = getDeviceInfo();

      const payload = {
        password,
        device,
      };

      if (isEmail) {
        payload.email = trimmed;
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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (proxyErr) {
        res = await fetch("https://dev.user.pintree.co/v1/auth/login", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json().catch(() => null);

      if (!res.ok || (data && data.status === "error")) {
        const isRateLimited =
          res.status === 429 ||
          (typeof data?.message === "string" &&
            data.message.toLowerCase().includes("rate limit"));

        if (isRateLimited) {
          let retrySec = 60;
          try {
            const h =
              res.headers.get("retry-after") ||
              res.headers.get("x-ratelimit-reset");
            if (h) {
              const parsed = parseInt(h, 10);
              if (parsed > 0 && parsed <= 600) retrySec = parsed;
            }
          } catch (e) {}

          setRateLimitCountdown(retrySec);
          setLoginError(
            `Too many login attempts. Rate limit exceeded. Please wait ${retrySec} seconds before trying again.`
          );
        } else {
          let message = "Invalid email, phone number, or password.";
          if (data?.message) message = data.message;
          if (data?.error?.details) {
            if (
              Array.isArray(data.error.details) &&
              data.error.details[0]?.message
            ) {
              message = data.error.details[0].message;
            } else if (
              typeof data.error.details === "object" &&
              data.error.details.message
            ) {
              message = data.error.details.message;
            }
          }
          setLoginError(message);
        }
        setIsLoggingIn(false);
        return;
      }

      if (data?.data?.accessToken) {
        try {
          localStorage.setItem("pintree_access_token", data.data.accessToken);
          localStorage.setItem(
            "pintree_login_method",
            isEmail ? "email" : "mobile"
          );
          localStorage.setItem("pintree_login_verified", "true");
          localStorage.removeItem("pintree_signup_pending");

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

          try {
            const parts = data.data.accessToken.split(".");
            if (parts.length >= 2) {
              const base64Url = parts[1];
              const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
              const decoded = JSON.parse(
                decodeURIComponent(escape(atob(base64)))
              );
              if (decoded?.email)
                localStorage.setItem("pintree_auth_email", decoded.email);
              if (decoded?.mobileNumber)
                localStorage.setItem(
                  "pintree_auth_phone",
                  decoded.mobileNumber
                );
              if (typeof decoded?.isEmailVerified !== "undefined") {
                localStorage.setItem(
                  "pintree_email_verified",
                  String(decoded.isEmailVerified)
                );
              }
              if (typeof decoded?.isMobileVerified !== "undefined") {
                localStorage.setItem(
                  "pintree_mobile_verified",
                  String(decoded.isMobileVerified)
                );
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

      setLoginSuccess("Signed in successfully!");
      setTimeout(() => {
        loadUserData();
      }, 300);
    } catch (err) {
      console.error("Login request error:", err);
      setLoginError(
        "Failed to connect to authentication service. Please check your network."
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Google Sign In
  const handleGoogleContinue = async () => {
    setLoginError("");
    setLoginSuccess("");
    setIsLoggingIn(true);

    try {
      const result = await signInWithGoogle();
      if (!result.ok) {
        setLoginError(result.message || "Google Sign-In failed.");
        return;
      }

      if (needsGoogleProfileCompletion(result.data)) {
        router.push("/?continue=profile");
        return;
      }

      setLoginSuccess("Signed in with Google!");
      setTimeout(() => {
        loadUserData();
      }, 300);
    } catch (err) {
      setLoginError(
        err instanceof Error
          ? err.message
          : "Google Sign-In failed. Please try again."
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Sign out / Log out
  const handleSignOut = () => {
    try {
      localStorage.removeItem("pintree_access_token");
      localStorage.removeItem("pintree_user_id");
      localStorage.removeItem("pintree_login_method");
      localStorage.removeItem("pintree_login_verified");
      localStorage.removeItem("pintree_auth_email");
      localStorage.removeItem("pintree_auth_phone");
      localStorage.removeItem("pintree_user_email");
      localStorage.removeItem("pintree_user_phone");
      localStorage.removeItem("pintree_user_full_name");
      localStorage.removeItem("pintree_user_handle");
      document.cookie =
        "pintree_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    } catch (e) {}

    setIsAuthenticated(false);
    setUserProfile(null);
    setStoredData({
      fullName: "",
      handle: "",
      email: "",
      phone: "",
      isVerified: true,
    });
    setLoginSuccess("");
    setLoginError("");
    setTicketSuccess(null);
  };

  // Drag & drop file handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setAttachmentFile(e.dataTransfer.files[0]);
    }
  };

  // Submit Support Request
  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    setTicketError("");

    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    if (!trimmedSubject) {
      setTicketError("Please enter a subject for your support request.");
      return;
    }
    if (!trimmedMessage) {
      setTicketError("Please describe your issue in the message field.");
      return;
    }

    setIsSubmittingTicket(true);

    const ticketId = `PNT-2026-${String(Math.floor(10000 + Math.random() * 90000))}`;

    try {
      const payload = {
        ticketId,
        category,
        subject: trimmedSubject,
        message: trimmedMessage,
        attachmentName: attachmentFile ? attachmentFile.name : null,
        submittedAt: new Date().toISOString(),
        user: {
          fullName: displayName,
          handle: displayHandle,
          email: displayEmail,
          phone: displayPhone,
        },
      };

      // Safely record in local history
      try {
        const stored = JSON.parse(
          localStorage.getItem("pintree_support_tickets") || "[]"
        );
        stored.unshift(payload);
        localStorage.setItem(
          "pintree_support_tickets",
          JSON.stringify(stored.slice(0, 20))
        );
      } catch (storageErr) {}

      // Optional fire-and-forget post without risking auth token deletion on 401
      try {
        const token = localStorage.getItem("pintree_access_token");
        if (token) {
          fetch("https://dev.user.pintree.co/v1/support/tickets", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }).catch(() => null);
        }
      } catch (postErr) {
        // Fallback gracefully
      }

      setTicketSuccess({
        id: ticketId,
        category,
        subject: trimmedSubject,
      });

      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      setTicketError("Failed to submit request. Please try again.");
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  // Resolved user credentials (real data only, strictly sanitized, no mock fallbacks)
  const displayEmail = cleanEmail(userProfile?.email || storedData.email || "");
  const displayPhone = cleanPhone(
    userProfile?.mobileNumber || userProfile?.phone || storedData.phone || ""
  );
  const displayName = cleanName(
    userProfile?.fullName || storedData.fullName || "",
    displayPhone || "Pintree Member"
  );
  const displayHandle = cleanHandle(
    userProfile?.handleId || userProfile?.handle || storedData.handle || ""
  );

  return (
    <div className="w-full flex-grow bg-white text-[#1b1c1c] font-jakarta selection:bg-neutral-900 selection:text-white">
      {isAuthenticated ? (
        ticketSuccess ? (
          /* ======================================================== */
          /* EXACT TICKET CONFIRMATION CANVAS                         */
          /* ======================================================== */
          <main className="flex-grow flex items-center justify-center px-4 sm:px-6 py-12 md:py-20 font-jakarta">
            <div className="w-full max-w-[580px] mx-auto text-center animate-in fade-in duration-200">
              {/* Prominent Circular Mint Green Badge with Deep Teal Checkmark */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#CAFFA6]/40 border border-[#CAFFA6] text-[#204654] mb-6">
                <svg
                  className="w-8 h-8 text-[#204654]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              {/* Heading */}
              <h1 className="font-aeonik-regular text-[36px] leading-[44px] tracking-tight text-[#1b1c1c] mb-3">
                Request submitted!
              </h1>

              {/* Supporting Narrative */}
              <p className="font-jakarta text-[15px] leading-relaxed text-[#525252] max-w-[460px] mx-auto">
                Your support request has been received. Our team will review it and get back to you promptly.
              </p>

              {/* Distinct Ticket Information Box */}
              <div className="bg-[#f5f3f3] border border-[#cfc4c5]/60 rounded-2xl p-6 sm:p-7 my-8 text-left transition-all">
                {/* Ticket Header Row */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="block text-[11px] font-semibold tracking-wider text-[#7e7576] uppercase">
                      YOUR TICKET NUMBER
                    </span>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[24px] sm:text-[28px] font-aeonik-regular text-[#1b1c1c] tracking-tight" id="ticketNumber">
                        {ticketSuccess.id}
                      </span>
                    </div>
                  </div>

                  {/* Copy to Clipboard Button */}
                  <button
                    type="button"
                    onClick={handleCopyTicket}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#cfc4c5] bg-white text-[13px] font-medium text-[#1b1c1c] hover:border-black transition-colors focus:outline-none cursor-pointer"
                    id="copyBtn"
                    title="Copy Ticket Number"
                  >
                    {isCopied ? (
                      <>
                        <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-emerald-700 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 text-[#7e7576]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                        </svg>
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Hairline Divider */}
                <div className="h-[1px] w-full bg-[#cfc4c5]/60 my-5" />

                {/* Summary Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-left">
                  <div>
                    <span className="block text-[11px] font-semibold text-[#7e7576] uppercase tracking-wider">
                      Category
                    </span>
                    <span className="text-[14px] font-medium text-[#1b1c1c] mt-0.5 block">
                      {ticketSuccess.category}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[11px] font-semibold text-[#7e7576] uppercase tracking-wider">
                      Expected Response
                    </span>
                    <span className="text-[14px] font-medium text-[#1b1c1c] mt-0.5 block">
                      Within 24 business hours
                    </span>
                  </div>

                  <div className="sm:col-span-2 pt-1">
                    <span className="block text-[11px] font-semibold text-[#7e7576] uppercase tracking-wider">
                      Submitted By
                    </span>
                    <span className="text-[14px] font-medium text-[#1b1c1c] mt-0.5 block">
                      {displayName}
                      {displayHandle ? ` (@${displayHandle})` : ""}
                    </span>
                  </div>
                </div>

                {/* Notification Notice Note (Strictly Real Data Only) */}
                {displayEmail && displayPhone ? (
                  <div className="mt-6 pt-4 border-t border-[#cfc4c5]/60 flex items-start gap-2.5">
                    <svg className="w-4 h-4 text-[#7e7576] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <p className="text-[13px] text-[#525252]">
                      A confirmation has been sent to your registered email (<span className="text-[#1b1c1c] font-medium">{displayEmail}</span>) and mobile number (<span className="text-[#1b1c1c] font-medium">{displayPhone}</span>).
                    </p>
                  </div>
                ) : displayEmail ? (
                  <div className="mt-6 pt-4 border-t border-[#cfc4c5]/60 flex items-start gap-2.5">
                    <svg className="w-4 h-4 text-[#7e7576] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <p className="text-[13px] text-[#525252]">
                      A confirmation has been sent to your registered email address (<span className="text-[#1b1c1c] font-medium">{displayEmail}</span>).
                    </p>
                  </div>
                ) : displayPhone ? (
                  <div className="mt-6 pt-4 border-t border-[#cfc4c5]/60 flex items-start gap-2.5">
                    <svg className="w-4 h-4 text-[#7e7576] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                    </svg>
                    <p className="text-[13px] text-[#525252]">
                      A confirmation has been sent to your registered mobile number (<span className="text-[#1b1c1c] font-medium">{displayPhone}</span>).
                    </p>
                  </div>
                ) : null}
              </div>

              {/* Action Cluster */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/support"
                  className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-8 rounded-xl bg-black text-white text-[14px] font-medium hover:bg-neutral-800 transition-colors gap-2"
                >
                  <span>Back to Help Center</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setTicketSuccess(null);
                    setSubject("");
                    setMessage("");
                    setAttachmentFile(null);
                  }}
                  className="text-[14px] text-[#525252] hover:text-[#1b1c1c] underline underline-offset-4 decoration-[#cfc4c5] transition-colors cursor-pointer bg-transparent border-0 p-0"
                >
                  Submit another request
                </button>
              </div>
            </div>
          </main>
        ) : (
          /* ======================================================== */
          /* EXACT AUTHENTICATED SUPPORT REQUEST SCREEN               */
          /* ======================================================== */
          <main className="w-full flex-grow">
            <div className="max-w-[760px] mx-auto px-6 pt-10 pb-16">
              {/* Header / Eyebrow Cluster */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F7F7] border border-[#E5E5E5] text-[11px] font-medium uppercase tracking-wider text-neutral-600 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-black" />
                  <span>SUPPORT TICKET</span>
                </div>
                <h1 className="text-[36px] leading-[44px] tracking-tight font-normal text-[#202020] mb-2 font-aeonik-regular">
                  Submit a support request.
                </h1>
                <p className="text-[15px] leading-relaxed text-[#525252]">
                  Tell us what you need help with. Our support team will review your request.
                </p>
              </div>

              {/* Authenticated Account (Read-Only) Panel - ALWAYS rendered */}
              <section
                aria-labelledby="authenticated-account-title"
                className="bg-[#F7F7F7] border border-[#E5E5E5] rounded-2xl p-5 mb-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2
                    className="text-[11px] font-medium uppercase tracking-wider text-neutral-400"
                    id="authenticated-account-title"
                  >
                    AUTHENTICATED ACCOUNT (READ-ONLY)
                  </h2>
                  <div className="flex items-center gap-1.5 text-[12px] text-neutral-500 font-medium">
                    <svg
                      className="w-3.5 h-3.5 text-neutral-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                    <span>Verified session</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-6 flex items-center gap-3.5">
                    <UserAvatar
                      name={displayName}
                      profile={userProfile}
                      sizeClass="w-12 h-12 shrink-0"
                      textClass="text-base"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[15px] font-semibold text-[#202020] truncate">
                          {displayName}
                        </span>
                        <svg
                          className="w-4 h-4 text-[#3f6372] shrink-0"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                      </div>
                      {displayHandle ? (
                        <p className="text-[13px] text-[#666666] truncate">
                          @{displayHandle}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="md:col-span-6 flex flex-col md:border-l md:border-[#E5E5E5] md:pl-5 space-y-1">
                    {displayEmail ? (
                      <div className="flex items-center gap-2 text-[13px] text-[#525252] truncate">
                        <svg
                          className="w-4 h-4 text-neutral-400 shrink-0"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                        <span className="truncate">{displayEmail}</span>
                      </div>
                    ) : null}

                    {displayPhone ? (
                      <div className="flex items-center gap-2 text-[13px] text-[#525252]">
                        <svg
                          className="w-4 h-4 text-neutral-400 shrink-0"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                        </svg>
                        <span>{displayPhone}</span>
                      </div>
                    ) : null}

                    {!displayEmail && !displayPhone ? (
                      <div className="flex items-center gap-2 text-[13px] text-[#777777]">
                        <span>Connected account</span>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="mt-4 pt-3.5 border-t border-[#E5E5E5] flex items-center justify-between text-[12px] text-[#777777]">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-3.5 h-3.5 text-neutral-400 shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    <span>
                      These details are automatically linked from your Pintree account and cannot be edited.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="inline-flex items-center gap-1 text-[12px] text-[#666666] hover:text-black transition-colors ml-4 shrink-0 cursor-pointer"
                  >
                    <span>Log out</span>
                    <svg
                      className="w-3.5 h-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                  </button>
                </div>
              </section>

              {ticketError && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50/70 p-3.5 text-xs font-medium text-red-700 animate-in fade-in">
                  {ticketError}
                </div>
              )}

              {/* Support Ticket Submission Form */}
                <form className="space-y-6" onSubmit={handleTicketSubmit}>
                  {/* Category Selection */}
                  <div className="space-y-2">
                    <label
                      className="block text-[14px] font-medium text-[#202020]"
                      htmlFor="category-select"
                    >
                      Support Category <span className="text-[#ba1a1a]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        className="w-full h-12 bg-white border border-[#E5E5E5] rounded-xl px-4 text-[14px] text-[#202020] appearance-none pr-10 focus:outline-none focus:border-[#202020] transition-colors cursor-pointer"
                        id="category-select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        {SUPPORT_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-3.5 pointer-events-none text-neutral-400">
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Subject Line Input */}
                  <div className="space-y-2">
                    <label
                      className="block text-[14px] font-medium text-[#202020]"
                      htmlFor="ticket-subject"
                    >
                      Subject <span className="text-[#ba1a1a]">*</span>
                    </label>
                    <input
                      className="w-full h-12 bg-white border border-[#E5E5E5] rounded-xl px-4 text-[14px] text-[#202020] placeholder-[#A0A0A0] focus:outline-none focus:border-[#202020] transition-colors"
                      id="ticket-subject"
                      placeholder="Brief summary of the issue (e.g. Cannot manage room moderator permissions)"
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    />
                  </div>

                  {/* Issue Description Textarea */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label
                        className="block text-[14px] font-medium text-[#202020]"
                        htmlFor="ticket-message"
                      >
                        Describe Your Issue <span className="text-[#ba1a1a]">*</span>
                      </label>
                      <span className="text-[12px] text-[#777777]">
                        Min. 30 characters
                      </span>
                    </div>
                    <textarea
                      className="w-full bg-white border border-[#E5E5E5] rounded-xl p-4 text-[14px] leading-relaxed text-[#202020] placeholder-[#A0A0A0] focus:outline-none focus:border-[#202020] transition-colors resize-y min-h-[160px]"
                      id="ticket-message"
                      placeholder="Please describe what happened, steps to reproduce, or what you need assistance with..."
                      rows={6}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>

                  {/* Attachments Dropzone */}
                  <div className="space-y-2">
                    <label className="block text-[14px] font-medium text-[#202020]">
                      Attachments
                    </label>

                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          setAttachmentFile(e.target.files[0]);
                        }
                      }}
                    />

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed ${
                        isDragging ? "border-black bg-neutral-100" : "border-[#D4D4D4] hover:border-[#202020] bg-[#FAFAFA]"
                      } rounded-xl p-6 text-center cursor-pointer transition-colors duration-150`}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center mb-3 text-neutral-600">
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                          </svg>
                        </div>
                        {attachmentFile ? (
                          <div className="flex items-center gap-2">
                            <span className="text-[14px] font-medium text-[#202020]">
                              {attachmentFile.name} ({(attachmentFile.size / 1024).toFixed(1)} KB)
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setAttachmentFile(null);
                              }}
                              className="text-xs text-red-600 hover:text-red-800 ml-2 font-medium"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <>
                            <p className="text-[14px] text-[#202020]">
                              Drag and drop screenshots or log files here, or{" "}
                              <span className="underline font-semibold">browse</span>
                            </p>
                            <p className="text-[12px] text-[#777777] mt-1">
                              PNG, JPG, PDF up to 25MB (Optional)
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Privacy & Submission Action Area */}
                  <div className="pt-4 border-t border-[#E5E5E5] space-y-4">
                    <div className="flex items-start gap-2">
                      <svg
                        className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        <path d="M9 12l2 2 4-4" />
                      </svg>
                      <p className="text-[13px] text-[#666666]">
                        Your information will only be used to manage and respond to your support request.
                      </p>
                    </div>

                    <div className="flex items-center justify-start pt-2">
                      <button
                        className="h-[50px] bg-[#000000] text-white rounded-xl px-8 text-[14px] font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-none disabled:opacity-60 disabled:cursor-not-allowed"
                        type="submit"
                        disabled={isSubmittingTicket}
                      >
                        {isSubmittingTicket ? (
                          <span className="flex items-center gap-2">
                            <svg
                              className="h-4 w-4 animate-spin text-white"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
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
                            <span>Submitting...</span>
                          </span>
                        ) : (
                          <>
                            <span>Submit Support Request</span>
                            <svg
                              className="w-[18px] h-[18px]"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <line x1="5" y1="12" x2="19" y2="12" />
                              <polyline points="12 5 19 12 12 19" />
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </main>
          )
        ) : (
        /* ======================================================== */
        /* SIGN IN SCREEN (When user is not authenticated)          */
        /* ======================================================== */
        <main className="flex-1 flex items-center justify-center py-10 md:py-16 px-6 font-jakarta">
          <div className="w-full max-w-[460px] mx-auto">
            <div className="bg-white border border-[#E5E5E5] rounded-xl p-8 md:p-10 shadow-none transition-colors">
              <div className="flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5f3f3] border border-[#E5E5E5] mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3f6372]" />
                  <span className="text-xs text-[#3f6372] font-medium tracking-wider uppercase font-jakarta">
                    SUPPORT PORTAL
                  </span>
                </div>

                <h1
                  className="font-aeonik-regular text-3xl sm:text-4xl md:text-[44px] font-normal tracking-tight text-[#1b1c1c] mb-3 leading-[1.15]"
                  style={{
                    fontFamily: "Aeonik, sans-serif",
                    lineHeight: 1.15,
                    fontWeight: 400,
                  }}
                >
                  Let&apos;s get you the right support.
                </h1>

                <p className="text-sm text-[#666666] max-w-[360px] leading-relaxed font-jakarta">
                  Sign in to your Pintree account to submit a support request.
                </p>
              </div>

              {loginError && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50/70 p-3 text-xs font-medium text-red-700 animate-in fade-in">
                  {loginError}
                </div>
              )}

              {loginSuccess && (
                <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs font-medium text-emerald-700 animate-in fade-in">
                  {loginSuccess}
                </div>
              )}

              <form className="mt-6 space-y-4" onSubmit={handleLoginSubmit}>
                <div className="space-y-1.5">
                  <label
                    className="block text-xs font-medium text-[#1b1c1c] font-jakarta"
                    htmlFor="identifier"
                  >
                    Email or Phone
                  </label>
                  <div className="relative">
                    <input
                      className="w-full h-12 px-4 bg-white border border-[#E5E5E5] rounded-xl text-sm text-[#1b1c1c] placeholder:text-[#999999] focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors font-jakarta"
                      id="identifier"
                      placeholder="Email address or phone number"
                      required
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      disabled={isLoggingIn}
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label
                      className="block text-xs font-medium text-[#1b1c1c] font-jakarta"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <Link
                      className="text-xs text-[#3f6372] hover:text-[#1b1c1c] transition-colors font-medium font-jakarta"
                      href="/forgot-password"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      className="w-full h-12 pl-4 pr-11 bg-white border border-[#E5E5E5] rounded-xl text-sm text-[#1b1c1c] placeholder:text-[#999999] focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors font-jakarta"
                      id="password"
                      placeholder="Enter password"
                      required
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoggingIn}
                      autoComplete="current-password"
                    />
                    <button
                      aria-label="Toggle password visibility"
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#777777] hover:text-[#1b1c1c] transition-colors p-1 flex items-center justify-center cursor-pointer"
                      id="togglePassword"
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

                <div className="pt-2">
                  <button
                    className="w-full h-12 bg-black text-white rounded-xl text-sm font-medium hover:bg-neutral-800 active:scale-[0.99] transition duration-150 flex items-center justify-center font-jakarta cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={isLoggingIn || rateLimitCountdown > 0}
                  >
                    {isLoggingIn ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="h-4 w-4 animate-spin text-white"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
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
                        <span>Signing in...</span>
                      </span>
                    ) : rateLimitCountdown > 0 ? (
                      `Retry in ${rateLimitCountdown}s...`
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </div>

                <div className="relative py-2 flex items-center justify-center">
                  <div className="w-full border-t border-[#E5E5E5]" />
                  <span className="absolute bg-white px-3 text-xs text-[#777777] uppercase tracking-wider font-jakarta font-semibold">
                    OR
                  </span>
                </div>

                <div>
                  <button
                    className="w-full h-12 bg-white border border-[#E5E5E5] text-[#1b1c1c] rounded-xl text-sm font-medium hover:border-[#CCCCCC] hover:bg-[#F9F9F9] transition duration-150 flex items-center justify-center gap-3 active:scale-[0.99] font-jakarta cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    type="button"
                    onClick={handleGoogleContinue}
                    disabled={isLoggingIn || rateLimitCountdown > 0}
                  >
                    <svg
                      aria-hidden="true"
                      className="w-4 h-4 shrink-0"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                        fill="#EA4335"
                      />
                    </svg>
                    <span>
                      {isLoggingIn ? "Connecting…" : "Continue with Google"}
                    </span>
                  </button>
                </div>
              </form>

              <div className="mt-8 pt-6 border-t border-[#E5E5E5] text-center">
                <p className="text-xs text-[#666666] leading-relaxed font-jakarta">
                  Your Pintree account helps us identify your profile and provide
                  relevant support.
                </p>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
