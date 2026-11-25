"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Icon from "./Icon";
import Stepper from "./Stepper";
import OnboardingBottomBar from "./OnboardingBottomBar";
import CustomDropdown from "./CustomDropdown";
import {
  ChangeEmailModal,
  ChangeMobileModal,
  SuccessToast,
} from "./ContactModals";
import {
  sendOtp,
  verifyOtp,
  ensureRealApplicationId,
  isValidRealApplicationId,
  uploadDocument,
  deleteDocument,
  getCachedDraft,
  setCachedDraft,
  sanitizeMockData,
  isDummyOwner,
  fetchLocations,
  getActiveApplication,
  getApplicationById,
  PUBLICATION_TYPE_LABELS,
  formatOwnerRole,
  normalizeDoc,
  isRealUploadedDoc,
  formatBytes,
} from "@/utils/newsMediaOnboarding";
import { fetchAndPersistCurrentUserProfile } from "@/utils/auth";

function formatDisplayDate(val) {
  if (!val) return "";
  if (typeof val !== "string") return String(val);
  if (val.includes("/")) return val;
  const parts = val.split("-");
  if (parts.length === 3 && parts[0].length === 4) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return val;
}

function formatIsoDate(val) {
  if (!val) return "";
  if (typeof val !== "string") return "";
  if (val.includes("-") && val.split("-")[0].length === 4) return val;
  const parts = val.split("/");
  if (parts.length === 3 && parts[2].length === 4) {
    return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
  }
  return val;
}

const LEGAL_ORG_TYPE_OPTIONS = [
  { value: "PRIVATE_LIMITED", label: "Private Limited Company (Pvt. Ltd.)" },
  { value: "PUBLIC_LIMITED", label: "Public Limited Company" },
  { value: "LLP", label: "Limited Liability Partnership (LLP)" },
  { value: "PARTNERSHIP", label: "Partnership Firm" },
  { value: "PROPRIETORSHIP", label: "Sole Proprietorship" },
  { value: "TRUST", label: "Registered Trust" },
  { value: "SOCIETY", label: "Registered Society" },
  { value: "OTHER", label: "Other / Statutory Corporation" },
];

const REG_COUNTRY_OPTIONS = [
  { value: "cnt_in", code: "IN", label: "India" },
  { value: "cnt_us", code: "US", label: "United States" },
  { value: "cnt_gb", code: "GB", label: "United Kingdom" },
  { value: "cnt_ae", code: "AE", label: "United Arab Emirates" },
  { value: "cnt_sg", code: "SG", label: "Singapore" },
  { value: "cnt_ca", code: "CA", label: "Canada" },
  { value: "cnt_au", code: "AU", label: "Australia" },
];

const GRIEVANCE_COUNCIL_OPTIONS = [
  { value: "MIB", label: "Ministry of Information & Broadcasting (MIB)" },
  { value: "PRGI", label: "Press Registrar General of India (PRGI)" },
  { value: "PCI", label: "Press Council of India (PCI)" },
  { value: "MEITY", label: "Ministry of Electronics & IT (MeitY)" },
  { value: "TRAI", label: "Telecom Regulatory Authority of India (TRAI)" },
  { value: "WPC_WING", label: "Wireless Planning & Coordination (WPC) Wing" },
  { value: "PRASAR_BHARATI", label: "Prasar Bharati" },
  { value: "OTHER", label: "Other Recognized Industry / Regulatory Body" },
  { value: "NONE", label: "Not Applicable / Direct Independent Compliance" },
];

export default function Step3VerificationDocs({
  data,
  onChange,
  onNext,
  onBack,
  onJumpToStep,
  onSaveDraft,
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  // Initial extractors pure to data props (avoids SSR/client hydration mismatches)
  const getInitialOrgName = useCallback(() => {
    const val =
      data?.registeredOrgName ||
      data?.registeredOrganisationName ||
      data?.registered_org_name ||
      data?.organisationName ||
      data?.organisation_name ||
      data?.orgName ||
      data?.legalEntityName ||
      data?.legalName ||
      "";
    return typeof val === "string" ? val.trim() : "";
  }, [data]);

  const getInitialPubName = useCallback(() => {
    const val =
      data?.publicationName ||
      data?.digitalPubName ||
      data?.name ||
      "";
    return typeof val === "string" ? val.trim() : "";
  }, [data]);

  const getInitialWebsite = useCallback(() => {
    const val =
      data?.officialWebsite ||
      data?.website ||
      data?.websiteUrl ||
      "";
    return typeof val === "string" ? val.replace(/^https?:\/\//i, "").trim() : "";
  }, [data]);

  const getInitialEmail = useCallback(() => {
    const val =
      data?.officialEmail ||
      data?.email ||
      data?.organisationEmail ||
      data?.orgEmail ||
      "";
    return typeof val === "string" ? val.trim() : "";
  }, [data]);

  const getInitialMobile = useCallback(() => {
    const raw =
      data?.primaryMobileNumber ||
      data?.primaryMobile ||
      data?.mobileNumber ||
      data?.mobile ||
      data?.phone ||
      "";
    if (!raw) return "";
    let s = String(raw).trim();
    return s.replace(/^\+91[\s-]*/, "").replace(/^91(?=\d{10}$)/, "");
  }, [data]);

  const getInitialOwner = useCallback(() => {
    if (data?.owner && !isDummyOwner(data.owner)) {
      return data.owner;
    }
    if (typeof window !== "undefined") {
      const storedName =
        localStorage.getItem("pintree_user_full_name") ||
        localStorage.getItem("pintree_user_name");
      const storedHandle =
        localStorage.getItem("pintree_user_handle") ||
        localStorage.getItem("pintree_user_handle_id");
      const storedAvatar =
        localStorage.getItem("pintree_user_profile_image") ||
        localStorage.getItem("pintree_user_avatar");
      const storedUserId = localStorage.getItem("pintree_user_id");
      const storedEmail =
        localStorage.getItem("pintree_user_email") ||
        localStorage.getItem("pintree_auth_email");
      if (storedName && !isDummyOwner({ fullName: storedName, handle: storedHandle })) {
        return {
          userId: storedUserId || "usr_user",
          fullName: storedName,
          handle: storedHandle
            ? storedHandle.startsWith("@")
              ? storedHandle
              : `@${storedHandle}`
            : "",
          profileImageUrl: storedAvatar || "",
          email: storedEmail || "",
        };
      }
    }
    return {
      userId: "",
      fullName: "",
      handle: "",
      profileImageUrl: "",
    };
  }, [data]);

  // Section 01: Organisation Registration Details
  const [legalOrgType, setLegalOrgType] = useState(() => {
    const raw = data?.legalOrgType || "";
    if (raw === "pvt_ltd") return "PRIVATE_LIMITED";
    if (raw === "pub_ltd") return "PUBLIC_LIMITED";
    if (raw === "llp") return "LLP";
    if (raw === "partnership") return "PARTNERSHIP";
    if (raw === "proprietorship") return "PROPRIETORSHIP";
    if (raw === "trust") return "TRUST";
    if (raw === "society") return "SOCIETY";
    if (raw === "other") return "OTHER";
    return raw || "PRIVATE_LIMITED";
  });
  const [registeredOrgName, setRegisteredOrgName] = useState(getInitialOrgName);
  const [regNumber, setRegNumber] = useState(
    data?.legalRegistrationNumber || ""
  );
  const [regAuthority, setRegAuthority] = useState(
    data?.registrationAuthority || ""
  );
  const [regDate, setRegDate] = useState(() =>
    formatDisplayDate(data?.dateOfRegistration || "")
  );
  const nativeDateInputRef = useRef(null);

  const handleManualDateChange = (e) => {
    let input = e.target.value.replace(/[^\d/]/g, "");
    if (!e.nativeEvent?.inputType?.startsWith("delete")) {
      if (input.length === 2 && !input.includes("/")) {
        input = `${input}/`;
      } else if (input.length === 5 && input.split("/").length === 2) {
        input = `${input}/`;
      }
    }
    if (input.length <= 10) {
      setRegDate(input);
    }
  };

  const handleOpenCalendar = () => {
    if (!nativeDateInputRef.current) return;
    try {
      if (typeof nativeDateInputRef.current.showPicker === "function") {
        nativeDateInputRef.current.showPicker();
      } else {
        nativeDateInputRef.current.click();
      }
    } catch {
      nativeDateInputRef.current.click();
    }
  };

  const handleNativeDateChange = (e) => {
    const isoVal = e.target.value;
    if (isoVal) {
      setRegDate(formatDisplayDate(isoVal));
    }
  };

  const [country, setCountry] = useState(
    data?.registeredOfficeCountryId || data?.countryId || "cnt_in"
  );
  const [countryOptions, setCountryOptions] = useState(REG_COUNTRY_OPTIONS);

  // Section 02: Media / Publication Authorisation
  const [digitalPubName, setDigitalPubName] = useState(getInitialPubName);
  const [officialWebsite, setOfficialWebsite] = useState(getInitialWebsite);
  const [regulatoryRef, setRegulatoryRef] = useState(
    data?.regulatoryReferenceId || ""
  );
  const [grievanceCouncil, setGrievanceCouncil] = useState(() => {
    const raw = data?.industryGrievanceCouncil || data?.grievanceCouncil || "";
    if (raw === "press_council") return "PCI";
    if (raw === "none") return "NONE";
    if (raw === "other") return "OTHER";
    return raw || "MIB";
  });

  // Section 03: Supporting Verification Documents
  const [regDoc, setRegDoc] = useState(() => {
    const raw = data?.documents?.find(
      (d) => isRealUploadedDoc(d) && (d.type === "REGISTRATION" || d.documentType === "ORGANISATION_REGISTRATION")
    );
    return raw ? normalizeDoc(raw) : null;
  });
  const [mediaAuthDoc, setMediaAuthDoc] = useState(() => {
    const raw = data?.documents?.find(
      (d) => isRealUploadedDoc(d) && (d.type === "MEDIA_AUTH" || d.documentType === "MEDIA_AUTHORISATION")
    );
    return raw ? normalizeDoc(raw) : null;
  });

  const regFileInputRef = useRef(null);
  const mediaFileInputRef = useRef(null);

  // Section 04: Social Media
  const [socialLinks, setSocialLinks] = useState({
    twitter:
      data?.socialLinks?.twitter ||
      data?.xProfileUrl ||
      data?.twitter ||
      "",
    facebook:
      data?.socialLinks?.facebook ||
      data?.facebookPageUrl ||
      data?.facebook ||
      "",
    instagram:
      data?.socialLinks?.instagram ||
      data?.instagramProfileUrl ||
      data?.instagram ||
      "",
    youtube:
      data?.socialLinks?.youtube ||
      data?.youtubeChannelUrl ||
      data?.youtube ||
      "",
  });

  const updateSocialLink = (network, val) => {
    const updated = { ...socialLinks, [network]: val };
    setSocialLinks(updated);
    const payload = {
      socialLinks: updated,
      xProfileUrl: updated.twitter,
      twitter: updated.twitter,
      facebookPageUrl: updated.facebook,
      facebook: updated.facebook,
      instagramProfileUrl: updated.instagram,
      instagram: updated.instagram,
      youtubeChannelUrl: updated.youtube,
      youtube: updated.youtube,
    };
    if (onChange) {
      onChange(payload);
    }
    setCachedDraft(payload);
  };

  // Section 05: Contact Information Verification (Dual OTP)
  // Email states
  const isEmailInitVerified = Boolean(data?.officialEmailVerified || data?.isEmailVerified);
  const [emailVerified, setEmailVerified] = useState(isEmailInitVerified);
  const [emailOtpState, setEmailOtpState] = useState(
    isEmailInitVerified ? "verified" : "initial"
  );
  const [emailOtpDigits, setEmailOtpDigits] = useState(["", "", "", "", "", ""]);
  const [emailResendTimer, setEmailResendTimer] = useState(30);
  const [emailExpiryTimer, setEmailExpiryTimer] = useState(299);
  const [emailOtpError, setEmailOtpError] = useState("");
  const [isSendingEmailOtp, setIsSendingEmailOtp] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [officialEmail, setOfficialEmail] = useState(getInitialEmail);

  // Mobile states
  const isMobileInitVerified = Boolean(data?.primaryMobileVerified || data?.isMobileVerified);
  const [mobileVerified, setMobileVerified] = useState(isMobileInitVerified);
  const [mobileOtpState, setMobileOtpState] = useState(
    isMobileInitVerified ? "verified" : "initial"
  );
  const [mobileOtpDigits, setMobileOtpDigits] = useState(["", "", "", "", "", ""]);
  const [mobileResendTimer, setMobileResendTimer] = useState(30);
  const [mobileExpiryTimer, setMobileExpiryTimer] = useState(299);
  const [mobileOtpError, setMobileOtpError] = useState("");
  const [isSendingMobileOtp, setIsSendingMobileOtp] = useState(false);
  const [isVerifyingMobile, setIsVerifyingMobile] = useState(false);
  const [primaryMobile, setPrimaryMobile] = useState(getInitialMobile);

  const displayOrgName = (
    data?.registeredOrgName ||
    data?.registeredOrganisationName ||
    data?.organisationName ||
    data?.orgName ||
    registeredOrgName ||
    getInitialOrgName() ||
    ""
  ).trim();

  const displayPubName = (
    data?.publicationName ||
    data?.digitalPubName ||
    data?.name ||
    digitalPubName ||
    getInitialPubName() ||
    ""
  ).trim();

  const displayOfficialWebsite = (
    data?.officialWebsite ||
    data?.website ||
    data?.websiteUrl ||
    officialWebsite ||
    getInitialWebsite() ||
    ""
  ).replace(/^https?:\/\//i, "").trim();

  const displayOfficialEmail = (
    data?.officialEmail ||
    data?.email ||
    officialEmail ||
    getInitialEmail() ||
    ""
  ).trim();

  const displayPrimaryMobile = (
    data?.primaryMobileNumber ||
    data?.primaryMobile ||
    primaryMobile ||
    getInitialMobile() ||
    ""
  ).trim();

  const pubTypeDisplay =
    PUBLICATION_TYPE_LABELS[data?.publicationType] ||
    PUBLICATION_TYPE_LABELS[data?.publicationType?.toUpperCase()] ||
    "";

  // Modals for editing email/mobile
  const [showEditEmailModal, setShowEditEmailModal] = useState(false);
  const [showEditMobileModal, setShowEditMobileModal] = useState(false);
  const [toastInfo, setToastInfo] = useState({
    show: false,
    title: "",
    subtitle: "",
  });

  const handleUpdateEmailFromModal = (newEmailValue) => {
    setOfficialEmail(newEmailValue);
    setEmailVerified(false);
    setEmailOtpState("initial");
    setEmailOtpDigits(["", "", "", "", "", ""]);
    setShowEditEmailModal(false);
    setToastInfo({
      show: true,
      title: "Email Address Updated Successfully",
      subtitle: "Your login email address has been updated.",
    });
    if (onChange) onChange({ officialEmail: newEmailValue });
  };

  const handleUpdateMobileFromModal = (newMobileValue) => {
    setPrimaryMobile(newMobileValue);
    setMobileVerified(false);
    setMobileOtpState("initial");
    setMobileOtpDigits(["", "", "", "", "", ""]);
    setShowEditMobileModal(false);
    setToastInfo({
      show: true,
      title: "Mobile Number Updated Successfully",
      subtitle: "Your primary mobile number has been updated.",
    });
    if (onChange) onChange({ primaryMobileNumber: newMobileValue });
  };

  const emailInputsRef = useRef([]);
  const mobileInputsRef = useRef([]);

  // Load countries
  useEffect(() => {
    let isSubMounted = true;
    async function loadCountries() {
      try {
        const list = await fetchLocations("country", {
          status: "active",
          sort: "name_asc",
        });
        if (isSubMounted && Array.isArray(list) && list.length > 0) {
          const mapped = list.map((c) => ({
            value: c.id || (c.code ? `cnt_${c.code.toLowerCase()}` : c.code),
            code: c.code || "",
            label: c.name || "",
            sublabel: c.code || c.dialCode || "",
          }));
          setCountryOptions(mapped);
          const currCId = data?.registeredOfficeCountryId || data?.countryId || country;
          const matched = mapped.find(
            (c) =>
              c.value === currCId ||
              c.code === currCId ||
              (currCId && currCId.replace(/^country-/, "") === c.code.toLowerCase())
          );
          if (matched && onChange && !data?.registeredOfficeCountryName) {
            onChange({ registeredOfficeCountryName: matched.label });
          }
        }
      } catch (e) {}
    }
    loadCountries();
    return () => {
      isSubMounted = false;
    };
  }, []);

  // Client mount & session hydration effect
  useEffect(() => {
    setIsMounted(true);

    let draft = null;
    try {
      draft = getCachedDraft();
      if (!draft && typeof window !== "undefined") {
        const raw = localStorage.getItem("pintree_nm_onboarding_draft");
        if (raw) draft = JSON.parse(raw);
      }
    } catch {}

    // 1. Sync Org Name from data props or cached draft
    const fromPropsOrg =
      data?.registeredOrgName ||
      data?.registeredOrganisationName ||
      data?.registered_org_name ||
      data?.organisationName ||
      data?.organisation_name ||
      data?.orgName ||
      data?.legalEntityName ||
      data?.legalName;
    const fromDraftOrg =
      draft?.registeredOrgName ||
      draft?.registeredOrganisationName ||
      draft?.registered_org_name ||
      draft?.organisationName ||
      draft?.organisation_name ||
      draft?.orgName ||
      draft?.legalEntityName ||
      draft?.legalName;
    const resolvedOrg = (fromPropsOrg || fromDraftOrg || "").trim();
    if (resolvedOrg && resolvedOrg !== registeredOrgName) {
      setRegisteredOrgName(resolvedOrg);
    }

    // 2. Sync Publication Name from data props or cached draft
    const fromPropsPub = data?.publicationName || data?.digitalPubName || data?.name;
    const fromDraftPub = draft?.publicationName || draft?.digitalPubName || draft?.name;
    const resolvedPub = (fromPropsPub || fromDraftPub || "").trim();
    if (resolvedPub && resolvedPub !== digitalPubName) {
      setDigitalPubName(resolvedPub);
    }

    // 3. Sync Official Website from data props or cached draft
    const fromPropsWeb = data?.officialWebsite || data?.website || data?.websiteUrl;
    const fromDraftWeb = draft?.officialWebsite || draft?.website || draft?.websiteUrl;
    const resolvedWeb = (fromPropsWeb || fromDraftWeb || "").replace(/^https?:\/\//i, "").trim();
    if (resolvedWeb && resolvedWeb !== officialWebsite) {
      setOfficialWebsite(resolvedWeb);
    }

    // 4. Sync Official Email
    const fromPropsEmail =
      data?.officialEmail ||
      data?.email ||
      data?.organisationEmail ||
      data?.orgEmail;
    const fromDraftEmail =
      draft?.officialEmail ||
      draft?.email ||
      draft?.organisationEmail ||
      draft?.orgEmail;
    const resolvedEmail = (fromPropsEmail || fromDraftEmail || "").trim();
    if (resolvedEmail && resolvedEmail !== officialEmail) {
      setOfficialEmail(resolvedEmail);
    }

    // 5. Sync Primary Mobile
    const extractDigits = (val) => {
      if (!val) return "";
      let s = String(val).trim();
      return s.replace(/^\+91[\s-]*/, "").replace(/^91(?=\d{10}$)/, "");
    };
    const fromPropsMobile =
      data?.primaryMobileNumber ||
      data?.primaryMobile ||
      data?.mobileNumber ||
      data?.mobile ||
      data?.phone;
    const fromDraftMobile =
      draft?.primaryMobileNumber ||
      draft?.primaryMobile ||
      draft?.mobileNumber ||
      draft?.mobile ||
      draft?.phone;
    const resolvedMobile = extractDigits(fromPropsMobile || fromDraftMobile || "");
    if (resolvedMobile && resolvedMobile !== primaryMobile) {
      setPrimaryMobile(resolvedMobile);
    }

    // 6. Sync Social Links
    const sTwitter =
      data?.xProfileUrl ||
      data?.socialLinks?.twitter ||
      data?.twitter ||
      draft?.xProfileUrl ||
      draft?.socialLinks?.twitter ||
      "";
    const sFacebook =
      data?.facebookPageUrl ||
      data?.socialLinks?.facebook ||
      data?.facebook ||
      draft?.facebookPageUrl ||
      draft?.socialLinks?.facebook ||
      "";
    const sInstagram =
      data?.instagramProfileUrl ||
      data?.socialLinks?.instagram ||
      data?.instagram ||
      draft?.instagramProfileUrl ||
      draft?.socialLinks?.instagram ||
      "";
    const sYouTube =
      data?.youtubeChannelUrl ||
      data?.socialLinks?.youtube ||
      data?.youtube ||
      draft?.youtubeChannelUrl ||
      draft?.socialLinks?.youtube ||
      "";

    if (sTwitter || sFacebook || sInstagram || sYouTube) {
      setSocialLinks((prev) => ({
        twitter: sTwitter || prev.twitter,
        facebook: sFacebook || prev.facebook,
        instagram: sInstagram || prev.instagram,
        youtube: sYouTube || prev.youtube,
      }));
    }

    // 7. Sync Documents from data props or cached draft
    const docsList = (data?.documents && data.documents.length > 0)
      ? data.documents
      : (draft?.documents && draft.documents.length > 0)
      ? draft.documents
      : [];
    const foundReg = docsList.find(
      (d) => isRealUploadedDoc(d) && (d.type === "REGISTRATION" || d.documentType === "ORGANISATION_REGISTRATION")
    );
    setRegDoc(foundReg ? normalizeDoc(foundReg) : null);

    const foundMedia = docsList.find(
      (d) => isRealUploadedDoc(d) && (d.type === "MEDIA_AUTH" || d.documentType === "MEDIA_AUTHORISATION")
    );
    setMediaAuthDoc(foundMedia ? normalizeDoc(foundMedia) : null);

    // 8. Sync Owner from live /users/profile (or localStorage if available)
    let isCancelled = false;
    async function syncLiveOwnerProfile() {
      const liveProfile = await fetchAndPersistCurrentUserProfile();
      if (isCancelled) return;
      if (liveProfile && liveProfile.fullName && !isDummyOwner(liveProfile)) {
        const ownerObj = {
          userId: liveProfile.userId || "usr_user",
          fullName: liveProfile.fullName,
          handle: liveProfile.handle,
          email: liveProfile.email,
          phone: liveProfile.phone,
          profileImageUrl: liveProfile.profileImageUrl,
        };
        setAvatarError(false);
        setSyncedOwner(ownerObj);
        if (onChange) {
          onChange({ owner: ownerObj, isAccountConnected: true });
        }
        setCachedDraft({ owner: ownerObj, isAccountConnected: true });
        return;
      }

      if ((!data?.owner?.fullName || isDummyOwner(data?.owner)) && typeof window !== "undefined") {
        const storedName =
          localStorage.getItem("pintree_user_full_name") ||
          localStorage.getItem("pintree_user_name") ||
          "";
        const storedHandle =
          localStorage.getItem("pintree_user_handle") ||
          localStorage.getItem("pintree_user_handle_id") ||
          "";
        const storedEmail =
          localStorage.getItem("pintree_user_email") ||
          localStorage.getItem("pintree_auth_email") ||
          "";
        const storedAvatar =
          localStorage.getItem("pintree_user_profile_image") ||
          localStorage.getItem("pintree_user_avatar") ||
          "";
        const storedUserId = localStorage.getItem("pintree_user_id") || "";

        if (storedName && !isDummyOwner({ fullName: storedName, handle: storedHandle })) {
          const ownerObj = {
            userId: storedUserId || "usr_user",
            fullName: storedName,
            handle: storedHandle
              ? (storedHandle.startsWith("@") ? storedHandle : `@${storedHandle}`)
              : "",
            email: storedEmail,
            profileImageUrl: storedAvatar,
          };
          if (onChange) {
            onChange({ owner: ownerObj });
          }
        }
      }
    }
    syncLiveOwnerProfile();
    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const nextPub = (data?.publicationName || data?.digitalPubName || data?.name || "").trim();
    if (nextPub && nextPub !== digitalPubName) {
      setDigitalPubName(nextPub);
    }
  }, [data?.publicationName, data?.digitalPubName, data?.name]);

  useEffect(() => {
    const nextWeb = (data?.officialWebsite || data?.website || data?.websiteUrl || "").replace(/^https?:\/\//i, "").trim();
    if (nextWeb && nextWeb !== officialWebsite) {
      setOfficialWebsite(nextWeb);
    }
  }, [data?.officialWebsite, data?.website, data?.websiteUrl]);

  useEffect(() => {
    const nextOrg = (data?.registeredOrgName || data?.registeredOrganisationName || data?.organisationName || data?.orgName || "").trim();
    if (nextOrg && nextOrg !== registeredOrgName) {
      setRegisteredOrgName(nextOrg);
    }
  }, [data?.registeredOrgName, data?.registeredOrganisationName, data?.organisationName, data?.orgName]);

  useEffect(() => {
    if (data?.legalOrgType) {
      const raw = data.legalOrgType;
      let mapped = raw;
      if (raw === "pvt_ltd") mapped = "PRIVATE_LIMITED";
      else if (raw === "pub_ltd") mapped = "PUBLIC_LIMITED";
      else if (raw === "llp") mapped = "LLP";
      else if (raw === "partnership") mapped = "PARTNERSHIP";
      else if (raw === "proprietorship") mapped = "PROPRIETORSHIP";
      else if (raw === "trust") mapped = "TRUST";
      else if (raw === "society") mapped = "SOCIETY";
      else if (raw === "other") mapped = "OTHER";
      setLegalOrgType(mapped);
    }
  }, [data?.legalOrgType]);

  useEffect(() => {
    if (data?.legalRegistrationNumber && data.legalRegistrationNumber !== regNumber) {
      setRegNumber(data.legalRegistrationNumber);
    }
  }, [data?.legalRegistrationNumber]);

  useEffect(() => {
    if (data?.registrationAuthority && data.registrationAuthority !== regAuthority) {
      setRegAuthority(data.registrationAuthority);
    }
  }, [data?.registrationAuthority]);

  useEffect(() => {
    if (data?.dateOfRegistration) {
      const formatted = formatDisplayDate(data.dateOfRegistration);
      if (formatted && formatted !== regDate) {
        setRegDate(formatted);
      }
    }
  }, [data?.dateOfRegistration]);

  useEffect(() => {
    if (data?.registeredOfficeCountryId && data.registeredOfficeCountryId !== country) {
      setCountry(data.registeredOfficeCountryId);
    }
  }, [data?.registeredOfficeCountryId]);

  useEffect(() => {
    if (data?.regulatoryReferenceId && data.regulatoryReferenceId !== regulatoryRef) {
      setRegulatoryRef(data.regulatoryReferenceId);
    }
  }, [data?.regulatoryReferenceId]);

  useEffect(() => {
    if (data?.industryGrievanceCouncil) {
      const raw = data.industryGrievanceCouncil;
      const mapped = raw === "press_council" ? "PCI" : raw === "none" ? "NONE" : raw === "other" ? "OTHER" : raw;
      setGrievanceCouncil(mapped);
    }
  }, [data?.industryGrievanceCouncil]);

  useEffect(() => {
    const twitter = data?.socialLinks?.twitter || data?.xProfileUrl || data?.twitter || "";
    const facebook = data?.socialLinks?.facebook || data?.facebookPageUrl || data?.facebook || "";
    const instagram = data?.socialLinks?.instagram || data?.instagramProfileUrl || data?.instagram || "";
    const youtube = data?.socialLinks?.youtube || data?.youtubeChannelUrl || data?.youtube || "";
    if (twitter || facebook || instagram || youtube) {
      setSocialLinks((prev) => ({
        twitter: twitter || prev.twitter,
        facebook: facebook || prev.facebook,
        instagram: instagram || prev.instagram,
        youtube: youtube || prev.youtube,
      }));
    }
  }, [
    data?.socialLinks,
    data?.xProfileUrl,
    data?.twitter,
    data?.facebookPageUrl,
    data?.facebook,
    data?.instagramProfileUrl,
    data?.instagram,
    data?.youtubeChannelUrl,
    data?.youtube,
  ]);

  // Timers for Email OTP
  useEffect(() => {
    let interval = null;
    if (emailOtpState === "otp") {
      interval = setInterval(() => {
        setEmailResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
        setEmailExpiryTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [emailOtpState]);

  // Timers for Mobile OTP
  useEffect(() => {
    let interval = null;
    if (mobileOtpState === "otp") {
      interval = setInterval(() => {
        setMobileResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
        setMobileExpiryTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mobileOtpState]);

  // Sync to parent on change
  const syncToParent = (overrides = {}) => {
    const payload = {
      legalOrgType,
      registeredOrgName: displayOrgName,
      legalRegistrationNumber: regNumber,
      registrationAuthority: regAuthority,
      dateOfRegistration: regDate,
      registeredOfficeCountryId: country,
      publicationName: digitalPubName || displayPubName,
      officialWebsite: officialWebsite || displayOfficialWebsite,
      regulatoryReferenceId: regulatoryRef,
      grievanceCouncil,
      socialLinks,
      xProfileUrl: socialLinks.twitter,
      twitter: socialLinks.twitter,
      facebookPageUrl: socialLinks.facebook,
      facebook: socialLinks.facebook,
      instagramProfileUrl: socialLinks.instagram,
      instagram: socialLinks.instagram,
      youtubeChannelUrl: socialLinks.youtube,
      youtube: socialLinks.youtube,
      officialEmail: displayOfficialEmail,
      primaryMobile: displayPrimaryMobile,
      primaryMobileNumber: displayPrimaryMobile,
      isEmailVerified: emailVerified,
      isMobileVerified: mobileVerified,
      documents: [
        ...(regDoc ? [normalizeDoc(regDoc)] : []),
        ...(mediaAuthDoc ? [normalizeDoc(mediaAuthDoc)] : []),
      ].filter(Boolean),
      ...overrides,
    };
    if (onChange) onChange(payload);
    setCachedDraft(payload);
    return payload;
  };

  const handleSaveDraftClick = () => {
    syncToParent();
    setIsDraftSaved(true);
    if (onSaveDraft) onSaveDraft();
    setTimeout(() => {
      setIsDraftSaved(false);
    }, 2500);
  };

  const getResolvedAppId = () => {
    const list = [
      data?.applicationId,
      data?.owner?.applicationId,
      data?.id,
      data?._id,
      getCachedDraft()?.applicationId,
      getCachedDraft()?.owner?.applicationId,
      getCachedDraft()?.id,
    ];
    for (const item of list) {
      if (isValidRealApplicationId(item)) return item;
    }
    return "";
  };

  const effectiveAppId = getResolvedAppId();

  const handleGenerateEmailOtp = async () => {
    setIsSendingEmailOtp(true);
    setEmailOtpError("");
    try {
      const activeAppId = getResolvedAppId() || effectiveAppId || null;

      const res = await sendOtp(activeAppId, "EMAIL");
      const activeId =
        res?.data?.applicationId ||
        res?.data?.owner?.applicationId ||
        getCachedDraft()?.applicationId;
      if (activeId && onChange) {
        onChange({ applicationId: activeId, id: activeId });
      }
      setEmailOtpState("otp");
      setEmailResendTimer(res?.data?.resendCooldownSeconds || 30);
      setEmailExpiryTimer(res?.data?.expiresInSeconds || 299);
      setEmailOtpError("");
      setEmailOtpDigits(["", "", "", "", "", ""]);
      setTimeout(() => {
        emailInputsRef.current[0]?.focus();
      }, 50);
    } catch (err) {
      console.warn("Email OTP dispatch notice:", err?.message);
      setEmailOtpState("otp");
      setEmailResendTimer(30);
      setEmailExpiryTimer(299);
      setEmailOtpError("");
      setEmailOtpDigits(["", "", "", "", "", ""]);
      setTimeout(() => {
        emailInputsRef.current[0]?.focus();
      }, 50);
    } finally {
      setIsSendingEmailOtp(false);
    }
  };

  const handleResendEmailOtp = async () => {
    setIsSendingEmailOtp(true);
    setEmailOtpError("");
    try {
      const activeAppId = getResolvedAppId() || effectiveAppId || null;

      const res = await sendOtp(activeAppId, "EMAIL");
      const activeId =
        res?.data?.applicationId ||
        res?.data?.owner?.applicationId ||
        getCachedDraft()?.applicationId;
      if (activeId && onChange) {
        onChange({ applicationId: activeId, id: activeId });
      }
      setEmailResendTimer(res?.data?.resendCooldownSeconds || 30);
      setEmailExpiryTimer(res?.data?.expiresInSeconds || 299);
      setEmailOtpError("");
      setEmailOtpDigits(["", "", "", "", "", ""]);
      setTimeout(() => {
        emailInputsRef.current[0]?.focus();
      }, 50);
    } catch (err) {
      console.warn("Email OTP resend notice:", err?.message);
      setEmailResendTimer(30);
      setEmailExpiryTimer(299);
      setEmailOtpError("");
    } finally {
      setIsSendingEmailOtp(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    const code = emailOtpDigits.join("");
    if (code.length < 6) {
      setEmailOtpError("Please enter all 6 digits of the OTP.");
      return;
    }
    setIsVerifyingEmail(true);
    setEmailOtpError("");
    try {
      const currAppId = getResolvedAppId() || effectiveAppId || null;

      const res = await verifyOtp(currAppId, "EMAIL", code);
      const isVerifiedSuccess =
        res?.data?.isVerified === true ||
        res?.data?.verified === true ||
        res?.data?.emailVerified === true ||
        res?.data?.officialEmailVerified === true ||
        (res?.status === "success" && res?.data?.isVerified !== false && res?.status !== "error");

      if (isVerifiedSuccess) {
        setEmailOtpError("");
        setEmailVerified(true);
        setEmailOtpState("verified");
        const activeId = res?.data?.applicationId || currAppId;
        syncToParent({
          isEmailVerified: true,
          officialEmailVerified: true,
          ...(activeId ? { applicationId: activeId, id: activeId } : {}),
        });
        setCachedDraft({
          isEmailVerified: true,
          officialEmailVerified: true,
          ...(activeId ? { applicationId: activeId, id: activeId } : {}),
        });
      } else {
        const msg = res?.message || "Invalid or incorrect OTP code. Please enter the correct OTP.";
        setEmailOtpError(msg);
      }
    } catch (err) {
      setEmailOtpError(err?.message || "Invalid or incorrect OTP code. Please enter the correct OTP.");
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  const handleGenerateMobileOtp = async () => {
    setIsSendingMobileOtp(true);
    setMobileOtpError("");
    try {
      const activeAppId = getResolvedAppId() || effectiveAppId || null;

      const res = await sendOtp(activeAppId, "MOBILE");
      const activeId =
        res?.data?.applicationId ||
        res?.data?.owner?.applicationId ||
        getCachedDraft()?.applicationId;
      if (activeId && onChange) {
        onChange({ applicationId: activeId, id: activeId });
      }
      setMobileOtpState("otp");
      setMobileResendTimer(res?.data?.resendCooldownSeconds || 30);
      setMobileExpiryTimer(res?.data?.expiresInSeconds || 299);
      setMobileOtpError("");
      setMobileOtpDigits(["", "", "", "", "", ""]);
      setTimeout(() => {
        mobileInputsRef.current[0]?.focus();
      }, 50);
    } catch (err) {
      console.warn("Mobile OTP dispatch notice:", err?.message);
      setMobileOtpState("otp");
      setMobileResendTimer(30);
      setMobileExpiryTimer(299);
      setMobileOtpError("");
      setMobileOtpDigits(["", "", "", "", "", ""]);
      setTimeout(() => {
        mobileInputsRef.current[0]?.focus();
      }, 50);
    } finally {
      setIsSendingMobileOtp(false);
    }
  };

  const handleResendMobileOtp = async () => {
    setIsSendingMobileOtp(true);
    setMobileOtpError("");
    try {
      const activeAppId = getResolvedAppId() || effectiveAppId || null;

      const res = await sendOtp(activeAppId, "MOBILE");
      const activeId =
        res?.data?.applicationId ||
        res?.data?.owner?.applicationId ||
        getCachedDraft()?.applicationId;
      if (activeId && onChange) {
        onChange({ applicationId: activeId, id: activeId });
      }
      setMobileResendTimer(res?.data?.resendCooldownSeconds || 30);
      setMobileExpiryTimer(res?.data?.expiresInSeconds || 299);
      setMobileOtpError("");
      setMobileOtpDigits(["", "", "", "", "", ""]);
      setTimeout(() => {
        mobileInputsRef.current[0]?.focus();
      }, 50);
    } catch (err) {
      console.warn("Mobile OTP resend notice:", err?.message);
      setMobileResendTimer(30);
      setMobileExpiryTimer(299);
      setMobileOtpError("");
    } finally {
      setIsSendingMobileOtp(false);
    }
  };

  const handleVerifyMobileOtp = async () => {
    const code = mobileOtpDigits.join("");
    if (code.length < 6) {
      setMobileOtpError("Please enter all 6 digits of the OTP.");
      return;
    }
    setIsVerifyingMobile(true);
    setMobileOtpError("");
    try {
      const currAppId = getResolvedAppId() || effectiveAppId || null;

      const res = await verifyOtp(currAppId, "MOBILE", code);
      const isVerifiedSuccess =
        res?.data?.isVerified === true ||
        res?.data?.verified === true ||
        res?.data?.primaryMobileVerified === true ||
        res?.data?.mobileVerified === true ||
        (res?.status === "success" && res?.data?.isVerified !== false && res?.status !== "error");

      if (isVerifiedSuccess) {
        setMobileOtpError("");
        setMobileVerified(true);
        setMobileOtpState("verified");
        const activeId = res?.data?.applicationId || currAppId;
        syncToParent({
          isMobileVerified: true,
          primaryMobileVerified: true,
          ...(activeId ? { applicationId: activeId, id: activeId } : {}),
        });
        setCachedDraft({
          isMobileVerified: true,
          primaryMobileVerified: true,
          ...(activeId ? { applicationId: activeId, id: activeId } : {}),
        });
      } else {
        const msg = res?.message || "Invalid or incorrect OTP code. Please enter the correct OTP.";
        setMobileOtpError(msg);
      }
    } catch (err) {
      setMobileOtpError(err?.message || "Invalid or incorrect OTP code. Please enter the correct OTP.");
    } finally {
      setIsVerifyingMobile(false);
    }
  };

  // Generic 6-box OTP input handler
  const handleOtpInput = (index, value, type) => {
    const clean = value.replace(/[^0-9]/g, "");
    const singleDigit = clean ? clean[clean.length - 1] : "";

    if (type === "email") {
      const copy = [...emailOtpDigits];
      copy[index] = singleDigit;
      setEmailOtpDigits(copy);
      setEmailOtpError("");
      if (singleDigit && index < 5) {
        emailInputsRef.current[index + 1]?.focus();
      }
    } else {
      const copy = [...mobileOtpDigits];
      copy[index] = singleDigit;
      setMobileOtpDigits(copy);
      setMobileOtpError("");
      if (singleDigit && index < 5) {
        mobileInputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e, type) => {
    if (e.key === "Backspace") {
      const arr = type === "email" ? emailOtpDigits : mobileOtpDigits;
      if (!arr[index] && index > 0) {
        const refArr = type === "email" ? emailInputsRef.current : mobileInputsRef.current;
        refArr[index - 1]?.focus();
      }
    }
  };

  const handleOtpPaste = (e, type) => {
    e.preventDefault();
    const paste = (e.clipboardData || window.clipboardData)
      .getData("text")
      .replace(/[^0-9]/g, "");
    if (!paste) return;

    const digits = paste.slice(0, 6).split("");
    const newArr = ["", "", "", "", "", ""];
    digits.forEach((d, i) => {
      newArr[i] = d;
    });

    if (type === "email") {
      setEmailOtpDigits(newArr);
      setEmailOtpError("");
      const nextIdx = Math.min(digits.length, 5);
      emailInputsRef.current[nextIdx]?.focus();
    } else {
      setMobileOtpDigits(newArr);
      setMobileOtpError("");
      const nextIdx = Math.min(digits.length, 5);
      mobileInputsRef.current[nextIdx]?.focus();
    }
  };

  // File Upload Handlers (Real Multi-part upload)
  const handleRegFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await uploadDocument(
        data?.applicationId || "temp",
        file,
        "ORGANISATION_REGISTRATION"
      );
      const docRecord = res?.data || {
        documentId: `doc_${Date.now()}`,
        originalName: file.name,
        fileSizeBytes: file.size,
        fileSizeFormatted: formatBytes(file.size),
        documentType: "ORGANISATION_REGISTRATION",
      };
      const newDoc = normalizeDoc({
        id: docRecord.documentId || docRecord.id,
        name: docRecord.originalName || file.name,
        originalName: docRecord.originalName || file.name,
        size: docRecord.fileSizeFormatted || formatBytes(file.size),
        fileSizeFormatted: docRecord.fileSizeFormatted || formatBytes(file.size),
        uploadedAgo: "Uploaded just now",
        fileUrl: docRecord.fileUrl,
        type: "REGISTRATION",
        documentType: "ORGANISATION_REGISTRATION",
      });
      setRegDoc(newDoc);
      const remainingDocs = (data?.documents || []).filter(
        (d) => d.type !== "REGISTRATION" && d.documentType !== "ORGANISATION_REGISTRATION"
      );
      syncToParent({
        documents: [...remainingDocs, newDoc].map(normalizeDoc).filter(Boolean),
      });
    } catch (err) {
      alert(err.message || "Failed to upload registration document.");
    }
  };

  const handleMediaFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await uploadDocument(
        data?.applicationId || "temp",
        file,
        "MEDIA_AUTHORISATION"
      );
      const docRecord = res?.data || {
        documentId: `doc_${Date.now()}`,
        originalName: file.name,
        fileSizeBytes: file.size,
        fileSizeFormatted: formatBytes(file.size),
        documentType: "MEDIA_AUTHORISATION",
      };
      const newDoc = normalizeDoc({
        id: docRecord.documentId || docRecord.id,
        name: docRecord.originalName || file.name,
        originalName: docRecord.originalName || file.name,
        size: docRecord.fileSizeFormatted || formatBytes(file.size),
        fileSizeFormatted: docRecord.fileSizeFormatted || formatBytes(file.size),
        uploadedAgo: "Uploaded just now",
        fileUrl: docRecord.fileUrl,
        type: "MEDIA_AUTH",
        documentType: "MEDIA_AUTHORISATION",
      });
      setMediaAuthDoc(newDoc);
      const remainingDocs = (data?.documents || []).filter(
        (d) => d.type !== "MEDIA_AUTH" && d.documentType !== "MEDIA_AUTHORISATION"
      );
      syncToParent({
        documents: [...remainingDocs, newDoc].map(normalizeDoc).filter(Boolean),
      });
    } catch (err) {
      alert(err.message || "Failed to upload media authorisation document.");
    }
  };

  const handleRemoveRegDoc = () => {
    setRegDoc(null);
    const remainingDocs = (data?.documents || []).filter(
      (d) => d.type !== "REGISTRATION" && d.documentType !== "ORGANISATION_REGISTRATION"
    );
    syncToParent({ documents: remainingDocs });
  };

  const handleRemoveMediaAuthDoc = () => {
    setMediaAuthDoc(null);
    const remainingDocs = (data?.documents || []).filter(
      (d) => d.type !== "MEDIA_AUTH" && d.documentType !== "MEDIA_AUTHORISATION"
    );
    syncToParent({ documents: remainingDocs });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsValidating(true);

    const payload = syncToParent();

    setTimeout(() => {
      setIsValidating(false);
      if (onNext) {
        onNext(payload);
      }
    }, 400);
  };

  const isBothContactVerified = emailVerified && mobileVerified;

  // Resolve connected owner & role from data props, cached draft, or localStorage user profile
  const [syncedOwner, setSyncedOwner] = useState(null);
  const [syncedRole, setSyncedRole] = useState("");
  const [syncedOtherRole, setSyncedOtherRole] = useState("");

  useEffect(() => {
    const draft = getCachedDraft();

    let resolvedOwner =
      data?.owner ||
      draft?.owner ||
      null;

    let resolvedRole =
      data?.ownerRole ||
      data?.owner?.ownerRole ||
      draft?.ownerRole ||
      draft?.owner?.ownerRole ||
      "";

    let resolvedOther =
      data?.otherRoleSpecification ||
      data?.owner?.otherRoleSpecification ||
      draft?.otherRoleSpecification ||
      draft?.owner?.otherRoleSpecification ||
      "";

    if (typeof window !== "undefined") {
      const storedName =
        localStorage.getItem("pintree_user_full_name") ||
        localStorage.getItem("pintree_user_name");
      const storedHandle =
        localStorage.getItem("pintree_user_handle") ||
        localStorage.getItem("pintree_user_handle_id");
      const storedAvatar =
        localStorage.getItem("pintree_user_profile_image") ||
        localStorage.getItem("pintree_user_avatar");
      const storedUserId = localStorage.getItem("pintree_user_id");
      const storedEmail =
        localStorage.getItem("pintree_user_email") ||
        localStorage.getItem("pintree_auth_email");

      if (!resolvedOwner || (!resolvedOwner.fullName && !resolvedOwner.userId) || isDummyOwner(resolvedOwner)) {
        if (storedName && !isDummyOwner({ fullName: storedName, handle: storedHandle })) {
          resolvedOwner = {
            userId: storedUserId || "usr_user",
            fullName: storedName,
            handle: storedHandle
              ? storedHandle.startsWith("@")
                ? storedHandle
                : `@${storedHandle}`
              : "",
            profileImageUrl: storedAvatar || "",
            email: storedEmail || "",
          };
        }
      } else if (storedAvatar && !resolvedOwner.profileImageUrl) {
        resolvedOwner = { ...resolvedOwner, profileImageUrl: storedAvatar };
      }
    }

    if (resolvedOwner) setSyncedOwner(resolvedOwner);
    if (resolvedRole) setSyncedRole(resolvedRole);
    if (resolvedOther) setSyncedOtherRole(resolvedOther);
  }, [
    data?.owner,
    data?.ownerRole,
    data?.otherRoleSpecification,
  ]);

  const displayOwner =
    syncedOwner && syncedOwner.fullName
      ? syncedOwner
      : data?.owner && (data.owner.fullName || data.owner.userId)
      ? data.owner
      : getCachedDraft()?.owner || getInitialOwner();

  const displayOwnerRole =
    data?.ownerRole ||
    data?.owner?.ownerRole ||
    syncedRole ||
    getCachedDraft()?.ownerRole ||
    getCachedDraft()?.owner?.ownerRole ||
    "FOUNDER";

  const displayOtherRole =
    data?.otherRoleSpecification ||
    data?.owner?.otherRoleSpecification ||
    syncedOtherRole ||
    getCachedDraft()?.otherRoleSpecification ||
    getCachedDraft()?.owner?.otherRoleSpecification ||
    "";

  const ownerInitials = (displayOwner.fullName || "User")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0].toUpperCase())
    .slice(0, 2)
    .join("") || "U";

  return (
    <main className="w-full max-w-7xl mx-auto px-gutter font-jakarta">
      <div className="flex flex-col w-full">
        <div className="w-full max-w-[1280px] mx-auto pb-24 pt-4 md:pt-8 text-on-surface">
          {/* Top Breadcrumb & Metadata Ribbon */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant mb-6"
          >
              <span
                onClick={onBack}
                className="hover:text-primary transition-colors cursor-pointer"
              >
                Professional &amp; Public Accounts
              </span>
              <span className="text-outline-variant font-light">/</span>
              <span className="text-on-surface font-label-sm font-medium">
                News &amp; Media
              </span>
            </nav>

            {/* Main Section Heading */}
            <header className="mb-10 lg:mb-12">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-fixed text-label-sm font-label-sm mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>{" "}
                    Account Onboarding
                  </span>
                  <h1
                    className="font-headline-lg text-headline-lg text-primary tracking-tight"
                    style={{
                      fontFamily:
                        'Aeonik, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      fontWeight: 500,
                    }}
                  >
                    Verification Information
                  </h1>
                  <p
                    className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-2"
                    style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                  >
                    Provide your organisation&apos;s statutory registration and applicable
                    media authorisation details to verify and authenticate your
                    News &amp; Media publication on Pintree.
                  </p>
                </div>
                <div className="hidden lg:flex items-center gap-2 text-label-sm font-label-sm text-on-surface-variant bg-surface-container-low px-3.5 py-2 rounded-xl shrink-0">
                  <Icon name="verified_user" className="text-secondary text-[18px]" />
                  <span>Official Identity Verification Required</span>
                </div>
              </div>
            </header>

            {/* 5-Stage Progress Stepper */}
            <Stepper currentStep={3} onStepClick={onJumpToStep || onBack} />

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
                      {displayPubName || "Publication"}
                    </span>
                    {pubTypeDisplay && (
                      <>
                        <span className="text-outline-variant font-body-sm">·</span>
                        <span className="font-body-md text-body-md text-on-surface-variant">
                          {pubTypeDisplay}
                        </span>
                      </>
                    )}
                    {displayOrgName && (
                      <>
                        <span className="text-outline-variant font-body-sm">·</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          {displayOrgName}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button
                className="shrink-0 text-on-surface-variant hover:text-primary font-label-md text-label-md flex items-center gap-1 transition-colors px-3 py-1.5 rounded-lg hover:bg-surface-container-high cursor-pointer"
                type="button"
                onClick={() => onJumpToStep && onJumpToStep(1)}
              >
                <Icon name="edit_note" className="text-[16px]" /> Modify Step 1 Info
              </button>
            </div>

            {/* Connected Founder / Owner Reference Card */}
            <div className="mb-space-2xl bg-surface-container-low rounded-xl p-space-lg flex flex-col md:flex-row md:items-center justify-between gap-space-md border border-outline-variant/30">
              <div className="flex items-center gap-space-md">
                <div className="relative w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-base shadow-sm ring-2 ring-surface-container-lowest overflow-hidden shrink-0">
                  {!avatarError && displayOwner.profileImageUrl ? (
                    <img
                      className="w-full h-full object-cover"
                      alt={displayOwner.fullName || "User"}
                      src={displayOwner.profileImageUrl}
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <span>{ownerInitials}</span>
                  )}
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-tertiary-fixed flex items-center justify-center">
                    <Icon
                      name="verified"
                      className="text-[10px] text-tertiary-container"
                    />
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-space-xs">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                      Connected Founder / Owner
                    </span>
                  </div>
                  <div className="flex items-baseline gap-space-sm">
                    <span className="font-title-md text-title-md font-semibold text-primary">
                      {displayOwner.fullName || "Organisation Owner"}
                    </span>
                    {displayOwner.handle && (
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        {displayOwner.handle}
                      </span>
                    )}
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    {formatOwnerRole(displayOwnerRole, displayOtherRole)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-space-sm shrink-0">
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm">
                  <Icon name="check_circle" className="text-[14px]" />
                  Identity Verified &amp; Authenticated
                </span>
                <a
                  href="/account"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-md bg-surface-container-lowest text-on-surface-variant hover:text-primary font-label-sm text-label-sm transition-colors border border-outline-variant/30 cursor-pointer"
                >
                  View Profile
                </a>
              </div>
            </div>

            {/* Form Container */}
            <form className="flex flex-col gap-space-2xl" onSubmit={handleSubmit}>
              {/* SECTION ONE: Organisation Registration Details */}
              <section className="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm border border-outline-variant/30 relative z-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-xs pb-space-lg mb-space-lg bg-surface-container-low/50 -mx-space-xl -mt-space-xl p-space-xl rounded-t-xl border-b border-outline-variant/20">
                  <div>
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
                      Section 01
                    </span>
                    <h2
                      className="font-headline-sm text-headline-sm text-primary"
                      style={{
                        fontFamily:
                          'Aeonik, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        fontWeight: 500,
                      }}
                    >
                      Organisation Registration Details
                    </h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Provide the statutory legal registration details of the
                      commercial or non-profit entity governing this publication.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm shrink-0">
                    Step 1 Synced
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-space-xl gap-y-space-lg">
                  {/* Field 1: Legal Organisation Type */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="legalOrgType"
                      className="font-label-md text-label-md text-primary font-medium flex items-center justify-between"
                    >
                      <span>
                        Legal Organisation Type <span className="text-error">*</span>
                      </span>
                      <span className="text-on-surface-variant font-label-sm text-label-sm">
                        Entity Classification
                      </span>
                    </label>
                    <CustomDropdown
                      id="legalOrgType"
                      required
                      placeholder="Select Legal Organisation Type"
                      value={legalOrgType}
                      onChange={(val) => setLegalOrgType(val)}
                      options={LEGAL_ORG_TYPE_OPTIONS}
                    />
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Select the registered corporate or legal structure as verified in corporate filings.
                    </span>
                  </div>

                  {/* Field 2: Registered Organisation Name */}
                  <div className="flex flex-col gap-1.5">
                    <div className="font-label-md text-label-md text-primary font-medium flex items-center justify-between">
                      <label htmlFor="registeredOrgName">
                        Registered Organisation Name <span className="text-error">*</span>
                      </label>
                      {isMounted && displayOrgName ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-secondary px-2 py-0.5 rounded-full bg-secondary-container">
                          <Icon name="lock" className="text-[12px]" /> Locked from Step 1
                        </span>
                      ) : isMounted ? (
                        <button
                          type="button"
                          onClick={() => onJumpToStep && onJumpToStep(1)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-secondary hover:underline cursor-pointer"
                        >
                          <Icon name="edit" className="text-[12px]" /> Enter in Step 1
                        </button>
                      ) : null}
                    </div>
                    <div className="relative">
                      <input
                        id="registeredOrgName"
                        value={displayOrgName}
                        onChange={(e) => {
                          setRegisteredOrgName(e.target.value);
                          if (onChange) onChange({ registeredOrgName: e.target.value });
                        }}
                        readOnly={Boolean(displayOrgName)}
                        tabIndex={displayOrgName ? -1 : 0}
                        required
                        placeholder={displayOrgName ? "" : "Enter your registered organisation name"}
                        className={`w-full h-11 px-3.5 pr-10 font-body-md text-body-md rounded-lg focus:outline-none transition-colors ${
                          displayOrgName
                            ? "bg-surface-container-high/60 text-primary cursor-not-allowed border border-outline-variant/30 select-none font-medium"
                            : "bg-surface-container-low text-primary focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary"
                        }`}
                        type="text"
                      />
                      <span className="absolute right-3 top-3 text-secondary pointer-events-none">
                        <Icon name={displayOrgName ? "lock" : "edit"} className="text-[18px]" />
                      </span>
                    </div>
                  </div>

                  {/* Field 3: Registration Number */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="regNumber"
                      className="font-label-md text-label-md text-primary font-medium flex items-center justify-between"
                    >
                      <span>
                        Registration Number (CIN / LLPIN / Reg No) <span className="text-error">*</span>
                      </span>
                      <span className="text-on-surface-variant font-label-sm text-label-sm">
                        Statutory ID
                      </span>
                    </label>
                    <input
                      id="regNumber"
                      value={regNumber}
                      onChange={(e) => setRegNumber(e.target.value)}
                      required
                      className="w-full h-11 px-3.5 bg-surface-container-low hover:bg-surface-container border border-transparent hover:border-outline-variant/40 text-primary font-body-md text-body-md rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary transition-all uppercase tracking-wide font-mono"
                      placeholder="e.g. CIN / LLPIN or Statutory Reg Number"
                      type="text"
                    />
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Unique corporate identification code allocated by the company registry.
                    </span>
                  </div>

                  {/* Field 4: Registration Authority */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="regAuthority"
                      className="font-label-md text-label-md text-primary font-medium flex items-center justify-between"
                    >
                      <span>
                        Registration Authority <span className="text-error">*</span>
                      </span>
                      <span className="text-on-surface-variant font-label-sm text-label-sm">
                        Issuing Body
                      </span>
                    </label>
                    <input
                      id="regAuthority"
                      value={regAuthority}
                      onChange={(e) => setRegAuthority(e.target.value)}
                      required
                      className="w-full h-11 px-3.5 bg-surface-container-low hover:bg-surface-container border border-transparent hover:border-outline-variant/40 text-primary font-body-md text-body-md rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary transition-all"
                      placeholder="e.g. Registrar of Companies (RoC), Ministry of Corporate Affairs"
                      type="text"
                    />
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      The jurisdictional government registry or agency that accredited the entity.
                    </span>
                  </div>

                  {/* Field 5: Date of Registration */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="regDate"
                      className="font-label-md text-label-md text-primary font-medium flex items-center justify-between"
                    >
                      <span>
                        Date of Registration{" "}
                        <span className="text-on-surface-variant font-normal">
                          (Optional)
                        </span>
                      </span>
                      <span className="text-on-surface-variant font-label-sm text-label-sm">
                        DD/MM/YYYY
                      </span>
                    </label>
                    <div className="relative flex items-center">
                      <input
                        id="regDate"
                        type="text"
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="DD/MM/YYYY"
                        value={regDate}
                        onChange={handleManualDateChange}
                        className="w-full h-11 px-3.5 pr-11 bg-surface-container-low hover:bg-surface-container border border-transparent hover:border-outline-variant/40 text-primary placeholder:text-on-surface-variant/60 font-body-md text-body-md rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary transition-all"
                      />
                      <input
                        ref={nativeDateInputRef}
                        type="date"
                        tabIndex={-1}
                        aria-hidden="true"
                        value={formatIsoDate(regDate)}
                        onChange={handleNativeDateChange}
                        className="sr-only"
                      />
                      <button
                        type="button"
                        onClick={handleOpenCalendar}
                        className="absolute right-3 p-1 text-on-surface-variant hover:text-primary transition-colors cursor-pointer flex items-center justify-center"
                        title="Choose date from calendar"
                        aria-label="Choose date from calendar"
                      >
                        <Icon name="calendar_today" className="text-[18px]" />
                      </button>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Date stamped on the official certificate of incorporation.
                    </span>
                  </div>

                  {/* Field 6: Registered Office Country */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="regCountry"
                      className="font-label-md text-label-md text-primary font-medium flex items-center justify-between"
                    >
                      <span>
                        Registered Office Country <span className="text-error">*</span>
                      </span>
                      <span className="text-on-surface-variant font-label-sm text-label-sm">
                        Primary Domicile
                      </span>
                    </label>
                    <CustomDropdown
                      id="regCountry"
                      required
                      placeholder="Select Country"
                      leadingIcon="location_on"
                      value={country}
                      onChange={(val) => {
                        setCountry(val);
                        const sel = countryOptions.find((c) => (c.value || c.id || c.code) === val);
                        const cName = sel?.label || sel?.name || (val === "cnt_in" || val === "country-in" ? "India" : "");
                        if (onChange) {
                          onChange({
                            registeredOfficeCountryId: val,
                            registeredOfficeCountryName: cName,
                          });
                        }
                      }}
                      options={countryOptions}
                    />
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Country where corporate tax domicile is maintained.
                    </span>
                  </div>
                </div>
              </section>

              {/* SECTION TWO: Media / Publication Authorisation */}
              <section className="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm border border-outline-variant/30 relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-xs pb-space-lg mb-space-lg bg-surface-container-low/50 -mx-space-xl -mt-space-xl p-space-xl rounded-t-xl border-b border-outline-variant/20">
                  <div>
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
                      Section 02
                    </span>
                    <h2
                      className="font-headline-sm text-headline-sm text-primary"
                      style={{
                        fontFamily:
                          'Aeonik, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        fontWeight: 500,
                      }}
                    >
                      Media / Publication Authorisation
                    </h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Specify operating license, channel parameters, and editorial regulatory affiliations.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-secondary-container text-on-secondary-container font-label-sm text-label-sm shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>{" "}
                    Dynamic Context Adaptive
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-space-xl gap-y-space-lg">
                  {/* Field 1: Digital Publication Name */}
                  <div className="flex flex-col gap-1.5">
                    <div className="font-label-md text-label-md text-primary font-medium flex items-center justify-between">
                      <label htmlFor="digitalPubName">
                        Publication Name <span className="text-error">*</span>
                      </label>
                      {isMounted && displayPubName ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-secondary px-2 py-0.5 rounded-full bg-secondary-container">
                          <Icon name="lock" className="text-[12px]" /> Locked from Step 1
                        </span>
                      ) : (
                        <span className="text-secondary font-label-sm text-label-sm">
                          Primary Brand
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        id="digitalPubName"
                        value={displayPubName}
                        onChange={(e) => {
                          setDigitalPubName(e.target.value);
                          if (onChange) onChange({ publicationName: e.target.value });
                        }}
                        readOnly={Boolean(displayPubName)}
                        tabIndex={displayPubName ? -1 : 0}
                        required
                        placeholder={displayPubName ? "" : "Enter your publication name"}
                        className={`w-full h-11 px-3.5 pr-10 font-body-md text-body-md rounded-lg focus:outline-none transition-colors ${
                          displayPubName
                            ? "bg-surface-container-high/60 text-primary cursor-not-allowed border border-outline-variant/30 select-none font-medium"
                            : "bg-surface-container-low text-primary focus:bg-surface-container-lowest"
                        }`}
                        type="text"
                      />
                      <span className="absolute right-3 top-3 text-secondary pointer-events-none">
                        <Icon name={displayPubName ? "lock" : "edit"} className="text-[18px]" />
                      </span>
                    </div>
                  </div>

                  {/* Field 2: Official Publication Website */}
                  <div className="flex flex-col gap-1.5">
                    <div className="font-label-md text-label-md text-primary font-medium flex items-center justify-between">
                      <label htmlFor="pubWebsite">
                        Official Publication Website <span className="text-error">*</span>
                      </label>
                      {isMounted && displayOfficialWebsite ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-secondary px-2 py-0.5 rounded-full bg-secondary-container">
                          <Icon name="lock" className="text-[12px]" /> Locked from Step 1
                        </span>
                      ) : (
                        <span className="text-secondary font-label-sm text-label-sm">
                          Verified Domain
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        id="pubWebsite"
                        value={displayOfficialWebsite || ""}
                        onChange={(e) => {
                          const val = e.target.value.replace(/^https?:\/\//i, "").trim();
                          setOfficialWebsite(val);
                          if (onChange) onChange({ officialWebsite: val, website: val });
                        }}
                        readOnly={Boolean(displayOfficialWebsite)}
                        tabIndex={displayOfficialWebsite ? -1 : 0}
                        placeholder={displayOfficialWebsite ? "" : "www.example.com"}
                        required
                        className={`w-full h-11 pl-9 pr-10 font-body-md text-body-md rounded-lg focus:outline-none transition-colors ${
                          displayOfficialWebsite
                            ? "bg-surface-container-high/60 text-primary cursor-not-allowed border border-outline-variant/30 select-none font-medium"
                            : "bg-surface-container-low text-primary focus:bg-surface-container-lowest"
                        }`}
                        type="text"
                      />
                      <span className="pointer-events-none absolute left-3 top-3 text-secondary">
                        <Icon name="link" className="text-[16px]" />
                      </span>
                      {displayOfficialWebsite && (
                        <span className="absolute right-3 top-3 text-secondary pointer-events-none">
                          <Icon name="lock" className="text-[18px]" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Field 3: Publishing Organisation */}
                  <div className="flex flex-col gap-1.5">
                    <div className="font-label-md text-label-md text-primary font-medium flex items-center justify-between">
                      <label htmlFor="publishingOrg">
                        Publishing Organisation <span className="text-error">*</span>
                      </label>
                      {isMounted && displayOrgName ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-secondary px-2 py-0.5 rounded-full bg-secondary-container">
                          <Icon name="lock" className="text-[12px]" /> Locked from Step 1
                        </span>
                      ) : (
                        <span className="text-on-surface-variant font-label-sm text-label-sm">
                          Entity
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        id="publishingOrg"
                        value={displayOrgName}
                        readOnly
                        tabIndex={-1}
                        placeholder={displayOrgName ? "" : "Enter in Step 1"}
                        className="w-full h-11 px-3.5 pr-10 bg-surface-container-high/60 text-primary font-body-md text-body-md rounded-lg focus:outline-none cursor-not-allowed border border-outline-variant/30 select-none font-medium"
                        type="text"
                      />
                      <span className="absolute right-3 top-3 text-secondary pointer-events-none">
                        <Icon name="lock" className="text-[18px]" />
                      </span>
                    </div>
                  </div>

                  {/* Field 4: Regulatory Reference */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="regulatoryRef"
                      className="font-label-md text-label-md text-primary font-medium flex items-center justify-between"
                    >
                      <span>
                        Applicable Regulatory Reference / Compliance ID{" "}
                        <span className="text-on-surface-variant font-normal">
                          (Optional)
                        </span>
                      </span>
                      <span className="text-on-surface-variant font-label-sm text-label-sm">
                        Ministry ID
                      </span>
                    </label>
                    <input
                      id="regulatoryRef"
                      value={regulatoryRef}
                      onChange={(e) => setRegulatoryRef(e.target.value)}
                      placeholder="e.g. Regulatory Reference ID or Accreditation Index"
                      className="w-full h-11 px-3.5 bg-surface-container-low hover:bg-surface-container border border-transparent hover:border-outline-variant/40 text-primary font-body-md text-body-md rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary transition-all font-mono"
                      type="text"
                    />
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Ministry of Information &amp; Broadcasting or local digital news registry index.
                    </span>
                  </div>

                  {/* Field 5: Grievance Council */}
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label
                      htmlFor="grievanceCouncil"
                      className="font-label-md text-label-md text-primary font-medium flex items-center justify-between"
                    >
                      <span>
                        Industry Body / Grievance Redressal Council{" "}
                        <span className="text-on-surface-variant font-normal">
                          (Optional)
                        </span>
                      </span>
                      <span className="text-on-surface-variant font-label-sm text-label-sm">
                        Self-Regulation
                      </span>
                    </label>
                    <CustomDropdown
                      id="grievanceCouncil"
                      placeholder="Select Industry Body / Council"
                      value={grievanceCouncil}
                      onChange={(val) => setGrievanceCouncil(val)}
                      options={GRIEVANCE_COUNCIL_OPTIONS}
                    />
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Accredited member association providing Level-II reader grievance redressal mechanism.
                    </span>
                  </div>
                </div>
              </section>

              {/* SECTION THREE: Supporting Verification Documents */}
              <section className="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm border border-outline-variant/30 overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-xs pb-space-lg mb-space-lg bg-surface-container-low/50 -mx-space-xl -mt-space-xl p-space-xl rounded-t-xl border-b border-outline-variant/20">
                  <div>
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
                      Section 03
                    </span>
                    <h2
                      className="font-headline-sm text-headline-sm text-primary"
                      style={{
                        fontFamily:
                          'Aeonik, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        fontWeight: 500,
                      }}
                    >
                      Supporting Verification Documents
                    </h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Upload official documents to establish your organisation&apos;s identity and publishing authority.
                    </p>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-high/60 px-3 py-1 rounded-md shrink-0">
                    Supported: PDF, JPG, JPEG, PNG | Maximum 15 MB per file.
                  </span>
                </div>

                <div className="flex flex-col gap-space-xl">
                  {/* Document Upload 01 */}
                  <div className="flex flex-col gap-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <label className="font-label-md text-label-md text-primary font-semibold">
                        Organisation Registration Document <span className="text-error">*</span>
                      </label>
                      <span className="font-label-sm text-label-sm text-tertiary-container bg-tertiary-fixed px-2.5 py-0.5 rounded font-medium max-w-fit">
                        Required to provide at least one verification document.
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Upload your organisation&apos;s official registration certificate or equivalent business identity evidence.
                    </p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant text-[13px] opacity-85">
                      <span className="font-medium text-primary">Examples:</span> Certificate of Incorporation, LLP Registration Certificate, Partnership Registration, Partnership Deed or applicable business registration evidence.
                    </p>

                    <input
                      type="file"
                      ref={regFileInputRef}
                      onChange={handleRegFileUpload}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                    />

                    {regDoc ? (
                      /* Document 01 Full-Width Card (Validated / Uploaded Preview) */
                      <div className="bg-surface-container-low rounded-lg p-space-md flex flex-col md:flex-row md:items-center justify-between gap-space-md border border-outline-variant/30">
                        <div className="flex items-center gap-space-md">
                          <div className="w-10 h-10 rounded-md bg-surface-container-lowest flex items-center justify-center text-secondary shadow-xs shrink-0">
                            <Icon name="description" className="text-[24px]" />
                          </div>
                          <div className="flex flex-col">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-label-md text-label-md font-medium text-primary">
                                {(regDoc.name || regDoc.originalName || regDoc.fileName || "").trim() || "Certificate_of_Incorporation.pdf"}
                              </span>
                              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                              <span className="font-body-sm text-body-sm text-on-surface-variant">
                                {(regDoc.size || regDoc.fileSizeFormatted || (regDoc.fileSizeBytes ? formatBytes(regDoc.fileSizeBytes) : "") || "").trim() || "1.4 MB"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-secondary font-label-sm text-label-sm mt-0.5">
                              <Icon name="check_circle" className="text-[14px]" />
                              <span>Checksum verified{regDoc.uploadedAgo && regDoc.uploadedAgo.trim() ? ` • ${regDoc.uploadedAgo.trim()}` : " • Verified"}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-space-sm shrink-0">
                          <button
                            type="button"
                            onClick={() => regFileInputRef.current?.click()}
                            className="px-3 py-1.5 bg-surface-container-lowest hover:bg-surface-container-high rounded text-error font-label-sm text-label-sm transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Icon name="sync" className="text-[14px]" />
                            Replace
                          </button>
                          <button
                            type="button"
                            onClick={handleRemoveRegDoc}
                            className="px-3 py-1.5 bg-surface-container-lowest hover:bg-surface-container-high rounded text-error font-label-sm text-label-sm transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Icon name="delete" className="text-[14px]" />
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Document 01 Dropzone fallback if removed */
                      <div
                        onClick={() => regFileInputRef.current?.click()}
                        className="bg-surface-container-low hover:bg-surface-container transition-colors rounded-lg p-space-xl flex flex-col items-center justify-center text-center cursor-pointer group border border-outline-variant/30"
                      >
                        <div className="w-12 h-12 rounded-full bg-surface-container-lowest flex items-center justify-center text-secondary mb-space-sm group-hover:scale-105 transition-transform shadow-xs">
                          <Icon name="cloud_upload" className="text-[24px]" />
                        </div>
                        <span className="font-title-md text-title-md font-medium text-primary mb-1">
                          Drag and drop file here, or browse
                        </span>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                          Supported: PDF, JPG, JPEG, PNG • Max 15MB
                        </p>
                        <button
                          type="button"
                          className="px-4 py-2 bg-primary text-on-primary rounded font-label-md text-label-md font-medium hover:bg-primary-container transition-colors"
                        >
                          Browse Files
                        </button>
                      </div>
                    )}
                    <div className="font-body-sm text-body-sm text-on-surface-variant text-[12px]">
                      PDF, JPG, JPEG, PNG • Max 15MB
                    </div>
                  </div>

                  {/* Document Upload 02 */}
                  <div className="flex flex-col gap-2.5 pt-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <label className="font-label-md text-label-md text-primary font-semibold">
                        Media / Publication Authorisation
                      </label>
                      <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-high px-2.5 py-0.5 rounded font-medium max-w-fit">
                        Optional
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Upload the applicable media licence, publication registration certificate or official evidence of publishing authority.
                    </p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant text-[13px] opacity-85">
                      <span className="font-medium text-primary">Online News / Digital Publication:</span> Upload applicable publisher registration, publisher declaration, website/domain ownership evidence or other relevant official documentation.
                    </p>

                    <input
                      type="file"
                      ref={mediaFileInputRef}
                      onChange={handleMediaFileUpload}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                    />

                    {mediaAuthDoc ? (
                      <div className="bg-surface-container-low rounded-lg p-space-md flex flex-col md:flex-row md:items-center justify-between gap-space-md border border-outline-variant/30">
                        <div className="flex items-center gap-space-md">
                          <div className="w-10 h-10 rounded-md bg-surface-container-lowest flex items-center justify-center text-secondary shadow-xs shrink-0">
                            <Icon name="description" className="text-[24px]" />
                          </div>
                          <div className="flex flex-col">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-label-md text-label-md font-medium text-primary">
                                {(mediaAuthDoc.name || mediaAuthDoc.originalName || mediaAuthDoc.fileName || "").trim() || "Media_Authorisation_Document.pdf"}
                              </span>
                              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                              <span className="font-body-sm text-body-sm text-on-surface-variant">
                                {(mediaAuthDoc.size || mediaAuthDoc.fileSizeFormatted || (mediaAuthDoc.fileSizeBytes ? formatBytes(mediaAuthDoc.fileSizeBytes) : "") || "").trim() || "850 KB"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-secondary font-label-sm text-label-sm mt-0.5">
                              <Icon name="check_circle" className="text-[14px]" />
                              <span>Checksum verified{mediaAuthDoc.uploadedAgo && mediaAuthDoc.uploadedAgo.trim() ? ` • ${mediaAuthDoc.uploadedAgo.trim()}` : " • Verified"}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-space-sm shrink-0">
                          <button
                            type="button"
                            onClick={() => mediaFileInputRef.current?.click()}
                            className="px-3 py-1.5 bg-surface-container-lowest hover:bg-surface-container-high rounded text-error font-label-sm text-label-sm transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Icon name="sync" className="text-[14px]" />
                            Replace
                          </button>
                          <button
                            type="button"
                            onClick={handleRemoveMediaAuthDoc}
                            className="px-3 py-1.5 bg-surface-container-lowest hover:bg-surface-container-high rounded text-error font-label-sm text-label-sm transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Icon name="delete" className="text-[14px]" />
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Document 02 Dedicated Full-Width Dropzone */
                      <div
                        onClick={() => mediaFileInputRef.current?.click()}
                        className="bg-surface-container-low hover:bg-surface-container transition-colors rounded-lg p-space-xl flex flex-col items-center justify-center text-center cursor-pointer group border border-outline-variant/30"
                      >
                        <div className="w-12 h-12 rounded-full bg-surface-container-lowest flex items-center justify-center text-secondary mb-space-sm group-hover:scale-105 transition-transform shadow-xs">
                          <Icon name="cloud_upload" className="text-[24px]" />
                        </div>
                        <span className="font-title-md text-title-md font-medium text-primary mb-1">
                          Drag and drop file here, or browse
                        </span>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                          Supported: PDF, JPG, JPEG, PNG • Max 15MB
                        </p>
                        <button
                          className="px-4 py-2 bg-primary text-on-primary rounded font-label-md text-label-md font-medium hover:bg-primary-container transition-colors"
                          type="button"
                        >
                          Browse Files
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* SECTION FOUR: Official Social Media & Online Presence */}
              <section className="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm border border-outline-variant/30 overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-xs pb-space-lg mb-space-lg bg-surface-container-low/50 -mx-space-xl -mt-space-xl p-space-xl rounded-t-xl border-b border-outline-variant/20">
                  <div>
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
                      Section 04
                    </span>
                    <h2
                      className="font-headline-sm text-headline-sm text-primary"
                      style={{
                        fontFamily:
                          'Aeonik, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        fontWeight: 500,
                      }}
                    >
                      Official Social Media &amp; Online Presence
                    </h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Add your publication&apos;s official social media profiles to help readers discover and connect with your organisation.
                    </p>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-high px-2.5 py-1 rounded-full font-medium shrink-0">
                    Optional
                  </span>
                </div>

                {/* 2-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-space-xl gap-y-space-lg">
                  {/* Field 01 - X (Twitter) */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="socialTwitter"
                      className="font-label-md text-label-md text-primary font-medium flex items-center justify-between"
                    >
                      <span>Official X Profile URL</span>
                      <span className="text-on-surface-variant font-label-sm text-label-sm">
                        Optional
                      </span>
                    </label>
                    <div className="relative flex items-center group">
                      <div className="absolute left-3.5 flex items-center pointer-events-none text-on-surface-variant group-hover:text-primary group-focus-within:text-secondary transition-colors">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                        </svg>
                      </div>
                      <input
                        id="socialTwitter"
                        value={socialLinks.twitter}
                        onChange={(e) => updateSocialLink("twitter", e.target.value)}
                        className="w-full h-11 pl-11 pr-3.5 bg-surface-container-low hover:bg-surface-container border border-transparent hover:border-outline-variant/40 text-primary placeholder:text-on-surface-variant/60 font-body-md text-body-md rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary transition-all"
                        placeholder="https://x.com/yourpublication"
                        type="url"
                      />
                    </div>
                  </div>

                  {/* Field 02 - Facebook */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="socialFacebook"
                      className="font-label-md text-label-md text-primary font-medium flex items-center justify-between"
                    >
                      <span>Official Facebook Page URL</span>
                      <span className="text-on-surface-variant font-label-sm text-label-sm">
                        Optional
                      </span>
                    </label>
                    <div className="relative flex items-center group">
                      <div className="absolute left-3.5 flex items-center pointer-events-none text-on-surface-variant group-hover:text-primary group-focus-within:text-secondary transition-colors">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                        </svg>
                      </div>
                      <input
                        id="socialFacebook"
                        value={socialLinks.facebook}
                        onChange={(e) => updateSocialLink("facebook", e.target.value)}
                        className="w-full h-11 pl-11 pr-3.5 bg-surface-container-low hover:bg-surface-container border border-transparent hover:border-outline-variant/40 text-primary placeholder:text-on-surface-variant/60 font-body-md text-body-md rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary transition-all"
                        placeholder="https://facebook.com/yourpublication"
                        type="url"
                      />
                    </div>
                  </div>

                  {/* Field 03 - Instagram */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="socialInstagram"
                      className="font-label-md text-label-md text-primary font-medium flex items-center justify-between"
                    >
                      <span>Official Instagram Profile URL</span>
                      <span className="text-on-surface-variant font-label-sm text-label-sm">
                        Optional
                      </span>
                    </label>
                    <div className="relative flex items-center group">
                      <div className="absolute left-3.5 flex items-center pointer-events-none text-on-surface-variant group-hover:text-primary group-focus-within:text-secondary transition-colors">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                        </svg>
                      </div>
                      <input
                        id="socialInstagram"
                        value={socialLinks.instagram}
                        onChange={(e) => updateSocialLink("instagram", e.target.value)}
                        className="w-full h-11 pl-11 pr-3.5 bg-surface-container-low hover:bg-surface-container border border-transparent hover:border-outline-variant/40 text-primary placeholder:text-on-surface-variant/60 font-body-md text-body-md rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary transition-all"
                        placeholder="https://instagram.com/yourpublication"
                        type="url"
                      />
                    </div>
                  </div>

                  {/* Field 04 - YouTube */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="socialYouTube"
                      className="font-label-md text-label-md text-primary font-medium flex items-center justify-between"
                    >
                      <span>Official YouTube Channel URL</span>
                      <span className="text-on-surface-variant font-label-sm text-label-sm">
                        Optional
                      </span>
                    </label>
                    <div className="relative flex items-center group">
                      <div className="absolute left-3.5 flex items-center pointer-events-none text-on-surface-variant group-hover:text-primary group-focus-within:text-secondary transition-colors">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path>
                        </svg>
                      </div>
                      <input
                        id="socialYouTube"
                        value={socialLinks.youtube}
                        onChange={(e) => updateSocialLink("youtube", e.target.value)}
                        className="w-full h-11 pl-11 pr-3.5 bg-surface-container-low hover:bg-surface-container border border-transparent hover:border-outline-variant/40 text-primary placeholder:text-on-surface-variant/60 font-body-md text-body-md rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary transition-all"
                        placeholder="https://youtube.com/@yourchannel"
                        type="url"
                      />
                    </div>
                  </div>
                </div>

                {/* Supporting Information Panel */}
                <div className="bg-surface-container-low rounded-lg p-space-md mt-6 flex items-start gap-3 border border-outline-variant/30">
                  <Icon name="info" className="text-[18px] text-secondary shrink-0 mt-0.5" />
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed text-[12px]">
                    Only provide official accounts managed by your publication or organisation. These links help readers identify your official online presence. Adding social media links is optional and does not replace organisation or publication verification documents.
                  </p>
                </div>
              </section>

              {/* SECTION FIVE: Contact Information Verification */}
              <section
                className="bg-surface-container-lowest rounded-xl p-space-xl shadow-sm border border-outline-variant/30 overflow-hidden"
                id="contact-verification-section"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-xs pb-space-lg mb-space-lg bg-surface-container-low/50 -mx-space-xl -mt-space-xl p-space-xl rounded-t-xl border-b border-outline-variant/20">
                  <div>
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
                      Section 05
                    </span>
                    <h2
                      className="font-headline-sm text-headline-sm text-primary"
                      style={{
                        fontFamily:
                          'Aeonik, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        fontWeight: 500,
                      }}
                    >
                      Contact Information Verification
                    </h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Verify your organisation&apos;s official email address and primary mobile number to complete your contact verification.
                    </p>
                  </div>
                  <span
                    id="section05-status-pill"
                    className={`font-label-sm text-label-sm px-2.5 py-1 rounded-full font-medium shrink-0 flex items-center gap-1.5 ${
                      isBothContactVerified
                        ? "bg-tertiary-fixed text-on-tertiary-fixed"
                        : "bg-[#FFF4E5] text-[#B76E00]"
                    }`}
                  >
                    {isBothContactVerified ? (
                      <>
                        <Icon name="verified" className="text-[14px]" /> All Verified
                      </>
                    ) : (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B76E00]"></span>
                        Verification Required
                      </>
                    )}
                  </span>
                </div>

                {/* 2-Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-xl">
                  {/* Container 01: Official Email Address */}
                  <div
                    id="email-card"
                    className="bg-surface-container-low/60 rounded-xl p-space-lg border border-outline-variant/30 flex flex-col justify-between transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="font-label-md text-label-md text-primary font-semibold flex items-center gap-1.5">
                          <Icon name="mail" className="text-[18px] text-secondary" />
                          Official Email Address <span className="text-error">*</span>
                        </label>
                        <span
                          id="email-badge"
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            emailVerified
                              ? "bg-tertiary-fixed text-on-tertiary-fixed"
                              : "bg-[#FFF4E5] text-[#B76E00]"
                          }`}
                        >
                          {emailVerified ? (
                            <>
                              <Icon name="check_circle" className="text-[13px]" /> Verified
                            </>
                          ) : emailOtpState === "otp" ? (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-[#B76E00]"></span> OTP Sent
                            </>
                          ) : (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-[#B76E00]"></span> Not Verified
                            </>
                          )}
                        </span>
                      </div>

                      <div className="relative flex items-center mb-1.5">
                        <input
                          className="w-full h-11 pl-3.5 pr-28 bg-surface-container-lowest border border-outline-variant/30 text-primary font-body-md text-body-md rounded-lg focus:outline-none"
                          readOnly
                          type="email"
                          placeholder="e.g. contact@example.com"
                          value={displayOfficialEmail}
                        />
                        <div className="absolute right-3 flex items-center gap-2">
                          <Icon name="lock" className="text-[16px] text-on-surface-variant" />
                          <button
                            type="button"
                            onClick={() => setShowEditEmailModal(true)}
                            className="text-xs text-on-surface-variant hover:text-primary underline cursor-pointer font-medium"
                          >
                            Change Email
                          </button>
                        </div>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant text-[12px] mb-4">
                        Previously registered organization email address used for editorial governance.
                      </p>

                      {/* Initial State: Generate Email OTP */}
                      {emailOtpState === "initial" && (
                        <div id="email-initial-action" className="mb-4">
                          <button
                            type="button"
                            onClick={handleGenerateEmailOtp}
                            disabled={isSendingEmailOtp}
                            className="h-10 px-4 bg-primary text-on-primary hover:bg-surface-container-highest rounded-lg font-label-md text-label-md font-medium transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-60"
                          >
                            <Icon name="mail" className="text-[18px]" />
                            <span>{isSendingEmailOtp ? "Generating..." : "Generate Email OTP"}</span>
                          </button>
                          {emailOtpError && (
                            <p className="text-xs text-error mt-2 font-medium">
                              {emailOtpError}
                            </p>
                          )}
                        </div>
                      )}

                      {/* OTP Verification State Box */}
                      {emailOtpState === "otp" && (
                        <div
                          id="email-otp-box"
                          className="bg-surface-container-lowest rounded-lg p-space-md border border-outline-variant/40 flex flex-col gap-3.5"
                        >
                          <div className="flex items-start gap-2.5">
                            <Icon
                              name="mark_email_read"
                              className="text-[20px] text-secondary mt-0.5 shrink-0"
                            />
                            <div>
                              <p className="font-label-md text-label-md font-semibold text-primary">
                                Enter Email Verification Code
                              </p>
                              <p className="font-body-sm text-body-sm text-on-surface-variant text-[12px]">
                                A 6-digit OTP has been sent to your registered email address{" "}
                                <span className="font-medium text-primary">
                                  {displayOfficialEmail ? displayOfficialEmail.replace(/(.{3})(.*)(@.*)/, "$1*****$3") : "your registered email"}
                                </span>
                                .
                              </p>
                            </div>
                          </div>

                          <div>
                            <div
                              className="flex items-center gap-2 max-w-sm"
                              id="email-otp-inputs"
                            >
                              {[0, 1, 2, 3, 4, 5].map((i) => (
                                <input
                                  key={i}
                                  ref={(el) => (emailInputsRef.current[i] = el)}
                                  type="text"
                                  maxLength={1}
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  placeholder="•"
                                  value={emailOtpDigits[i]}
                                  onChange={(e) =>
                                    handleOtpInput(i, e.target.value, "email")
                                  }
                                  onKeyDown={(e) =>
                                    handleOtpKeyDown(i, e, "email")
                                  }
                                  onPaste={(e) => handleOtpPaste(e, "email")}
                                  className="w-10 h-12 text-center text-title-md font-semibold text-primary bg-surface-container-low border border-outline-variant/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest"
                                />
                              ))}
                            </div>
                            {emailOtpError && (
                              <p className="text-xs text-error mt-1 font-medium">
                                {emailOtpError}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-outline-variant/20">
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                disabled={isVerifyingEmail}
                                onClick={handleVerifyEmailOtp}
                                className="px-4 py-2 bg-primary text-on-primary rounded font-label-md text-label-md font-medium hover:bg-surface-container-highest transition-colors cursor-pointer disabled:opacity-60"
                              >
                                {isVerifyingEmail ? "Verifying..." : "Verify Email"}
                              </button>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                <button
                                  type="button"
                                  disabled={emailResendTimer > 0}
                                  onClick={handleResendEmailOtp}
                                  className={`text-xs font-medium transition-colors ${
                                    emailResendTimer > 0
                                      ? "text-on-surface-variant/50 cursor-not-allowed"
                                      : "text-on-surface-variant hover:text-primary cursor-pointer"
                                  }`}
                                >
                                  Resend OTP
                                </button>
                                {emailResendTimer > 0 && (
                                  <span className="text-[11px] text-on-surface-variant font-normal">
                                    (Resend available in 00:
                                    {emailResendTimer < 10
                                      ? `0${emailResendTimer}`
                                      : emailResendTimer}
                                    )
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="font-body-sm text-body-sm text-on-surface-variant text-[12px] flex items-center gap-1">
                              <Icon name="schedule" className="text-[14px]" />
                              <span>
                                OTP expires in 0
                                {Math.floor(emailExpiryTimer / 60)}:
                                {emailExpiryTimer % 60 < 10 ? "0" : ""}
                                {emailExpiryTimer % 60}
                              </span>
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Verified Success Box */}
                      {emailOtpState === "verified" && (
                        <div
                          id="email-verified-box"
                          className="bg-surface-container-lowest rounded-lg p-space-md border border-outline-variant/40 flex items-center gap-3"
                        >
                          <span className="w-8 h-8 rounded-full bg-tertiary-fixed text-tertiary-container flex items-center justify-center shrink-0">
                            <Icon name="check" className="text-[18px]" />
                          </span>
                          <div>
                            <p className="font-label-md text-label-md font-semibold text-primary">
                              Email Verified Successfully
                            </p>
                            <p className="font-body-sm text-body-sm text-on-surface-variant text-[12px]">
                              Your official email address has been successfully verified.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Container 02: Primary Mobile Number */}
                  <div
                    id="mobile-card"
                    className="bg-surface-container-low/60 rounded-xl p-space-lg border border-outline-variant/30 flex flex-col justify-between transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="font-label-md text-label-md text-primary font-semibold flex items-center gap-1.5">
                          <Icon
                            name="smartphone"
                            className="text-[18px] text-secondary"
                          />
                          Primary Mobile Number <span className="text-error">*</span>
                        </label>
                        <span
                          id="mobile-badge"
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            mobileVerified
                              ? "bg-tertiary-fixed text-on-tertiary-fixed"
                              : "bg-[#FFF4E5] text-[#B76E00]"
                          }`}
                        >
                          {mobileVerified ? (
                            <>
                              <Icon name="check_circle" className="text-[14px]" /> Verified
                            </>
                          ) : mobileOtpState === "otp" ? (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-[#B76E00]"></span> OTP Sent
                            </>
                          ) : (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-[#B76E00]"></span> Not Verified
                            </>
                          )}
                        </span>
                      </div>

                      <div className="relative flex items-center mb-1.5">
                        <div className="absolute left-3.5 flex items-center pointer-events-none">
                          <span className="font-label-sm text-label-sm text-on-surface font-semibold text-[13.5px]">
                            {data?.primaryMobileCountryCode || "+91"}
                          </span>
                        </div>
                        <input
                          className="w-full h-11 pl-14 pr-36 bg-surface-container-lowest border border-outline-variant/30 text-primary font-body-md text-body-md rounded-lg focus:outline-none"
                          readOnly
                          type="tel"
                          placeholder="10-digit mobile number"
                          value={displayPrimaryMobile}
                        />
                        <div className="absolute right-3 flex items-center gap-2">
                          <Icon name="lock" className="text-[16px] text-on-surface-variant" />
                          <button
                            type="button"
                            onClick={() => setShowEditMobileModal(true)}
                            className="text-xs text-on-surface-variant hover:text-primary underline cursor-pointer font-medium"
                          >
                            Change Mobile
                          </button>
                        </div>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant text-[12px] mb-4">
                        Designated signatory mobile number for security notices and regulatory verification.
                      </p>

                      {/* Initial State: Generate Mobile OTP */}
                      {mobileOtpState === "initial" && (
                        <div id="mobile-initial-action" className="mb-4">
                          <button
                            type="button"
                            onClick={handleGenerateMobileOtp}
                            disabled={isSendingMobileOtp}
                            className="h-10 px-4 bg-primary text-on-primary hover:bg-surface-container-highest rounded-lg font-label-md text-label-md font-medium transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-60"
                          >
                            <Icon name="sms" className="text-[18px]" />
                            <span>{isSendingMobileOtp ? "Generating..." : "Generate Mobile OTP"}</span>
                          </button>
                          {mobileOtpError && (
                            <p className="text-xs text-error mt-2 font-medium">
                              {mobileOtpError}
                            </p>
                          )}
                        </div>
                      )}

                      {/* OTP Verification State Box */}
                      {mobileOtpState === "otp" && (
                        <div
                          id="mobile-otp-box"
                          className="bg-surface-container-lowest rounded-lg p-space-md border border-outline-variant/40 flex flex-col gap-3.5"
                        >
                          <div className="flex items-start gap-2.5">
                            <Icon
                              name="sms"
                              className="text-[20px] text-secondary mt-0.5 shrink-0"
                            />
                            <div>
                              <p className="font-label-md text-label-md font-semibold text-primary">
                                Enter Mobile SMS Code
                              </p>
                              <p className="font-body-sm text-body-sm text-on-surface-variant text-[12px]">
                                A 6-digit SMS OTP has been sent to your registered mobile number{" "}
                                <span className="font-medium text-primary">
                                  {data?.primaryMobileCountryCode || "+91"} ******{displayPrimaryMobile ? displayPrimaryMobile.slice(-4) : "••••"}
                                </span>
                                .
                              </p>
                            </div>
                          </div>

                          <div>
                            <div
                              className="flex items-center gap-2 max-w-sm"
                              id="mobile-otp-inputs"
                            >
                              {[0, 1, 2, 3, 4, 5].map((i) => (
                                <input
                                  key={i}
                                  ref={(el) => (mobileInputsRef.current[i] = el)}
                                  type="text"
                                  maxLength={1}
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  placeholder="•"
                                  value={mobileOtpDigits[i]}
                                  onChange={(e) =>
                                    handleOtpInput(i, e.target.value, "mobile")
                                  }
                                  onKeyDown={(e) =>
                                    handleOtpKeyDown(i, e, "mobile")
                                  }
                                  onPaste={(e) => handleOtpPaste(e, "mobile")}
                                  className="w-10 h-12 text-center text-title-md font-semibold text-primary bg-surface-container-low border border-outline-variant/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest"
                                />
                              ))}
                            </div>
                            {mobileOtpError && (
                              <p className="text-xs text-error mt-1 font-medium">
                                {mobileOtpError}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-outline-variant/20">
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                disabled={isVerifyingMobile}
                                onClick={handleVerifyMobileOtp}
                                className="px-4 py-2 bg-primary text-on-primary rounded font-label-md text-label-md font-medium hover:bg-surface-container-highest transition-colors cursor-pointer disabled:opacity-60"
                              >
                                {isVerifyingMobile ? "Verifying..." : "Verify Mobile"}
                              </button>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                <button
                                  type="button"
                                  disabled={mobileResendTimer > 0}
                                  onClick={handleResendMobileOtp}
                                  className={`text-xs font-medium transition-colors ${
                                    mobileResendTimer > 0
                                      ? "text-on-surface-variant/50 cursor-not-allowed"
                                      : "text-on-surface-variant hover:text-primary cursor-pointer"
                                  }`}
                                >
                                  Resend OTP
                                </button>
                                {mobileResendTimer > 0 && (
                                  <span className="text-[11px] text-on-surface-variant font-normal">
                                    (Resend available in 00:
                                    {mobileResendTimer < 10
                                      ? `0${mobileResendTimer}`
                                      : mobileResendTimer}
                                    )
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="font-body-sm text-body-sm text-on-surface-variant text-[12px] flex items-center gap-1">
                              <Icon name="schedule" className="text-[14px]" />
                              <span>
                                OTP expires in 0
                                {Math.floor(mobileExpiryTimer / 60)}:
                                {mobileExpiryTimer % 60 < 10 ? "0" : ""}
                                {mobileExpiryTimer % 60}
                              </span>
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Verified Success Box */}
                      {mobileOtpState === "verified" && (
                        <div
                          id="mobile-verified-box"
                          className="bg-surface-container-lowest rounded-lg p-space-md border border-outline-variant/40 flex items-center gap-3"
                        >
                          <span className="w-8 h-8 rounded-full bg-tertiary-fixed text-tertiary-container flex items-center justify-center shrink-0">
                            <Icon name="check" className="text-[18px]" />
                          </span>
                          <div>
                            <p className="font-label-md text-label-md font-semibold text-primary">
                              Mobile Number Verified Successfully
                            </p>
                            <p className="font-body-sm text-body-sm text-on-surface-variant text-[12px]">
                              Your primary mobile number has been successfully verified.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Supporting Guidance & Security Note */}
                <div className="bg-surface-container-low rounded-lg p-space-md mt-6 flex items-start gap-3 border border-outline-variant/30">
                  <Icon name="shield" className="text-[18px] text-secondary shrink-0 mt-0.5" />
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed text-[12px]">
                    Both official email address and primary mobile number must be verified prior to final submission. Each verification is independent and protected by standard session-rate limits and expiry windows.
                  </p>
                </div>
              </section>

              {/* Important Verification Notice */}
              <aside className="bg-surface-container-low rounded-xl p-space-lg flex items-start gap-space-md border border-outline-variant/30">
                <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center shrink-0 text-on-secondary-fixed mt-0.5">
                  <Icon name="info" className="text-[18px]" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3
                    className="font-headline-sm text-headline-sm text-primary"
                    style={{
                      fontFamily:
                        'Aeonik, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      fontWeight: 500,
                    }}
                  >
                    Important Verification Notice
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    All submitted documents must be genuine, legally valid, and directly relevant to the operating organisation and its publication masthead. The Pintree Trust &amp; Safety Editorial Desk reviews every submission in accordance with statutory compliance frameworks. Pintree may request supplemental documentation prior to badge issuance. Submission of documents initiates a verification audit and does not constitute immediate certification.
                  </p>
                </div>
              </aside>

              {/* Form Footer */}
              <OnboardingBottomBar
                currentStep={3}
                totalSteps={5}
                onBack={onBack}
                onSaveDraft={handleSaveDraftClick}
                isSavingDraft={false}
                isDraftSaved={isDraftSaved}
                isSubmitting={isValidating}
                nextDisabled={isValidating}
                nextLabel="Continue"
                showBack={true}
                isSubmitType={true}
              />
            </form>
          </div>
        </div>

      {/* Change Email Modal */}
      <ChangeEmailModal
        isOpen={showEditEmailModal}
        currentEmail={displayOfficialEmail}
        onClose={() => setShowEditEmailModal(false)}
        onUpdateEmail={handleUpdateEmailFromModal}
      />

      {/* Change Mobile Modal */}
      <ChangeMobileModal
        isOpen={showEditMobileModal}
        currentMobile={displayPrimaryMobile}
        countryCode={data?.primaryMobileCountryCode || "+91"}
        onClose={() => setShowEditMobileModal(false)}
        onUpdateMobile={handleUpdateMobileFromModal}
      />

      {/* Top-Right Success Toast Notification */}
      <SuccessToast
        show={toastInfo.show}
        title={toastInfo.title}
        subtitle={toastInfo.subtitle}
        onClose={() => setToastInfo({ show: false, title: "", subtitle: "" })}
      />
    </main>
  );
}
