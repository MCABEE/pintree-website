"use client";

import { useState, useEffect, useRef } from "react";
import { sendOtp, verifyOtp, getCachedDraft } from "@/utils/newsMediaOnboarding";

export function IndiaFlagIcon({ className = "w-5 h-3.5" }) {
  return (
    <svg
      className={`${className} rounded-[2px] overflow-hidden shrink-0 border border-black/10`}
      viewBox="0 0 30 20"
      aria-label="India Flag"
    >
      <rect width="30" height="6.66" fill="#FF9933" />
      <rect y="6.66" width="30" height="6.66" fill="#FFFFFF" />
      <rect y="13.33" width="30" height="6.66" fill="#138808" />
      <circle cx="15" cy="10" r="2.2" fill="none" stroke="#000080" strokeWidth="0.6" />
      <circle cx="15" cy="10" r="0.6" fill="#000080" />
    </svg>
  );
}

export function SuccessToast({ show, title, subtitle, onClose }) {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => {
      onClose?.();
    }, 5000);
    return () => clearTimeout(timer);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <aside
      aria-label="Notification"
      className="fixed top-6 right-6 z-[60] flex items-start gap-3.5 bg-white border border-[#E5E5E5] rounded-xl px-4 py-3.5 shadow-xl max-w-sm transition-all duration-300 animate-in fade-in slide-in-from-top-4"
    >
      <div className="w-8 h-8 rounded-full bg-[#CAFFA6] flex items-center justify-center text-[#204654] shrink-0 mt-0.5">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="flex flex-col min-w-0 pr-2">
        <span className="text-label-md font-label-md font-semibold text-[#202020] leading-tight">
          {title}
        </span>
        <span className="text-body-sm font-body-sm text-[#666666] mt-0.5">
          {subtitle}
        </span>
      </div>
      <button
        aria-label="Dismiss toast"
        className="text-[#666666] hover:text-[#202020] p-1 rounded-md transition-colors cursor-pointer"
        onClick={onClose}
        type="button"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </aside>
  );
}

// Step 5 Top-Right Success Toast (Interactive & Visible for State 3)
export function Step5SuccessToast({ show, email, onClose }) {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => {
      onClose?.();
    }, 5000);
    return () => clearTimeout(timer);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      className="fixed top-6 right-8 z-[60] bg-white border border-[#E5E5E5] rounded-xl shadow-lg p-4 flex items-start gap-3 max-w-sm transition-all duration-300 translate-y-0 opacity-100 animate-in fade-in slide-in-from-top-4"
      id="successToast"
    >
      <div className="w-7 h-7 rounded-full bg-[#CAFFA6] text-[#166534] flex items-center justify-center flex-shrink-0 mt-0.5">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
        </svg>
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold text-[#202020] leading-tight">
          Login Email Updated Successfully
        </div>
        <p className="text-[13px] text-[#666666] mt-1 leading-normal">
          Your new email address has been verified and is now your login email.
        </p>
      </div>
      <button
        aria-label="Dismiss toast"
        className="text-[#888888] hover:text-[#202020] transition-colors p-1 -mr-1 -mt-1 cursor-pointer"
        onClick={onClose}
        type="button"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
        </svg>
      </button>
    </div>
  );
}

// ==========================================
// Step 5: Exact Change Login Email Modal
// Multi-State: State 1 (Input New Email), State 2 (6-Digit OTP Verification)
// Uses exact backend verification API: /v1/accounts/news-media/:id/otp/verify
// ==========================================
export function Step5ChangeEmailModal({
  isOpen,
  currentEmail = "",
  applicationId,
  onClose,
  onUpdateEmail,
}) {
  const [modalState, setModalState] = useState(1);
  const [inputEmail, setInputEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [resendTimer, setResendTimer] = useState(30);
  const [expiryTimer, setExpiryTimer] = useState(299);
  const otpInputsRef = useRef([]);

  const effectiveAppId =
    (applicationId && applicationId !== "temp" ? applicationId : null) ||
    getCachedDraft()?.applicationId ||
    getCachedDraft()?.id ||
    "app_temp";

  useEffect(() => {
    if (isOpen) {
      setModalState(1);
      setInputEmail("");
      setEmailError("");
      setOtpError("");
      setOtpDigits(["", "", "", "", "", ""]);
      setActiveIdx(0);
      setResendTimer(30);
      setExpiryTimer(299);
      setIsSending(false);
      setIsVerifying(false);
    }
  }, [isOpen]);

  // Timers countdown
  useEffect(() => {
    if (!isOpen || modalState !== 2) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
      setExpiryTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, modalState]);

  if (!isOpen) return null;

  const handleOtpChange = (index, val) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);
    setOtpError("");
    setActiveIdx(index);

    if (digit && index < 5) {
      setActiveIdx(index + 1);
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      setActiveIdx(index - 1);
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!paste) return;
    const newDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = paste[i] || "";
    }
    setOtpDigits(newDigits);
    setOtpError("");
    const nextIdx = Math.min(5, paste.length);
    setActiveIdx(nextIdx);
    otpInputsRef.current[nextIdx]?.focus();
  };

  const handleSendOtp = async (e) => {
    e?.preventDefault?.();
    const emailToVerify = inputEmail.trim();
    if (!emailToVerify) {
      setEmailError("Please enter your new email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailToVerify)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    if (currentEmail && emailToVerify.toLowerCase() === currentEmail.trim().toLowerCase()) {
      setEmailError("New email address must be different from current email.");
      return;
    }

    setEmailError("");
    setIsSending(true);

    try {
      const res = await sendOtp(effectiveAppId, "EMAIL");
      if (res?.code === 404 || res?.status === "error") {
        const msg =
          res?.code === 404 || res?.message?.toLowerCase().includes("not found")
            ? "Application not found. Please submit Step 1 first to generate your official application ID."
            : res?.message || "Failed to send verification code.";
        setEmailError(msg);
        return;
      }
      setModalState(2);
      setResendTimer(res?.data?.resendCooldownSeconds || 30);
      setExpiryTimer(res?.data?.expiresInSeconds || 299);
      setOtpError("");
      setOtpDigits(["", "", "", "", "", ""]);
      setActiveIdx(0);
    } catch (err) {
      setEmailError(err?.message || "Failed to send verification code.");
    } finally {
      setIsSending(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setOtpError("");
    try {
      const res = await sendOtp(effectiveAppId, "EMAIL");
      if (res?.code === 404 || res?.status === "error") {
        setOtpError(res?.message || "Failed to resend code.");
        return;
      }
      setResendTimer(res?.data?.resendCooldownSeconds || 30);
      setExpiryTimer(res?.data?.expiresInSeconds || 299);
    } catch (err) {
      setOtpError(err?.message || "Failed to resend code.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e?.preventDefault?.();
    const code = otpDigits.join("");
    if (code.length < 6) {
      setOtpError("Please enter all 6 digits of the verification code.");
      return;
    }

    setOtpError("");
    setIsVerifying(true);

    try {
      const res = await verifyOtp(effectiveAppId, "EMAIL", code);
      if (res?.data?.isVerified || res?.status === "success") {
        const finalEmail = inputEmail.trim() || currentEmail;
        onUpdateEmail(finalEmail);
        onClose();
      } else {
        const msg =
          res?.code === 404 || res?.message?.toLowerCase().includes("not found")
            ? "Application not found. Please check your application ID."
            : res?.message || "Invalid verification code. Please check and try again.";
        setOtpError(msg);
      }
    } catch (err) {
      setOtpError(err?.message || "Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 overflow-y-auto"
      id="changeEmailModal"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.45)" }}
      onClick={(e) => {
        if (e.target.id === "changeEmailModal") onClose();
      }}
    >
      {/* Modal Container Card */}
      <div className="relative bg-white border border-[#E5E5E5] rounded-2xl shadow-2xl max-w-[560px] w-full p-8 my-8 text-left animate-in fade-in zoom-in-95">
        {/* Modal Close Button */}
        <button
          aria-label="Close"
          className="absolute top-6 right-6 w-8 h-8 rounded-full border border-[#E5E5E5] flex items-center justify-center text-[#777777] hover:text-[#111111] hover:bg-[#F9F9F9] transition-colors cursor-pointer"
          onClick={onClose}
          title="Close modal"
          type="button"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
          </svg>
        </button>

        {/* ==================== STATE 1: INPUT NEW EMAIL ==================== */}
        {modalState === 1 && (
          <div id="modalState1">
            {/* Eyebrow Badge */}
            <div className="mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#EBF6FC] text-[#1E74B3]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1E74B3]"></span>
                Login Identifier
              </span>
            </div>

            {/* Heading & Description */}
            <h2 className="font-aeonik text-2xl font-medium text-[#202020] mb-2 tracking-tight">
              Change Login Email
            </h2>
            <p className="text-sm text-[#666666] leading-relaxed mb-6">
              Update the email address used to sign in to your News &amp; Media Publisher Dashboard. Your new email address must be verified before it becomes active.
            </p>

            <form onSubmit={handleSendOtp}>
              <div className="space-y-4 mb-6">
                {/* Field 01: Current Email Address (Read-only) */}
                <div>
                  <label className="block text-xs font-semibold text-[#525252] mb-1.5">
                    Current Email Address
                  </label>
                  <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg bg-[#F7F7F7] border border-[#E5E5E5]">
                    <div className="flex items-center gap-2.5 overflow-hidden text-sm text-[#525252]">
                      <svg className="w-4 h-4 text-[#888888] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"></path>
                      </svg>
                      <span className="font-medium text-[#202020] truncate">
                        {currentEmail}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-[#EBFDF2] text-[#166534] flex-shrink-0">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
                      </svg>
                      Verified for Login
                    </span>
                  </div>
                </div>

                {/* Field 02: New Login Email */}
                <div>
                  <label className="block text-xs font-semibold text-[#202020] mb-1.5" htmlFor="newEmailInput">
                    New Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888888]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"></path>
                      </svg>
                    </div>
                    <input
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-black transition-colors font-medium text-[#111111]"
                      id="newEmailInput"
                      placeholder="Enter your new email address"
                      type="email"
                      value={inputEmail}
                      onChange={(e) => {
                        setInputEmail(e.target.value);
                        if (emailError) setEmailError("");
                      }}
                    />
                  </div>
                  {emailError ? (
                    <p className="text-xs text-red-500 mt-1.5 font-medium">{emailError}</p>
                  ) : (
                    <p className="text-[11px] text-[#777777] mt-1.5 leading-normal">
                      A 6-digit verification code will be dispatched to this address to confirm administrative ownership.
                    </p>
                  )}
                </div>
              </div>

              {/* Info Callout */}
              <div className="p-3.5 rounded-lg bg-[#FAFAFA] border border-[#EBEBEB] flex items-start gap-2.5 mb-6 text-xs text-[#525252] leading-relaxed">
                <svg className="w-4 h-4 text-[#1E74B3] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
                <span>
                  Your current login email will remain active until the new email address is successfully verified.
                </span>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#F0F0F0]">
                <button
                  className="px-4 py-2.5 rounded-lg border border-[#E5E5E5] bg-white text-xs font-semibold text-[#202020] hover:bg-[#F9F9F9] transition-colors cursor-pointer"
                  onClick={onClose}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="px-5 py-2.5 rounded-lg bg-[#000000] text-white text-xs font-semibold hover:bg-[#1A1A1A] transition-all flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-60"
                  disabled={isSending}
                  type="submit"
                >
                  <span>{isSending ? "Sending OTP..." : "Continue to Verify"}</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==================== STATE 2: 6-DIGIT OTP VERIFICATION ==================== */}
        {modalState === 2 && (
          <div id="modalState2">
            {/* Eyebrow Badge */}
            <div className="mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#EBF6FC] text-[#1E74B3]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1E74B3]"></span>
                Email Verification (Step 2 of 2)
              </span>
            </div>

            {/* Heading & Description */}
            <h2 className="font-aeonik text-2xl font-medium text-[#202020] mb-2 tracking-tight">
              Verify Your New Email
            </h2>
            <p className="text-sm text-[#666666] leading-relaxed mb-4">
              We&apos;ve sent a 6-digit verification code to your new email address.
            </p>

            {/* Highlighted Recipient Box with Edit Link */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#F7F7F7] border border-[#EBEBEB] mb-6">
              <div className="flex items-center gap-2 overflow-hidden">
                <svg className="w-4 h-4 text-[#1E74B3] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
                <span className="text-xs font-semibold text-[#111111] truncate" id="targetEmailText">
                  {inputEmail || currentEmail}
                </span>
              </div>
              <button
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#1F4B5B] hover:text-black transition-colors ml-2 flex-shrink-0 cursor-pointer"
                onClick={() => setModalState(1)}
                type="button"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
                <span>Edit</span>
              </button>
            </div>

            {/* 6-Digit OTP Inputs Form */}
            <form onSubmit={handleVerifyOtp}>
              <div className="mb-6">
                <label className="block text-xs font-semibold text-[#202020] mb-2.5 text-center">
                  Enter 6-Digit Verification Code
                </label>
                <div className="flex items-center justify-center gap-2.5" onPaste={handleOtpPaste}>
                  {[0, 1, 2, 3, 4, 5].map((i) => {
                    const isHighlighted = i === activeIdx || (i === 5 && otpDigits[5]);
                    return (
                      <input
                        key={i}
                        ref={(el) => (otpInputsRef.current[i] = el)}
                        className={`w-12 h-14 text-center font-mono text-xl font-bold bg-white transition-all text-[#111111] ${
                          isHighlighted
                            ? "border-2 border-black rounded-lg ring-2 ring-[#C2E8FA] focus:outline-none focus:border-black"
                            : "border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-black focus:ring-2 focus:ring-[#C2E8FA]"
                        }`}
                        maxLength={1}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={otpDigits[i] || ""}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        onFocus={() => setActiveIdx(i)}
                      />
                    );
                  })}
                </div>
                {otpError && (
                  <p className="text-xs text-red-500 text-center mt-2.5 font-medium">{otpError}</p>
                )}
              </div>

              {/* OTP Status & Resend Timer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-3 rounded-lg bg-[#FAFAFA] border border-[#EBEBEB] text-xs mb-6">
                <div className="flex items-center gap-1.5 text-[#525252]">
                  <svg className="w-3.5 h-3.5 text-[#1E74B3] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                  <span>
                    OTP expires in{" "}
                    <strong className="text-[#111111] font-semibold font-mono">
                      {formatTimer(expiryTimer)}
                    </strong>
                  </span>
                </div>
                <div className="text-[#777777] text-[11px]">
                  Didn&apos;t receive code?{" "}
                  {resendTimer > 0 ? (
                    <span className="font-medium text-[#525252]">
                      Resend OTP (available in 00:{resendTimer < 10 ? `0${resendTimer}` : resendTimer})
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="font-medium text-[#1F4B5B] hover:underline cursor-pointer"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>

              {/* Bottom Info Callout */}
              <p className="text-[11px] text-[#777777] leading-relaxed mb-6">
                Your current login email (<span className="font-medium text-[#525252]">{currentEmail}</span>) will remain active until the new email address is successfully verified.
              </p>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#F0F0F0]">
                <button
                  className="px-4 py-2.5 rounded-lg border border-[#E5E5E5] bg-white text-xs font-semibold text-[#202020] hover:bg-[#F9F9F9] transition-colors flex items-center gap-1.5 cursor-pointer"
                  onClick={() => setModalState(1)}
                  type="button"
                >
                  <span>← Back</span>
                </button>
                <button
                  className="px-5 py-2.5 rounded-lg bg-[#000000] text-white text-xs font-semibold hover:bg-[#1A1A1A] transition-all flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-60"
                  disabled={isVerifying}
                  type="submit"
                >
                  <span>{isVerifying ? "Verifying..." : "Verify & Update Email"}</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

// Retain existing ChangeEmailModal for Step 3
export function ChangeEmailModal({
  isOpen,
  currentEmail,
  onClose,
  onUpdateEmail,
}) {
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setNewEmail("");
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = newEmail.trim();
    if (!trimmed) {
      setError("Please enter a new email address.");
      return;
    }
    if (!trimmed.includes("@") || !trimmed.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (trimmed.toLowerCase() === (currentEmail || "").toLowerCase()) {
      setError("New email must be different from the current email.");
      return;
    }
    onUpdateEmail(trimmed);
  };

  return (
    <div
      id="changeEmailModalBackdrop"
      className="fixed inset-0 bg-black/45 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target.id === "changeEmailModalBackdrop") onClose();
      }}
    >
      <div
        aria-labelledby="modalEmailTitle"
        aria-modal="true"
        className="w-full max-w-[500px] bg-white border border-[#E5E5E5] rounded-2xl p-7 sm:p-8 shadow-2xl relative my-auto"
        role="dialog"
      >
        <button
          aria-label="Close dialog"
          className="absolute top-6 right-6 text-[#777777] hover:text-[#202020] p-1.5 rounded-lg hover:bg-[#F7F7F7] transition-colors cursor-pointer"
          onClick={onClose}
          type="button"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="pr-8 mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F5F5F5] border border-[#E5E5E5] text-label-sm font-label-sm text-[#202020] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#202020]"></span>
            Credential Settings
          </div>
          <h2
            className="text-headline-md font-aeonik font-regular text-[#202020] tracking-tight"
            id="modalEmailTitle"
          >
            Change Email Address
          </h2>
          <p className="text-body-sm font-body-sm text-[#666666] mt-1.5 leading-relaxed">
            Update the primary operational email address associated with your News &amp; Media organisation registry.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Current Email Field */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#202020] mb-2">
              CURRENT EMAIL ADDRESS
            </label>
            <div className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl flex items-center px-4 py-3 gap-3 select-none">
              <svg className="w-4 h-4 text-[#666666] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <rect height="11" rx="2" ry="2" width="18" x="3" y="11" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <input
                className="bg-transparent text-body-md font-body-md font-medium text-[#202020] w-full focus:outline-none cursor-default select-all"
                readOnly
                type="email"
                value={currentEmail || ""}
              />
              <span className="text-label-sm font-label-sm text-[#202020] bg-white px-2.5 py-0.5 rounded border border-[#E5E5E5] whitespace-nowrap font-medium">
                Locked
              </span>
            </div>
            <p className="text-label-sm font-label-sm text-[#666666] mt-1.5 flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-[#666666] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <span>This is the current verified organisation email address.</span>
            </p>
          </div>

          {/* New Email Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                className="block text-[11px] font-semibold uppercase tracking-wider text-[#202020]"
                htmlFor="newEmailModalInput"
              >
                NEW EMAIL ADDRESS
              </label>
              <span className="text-label-sm font-label-sm text-[#666666]">
                Must be work domain
              </span>
            </div>
            <div className="relative w-full bg-white border border-[#E5E5E5] focus-within:border-[#202020] rounded-xl flex items-center px-4 py-3 gap-3 transition-colors">
              <svg className="w-4 h-4 text-[#666666] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <input
                className="bg-white text-body-md font-body-md text-[#202020] font-medium placeholder-[#A0A0A0] w-full focus:outline-none"
                id="newEmailModalInput"
                placeholder="e.g. newsroom@publication.com"
                required
                type="email"
                value={newEmail}
                onChange={(e) => {
                  setNewEmail(e.target.value);
                  if (error) setError("");
                }}
                autoFocus
              />
            </div>
            {error ? (
              <p className="text-label-sm font-label-sm text-red-600 mt-1.5">{error}</p>
            ) : (
              <p className="text-label-sm font-label-sm text-[#666666] mt-1.5">
                A confirmation link and sign-in key will be transmitted to this new destination.
              </p>
            )}
          </div>

          {/* Info Card */}
          <div className="p-3.5 bg-[#F9FAFB] border border-[#E5E5E5] rounded-xl flex items-start gap-2.5">
            <svg className="w-4 h-4 text-[#204654] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            <span className="text-label-sm font-label-sm text-[#4B5563]">
              Updating your address will not disrupt previously submitted registration files or editorial verifications.
            </span>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-5 border-t border-[#E5E5E5]">
            <button
              className="px-5 py-2.5 rounded-lg border border-[#E5E5E5] bg-white text-label-md font-label-md font-medium text-[#202020] hover:bg-[#F7F7F7] transition-colors cursor-pointer"
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="px-6 py-2.5 rounded-lg bg-black text-white text-label-md font-label-md font-medium hover:bg-neutral-800 transition-colors flex items-center gap-2 cursor-pointer"
              type="submit"
            >
              <span>Update Email</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Retain existing ChangeMobileModal for Step 3
export function ChangeMobileModal({
  isOpen,
  currentMobile,
  countryCode = "+91",
  onClose,
  onUpdateMobile,
}) {
  const [newMobile, setNewMobile] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setNewMobile("");
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanNum = newMobile.replace(/\D/g, "");
    if (!cleanNum) {
      setError("Please enter a valid mobile number.");
      return;
    }
    if (cleanNum.length < 10) {
      setError("Mobile number must be at least 10 digits.");
      return;
    }
    const formatted = cleanNum.length === 10 
      ? `${cleanNum.slice(0, 5)} ${cleanNum.slice(5)}`
      : cleanNum;
    onUpdateMobile(formatted);
  };

  return (
    <div
      id="changeMobileModalBackdrop"
      className="fixed inset-0 bg-black/45 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target.id === "changeMobileModalBackdrop") onClose();
      }}
    >
      <div
        aria-labelledby="modalMobileTitle"
        aria-modal="true"
        className="w-full max-w-[500px] bg-white border border-[#E5E5E5] rounded-2xl p-7 sm:p-8 shadow-2xl relative my-auto"
        role="dialog"
      >
        <button
          aria-label="Close dialog"
          className="absolute top-6 right-6 text-[#777777] hover:text-[#202020] p-1.5 rounded-lg hover:bg-[#F7F7F7] transition-colors cursor-pointer"
          onClick={onClose}
          type="button"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="pr-8 mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F5F5F5] border border-[#E5E5E5] text-label-sm font-label-sm text-[#202020] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#202020]"></span>
            Primary Contact Number
          </div>
          <h2
            className="text-headline-md font-aeonik font-regular text-[#202020] tracking-tight"
            id="modalMobileTitle"
          >
            Change Mobile Number
          </h2>
          <p className="text-body-sm font-body-sm text-[#666666] mt-1.5 leading-relaxed">
            Update the primary mobile number associated with your News &amp; Media account.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Current Mobile Number */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#202020] mb-2">
              CURRENT MOBILE NUMBER
            </label>
            <div className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl flex items-center px-4 py-3 gap-3 select-none">
              <svg className="w-4 h-4 text-[#666666] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <rect height="11" rx="2" ry="2" width="18" x="3" y="11" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <div className="flex items-center gap-2 shrink-0">
                <IndiaFlagIcon className="w-5 h-3.5" />
                <span className="text-body-md font-body-md text-[#666666] font-medium">{countryCode}</span>
              </div>
              <input
                className="bg-transparent text-body-md font-body-md font-medium text-[#202020] w-full focus:outline-none cursor-default select-all"
                readOnly
                type="text"
                value={currentMobile || ""}
              />
              <span className="text-label-sm font-label-sm text-[#202020] bg-white px-2.5 py-0.5 rounded border border-[#E5E5E5] whitespace-nowrap font-medium">
                Registered
              </span>
            </div>
            <p className="text-label-sm font-label-sm text-[#666666] mt-1.5 flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-[#666666] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <span>Current verified contact number on file.</span>
            </p>
          </div>

          {/* New Mobile Number */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                className="block text-[11px] font-semibold uppercase tracking-wider text-[#202020]"
                htmlFor="newMobileModalInput"
              >
                NEW MOBILE NUMBER
              </label>
              <span className="text-label-sm font-label-sm text-[#666666]">
                India standard
              </span>
            </div>
            <div className="relative w-full bg-white border border-[#E5E5E5] focus-within:border-[#202020] rounded-xl flex items-center px-4 py-3 gap-3 transition-colors">
              <svg className="w-4 h-4 text-[#666666] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <rect height="18" rx="2" ry="2" width="12" x="6" y="3" />
                <line x1="11" x2="13" y1="18" y2="18" />
              </svg>
              <div className="flex items-center gap-1.5 pr-2 border-r border-[#E5E5E5] shrink-0">
                <IndiaFlagIcon className="w-5 h-3.5" />
                <span className="text-body-md font-body-md text-[#202020] font-medium">{countryCode}</span>
                <svg className="w-3.5 h-3.5 text-[#777777]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <input
                className="bg-white text-body-md font-body-md text-[#202020] font-medium placeholder-[#A0A0A0] w-full focus:outline-none"
                id="newMobileModalInput"
                placeholder="Enter your new mobile number"
                required
                type="tel"
                value={newMobile}
                onChange={(e) => {
                  setNewMobile(e.target.value);
                  if (error) setError("");
                }}
                autoFocus
              />
            </div>
            {error ? (
              <p className="text-label-sm font-label-sm text-red-600 mt-1.5">{error}</p>
            ) : (
              <p className="text-label-sm font-label-sm text-[#666666] mt-1.5">
                Enter a valid 10-digit mobile number for statutory and security dispatch.
              </p>
            )}
          </div>

          {/* Info Card */}
          <div className="p-3.5 bg-[#F9FAFB] border border-[#E5E5E5] rounded-xl flex items-start gap-2.5">
            <svg className="w-4 h-4 text-[#204654] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            <span className="text-label-sm font-label-sm text-[#4B5563]">
              Updated mobile number will be used for two-factor authentication recovery and mandatory regulatory broadcasts. The founder&apos;s personal mobile number remains unaffected.
            </span>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-5 border-t border-[#E5E5E5]">
            <button
              className="px-5 py-2.5 rounded-lg border border-[#E5E5E5] bg-white text-label-md font-label-md font-medium text-[#202020] hover:bg-[#F7F7F7] transition-colors cursor-pointer"
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="px-6 py-2.5 rounded-lg bg-black text-white text-label-md font-label-md font-medium hover:bg-neutral-800 transition-colors flex items-center gap-2 cursor-pointer"
              type="submit"
            >
              <span>Update Mobile Number</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
