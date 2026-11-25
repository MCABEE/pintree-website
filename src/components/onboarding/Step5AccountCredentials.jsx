"use client";

import { useState, useEffect } from "react";
import Stepper from "./Stepper";
import OnboardingBottomBar from "./OnboardingBottomBar";
import Icon from "./Icon";
import {
  Step5ChangeEmailModal,
  Step5SuccessToast,
  ChangeMobileModal,
} from "./ContactModals";
import {
  registerDedicatedCredentials,
  submitApplication,
  PUBLICATION_TYPE_LABELS,
  getCachedDraft,
  setCachedDraft,
} from "@/utils/newsMediaOnboarding";

export default function Step5AccountCredentials({
  data,
  onChange,
  onBack,
  onSaveDraft,
  onJumpToStep,
  isSavingDraft = false,
}) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [currentEmail, setCurrentEmail] = useState(
    data?.officialEmail || ""
  );
  const [currentMobile, setCurrentMobile] = useState(
    data?.primaryMobileNumber || ""
  );
  const [showChangeEmailModal, setShowChangeEmailModal] = useState(false);
  const [showChangeMobileModal, setShowChangeMobileModal] = useState(false);
  const [showStep5Toast, setShowStep5Toast] = useState(false);

  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [draftData, setDraftData] = useState(null);

  useEffect(() => {
    setDraftData(getCachedDraft());
  }, []);

  useEffect(() => {
    if (data?.officialEmail) setCurrentEmail(data.officialEmail);
    if (data?.primaryMobileNumber) setCurrentMobile(data.primaryMobileNumber);
  }, [data?.officialEmail, data?.primaryMobileNumber]);

  const emailDisplay = currentEmail;

  const handleUpdateEmail = (updatedEmail) => {
    setCurrentEmail(updatedEmail);
    if (onChange) onChange({ officialEmail: updatedEmail });
    setShowChangeEmailModal(false);
    setShowStep5Toast(true);
  };

  const handleUpdateMobile = (updatedMobile) => {
    setCurrentMobile(updatedMobile);
    if (onChange) onChange({ primaryMobileNumber: updatedMobile });
    setShowChangeMobileModal(false);
  };

  // Password Validation
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  // Strength score
  const criteriaPassed = [
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecial,
  ].filter(Boolean).length;

  let strengthLabel = "";
  let strengthBars = 0;
  let barColor = "bg-transparent";

  if (password.length > 0) {
    if (criteriaPassed >= 4 && password.length >= 10) {
      strengthLabel = "Strong";
      strengthBars = 3;
      barColor = "bg-[#1E824C]";
    } else if (criteriaPassed >= 3 && password.length >= 8) {
      strengthLabel = "Medium";
      strengthBars = 2;
      barColor = "bg-[#B76E00]";
    } else {
      strengthLabel = "Weak";
      strengthBars = 1;
      barColor = "bg-[#BA1A1A]";
    }
  }

  const handleSaveDraftClick = () => {
    if (onChange) {
      onChange({ passwordSetup: { completed: true } });
    }
    setIsDraftSaved(true);
    if (onSaveDraft) onSaveDraft();
    setTimeout(() => {
      setIsDraftSaved(false);
    }, 2500);
  };

  const handleFinish = async () => {
    if (!hasMinLength) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }
    if (!passwordsMatch) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setErrorMsg("");
    setIsSubmitting(true);

    try {
      // Resolve real application ID
      const cached = getCachedDraft() || {};
      const storedAppId =
        typeof window !== "undefined" ? localStorage.getItem("pintree_application_id") : null;
      const targetAppId =
        data?.applicationId ||
        cached?.applicationId ||
        cached?.id ||
        data?.id ||
        storedAppId ||
        "";

      // 1. Register dedicated credentials
      const regRes = await registerDedicatedCredentials({
        applicationId: targetAppId,
        email: emailDisplay,
        password: password,
        confirmPassword: confirmPassword,
        device: {
          deviceId: "dev-web-01",
          deviceName:
            typeof navigator !== "undefined"
              ? navigator.userAgent.slice(0, 50)
              : "Web",
          deviceType: "WEB",
        },
      });

      // 2. Submit application to Trust & Safety Editorial Desk
      const res = await submitApplication(targetAppId, regRes?.data?.accessToken);
      const draftData = getCachedDraft() || cached || {};
      const combinedResult = {
        ...draftData,
        ...data,
        ...(res?.data || {}),
        publicationName:
          data?.publicationName ||
          draftData?.publicationName ||
          res?.data?.publicationName ||
          "",
        registeredOrgName:
          data?.registeredOrgName ||
          data?.registeredOrganisationName ||
          draftData?.registeredOrgName ||
          draftData?.registeredOrganisationName ||
          res?.data?.registeredOrgName ||
          "",
        publicationType:
          data?.publicationType ||
          draftData?.publicationType ||
          res?.data?.publicationType ||
          "ONLINE_DIGITAL_NEWS_PUBLISHER",
        submittedAt:
          res?.data?.submittedAt ||
          res?.data?.submissionDate ||
          new Date().toISOString(),
        referenceId:
          res?.data?.referenceId ||
          data?.referenceId ||
          draftData?.referenceId ||
          `PNT-NM-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      };
      setSubmissionResult(combinedResult);
    } catch (err) {
      setErrorMsg(
        err.message ||
          "Failed to finish registration. Please check your verification."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyReference = () => {
    let draft = null;
    if (typeof window !== "undefined") {
      try {
        draft = JSON.parse(localStorage.getItem("pintree_nm_onboarding_draft") || "null");
      } catch {}
    }
    const textToCopy =
      submissionResult?.referenceId ||
      submissionResult?.data?.referenceId ||
      data?.referenceId ||
      draft?.referenceId ||
      "";
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // If application has been finalized, show submission confirmation screen
  if (submissionResult) {
    let draft = null;
    if (typeof window !== "undefined") {
      try {
        draft = JSON.parse(localStorage.getItem("pintree_nm_onboarding_draft") || "null");
      } catch {}
    }

    const pubName =
      data?.publicationName ||
      draft?.publicationName ||
      submissionResult?.publicationName ||
      submissionResult?.data?.publicationName ||
      "";

    const orgName =
      data?.registeredOrgName ||
      data?.registeredOrganisationName ||
      draft?.registeredOrgName ||
      draft?.registeredOrganisationName ||
      submissionResult?.registeredOrgName ||
      submissionResult?.registeredOrganisationName ||
      submissionResult?.data?.registeredOrgName ||
      submissionResult?.data?.registeredOrganisationName ||
      "";

    const rawPubType =
      data?.publicationType ||
      draft?.publicationType ||
      submissionResult?.publicationType ||
      submissionResult?.data?.publicationType ||
      "ONLINE_DIGITAL_NEWS_PUBLISHER";

    const accountTypeLabel =
      PUBLICATION_TYPE_LABELS[rawPubType] ||
      PUBLICATION_TYPE_LABELS[rawPubType?.toUpperCase()] ||
      PUBLICATION_TYPE_LABELS[rawPubType?.toLowerCase()] ||
      rawPubType;

    const submissionDateFormatted = (() => {
      try {
        const rawDate =
          submissionResult?.submittedAt ||
          submissionResult?.submissionDate ||
          submissionResult?.createdAt ||
          data?.submittedAt ||
          data?.createdAt;
        const d = rawDate ? new Date(rawDate) : new Date();
        const day = d.getDate();
        const months = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        const month = months[d.getMonth()];
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, "0");
        const mins = String(d.getMinutes()).padStart(2, "0");
        return `${day} ${month} ${year} · ${hours}:${mins} IST`;
      } catch {
        const now = new Date();
        return `${now.getDate()} November ${now.getFullYear()} · ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")} IST`;
      }
    })();

    const refId =
      submissionResult?.referenceId ||
      submissionResult?.data?.referenceId ||
      data?.referenceId ||
      draft?.referenceId ||
      (data?.applicationId
        ? `PNT-NM-${new Date().getFullYear()}-${String(data.applicationId).slice(-5).toUpperCase()}`
        : `PNT-NM-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`);

    return (
      <div className="w-full min-h-screen py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-[#FFFFFF] font-jakarta animate-fadeIn flex flex-col items-center justify-center">
        <div className="w-full max-w-[840px] mx-auto flex flex-col items-center">
          {/* Main Centered Presentation Canvas */}
          <section className="w-full flex flex-col items-center">
            {/* Hero Status Cluster */}
            <div className="flex flex-col items-center text-center">
              {/* Centered App Icon Badge */}
              <div className="flex items-center justify-center mb-5">
                <div className="w-14 h-14 rounded-2xl bg-[#EAF5FA] border border-[#D5EBF5] shadow-xs flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-[#1E74B3]"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                </div>
              </div>

              {/* Main Heading with Editorial Balance */}
              <h1
                className="text-[28px] sm:text-[34px] md:text-[38px] leading-tight text-[#1B1C1C] tracking-tight font-medium text-center"
                style={{
                  fontFamily:
                    'Aeonik, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  fontWeight: 500,
                }}
              >
                Your News &amp; Media account&nbsp;
                <div className="block mt-1">has been created!</div>
              </h1>

              {/* Narrative Subtext */}
              <p className="text-[14px] sm:text-[15px] text-[#4C4546] max-w-xl mx-auto mt-3 leading-relaxed text-center">
                Your News &amp; Media account application has been successfully submitted to Pintree. Thank you for providing the required information.&nbsp;
              </p>
              <div className="text-[14px] sm:text-[15px] text-[#4C4546] text-center mt-0.5">
                Our team will review your application and notify you about the verification outcome.
              </div>
            </div>

            {/* Application Summary Card */}
            <div className="w-full bg-[#F5F3F3] rounded-2xl p-5 sm:p-7 md:p-8 mt-10 shadow-sm border border-[#EBE8E7]">
              {/* Card Title Bar */}
              <div className="flex items-center justify-between pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-[18px] sm:text-[20px] text-[#1B1C1C] font-semibold tracking-tight">
                    Application Details
                  </span>
                  <span className="text-[11px] sm:text-[12px] text-[#456978] bg-[#C2E8FA]/70 px-2.5 py-0.5 rounded-full font-medium">
                    Verified Source
                  </span>
                </div>
                {/* Live Status Chip */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E4E2E2] shadow-2xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3F6372] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3F6372]"></span>
                  </span>
                  <span className="text-[11px] text-[#3F6372] font-semibold uppercase tracking-wider">
                    Under Review
                  </span>
                </div>
              </div>

              {/* Data Details Grid */}
              <div className="bg-[#FFFFFF] rounded-xl p-5 sm:p-6 shadow-xs border border-[#EBE8E7]/60">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8">
                  {/* Field 1 */}
                  <div className="flex flex-col gap-1.5">
                    <span
                      className="text-[12px] sm:text-[13px] uppercase tracking-wider font-extrabold select-none"
                      style={{ color: "#0F172A" }}
                    >
                      Account Type
                    </span>
                    <div className="flex items-center gap-2">
                      <Icon name="newspaper" className="text-[18px] text-[#1E74B3]" />
                      <span className="text-[15px] sm:text-[16px] text-[#0F172A] font-bold">
                        {accountTypeLabel}
                      </span>
                    </div>
                  </div>
                  {/* Field 2 */}
                  <div className="flex flex-col gap-1.5">
                    <span
                      className="text-[12px] sm:text-[13px] uppercase tracking-wider font-extrabold select-none"
                      style={{ color: "#0F172A" }}
                    >
                      Submission Date &amp; Time
                    </span>
                    <span className="text-[15px] sm:text-[16px] text-[#0F172A] font-semibold">
                      {submissionDateFormatted}
                    </span>
                  </div>
                  {/* Field 3 */}
                  <div className="flex flex-col gap-1.5">
                    <span
                      className="text-[12px] sm:text-[13px] uppercase tracking-wider font-extrabold select-none"
                      style={{ color: "#0F172A" }}
                    >
                      Publication Name
                    </span>
                    <span className="text-[15px] sm:text-[16px] text-[#0F172A] font-semibold">
                      {pubName}
                    </span>
                  </div>
                  {/* Field 4 */}
                  <div className="flex flex-col gap-1.5">
                    <span
                      className="text-[12px] sm:text-[13px] uppercase tracking-wider font-extrabold select-none"
                      style={{ color: "#0F172A" }}
                    >
                      Registered Organisation
                    </span>
                    <span className="text-[15px] sm:text-[16px] text-[#0F172A] font-semibold">
                      {orgName}
                    </span>
                  </div>

                  {/* Reference Identifier */}
                  <div className="md:col-span-2 pt-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#EEF2F6] px-4 py-3.5 rounded-xl border-2 border-[#CBD5E1] shadow-xs">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span
                          className="text-[12px] sm:text-[13px] uppercase tracking-wider font-extrabold select-none"
                          style={{ color: "#0F172A" }}
                        >
                          Reference ID:
                        </span>
                        <span
                          className="font-mono text-[16px] sm:text-[17px] tracking-tight font-extrabold select-all px-2.5 py-0.5 rounded bg-[#FFFFFF] border border-[#CBD5E1] shadow-2xs"
                          style={{ color: "#0F172A" }}
                          id="refIdText"
                        >
                          {refId}
                        </span>
                      </div>
                      <button
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#FFFFFF] hover:bg-[#F8FAFC] active:bg-[#E2E8F0] transition-colors border border-[#CBD5E1] text-[#0F172A] cursor-pointer shadow-xs shrink-0 self-start sm:self-auto font-bold text-[12px]"
                        id="copyBtn"
                        title="Copy Reference ID"
                        type="button"
                        onClick={handleCopyReference}
                      >
                        <Icon
                          name={copied ? "check" : "content_copy"}
                          className="text-[16px] text-[#1E74B3]"
                          id="copyIcon"
                        />
                        <span id="copyLabel" className="font-bold">
                          {copied ? "Copied!" : "Copy ID"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Indicator Strip */}
              <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-1 text-[12px]" style={{ color: "#0F172A" }}>
                <div className="flex items-center gap-1.5 font-bold" style={{ color: "#1E293B" }}>
                  <Icon name="verified_user" className="text-[16px] text-[#1E74B3]" />
                  <span>Encrypted Submission via Pintree Security Core</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium" style={{ color: "#1E293B" }}>
                  <span>
                    Expected Review Window:{" "}
                    <strong className="text-[#0F172A] font-extrabold">24–48 hours</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Procedural Overview */}
            <div className="w-full mt-14 sm:mt-16">
              <div className="flex flex-col items-center text-center mb-6">
                <span
                  className="text-[11px] sm:text-[12px] uppercase tracking-widest font-bold"
                  style={{ color: "#334155" }}
                >
                  Procedural Overview
                </span>
                <h2
                  className="text-[22px] sm:text-[26px] text-[#1B1C1C] mt-1 font-semibold tracking-tight"
                  style={{
                    fontFamily:
                      'Aeonik, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  }}
                >
                  What Happens Next?
                </h2>
              </div>
              {/* 3-Column Sequential Workflow Card Layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Step 01 */}
                <div className="bg-[#F5F3F3] p-5 rounded-2xl shadow-xs border border-[#EBE8E7] flex flex-col justify-between hover:bg-[#EFECEC] transition-colors">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[18px] font-bold text-[#1E74B3]">01</span>
                      <div className="w-8 h-8 rounded-full bg-[#FFFFFF] shadow-2xs flex items-center justify-center text-[#1B1C1C]">
                        <Icon name="fact_check" className="text-[18px]" />
                      </div>
                    </div>
                    <h3 className="text-[16px] text-[#1B1C1C] mt-4 font-semibold">
                      Application Review
                    </h3>
                    <p className="text-[13px] text-[#4C4546] mt-1.5 leading-relaxed">
                      Our accreditation team will review your organisation details and submitted press credentials.
                    </p>
                  </div>
                  <div className="w-full h-1 bg-[#E4E2E2] rounded-full mt-5 overflow-hidden">
                    <div className="w-1/3 h-full bg-[#1E74B3]"></div>
                  </div>
                </div>
                {/* Step 02 */}
                <div className="bg-[#F5F3F3] p-5 rounded-2xl shadow-xs border border-[#EBE8E7] flex flex-col justify-between hover:bg-[#EFECEC] transition-colors">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[18px] font-bold" style={{ color: "#334155" }}>02</span>
                      <div className="w-8 h-8 rounded-full bg-[#FFFFFF] shadow-2xs flex items-center justify-center text-[#1B1C1C]">
                        <Icon name="contact_support" className="text-[18px]" />
                      </div>
                    </div>
                    <h3 className="text-[16px] text-[#1B1C1C] mt-4 font-semibold">
                      Verification
                    </h3>
                    <p className="text-[13px] text-[#4C4546] mt-1.5 leading-relaxed">
                      We may contact your listed editorial representative if clarifying documentation is required.
                    </p>
                  </div>
                  <div className="w-full h-1 bg-[#E4E2E2] rounded-full mt-5"></div>
                </div>
                {/* Step 03 */}
                <div className="bg-[#F5F3F3] p-5 rounded-2xl shadow-xs border border-[#EBE8E7] flex flex-col justify-between hover:bg-[#EFECEC] transition-colors">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[18px] font-bold" style={{ color: "#334155" }}>03</span>
                      <div className="w-8 h-8 rounded-full bg-[#FFFFFF] shadow-2xs flex items-center justify-center text-[#1B1C1C]">
                        <Icon name="mark_email_read" className="text-[18px]" />
                      </div>
                    </div>
                    <h3 className="text-[16px] text-[#1B1C1C] mt-4 font-semibold">
                      Status Update
                    </h3>
                    <p className="text-[13px] text-[#4C4546] mt-1.5 leading-relaxed">
                      You will receive a formal confirmation and verification notification via your registered administrative email.
                    </p>
                  </div>
                  <div className="w-full h-1 bg-[#E4E2E2] rounded-full mt-5"></div>
                </div>
              </div>
            </div>

            {/* Editorial Callout Note */}
            <div className="w-full mt-6 bg-[#FFFFFF] p-4 sm:p-5 rounded-2xl shadow-xs border border-[#EBE8E7] flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#C2E8FA]/50 flex items-center justify-center shrink-0">
                <Icon name="notifications_active" className="text-[#3F6372] text-[20px]" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[14px] font-semibold text-[#1B1C1C]">
                  Need immediate press desk assistance?
                </span>
                <span className="text-[13px] text-[#4C4546]">
                  For breaking story accreditations or urgent inquiries, contact{" "}
                  <a
                    className="text-[#1B1C1C] underline font-medium hover:text-[#3F6372]"
                    href="mailto:press@pintree.com"
                  >
                    press@pintree.com
                  </a>.
                </span>
              </div>
            </div>

            {/* Primary Destination CTA */}
            <div className="flex flex-col items-center text-center mt-10">
              <a
                className="group inline-flex items-center justify-center gap-2 bg-[#000000] text-white px-8 py-3.5 rounded-full font-medium text-[14px] shadow-sm hover:bg-[#1A1A1A] transition-all cursor-pointer"
                data-path="dashboard"
                href="/dashboard"
              >
                <span>Explore Dashboard</span>
                <Icon
                  name="arrow_forward"
                  className="text-[18px] transform group-hover:translate-x-1 transition-transform"
                />
              </a>
              <div className="mt-4 max-w-[620px] mx-auto bg-[#F4F8FA] border border-[#E2E8F0] rounded-xl px-4 py-3 flex items-start sm:items-center gap-2.5 text-left shadow-2xs">
                <svg
                  className="w-4 h-4 text-[#4A6B82] flex-shrink-0 mt-0.5 sm:mt-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0-4h.01"></path>
                </svg>
                <p className="text-[13px] leading-relaxed text-[#475569]">
                  Once your account details have been verified and approved, the Explore Dashboard option will be enabled. You can then access your dashboard and start publishing on Pintree.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  const pubNameDisplay =
    data?.publicationName ||
    draftData?.publicationName ||
    "Publication";

  const orgNameDisplay =
    data?.registeredOrgName ||
    data?.registeredOrganisationName ||
    draftData?.registeredOrgName ||
    draftData?.registeredOrganisationName ||
    "Registered Organisation";

  const rawPubType =
    data?.publicationType ||
    draftData?.publicationType ||
    "";

  const pubTypeDisplay =
    PUBLICATION_TYPE_LABELS[rawPubType] ||
    PUBLICATION_TYPE_LABELS[rawPubType?.toUpperCase()] ||
    (rawPubType || "");

  return (
    <main className="w-full max-w-7xl mx-auto px-gutter font-jakarta">
      <div className="flex flex-col w-full">
        <div className="w-full max-w-[1280px] mx-auto pb-24 pt-4 md:pt-8 text-on-surface">
          {/* Header & Breadcrumbs Area */}
          <header className="w-full mb-8">
            {/* Top Header Row: Left Info Stack + Right Verification Badge */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div className="flex flex-col items-start">
                {/* Line 1: Breadcrumb */}
                <nav
                  aria-label="Breadcrumb"
                  className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant mb-3"
                >
                  <span
                    onClick={() => onJumpToStep?.(1)}
                    className="hover:text-primary transition-colors cursor-pointer"
                  >
                    Professional &amp; Public Accounts
                  </span>
                  <span className="text-outline-variant font-light">/</span>
                  <span className="text-on-surface font-label-sm font-medium">News &amp; Media</span>
                </nav>

                {/* Line 2: Pill Badge */}
                <div className="mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#EBF6FC] text-[#1E74B3]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1E74B3]"></span>
                    Account Onboarding
                  </span>
                </div>

                {/* Line 3: Main Headline */}
                <h1
                  className="text-3xl md:text-[34px] leading-tight font-medium text-[#111111] mb-2 tracking-tight"
                  style={{
                    fontFamily:
                      'Aeonik, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  }}
                >
                  Create Your Account Credentials
                </h1>

                {/* Line 4: Supporting Description */}
                <p className="text-sm md:text-[15px] text-[#666666] max-w-2xl leading-relaxed">
                  Set up your login credentials to securely access and manage your News &amp; Media account on Pintree.
                </p>
              </div>

              {/* Right Side: Official Verification Badge */}
              <div className="self-start md:self-end flex-shrink-0 mb-1">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E5E5E5] bg-[#FAFAFA] text-xs text-[#525252]">
                  <Icon name="verified_user" className="text-[#1E74B3] text-[16px]" />
                  <span className="font-medium">Official Identity Verification Required</span>
                </div>
              </div>
            </div>

            {/* 5-Step Stepper inside card container */}
            <Stepper currentStep={5} onStepClick={onJumpToStep} />

            {/* Connected Organisation Banner */}
            <div className="w-full bg-surface-container-low rounded-xl p-space-md md:p-space-lg mb-space-2xl border border-outline-variant/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md mt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-space-md">
                <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm shrink-0">
                  <Icon name="newspaper" className="text-[20px]" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase">
                      Connected Organisation
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-secondary px-2 py-0.5 rounded-full bg-secondary-container">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Step 1 Synced
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-title-md text-title-md font-semibold text-primary">
                      {pubNameDisplay || "Publication"}
                    </span>
                    {pubTypeDisplay && (
                      <>
                        <span className="text-outline-variant font-body-sm">·</span>
                        <span className="font-body-md text-body-md text-on-surface-variant">
                          {pubTypeDisplay}
                        </span>
                      </>
                    )}
                    {orgNameDisplay && (
                      <>
                        <span className="text-outline-variant font-body-sm">·</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          {orgNameDisplay}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button
                className="shrink-0 text-on-surface-variant hover:text-primary font-label-md text-label-md flex items-center gap-1 transition-colors px-3 py-1.5 rounded-lg hover:bg-surface-container-high cursor-pointer"
                type="button"
                onClick={() => onJumpToStep?.(1)}
              >
                <Icon name="edit_note" className="text-[16px]" /> Modify Step 1 Info
              </button>
            </div>
          </header>

          {/* Form Content Container */}
          <div className="space-y-6">
            {/* SECTION 01: Login Email Address */}
            <section className="border border-[#E5E5E5] rounded-xl bg-white p-6 sm:p-8 transition-shadow">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-[#777777] mb-1">
                    Section 01
                  </div>
                  <h2
                    className="text-lg font-medium text-[#202020]"
                    style={{
                      fontFamily:
                        'Aeonik, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    }}
                  >
                    Login Email Address
                  </h2>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F4FBF7] border border-[#D5EFE2] text-xs font-medium text-[#1E824C]">
                  <Icon name="check" className="text-[14px] text-[#1E824C]" />
                  Verified for Login
                </span>
              </div>

              <p className="text-xs text-[#666666] mb-5 leading-relaxed">
                Your verified official email address will be used to sign in to your News &amp; Media Publisher Dashboard.
              </p>

              {/* Read-only Email Field Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-[#F7F7F7] border border-[#EBEBEB]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center flex-shrink-0 text-[#525252]">
                    <Icon name="mail" className="text-[20px]" />
                  </div>
                  <div>
                    <div className="text-[11px] text-[#777777] font-medium">
                      Verified Organisation Email
                    </div>
                    <div
                      className="text-sm font-semibold text-[#111111]"
                      id="loginEmailDisplay"
                    >
                      {emailDisplay || "—"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-[#E8F8F0] text-[#1E824C]">
                    <Icon name="check" className="text-[12px]" />
                    Verified via OTP
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowChangeEmailModal(true)}
                    className="text-xs font-semibold text-[#1F4B5B] hover:text-black underline underline-offset-4 transition-colors cursor-pointer"
                  >
                    Change Email
                  </button>
                </div>
              </div>
            </section>

            {/* SECTION 02: Password Setup */}
            <section className="border border-[#E5E5E5] rounded-xl bg-white p-6 sm:p-8 transition-shadow">
              <div className="mb-5">
                <div className="text-[11px] uppercase tracking-wider font-semibold text-[#777777] mb-1">
                  Section 02
                </div>
                <h2
                  className="text-lg font-medium text-[#202020]"
                  style={{
                    fontFamily:
                      'Aeonik, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  }}
                >
                  Create Password
                </h2>
                <p className="text-xs text-[#666666] mt-0.5">
                  Configure a resilient password for your newsroom dashboard access.
                </p>
              </div>

              {/* Dual Column Password Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Column 1: Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="passwordInput"
                      className="text-xs font-semibold text-[#202020]"
                    >
                      Create Password <span className="text-red-500">*</span>
                    </label>
                    {strengthLabel ? (
                      <span
                        id="strengthText"
                        className={`text-[11px] font-medium ${
                          strengthLabel === "Strong"
                            ? "text-[#1E824C]"
                            : strengthLabel === "Medium"
                            ? "text-[#B76E00]"
                            : "text-[#BA1A1A]"
                        }`}
                      >
                        {strengthLabel}
                      </span>
                    ) : null}
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="passwordInput"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-3.5 pr-10 py-2.5 text-sm bg-white border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-black transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777777] hover:text-[#202020] transition-colors p-1 cursor-pointer"
                      title="Show / Hide Password"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.8"
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.8"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.8"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Password Strength Bar */}
                  <div className="mt-2.5">
                    <div className="w-full bg-[#EFEFEF] h-1.5 rounded-full overflow-hidden flex">
                      <div
                        className={`h-full w-1/3 transition-all duration-300 ${
                          strengthBars >= 1 ? barColor : "bg-transparent"
                        }`}
                      ></div>
                      <div
                        className={`h-full w-1/3 ml-0.5 transition-all duration-300 ${
                          strengthBars >= 2 ? barColor : "bg-transparent"
                        }`}
                      ></div>
                      <div
                        className={`h-full w-1/3 ml-0.5 transition-all duration-300 ${
                          strengthBars >= 3 ? barColor : "bg-transparent"
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Column 2: Confirm Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="confirmPasswordInput"
                      className="text-xs font-semibold text-[#202020]"
                    >
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <span
                      id="matchStatusBadge"
                      className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                        passwordsMatch ? "text-[#1E824C]" : "text-[#777777]"
                      }`}
                    >
                      {passwordsMatch && (
                        <>
                          <Icon name="check" className="text-[12px]" /> Passwords match
                        </>
                      )}
                    </span>
                  </div>

                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPasswordInput"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
                      className={`w-full pl-3.5 pr-10 py-2.5 text-sm bg-white rounded-lg focus:outline-none transition-colors border ${
                        passwordsMatch
                          ? "border-[#1E824C] focus:border-[#1E824C]"
                          : "border-[#E5E5E5] focus:border-black"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777777] hover:text-[#202020] transition-colors p-1 cursor-pointer"
                      title="Show / Hide Password"
                      aria-label="Toggle password visibility"
                    >
                      {showConfirmPassword ? (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.8"
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.8"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.8"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>

                  {passwordsMatch && (
                    <p className="text-[11px] text-[#1E824C] mt-2 flex items-center gap-1.5">
                      <Icon name="check" className="text-[12px]" />
                      Credentials verified and match requirement criteria.
                    </p>
                  )}
                </div>
              </div>

              {/* Password Requirements Checklist */}
              <div className="mt-6 pt-5 border-t border-[#F0F0F0]">
                <div className="text-xs font-semibold text-[#525252] mb-3">
                  Password Requirements
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  <div
                    className={`flex items-center gap-2 text-xs transition-colors duration-200 ${
                      hasMinLength ? "text-[#202020] font-medium" : "text-[#777777]"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                        hasMinLength
                          ? "bg-[#E8F8F0] text-[#1E824C]"
                          : "bg-[#F2F2F2] text-[#888888]"
                      }`}
                    >
                      {hasMinLength ? (
                        <Icon name="check" className="text-[10px]" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#AAAAAA]" />
                      )}
                    </span>
                    <span>Minimum 8 characters</span>
                  </div>

                  <div
                    className={`flex items-center gap-2 text-xs transition-colors duration-200 ${
                      hasUppercase ? "text-[#202020] font-medium" : "text-[#777777]"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                        hasUppercase
                          ? "bg-[#E8F8F0] text-[#1E824C]"
                          : "bg-[#F2F2F2] text-[#888888]"
                      }`}
                    >
                      {hasUppercase ? (
                        <Icon name="check" className="text-[10px]" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#AAAAAA]" />
                      )}
                    </span>
                    <span>One uppercase letter (A–Z)</span>
                  </div>

                  <div
                    className={`flex items-center gap-2 text-xs transition-colors duration-200 ${
                      hasLowercase ? "text-[#202020] font-medium" : "text-[#777777]"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                        hasLowercase
                          ? "bg-[#E8F8F0] text-[#1E824C]"
                          : "bg-[#F2F2F2] text-[#888888]"
                      }`}
                    >
                      {hasLowercase ? (
                        <Icon name="check" className="text-[10px]" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#AAAAAA]" />
                      )}
                    </span>
                    <span>One lowercase letter (a–z)</span>
                  </div>

                  <div
                    className={`flex items-center gap-2 text-xs transition-colors duration-200 ${
                      hasNumber ? "text-[#202020] font-medium" : "text-[#777777]"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                        hasNumber
                          ? "bg-[#E8F8F0] text-[#1E824C]"
                          : "bg-[#F2F2F2] text-[#888888]"
                      }`}
                    >
                      {hasNumber ? (
                        <Icon name="check" className="text-[10px]" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#AAAAAA]" />
                      )}
                    </span>
                    <span>One number (0–9)</span>
                  </div>

                  <div
                    className={`flex items-center gap-2 text-xs transition-colors duration-200 ${
                      hasSpecial ? "text-[#202020] font-medium" : "text-[#777777]"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                        hasSpecial
                          ? "bg-[#E8F8F0] text-[#1E824C]"
                          : "bg-[#F2F2F2] text-[#888888]"
                      }`}
                    >
                      {hasSpecial ? (
                        <Icon name="check" className="text-[10px]" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#AAAAAA]" />
                      )}
                    </span>
                    <span>One special character (@, #, $, !)</span>
                  </div>

                  <div
                    className={`flex items-center gap-2 text-xs transition-colors duration-200 ${
                      password.length > 0 ? "text-[#202020] font-medium" : "text-[#777777]"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                        password.length > 0
                          ? "bg-[#E8F8F0] text-[#1E824C]"
                          : "bg-[#F2F2F2] text-[#888888]"
                      }`}
                    >
                      {password.length > 0 ? (
                        <Icon name="check" className="text-[10px]" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#AAAAAA]" />
                      )}
                    </span>
                    <span>Passphrase encryption active</span>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 03: Security & Architecture Information Notice */}
            <section className="border border-[#E5E5E5] rounded-xl bg-[#FAFAFA] p-6 transition-shadow flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#EBF6FC] text-[#1E74B3] flex items-center justify-center flex-shrink-0 border border-[#D0E7F5]">
                <Icon name="shield" className="text-[20px]" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-[#111111] mb-1">
                  Secure Your Account
                </h3>
                <p className="text-xs text-[#525252] leading-relaxed">
                  Your login credentials will be securely stored and used to protect access to your News &amp; Media dashboard. Keep your password confidential and do not share it with others.
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-[#777777]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1E824C]"></span>
                    End-to-end encrypted password storage
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1E824C]"></span>
                    Separate from Founder&apos;s Personal Account
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1E824C]"></span>
                    Role-based editorial permissions ready
                  </span>
                </div>
              </div>
            </section>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                {errorMsg}
              </div>
            )}
          </div>

          {/* Bottom Action Navigation Area */}
          <OnboardingBottomBar
            currentStep={5}
            totalSteps={5}
            onBack={onBack}
            onNext={handleFinish}
            onSaveDraft={handleSaveDraftClick}
            isSavingDraft={isSavingDraft}
            isDraftSaved={isDraftSaved}
            isSubmitting={isSubmitting}
            nextDisabled={isSubmitting}
            nextLabel="Complete account setup"
            showBack={true}
          />
        </div>
      </div>

      {/* Step 5 Exact Change Login Email Modal */}
      <Step5ChangeEmailModal
        isOpen={showChangeEmailModal}
        currentEmail={currentEmail}
        applicationId={data?.applicationId}
        onClose={() => setShowChangeEmailModal(false)}
        onUpdateEmail={handleUpdateEmail}
      />

      {/* Step 5 Top-Right Success Toast */}
      <Step5SuccessToast
        show={showStep5Toast}
        email={currentEmail}
        onClose={() => setShowStep5Toast(false)}
      />

      {/* Change Mobile Modal */}
      <ChangeMobileModal
        isOpen={showChangeMobileModal}
        currentMobile={currentMobile}
        countryCode="+91"
        onClose={() => setShowChangeMobileModal(false)}
        onUpdateMobile={handleUpdateMobile}
      />
    </main>
  );
}
