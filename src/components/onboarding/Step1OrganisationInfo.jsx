"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Stepper from "./Stepper";
import OnboardingBottomBar from "./OnboardingBottomBar";
import Icon from "./Icon";
import CustomDropdown from "./CustomDropdown";
import { fetchLocations } from "@/utils/newsMediaOnboarding";

const CURRENT_YEAR = new Date().getFullYear();
const SINGLE_YEARS = Array.from(
  { length: CURRENT_YEAR - 1800 + 1 },
  (_, i) => String(CURRENT_YEAR - i)
);

const PUBLICATION_TYPE_OPTIONS = [
  { value: "ONLINE_DIGITAL_NEWS_PUBLISHER", label: "Online News / Digital Publication" },
  { value: "BROADCASTING_CHANNEL", label: "Broadcasting Channel (TV)" },
  { value: "RADIO_STATION", label: "Radio Station" },
  { value: "NEWSPAPER", label: "Newspaper (Daily / Weekly)" },
  { value: "MAGAZINE_PERIODICAL", label: "Magazine / Periodical" },
  { value: "NEWS_AGENCY_WIRE_SERVICE", label: "News Agency & Wire Service" },
  { value: "PODCAST_AUDIO_NEWS_NETWORK", label: "Podcast / Audio News Network" },
];

export default function Step1OrganisationInfo({
  data,
  onChange,
  onNext,
  onSaveDraft,
  isSubmitting = false,
  errorMessage = "",
  onClearError,
}) {
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [localError, setLocalError] = useState("");
  const errorBannerRef = useRef(null);
  const aboutTextareaRef = useRef(null);
  const yearDropdownRef = useRef(null);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target)) {
        setIsYearDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Dynamic Location & Language states from API
  const [languages, setLanguages] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingLanguages, setLoadingLanguages] = useState(false);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  const languageOptions = useMemo(() => {
    const opts = languages.map((l) => ({
      value: l.id,
      label: l.language || l.name,
      sublabel: l.nativeName && l.nativeName !== (l.language || l.name) ? l.nativeName : undefined,
    }));
    if (
      data?.primaryLanguageId &&
      !opts.some((o) => o.value === data.primaryLanguageId) &&
      (data?.primaryLanguageName || data?.primaryLanguage)
    ) {
      opts.unshift({
        value: data.primaryLanguageId,
        label: data.primaryLanguageName || data.primaryLanguage,
      });
    }
    return opts;
  }, [languages, data?.primaryLanguageId, data?.primaryLanguageName, data?.primaryLanguage]);

  const countryOptions = useMemo(() => {
    const opts = countries.map((c) => ({
      value: c.id,
      label: c.name,
      flag: c.flag,
      sublabel: c.dialCode ? `${c.dialCode}` : undefined,
    }));
    if (data?.countryId && !opts.some((o) => o.value === data.countryId) && data?.countryName) {
      opts.unshift({ value: data.countryId, label: data.countryName });
    }
    return opts;
  }, [countries, data?.countryId, data?.countryName]);

  const dialCodeOptions = useMemo(() => {
    if (countries.length > 0) {
      const seen = new Set();
      const list = [];
      countries.forEach((c) => {
        if (c.dialCode && !seen.has(c.dialCode)) {
          seen.add(c.dialCode);
          list.push({
            key: `dial-${c.id}-${c.dialCode}`,
            value: c.dialCode,
            label: `${c.flag ? c.flag + " " : ""}${c.dialCode}`,
            sublabel: c.name,
            code: c.code,
          });
        }
      });
      if (list.length > 0) return list;
    }
    return [
      { key: "dial-IN-+91", value: "+91", label: "🇮🇳 +91", sublabel: "India", code: "IN" },
      { key: "dial-US-+1", value: "+1", label: "🇺🇸 +1", sublabel: "United States", code: "US" },
      { key: "dial-GB-+44", value: "+44", label: "🇬🇧 +44", sublabel: "United Kingdom", code: "GB" },
      { key: "dial-AE-+971", value: "+971", label: "🇦🇪 +971", sublabel: "United Arab Emirates", code: "AE" },
      { key: "dial-SG-+65", value: "+65", label: "🇸🇬 +65", sublabel: "Singapore", code: "SG" },
      { key: "dial-CA-+1", value: "+1", label: "🇨🇦 +1", sublabel: "Canada", code: "CA" },
      { key: "dial-AU-+61", value: "+61", label: "🇦🇺 +61", sublabel: "Australia", code: "AU" },
    ];
  }, [countries]);

  const stateOptions = useMemo(() => {
    const opts = states.map((s) => ({
      value: s.id,
      label: s.name,
    }));
    if (data?.stateId && !opts.some((o) => o.value === data.stateId) && data?.stateName) {
      opts.unshift({ value: data.stateId, label: data.stateName });
    }
    return opts;
  }, [states, data?.stateId, data?.stateName]);

  const districtOptions = useMemo(() => {
    const opts = districts.map((d) => ({
      value: d.id,
      label: d.name,
    }));
    if (data?.districtId && !opts.some((o) => o.value === data.districtId) && data?.districtName) {
      opts.unshift({ value: data.districtId, label: data.districtName });
    }
    return opts;
  }, [districts, data?.districtId, data?.districtName]);

  // Fetch languages from API on mount
  useEffect(() => {
    let isMounted = true;
    async function loadLangs() {
      setLoadingLanguages(true);
      try {
        const list = await fetchLocations("languages", { limit: 100 });
        if (isMounted && Array.isArray(list) && list.length > 0) {
          setLanguages(list);
          if (data?.primaryLanguageId && !data?.primaryLanguageName && !data?.primaryLanguage) {
            const matched = list.find((l) => l.id === data.primaryLanguageId);
            const langLabel = matched?.language || matched?.name;
            if (langLabel) {
              onChange({ primaryLanguageName: langLabel, primaryLanguage: langLabel });
            }
          }
        }
      } catch (e) {
        console.error("Error loading languages:", e);
      } finally {
        if (isMounted) setLoadingLanguages(false);
      }
    }
    loadLangs();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch countries on mount
  useEffect(() => {
    let isMounted = true;
    async function loadCountries() {
      setLoadingCountries(true);
      try {
        const list = await fetchLocations("country", { limit: 100 });
        if (isMounted && Array.isArray(list) && list.length > 0) {
          setCountries(list);
          if (data?.countryId && !data?.countryName) {
            const matched = list.find((c) => c.id === data.countryId);
            if (matched?.name) {
              onChange({ countryName: matched.name, registeredOfficeCountryName: matched.name });
            }
          }
        }
      } catch (e) {
        console.error("Error loading countries:", e);
      } finally {
        if (isMounted) setLoadingCountries(false);
      }
    }
    loadCountries();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch states whenever countryId changes
  useEffect(() => {
    let isMounted = true;
    async function loadStates() {
      const countryId = data?.countryId;
      if (!countryId) {
        setStates([]);
        return;
      }
      setLoadingStates(true);
      try {
        const list = await fetchLocations("states", {
          countryId,
          limit: 100,
        });
        if (isMounted && Array.isArray(list)) {
          setStates(list);
          if (data?.stateId && !data?.stateName) {
            const matched = list.find((s) => s.id === data.stateId);
            if (matched?.name) {
              onChange({ stateName: matched.name });
            }
          }
        }
      } catch (e) {
        console.error("Error loading states:", e);
      } finally {
        if (isMounted) setLoadingStates(false);
      }
    }
    loadStates();
    return () => {
      isMounted = false;
    };
  }, [data?.countryId]);

  // Fetch districts whenever stateId changes
  useEffect(() => {
    let isMounted = true;
    async function loadDistricts() {
      const stateId = data?.stateId;
      const countryId = data?.countryId;
      if (!stateId) {
        setDistricts([]);
        return;
      }
      setLoadingDistricts(true);
      try {
        const list = await fetchLocations("districts", {
          stateId,
          countryId,
          limit: 100,
        });
        if (isMounted && Array.isArray(list)) {
          setDistricts(list);
          if (data?.districtId && !data?.districtName) {
            const matched = list.find((d) => d.id === data.districtId);
            if (matched?.name) {
              onChange({ districtName: matched.name });
            }
          }
        }
      } catch (e) {
        console.error("Error loading districts:", e);
      } finally {
        if (isMounted) setLoadingDistricts(false);
      }
    }
    loadDistricts();
    return () => {
      isMounted = false;
    };
  }, [data?.stateId, data?.countryId]);

  // Fetch cities whenever districtId or stateId changes
  useEffect(() => {
    let isMounted = true;
    async function loadCities() {
      const stateId = data?.stateId;
      const districtId = data?.districtId;
      const countryId = data?.countryId;
      if (!stateId) {
        setCities([]);
        return;
      }
      setLoadingCities(true);
      try {
        const list = await fetchLocations("cities", {
          countryId,
          stateId,
          ...(districtId ? { districtId } : {}),
          limit: 100,
        });
        if (isMounted && Array.isArray(list)) {
          setCities(list);
        }
      } catch (e) {
        console.error("Error loading cities:", e);
      } finally {
        if (isMounted) setLoadingCities(false);
      }
    }
    loadCities();
    return () => {
      isMounted = false;
    };
  }, [data?.districtId, data?.stateId, data?.countryId]);

  const shortDescCount = (data?.shortDescription || "").length;
  const aboutPubCount = (data?.aboutPublication || "").length;

  const handleSaveDraftClick = () => {
    setIsDraftSaved(true);
    if (onSaveDraft) onSaveDraft();
    setTimeout(() => {
      setIsDraftSaved(false);
    }, 2500);
  };

  const applyFormatting = (format) => {
    const el = aboutTextareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selectedText = el.value.substring(start, end);
    let replacement = "";

    if (format === "bold") {
      replacement = `**${selectedText || "Bold Text"}**`;
    } else if (format === "italic") {
      replacement = `*${selectedText || "Italic Text"}*`;
    } else if (format === "underline") {
      replacement = `<u>${selectedText || "Underlined Text"}</u>`;
    } else if (format === "bullet") {
      replacement = selectedText ? `\n• ${selectedText}` : `\n• Item 1\n• Item 2`;
    } else if (format === "numbered") {
      replacement = selectedText ? `\n1. ${selectedText}` : `\n1. Item 1\n2. Item 2`;
    }

    const newValue = el.value.substring(0, start) + replacement + el.value.substring(end);
    onChange({ aboutPublication: newValue });
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 10);
  };

  const handleSkipAbout = () => {
    const footerBtn = document.querySelector('button[type="submit"]');
    if (footerBtn) {
      footerBtn.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const activeError = localError || errorMessage;

  useEffect(() => {
    if (activeError && errorBannerRef.current) {
      errorBannerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeError]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");
    if (onClearError) onClearError();

    const pubName = (data?.publicationName || data?.digitalPubName || data?.name || "").trim();
    const orgName = (
      data?.registeredOrgName ||
      data?.registeredOrganisationName ||
      data?.organisationName ||
      data?.orgName ||
      ""
    ).trim();
    const email = (data?.officialEmail || data?.email || "").trim();
    const mobileDigits = String(
      data?.primaryMobileNumber || data?.primaryMobile || data?.phone || ""
    ).replace(/[^0-9]/g, "");

    if (!data?.publicationType) {
      setLocalError("Please select a Publication Type.");
      return;
    }
    if (!pubName) {
      setLocalError("Please enter the Media / Publication Name.");
      return;
    }
    if (!orgName) {
      setLocalError("Please enter the Registered Organisation Name.");
      return;
    }
    const rawWebsite = String(
      data?.officialWebsite || data?.website || data?.websiteUrl || ""
    ).trim();
    if (rawWebsite) {
      const candidateUrl = /^https?:\/\//i.test(rawWebsite) ? rawWebsite : `https://${rawWebsite}`;
      try {
        const parsed = new URL(candidateUrl);
        if (!parsed.hostname || !parsed.hostname.includes(".")) {
          setLocalError("Please enter a valid Official Website URL (e.g. www.example.com).");
          return;
        }
      } catch {
        setLocalError("Please enter a valid Official Website URL (e.g. www.example.com).");
        return;
      }
    }
    if (!data?.primaryLanguageId) {
      setLocalError("Please select a Primary Language.");
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setLocalError("Please enter a valid Official Email Address.");
      return;
    }
    if (mobileDigits.length < 5) {
      setLocalError("Please enter a valid Primary Mobile Number (at least 5 digits).");
      return;
    }
    if (!data?.countryId) {
      setLocalError("Please select a Country.");
      return;
    }
    if (!data?.stateId) {
      setLocalError("Please select a State / Province.");
      return;
    }
    if (!(data?.cityName || data?.city || "").trim()) {
      setLocalError("Please enter a City / Town.");
      return;
    }
    if (!(data?.postalCode || "").trim()) {
      setLocalError("Please enter a Postal Code / ZIP.");
      return;
    }
    if (!(data?.fullAddress || "").trim()) {
      setLocalError("Please enter the Full Physical Address.");
      return;
    }
    if (!(data?.shortDescription || "").trim()) {
      setLocalError("Please enter a Short Description.");
      return;
    }

    if (onNext) {
      onNext();
    }
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
            <span className="hover:text-primary transition-colors cursor-pointer">
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
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  Account Onboarding
                </span>
                <h1
                  className="font-headline-lg text-headline-lg text-primary tracking-tight"
                  style={{
                    fontFamily: 'Aeonik, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    fontWeight: 500,
                  }}
                >
                  Organisation Information
                </h1>
                <p
                  className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-2"
                  style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                >
                  Tell us about your media organisation and publication. Provide accurate information to get started with your Pintree News &amp; Media account.
                </p>
              </div>
              <div className="hidden lg:flex items-center gap-2 text-label-sm font-label-sm text-on-surface-variant bg-surface-container-low px-3.5 py-2 rounded-xl">
                <Icon name="verified_user" className="text-secondary text-[18px]" />
                <span>Official Identity Verification Required</span>
              </div>
            </div>
          </header>

          {/* Horizontal Stepper (4 Stages) */}
          <Stepper currentStep={1} />

          {/* Main Registration Form */}
          <form className="flex flex-col gap-10" id="mediaRegistrationForm" onSubmit={handleSubmit} noValidate>
            {/* Section 1: Media / Publication Details */}
            <section className="bg-surface-container-lowest p-6 md:p-8 rounded-xl shadow-sm">
              <div className="pb-5 mb-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2">
                    <Icon name="newspaper" className="text-secondary text-[22px]" />
                    Media / Publication Details
                  </h2>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Fields with <span className="text-error font-bold">*</span> are required
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Provide the basic information about your media organisation and publication.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Field 1: Publication Type */}
                <div className="flex flex-col gap-2">
                  <label
                    className="font-label-md text-label-md text-on-surface font-medium flex items-center gap-1"
                    htmlFor="pubType"
                  >
                    Publication Type <span className="text-error font-bold">*</span>
                  </label>
                  <CustomDropdown
                    id="pubType"
                    required
                    placeholder="Select Publication Type"
                    value={data?.publicationType || ""}
                    onChange={(val) => onChange({ publicationType: val })}
                    options={PUBLICATION_TYPE_OPTIONS}
                    showSublabel={false}
                  />
                </div>

                {/* Field 2: Media / Publication Name */}
                <div className="flex flex-col gap-2">
                  <label
                    className="font-label-md text-label-md text-on-surface font-medium flex items-center gap-1"
                    htmlFor="pubName"
                  >
                    Media / Publication Name <span className="text-error font-bold">*</span>
                  </label>
                  <input
                    className="w-full h-[46px] px-4 bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/60 font-body-md text-body-md rounded-lg focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                    id="pubName"
                    placeholder="Enter your media or publication name"
                    required
                    type="text"
                    value={data?.publicationName || data?.digitalPubName || data?.name || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      onChange({ publicationName: val, digitalPubName: val, name: val });
                    }}
                  />
                </div>

                {/* Field 3: Registered Organisation Name */}
                <div className="flex flex-col gap-2">
                  <label
                    className="font-label-md text-label-md text-on-surface font-medium flex items-center gap-1"
                    htmlFor="orgName"
                  >
                    Registered Organisation Name <span className="text-error font-bold">*</span>
                  </label>
                  <input
                    className="w-full h-[46px] px-4 bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/60 font-body-md text-body-md rounded-lg focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                    id="orgName"
                    placeholder="Enter the legally registered organisation name"
                    required
                    type="text"
                    value={data?.registeredOrgName || data?.registeredOrganisationName || data?.organisationName || data?.orgName || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      onChange({ registeredOrgName: val, registeredOrganisationName: val, organisationName: val, orgName: val });
                    }}
                  />
                </div>

                {/* Field 4: Official Website */}
                <div className="flex flex-col gap-2">
                  <label
                    className="font-label-md text-label-md text-on-surface font-medium flex items-center justify-between"
                    htmlFor="website"
                  >
                    <span>Official Website</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-normal">Optional</span>
                  </label>
                  <div className="relative flex items-center">
                    <Icon
                      name="language"
                      className="absolute left-3.5 text-on-surface-variant text-[18px]"
                    />
                    <input
                      className="w-full h-[46px] pl-10 pr-4 bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/60 font-body-md text-body-md rounded-lg focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                      id="website"
                      placeholder="www.example.com"
                      type="text"
                      value={
                        data?.officialWebsite
                          ? String(data.officialWebsite).replace(/^https?:\/\//i, "")
                          : data?.website
                          ? String(data.website).replace(/^https?:\/\//i, "")
                          : data?.websiteUrl
                          ? String(data.websiteUrl).replace(/^https?:\/\//i, "")
                          : ""
                      }
                      onChange={(e) => {
                        const val = e.target.value.replace(/^https?:\/\//i, "").trim();
                        onChange({ officialWebsite: val, website: val });
                      }}
                    />
                  </div>
                </div>

                {/* Field 5: Primary Language */}
                <div className="flex flex-col gap-2">
                  <label
                    className="font-label-md text-label-md text-on-surface font-medium flex items-center gap-1"
                    htmlFor="language"
                  >
                    Primary Language <span className="text-error font-bold">*</span>
                  </label>
                  <CustomDropdown
                    id="language"
                    required
                    placeholder={loadingLanguages ? "Loading languages from Places API..." : "Select primary publication language"}
                    value={data?.primaryLanguageId || ""}
                    onChange={(val) => {
                      const sel = languages.find((l) => l.id === val);
                      const langLabel = sel?.language || sel?.name || "";
                      onChange({
                        primaryLanguageId: val,
                        ...(langLabel ? { primaryLanguageName: langLabel, primaryLanguage: langLabel } : {}),
                      });
                    }}
                    options={languageOptions}
                  />
                </div>

                {/* Field 6: Year Established */}
                <div className="flex flex-col gap-2">
                  <label
                    className="font-label-md text-label-md text-on-surface font-medium flex items-center justify-between"
                    htmlFor="yearEstablished"
                  >
                    <span>Year Established</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-normal">Optional</span>
                  </label>
                  <div className="relative" ref={yearDropdownRef}>
                    <input
                      className="w-full h-[46px] px-4 pr-10 bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/60 font-body-md text-body-md rounded-lg focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                      id="yearEstablished"
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      placeholder="Type or select year (e.g. 2021)"
                      value={data?.yearEstablished || ""}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                        onChange({ yearEstablished: val });
                        setIsYearDropdownOpen(true);
                      }}
                      onFocus={() => setIsYearDropdownOpen(true)}
                    />
                    <button
                      type="button"
                      onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer p-1"
                      tabIndex={-1}
                      title="Select year"
                    >
                      <Icon
                        name={isYearDropdownOpen ? "expand_less" : "calendar_today"}
                        className="text-[20px]"
                      />
                    </button>

                    {isYearDropdownOpen && (
                      <div className="absolute z-30 left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-lg py-1 text-on-surface">
                        {(() => {
                          const query = (data?.yearEstablished || "").trim();
                          const filtered = query
                            ? SINGLE_YEARS.filter((y) => y.startsWith(query))
                            : SINGLE_YEARS;
                          if (filtered.length === 0) {
                            return (
                              <div className="px-4 py-3 text-xs text-on-surface-variant text-center">
                                No matching year found
                              </div>
                            );
                          }
                          return filtered.slice(0, 150).map((year) => (
                            <button
                              key={year}
                              type="button"
                              onClick={() => {
                                onChange({ yearEstablished: year });
                                setIsYearDropdownOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2 font-body-md text-body-md hover:bg-surface-container-low transition-colors cursor-pointer flex items-center justify-between ${
                                data?.yearEstablished === year
                                  ? "bg-surface-container font-semibold text-secondary"
                                  : ""
                              }`}
                            >
                              <span>{year}</span>
                              {data?.yearEstablished === year && (
                                <Icon name="check" className="text-[16px] text-secondary" />
                              )}
                            </button>
                          ));
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Organisation Contact Details */}
            <section className="bg-surface-container-lowest p-6 md:p-8 rounded-xl shadow-sm">
              <div className="pb-5 mb-6">
                <h2 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2">
                  <Icon name="contact_mail" className="text-secondary text-[22px]" />
                  Organisation Contact Details
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Provide the official contact information for your media organisation.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Field 1: Official Email Address */}
                <div className="flex flex-col gap-2">
                  <label
                    className="font-label-md text-label-md text-on-surface font-medium flex items-center gap-1"
                    htmlFor="officialEmail"
                  >
                    Official Email Address <span className="text-error font-bold">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Icon
                      name="mail"
                      className="absolute left-3.5 text-on-surface-variant text-[18px]"
                    />
                    <input
                      className="w-full h-[46px] pl-10 pr-4 bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/60 font-body-md text-body-md rounded-lg focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                      id="officialEmail"
                      placeholder="contact@example.com"
                      required
                      type="email"
                      value={data?.officialEmail || ""}
                      onChange={(e) => onChange({ officialEmail: e.target.value })}
                    />
                  </div>
                </div>

                {/* Field 2: Primary Mobile Number */}
                <div className="flex flex-col gap-2">
                  <label
                    className="font-label-md text-label-md text-on-surface font-medium flex items-center gap-1"
                    htmlFor="phoneMain"
                  >
                    Primary Mobile Number <span className="text-error font-bold">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <CustomDropdown
                      id="countryCodeMain"
                      className="w-36 shrink-0"
                      dropdownClassName="w-64"
                      placeholder="+91"
                      value={data?.primaryMobileCountryCode || "+91"}
                      onChange={(val) => onChange({ primaryMobileCountryCode: val })}
                      options={dialCodeOptions}
                    />
                    <input
                      className="flex-1 h-[46px] px-4 bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/60 font-body-md text-body-md rounded-lg focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                      id="phoneMain"
                      placeholder="Enter mobile number"
                      required
                      type="tel"
                      value={data?.primaryMobileNumber || data?.primaryMobile || ""}
                      onChange={(e) => onChange({ primaryMobileNumber: e.target.value, primaryMobile: e.target.value })}
                    />
                  </div>
                </div>

                {/* Field 3: Office Landline Number */}
                <div className="flex flex-col gap-2">
                  <label
                    className="font-label-md text-label-md text-on-surface font-medium flex items-center justify-between"
                    htmlFor="landlineNum"
                  >
                    <span>Office Landline Number</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-normal">Optional</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <CustomDropdown
                      id="countryCodeLandline"
                      className="w-36 shrink-0"
                      dropdownClassName="w-64"
                      placeholder="+91"
                      value={data?.landlineCountryCode || data?.officeLandlineCountryCode || "+91"}
                      onChange={(val) => onChange({ landlineCountryCode: val, officeLandlineCountryCode: val })}
                      options={dialCodeOptions}
                    />
                    <input
                      className="w-28 shrink-0 h-[46px] px-3 bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/60 font-body-md text-body-md rounded-lg focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                      id="stdCode"
                      placeholder="STD code"
                      type="tel"
                      value={data?.landlineStdCode || data?.officeLandlineStdCode || ""}
                      onChange={(e) => onChange({ landlineStdCode: e.target.value, officeLandlineStdCode: e.target.value })}
                    />
                    <input
                      className="flex-1 h-[46px] px-4 bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/60 font-body-md text-body-md rounded-lg focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                      id="landlineNum"
                      placeholder="Landline number"
                      type="tel"
                      value={data?.landlineNumber || data?.officeLandlineNumber || ""}
                      onChange={(e) => onChange({ landlineNumber: e.target.value, officeLandlineNumber: e.target.value })}
                    />
                  </div>
                </div>

                {/* Field 4: Additional Mobile Number */}
                <div className="flex flex-col gap-2">
                  <label
                    className="font-label-md text-label-md text-on-surface font-medium flex items-center justify-between"
                    htmlFor="phoneAlt"
                  >
                    <span>Additional Mobile Number</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-normal">Optional</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <CustomDropdown
                      id="countryCodeAlt"
                      className="w-36 shrink-0"
                      dropdownClassName="w-64"
                      placeholder="+91"
                      value={data?.altMobileCountryCode || data?.additionalMobileCountryCode || "+91"}
                      onChange={(val) => onChange({ altMobileCountryCode: val, additionalMobileCountryCode: val })}
                      options={dialCodeOptions}
                    />
                    <input
                      className="flex-1 h-[46px] px-4 bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/60 font-body-md text-body-md rounded-lg focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                      id="phoneAlt"
                      placeholder="Enter additional mobile number"
                      type="tel"
                      value={data?.altMobileNumber || data?.additionalMobileNumber || data?.additionalContact || ""}
                      onChange={(e) => onChange({ altMobileNumber: e.target.value, additionalMobileNumber: e.target.value, additionalContact: e.target.value })}
                    />
                  </div>
                </div>

                {/* Help / Info Callout spanning both columns */}
                <div className="flex items-start gap-3 p-3.5 bg-surface-container-low rounded-lg md:col-span-2">
                  <Icon name="info" className="text-secondary text-[20px] shrink-0 mt-0.5" />
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Contact numbers are used strictly for account verification, administrative communications and security alerts. They are not displayed publicly.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3: Registered Office Address */}
            <section className="bg-surface-container-lowest p-6 md:p-8 rounded-xl shadow-sm">
              <div className="pb-5 mb-6">
                <h2 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2">
                  <Icon name="location_on" className="text-secondary text-[22px]" />
                  Registered Office Address
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Enter the legally documented registered office address of your organisation.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Field 1: Country */}
                <div className="flex flex-col gap-2">
                  <label
                    className="font-label-md text-label-md text-on-surface font-medium flex items-center gap-1"
                    htmlFor="country"
                  >
                    Country <span className="text-error font-bold">*</span>
                  </label>
                  <CustomDropdown
                    id="country"
                    required
                    placeholder="Select Country"
                    value={data?.countryId || ""}
                    onChange={(val) => {
                      const sel = countries.find((c) => c.id === val);
                      const cName = sel?.name || "";
                      const teleCode = sel?.dialCode || sel?.teleCode || "+91";
                      onChange({
                        countryId: val,
                        countryName: cName,
                        registeredOfficeCountryId: val,
                        registeredOfficeCountryName: cName,
                        primaryMobileCountryCode: teleCode,
                        stateId: "",
                        stateName: "",
                        districtId: "",
                        districtName: "",
                        cityId: "",
                        cityName: "",
                      });
                    }}
                    options={countryOptions}
                  />
                </div>

                {/* Field 2: State */}
                <div className="flex flex-col gap-2">
                  <label
                    className="font-label-md text-label-md text-on-surface font-medium flex items-center gap-1"
                    htmlFor="state"
                  >
                    State / Province <span className="text-error font-bold">*</span>
                  </label>
                  <CustomDropdown
                    id="state"
                    required
                    placeholder={!data?.countryId ? "Select Country first" : loadingStates ? "Loading states..." : states.length === 0 ? "No states found" : "Select State"}
                    value={data?.stateId || ""}
                    onChange={(val) => {
                      const sel = states.find((s) => s.id === val);
                      onChange({
                        stateId: val,
                        stateName: sel?.name || "",
                        districtId: "",
                        districtName: "",
                        cityId: "",
                        cityName: "",
                      });
                    }}
                    options={stateOptions}
                  />
                </div>

                {/* Field 3: District */}
                <div className="flex flex-col gap-2">
                  <label
                    className="font-label-md text-label-md text-on-surface font-medium flex items-center gap-1"
                    htmlFor="district"
                  >
                    District / County <span className="text-error font-bold">*</span>
                  </label>
                  <CustomDropdown
                    id="district"
                    required={districts.length > 0}
                    placeholder={!data?.stateId ? "Select State first" : loadingDistricts ? "Loading districts..." : districts.length === 0 ? "No districts found (Optional)" : "Select District"}
                    value={data?.districtId || ""}
                    onChange={(val) => {
                      const sel = districts.find((d) => d.id === val);
                      onChange({
                        districtId: val,
                        districtName: sel ? sel.name : "",
                        cityId: "",
                        cityName: "",
                      });
                    }}
                    options={districtOptions}
                  />
                </div>

                {/* Field 4: City / Town */}
                <div className="flex flex-col gap-2">
                  <label
                    className="font-label-md text-label-md text-on-surface font-medium flex items-center gap-1"
                    htmlFor="city"
                  >
                    City / Town <span className="text-error font-bold">*</span>
                  </label>
                  <input
                    className="w-full h-[46px] px-4 bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/60 font-body-md text-body-md rounded-lg focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                    id="city"
                    list="city-suggestions"
                    placeholder={!data?.stateId ? "Enter City / Town" : "e.g. Kochi, Pune, etc."}
                    required
                    type="text"
                    value={data?.cityName || ""}
                    onChange={(e) => {
                      const typed = e.target.value;
                      const matched = cities.find(
                        (c) => (c.cityName || c.name || "").toLowerCase() === typed.trim().toLowerCase()
                      );
                      onChange({
                        cityName: typed,
                        city: typed,
                        cityId: matched ? matched.id : "",
                      });
                    }}
                  />
                  <datalist id="city-suggestions">
                    {cities.map((c) => (
                      <option key={c.id} value={c.cityName || c.name} />
                    ))}
                  </datalist>
                </div>

                {/* Field 5: Postal Code */}
                <div className="flex flex-col gap-2">
                  <label
                    className="font-label-md text-label-md text-on-surface font-medium flex items-center gap-1"
                    htmlFor="postalCode"
                  >
                    Postal Code / ZIP <span className="text-error font-bold">*</span>
                  </label>
                  <input
                    className="w-full h-[46px] px-4 bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/60 font-body-md text-body-md rounded-lg focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                    id="postalCode"
                    placeholder="Enter postal code"
                    required
                    type="text"
                    value={data?.postalCode || ""}
                    onChange={(e) => onChange({ postalCode: e.target.value })}
                  />
                </div>

                {/* Field 6: Full Address (Spanning 2 columns) */}
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label
                    className="font-label-md text-label-md text-on-surface font-medium flex items-center gap-1"
                    htmlFor="fullAddress"
                  >
                    Full Physical Address <span className="text-error font-bold">*</span>
                  </label>
                  <textarea
                    className="w-full p-4 bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/60 font-body-md text-body-md rounded-lg focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary transition-all resize-y"
                    id="fullAddress"
                    placeholder="Enter the complete registered office address (Building name, Floor, Street, Landmark)"
                    required
                    rows={3}
                    value={data?.fullAddress || ""}
                    onChange={(e) => onChange({ fullAddress: e.target.value })}
                  />
                </div>
              </div>
            </section>

            {/* Section 4: About the Publication */}
            <section className="bg-surface-container-lowest p-6 md:p-8 rounded-xl shadow-sm">
              <div className="pb-5 mb-6">
                <h2
                  className="font-headline-sm text-headline-sm text-primary flex items-center gap-2 font-semibold"
                  style={{
                    fontFamily: 'Aeonik, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  }}
                >
                  <Icon name="description" className="text-secondary text-[22px]" />
                  <span>Publication Overview</span>
                </h2>
                <p className="font-body-sm text-body-sm text-secondary mt-1">
                  Introduce your publication and provide information about its editorial focus and background.
                </p>
              </div>
              <div className="flex flex-col gap-6">
                {/* Field 1: Short Description */}
                <div className="flex flex-col gap-1.5">
                  <label
                    className="font-label-md text-label-md text-on-surface font-medium flex items-center gap-1"
                    htmlFor="shortDescription"
                  >
                    Short Description <span className="text-error font-bold">*</span>
                  </label>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Briefly introduce your publication, its primary coverage areas and editorial focus.
                  </p>
                  <div className="mt-1">
                    <textarea
                      className="w-full p-4 bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/60 font-body-md text-body-md rounded-lg focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary transition-all resize-none"
                      id="shortDescription"
                      maxLength={300}
                      placeholder="Enter a short description of your publication, its coverage areas and editorial focus."
                      required
                      rows={3}
                      value={data?.shortDescription || ""}
                      onChange={(e) => onChange({ shortDescription: e.target.value })}
                    />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mt-1.5 font-label-sm text-label-sm text-on-surface-variant">
                      <span className="text-on-surface-variant opacity-60 text-label-sm">
                        This description will be used in the public-facing profile, search results, discovery feeds and publication previews.
                      </span>
                      <span className="text-on-surface-variant opacity-60 shrink-0 text-right">
                        <span
                          className={`font-medium ${
                            shortDescCount >= 290 ? "text-error" : "text-primary"
                          }`}
                          id="shortDescCount"
                          suppressHydrationWarning
                        >
                          {shortDescCount}
                        </span>{" "}
                        / 300 characters
                      </span>
                    </div>
                  </div>
                </div>

                {/* Field 2: About the Publication */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      className="font-label-md text-label-md text-on-surface font-medium flex items-center gap-2"
                      htmlFor="aboutPublicationDetails"
                    >
                      About the Publication{" "}
                      <span className="font-label-sm text-label-sm text-on-surface-variant font-normal opacity-60">
                        Optional
                      </span>
                    </label>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Tell readers more about your organisation, its background, editorial mission and coverage.
                  </p>
                  <div className="mt-1 border border-outline-variant/60 rounded-lg overflow-hidden bg-surface-container-lowest focus-within:ring-2 focus-within:ring-secondary focus-within:border-secondary transition-all">
                    {/* Rich text toolbar */}
                    <div className="border-b border-outline-variant/40 bg-surface-container-low px-3 py-1.5 flex items-center gap-2 text-on-surface-variant text-label-sm select-none">
                      <button
                        className="w-7 h-7 rounded flex items-center justify-center font-bold hover:bg-surface-container-highest text-on-surface transition-colors"
                        title="Bold"
                        type="button"
                        onClick={() => applyFormatting("bold")}
                      >
                        B
                      </button>
                      <button
                        className="w-7 h-7 rounded flex items-center justify-center italic font-serif hover:bg-surface-container-highest text-on-surface transition-colors"
                        title="Italic"
                        type="button"
                        onClick={() => applyFormatting("italic")}
                      >
                        I
                      </button>
                      <button
                        className="w-7 h-7 rounded flex items-center justify-center underline hover:bg-surface-container-highest text-on-surface transition-colors"
                        title="Underline"
                        type="button"
                        onClick={() => applyFormatting("underline")}
                      >
                        U
                      </button>
                      <div className="w-[1px] h-4 bg-outline-variant/60 mx-1"></div>
                      <button
                        className="w-7 h-7 rounded flex items-center justify-center hover:bg-surface-container-highest text-on-surface transition-colors"
                        title="Bullet List"
                        type="button"
                        onClick={() => applyFormatting("bullet")}
                      >
                        <Icon name="format_list_bulleted" className="text-[18px]" />
                      </button>
                      <button
                        className="w-7 h-7 rounded flex items-center justify-center hover:bg-surface-container-highest text-on-surface transition-colors"
                        title="Numbered List"
                        type="button"
                        onClick={() => applyFormatting("numbered")}
                      >
                        <Icon name="format_list_numbered" className="text-[18px]" />
                      </button>
                    </div>
                    <textarea
                      ref={aboutTextareaRef}
                      className="w-full min-h-[140px] p-3 text-body-md text-on-surface placeholder:text-on-surface-variant/60 bg-transparent border-0 focus:outline-none focus:ring-0 resize-y"
                      id="aboutPublicationDetails"
                      maxLength={3000}
                      placeholder="Write more about your publication..."
                      value={data?.aboutPublication || ""}
                      onChange={(e) => onChange({ aboutPublication: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="flex items-center justify-end mt-1 font-label-sm text-label-sm text-on-surface-variant opacity-60">
                    <span id="aboutPubCount" suppressHydrationWarning>
                      {aboutPubCount}
                    </span>{" "}
                    / 3,000 characters
                  </div>

                  {/* Skip Option & Helper note */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 pt-1">
                    <button
                      className="font-label-md text-label-md font-medium text-secondary hover:underline cursor-pointer flex items-center gap-1 w-fit bg-transparent border-0 p-0"
                      type="button"
                      onClick={handleSkipAbout}
                    >
                      <Icon name="redo" className="text-[16px]" /> Skip for now
                    </button>
                    <span className="hidden sm:inline text-outline-variant">•</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant opacity-60">
                      You can complete or update this information later from your publisher dashboard.
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {activeError && (
              <div
                ref={errorBannerRef}
                role="alert"
                className="flex items-start gap-3 p-4 rounded-xl bg-error-container text-on-error-container border border-error/20 text-body-md font-body-md font-medium"
              >
                <Icon name="error" className="text-error text-[20px] shrink-0 mt-0.5" />
                <span className="flex-1">{activeError}</span>
              </div>
            )}

            {/* Form Footer: Navigation Actions */}
            <OnboardingBottomBar
              currentStep={1}
              totalSteps={5}
              onSaveDraft={handleSaveDraftClick}
              isSavingDraft={false}
              isDraftSaved={isDraftSaved}
              isSubmitting={isSubmitting}
              nextDisabled={isSubmitting}
              nextLabel="Continue"
              showBack={false}
              isSubmitType={true}
            />
          </form>
        </div>
      </div>
    </main>
  );
}
