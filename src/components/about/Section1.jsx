"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  needsGoogleProfileCompletion,
  signInWithGoogle,
} from "@/utils/googleAuth";

const MEMBER_AVATARS = [
  {
    alt: "Member avatar 1",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-fQgN7YZkns022a1B_0HrtTD3foynMOPGQbJVsO2rauRwd5SOC-PmeR9M5L8OS_b-uekRVca40XDiEK8D9PpcnXzNoulQzHG5OQewuQALVcqT16DFGXJu39pZLe48B9e5qHu4L4uInD_ZWCzIyO7gEiBC3OvRtWm96jPdTwv9uSzaF5SNywyq62K-qaHA0QgfnkbqOjm9RpUU86K5LZySyFFxiTC_G0bjFYIxr3Tb6ZXUA6vb09u14aEJXWlSTSsG",
  },
  {
    alt: "Member avatar 2",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFm83oRg2TQdW5bgtl6OHPn1W_LFjvfwO8WmLKLdq7Xs-FFv1BwntZB6HRtC13Uz5_rLoN4VTnTpnTo9GxR7ggVUxmfsjUW-Lj1577bWK1kZ2kRL84hQX0wOKSBZZ4fgSX8TxOx2HvusCyqXiSHUYA_KxWpXzMpv33RQr64qkCEvy3BQ5lxVbhR_-ZtQUgmjsvYpysZyH-7DUvfswsAxTXCWghmgP6CCUhu-grVH0AV5NDPDTDTeshneife2mPBzk4",
  },
  {
    alt: "Member avatar 3",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLX9zjs0VNGGYqIfIjvY15Zg85shT-9ZpFmxyJn5n6ts8FMEHmRZLtcpHkGBmO6KSGXAaqqiXm2OFMh_koiAJKUCySgA-ZUQ2PouFqSNX0lrhdJA4vrR5eK3ffWD5u7UA1yZU25xPbRmTZNvxU85GvG0i0jrUH9T7lJk_nmSsPNYVmf9pIYU0Gy7uxX5HPy2rfGlIpi-Z9HfjX9a7gWQWtxSEWASGTKcxSF7SDdlqrR7Gjzbs-hACr2hd6Cc3i-5eD",
  },
];

function isPhoneContact(value) {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (trimmed.includes("@")) return false;
  // Digits / + / spaces / dashes only → treat as phone
  return /^[\d+\s-]+$/.test(trimmed);
}

function normalizeIndianMobile(raw) {
  let digits = String(raw || "")
    .replace(/^\+?91/, "")
    .replace(/\D/g, "");
  return digits.slice(0, 10);
}

function buildContactPayload(rawContact) {
  const trimmed = rawContact.trim();
  const payload = { signUp: true };

  if (trimmed.includes("@")) {
    payload.email = trimmed;
  } else {
    const digits = normalizeIndianMobile(trimmed);
    payload.mobileNumber = `+91${digits}`;
  }

  return payload;
}

function maskDestination(contactFields) {
  if (contactFields.email) {
    const [local, domain] = contactFields.email.split("@");
    if (!domain) return contactFields.email;
    const visible = local.slice(0, 2);
    return `${visible}${"*".repeat(Math.max(local.length - 2, 1))}@${domain}`;
  }

  if (contactFields.mobileNumber) {
    const phone = contactFields.mobileNumber;
    if (phone.length <= 4) return phone;
    return `${phone.slice(0, 3)}${"*".repeat(Math.max(phone.length - 6, 2))}${phone.slice(-3)}`;
  }

  return "";
}

function persistAuthSession(data, contactFields) {
  if (!data?.data?.accessToken) return false;

  try {
    const isEmail = Boolean(contactFields.email);
    localStorage.setItem("pintree_access_token", data.data.accessToken);
    localStorage.setItem("pintree_login_method", isEmail ? "email" : "mobile");
    localStorage.setItem("pintree_login_verified", "true");

    if (data.data.userId) {
      localStorage.setItem("pintree_user_id", data.data.userId);
    }

    if (isEmail) {
      localStorage.setItem("pintree_user_email", contactFields.email);
      localStorage.removeItem("pintree_user_phone");
    } else {
      const phone = contactFields.mobileNumber || data.data.recipient;
      if (phone) {
        localStorage.setItem("pintree_user_phone", phone);
        localStorage.removeItem("pintree_user_email");
      }
    }

    try {
      const parts = data.data.accessToken.split(".");
      if (parts.length >= 2) {
        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const decoded = JSON.parse(decodeURIComponent(escape(atob(base64))));
        if (decoded?.email) localStorage.setItem("pintree_auth_email", decoded.email);
        if (decoded?.mobileNumber) {
          localStorage.setItem("pintree_auth_phone", decoded.mobileNumber);
        }
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
    return true;
  } catch (storageErr) {
    console.warn("Storage warning:", storageErr);
    return false;
  }
}

async function postJson(proxyPath, backendUrl, payload, extraHeaders = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...extraHeaders,
  };

  let res;
  try {
    res = await fetch(proxyPath, {
      method: "POST",
      credentials: "include",
      headers,
      body: JSON.stringify(payload),
    });
  } catch {
    res = await fetch(backendUrl, {
      method: "POST",
      credentials: "include",
      headers,
      body: JSON.stringify(payload),
    });
  }

  const data = await res.json().catch(() => null);
  return { res, data };
}

function Section1() {
  const router = useRouter();
  const [step, setStep] = useState("contact");
  const [contact, setContact] = useState("");
  const [contactFields, setContactFields] = useState(null);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [nationality, setNationality] = useState("");
  const [nationalityQuery, setNationalityQuery] = useState("");
  const [showCountryList, setShowCountryList] = useState(false);
  const [dob, setDob] = useState("");
  const [handleId, setHandleId] = useState("");
  const [genders, setGenders] = useState([]);
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const filteredCountries = useMemo(() => {
    const q = nationalityQuery.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter((c) =>
      String(c.name || "")
        .toLowerCase()
        .includes(q)
    );
  }, [countries, nationalityQuery]);

  const enterGoogleProfileStep = (googleData) => {
    const email = googleData?.email || localStorage.getItem("pintree_user_email") || "";
    const name =
      googleData?.name || localStorage.getItem("pintree_user_full_name") || "";
    setContactFields({ email: email || undefined, mobileNumber: undefined });
    setFullName(name);
    setGender("");
    setNationality("");
    setNationalityQuery("");
    setDob("");
    setErrorMsg("");
    setSuccessMsg("");
    setStep("profile");
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("continue") !== "profile") return;

    const token = localStorage.getItem("pintree_access_token");
    if (!token) return;

    enterGoogleProfileStep({
      email: localStorage.getItem("pintree_user_email") || "",
      name: localStorage.getItem("pintree_user_full_name") || "",
    });

    router.replace("/", { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (step !== "profile") return;

    let cancelled = false;

    const loadProfileOptions = async () => {
      const accessToken = localStorage.getItem("pintree_access_token");
      const authHeaders = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};

      try {
        const [genderRes, countryRes] = await Promise.all([
          fetch("/api/shared/gender?page=1&limit=10", {
            headers: authHeaders,
            credentials: "include",
          }),
          fetch("/api/places/countries?page=1&limit=100", {
            credentials: "include",
          }),
        ]);

        const genderData = await genderRes.json().catch(() => null);
        const countryData = await countryRes.json().catch(() => null);

        if (cancelled) return;

        const rawGenders =
          genderData?.data?.genders ||
          genderData?.data?.items ||
          genderData?.data ||
          genderData?.genders ||
          [];
        const genderList = (Array.isArray(rawGenders) ? rawGenders : [])
          .map((item) => {
            if (typeof item === "string") return item;
            return item?.gender || item?.name || item?.value || item?.label || "";
          })
          .filter(Boolean);
        setGenders(genderList);

        const countryList = countryData?.data?.countries || [];
        setCountries(Array.isArray(countryList) ? countryList : []);
      } catch (err) {
        console.warn("Failed to load profile options:", err);
      }
    };

    loadProfileOptions();
    return () => {
      cancelled = true;
    };
  }, [step]);

  const handleCreateAccount = async (event) => {
    event.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!contact.trim()) {
      setErrorMsg("Please enter your email or phone number.");
      return;
    }

    if (isPhoneContact(contact)) {
      const digits = normalizeIndianMobile(contact);
      if (digits.length !== 10) {
        setErrorMsg("Please enter a valid 10-digit mobile number.");
        return;
      }
    }

    const payload = buildContactPayload(contact);
    setIsLoading(true);

    try {
      const { res, data } = await postJson(
        "/api/auth/send-otp",
        "https://dev.user.pintree.co/v1/auth/web/send-otp",
        payload
      );

      if (!res.ok || (data && data.status === "error")) {
        setErrorMsg(
          (typeof data?.message === "string" && data.message) ||
            "Could not send OTP. Please try again."
        );
        return;
      }

      setContactFields({
        email: payload.email,
        mobileNumber: payload.mobileNumber,
      });
      setOtp("");
      setErrorMsg("");
      setSuccessMsg("");
      setStep("otp");
    } catch {
      setErrorMsg("Could not send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!contactFields) return;

    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    const payload = {
      signUp: true,
      ...(contactFields.email
        ? { email: contactFields.email }
        : { mobileNumber: contactFields.mobileNumber }),
    };

    try {
      const { res, data } = await postJson(
        "/api/auth/send-otp",
        "https://dev.user.pintree.co/v1/auth/web/send-otp",
        payload
      );

      if (!res.ok || (data && data.status === "error")) {
        setErrorMsg(
          (typeof data?.message === "string" && data.message) ||
            "Could not resend OTP. Please try again."
        );
        return;
      }

      setSuccessMsg(
        (typeof data?.message === "string" && data.message) || "OTP resent"
      );
    } catch {
      setErrorMsg("Could not resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const code = otp.trim();
    if (!/^\d{6}$/.test(code)) {
      setErrorMsg("Please enter the 6-digit verification code.");
      return;
    }

    if (!contactFields) {
      setErrorMsg("Please enter your email or phone number again.");
      setStep("contact");
      return;
    }

    const payload = {
      signUp: true,
      otp: code,
      ...(contactFields.email
        ? { email: contactFields.email }
        : { mobileNumber: contactFields.mobileNumber }),
    };

    setIsLoading(true);

    try {
      const { res, data } = await postJson(
        "/api/auth/validating-otp",
        "https://dev.user.pintree.co/v1/auth/web/validating-otp",
        payload
      );

      if (!res.ok || (data && data.status === "error")) {
        setErrorMsg(
          (typeof data?.message === "string" && data.message) ||
            "Invalid or expired OTP. Please try again."
        );
        return;
      }

      if (data?.data?.accessToken) {
        persistAuthSession(data, contactFields);
        setPassword("");
        setConfirmPassword("");
        setErrorMsg("");
        setSuccessMsg("");
        setStep("password");
        return;
      }

      setSuccessMsg(
        (typeof data?.message === "string" && data.message) ||
          "Verified successfully."
      );
    } catch {
      setErrorMsg("Could not verify OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePassword = async (event) => {
    event.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!password) {
      setErrorMsg("Please enter a password.");
      return;
    }
    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    const accessToken =
      typeof window !== "undefined"
        ? localStorage.getItem("pintree_access_token")
        : null;
    if (!accessToken) {
      setErrorMsg("Session expired. Please verify OTP again.");
      setStep("otp");
      return;
    }

    const payload = { password };
    if (contactFields?.email) payload.email = contactFields.email;
    if (contactFields?.mobileNumber) {
      payload.mobileNumber = contactFields.mobileNumber;
    }

    setIsLoading(true);

    try {
      const { res, data } = await postJson(
        "/api/auth/register/page-1",
        "https://dev.user.pintree.co/v1/auth/web/register/page-1",
        payload,
        { Authorization: `Bearer ${accessToken}` }
      );

      if (!res.ok || (data && data.status === "error")) {
        setErrorMsg(
          (typeof data?.message === "string" && data.message) ||
            "Could not create password. Please try again."
        );
        return;
      }

      if (data?.data?.id) {
        localStorage.setItem("pintree_user_id", data.data.id);
      }

      setFullName("");
      setGender("");
      setNationality("");
      setNationalityQuery("");
      setDob("");
      setErrorMsg("");
      setSuccessMsg("");
      setStep("profile");
    } catch {
      setErrorMsg("Could not create password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteProfile = async (event) => {
    event.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const trimmedName = fullName.trim();

    if (!trimmedName) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!gender) {
      setErrorMsg("Please select your gender.");
      return;
    }
    if (!nationality) {
      setErrorMsg("Please select your nationality.");
      return;
    }
    if (!dob) {
      setErrorMsg("Please enter your date of birth.");
      return;
    }

    const signupEmail = contactFields?.email?.trim() || "";
    const localDigits = normalizeIndianMobile(
      contactFields?.mobileNumber || ""
    );
    const signupPhone =
      localDigits.length === 10 ? `+91${localDigits}` : "";

    if (!signupEmail && !signupPhone) {
      setErrorMsg("Signup email or mobile number is missing. Please start again.");
      return;
    }

    const accessToken = localStorage.getItem("pintree_access_token");
    if (!accessToken) {
      setErrorMsg("Session expired. Please verify OTP again.");
      setStep("otp");
      return;
    }

    const payload = {
      fullName: trimmedName,
      gender,
      nationality,
      dob,
      accountType: "PERSONAL",
      accountCategory: "INDIVIDUAL",
    };
    if (signupEmail) {
      payload.email = signupEmail;
    }
    if (signupPhone) {
      payload.mobileNumber = signupPhone;
    }

    setIsLoading(true);

    try {
      const { res, data } = await postJson(
        "/api/auth/register/page-2",
        "https://dev.user.pintree.co/v1/auth/web/register/page-2",
        payload,
        { Authorization: `Bearer ${accessToken}` }
      );

      if (!res.ok || (data && data.status === "error")) {
        setErrorMsg(
          (typeof data?.message === "string" && data.message) ||
            "Could not complete registration. Please try again."
        );
        return;
      }

      if (data?.data?.id) {
        localStorage.setItem("pintree_user_id", data.data.id);
      }
      localStorage.setItem("pintree_user_full_name", trimmedName);
      if (signupEmail) {
        localStorage.setItem("pintree_user_email", signupEmail);
      }
      if (signupPhone) {
        localStorage.setItem("pintree_user_phone", signupPhone);
      }

      setHandleId("");
      setErrorMsg("");
      setSuccessMsg("");
      setStep("handle");
    } catch {
      setErrorMsg("Could not complete registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateHandle = async (event) => {
    event.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const normalized = handleId
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "");

    if (!normalized) {
      setErrorMsg("Please choose a handle.");
      return;
    }

    if (normalized !== handleId.trim()) {
      setHandleId(normalized);
    }

    const accessToken = localStorage.getItem("pintree_access_token");
    const userId = localStorage.getItem("pintree_user_id");

    if (!accessToken) {
      setErrorMsg("Session expired. Please verify OTP again.");
      setStep("otp");
      return;
    }
    if (!userId) {
      setErrorMsg("Missing account id. Please complete your profile again.");
      setStep("profile");
      return;
    }

    setIsLoading(true);

    try {
      let res;
      try {
        res = await fetch("/api/auth/register/page-3", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ handleId: normalized, userId }),
        });
      } catch {
        res = await fetch(
          `https://dev.user.pintree.co/v1/auth/web/register/${encodeURIComponent(userId)}/Page-3`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ handleId: normalized }),
          }
        );
      }

      const data = await res.json().catch(() => null);

      if (!res.ok || (data && data.status === "error")) {
        setErrorMsg(
          (typeof data?.message === "string" && data.message) ||
            "Could not save handle. Please try again."
        );
        return;
      }

      localStorage.setItem("pintree_user_handle", normalized);
      router.push("/account");
    } catch {
      setErrorMsg("Could not save handle. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeContact = () => {
    setStep("contact");
    setOtp("");
    setPassword("");
    setConfirmPassword("");
    setFullName("");
    setGender("");
    setNationality("");
    setNationalityQuery("");
    setDob("");
    setHandleId("");
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleGoogleSignUp = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    try {
      const result = await signInWithGoogle();
      if (!result.ok) {
        setErrorMsg(result.message || "Google Sign-In failed.");
        return;
      }

      if (needsGoogleProfileCompletion(result.data)) {
        enterGoogleProfileStep(result.data);
        return;
      }

      router.push("/account");
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Google Sign-In failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-[1340px] flex-1 px-8 pb-20 pt-16 font-jakarta lg:pt-20">
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Left Column: Hero Content & Brand Statement */}
        <div className="flex flex-col justify-start pt-2 lg:col-span-7">
          {/* Eyebrow Badge */}
          <div className="mb-6 flex items-center gap-2">
            <span className="inline-block h-[9px] w-[9px] rounded-full bg-[#b2f068] ring-2 ring-[#e6ffd1]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#777777]">
              A social space built around you
            </span>
          </div>

          {/* Headline */}
          <h1 className="mb-7 font-aeonik-regular text-[40px] font-normal leading-[1.08] tracking-[-0.035em] text-[#171717] sm:text-[52px] lg:text-[64px]">
            People. Communities.
            <br />
            Discovery.
          </h1>

          {/* Subtitle / Value Proposition */}
          <p className="mb-11 max-w-[530px] font-jakarta text-[16px] font-normal leading-6 text-[#525252]">
            People you know <span className="mx-0.5 font-sans text-neutral-400">→</span>
            <br />
            Communities you belong to{" "}
            <span className="mx-0.5 font-sans text-neutral-400">→</span>
            <br />
            A world beyond your network.
          </p>

          {/* App Download Section */}
          <div className="mb-10" id="download">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#767676]">
              Available on Android and iOS
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                className="flex h-[48px] w-[160px] items-center gap-3 rounded-[9px] bg-black px-4 py-2.5 text-white transition hover:bg-neutral-800"
                href="#"
                aria-label="Download on the App Store"
              >
                <svg className="h-6 w-6 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden>
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.85.94-2.93-.91.04-2.02.61-2.67 1.38-.58.67-1.08 1.76-.94 2.81 1.02.08 2.04-.49 2.67-1.26" />
                </svg>
                <div className="flex flex-col text-left leading-none">
                  <span className="mb-0.5 text-[8.5px] uppercase tracking-wider text-neutral-300">
                    Download on the
                  </span>
                  <span className="text-[13px] font-medium tracking-tight">App Store</span>
                </div>
              </a>

              <a
                className="flex h-[48px] w-[160px] items-center gap-3 rounded-[9px] bg-black px-4 py-2.5 text-white transition hover:bg-neutral-800"
                href="#"
                aria-label="Get it on Google Play"
              >
                <svg
                  className="ml-0.5 h-[21px] w-[21px] shrink-0"
                  viewBox="0 0 512 512"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    fill="#0086F9"
                    d="M57.9 20.3C53.7 24.8 51.3 31.7 51.3 40.8v430.4c0 9.1 2.4 16 6.6 20.5l2.2 2.1L281.4 272.5V239.5L60.1 18.2l-2.2 2.1z"
                  />
                  <path
                    fill="#FF3A44"
                    d="M355.2 346.3l-73.8-73.8v-33L355.2 165.7l1.7 1 87.2 49.5c24.9 14.1 24.9 37.3 0 51.5l-87.2 49.5-1.7 1z"
                  />
                  <path
                    fill="#00E676"
                    d="M356.9 345.3L281.4 269.8 60.1 491.1c8.2 8.7 21.8 9.8 37 1.2l259.8-147"
                  />
                  <path
                    fill="#FFC400"
                    d="M356.9 166.7L97.1 19.7c-15.2-8.6-28.8-7.5-37 1.2L281.4 242.2l75.5-75.5z"
                  />
                </svg>
                <div className="flex flex-col text-left leading-none">
                  <span className="mb-0.5 text-[8.5px] uppercase tracking-wider text-neutral-300">
                    Get it on
                  </span>
                  <span className="text-[13px] font-medium tracking-tight">Google Play</span>
                </div>
              </a>
            </div>
          </div>

          {/* Social Proof / Active Members Pill */}
          <div className="inline-flex w-fit items-center gap-2.5 rounded-full border border-[#e8e8e8] bg-[#f6f6f6] py-1.5 pl-1.5 pr-4">
            <div className="flex -space-x-2">
              {MEMBER_AVATARS.map((avatar) => (
                <img
                  key={avatar.alt}
                  alt={avatar.alt}
                  className="inline-block h-6 w-6 rounded-full object-cover ring-2 ring-white"
                  src={avatar.src}
                />
              ))}
            </div>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#9ee049]" />
            <p className="text-[12.5px] text-[#4b4b4b]">
              Over <span className="font-semibold text-[#1a1a1a]">14,000 active members</span>{" "}
              today
            </p>
          </div>
        </div>

        {/* Right Column: Registration Card */}
        <div className="flex justify-center lg:col-span-5 lg:justify-end">
          <div className="w-full max-w-[400px] rounded-[20px] border border-[#e5e5e5] bg-white p-7 shadow-[0_2px_12px_rgba(0,0,0,0.02)] md:p-8">
            {step === "contact" && (
              <>
                <div className="mb-6">
                  <h2 className="font-aeonik-medium text-[22px] font-medium leading-[1.25] tracking-tight text-[#141414]">
                    Join Pintree
                  </h2>
                  <p className="mt-0.5 text-[13px] text-[#525252]">
                    Create your space. Find your people.
                  </p>
                </div>

                <form
                  className="space-y-4"
                  method="POST"
                  onSubmit={handleCreateAccount}
                >
                  <div>
                    <label
                      className="mb-1.5 block text-[12.5px] font-medium text-[#2d2d2d]"
                      htmlFor="contact"
                    >
                      Email address or phone number
                    </label>
                    {isPhoneContact(contact) ||
                    (contact.length > 0 && /^[\d+\s-]*$/.test(contact)) ? (
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] font-medium text-[#2d2d2d]">
                          +91
                        </span>
                        <input
                          className="h-[42px] w-full rounded-[8px] border border-[#e2e2e2] bg-white py-0 pl-12 pr-3.5 text-[13px] text-gray-800 placeholder-[#a1a1aa] transition focus:border-black focus:outline-none focus:ring-0 disabled:opacity-60"
                          id="contact"
                          name="contact"
                          placeholder="9876543210"
                          type="tel"
                          inputMode="numeric"
                          maxLength={10}
                          value={normalizeIndianMobile(contact)}
                          disabled={isLoading}
                          onChange={(event) => {
                            const digits = normalizeIndianMobile(
                              event.target.value
                            );
                            setContact(digits ? `+91${digits}` : "");
                          }}
                        />
                      </div>
                    ) : (
                      <input
                        className="h-[42px] w-full rounded-[8px] border border-[#e2e2e2] bg-white px-3.5 text-[13px] text-gray-800 placeholder-[#a1a1aa] transition focus:border-black focus:outline-none focus:ring-0 disabled:opacity-60"
                        id="contact"
                        name="contact"
                        placeholder="you@example.com or mobile"
                        type="text"
                        value={contact}
                        disabled={isLoading}
                        onChange={(event) => {
                          const next = event.target.value;
                          if (
                            next.length > 0 &&
                            /^[\d+\s-]+$/.test(next) &&
                            !next.includes("@")
                          ) {
                            const digits = normalizeIndianMobile(next);
                            setContact(digits ? `+91${digits}` : "");
                            return;
                          }
                          setContact(next);
                        }}
                      />
                    )}
                  </div>

                  <div>
                    <button
                      className="flex h-[44px] w-full cursor-pointer items-center justify-center rounded-[9px] bg-black text-[13.5px] font-semibold tracking-tight text-white shadow-sm transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending…" : "Create account"}
                    </button>
                    {errorMsg ? (
                      <p className="mt-2 text-center text-[12px] text-[#ba1a1a]">
                        {errorMsg}
                      </p>
                    ) : (
                      <p className="mt-2 text-center text-[12px] text-[#525252]">
                        We&apos;ll send an OTP for verification
                      </p>
                    )}
                  </div>

                  <div className="relative my-3 flex items-center justify-center">
                    <div className="w-full border-t border-[#f0f0f0]" />
                    <span className="absolute bg-white px-3 text-[11px] uppercase tracking-wider text-[#737373]">
                      or
                    </span>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={handleGoogleSignUp}
                      disabled={isLoading}
                      className="flex h-[42px] w-full cursor-pointer items-center justify-center gap-2.5 rounded-[9px] border border-[#e2e2e2] bg-white text-[13px] font-medium text-[#2d2d2d] shadow-sm transition hover:bg-[#f6f6f6] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden>
                        <path
                          fill="#4285F4"
                          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                        />
                      </svg>
                      {isLoading ? "Connecting…" : "Sign up with Google"}
                    </button>
                  </div>

                  <p className="px-1 pt-1 text-center text-[11px] leading-[1.4] text-[#525252]">
                    By signing up, you agree to our{" "}
                    <Link
                      className="text-[#737373] underline hover:text-black"
                      href="/terms-of-service"
                    >
                      Terms of Use
                    </Link>{" "}
                    and{" "}
                    <Link
                      className="text-[#737373] underline hover:text-black"
                      href="/privacy-policy"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>

                  <div className="border-t border-[#f0f0f0] pt-4 text-center">
                    <p className="text-[12.5px] text-[#525252]">
                      Creating a professional or public account?
                    </p>
                    <Link
                      className="mt-2 flex h-[42px] w-full cursor-pointer items-center justify-center rounded-[9px] border border-[#e5e5e5] bg-[#f6f6f6] text-[13px] font-semibold text-[#2d2d2d] shadow-sm transition hover:bg-[#ececec]"
                      href="/contact"
                    >
                      Let&apos;s get started
                    </Link>
                  </div>
                </form>
              </>
            )}

            {step === "otp" && (
              <>
                <div className="mb-6">
                  <h2 className="font-aeonik-medium text-[22px] font-medium leading-[1.25] tracking-tight text-[#141414]">
                    Enter verification code
                  </h2>
                  <p className="mt-0.5 text-[13px] text-[#525252]">
                    Code sent to{" "}
                    <span className="font-medium text-[#2d2d2d]">
                      {maskDestination(contactFields || {})}
                    </span>
                  </p>
                </div>

                <form
                  className="space-y-4"
                  method="POST"
                  onSubmit={handleVerifyOtp}
                >
                  <div>
                    <label
                      className="mb-1.5 block text-[12.5px] font-medium text-[#2d2d2d]"
                      htmlFor="otp"
                    >
                      6-digit code
                    </label>
                    <input
                      className="h-[42px] w-full rounded-[8px] border border-[#e2e2e2] bg-white px-3.5 text-center text-[18px] tracking-[0.35em] text-gray-800 placeholder-[#a1a1aa] transition focus:border-black focus:outline-none focus:ring-0 disabled:opacity-60"
                      id="otp"
                      name="otp"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      placeholder="••••••"
                      maxLength={6}
                      value={otp}
                      disabled={isLoading}
                      onChange={(event) =>
                        setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                    />
                  </div>

                  <div>
                    <button
                      className="flex h-[44px] w-full cursor-pointer items-center justify-center rounded-[9px] bg-black text-[13.5px] font-semibold tracking-tight text-white shadow-sm transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? "Verifying…" : "Verify"}
                    </button>
                    {errorMsg ? (
                      <p className="mt-2 text-center text-[12px] text-[#ba1a1a]">
                        {errorMsg}
                      </p>
                    ) : successMsg ? (
                      <p className="mt-2 text-center text-[12px] text-[#3d6922]">
                        {successMsg}
                      </p>
                    ) : (
                      <p className="mt-2 text-center text-[12px] text-[#525252]">
                        Enter the code to continue
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isLoading}
                      className="text-[12.5px] font-medium text-[#2d2d2d] underline-offset-2 hover:underline disabled:opacity-60"
                    >
                      Resend code
                    </button>
                    <button
                      type="button"
                      onClick={handleChangeContact}
                      disabled={isLoading}
                      className="text-[12.5px] text-[#525252] underline-offset-2 hover:underline disabled:opacity-60"
                    >
                      Change email or phone
                    </button>
                  </div>
                </form>
              </>
            )}

            {step === "password" && (
              <>
                <div className="mb-6">
                  <h2 className="font-aeonik-medium text-[22px] font-medium leading-[1.25] tracking-tight text-[#141414]">
                    Create a password
                  </h2>
                  <p className="mt-0.5 text-[13px] text-[#525252]">
                    Choose a password for your Pintree account.
                  </p>
                </div>

                <form
                  className="space-y-4"
                  method="POST"
                  onSubmit={handleCreatePassword}
                >
                  <div>
                    <label
                      className="mb-1.5 block text-[12.5px] font-medium text-[#2d2d2d]"
                      htmlFor="signup-password"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        className="h-[42px] w-full rounded-[8px] border border-[#e2e2e2] bg-white px-3.5 pr-12 text-[13px] text-gray-800 placeholder-[#a1a1aa] transition focus:border-black focus:outline-none focus:ring-0 disabled:opacity-60"
                        id="signup-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="At least 8 characters"
                        value={password}
                        disabled={isLoading}
                        onChange={(event) => setPassword(event.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-medium text-[#737373] hover:text-black"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      className="mb-1.5 block text-[12.5px] font-medium text-[#2d2d2d]"
                      htmlFor="signup-confirm-password"
                    >
                      Confirm password
                    </label>
                    <input
                      className="h-[42px] w-full rounded-[8px] border border-[#e2e2e2] bg-white px-3.5 text-[13px] text-gray-800 placeholder-[#a1a1aa] transition focus:border-black focus:outline-none focus:ring-0 disabled:opacity-60"
                      id="signup-confirm-password"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      disabled={isLoading}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                    />
                  </div>

                  <div>
                    <button
                      className="flex h-[44px] w-full cursor-pointer items-center justify-center rounded-[9px] bg-black text-[13.5px] font-semibold tracking-tight text-white shadow-sm transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? "Saving…" : "Continue"}
                    </button>
                    {errorMsg ? (
                      <p className="mt-2 text-center text-[12px] text-[#ba1a1a]">
                        {errorMsg}
                      </p>
                    ) : (
                      <p className="mt-2 text-center text-[12px] text-[#525252]">
                        Use at least 8 characters
                      </p>
                    )}
                  </div>
                </form>
              </>
            )}

            {step === "profile" && (
              <>
                <div className="mb-6">
                  <h2 className="font-aeonik-medium text-[22px] font-medium leading-[1.25] tracking-tight text-[#141414]">
                    Complete your profile
                  </h2>
                  <p className="mt-0.5 text-[13px] text-[#525252]">
                    A few details to finish creating your account.
                  </p>
                </div>

                <form
                  className="space-y-4"
                  method="POST"
                  onSubmit={handleCompleteProfile}
                >
                  <div>
                    <label
                      className="mb-1.5 block text-[12.5px] font-medium text-[#2d2d2d]"
                      htmlFor="fullName"
                    >
                      Full name
                    </label>
                    <input
                      className="h-[42px] w-full rounded-[8px] border border-[#e2e2e2] bg-white px-3.5 text-[13px] text-gray-800 placeholder-[#a1a1aa] transition focus:border-black focus:outline-none focus:ring-0 disabled:opacity-60"
                      id="fullName"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      placeholder="Jane Doe"
                      value={fullName}
                      disabled={isLoading}
                      onChange={(event) => setFullName(event.target.value)}
                    />
                  </div>

                  <div>
                    <label
                      className="mb-1.5 block text-[12.5px] font-medium text-[#2d2d2d]"
                      htmlFor="gender"
                    >
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={gender}
                      disabled={isLoading}
                      onChange={(event) => setGender(event.target.value)}
                      className="h-[42px] w-full rounded-[8px] border border-[#e2e2e2] bg-white px-3.5 text-[13px] text-gray-800 transition focus:border-black focus:outline-none focus:ring-0 disabled:opacity-60"
                    >
                      <option value="">Select gender</option>
                      {genders.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="relative">
                    <label
                      className="mb-1.5 block text-[12.5px] font-medium text-[#2d2d2d]"
                      htmlFor="nationality"
                    >
                      Nationality
                    </label>
                    <input
                      className="h-[42px] w-full rounded-[8px] border border-[#e2e2e2] bg-white px-3.5 text-[13px] text-gray-800 placeholder-[#a1a1aa] transition focus:border-black focus:outline-none focus:ring-0 disabled:opacity-60"
                      id="nationality"
                      name="nationality"
                      type="text"
                      autoComplete="off"
                      placeholder="Search country"
                      value={nationalityQuery}
                      disabled={isLoading}
                      onFocus={() => setShowCountryList(true)}
                      onChange={(event) => {
                        setNationalityQuery(event.target.value);
                        setNationality("");
                        setShowCountryList(true);
                      }}
                    />
                    {showCountryList && filteredCountries.length > 0 && (
                      <ul className="absolute z-20 mt-1 max-h-40 w-full overflow-auto rounded-[8px] border border-[#e2e2e2] bg-white shadow-sm">
                        {filteredCountries.map((country) => (
                          <li key={country.id || country.name}>
                            <button
                              type="button"
                              className="block w-full px-3.5 py-2 text-left text-[13px] text-[#2d2d2d] hover:bg-[#f6f6f6]"
                              onClick={() => {
                                setNationality(country.name);
                                setNationalityQuery(country.name);
                                setShowCountryList(false);
                              }}
                            >
                              {country.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div>
                    <label
                      className="mb-1.5 block text-[12.5px] font-medium text-[#2d2d2d]"
                      htmlFor="dob"
                    >
                      Date of birth
                    </label>
                    <input
                      className="h-[42px] w-full rounded-[8px] border border-[#e2e2e2] bg-white px-3.5 text-[13px] text-gray-800 transition focus:border-black focus:outline-none focus:ring-0 disabled:opacity-60"
                      id="dob"
                      name="dob"
                      type="date"
                      value={dob}
                      disabled={isLoading}
                      onChange={(event) => setDob(event.target.value)}
                    />
                  </div>

                  <div>
                    <button
                      className="flex h-[44px] w-full cursor-pointer items-center justify-center rounded-[9px] bg-black text-[13.5px] font-semibold tracking-tight text-white shadow-sm transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? "Saving…" : "Continue"}
                    </button>
                    {errorMsg ? (
                      <p className="mt-2 text-center text-[12px] text-[#ba1a1a]">
                        {errorMsg}
                      </p>
                    ) : (
                      <p className="mt-2 text-center text-[12px] text-[#525252]">
                        Personal account · Individual
                      </p>
                    )}
                  </div>
                </form>
              </>
            )}

            {step === "handle" && (
              <>
                <div className="mb-6">
                  <h2 className="font-aeonik-medium text-[22px] font-medium leading-[1.25] tracking-tight text-[#141414]">
                    Choose a handle
                  </h2>
                  <p className="mt-0.5 text-[13px] text-[#525252]">
                    This is your unique username on Pintree.
                  </p>
                </div>

                <form
                  className="space-y-4"
                  method="POST"
                  onSubmit={handleCreateHandle}
                >
                  <div>
                    <label
                      className="mb-1.5 block text-[12.5px] font-medium text-[#2d2d2d]"
                      htmlFor="handleId"
                    >
                      Handle
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] text-[#a1a1aa]">
                        @
                      </span>
                      <input
                        className="h-[42px] w-full rounded-[8px] border border-[#e2e2e2] bg-white py-0 pl-8 pr-3.5 text-[13px] text-gray-800 placeholder-[#a1a1aa] transition focus:border-black focus:outline-none focus:ring-0 disabled:opacity-60"
                        id="handleId"
                        name="handleId"
                        type="text"
                        autoComplete="username"
                        placeholder="jane_doe"
                        value={handleId}
                        disabled={isLoading}
                        onChange={(event) =>
                          setHandleId(
                            event.target.value
                              .toLowerCase()
                              .replace(/\s+/g, "_")
                              .replace(/[^a-z0-9_]/g, "")
                          )
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      className="flex h-[44px] w-full cursor-pointer items-center justify-center rounded-[9px] bg-black text-[13.5px] font-semibold tracking-tight text-white shadow-sm transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? "Saving…" : "Finish"}
                    </button>
                    {errorMsg ? (
                      <p className="mt-2 text-center text-[12px] text-[#ba1a1a]">
                        {errorMsg}
                      </p>
                    ) : (
                      <p className="mt-2 text-center text-[12px] text-[#525252]">
                        Letters, numbers, and underscores only
                      </p>
                    )}
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Section1;
