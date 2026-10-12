"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getValidAccessToken, authenticatedFetch, clearAuthSession } from "@/utils/auth";

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

export default function DeleteAccountPage() {
  const router = useRouter();

  // Authentication & Profile State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loginMethod, setLoginMethod] = useState("email");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form & Interactive State
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isIdentityVerified, setIsIdentityVerified] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [rateLimitCountdown, setRateLimitCountdown] = useState(0);
  const [acknowledged, setAcknowledged] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deletionScheduled, setDeletionScheduled] = useState(false);

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

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("pintree_access_token");
    const storedMethod = localStorage.getItem("pintree_login_method");
    const storedEmail = localStorage.getItem("pintree_user_email") || "";
    const storedPhone = localStorage.getItem("pintree_user_phone") || "";
    const storedAuthEmail = localStorage.getItem("pintree_auth_email") || "";
    const storedAuthPhone = localStorage.getItem("pintree_auth_phone") || "";
    const storedVerified = localStorage.getItem("pintree_login_verified") === "true";

    const jwt = decodeJwt(token);
    const resolvedEmail = jwt?.email || storedEmail || storedAuthEmail || "";
    const resolvedPhone = jwt?.mobileNumber || storedPhone || storedAuthPhone || "";
    const resolvedMethod = storedMethod || (resolvedEmail ? "email" : "mobile");

    setIsAuthenticated(Boolean(token));
    setLoginMethod(resolvedMethod);
    setUserEmail(resolvedEmail);
    setUserPhone(resolvedPhone);
    setIsVerified(storedVerified);

    if (token) {
      authenticatedFetch("https://dev.user.pintree.co/v1/users/profile")
        .then((r) => r.json())
        .then((d) => {
          if (d?.data) {
            setProfile(d.data);
            if (d.data.email) setUserEmail(d.data.email);
            if (d.data.mobileNumber || d.data.phoneNumber) {
              setUserPhone(d.data.mobileNumber || d.data.phoneNumber);
            }
          }
        })
        .catch((err) => console.warn("Profile fetch error:", err))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  // If user is not logged in and deletion hasn't occurred, redirect them safely to the public informational delete account page
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !deletionScheduled) {
      router.replace("/delete-account");
    }
  }, [isLoading, isAuthenticated, deletionScheduled, router]);

  const handleVerifyPassword = async (e) => {
    e?.preventDefault();
    setVerifyError("");

    if (!password) {
      setVerifyError("Please enter your account password.");
      return;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("pintree_access_token") : null;
    if (!token) {
      setVerifyError("Authentication session expired. Please log in again.");
      return;
    }

    if (isVerifying || rateLimitCountdown > 0) return;
    setIsVerifying(true);

    try {
      const res = await authenticatedFetch("https://dev.user.pintree.co/v1/auth/verify-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.data?.verified) {
        setIsIdentityVerified(true);
        setVerifyError("");
      } else {
        const isRateLimited =
          res.status === 429 ||
          (typeof data?.message === "string" && data.message.toLowerCase().includes("rate limit"));

        if (isRateLimited) {
          // Read reset/retry duration if available, fallback to 60 seconds
          let retrySec = 60;
          try {
            const h = res.headers.get("retry-after") || res.headers.get("x-ratelimit-reset");
            if (h) {
              const parsed = parseInt(h, 10);
              if (parsed > 0 && parsed <= 600) retrySec = parsed;
            }
          } catch (e) {}

          setRateLimitCountdown(retrySec);
          setVerifyError(
            `Too many password verification attempts. Rate limit exceeded (dev environment allows 5 attempts per window). Please wait ${retrySec} seconds before trying again.`
          );
        } else {
          let msg = data?.message || "Password is incorrect. Please try again.";
          if (data?.error?.details?.message) {
            msg = data.error.details.message;
          } else if (Array.isArray(data?.error?.details) && data.error.details[0]?.message) {
            msg = data.error.details[0].message;
          }
          setVerifyError(msg);
        }
      }
    } catch (err) {
      console.error("verify-password request error:", err);
      setVerifyError("Failed to connect to authentication service. Please check your network.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleExecuteDelete = async () => {
    if (!acknowledged || !isIdentityVerified || isDeleting) return;

    setDeleteError("");
    setIsDeleting(true);

    try {
      const res = await authenticatedFetch("https://dev.user.pintree.co/v1/auth/account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const data = await res.json().catch(() => null);

      if (res.ok || (data && (data.status === "success" || data.code === 200))) {
        // Clear authentication credentials & session completely
        clearAuthSession();

        // Show the deleted successfully message card with button to login page
        setDeletionScheduled(true);
        return;
      } else {
        let msg = data?.message || "Failed to process account deletion request. Please try again.";
        if (data?.error?.details?.message) {
          msg = data.error.details.message;
        } else if (Array.isArray(data?.error?.details) && data.error.details[0]?.message) {
          msg = data.error.details[0].message;
        }
        setDeleteError(msg);
      }
    } catch (err) {
      console.error("Account deletion request error:", err);
      setDeleteError("Network error. Unable to connect to account deletion service.");
    } finally {
      setIsDeleting(false);
    }
  };

  const fullName = profile?.fullName || "Amara Vance";
  const username = profile?.handleId
    ? `@${String(profile.handleId).trim().replace(/^@+/, "")}`
    : profile?.fullName
    ? `@${String(profile.fullName).toLowerCase().replace(/\s+/g, "").replace(/^@+/, "")}`
    : "@amaravance";

  const registeredLoginDisplay =
    loginMethod === "mobile"
      ? userPhone || "+91 ••••• •••••"
      : userEmail || "a***e@example.com";

  const avatarUrl =
    profile?.profileImageUrl ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80";

  // =========================================================================
  // If loading or unauthenticated (and deletion hasn't just succeeded), show clean transition
  if (isLoading || (!isAuthenticated && !deletionScheduled)) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-white text-[#666666] text-sm">
        <span className="flex items-center gap-2">
          <svg className="h-4 w-4 animate-spin text-[#131313]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading...</span>
        </span>
      </div>
    );
  }

  // =========================================================================
  // ACCOUNT DELETED SUCCESSFULLY - MESSAGE CARD & BUTTON TO LOGIN
  // =========================================================================
  if (deletionScheduled) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#fcf9f8] text-[#1b1c1c] font-jakarta antialiased flex flex-col justify-center items-center px-4 py-12 selection:bg-[#baee97] selection:text-[#1b1c1c]">
        <div className="w-full max-w-[540px] bg-white border border-[#e4e2e1] rounded-2xl p-8 sm:p-10 text-center shadow-[0_12px_40px_-6px_rgba(19,19,19,0.06)] animate-in fade-in zoom-in-95 duration-200">
          {/* Success Check Icon Badge */}
          <div className="w-16 h-16 rounded-full bg-[#EBF9E5] border border-[#CAFFA6] text-[#225712] flex items-center justify-center mx-auto mb-6 shadow-sm">
            <svg className="w-8 h-8 text-[#225712]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="font-playfair text-[28px] sm:text-[32px] font-medium text-[#1b1c1c] leading-tight mb-3">
            Account Deleted Successfully
          </h2>

          <p className="text-[15px] leading-relaxed text-[#444748] mb-8 max-w-[420px] mx-auto">
            Your Pintree account and all associated profile records have been permanently deleted. We&apos;re sorry to see you go!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/login?deleted=true"
              className="w-full sm:w-auto min-w-[200px] inline-flex items-center justify-center h-12 px-8 rounded-full bg-[#131313] text-white text-[14px] font-semibold tracking-wide hover:bg-neutral-800 transition-all shadow-sm active:scale-[0.98]"
            >
              Go to Login Page
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-6 rounded-full bg-[#f6f3f2] text-[#444748] hover:text-[#1b1c1c] hover:bg-[#eae7e6] text-[14px] font-medium transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // AUTHENTICATED USER DELETE ACCOUNT FLOW
  // =========================================================================
  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#fcf9f8] text-[#1b1c1c] font-jakarta antialiased flex flex-col justify-between selection:bg-[#baee97] selection:text-[#1b1c1c]">
      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="max-w-[720px] mx-auto flex flex-col space-y-7">
          {/* Back Navigation & Page Title */}
          <section className="space-y-3">
            <Link
              href="/account"
              className="inline-flex items-center gap-1.5 text-[#444748] hover:text-[#1b1c1c] text-[13px] font-semibold transition-colors group"
            >
              <svg
                className="w-4 h-4 text-[#747878] group-hover:-translate-x-0.5 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to your account</span>
            </Link>

            <div className="space-y-1.5">
              <h1 className="font-playfair text-[32px] md:text-[40px] text-[#1b1c1c] tracking-tight font-normal leading-[1.2]">
                Delete your Pintree account
              </h1>
              <p className="text-[15px] leading-[22px] text-[#444748]">
                We&apos;re sorry to see you go. Review what happens when you delete your account before continuing.
              </p>
            </div>
          </section>

          {/* Account Identification Card */}
          <div className="bg-white border border-[#e4e2e1] rounded-xl p-5 md:p-6 flex items-center justify-between shadow-[0_8px_30px_-4px_rgba(19,19,19,0.03)]">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border border-[#e4e2e1] flex-shrink-0 bg-[#f6f3f2]">
                <img className="w-full h-full object-cover" src={avatarUrl} alt={fullName} />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-bold text-[#1b1c1c] capitalize">{fullName}</span>
                  {isVerified && (
                    <span className="inline-flex items-center gap-1 bg-[#204654] text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-[13px] text-[#747878] font-medium">{username}</p>
                <p className="text-[13px] text-[#444748]">{registeredLoginDisplay}</p>
              </div>
            </div>
            <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-[#f0eded] text-[#747878] text-[11px] font-bold uppercase tracking-wider">
              Active Session
            </span>
          </div>

          {/* Section 1: What happens when you delete your account? */}
          <section className="bg-white border border-[#e4e2e1] rounded-xl p-6 md:p-8 space-y-6 shadow-[0_8px_30px_-4px_rgba(19,19,19,0.03)]">
            <div className="flex items-center gap-2.5">
              <svg className="w-5 h-5 text-[#747878]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="font-playfair text-[22px] md:text-[24px] text-[#1b1c1c] font-medium">
                What happens when you delete your account?
              </h2>
            </div>

            <ul className="space-y-4 divide-y divide-[#f0eded]">
              {/* Profile and account */}
              <li className="pt-3 first:pt-0 flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-[#f6f3f2] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-[#444748]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM16 11h6" />
                  </svg>
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-[14px] font-bold text-[#1b1c1c]">Your profile and account</h3>
                  <p className="text-[13px] text-[#444748] leading-relaxed">
                    Your Pintree profile and associated account information will be deleted according to our account-deletion policy.
                  </p>
                </div>
              </li>

              {/* Content */}
              <li className="pt-4 flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-[#f6f3f2] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-[#444748]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-[14px] font-bold text-[#1b1c1c]">Your content</h3>
                  <p className="text-[13px] text-[#444748] leading-relaxed">
                    Your posts, photos, and other content associated with your account will be deleted where applicable, excluding shared room contributions retained in public community archives.
                  </p>
                </div>
              </li>

              {/* Connections */}
              <li className="pt-4 flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-[#f6f3f2] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-[#444748]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-[14px] font-bold text-[#1b1c1c]">Your connections</h3>
                  <p className="text-[13px] text-[#444748] leading-relaxed">
                    Your friendships, follows, and community memberships associated with your account will be removed as applicable.
                  </p>
                </div>
              </li>

              {/* Access */}
              <li className="pt-4 flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-[#f6f3f2] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-[#444748]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-[14px] font-bold text-[#1b1c1c]">Your access</h3>
                  <p className="text-[13px] text-[#444748] leading-relaxed">
                    You will no longer be able to sign in to or use this Pintree account once deletion is completed.
                  </p>
                </div>
              </li>

              {/* Limited data retention */}
              <li className="pt-4 flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-[#f6f3f2] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-[#747878]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-[14px] font-bold text-[#1b1c1c]">Limited data retention</h3>
                  <p className="text-[13px] text-[#444748] leading-relaxed">
                    Certain information may be retained for a limited period where required by law, security auditing, or permitted under our Privacy Policy.
                  </p>
                </div>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                href="/privacy-policy"
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1b1c1c] hover:underline"
              >
                <span>Read our Privacy Policy</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </section>

          {/* Section 2: Verify your identity */}
          <section className="bg-white border border-[#e4e2e1] rounded-xl p-6 md:p-8 space-y-5 shadow-[0_8px_30px_-4px_rgba(19,19,19,0.03)]">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#747878]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h2 className="font-playfair text-[22px] md:text-[24px] text-[#1b1c1c] font-medium">
                  Verify your identity
                </h2>
              </div>
              <p className="text-[13px] text-[#444748] mt-1.5">
                For your security, we need to verify that you own this account before we can process your deletion request.
              </p>
            </div>

            <form onSubmit={handleVerifyPassword} className="space-y-4 pt-1">
              {/* Registered Login Display */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-[#1b1c1c] block">Registered login</label>
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-[#e4e2e1] bg-[#f6f3f2] text-[#1b1c1c]">
                  {loginMethod === "mobile" ? (
                    <svg className="w-5 h-5 text-[#747878]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-[#747878]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )}
                  <span className="text-[14px] font-medium text-[#1b1c1c]">{registeredLoginDisplay}</span>
                  <svg className="w-4.5 h-4.5 text-[#747878] ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-[#1b1c1c] block" htmlFor="account-password">
                  Password
                </label>
                <div className="relative flex items-center">
                  <input
                    id="account-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your account password"
                    disabled={isIdentityVerified}
                    className="w-full h-11 pl-4 pr-11 rounded-xl border border-[#e4e2e1] bg-white text-[#1b1c1c] placeholder:text-[#747878] text-[14px] focus:border-[#1b1c1c] focus:outline-none transition-colors disabled:bg-[#f6f3f2]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 text-[#747878] hover:text-[#1b1c1c] transition-colors p-1 flex items-center justify-center cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {verifyError && (
                <div
                  className={`p-3 rounded-xl text-xs font-medium flex items-start gap-2.5 transition-all ${
                    rateLimitCountdown > 0
                      ? "bg-amber-50 border border-amber-200 text-amber-900"
                      : "bg-red-50 border border-red-200 text-red-700"
                  }`}
                >
                  <svg
                    className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                      rateLimitCountdown > 0 ? "text-amber-600" : "text-red-500"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span className="leading-relaxed">{verifyError}</span>
                </div>
              )}

              {/* Verify Button or Verified Success Banner */}
              <div className="pt-2">
                {isIdentityVerified ? (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[13px] font-semibold">
                    <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Identity verified. You can now confirm deletion below.</span>
                  </div>
                ) : (
                  <button
                    type="submit"
                    disabled={isVerifying || rateLimitCountdown > 0}
                    className="w-full h-11 rounded-xl bg-[#131313] text-white hover:bg-[#2C2C2C] active:scale-[0.98] text-[14px] font-medium transition-all flex items-center justify-center shadow-sm cursor-pointer disabled:opacity-60"
                  >
                    {isVerifying
                      ? "Verifying..."
                      : rateLimitCountdown > 0
                      ? `Rate limited — retry in ${rateLimitCountdown}s...`
                      : "Verify"}
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* Section 3: Permanently delete your account? */}
          <section className="bg-white border border-[#e4e2e1] rounded-xl p-6 md:p-8 space-y-6 shadow-[0_8px_30px_-4px_rgba(19,19,19,0.03)]">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#ba1a1a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h2 className="font-playfair text-[22px] md:text-[24px] text-[#1b1c1c] font-medium">
                Permanently delete your account?
              </h2>
            </div>

            {/* Subtle Destructive Banner */}
            <div className="bg-[#FFF4F3] border border-[#FFD0CC] rounded-lg p-4 flex gap-3.5">
              <svg className="w-5 h-5 text-[#ba1a1a] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-[13px] text-[#731915] leading-relaxed">
                This action cannot be undone once your account and associated data have been deleted. Make sure you understand the consequences before continuing.
              </p>
            </div>

            {/* Confirmation Checkbox */}
            <div className="flex items-start gap-3 pt-1">
              <input
                id="acknowledge-delete"
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                className="w-4.5 h-4.5 mt-0.5 rounded border-[#2C2C2C] text-[#131313] focus:ring-0 cursor-pointer"
              />
              <label htmlFor="acknowledge-delete" className="text-[13px] text-[#1b1c1c] select-none cursor-pointer leading-normal font-normal">
                I understand that deleting my Pintree account is permanent and that my account and associated data will be deleted according to the stated policy.
              </label>
            </div>

            {/* Error Notification */}
            {deleteError && (
              <div className="p-3 rounded-xl text-xs font-medium bg-red-50 border border-red-200 text-red-700 flex items-start gap-2.5 transition-all">
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="leading-relaxed">{deleteError}</span>
              </div>
            )}

            {/* Action Buttons Row */}
            <div className="pt-4 border-t border-[#f0eded] flex flex-col sm:flex-row items-center justify-end gap-3">
              <Link
                href="/account"
                className="w-full sm:w-auto text-center px-6 h-11 flex items-center justify-center rounded-full bg-[#f6f3f2] text-[#1b1c1c] border border-[#e4e2e1] hover:bg-white hover:border-[#1b1c1c] text-[14px] font-medium transition-colors"
              >
                Cancel
              </Link>
              <button
                type="button"
                id="delete-action-btn"
                onClick={handleExecuteDelete}
                disabled={!isIdentityVerified || !acknowledged || isDeleting}
                className="w-full sm:w-auto px-7 h-11 rounded-full bg-[#DC2626] text-white hover:bg-[#B91C1C] text-[14px] font-medium transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>{isDeleting ? "Processing..." : "Delete my account"}</span>
              </button>
            </div>
          </section>



          {/* Help Contextual Link */}
          <div className="text-center pt-2">
            <p className="text-[13px] text-[#747878]">
              Need help?{" "}
              <Link href="/support" className="text-[#131313] underline hover:text-black font-semibold">
                Contact Pintree Support.
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Shared Footer */}
      <footer className="bg-[#f6f3f2] border-t border-[#e4e2e1] mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-[1280px] mx-auto px-4 md:px-8 py-8 gap-4">
          <div className="text-center md:text-left">
            <span className="font-playfair text-[20px] font-bold text-[#1b1c1c] block mb-1">Pintree</span>
            <p className="text-[13px] text-[#747878]">
              © 2025 Pintree Inc. All rights reserved. Built for people and authentic communities.
            </p>
          </div>
          <nav className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2 text-[13px] text-[#444748]">
            <Link className="hover:text-[#1b1c1c] hover:underline transition-colors" href="/privacy-policy">
              Privacy Policy
            </Link>
            <Link className="hover:text-[#1b1c1c] hover:underline transition-colors" href="/terms-of-service">
              Terms of Service
            </Link>
            <Link className="hover:text-[#1b1c1c] hover:underline transition-colors" href="/community-guidlines">
              Community Guidelines
            </Link>
            <Link className="hover:text-[#1b1c1c] hover:underline transition-colors" href="/contact">
              Report a problem
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
