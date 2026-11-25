"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Stepper from "./Stepper";
import OnboardingBottomBar from "./OnboardingBottomBar";
import Icon from "./Icon";
import CustomDropdown from "./CustomDropdown";
import {
  PUBLICATION_TYPE_LABELS,
  setCachedDraft,
  getCachedDraft,
  isDummyOwner,
} from "@/utils/newsMediaOnboarding";
import {
  fetchAndPersistCurrentUserProfile,
  clearAuthSession,
} from "@/utils/auth";

const OWNER_ROLE_OPTIONS = [
  { value: "FOUNDER", label: "Founder / Co-Founder" },
  { value: "CHAIRMAN_MANAGING_DIRECTOR", label: "Chairman / Managing Director" },
  { value: "OWNER_PROPRIETOR_PARTNER", label: "Owner / Proprietor / Partner" },
  { value: "EDITORIAL_STAFF", label: "Editorial Staff / Editor-in-Chief" },
  { value: "MANAGEMENT_OPERATIONS", label: "Management / Operations / Director" },
  { value: "AUTHORISED_REPRESENTATIVE", label: "Authorised Representative" },
  { value: "OTHER", label: "Other" },
];

export default function Step2FounderOwner({
  data,
  onChange,
  onNext,
  onBack,
  onSaveDraft,
  onModifyStep1,
}) {
  const router = useRouter();
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [showChangeAccountModal, setShowChangeAccountModal] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const [role, setRole] = useState(() => {
    const raw = data?.ownerRole || "FOUNDER";
    const rUpper = String(raw).toUpperCase().trim();
    if (rUpper === "CO_FOUNDER" || rUpper === "CO-FOUNDER") return "FOUNDER";
    if (rUpper === "OWNER") return "OWNER_PROPRIETOR_PARTNER";
    if (rUpper === "MANAGING_DIRECTOR") return "CHAIRMAN_MANAGING_DIRECTOR";
    if (rUpper === "DIRECTOR") return "MANAGEMENT_OPERATIONS";
    if (rUpper === "PUBLISHER") return "FOUNDER";
    if (rUpper === "EDITOR_IN_CHIEF" || rUpper === "EDITOR-IN-CHIEF") return "EDITORIAL_STAFF";
    if (rUpper === "AUTHORISED_REPRESENTATIVE") return "AUTHORISED_REPRESENTATIVE";
    if (rUpper === "OTHER") return "OTHER";
    return rUpper || "FOUNDER";
  });
  const [otherRole, setOtherRole] = useState(data?.otherRoleSpecification || "");
  const [isAuthConfirmed, setIsAuthConfirmed] = useState(
    Boolean(data?.isAuthorisedConfirmed)
  );

  const isOwnerValid = (o) =>
    Boolean(
      o &&
      typeof o === "object" &&
      !isDummyOwner(o) &&
      o.fullName &&
      o.fullName.trim() &&
      !isDummyOwner({ fullName: o.fullName, handle: o.handle, email: o.email, userId: o.userId })
    );

  const initialOwner = isOwnerValid(data?.owner) ? data.owner : null;
  const [connectedOwner, setConnectedOwner] = useState(initialOwner);
  const [isRealUserConnected, setIsRealUserConnected] = useState(Boolean(initialOwner));

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const currentOwnerRef = useRef(initialOwner);
  currentOwnerRef.current = connectedOwner || initialOwner;

  const isAccountConnected = Boolean(
    connectedOwner &&
    isOwnerValid(connectedOwner)
  );

  // Sync session from live /users/profile + localStorage directly
  const syncUserSession = useCallback(async () => {
    if (typeof window === "undefined") return;

    // Purge obsolete legacy mock values from localStorage if present
    const rawStoredName = localStorage.getItem("pintree_user_full_name") || "";
    if (rawStoredName && isDummyOwner({ fullName: rawStoredName })) {
      localStorage.removeItem("pintree_user_full_name");
      localStorage.removeItem("pintree_user_name");
      localStorage.removeItem("pintree_user_handle");
    }

    // Require an actual user personal account token, NEVER the onboarding token or mock token
    const rawAccessToken =
      localStorage.getItem("pintree_access_token") ||
      sessionStorage.getItem("pintree_access_token") ||
      "";
    if (rawAccessToken && rawAccessToken.startsWith("mock_")) {
      clearAuthSession();
    }

    const token =
      (rawAccessToken && !rawAccessToken.startsWith("mock_") ? rawAccessToken : "") ||
      (typeof document !== "undefined" && document.cookie.includes("pintree_token="));

    if (!token) {
      if (currentOwnerRef.current || connectedOwner) {
        currentOwnerRef.current = null;
        setConnectedOwner(null);
        setIsRealUserConnected(false);
        if (onChangeRef.current) {
          onChangeRef.current({ owner: null, isAccountConnected: false });
        }
        setCachedDraft({ owner: null, isAccountConnected: false });
      }
      return;
    }

    const applyOwnerObj = (candidate) => {
      if (!candidate || isDummyOwner(candidate) || !candidate.fullName) {
        return false;
      }
      const normalizedHandle = candidate.handle
        ? candidate.handle.startsWith("@")
          ? candidate.handle
          : `@${candidate.handle}`
        : "";
      const freshOwner = {
        userId: candidate.userId || "usr_user",
        fullName: candidate.fullName.trim(),
        handle: normalizedHandle,
        email: candidate.email || "",
        phone: candidate.phone || "",
        profileImageUrl: candidate.profileImageUrl || "",
      };

      if (!isOwnerValid(freshOwner)) return false;

      const curr = currentOwnerRef.current;
      const hasChanged =
        !curr ||
        curr.userId !== freshOwner.userId ||
        curr.fullName !== freshOwner.fullName ||
        curr.email !== freshOwner.email ||
        curr.phone !== freshOwner.phone ||
        curr.handle !== freshOwner.handle ||
        curr.profileImageUrl !== freshOwner.profileImageUrl;

      if (hasChanged) {
        if (curr?.profileImageUrl !== freshOwner.profileImageUrl) {
          setAvatarError(false);
        }
        currentOwnerRef.current = freshOwner;
        setIsRealUserConnected(true);
        setConnectedOwner(freshOwner);
        if (onChangeRef.current) {
          onChangeRef.current({ owner: freshOwner, isAccountConnected: true });
        }
        setCachedDraft({ owner: freshOwner, isAccountConnected: true });
      }
      return true;
    };

    // 1. Read any already-stored real name/handle/avatar immediately while fetching live profile
    const storedName = (
      localStorage.getItem("pintree_user_full_name") ||
      localStorage.getItem("pintree_user_name") ||
      ""
    ).trim();
    const storedHandle = (
      localStorage.getItem("pintree_user_handle") ||
      localStorage.getItem("pintree_user_handle_id") ||
      ""
    ).trim();
    const storedEmail = (
      localStorage.getItem("pintree_user_email") ||
      localStorage.getItem("pintree_auth_email") ||
      ""
    ).trim();
    const storedPhone = (
      localStorage.getItem("pintree_user_phone") ||
      localStorage.getItem("pintree_auth_phone") ||
      ""
    ).trim();
    const storedUserId = localStorage.getItem("pintree_user_id") || "";
    const storedAvatar = (
      localStorage.getItem("pintree_user_profile_image") ||
      localStorage.getItem("pintree_user_avatar") ||
      ""
    ).trim();

    if (storedName && !isDummyOwner({ fullName: storedName, handle: storedHandle, email: storedEmail, userId: storedUserId })) {
      applyOwnerObj({
        userId: storedUserId,
        fullName: storedName,
        handle: storedHandle,
        email: storedEmail,
        phone: storedPhone,
        profileImageUrl: storedAvatar,
      });
    }

    // 2. Always fetch exact live profile from GET /v1/users/profile to ensure real fullName, handleId, and profileImageUrl
    const liveProfile = await fetchAndPersistCurrentUserProfile();
    if (liveProfile && liveProfile.fullName) {
      applyOwnerObj(liveProfile);
      return;
    }

    // If profile API did not return a name and no storedName exists, do NOT fabricate one from email unless token is valid & storedName existed
    if (!storedName) {
      if (currentOwnerRef.current || connectedOwner) {
        currentOwnerRef.current = null;
        setConnectedOwner(null);
        setIsRealUserConnected(false);
        if (onChangeRef.current) {
          onChangeRef.current({ owner: null, isAccountConnected: false });
        }
        setCachedDraft({ owner: null, isAccountConnected: false });
      }
    }
  }, [connectedOwner]);

  useEffect(() => {
    syncUserSession();

    const handleFocus = () => syncUserSession();
    const handleStorage = (e) => {
      if (
        e.key === "pintree_access_token" ||
        e.key === "pintree_user_full_name" ||
        e.key === "pintree_user_handle" ||
        e.key === "pintree_user_id"
      ) {
        syncUserSession();
      }
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorage);
    };
  }, [syncUserSession]);

  const pubNameDisplay = data?.publicationName || "";
  const pubTypeDisplay =
    PUBLICATION_TYPE_LABELS[data?.publicationType] ||
    PUBLICATION_TYPE_LABELS[data?.publicationType?.toUpperCase()] ||
    "";
  const orgNameDisplay =
    data?.registeredOrgName || "";

  const handleSaveDraftClick = () => {
    setIsDraftSaved(true);
    const isOtherRole = role === "OTHER" || role === "other";
    const draftPayload = {
      owner: connectedOwner,
      ownerRole: role,
      otherRoleSpecification: isOtherRole ? otherRole : "",
      isAuthorisedConfirmed: isAuthConfirmed,
    };
    if (onChange) onChange(draftPayload);
    setCachedDraft(draftPayload);
    if (onSaveDraft) onSaveDraft();
    setTimeout(() => {
      setIsDraftSaved(false);
    }, 2500);
  };

  const handleLoginClick = () => {
    try {
      if (onSaveDraft) onSaveDraft();
    } catch {}
    router.push(`/login?redirect=${encodeURIComponent("/onboarding/news-media?step=2")}&prompt=login`);
  };

  const handleSignupClick = () => {
    if (onSaveDraft) onSaveDraft();
    router.push(`/signup?redirect=${encodeURIComponent("/onboarding/news-media?step=2")}`);
  };

  const handleDisconnectAccount = () => {
    setShowDisconnectModal(false);
    setShowChangeAccountModal(false);
    // Reset to unauthenticated/disconnected state
    setConnectedOwner(null);
    setIsRealUserConnected(false);
    currentOwnerRef.current = null;
    onChange({ owner: null, isAccountConnected: false });
    setCachedDraft({ owner: null, isAccountConnected: false });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAccountConnected || !isAuthConfirmed) return;
    setIsValidating(true);

    const isOtherRole = role === "OTHER" || role === "other";
    const payload = {
      owner: connectedOwner,
      ownerRole: role,
      otherRoleSpecification: isOtherRole ? otherRole : "",
      isAuthorisedConfirmed: isAuthConfirmed,
      isAccountConnected: true,
    };

    if (onChange) onChange(payload);
    setCachedDraft(payload);

    setTimeout(() => {
      setIsValidating(false);
      onNext(payload);
    }, 400);
  };

  return (
    <main className="w-full max-w-7xl mx-auto px-gutter font-jakarta">
      <div className="flex flex-col w-full">
        <div className="w-full max-w-[1280px] mx-auto pb-24 pt-4 md:pt-8 text-on-surface">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant mb-6"
          >
            <span
              className="hover:text-primary transition-colors cursor-pointer"
              onClick={onModifyStep1}
            >
              Professional &amp; Public Accounts
            </span>
            <span className="text-outline-variant font-light">/</span>
            <span className="text-on-surface font-label-sm font-medium">News &amp; Media</span>
          </nav>

          {/* Header Section */}
          <header className="mb-10 lg:mb-12">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-fixed text-label-sm font-label-sm mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Account Onboarding
                </span>
                <h1
                  className="font-headline-lg text-headline-lg text-primary tracking-tight"
                  style={{
                    fontFamily: 'Aeonik, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    fontWeight: 500,
                  }}
                >
                  Founder &amp; Owner Information
                </h1>
                <p
                  className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-2"
                  style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                >
                  Connect your Pintree personal account to establish ownership of this News &amp; Media organisation. The connected account will become the initial owner of your publication page.
                </p>
              </div>
              <div className="hidden lg:flex items-center gap-2 text-label-sm font-label-sm text-on-surface-variant bg-surface-container-low px-3.5 py-2 rounded-xl shrink-0">
                <Icon name="verified_user" className="text-secondary text-[18px]" />
                <span>Official Identity Verification Required</span>
              </div>
            </div>
          </header>

          {/* Stepper */}
          <Stepper currentStep={2} onStepClick={onModifyStep1} />

          {/* Connected Organisation Banner */}
          <div className="w-full bg-surface-container-low rounded-xl p-space-md md:p-space-lg mb-space-2xl border border-outline-variant/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md">
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
              onClick={onModifyStep1}
            >
              <Icon name="edit_note" className="text-[16px]" /> Modify Step 1 Info
            </button>
          </div>

          {/* Main Form */}
          <form className="space-y-space-2xl w-full" onSubmit={handleSubmit}>
            {/* Section 1: Connect Your Personal Account */}
            <section className="w-full">
              <div
                id="connect-state-1-header"
                className="flex flex-col md:flex-row md:items-start justify-between gap-space-sm pb-space-lg"
              >
                <div>
                  <h2
                    className="font-headline-sm text-headline-sm font-semibold text-primary tracking-tight"
                    style={{
                      fontFamily: 'Aeonik, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    }}
                  >
                    Connect Your Personal Account
                  </h2>
                  <p
                    className="font-body-md text-body-md text-on-surface-variant mt-0.5"
                    style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                  >
                    A personal Pintree account is required to establish the initial ownership of this News &amp; Media organisation.
                  </p>
                </div>
              </div>

              {/* Toggle: First time show Image 1 only. After connect account show Image 2 only */}
              {!isAccountConnected ? (
                /* State 1 Options (Two Cards - Image 1) */
                <div id="state-1-options" className="grid grid-cols-1 md:grid-cols-2 gap-space-lg w-full">
                  {/* Card 1: Existing Login */}
                  <div className="p-space-lg rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between transition-all hover:bg-surface-container">
                    <div className="space-y-space-xs mb-space-lg">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm mb-3">
                        <Icon name="account_circle" className="text-[20px]" />
                      </div>
                      <h3 className="font-title-md text-title-md font-semibold text-primary">
                        Already have a Pintree account?
                      </h3>
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        Connect your existing personal Pintree account to continue as the organisation's founder and owner.
                      </p>
                    </div>
                    <div>
                      <a
                        href={`/login?redirect=${encodeURIComponent("/onboarding/news-media?step=2")}&prompt=login`}
                        onClick={() => {
                          try {
                            if (onSaveDraft) onSaveDraft();
                          } catch {}
                        }}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-black hover:bg-neutral-800 text-white font-label-md text-label-md font-medium transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        Log in to Pintree <Icon name="arrow_forward" className="text-[16px]" />
                      </a>
                    </div>
                  </div>

                  {/* Card 2: Create Account */}
                  <div className="p-space-lg rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between transition-all hover:bg-surface-container">
                    <div className="space-y-space-xs mb-space-lg">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm mb-3">
                        <Icon name="person_add" className="text-[20px]" />
                      </div>
                      <h3 className="font-title-md text-title-md font-semibold text-primary">
                        New to Pintree?
                      </h3>
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        Create a personal Pintree account first. Return here to connect it as the organisation's owner.
                      </p>
                    </div>
                    <div>
                      <a
                        href={`/signup?redirect=${encodeURIComponent("/onboarding/news-media?step=2")}`}
                        onClick={(e) => {
                          if (onSaveDraft) onSaveDraft();
                        }}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-primary font-label-md text-label-md font-medium transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm border border-outline-variant/30 cursor-pointer"
                      >
                        Create Personal Account <Icon name="north_east" className="text-[16px]" />
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                /* State 2 Account Card (Image 2) */
                <div id="state-2-account" className="w-full">
                  <div
                    className="bg-surface-container-low rounded-xl p-space-md md:p-space-lg border border-outline-variant/30 w-full"
                    id="owner-active-card"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
                      <div className="flex items-center gap-space-md min-w-0">
                        <div className="relative shrink-0">
                          {!avatarError && connectedOwner?.profileImageUrl ? (
                            <img
                              alt={`${connectedOwner?.fullName || "Organisation Owner"} Avatar`}
                              className="w-16 h-16 rounded-full object-cover shadow-sm ring-2 ring-surface-container-lowest"
                              src={connectedOwner.profileImageUrl}
                              onError={() => setAvatarError(true)}
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-[#BAEAFF] text-[#001F2A] flex items-center justify-center font-bold text-xl shadow-sm ring-2 ring-surface-container-lowest">
                              {connectedOwner?.fullName
                                ? connectedOwner.fullName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
                                : "U"}
                            </div>
                          )}
                          <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-secondary ring-2 ring-surface-container-lowest flex items-center justify-center">
                            <Icon name="check" className="text-[10px] text-on-secondary" />
                          </span>
                        </div>
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3
                              className="font-title-md text-title-md font-semibold text-primary"
                              style={{
                                fontFamily: "Aeonik, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                              }}
                            >
                              {connectedOwner?.fullName || "Organisation Owner"}
                            </h3>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#B8F397] text-[#0A3900]">
                              <Icon name="verified" className="text-[12px]" /> Authenticated Pintree Account
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#B8F397] text-[#0A3900]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#0A3900]"></span> Primary Custodian
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm flex-wrap">
                            {connectedOwner?.handle && (
                              <span className="text-primary font-medium">{connectedOwner.handle}</span>
                            )}
                            {connectedOwner?.handle && connectedOwner?.email && (
                              <span className="text-outline-variant">·</span>
                            )}
                            {connectedOwner?.email && (
                              <>
                                <span>{connectedOwner.email}</span>
                                <span className="text-outline-variant hidden sm:inline">·</span>
                              </>
                            )}
                            <span className="inline-flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm font-medium">
                              <span className="w-2 h-2 rounded-full bg-[#208400]"></span> Owner Account Connected
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-space-sm shrink-0 pt-space-xs lg:pt-0">
                        <button
                          type="button"
                          onClick={() => setShowChangeAccountModal(true)}
                          className="px-4 py-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-primary border border-outline-variant/30 font-label-md text-label-md font-medium transition-colors shadow-sm cursor-pointer"
                        >
                          Change Account
                        </button>
                        <a
                          href="/account"
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant hover:text-primary font-label-md text-label-md transition-colors flex items-center gap-1 shadow-sm border border-outline-variant/30 cursor-pointer"
                        >
                          View Profile <Icon name="north_east" className="text-[16px]" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Section 2: Your Role in the Organisation */}
            <section className="w-full">
              <div className="pb-space-sm">
                <h2
                  className="font-headline-sm text-headline-sm font-semibold text-primary tracking-tight"
                  style={{
                    fontFamily: 'Aeonik, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  }}
                >
                  Your Role in the Organisation
                </h2>
                <p
                  className="font-body-md text-body-md text-on-surface-variant mt-0.5"
                  style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                >
                  Provide your position and relationship with the media organisation.
                </p>
              </div>

              <div className="mt-space-lg space-y-space-md max-w-2xl">
                {/* Role Dropdown */}
                <div className="space-y-space-xs">
                  <label
                    className="block font-label-md text-label-md font-semibold text-primary"
                    htmlFor="owner_role"
                  >
                    Your Role in the Organisation <span className="text-error">*</span>
                  </label>
                  <CustomDropdown
                    id="owner_role"
                    required
                    placeholder="Select your role in the organisation"
                    value={role}
                    onChange={(val) => {
                      setRole(val);
                      if (onChange) onChange({ ownerRole: val });
                      setCachedDraft({ ownerRole: val });
                    }}
                    options={OWNER_ROLE_OPTIONS}
                  />
                  <p className="font-body-sm text-body-sm text-on-surface-variant pt-1">
                    Select the role that best describes your position in the organisation.
                  </p>
                </div>

                {/* Other Role Specification */}
                {(role === "OTHER" || role === "other") && (
                  <div id="other-role-container" className="space-y-space-xs pt-1">
                    <label
                      className="block font-label-md text-label-md font-semibold text-primary"
                      htmlFor="other_role_input"
                    >
                      Please specify your role <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      id="other_role_input"
                      value={otherRole}
                      onChange={(e) => {
                        const val = e.target.value;
                        setOtherRole(val);
                        if (onChange) onChange({ otherRoleSpecification: val });
                        setCachedDraft({ otherRoleSpecification: val });
                      }}
                      placeholder="Enter your designation or role"
                      required
                      className="w-full h-11 px-3.5 rounded-lg bg-surface-container-low text-primary font-body-md text-body-md border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <p className="font-body-sm text-body-sm text-on-surface-variant pt-1">
                      Required when Other is selected.
                    </p>
                  </div>
                )}
              </div>

              {/* Authorisation Confirmation Checkbox */}
              <div className="mt-space-xl p-space-md rounded-xl bg-surface-container-low flex items-start gap-space-sm border border-outline-variant/30 w-full">
                <input
                  checked={isAuthConfirmed}
                  onChange={(e) => {
                    setIsAuthConfirmed(e.target.checked);
                    onChange({ isAuthorisedConfirmed: e.target.checked });
                  }}
                  className="mt-1 w-4 h-4 rounded text-black focus:ring-black accent-black cursor-pointer"
                  style={{ accentColor: "#000000" }}
                  id="auth_confirmation"
                  type="checkbox"
                  required
                />
                <label
                  className="font-body-md text-body-md text-primary font-medium cursor-pointer select-none"
                  htmlFor="auth_confirmation"
                >
                  I confirm that I am authorised to create and manage this News &amp; Media account on behalf of the organisation.
                </label>
              </div>
            </section>

            {/* Navigation Footer */}
            <OnboardingBottomBar
              currentStep={2}
              totalSteps={5}
              onBack={onBack}
              onSaveDraft={handleSaveDraftClick}
              isSavingDraft={false}
              isDraftSaved={isDraftSaved}
              isSubmitting={isValidating}
              nextDisabled={!isAccountConnected || !isAuthConfirmed || isValidating}
              nextLabel="Continue"
              showBack={true}
              isSubmitType={true}
            />
          </form>

          {/* Modal: Change Account Modal */}
          {showChangeAccountModal && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm"
              id="change-account-modal"
            >
              <div className="bg-surface-container-lowest max-w-lg w-full rounded-2xl p-6 md:p-8 shadow-xl space-y-5 border border-outline-variant/30">
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-fixed shrink-0">
                      <Icon name="manage_accounts" className="text-[20px]" />
                    </div>
                    <div>
                      <h3
                        className="font-headline-sm text-headline-sm font-semibold text-primary"
                        style={{
                          fontFamily: 'Aeonik, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        }}
                      >
                        Change Connected Account
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Switch Pintree Account</p>
                    </div>
                  </div>
                  <button
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container text-on-surface-variant cursor-pointer"
                    onClick={() => setShowChangeAccountModal(false)}
                    type="button"
                  >
                    <Icon name="close" className="text-[20px]" />
                  </button>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  You can connect a different personal Pintree account to be the owner and custodian of this News &amp; Media organisation.
                </p>
                <div className="p-4 rounded-xl bg-surface-container-low flex items-center gap-3 border border-outline-variant/30">
                  <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden ring-1 ring-surface-container-lowest">
                    {!avatarError && connectedOwner?.profileImageUrl ? (
                      <img
                        src={connectedOwner.profileImageUrl}
                        alt={connectedOwner?.fullName || "Organisation Owner"}
                        className="w-full h-full object-cover"
                        onError={() => setAvatarError(true)}
                      />
                    ) : (
                      <span className="text-sm font-bold text-on-primary">
                        {connectedOwner?.fullName
                          ? connectedOwner.fullName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
                          : "U"}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="font-label-md text-label-md font-semibold text-primary block">
                      {connectedOwner?.fullName || "Organisation Owner"} {connectedOwner?.handle ? `(${connectedOwner.handle})` : ""}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant block truncate">
                      {connectedOwner?.email || ""}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <button
                    className="w-full sm:w-auto px-4 py-2 rounded-lg text-error hover:bg-error-container/20 font-label-md text-label-md transition-colors cursor-pointer"
                    onClick={handleDisconnectAccount}
                    type="button"
                  >
                    Disconnect Account
                  </button>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-surface-container text-primary font-label-md text-label-md hover:bg-surface-container-high transition-colors cursor-pointer"
                      onClick={() => setShowChangeAccountModal(false)}
                      type="button"
                    >
                      Keep Current
                    </button>
                    <button
                      className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-black text-white font-label-md text-label-md font-medium hover:bg-neutral-800 transition-colors shadow-sm inline-flex items-center justify-center gap-1.5 cursor-pointer"
                      onClick={() => {
                        setShowChangeAccountModal(false);
                        router.push(`/login?redirect=${encodeURIComponent("/onboarding/news-media?step=2")}&prompt=login`);
                      }}
                      type="button"
                    >
                      Log in with different account <Icon name="arrow_forward" className="text-[16px]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal: Disconnect Modal */}
          {showDisconnectModal && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm"
              id="disconnect-modal"
            >
              <div className="bg-surface-container-lowest max-w-lg w-full rounded-2xl p-6 md:p-8 shadow-xl space-y-5 border border-outline-variant/30">
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center text-on-error-container shrink-0">
                      <Icon name="link_off" className="text-[20px]" />
                    </div>
                    <div>
                      <h3
                        className="font-headline-sm text-headline-sm font-semibold text-primary"
                        style={{
                          fontFamily: 'Aeonik, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        }}
                      >
                        Disconnect Account
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Reset Owner Connection</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container text-on-surface-variant cursor-pointer"
                    onClick={() => setShowDisconnectModal(false)}
                  >
                    <Icon name="close" className="text-[20px]" />
                  </button>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Are you sure you want to disconnect <strong>{connectedOwner.fullName} ({connectedOwner.handle})</strong>?
                </p>
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    className="px-5 py-2.5 rounded-lg bg-surface-container text-primary font-label-md text-label-md hover:bg-surface-container-high transition-colors cursor-pointer"
                    onClick={() => setShowDisconnectModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-6 py-2.5 rounded-lg bg-error text-on-error font-label-md text-label-md font-medium transition-colors shadow-sm cursor-pointer"
                    onClick={handleDisconnectAccount}
                  >
                    Disconnect &amp; Reset
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
