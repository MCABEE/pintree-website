"use client";

import { useState, useEffect } from "react";
import Icon from "./Icon";
import Stepper from "./Stepper";
import OnboardingBottomBar from "./OnboardingBottomBar";
import {
  PUBLICATION_TYPE_LABELS,
  OWNER_ROLE_LABELS,
  LEGAL_ORG_TYPE_LABELS,
  GRIEVANCE_COUNCIL_LABELS,
  formatOwnerRole,
  submitApplication,
  registerDedicatedCredentials,
  getActiveApplication,
  getApplicationById,
  fetchLocations,
  getCachedDraft,
  setCachedDraft,
  normalizeDoc,
  isRealUploadedDoc,
} from "@/utils/newsMediaOnboarding";
import { fetchAndPersistCurrentUserProfile } from "@/utils/auth";

export default function Step4ReviewSubmit({
  data = {},
  onJumpToStep,
  onNext,
  onBack,
  onSaveDraft,
  isSavingDraft = false,
}) {
  const [confirmed, setConfirmed] = useState(true);
  const [avatarError, setAvatarError] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // Dedicated Auth Form States (fallback when submitting)
  const [authPassword, setAuthPassword] = useState("");
  const [authConfirmPassword, setAuthConfirmPassword] = useState("");
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authRegistered, setAuthRegistered] = useState(false);
  const [authError, setAuthError] = useState("");

  const [activeAppData, setActiveAppData] = useState(null);
  const [liveOwner, setLiveOwner] = useState(null);
  const [resolvedStateName, setResolvedStateName] = useState("");
  const [resolvedCountryName, setResolvedCountryName] = useState("");
  const [resolvedLanguageName, setResolvedLanguageName] = useState("");

  const isIdString = (val) =>
    !val ||
    typeof val !== "string" ||
    /^cm[a-z0-9]{15,}$/i.test(val) ||
    /^state[-_]/i.test(val) ||
    /^st[-_]/i.test(val);

  useEffect(() => {
    // In UI mode, resolve directly from cached draft
    if (typeof window !== "undefined") {
      const draft = getCachedDraft();
      if (draft) {
        setActiveAppData(draft);
        if (draft.stateName && !isIdString(draft.stateName)) {
          setResolvedStateName(draft.stateName);
        }
        if (draft.countryName || draft.registeredOfficeCountryName) {
          setResolvedCountryName(
            draft.countryName || draft.registeredOfficeCountryName
          );
        }
      }
    }
  }, [data]);

  useEffect(() => {
    let isCancelled = false;
    async function loadLiveOwner() {
      const profile = await fetchAndPersistCurrentUserProfile();
      if (!isCancelled && profile && profile.fullName) {
        const ownerObj = {
          userId: profile.userId,
          fullName: profile.fullName,
          handle: profile.handle,
          email: profile.email,
          phone: profile.phone,
          profileImageUrl: profile.profileImageUrl,
        };
        setAvatarError(false);
        setLiveOwner(ownerObj);
        setCachedDraft({ owner: ownerObj, isAccountConnected: true });
      }
    }
    loadLiveOwner();
    return () => {
      isCancelled = true;
    };
  }, []);

  // Fallback primary language lookup via locations if primaryLanguage name is missing
  useEffect(() => {
    let isMounted = true;
    const existingLang =
      data?.primaryLanguageName ||
      data?.primaryLanguage ||
      activeAppData?.primaryLanguageName ||
      activeAppData?.primaryLanguage;
    if (existingLang && !isIdString(existingLang)) {
      setResolvedLanguageName(existingLang);
      return;
    }
    const langId = data?.primaryLanguageId || activeAppData?.primaryLanguageId;
    if (langId) {
      fetchLocations("languages", { limit: 100 })
        .then((list) => {
          if (isMounted && Array.isArray(list)) {
            const matched = list.find((l) => l.id === langId);
            if (matched?.language || matched?.name) {
              setResolvedLanguageName(matched.language || matched.name);
            }
          }
        })
        .catch(() => {});
    }
    return () => {
      isMounted = false;
    };
  }, [data?.primaryLanguageId, data?.primaryLanguageName, data?.primaryLanguage, activeAppData]);

  // Fallback state lookup via locations if stateName is missing or is raw ID
  useEffect(() => {
    let isMounted = true;
    const currentState =
      activeAppData?.stateName ||
      resolvedStateName ||
      data?.stateName ||
      data?.state;

    if (currentState && !isIdString(currentState)) {
      setResolvedStateName(currentState);
      return;
    }

    const stateId = activeAppData?.stateId || data?.stateId;
    if (stateId) {
      async function lookupState() {
        try {
          const countryId =
            activeAppData?.countryId ||
            data?.countryId ||
            "cnt_in";
          const list = await fetchLocations("states", { countryId });
          if (isMounted && Array.isArray(list)) {
            const matched = list.find(
              (s) =>
                s.id === stateId ||
                s.code === stateId ||
                (s.code && `state-${s.code.toLowerCase()}` === stateId) ||
                (s.id && s.id.replace(/^st_/, "") === stateId.replace(/^state-/, ""))
            );
            if (matched?.name) {
              setResolvedStateName(matched.name);
            }
          }
        } catch (e) {}
      }
      lookupState();
    }
    return () => {
      isMounted = false;
    };
  }, [data?.stateId, data?.stateName, data?.state, activeAppData, resolvedStateName]);

  const [draftData, setDraftData] = useState(null);
  useEffect(() => {
    setDraftData(getCachedDraft());
  }, []);

  const displayPubName =
    data?.publicationName ||
    draftData?.publicationName ||
    activeAppData?.publicationName ||
    "";

  const displayOrgName =
    data?.registeredOrgName ||
    data?.registeredOrganisationName ||
    draftData?.registeredOrgName ||
    draftData?.registeredOrganisationName ||
    activeAppData?.registeredOrgName ||
    activeAppData?.registeredOrganisationName ||
    "";

  const rawPubType =
    data?.publicationType ||
    draftData?.publicationType ||
    activeAppData?.publicationType ||
    "";

  const displayPubType =
    PUBLICATION_TYPE_LABELS[rawPubType] ||
    PUBLICATION_TYPE_LABELS[rawPubType?.toUpperCase()] ||
    PUBLICATION_TYPE_LABELS[rawPubType?.toLowerCase()] ||
    (rawPubType ? rawPubType : "—");

  const displayWebsite =
    data?.officialWebsite ||
    data?.website ||
    draftData?.officialWebsite ||
    draftData?.website ||
    activeAppData?.officialWebsite ||
    activeAppData?.website ||
    "";

  const displayCountry =
    activeAppData?.countryName ||
    activeAppData?.registeredOfficeCountryName ||
    resolvedCountryName ||
    data?.registeredOfficeCountryName ||
    data?.countryName ||
    (data?.countryId === "cnt_in" ||
    data?.countryId === "country-in" ||
    data?.registeredOfficeCountryId === "cnt_in" ||
    data?.registeredOfficeCountryId === "country-in"
      ? "India"
      : null) ||
    (data?.country && !isIdString(data.country) && !data.country.startsWith("cnt_")
      ? data.country
      : null) ||
    "India";

  const displayLegalOrgType =
    data?.legalOrgType || draftData?.legalOrgType || activeAppData?.legalOrgType || "";
  const displayRegNumber =
    data?.legalRegistrationNumber || draftData?.legalRegistrationNumber || activeAppData?.legalRegistrationNumber || "";
  const displayRegAuthority =
    data?.registrationAuthority || draftData?.registrationAuthority || activeAppData?.registrationAuthority || "";
  const displayRegDate =
    data?.dateOfRegistration || draftData?.dateOfRegistration || activeAppData?.dateOfRegistration || "";
  const displayRegulatoryRef =
    data?.regulatoryReferenceId || draftData?.regulatoryReferenceId || activeAppData?.regulatoryReferenceId || "";
  const displayGrievanceCouncil =
    data?.industryGrievanceCouncil || draftData?.industryGrievanceCouncil || activeAppData?.industryGrievanceCouncil || "";

  const rawStateValue =
    activeAppData?.stateName ||
    resolvedStateName ||
    data?.stateName ||
    (data?.state && !isIdString(data.state) ? data.state : null);

  const displayState =
    rawStateValue && !isIdString(rawStateValue)
      ? rawStateValue
      : resolvedStateName && !isIdString(resolvedStateName)
      ? resolvedStateName
      : "—";

  const currentDraft = typeof window !== "undefined" ? getCachedDraft() : null;

  const displayTwitter = (
    data?.xProfileUrl ||
    data?.twitter ||
    data?.twitterUrl ||
    data?.socialLinks?.twitter ||
    data?.socialProfiles?.x ||
    currentDraft?.xProfileUrl ||
    currentDraft?.twitter ||
    currentDraft?.twitterUrl ||
    currentDraft?.socialLinks?.twitter ||
    currentDraft?.socialProfiles?.x ||
    draftData?.xProfileUrl ||
    draftData?.twitter ||
    draftData?.socialLinks?.twitter ||
    draftData?.socialProfiles?.x ||
    activeAppData?.xProfileUrl ||
    activeAppData?.twitter ||
    activeAppData?.socialLinks?.twitter ||
    activeAppData?.socialProfiles?.x ||
    ""
  ).trim();

  const displayFacebook = (
    data?.facebookPageUrl ||
    data?.facebook ||
    data?.facebookUrl ||
    data?.socialLinks?.facebook ||
    data?.socialProfiles?.facebook ||
    currentDraft?.facebookPageUrl ||
    currentDraft?.facebook ||
    currentDraft?.facebookUrl ||
    currentDraft?.socialLinks?.facebook ||
    currentDraft?.socialProfiles?.facebook ||
    draftData?.facebookPageUrl ||
    draftData?.facebook ||
    draftData?.socialLinks?.facebook ||
    draftData?.socialProfiles?.facebook ||
    activeAppData?.facebookPageUrl ||
    activeAppData?.facebook ||
    activeAppData?.socialLinks?.facebook ||
    activeAppData?.socialProfiles?.facebook ||
    ""
  ).trim();

  const displayInstagram = (
    data?.instagramProfileUrl ||
    data?.instagram ||
    data?.instagramUrl ||
    data?.socialLinks?.instagram ||
    data?.socialProfiles?.instagram ||
    currentDraft?.instagramProfileUrl ||
    currentDraft?.instagram ||
    currentDraft?.instagramUrl ||
    currentDraft?.socialLinks?.instagram ||
    currentDraft?.socialProfiles?.instagram ||
    draftData?.instagramProfileUrl ||
    draftData?.instagram ||
    draftData?.socialLinks?.instagram ||
    draftData?.socialProfiles?.instagram ||
    activeAppData?.instagramProfileUrl ||
    activeAppData?.instagram ||
    activeAppData?.socialLinks?.instagram ||
    activeAppData?.socialProfiles?.instagram ||
    ""
  ).trim();

  const displayYouTube = (
    data?.youtubeChannelUrl ||
    data?.youtube ||
    data?.youtubeUrl ||
    data?.socialLinks?.youtube ||
    data?.socialProfiles?.youtube ||
    currentDraft?.youtubeChannelUrl ||
    currentDraft?.youtube ||
    currentDraft?.youtubeUrl ||
    currentDraft?.socialLinks?.youtube ||
    currentDraft?.socialProfiles?.youtube ||
    draftData?.youtubeChannelUrl ||
    draftData?.youtube ||
    draftData?.socialLinks?.youtube ||
    draftData?.socialProfiles?.youtube ||
    activeAppData?.youtubeChannelUrl ||
    activeAppData?.youtube ||
    activeAppData?.socialLinks?.youtube ||
    activeAppData?.socialProfiles?.youtube ||
    ""
  ).trim();

  const handleContinue = () => {
    if (!confirmed) {
      alert("Please confirm the statutory declaration before proceeding.");
      return;
    }
    if (onNext) {
      onNext();
    } else if (onJumpToStep) {
      onJumpToStep(5);
    }
  };

  const handleCopyReference = () => {
    if (!submissionResult?.referenceId) return;
    navigator.clipboard.writeText(submissionResult.referenceId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleRegisterDedicatedAuth = async (e) => {
    e.preventDefault();
    if (authPassword.length < 8) {
      setAuthError("Password must be at least 8 characters long.");
      return;
    }
    if (authPassword !== authConfirmPassword) {
      setAuthError("Passwords do not match.");
      return;
    }

    setAuthSubmitting(true);
    setAuthError("");
    try {
      await registerDedicatedCredentials({
        applicationId: submissionResult?.applicationId || data.applicationId || "temp",
        email: data.officialEmail || "",
        password: authPassword,
        confirmPassword: authConfirmPassword,
        device: {
          deviceId: "dev-web-01",
          deviceName: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 50) : "Web",
          deviceType: "WEB",
        },
      });
      setAuthRegistered(true);
    } catch (err) {
      setAuthError(err.message || "Failed to register credentials.");
    } finally {
      setAuthSubmitting(false);
    }
  };

  // If application has been submitted, display the submission confirmation view
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
      "";

    const accountTypeLabel =
      PUBLICATION_TYPE_LABELS[rawPubType] ||
      PUBLICATION_TYPE_LABELS[rawPubType?.toUpperCase()] ||
      PUBLICATION_TYPE_LABELS[rawPubType?.toLowerCase()] ||
      (rawPubType ? rawPubType : "—");

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

  // Pre-submission Review screen documents
  const documents = (data?.documents && data.documents.length > 0)
    ? data.documents
    : (currentDraft?.documents && currentDraft.documents.length > 0)
    ? currentDraft.documents
    : (draftData?.documents && draftData.documents.length > 0)
    ? draftData.documents
    : (activeAppData?.documents || []);

  const realDocs = (documents || []).filter(isRealUploadedDoc);

  const rawOrgDoc = realDocs.find(
    (d) => d.documentType === "ORGANISATION_REGISTRATION" || d.type === "REGISTRATION"
  );
  const rawMediaDoc = realDocs.find(
    (d) => d.documentType === "MEDIA_AUTHORISATION" || d.type === "MEDIA_AUTH"
  );

  const orgRegDoc = rawOrgDoc ? normalizeDoc(rawOrgDoc) : null;
  const mediaAuthDoc = rawMediaDoc ? normalizeDoc(rawMediaDoc) : null;
  const orgRegDocName = (orgRegDoc?.originalName || orgRegDoc?.name || orgRegDoc?.fileName || "").trim();
  const mediaAuthDocName = (mediaAuthDoc?.originalName || mediaAuthDoc?.name || mediaAuthDoc?.fileName || "").trim();

  return (
    <main className="w-full max-w-7xl mx-auto px-gutter font-jakarta">
      <div className="flex flex-col w-full">
        <div className="w-full max-w-[1280px] mx-auto pb-24 pt-4 md:pt-8 text-on-surface">
          {/* Top Breadcrumb & Metadata Ribbon */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant mb-6">
            <span
              className="hover:text-primary transition-colors cursor-pointer"
              onClick={() => onJumpToStep?.(1)}
            >
              Professional &amp; Public Accounts
            </span>
            <span className="text-outline-variant font-light">/</span>
            <span className="text-on-surface font-label-sm font-medium">News &amp; Media</span>
          </nav>

          {/* Main Section Heading */}
          <header className="mb-10 lg:mb-12">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-fixed text-label-sm font-label-sm mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Account Onboarding
                </span>
                <h1 className="font-aeonik text-3xl md:text-[34px] leading-tight text-primary font-medium tracking-tight">
                  Review Your Application
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-2 font-jakarta">
                  Review the information provided for your News &amp; Media account. Make sure everything is accurate before submitting your application.
                </p>
              </div>
              <div className="hidden lg:flex items-center gap-2 text-label-sm font-label-sm text-on-surface-variant bg-surface-container-low px-3.5 py-2 rounded-xl">
                <Icon name="verified_user" className="text-secondary text-[18px]" />
                <span>Official Identity Verification Required</span>
              </div>
            </div>
          </header>

          {/* 5-Stage Progress Stepper */}
          <Stepper currentStep={4} onStepClick={onJumpToStep} />

          {/* Review Form Content Stack */}
          <div className="flex flex-col gap-6">
            {/* SECTION 01: Organisation Information */}
            <div className="rounded-xl bg-surface-container-lowest border border-surface-container-highest p-6 sm:p-8">
              <div className="flex items-center justify-between pb-6 border-b border-surface-container-highest">
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold tracking-wider">
                    Section 01
                  </span>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    Organisation Information
                  </h2>
                </div>
                <button
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-surface-container-highest hover:border-primary text-on-surface font-label-md text-label-md transition-colors cursor-pointer"
                  type="button"
                  onClick={() => onJumpToStep?.(1)}
                >
                  <Icon name="edit" className="text-[16px]" />
                  <span>Edit Step 1</span>
                </button>
              </div>
              <div className="pt-6 flex flex-col gap-6">
                <div>
                  <h3 className="font-label-md text-label-md font-bold text-on-surface uppercase tracking-wider mb-3">
                    Media / Publication Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded bg-surface-container-low">
                      <span className="block font-label-sm text-label-sm text-on-surface-variant">Publication Type</span>
                      <span className="font-body-md text-body-md font-medium text-on-surface mt-0.5 block">
                        {displayPubType || "—"}
                      </span>
                    </div>
                    <div className="p-3.5 rounded bg-surface-container-low">
                      <span className="block font-label-sm text-label-sm text-on-surface-variant">Media / Publication Name</span>
                      <span className="font-body-md text-body-md font-medium text-on-surface mt-0.5 block">
                        {displayPubName || "—"}
                      </span>
                    </div>
                    <div className="p-3.5 rounded bg-surface-container-low">
                      <span className="block font-label-sm text-label-sm text-on-surface-variant">Registered Organisation Name</span>
                      <span className="font-body-md text-body-md font-medium text-on-surface mt-0.5 block">
                        {displayOrgName || "—"}
                      </span>
                    </div>
                    <div className="p-3.5 rounded bg-surface-container-low">
                      <span className="block font-label-sm text-label-sm text-on-surface-variant">Official Website</span>
                      {displayWebsite ? (
                        <a
                          className="font-body-md text-body-md font-medium text-on-surface hover:underline inline-flex items-center gap-1 mt-0.5"
                          href={
                            displayWebsite.startsWith("http://") || displayWebsite.startsWith("https://")
                              ? displayWebsite
                              : `https://${displayWebsite}`
                          }
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {displayWebsite.replace(/^https?:\/\//i, "")}
                          <Icon name="open_in_new" className="text-[14px]" />
                        </a>
                      ) : (
                        <span className="font-body-md text-body-md font-medium text-on-surface-variant mt-0.5 block">—</span>
                      )}
                    </div>
                    <div className="p-3.5 rounded bg-surface-container-low">
                      <span className="block font-label-sm text-label-sm text-on-surface-variant">Primary Language</span>
                      <span className="font-body-md text-body-md font-medium text-on-surface mt-0.5 block">
                        {resolvedLanguageName ||
                          data?.primaryLanguageName ||
                          data?.primaryLanguage ||
                          activeAppData?.primaryLanguageName ||
                          activeAppData?.primaryLanguage ||
                          (data?.primaryLanguageId && !isIdString(data.primaryLanguageId)
                            ? data.primaryLanguageId.toUpperCase()
                            : "—")}
                      </span>
                    </div>
                    <div className="p-3.5 rounded bg-surface-container-low">
                      <span className="block font-label-sm text-label-sm text-on-surface-variant">Year Established</span>
                      <span className="font-body-md text-body-md font-medium text-on-surface mt-0.5 block">
                        {data?.yearEstablished || activeAppData?.yearEstablished || "—"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-label-md text-label-md font-bold text-on-surface uppercase tracking-wider mb-3">
                    Organisation Contact Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-3.5 rounded bg-surface-container-low">
                      <span className="block font-label-sm text-label-sm text-on-surface-variant">Official Email Address</span>
                      <span className="font-body-md text-body-md font-medium text-on-surface mt-0.5 block truncate">
                        {data?.officialEmail || activeAppData?.officialEmail || "—"}
                      </span>
                    </div>
                    <div className="p-3.5 rounded bg-surface-container-low">
                      <span className="block font-label-sm text-label-sm text-on-surface-variant">Primary Mobile Number</span>
                      <span className="font-body-md text-body-md font-medium text-on-surface mt-0.5 block">
                        {(() => {
                          const num = data?.primaryMobileNumber || activeAppData?.primaryMobileNumber || "";
                          const code = data?.primaryMobileCountryCode || activeAppData?.primaryMobileCountryCode || "+91";
                          if (!num) return "—";
                          return String(num).startsWith("+") ? num : `${code} ${num}`;
                        })()}
                      </span>
                    </div>
                    <div className="p-3.5 rounded bg-surface-container-low">
                      <span className="block font-label-sm text-label-sm text-on-surface-variant">Office Landline</span>
                      <span className="font-body-md text-body-md font-medium text-on-surface mt-0.5 block">
                        {(() => {
                          const num =
                            data?.officeLandlineNumber ||
                            data?.landlineNumber ||
                            activeAppData?.officeLandlineNumber ||
                            activeAppData?.landlineNumber ||
                            "";
                          const std =
                            data?.officeLandlineStdCode ||
                            data?.landlineStdCode ||
                            data?.landlineAreaCode ||
                            activeAppData?.officeLandlineStdCode ||
                            activeAppData?.landlineStdCode ||
                            "";
                          const code =
                            data?.officeLandlineCountryCode ||
                            data?.landlineCountryCode ||
                            activeAppData?.officeLandlineCountryCode ||
                            "+91";
                          if (!num) return "—";
                          return `${code} ${std ? `${std} ` : ""}${num}`;
                        })()}
                      </span>
                    </div>
                    <div className="p-3.5 rounded bg-surface-container-low">
                      <span className="block font-label-sm text-label-sm text-on-surface-variant">Additional Contact</span>
                      <span className="font-body-md text-body-md font-medium text-on-surface mt-0.5 block">
                        {(() => {
                          const altNum =
                            data?.additionalMobileNumber ||
                            data?.altMobileNumber ||
                            activeAppData?.additionalMobileNumber ||
                            activeAppData?.altMobileNumber ||
                            "";
                          const altCode =
                            data?.additionalMobileCountryCode ||
                            data?.altMobileCountryCode ||
                            activeAppData?.additionalMobileCountryCode ||
                            "+91";
                          if (altNum) {
                            return String(altNum).startsWith("+") ? altNum : `${altCode} ${altNum}`;
                          }
                          return data?.additionalContact || activeAppData?.additionalContact || "—";
                        })()}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-label-md text-label-md font-bold text-on-surface uppercase tracking-wider mb-3">
                    Registered Office Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                    <div className="p-3.5 rounded bg-surface-container-low">
                      <span className="block font-label-sm text-label-sm text-on-surface-variant">Country</span>
                      <span className="font-body-md text-body-md font-medium text-on-surface mt-0.5 block">
                        {displayCountry}
                      </span>
                    </div>
                    <div className="p-3.5 rounded bg-surface-container-low">
                      <span className="block font-label-sm text-label-sm text-on-surface-variant">State</span>
                      <span className="font-body-md text-body-md font-medium text-on-surface mt-0.5 block">
                        {displayState}
                      </span>
                    </div>
                    <div className="p-3.5 rounded bg-surface-container-low">
                      <span className="block font-label-sm text-label-sm text-on-surface-variant">District / City</span>
                      <span className="font-body-md text-body-md font-medium text-on-surface mt-0.5 block">
                        {activeAppData?.cityName || data?.cityName || data?.city || activeAppData?.districtName || data?.districtName || "—"}
                      </span>
                    </div>
                    <div className="p-3.5 rounded bg-surface-container-low">
                      <span className="block font-label-sm text-label-sm text-on-surface-variant">Postal Code</span>
                      <span className="font-body-md text-body-md font-medium text-on-surface mt-0.5 block">
                        {activeAppData?.postalCode || data?.postalCode || "—"}
                      </span>
                    </div>
                  </div>
                  <div className="p-3.5 rounded bg-surface-container-low">
                    <span className="block font-label-sm text-label-sm text-on-surface-variant">Full Registered Address</span>
                    <span className="font-body-md text-body-md font-medium text-on-surface mt-0.5 block">
                      {activeAppData?.fullAddress || data?.fullAddress || "—"}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-label-md text-label-md font-bold text-on-surface uppercase tracking-wider mb-3">
                    Publication Overview
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3.5 rounded bg-surface-container-low">
                      <span className="block font-label-sm text-label-sm text-on-surface-variant">Short Description</span>
                      <p className="font-body-md text-body-md text-on-surface mt-0.5">
                        {data?.shortDescription || "—"}
                      </p>
                    </div>
                    <div className="p-3.5 rounded bg-surface-container-low">
                      <span className="block font-label-sm text-label-sm text-on-surface-variant">About the Publication</span>
                      <p className="font-body-md text-body-md text-on-surface mt-0.5">
                        {data?.aboutPublication || "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 02: Founder & Owner Information */}
            <div className="rounded-xl bg-surface-container-lowest border border-surface-container-highest p-6 sm:p-8">
              <div className="flex items-center justify-between pb-6 border-b border-surface-container-highest">
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold tracking-wider">
                    Section 02
                  </span>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    Founder &amp; Owner Information
                  </h2>
                </div>
                <button
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-surface-container-highest hover:border-primary text-on-surface font-label-md text-label-md transition-colors cursor-pointer"
                  type="button"
                  onClick={() => onJumpToStep?.(2)}
                >
                  <Icon name="edit" className="text-[16px]" />
                  <span>Edit Step 2</span>
                </button>
              </div>
              <div className="pt-6 flex flex-col gap-5">
                {(() => {
                  const reviewOwner = liveOwner || data?.owner || activeAppData?.owner || {};
                  const reviewOwnerName = reviewOwner?.fullName || "Organisation Owner";
                  const reviewOwnerInitials = reviewOwner?.fullName
                    ? reviewOwner.fullName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
                    : "U";
                  return (
                    <div className="p-4 sm:p-5 rounded-lg bg-surface-container-low flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-[#3f6372] text-white flex items-center justify-center font-bold text-[18px] shrink-0 border border-surface-container-highest overflow-hidden">
                          {avatarError || !reviewOwner?.profileImageUrl ? (
                            <span>{reviewOwnerInitials}</span>
                          ) : (
                            <img
                              alt={reviewOwnerName}
                              className="w-full h-full object-cover"
                              src={reviewOwner.profileImageUrl}
                              onError={() => setAvatarError(true)}
                            />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-title-md text-title-md font-bold text-on-surface">
                              {reviewOwnerName}
                            </span>
                            {reviewOwner?.handle && (
                              <span className="font-label-sm text-label-sm text-on-surface-variant">
                                {reviewOwner.handle}
                              </span>
                            )}
                          </div>
                          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                            {formatOwnerRole(data?.ownerRole, data?.otherRoleSpecification)}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface font-label-sm text-label-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim"></span> Authenticated Pintree Account
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface font-label-sm text-label-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Primary Custodian
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Owner Account Connected
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="md:text-right border-t md:border-t-0 pt-3 md:pt-0 border-surface-container-highest">
                        <span className="block font-label-sm text-label-sm text-on-surface-variant">
                          Designated Organisational Role
                        </span>
                        <span className="font-label-md text-label-md font-bold text-on-surface mt-0.5 block">
                          {formatOwnerRole(data?.ownerRole, data?.otherRoleSpecification)}
                        </span>
                      </div>
                    </div>
                  );
                })()}
                <div className="p-3.5 rounded bg-surface-container-low flex items-start gap-2.5">
                  <Icon name="verified" className="text-[18px] text-tertiary-fixed-dim flex-shrink-0 mt-0.5" />
                  <p className="font-body-sm text-body-sm text-on-surface">
                    <strong className="font-semibold text-on-surface">Authorized Signatory Confirmed</strong> — Verified authority to create and manage News &amp; Media account on behalf of the registered organisation.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 03: Organisation & Media Verification */}
            <div className="rounded-xl bg-surface-container-lowest border border-surface-container-highest p-6 sm:p-8">
              <div className="flex items-center justify-between pb-6 border-b border-surface-container-highest">
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold tracking-wider">
                    Section 03
                  </span>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    Organisation &amp; Media Verification
                  </h2>
                </div>
                <button
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-surface-container-highest hover:border-primary text-on-surface font-label-md text-label-md transition-colors cursor-pointer"
                  type="button"
                  onClick={() => onJumpToStep?.(3)}
                >
                  <Icon name="edit" className="text-[16px]" />
                  <span>Edit Step 3</span>
                </button>
              </div>
              <div className="pt-6 flex flex-col gap-6">
                <div>
                  <h3 className="font-label-md text-label-md font-bold text-on-surface uppercase tracking-wider mb-3">
                    Organisation Registration Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3.5 rounded bg-surface-container-low">
                      <span className="block font-label-sm text-label-sm text-on-surface-variant">Legal Organisation Type</span>
                      <span className="font-body-md text-body-md font-medium text-on-surface mt-0.5 block">
                        {LEGAL_ORG_TYPE_LABELS[displayLegalOrgType] || displayLegalOrgType || "—"}
                      </span>
                    </div>
                    <div className="p-3.5 rounded bg-surface-container-low">
                      <span className="block font-label-sm text-label-sm text-on-surface-variant">Registration Number (CIN)</span>
                      <span className="font-body-md text-body-md font-medium font-mono text-on-surface mt-0.5 block">
                        {displayRegNumber || "—"}
                      </span>
                    </div>
                    <div className="p-3.5 rounded bg-surface-container-low">
                      <span className="block font-label-sm text-label-sm text-on-surface-variant">Registration Authority</span>
                      <span className="font-body-md text-body-md font-medium text-on-surface mt-0.5 block">
                        {displayRegAuthority || "—"}
                      </span>
                    </div>
                    <div className="p-3.5 rounded bg-surface-container-low">
                      <span className="block font-label-sm text-label-sm text-on-surface-variant">Date of Registration</span>
                      <span className="font-body-md text-body-md font-medium text-on-surface mt-0.5 block">
                        {displayRegDate ? displayRegDate.split("T")[0] : "—"}
                      </span>
                    </div>
                    <div className="p-3.5 rounded bg-surface-container-low">
                      <span className="block font-label-sm text-label-sm text-on-surface-variant">Registered Office Country</span>
                      <span className="font-body-md text-body-md font-medium text-on-surface mt-0.5 block">
                        {displayCountry}
                      </span>
                    </div>
                    <div className="p-3.5 rounded bg-surface-container-low">
                      <span className="block font-label-sm text-label-sm text-on-surface-variant">Registered Legal Name</span>
                      <span className="font-body-md text-body-md font-medium text-on-surface mt-0.5 block truncate">
                        {displayOrgName || "—"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-label-md text-label-md font-bold text-on-surface uppercase tracking-wider mb-3">
                    Media / Publication Authorisation
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3.5 rounded bg-surface-container-low">
                      <span className="block font-label-sm text-label-sm text-on-surface-variant">Publication Name</span>
                      <span className="font-body-md text-body-md font-medium text-on-surface mt-0.5 block">
                        {displayPubName || "—"}
                      </span>
                    </div>
                    <div className="p-3.5 rounded bg-surface-container-low">
                      <span className="block font-label-sm text-label-sm text-on-surface-variant">Official Website</span>
                      {displayWebsite ? (
                        <a
                          className="font-body-md text-body-md font-medium text-on-surface hover:underline inline-flex items-center gap-1 mt-0.5 truncate max-w-full"
                          href={
                            displayWebsite.startsWith("http://") || displayWebsite.startsWith("https://")
                              ? displayWebsite
                              : `https://${displayWebsite}`
                          }
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <span className="truncate">{displayWebsite.replace(/^https?:\/\//i, "")}</span>
                          <Icon name="open_in_new" className="text-[14px] flex-shrink-0" />
                        </a>
                      ) : (
                        <span className="font-body-md text-body-md font-medium text-on-surface-variant mt-0.5 block">—</span>
                      )}
                    </div>
                    <div className="p-3.5 rounded bg-surface-container-low">
                      <span className="block font-label-sm text-label-sm text-on-surface-variant">Publishing Organisation</span>
                      <span className="font-body-md text-body-md font-medium text-on-surface mt-0.5 block truncate">
                        {displayOrgName || "—"}
                      </span>
                    </div>
                    <div className="p-3.5 rounded bg-surface-container-low">
                      <span className="block font-label-sm text-label-sm text-on-surface-variant">Regulatory Reference / ID</span>
                      <span className="font-body-md text-body-md font-medium font-mono text-on-surface mt-0.5 block">
                        {displayRegulatoryRef || "—"}
                      </span>
                    </div>
                    <div className="p-3.5 rounded bg-surface-container-low">
                      <span className="block font-label-sm text-label-sm text-on-surface-variant">Industry Body</span>
                      <span className="font-body-md text-body-md font-medium text-on-surface mt-0.5 block">
                        {GRIEVANCE_COUNCIL_LABELS[displayGrievanceCouncil] || displayGrievanceCouncil || "—"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-label-md text-label-md font-bold text-on-surface uppercase tracking-wider mb-3">
                    Supporting Verification Documents
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {orgRegDocName ? (
                      <div className="p-4 rounded-lg bg-surface-container-low flex items-center justify-between border border-surface-container-highest">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded bg-surface-container-highest flex items-center justify-center flex-shrink-0">
                            <Icon name="description" className="text-[20px] text-on-surface" />
                          </div>
                          <div className="truncate">
                            <span className="font-label-md text-label-md font-semibold text-on-surface block truncate">
                              {orgRegDocName}
                            </span>
                            <span className="font-label-sm text-label-sm text-on-surface-variant">
                              PDF · {orgRegDoc?.fileSizeFormatted || orgRegDoc?.size || "Uploaded"} · Legal Entity Proof
                            </span>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded bg-surface-container text-on-surface font-label-sm text-label-sm font-medium flex-shrink-0 ml-2">
                          Uploaded
                        </span>
                      </div>
                    ) : (
                      <div className="p-4 rounded-lg bg-surface-container-low flex items-center gap-3 border border-dashed border-surface-container-highest text-on-surface-variant">
                        <Icon name="attach_file" className="text-[20px]" />
                        <span className="font-body-sm text-body-sm">No organisation registration document uploaded</span>
                      </div>
                    )}

                    {mediaAuthDocName ? (
                      <div className="p-4 rounded-lg bg-surface-container-low flex items-center justify-between border border-surface-container-highest">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded bg-surface-container-highest flex items-center justify-center flex-shrink-0">
                            <Icon name="article" className="text-[20px] text-on-surface" />
                          </div>
                          <div className="truncate">
                            <span className="font-label-md text-label-md font-semibold text-on-surface block truncate">
                              {mediaAuthDocName}
                            </span>
                            <span className="font-label-sm text-label-sm text-on-surface-variant">
                              PDF · {mediaAuthDoc?.fileSizeFormatted || mediaAuthDoc?.size || "Uploaded"} · Editorial Governance
                            </span>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded bg-surface-container text-on-surface font-label-sm text-label-sm font-medium flex-shrink-0 ml-2">
                          Uploaded
                        </span>
                      </div>
                    ) : (
                      <div className="p-4 rounded-lg bg-surface-container-low flex items-center gap-3 border border-dashed border-surface-container-highest text-on-surface-variant">
                        <Icon name="article" className="text-[20px]" />
                        <span className="font-body-sm text-body-sm">No media accreditation document uploaded (Optional)</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 04: Official Social Media & Online Presence */}
            <div className="rounded-xl bg-surface-container-lowest border border-surface-container-highest p-6 sm:p-8">
              <div className="flex items-center justify-between pb-6 border-b border-surface-container-highest">
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold tracking-wider">
                    Section 04
                  </span>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    Official Social Media &amp; Online Presence
                  </h2>
                </div>
                <button
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-surface-container-highest hover:border-primary text-on-surface font-label-md text-label-md transition-colors cursor-pointer"
                  type="button"
                  onClick={() => onJumpToStep?.(3)}
                >
                  <Icon name="edit" className="text-[16px]" />
                  <span>Edit Step 3</span>
                </button>
              </div>
              <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* X (Twitter) */}
                <div className="p-3.5 rounded bg-surface-container-low flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded bg-primary text-on-primary flex items-center justify-center font-bold text-[14px] flex-shrink-0">
                      𝕏
                    </div>
                    <div className="min-w-0">
                      <span className="block font-label-sm text-label-sm text-on-surface-variant font-medium">
                        X (formerly Twitter)
                      </span>
                      {displayTwitter ? (
                        <a
                          className="font-body-md text-body-md font-medium text-on-surface truncate block hover:underline"
                          href={displayTwitter.startsWith("http") ? displayTwitter : (displayTwitter.startsWith("@") || !displayTwitter.includes(".") ? `https://x.com/${displayTwitter.replace(/^@/, "")}` : `https://${displayTwitter}`)}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {displayTwitter}
                        </a>
                      ) : (
                        <span className="font-body-md text-body-md text-on-surface-variant block">—</span>
                      )}
                    </div>
                  </div>
                  {displayTwitter && (
                    <Icon name="verified" className="text-[18px] text-tertiary-fixed-dim ml-2 flex-shrink-0" />
                  )}
                </div>

                {/* Facebook */}
                <div className="p-3.5 rounded bg-surface-container-low flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded bg-secondary text-on-secondary flex items-center justify-center font-bold text-[14px] flex-shrink-0">
                      f
                    </div>
                    <div className="min-w-0">
                      <span className="block font-label-sm text-label-sm text-on-surface-variant font-medium">
                        Facebook
                      </span>
                      {displayFacebook ? (
                        <a
                          className="font-body-md text-body-md font-medium text-on-surface truncate block hover:underline"
                          href={displayFacebook.startsWith("http") ? displayFacebook : (displayFacebook.startsWith("@") || !displayFacebook.includes(".") ? `https://facebook.com/${displayFacebook.replace(/^@/, "")}` : `https://${displayFacebook}`)}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {displayFacebook}
                        </a>
                      ) : (
                        <span className="font-body-md text-body-md text-on-surface-variant block">—</span>
                      )}
                    </div>
                  </div>
                  {displayFacebook && (
                    <Icon name="verified" className="text-[18px] text-tertiary-fixed-dim ml-2 flex-shrink-0" />
                  )}
                </div>

                {/* Instagram */}
                <div className="p-3.5 rounded bg-surface-container-low flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded bg-surface-container-highest text-on-surface flex items-center justify-center font-bold text-[14px] flex-shrink-0">
                      <Icon name="photo_camera" className="text-[18px]" />
                    </div>
                    <div className="min-w-0">
                      <span className="block font-label-sm text-label-sm text-on-surface-variant font-medium">
                        Instagram
                      </span>
                      {displayInstagram ? (
                        <a
                          className="font-body-md text-body-md font-medium text-on-surface truncate block hover:underline"
                          href={displayInstagram.startsWith("http") ? displayInstagram : (displayInstagram.startsWith("@") || !displayInstagram.includes(".") ? `https://instagram.com/${displayInstagram.replace(/^@/, "")}` : `https://${displayInstagram}`)}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {displayInstagram}
                        </a>
                      ) : (
                        <span className="font-body-md text-body-md text-on-surface-variant block">—</span>
                      )}
                    </div>
                  </div>
                  {displayInstagram && (
                    <Icon name="verified" className="text-[18px] text-tertiary-fixed-dim ml-2 flex-shrink-0" />
                  )}
                </div>

                {/* YouTube */}
                <div className="p-3.5 rounded bg-surface-container-low flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded bg-error text-on-error flex items-center justify-center font-bold text-[14px] flex-shrink-0">
                      <Icon name="smart_display" className="text-[18px]" />
                    </div>
                    <div className="min-w-0">
                      <span className="block font-label-sm text-label-sm text-on-surface-variant font-medium">
                        YouTube
                      </span>
                      {displayYouTube ? (
                        <a
                          className="font-body-md text-body-md font-medium text-on-surface truncate block hover:underline"
                          href={displayYouTube.startsWith("http") ? displayYouTube : (displayYouTube.startsWith("@") || !displayYouTube.includes(".") ? `https://youtube.com/${displayYouTube.startsWith("@") ? displayYouTube : `@${displayYouTube}`}` : `https://${displayYouTube}`)}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {displayYouTube}
                        </a>
                      ) : (
                        <span className="font-body-md text-body-md text-on-surface-variant block">—</span>
                      )}
                    </div>
                  </div>
                  {displayYouTube && (
                    <Icon name="verified" className="text-[18px] text-tertiary-fixed-dim ml-2 flex-shrink-0" />
                  )}
                </div>
              </div>
            </div>

            {/* SECTION 05: Contact Information Verification */}
            <div className="rounded-xl bg-surface-container-lowest border border-surface-container-highest p-6 sm:p-8">
              <div className="flex items-center justify-between pb-6 border-b border-surface-container-highest">
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold tracking-wider">
                    Section 05
                  </span>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    Contact Information Verification
                  </h2>
                </div>
                <button
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-surface-container-highest hover:border-primary text-on-surface font-label-md text-label-md transition-colors cursor-pointer"
                  type="button"
                  onClick={() => onJumpToStep?.(3)}
                >
                  <Icon name="edit" className="text-[16px]" />
                  <span>Edit Step 3</span>
                </button>
              </div>
              <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email Verification Card */}
                <div className="p-5 rounded-lg bg-surface-container-low border border-surface-container-highest flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">
                        Official Email Address
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-semibold">
                        ✓ Verified
                      </span>
                    </div>
                    <p className="font-body-lg text-body-lg font-bold text-on-surface mt-2 truncate">
                      {data?.officialEmail || "—"}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-surface-container-highest flex items-center gap-2 text-on-surface-variant">
                    <Icon name="check_circle" className="text-[16px]" />
                    <span className="font-body-sm text-body-sm">OTP verification completed successfully on Step 3</span>
                  </div>
                </div>

                {/* Phone Verification Card */}
                <div className="p-5 rounded-lg bg-surface-container-low border border-surface-container-highest flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">
                        Primary Mobile Number
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-semibold">
                        ✓ Verified
                      </span>
                    </div>
                    <p className="font-body-lg text-body-lg font-bold text-on-surface mt-2">
                      {data?.primaryMobileNumber
                        ? `${data?.primaryMobileCountryCode || "+91"} ${data?.primaryMobileNumber}`
                        : "—"}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-surface-container-highest flex items-center gap-2 text-on-surface-variant">
                    <Icon name="check_circle" className="text-[16px]" />
                    <span className="font-body-sm text-body-sm">SMS OTP verification completed successfully on Step 3</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 06: Final Declaration & Consent */}
            <div className="rounded-xl bg-surface-container-low border border-surface-container-highest p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  id="final-declaration"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-surface-container-highest text-[#0075FF] focus:ring-[#0075FF] cursor-pointer accent-[#0075FF]"
                  style={{ accentColor: "#0075FF" }}
                />
                <label
                  className="font-body-md text-body-md text-on-surface leading-relaxed cursor-pointer select-none"
                  htmlFor="final-declaration"
                >
                  I confirm that the information and documents provided in this application are accurate, genuine and complete. I am authorised to submit this organisation and agree to Pintree&apos;s applicable{" "}
                  <a
                    className="underline text-on-surface font-semibold hover:text-secondary cursor-pointer"
                    href="/terms-of-service"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Terms of Service
                  </a>
                  ,{" "}
                  <a
                    className="underline text-on-surface font-semibold hover:text-secondary cursor-pointer"
                    href="/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Privacy Policy
                  </a>{" "}
                  and verification policies.
                </label>
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <OnboardingBottomBar
            currentStep={4}
            totalSteps={5}
            onBack={() => (onBack ? onBack() : onJumpToStep?.(3))}
            onNext={handleContinue}
            onSaveDraft={onSaveDraft}
            isSavingDraft={isSavingDraft}
            nextDisabled={!confirmed}
            nextLabel="Continue"
            showBack={true}
          />
        </div>
      </div>
    </main>
  );
}
