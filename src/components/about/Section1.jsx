"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
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
    localStorage.setItem("pintree_signup_pending", "password");

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

function passwordChecks(value) {
  return {
    length: value.length >= 8,
    cases: /[a-z]/.test(value) && /[A-Z]/.test(value),
    number: /\d/.test(value),
    special: /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/~`]/.test(value),
  };
}

function passwordStrength(value) {
  const met = Object.values(passwordChecks(value)).filter(Boolean).length;
  if (!value) return { label: "Weak", color: "#777777", filled: 0 };
  if (met <= 1) return { label: "Weak", color: "#E53935", filled: 1 };
  if (met === 2) return { label: "Fair", color: "#FB8C00", filled: 2 };
  if (met === 3) return { label: "Strong", color: "#4CAF70", filled: 3 };
  return { label: "Very strong", color: "#4CAF70", filled: 4 };
}

function PasswordRequirement({ met, children }) {
  return (
    <li className="flex items-center gap-2.5">
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-full transition-all ${
          met ? "bg-[#4CAF70] text-white" : "bg-[#F7F7F7] text-[#777777]"
        }`}
      >
        <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
      <span className={met ? "text-xs font-medium text-[#202020]" : "text-xs text-[#525252]"}>
        {children}
      </span>
    </li>
  );
}

const FALLBACK_GENDERS = ["Male", "Female", "Non-binary", "Prefer not to say"];

function formatDobInput(value) {
  const digits = String(value || "")
    .replace(/\D/g, "")
    .slice(0, 8);
  if (digits.length >= 5) {
    return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`;
  }
  if (digits.length >= 3) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  return digits;
}

function dobDisplayToIso(value) {
  const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value);
  if (!match) return "";
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return "";
  }
  return `${match[3]}-${match[2]}-${match[1]}`;
}

const RESERVED_HANDLES = ["admin", "pintree", "root", "support"];

function handleFeedback(value) {
  const handle = value.trim();
  if (!handle) return { tone: "empty", message: "Please enter a username" };
  if (!/^[a-zA-Z0-9_]+$/.test(handle)) {
    return { tone: "invalid", message: "Letters, numbers, and underscores only" };
  }
  if (RESERVED_HANDLES.includes(handle.toLowerCase())) {
    return { tone: "taken", message: "Username is unavailable" };
  }
  return { tone: "ok", message: "Username is available" };
}

function isoToDobDisplay(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return "";
  return `${match[3]}-${match[2]}-${match[1]}`;
}

const SIGNUP_STEPS = [
  { id: "contact", label: "Account" },
  { id: "otp", label: "Verification" },
  { id: "password", label: "Password" },
  { id: "profile", label: "Profile" },
  { id: "handle", label: "Username" },
];

function formatContactLabel(contactFields) {
  if (!contactFields) return "";
  if (contactFields.email) return contactFields.email;
  const digits = String(contactFields.mobileNumber || "").replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    const local = digits.slice(2);
    return `+91 ${local.slice(0, 5)} ${local.slice(5)}`;
  }
  return contactFields.mobileNumber || "";
}

function OtpBoxes({ value, onChange, disabled }) {
  const refs = useRef([]);
  const digits = Array.from({ length: 6 }, (_, index) => value[index] || "");

  function focusAt(index) {
    refs.current[Math.max(0, Math.min(index, 5))]?.focus();
  }

  return (
    <div className="grid grid-cols-6 gap-2 sm:gap-3">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(node) => {
            refs.current[index] = node;
          }}
          aria-label={`Digit ${index + 1}`}
          autoComplete={index === 0 ? "one-time-code" : "off"}
          className="h-12 w-full rounded-xl border border-[#E5E5E5] bg-white text-center text-xl font-semibold text-[#202020] outline-none transition-colors focus:border-[#202020] focus:ring-1 focus:ring-[#202020] disabled:opacity-60 sm:h-14 sm:text-2xl"
          disabled={disabled}
          id={`otp-${index}`}
          inputMode="numeric"
          maxLength={1}
          type="text"
          value={digit}
          onChange={(event) => {
            const raw = event.target.value.replace(/\D/g, "");
            if (!raw) {
              const next = digits.slice();
              next[index] = "";
              onChange(next.join(""));
              return;
            }
            if (raw.length > 1) {
              const pasted = raw.slice(0, 6);
              onChange(pasted);
              focusAt(Math.min(pasted.length, 5));
              return;
            }
            const next = digits.slice();
            next[index] = raw;
            onChange(next.join(""));
            if (index < 5) focusAt(index + 1);
          }}
          onKeyDown={(event) => {
            if (event.key === "Backspace" && !digits[index] && index > 0) {
              const next = digits.slice();
              next[index - 1] = "";
              onChange(next.join(""));
              focusAt(index - 1);
            } else if (event.key === "ArrowLeft" && index > 0) {
              focusAt(index - 1);
            } else if (event.key === "ArrowRight" && index < 5) {
              focusAt(index + 1);
            }
          }}
          onPaste={(event) => {
            event.preventDefault();
            const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
            if (!pasted) return;
            onChange(pasted);
            focusAt(Math.min(pasted.length, 5));
          }}
        />
      ))}
    </div>
  );
}

function SignupStepper({ step }) {
  const index = Math.max(
    0,
    SIGNUP_STEPS.findIndex((item) => item.id === step),
  );
  const current = SIGNUP_STEPS[index];

  return (
    <div className="mt-8 flex flex-col items-center justify-center">
      <div className="flex items-center justify-center">
        {SIGNUP_STEPS.map((item, itemIndex) => (
          <span key={item.id} className="flex items-center">
            {itemIndex > 0 ? <span className="h-[1.5px] w-6 bg-[#E5E5E5]" /> : null}
            {itemIndex < index ? (
              <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-[#202020]">
                <svg className="h-2 w-2 text-white" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
            ) : itemIndex === index ? (
              <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-[#202020] bg-[#CAFFA6]">
                <span className="h-1 w-1 rounded-full bg-[#202020]" />
              </span>
            ) : (
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#E5E5E5]" />
            )}
          </span>
        ))}
      </div>
      <p className="mt-3 text-center text-[12px] font-medium tracking-normal text-[#777777]">
        Step {index + 1} of 5 · {current.label}
      </p>
    </div>
  );
}

function Section1({ variant = "hero" }) {
  const router = useRouter();
  const [step, setStep] = useState("contact");
  const [contact, setContact] = useState("");
  const phoneMode =
    isPhoneContact(contact) ||
    (contact.length > 0 && /^[\d+\s-]*$/.test(contact));
  const [contactFields, setContactFields] = useState(null);
  const [otp, setOtp] = useState("");
  const [resendSeconds, setResendSeconds] = useState(0);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [nationality, setNationality] = useState("");
  const [nationalityQuery, setNationalityQuery] = useState("");
  const [showCountryList, setShowCountryList] = useState(false);
  const [dob, setDob] = useState("");
  const [dobText, setDobText] = useState("");
  const [handleId, setHandleId] = useState("");
  const countryWrapRef = useRef(null);
  const nativeDateRef = useRef(null);
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
    setDobText("");
    setErrorMsg("");
    setSuccessMsg("");
    setStep("profile");
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const pending = localStorage.getItem("pintree_signup_pending");
    const token = localStorage.getItem("pintree_access_token");
    if (!token) return;
    if (pending !== "password" && pending !== "profile" && pending !== "handle") {
      return;
    }

    const email = localStorage.getItem("pintree_user_email") || "";
    const phone = localStorage.getItem("pintree_user_phone") || "";
    setContactFields({
      email: email || undefined,
      mobileNumber: phone || undefined,
    });
    if (pending === "profile" || pending === "handle") {
      setFullName(localStorage.getItem("pintree_user_full_name") || "");
    }
    setStep(pending);
  }, []);

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
        return false;
      }

      setSuccessMsg(
        (typeof data?.message === "string" && data.message) || "OTP resent"
      );
      return true;
    } catch {
      setErrorMsg("Could not resend OTP. Please try again.");
      return false;
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
      localStorage.setItem("pintree_signup_pending", "profile");

      setFullName("");
      setGender("");
      setNationality("");
      setNationalityQuery("");
      setDob("");
      setDobText("");
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

    const trimmedName = fullName.trim().replace(/\s+/g, " ");
    const [givenName = "", ...familyNames] = trimmedName.split(" ");

    if (!givenName) {
      setErrorMsg("Please enter your first name.");
      return;
    }
    if (familyNames.join("").length === 0) {
      setErrorMsg("Please enter your surname.");
      return;
    }
    if (!trimmedName) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (dobText && !dob) {
      setErrorMsg("Please enter a valid date of birth.");
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
      localStorage.setItem("pintree_signup_pending", "handle");

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

    const rawHandle = handleId.trim();
    const feedback = handleFeedback(rawHandle);
    if (feedback.tone !== "ok") {
      setErrorMsg(feedback.message);
      return;
    }

    const normalized = rawHandle
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
      localStorage.removeItem("pintree_signup_pending");
      setStep("done");
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
    setDobText("");
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

  const isPage = variant === "page";
  const useSignupCard =
    isPage ||
    step === "password" ||
    step === "profile" ||
    step === "handle" ||
    step === "done";

  useEffect(() => {
    if (!isPage || step !== "otp") return;
    setResendSeconds(30);
  }, [isPage, step]);

  useEffect(() => {
    if (step !== "profile" || !showCountryList) return undefined;
    const onPointerDown = (event) => {
      if (!countryWrapRef.current?.contains(event.target)) {
        setShowCountryList(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [step, showCountryList]);

  useEffect(() => {
    if (step !== "done") return undefined;
    const timer = setTimeout(() => {
      router.push("/account");
    }, 5000);
    return () => clearTimeout(timer);
  }, [step, router]);

  useEffect(() => {
    if (resendSeconds <= 0) return undefined;
    const timer = setTimeout(() => {
      setResendSeconds((current) => current - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [resendSeconds]);

  const welcomeName =
    fullName.trim() ||
    (typeof window !== "undefined" ? localStorage.getItem("pintree_user_full_name") || "" : "");
  const welcomeHandle =
    handleId.trim() ||
    (typeof window !== "undefined" ? localStorage.getItem("pintree_user_handle") || "" : "");

  return (
    <main
      className={
        useSignupCard
          ? "mx-auto flex w-full max-w-[1536px] flex-col items-center justify-center px-4 py-12 font-jakarta sm:px-8 md:px-16 md:py-20 lg:px-32"
          : "mx-auto w-full max-w-[1340px] flex-1 px-8 pb-20 pt-16 font-jakarta lg:pt-20"
      }
    >
      <div
        className={
          useSignupCard
            ? "flex w-full max-w-[1280px] flex-col items-center justify-center"
            : "grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16"
        }
      >
        {!useSignupCard && (
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
                href="https://play.google.com/store/apps/details?id=com.mcabee.pintree&pcampaignid=web_share"
                target="_blank"
                rel="noopener noreferrer"
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
        )}

        <div
          className={
            useSignupCard
              ? "flex w-full flex-col items-center"
              : "flex justify-center lg:col-span-5 lg:justify-end"
          }
        >
          <div
            className={
              useSignupCard
                ? "w-full max-w-[440px] rounded-2xl border border-[#E5E5E5] bg-white p-7 sm:p-9"
                : "w-full max-w-[400px] rounded-[20px] border border-[#e5e5e5] bg-white p-7 shadow-[0_2px_12px_rgba(0,0,0,0.02)] md:p-8"
            }
          >
            {step === "contact" && (
              <>
                <header className={isPage ? "mb-7 text-left" : "mb-6"}>
                  {isPage ? (
                    <h1 className="mb-2 text-[28px] font-semibold leading-tight tracking-tight text-[#202020]">
                      Join Pintree
                    </h1>
                  ) : (
                    <h2 className="font-aeonik-medium text-[22px] font-medium leading-[1.25] tracking-tight text-[#141414]">
                      Join Pintree
                    </h2>
                  )}
                  <p
                    className={
                      isPage
                        ? "text-[15px] font-normal leading-relaxed text-[#666666]"
                        : "mt-0.5 text-[13px] text-[#525252]"
                    }
                  >
                    Create your space. Find your people.
                  </p>
                </header>

                <form
                  className="space-y-4"
                  method="POST"
                  onSubmit={handleCreateAccount}
                >
                  <div>
                    <label
                      className={
                        isPage
                          ? "mb-1.5 block text-[13px] font-medium text-[#202020]"
                          : "mb-1.5 block text-[12.5px] font-medium text-[#2d2d2d]"
                      }
                      htmlFor="contact"
                    >
                      Email address or phone number
                    </label>
                    <div
                      className={`flex w-full items-center border bg-white transition ${
                        isPage
                          ? "h-12 rounded-xl border-[#E5E5E5] focus-within:border-[#202020] focus-within:shadow-[0_0_0_1px_#202020]"
                          : "h-[42px] rounded-[8px] border-[#e2e2e2] focus-within:border-black"
                      } ${isLoading ? "opacity-60" : ""}`}
                    >
                      {phoneMode ? (
                        <span className="pointer-events-none shrink-0 pl-3.5 text-[13px] font-medium leading-none text-[#2d2d2d]">
                          +91
                        </span>
                      ) : null}
                      <input
                        className={`h-full min-w-0 flex-1 bg-transparent focus:outline-none focus:ring-0 disabled:cursor-not-allowed ${
                          isPage
                            ? "text-[14px] text-[#202020] placeholder-[#777777]"
                            : "text-[13px] text-gray-800 placeholder-[#a1a1aa]"
                        } ${phoneMode ? "pl-2 pr-4" : isPage ? "px-4" : "px-3.5"}`}
                        id="contact"
                        name="contact"
                        placeholder={
                          phoneMode ? "9876543210" : "you@example.com or mobile"
                        }
                        type={phoneMode ? "tel" : "text"}
                        inputMode={phoneMode ? "numeric" : undefined}
                        maxLength={phoneMode ? 10 : undefined}
                        value={
                          phoneMode ? normalizeIndianMobile(contact) : contact
                        }
                        disabled={isLoading}
                        onChange={(event) => {
                          const next = event.target.value;
                          if (
                            phoneMode ||
                            (next.length > 0 &&
                              /^[\d+\s-]+$/.test(next) &&
                              !next.includes("@"))
                          ) {
                            const digits = normalizeIndianMobile(next);
                            setContact(digits ? `+91${digits}` : "");
                            return;
                          }
                          setContact(next);
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      className={`flex w-full cursor-pointer items-center justify-center bg-black font-semibold text-white transition hover:bg-[#1a1a1a] disabled:cursor-not-allowed disabled:opacity-60 ${
                        isPage
                          ? "h-12 rounded-xl text-[14px]"
                          : "h-[44px] rounded-[9px] text-[13.5px] tracking-tight shadow-sm hover:bg-neutral-800"
                      }`}
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
                      <p
                        className={`mt-2.5 text-center ${
                          isPage ? "text-[13px] text-[#777777]" : "text-[12px] text-[#525252]"
                        }`}
                      >
                        We&apos;ll send an OTP for verification
                      </p>
                    )}
                  </div>

                  <div className={`relative flex items-center justify-center ${isPage ? "py-3" : "my-3"}`}>
                    <div className={`w-full border-t ${isPage ? "border-[#E5E5E5]" : "border-[#f0f0f0]"}`} />
                    <span
                      className={`absolute bg-white px-3 tracking-wider ${
                        isPage
                          ? "text-[12px] font-semibold uppercase text-[#777777]"
                          : "text-[11px] uppercase text-[#737373]"
                      }`}
                    >
                      {isPage ? "OR" : "or"}
                    </span>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={handleGoogleSignUp}
                      disabled={isLoading}
                      className={`flex w-full cursor-pointer items-center justify-center border bg-white font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
                        isPage
                          ? "h-12 gap-3 rounded-xl border-[#E5E5E5] text-[14px] text-[#202020] hover:bg-[#F7F7F7]"
                          : "h-[42px] gap-2.5 rounded-[9px] border-[#e2e2e2] text-[13px] text-[#2d2d2d] shadow-sm hover:bg-[#f6f6f6]"
                      }`}
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

                  <p
                    className={`px-1 text-center leading-relaxed ${
                      isPage
                        ? "pt-1 text-[12px] text-[#777777]"
                        : "pt-1 text-[11px] leading-[1.4] text-[#525252]"
                    }`}
                  >
                    By signing up, you agree to our{" "}
                    <Link
                      className={
                        isPage
                          ? "text-[#202020] underline underline-offset-2 hover:text-black"
                          : "text-[#737373] underline hover:text-black"
                      }
                      href="/terms-of-service"
                    >
                      Terms of Use
                    </Link>{" "}
                    and{" "}
                    <Link
                      className={
                        isPage
                          ? "text-[#202020] underline underline-offset-2 hover:text-black"
                          : "text-[#737373] underline hover:text-black"
                      }
                      href="/privacy-policy"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>

                  <div
                    className={`text-center ${
                      isPage
                        ? "mt-7 border-t border-[#E5E5E5] pt-6"
                        : "border-t border-[#f0f0f0] pt-4"
                    }`}
                  >
                    <p
                      className={
                        isPage
                          ? "mb-3 text-[13px] font-medium text-[#666666]"
                          : "text-[12.5px] text-[#525252]"
                      }
                    >
                      Creating a professional or public account?
                    </p>
                    <Link
                      className={`flex w-full cursor-pointer items-center justify-center gap-1.5 border font-semibold text-[#202020] transition ${
                        isPage
                          ? "mt-0 h-11 rounded-xl border-[#E8E8E8] bg-[#F6F6F6] text-[13px] hover:bg-[#EFEFEF]"
                          : "mt-2 h-[42px] rounded-[9px] border-[#E8E8E8] bg-[#F6F6F6] text-[13px] text-[#2d2d2d] hover:bg-[#ececec]"
                      }`}
                      href="/contact"
                    >
                      Let&apos;s get started
                      {isPage ? (
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      ) : null}
                    </Link>
                  </div>
                </form>
              </>
            )}

            {step === "otp" && isPage && (
              <>
                <div className="mb-6">
                  <h1 className="font-aeonik-regular mb-2.5 text-[28px] font-normal leading-[34px] tracking-tight text-[#202020] sm:leading-[36px]">
                    Verify your account
                  </h1>
                  <p className="text-[15px] font-normal text-[#525252]">
                    We&apos;ve sent a verification code to your registered contact.
                  </p>
                </div>
                <div className="mb-6 flex w-full items-center justify-between rounded-xl border border-[#E8E8E8] bg-[#F6F6F6] px-3.5 py-2.5">
                  <div className="flex min-w-0 items-center gap-2">
                    {contactFields?.email ? (
                      <svg className="h-[18px] w-[18px] shrink-0 text-[#777777]" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5l9 6 9-6" />
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                      </svg>
                    ) : (
                      <svg className="h-[18px] w-[18px] shrink-0 text-[#777777]" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden>
                        <rect x="7" y="2.5" width="10" height="19" rx="2" />
                        <path strokeLinecap="round" d="M11 18.5h2" />
                      </svg>
                    )}
                    <span className="truncate text-sm font-medium text-[#202020]">
                      {formatContactLabel(contactFields)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleChangeContact}
                    disabled={isLoading}
                    className="ml-3 shrink-0 text-[13px] font-medium text-[#202020] underline transition-colors hover:text-black disabled:opacity-60"
                  >
                    Edit
                  </button>
                </div>
                <form className="space-y-6" method="POST" onSubmit={handleVerifyOtp}>
                  <div>
                    <label className="mb-2.5 block text-[13px] font-normal text-[#777777]" htmlFor="otp-0">
                      Secure verification code
                    </label>
                    <OtpBoxes value={otp} onChange={setOtp} disabled={isLoading} />
                  </div>
                  <div className="flex items-center justify-between border-t border-[#F7F7F7] pt-1 text-[13px]">
                    <span className="font-normal text-[#777777]">Didn&apos;t receive the code?</span>
                    <div className="text-right">
                      {resendSeconds > 0 ? (
                        <span className="font-medium tracking-tight text-[#777777]">
                          Resend code in{" "}
                          <span className="font-semibold tabular-nums text-[#202020]">
                            00:{String(resendSeconds).padStart(2, "0")}
                          </span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="font-medium text-[#202020] underline transition-colors hover:text-black disabled:opacity-60"
                          disabled={isLoading}
                          onClick={async () => {
                            const sent = await handleResendOtp();
                            if (sent) setResendSeconds(30);
                          }}
                        >
                          Resend Code
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      className="flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-black text-sm font-semibold text-white transition-all hover:bg-[#1a1a1a] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? "Verifying..." : "Verify & Continue"}
                    </button>
                    {errorMsg ? (
                      <p className="mt-3 text-center text-[12px] leading-4 text-[#ba1a1a]">{errorMsg}</p>
                    ) : successMsg ? (
                      <p className="mt-3 text-center text-[12px] leading-4 text-[#3d6922]">{successMsg}</p>
                    ) : (
                      <p className="mt-3 text-center text-[12px] font-normal leading-4 text-[#777777]">
                        Enter the six-digit code to continue.
                      </p>
                    )}
                  </div>
                </form>
              </>
            )}

            {step === "otp" && !isPage && (
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
                <div className="mb-8">
                  <h1 className="font-aeonik-regular mb-2 text-[28px] font-normal leading-tight tracking-tight text-[#202020]">
                    Create a password
                  </h1>
                  <p className="text-[15px] font-normal leading-relaxed text-[#525252]">
                    Choose a password for your Pintree account.
                  </p>
                </div>
                <form className="space-y-6" method="POST" onSubmit={handleCreatePassword}>
                  <div>
                    <label className="mb-2 block text-[13px] font-medium text-[#202020]" htmlFor="signup-password">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="signup-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="At least 8 characters"
                        value={password}
                        disabled={isLoading}
                        onChange={(event) => setPassword(event.target.value)}
                        className="h-12 w-full rounded-xl border border-[#E5E5E5] bg-white px-4 pr-16 text-[14px] font-medium text-[#202020] placeholder-[#777777] transition-colors focus:border-[#202020] focus:outline-none disabled:opacity-60"
                      />
                      <button
                        type="button"
                        className="absolute right-0 top-0 flex h-full items-center px-4 text-[13px] font-medium uppercase tracking-wide text-[#666666] transition-colors hover:text-[#202020]"
                        onClick={() => setShowPassword((current) => !current)}
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    <div className="mt-3">
                      <div className="mb-1.5 flex items-center justify-between text-xs">
                        <span className="font-medium text-[#777777]">Password strength</span>
                        <span className="font-semibold transition-colors" style={{ color: passwordStrength(password).color }}>
                          {passwordStrength(password).label}
                        </span>
                      </div>
                      <div className="grid h-1.5 w-full grid-cols-4 gap-1.5">
                        {Array.from({ length: 4 }, (_, index) => {
                          const strength = passwordStrength(password);
                          const active = index < strength.filled;
                          return (
                            <div
                              key={index}
                              className="h-full rounded-full transition-colors duration-300"
                              style={{ backgroundColor: active ? strength.color : "#E5E5E5" }}
                            />
                          );
                        })}
                      </div>
                    </div>
                    <div className="mt-4 border-t border-[#F7F7F7] pt-3">
                      <p className="mb-2.5 text-xs font-medium uppercase tracking-wider text-[#666666]">
                        Password requirements
                      </p>
                      <ul className="space-y-2">
                        <PasswordRequirement met={passwordChecks(password).length}>
                          At least 8 characters
                        </PasswordRequirement>
                        <PasswordRequirement met={passwordChecks(password).cases}>
                          Include uppercase and lowercase letters
                        </PasswordRequirement>
                        <PasswordRequirement met={passwordChecks(password).number}>
                          Include a number
                        </PasswordRequirement>
                        <PasswordRequirement met={passwordChecks(password).special}>
                          Include a special character
                        </PasswordRequirement>
                      </ul>
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-[13px] font-medium text-[#202020]" htmlFor="signup-confirm-password">
                      Confirm password
                    </label>
                    <div className="relative">
                      <input
                        id="signup-confirm-password"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Re-enter password"
                        value={confirmPassword}
                        disabled={isLoading}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        className={`h-12 w-full rounded-xl border bg-white px-4 pr-16 text-[14px] font-medium text-[#202020] placeholder-[#777777] transition-colors focus:border-[#202020] focus:outline-none disabled:opacity-60 ${
                          confirmPassword && confirmPassword !== password
                            ? "border-red-500"
                            : "border-[#E5E5E5]"
                        }`}
                      />
                      <button
                        type="button"
                        className="absolute right-0 top-0 flex h-full items-center px-4 text-[13px] font-medium uppercase tracking-wide text-[#666666] transition-colors hover:text-[#202020]"
                        onClick={() => setShowConfirmPassword((current) => !current)}
                        aria-label="Toggle confirm password visibility"
                      >
                        {showConfirmPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    {confirmPassword && confirmPassword !== password ? (
                      <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-600">
                        <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Passwords do not match.</span>
                      </p>
                    ) : null}
                  </div>
                  {errorMsg ? (
                    <p className="text-center text-[12px] text-[#ba1a1a]">{errorMsg}</p>
                  ) : null}
                  <button
                    type="submit"
                    disabled={
                      isLoading ||
                      !Object.values(passwordChecks(password)).every(Boolean) ||
                      password !== confirmPassword
                    }
                    className="flex h-12 w-full items-center justify-center rounded-xl bg-black text-[14px] font-semibold text-white transition-all hover:bg-[#202020] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    {isLoading ? "Saving…" : "Continue"}
                  </button>
                </form>
              </>
            )}

            {step === "profile" && (
              <>
                <div className="mb-7">
                  <h1 className="font-aeonik-regular text-[28px] font-normal leading-tight tracking-[-0.02em] text-[#202020]">
                    Tell us about you
                  </h1>
                  <p className="mt-2 text-[15px] font-normal leading-relaxed text-[#525252]">
                    A few details to complete your Pintree profile.
                  </p>
                </div>
                <form className="space-y-5" method="POST" onSubmit={handleCompleteProfile}>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-[13px] font-medium text-[#202020]" htmlFor="first-name">
                        First name
                      </label>
                      <input
                        id="first-name"
                        name="fullName"
                        type="text"
                        autoComplete="given-name"
                        placeholder="Jane"
                        value={fullName.split(" ")[0] || ""}
                        disabled={isLoading}
                        onChange={(event) => {
                          const familyName = fullName.split(" ").slice(1).join(" ");
                          const nextFirst = event.target.value;
                          setFullName(familyName ? `${nextFirst} ${familyName}` : nextFirst);
                        }}
                        className="h-12 w-full rounded-xl border border-[#E5E5E5] bg-white px-4 text-[14px] font-normal text-[#202020] placeholder-[#777777] transition-colors focus:border-[#202020] focus:outline-none focus:ring-1 focus:ring-[#202020] disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-[13px] font-medium text-[#202020]" htmlFor="surname">
                        Surname
                      </label>
                      <input
                        id="surname"
                        name="fullName"
                        type="text"
                        autoComplete="family-name"
                        placeholder="Doe"
                        value={fullName.split(" ").slice(1).join(" ")}
                        disabled={isLoading}
                        onChange={(event) => {
                          const givenName = fullName.split(" ")[0] || "";
                          const nextSurname = event.target.value;
                          setFullName(nextSurname ? `${givenName} ${nextSurname}` : givenName);
                        }}
                        className="h-12 w-full rounded-xl border border-[#E5E5E5] bg-white px-4 text-[14px] font-normal text-[#202020] placeholder-[#777777] transition-colors focus:border-[#202020] focus:outline-none focus:ring-1 focus:ring-[#202020] disabled:opacity-60"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-[13px] font-medium text-[#202020]" htmlFor="gender">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={gender}
                      disabled={isLoading}
                      onChange={(event) => setGender(event.target.value)}
                      className={`h-12 w-full cursor-pointer appearance-none rounded-xl border border-[#E5E5E5] bg-white px-4 pr-10 text-[14px] font-normal transition-colors focus:border-[#202020] focus:outline-none focus:ring-1 focus:ring-[#202020] disabled:opacity-60 ${
                        gender ? "text-[#202020]" : "text-[#777777]"
                      }`}
                      style={{
                        backgroundImage:
                          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666666' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 1rem center",
                        backgroundSize: "1.125rem",
                      }}
                    >
                      <option value="" disabled>
                        Select gender
                      </option>
                      {(genders.length ? genders : FALLBACK_GENDERS).map((item) => (
                        <option key={item} value={item} className="text-[14px] font-normal text-[#202020]">
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-[13px] font-medium text-[#202020]" htmlFor="dob">
                      Date of birth
                    </label>
                    <div className="relative flex items-center">
                      <input
                        id="dob"
                        name="dob"
                        type="text"
                        inputMode="numeric"
                        autoComplete="bday"
                        placeholder="dd-mm-yyyy"
                        maxLength={10}
                        value={dobText}
                        disabled={isLoading}
                        onChange={(event) => {
                          const next = formatDobInput(event.target.value);
                          setDobText(next);
                          setDob(dobDisplayToIso(next));
                        }}
                        className="h-12 w-full rounded-xl border border-[#E5E5E5] bg-white px-4 pr-11 text-[15px] text-[#202020] placeholder-[#777777] transition-colors focus:border-[#202020] focus:outline-none focus:ring-1 focus:ring-[#202020] disabled:opacity-60"
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        aria-label="Open calendar picker"
                        className="absolute right-3.5 p-1 text-[#666666] transition-colors hover:text-[#202020]"
                        onClick={() => {
                          const picker = nativeDateRef.current;
                          if (!picker) return;
                          if (typeof picker.showPicker === "function") {
                            try {
                              picker.showPicker();
                              return;
                            } catch {
                              picker.click();
                              return;
                            }
                          }
                          picker.click();
                        }}
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                          <rect x="3" y="4" width="18" height="18" rx="3" ry="3" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                          <circle cx="8" cy="14" r="1" fill="currentColor" />
                          <circle cx="12" cy="14" r="1" fill="currentColor" />
                          <circle cx="16" cy="14" r="1" fill="currentColor" />
                          <circle cx="8" cy="18" r="1" fill="currentColor" />
                          <circle cx="12" cy="18" r="1" fill="currentColor" />
                        </svg>
                      </button>
                      <input
                        ref={nativeDateRef}
                        type="date"
                        tabIndex={-1}
                        className="sr-only"
                        value={dob}
                        onChange={(event) => {
                          const iso = event.target.value;
                          setDob(iso);
                          setDobText(isoToDobDisplay(iso));
                        }}
                      />
                    </div>
                  </div>
                  <div ref={countryWrapRef} className="relative">
                    <label className="mb-2 block text-[13px] font-medium text-[#202020]" htmlFor="nationality-search">
                      Nationality
                    </label>
                    <div className="relative flex items-center">
                      <input
                        id="nationality-search"
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
                        className="h-12 w-full rounded-xl border border-[#E5E5E5] bg-white px-4 pr-10 text-[14px] font-normal text-[#202020] placeholder-[#777777] transition-colors focus:border-[#202020] focus:outline-none focus:ring-1 focus:ring-[#202020] disabled:opacity-60"
                      />
                      <button
                        type="button"
                        aria-label="Toggle country list"
                        className="absolute right-3.5 p-1 text-[#666666] transition-colors hover:text-[#202020]"
                        onClick={() => setShowCountryList((open) => !open)}
                      >
                        <svg
                          className={`h-4 w-4 transition-transform duration-200 ${showCountryList ? "rotate-180" : ""}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                          aria-hidden
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                    {showCountryList ? (
                      <div className="absolute left-0 right-0 z-30 mt-1.5 max-h-56 divide-y divide-[#F7F7F7] overflow-y-auto rounded-xl border border-[#E5E5E5] bg-white text-[14px] shadow-lg">
                        {filteredCountries.length === 0 ? (
                          <div className="px-4 py-3 text-center text-sm text-[#777777]">No countries found</div>
                        ) : (
                          filteredCountries.map((country) => (
                            <button
                              key={country.id || country.name}
                              type="button"
                              className="flex w-full items-center justify-between px-4 py-2.5 text-left text-[#202020] transition-colors hover:bg-[#F7F7F7] focus:bg-[#F7F7F7] focus:outline-none"
                              onClick={() => {
                                setNationality(country.name);
                                setNationalityQuery(country.name);
                                setShowCountryList(false);
                              }}
                            >
                              <span>{country.name}</span>
                            </button>
                          ))
                        )}
                      </div>
                    ) : null}
                  </div>
                  {errorMsg ? (
                    <p className="text-center text-[12px] text-[#ba1a1a]">{errorMsg}</p>
                  ) : null}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex h-12 w-full items-center justify-center rounded-xl bg-black text-[14px] font-semibold text-white transition-all hover:bg-[#202020] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isLoading ? "Saving…" : "Continue"}
                    </button>
                  </div>
                  <div className="pt-1 text-center">
                    <p className="text-[14px] font-normal text-[#666666]">Personal account · Individual</p>
                  </div>
                </form>
              </>
            )}

            {step === "handle" && (
              <>
                <div className="mb-6">
                  <h1 className="font-aeonik-regular mb-2 text-[28px] font-normal leading-9 tracking-tight text-[#202020]">
                    Choose a handle
                  </h1>
                  <p className="text-[15px] font-normal leading-[22px] text-[#525252]">
                    This is your unique username on Pintree.
                  </p>
                </div>
                <form method="POST" onSubmit={handleCreateHandle}>
                  <div className="space-y-2">
                    <label className="block text-[13px] font-medium text-[#202020]" htmlFor="handleId">
                      Handle
                    </label>
                    <div
                      className={`flex h-12 w-full items-center rounded-xl border bg-white transition-colors duration-150 ${
                        handleFeedback(handleId).tone === "invalid" || handleFeedback(handleId).tone === "taken"
                          ? "border-[#ba1a1a] focus-within:border-[#ba1a1a]"
                          : "border-[#E5E5E5] focus-within:border-[#202020]"
                      }`}
                    >
                      <span className="select-none pl-4 pr-1 text-[16px] font-medium text-[#525252]">@</span>
                      <input
                        id="handleId"
                        name="handleId"
                        type="text"
                        autoComplete="off"
                        spellCheck={false}
                        placeholder="jane_doe"
                        value={handleId}
                        disabled={isLoading}
                        onChange={(event) => {
                          setErrorMsg("");
                          setHandleId(event.target.value.toLowerCase());
                        }}
                        className="h-full w-full border-none bg-transparent pl-1 pr-4 text-[14px] font-medium text-[#202020] placeholder-[#7e7576] outline-none focus:ring-0 disabled:opacity-60"
                      />
                    </div>
                    {(() => {
                      const feedback = errorMsg
                        ? { tone: "taken", message: errorMsg }
                        : handleFeedback(handleId);
                      const toneClass =
                        feedback.tone === "ok"
                          ? "text-[#2e7d32]"
                          : feedback.tone === "empty"
                            ? "text-[#777777]"
                            : "text-[#ba1a1a]";
                      return (
                        <div className={`flex items-center gap-1.5 pt-1 ${toneClass}`}>
                          {feedback.tone === "ok" ? (
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1.1 14.2-3.6-3.6 1.4-1.4 2.2 2.2 4.4-4.4 1.4 1.4-5.8 5.8Z" />
                            </svg>
                          ) : feedback.tone === "taken" ? (
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm3.5 12.1-1.4 1.4L12 13.4l-2.1 2.1-1.4-1.4L10.6 12 8.5 9.9l1.4-1.4L12 10.6l2.1-2.1 1.4 1.4L13.4 12l2.1 2.1Z" />
                            </svg>
                          ) : (
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-2h2v2Zm0-4h-2V7h2v6Z" />
                            </svg>
                          )}
                          <span className="text-[12px] font-medium">{feedback.message}</span>
                        </div>
                      );
                    })()}
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading || handleFeedback(handleId).tone !== "ok"}
                    className="mb-3 mt-6 flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-black text-[14px] font-medium text-white transition-colors duration-150 hover:bg-[#202020] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    {isLoading ? "Saving…" : "Finish"}
                  </button>
                  <p className="text-center text-[13px] leading-5 text-[#525252]">
                    Letters, numbers, and underscores only
                  </p>
                </form>
              </>
            )}

            {step === "done" && (
              <div className="flex flex-col items-center text-center">
                <div
                  aria-label="Registration Successful"
                  className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[#CAFFA6]"
                >
                  <svg className="h-6 w-6 text-[#204654]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24" aria-hidden>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="mt-3 inline-flex items-center justify-center rounded-full bg-[#CAFFA6] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#204654]">
                  Account created
                </span>
                <h1 className="font-aeonik-regular mt-4 text-center text-[28px] font-normal leading-[1.3] tracking-tight text-[#202020]">
                  {welcomeName ? (
                    <>
                      Welcome to Pintree,
                      <br />
                      {welcomeName}!
                    </>
                  ) : (
                    "Welcome to Pintree"
                  )}
                </h1>
                <p className="mt-2.5 max-w-sm text-center text-[15px] leading-relaxed text-[#525252]">
                  Your account is ready. Your space, your people and new conversations are waiting for you.
                </p>
                <div className="my-6 flex w-full flex-col items-center justify-center rounded-xl border border-[#F0F0F0] bg-[#F7F7F7] p-4 text-center">
                  <span className="mb-1.5 block text-[11px] font-normal uppercase tracking-[0.1em] text-[#777777]">
                    Your Pintree identity
                  </span>
                  <span className="block text-[18px] font-semibold leading-tight tracking-tight text-[#0066CC]">
                    @{welcomeHandle}
                  </span>
                  <span className="mt-0.5 block text-[12px] text-[#666666]">Personal Account</span>
                </div>
                <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                  <a
                    href="https://play.google.com/store/apps/details?id=com.mcabee.pintree&pcampaignid=web_share"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-[52px] items-center justify-center gap-3 rounded-xl bg-black px-4 text-white transition-colors duration-150 hover:bg-[#202020] focus:outline-none focus:ring-2 focus:ring-[#202020] focus:ring-offset-2"
                  >
                    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M3.609 1.814L13.792 12 3.61 22.186a2.072 2.072 0 0 1-.61-1.472V3.286c0-.555.222-1.077.609-1.472zm11.242 11.245l2.42 2.42-12.01 6.842 9.59-9.262zm0-2.118L5.26 1.68l12.01 6.841-2.42 2.42zm1.488 1.487l3.208 1.826c.863.492.863 1.293 0 1.785l-3.208 1.827-2.063-2.063 2.063-2.063z" />
                    </svg>
                    <span className="flex flex-col text-left leading-tight">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-white/80">Get it on</span>
                      <span className="text-[14px] font-semibold tracking-tight text-white">Google Play</span>
                    </span>
                  </a>
                  <a
                    href="#"
                    className="flex h-[52px] items-center justify-center gap-3 rounded-xl bg-black px-4 text-white transition-colors duration-150 hover:bg-[#202020] focus:outline-none focus:ring-2 focus:ring-[#202020] focus:ring-offset-2"
                  >
                    <svg className="mb-0.5 h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8.93-2.85-.9.04-2 .6-2.65 1.35-.58.66-1.09 1.73-.95 2.76.99.08 2.04-.51 2.67-1.26z" />
                    </svg>
                    <span className="flex flex-col text-left leading-tight">
                      <span className="text-[10px] font-medium tracking-tight text-white/80">Download on the</span>
                      <span className="text-[14px] font-semibold tracking-tight text-white">App Store</span>
                    </span>
                  </a>
                </div>
                <p className="mt-4 text-[13px] text-[#777777]">Available on Android and iOS.</p>
              </div>
            )}
          </div>
          {useSignupCard && step !== "done" ? <SignupStepper step={step} /> : null}
        </div>
      </div>
    </main>
  );
}

export default Section1;
