"use client";

import { useEffect, useState } from "react";

const ASSET_01_PNG = "/media-kit/asset_01.png";
const ASSET_01_SVG = "/media-kit/asset_01.svg";

const ASSET_02_PNG = "/media-kit/asset_02.png";
const ASSET_02_SVG = "/media-kit/asset_02.svg";

const ASSET_03_PNG = "/media-kit/asset_03.png";
const ASSET_03_SVG = "/media-kit/asset_03.svg";

const ASSET_04_DARK_PNG = "/media-kit/asset_04.png";
const ASSET_04_DARK_SVG = "/media-kit/asset_04.svg";

const ASSET_04_LIGHT_PNG = "/media-kit/asset_04_light.png";
const ASSET_04_LIGHT_SVG = "/media-kit/asset_04_light.svg";

const MEDIA_KIT_ZIP = "/media-kit/pintree-media-kit.zip";

const FACTS = [
  ["Product", "Pintree"],
  ["A product of", "MCABEE DIGITAL"],
  ["Platform", "Social Networking"],
  ["Core Focus", "Social platform for people and communities"],
  ["Location", "Kerala, India"],
];

const EXPERIENCES = [
  ["People", "Create your personal profile, express who you are and connect with people through shared interests and meaningful relationships."],
  ["Communities", "Create or join communities built around shared interests, organizations and common goals. Share updates and participate with like-minded people."],
  ["Discovery", "Discover people, posts and communities beyond your existing network. Explore new interests and find conversations worth being part of."],
  ["Rooms", "Join focused discussion spaces within communities. Take part in structured conversations around specific topics and shared interests."],
  ["Connections", "Follow people, build mutual friendships and stay connected. Share personal moments with friends and selected circles."],
];

export const PRESS_MEDIA_TYPES = [
  { value: "DIGITAL_ONLINE_MEDIA", label: "Digital / Online Media" },
  { value: "PRINT_MEDIA", label: "Print Media (Newspaper / Magazine)" },
  { value: "BROADCAST_MEDIA_TELEVISION", label: "Broadcast Media – Television" },
  { value: "BROADCAST_MEDIA_RADIO", label: "Broadcast Media – Radio" },
  { value: "NEWS_AGENCY", label: "News Agency / Wire Service" },
  { value: "INDEPENDENT_MEDIA_JOURNALISTS", label: "Independent Journalist / Freelancer" },
  { value: "PODCAST_AUDIO_MEDIA", label: "Podcast / Audio Media" },
];

const grid =
  "bg-[linear-gradient(to_right,#EAEAEA_1px,transparent_1px),linear-gradient(to_bottom,#EAEAEA_1px,transparent_1px)] [background-size:32px_32px]";

function DownloadIcon({ accent = false }) {
  return (
    <svg className={`h-3.5 w-3.5 ${accent ? "text-[#CAFFA6]" : "text-[#777777]"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function FileLink({ href, fileName, children, solid = false }) {
  return (
    <a
      href={href}
      download={fileName}
      className={
        solid
          ? "inline-flex items-center gap-2 rounded-lg bg-[#202020] px-4 py-2.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-black"
          : "inline-flex items-center gap-2 rounded-lg border border-[#E5E5E5] bg-white px-4 py-2.5 text-xs font-medium text-[#202020] transition-colors hover:border-[#CCCCCC] hover:bg-[#F7F7F7]"
      }
    >
      <DownloadIcon accent={solid} />
      {children}
    </a>
  );
}

function IndiaMark() {
  return (
    <svg className="inline-block h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="#FFF7ED" stroke="#F97316" strokeWidth="1.5" />
      <path d="M8 15L12 8L16 15H8Z" fill="#16A34A" />
      <circle cx="12" cy="12" r="2" fill="#1D4ED8" />
    </svg>
  );
}

export default function PressMediaView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  const initialFormState = {
    mediaType: "DIGITAL_ONLINE_MEDIA",
    publicationName: "",
    contactName: "",
    designation: "",
    email: "",
    phoneNumber: "",
    subject: "",
    message: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleCopyReference = () => {
    const refId = submissionResult?.referenceId || submissionResult?.id;
    if (!refId) return;
    try {
      navigator.clipboard.writeText(refId).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    } catch (e) {}
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsSubmitted(false);
    setIsSubmitting(false);
    setSubmitError("");
    setSubmissionResult(null);
    setIsCopied(false);
  };

  const handleResetForm = () => {
    setFormData(initialFormState);
    setIsSubmitted(false);
    setIsSubmitting(false);
    setSubmitError("");
    setSubmissionResult(null);
    setIsCopied(false);
  };

  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleCloseModal();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [isModalOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!formData.mediaType) {
      setSubmitError("Please select a media type category.");
      return;
    }
    if (!formData.publicationName.trim()) {
      setSubmitError("Please enter your publication / media outlet name.");
      return;
    }
    if (!formData.contactName.trim()) {
      setSubmitError("Please enter the contact person's name.");
      return;
    }
    if (!formData.designation.trim()) {
      setSubmitError("Please enter your role / designation.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setSubmitError("Please enter a valid email address.");
      return;
    }
    if (!formData.subject.trim()) {
      setSubmitError("Please enter an enquiry subject.");
      return;
    }
    if (!formData.message.trim()) {
      setSubmitError("Please describe your enquiry in the message field.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      mediaType: formData.mediaType,
      publicationName: formData.publicationName.trim(),
      contactName: formData.contactName.trim(),
      designation: formData.designation.trim(),
      email: formData.email.trim(),
      phoneNumber: formData.phoneNumber.trim() || null,
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    };

    try {
      let res;
      try {
        res = await fetch("/api/support/press-enquiries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (proxyErr) {
        // Direct fallback to backend endpoint if local proxy is unavailable
        res = await fetch(
          "https://api.places.mcabee.in/v1/support/press-enquiries",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
      }

      const json = await res.json().catch(() => null);

      if (!res.ok || json?.status === "error") {
        const errorMsg =
          json?.message ||
          json?.error?.message ||
          "Failed to submit media enquiry. Please check your information and try again.";
        setSubmitError(errorMsg);
        setIsSubmitting(false);
        return;
      }

      const resultData = json?.data || {
        referenceId: `PRS-2026-${String(Math.floor(10000 + Math.random() * 90000))}`,
        status: "NEW",
        receivedAt: new Date().toISOString(),
      };

      setSubmissionResult(resultData);
      setIsSubmitted(true);
    } catch (err) {
      console.error("Press enquiry error:", err);
      setSubmitError(
        "Network connection error. Please verify your internet and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-[1536px] px-6 pb-32 pt-12 font-jakarta sm:px-12 md:px-16 md:pt-20 lg:px-24 xl:px-[128px]">
      <header className="mx-auto max-w-[1280px] border-b border-[#E5E5E5] pb-16 md:pb-24">
        <div className="mb-4 flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-[#204654]" />
          <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-[#777777]">
            Press & Media
          </span>
        </div>
        <h1 className="font-aeonik-regular mb-6 max-w-3xl text-4xl font-normal leading-[1.15] text-[#202020] sm:text-5xl md:text-[48px]">
          Pintree, at a glance.
        </h1>
        <div className="max-w-2xl space-y-2">
          <p className="text-base font-normal leading-relaxed text-[#666666] sm:text-lg">
            Discover Pintree, explore our story and access official brand resources, product information and media materials.
          </p>
          <p className="text-sm font-normal text-[#777777]">
            For media, publishing, partnerships and brand enquiries.
          </p>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3 pt-8">
          {[
            ["#about", "About Pintree", false],
            ["#brand-resources", "Brand Resources (Assets & Guidelines)", true],
            ["#platform", "The Platform Overview", false],
            ["#enquiries", "Media Enquiries", false],
          ].map(([href, label, active]) => (
            <a
              key={href}
              href={href}
              className={
                active
                  ? "inline-flex items-center gap-1.5 rounded-full bg-[#CAFFA6]/40 px-3.5 py-1.5 text-xs font-medium text-[#202020] transition-colors hover:bg-[#CAFFA6]"
                  : "inline-flex items-center gap-1.5 rounded-full bg-[#F7F7F7] px-3.5 py-1.5 text-xs font-medium text-[#666666] transition-colors hover:bg-[#EAEAEA] hover:text-[#202020]"
              }
            >
              {active ? <span className="h-1.5 w-1.5 rounded-full bg-[#204654]" /> : null}
              {label}
            </a>
          ))}
        </div>
      </header>

      <section id="about" className="mx-auto max-w-[1280px] scroll-mt-24 border-b border-[#E5E5E5] py-16 md:py-24">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-6 lg:col-span-7">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#777777]">
              01 / Overview
            </span>
            <h2 className="font-aeonik-regular text-2xl font-normal leading-[1.2] text-[#202020] sm:text-3xl md:text-[34px]">
              A social platform shaped by people
              <br />
              and communities.
            </h2>
            <div className="max-w-xl space-y-5 text-[16px] leading-relaxed text-[#525252]">
              <p>
                Pintree is a community-first social platform designed to bring people together through meaningful connections, shared interests and purposeful conversations. It creates a space where people can express themselves, discover new perspectives and become part of communities that matter to them.
              </p>
              <p>
                Built around five connected experiences — People, Communities, Discovery, Rooms and Connections — Pintree brings together personal identity, shared interests and focused conversations in one social environment.
              </p>
              <p>
                From connecting with individuals and participating in communities to exploring new conversations beyond your existing network, Pintree encourages a more meaningful and participatory way to experience social networking.
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-[#E5E5E5]/80 bg-[#F7F7F7] p-8 sm:p-9 lg:col-span-5">
            <div className="mb-6 border-b border-[#E5E5E5] pb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#777777]">
                Company & Product Facts
              </span>
            </div>
            <dl className="space-y-4 text-sm">
              {FACTS.map(([label, value]) => (
                <div key={label} className="flex items-baseline justify-between border-b border-[#E5E5E5]/60 pb-3">
                  <dt className="font-normal text-[#777777]">{label}</dt>
                  <dd className="max-w-[210px] text-right font-medium text-[#202020]">{value}</dd>
                </div>
              ))}
              <div className="flex items-baseline justify-between border-b border-[#E5E5E5]/60 pb-3">
                <dt className="font-normal text-[#777777]">Website</dt>
                <dd className="text-right font-medium text-[#202020]">
                  <a href="https://pintree.co" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
                    pintree.co
                    <svg className="h-3 w-3 text-[#777777]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </a>
                </dd>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <dt className="font-normal text-[#777777]">Recognition</dt>
                <dd className="flex flex-wrap items-center justify-end gap-1.5 text-right font-medium text-[#202020]">
                  <IndiaMark />
                  <span>Startup India – DPIIT Recognised</span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section id="brand-resources" className="mx-auto max-w-[1280px] scroll-mt-24 border-b border-[#E5E5E5] py-16 md:py-24">
        <div className="mb-14 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.14em] text-[#777777]">
              Brand Resources
            </span>
            <h2 className="font-aeonik-regular mb-4 text-3xl font-normal leading-[1.18] text-[#202020] sm:text-4xl md:text-[36px]">
              The Pintree identity.
            </h2>
            <p className="text-sm font-normal leading-relaxed text-[#666666] sm:text-base">
              Official Pintree logos, icons and brand resources. Download these assets when featuring Pintree in publications, articles, presentations and other media.
            </p>
          </div>
          <a
            href={MEDIA_KIT_ZIP}
            download="pintree-media-kit.zip"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#202020] px-5 py-3 text-xs font-medium text-white shadow-sm transition-colors hover:bg-black"
          >
            <DownloadIcon accent={true} />
            Download Media Kit (.ZIP)
          </a>
        </div>

        <div className="space-y-10">
          <article className="overflow-hidden rounded-xl border border-[#E5E5E5] bg-white transition-colors hover:border-[#CCCCCC]">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className={`relative flex min-h-[260px] items-center justify-center border-b border-[#E5E5E5] p-10 sm:min-h-[300px] sm:p-14 lg:col-span-7 lg:border-b-0 lg:border-r ${grid}`}>
                <span className="absolute left-4 top-4 rounded border border-[#E5E5E5]/80 bg-[#F7F7F7] px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-[#777777]">
                  White Surface • 1:1 Scale
                </span>
                <div className="flex items-center justify-center w-full px-4" aria-label="Pintree Primary Logo Preview">
                  <img src={ASSET_01_SVG} alt="Pintree Primary Logo" className="h-10 w-auto max-w-[85%] object-contain sm:h-12" />
                </div>
              </div>
              <div className="flex flex-col justify-between bg-[#F7F7F7]/40 p-8 sm:p-10 lg:col-span-5">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#777777]">Asset 01</span>
                    <span className="text-xs text-[#777777]">Vector & Raster</span>
                  </div>
                  <h3 className="mb-3 text-xl font-medium text-[#202020] sm:text-[22px]">Primary Logo</h3>
                  <p className="mb-6 text-sm leading-relaxed text-[#666666]">
                    The official Pintree logo combining the brand icon and wordmark. Recommended for general brand representation in editorials, headers, and media press kits.
                  </p>
                </div>
                <div className="border-t border-[#E5E5E5] pt-4">
                  <div className="mb-3 text-xs font-medium text-[#777777]">Available Formats</div>
                  <div className="flex flex-wrap items-center gap-3">
                    <FileLink href={ASSET_01_SVG} fileName="asset_01.svg" solid>Download SVG</FileLink>
                    <FileLink href={ASSET_01_PNG} fileName="asset_01.png">Download PNG</FileLink>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <article className="flex flex-col justify-between overflow-hidden rounded-xl border border-[#E5E5E5] bg-white transition-colors hover:border-[#CCCCCC]">
              <div className={`relative flex min-h-[220px] items-center justify-center border-b border-[#E5E5E5] p-10 ${grid}`}>
                <span className="absolute left-4 top-4 rounded border border-[#E5E5E5]/80 bg-[#F7F7F7] px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-[#777777]">Wordmark</span>
                <img src={ASSET_02_SVG} alt="Pintree wordmark" className="h-9 w-auto max-w-[85%] object-contain sm:h-11" />
              </div>
              <div className="flex flex-1 flex-col justify-between bg-[#F7F7F7]/40 p-7 sm:p-8">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#777777]">Asset 02</span>
                    <span className="text-xs text-[#777777]">SVG / PNG</span>
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-[#202020] sm:text-[20px]">Wordmark</h3>
                  <p className="mb-6 text-sm leading-relaxed text-[#666666]">
                    The official Pintree wordmark without the separate icon. Intended for editorial layouts and horizontal banners where the brand name is preferred.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 border-t border-[#E5E5E5] pt-4">
                  <FileLink href={ASSET_02_SVG} fileName="asset_02.svg" solid>Download SVG</FileLink>
                  <FileLink href={ASSET_02_PNG} fileName="asset_02.png">Download PNG</FileLink>
                </div>
              </div>
            </article>

            <article className="flex flex-col justify-between overflow-hidden rounded-xl border border-[#E5E5E5] bg-white transition-colors hover:border-[#CCCCCC]">
              <div className={`relative flex min-h-[220px] items-center justify-center border-b border-[#E5E5E5] p-10 ${grid}`}>
                <span className="absolute left-4 top-4 rounded border border-[#E5E5E5]/80 bg-[#F7F7F7] px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-[#777777]">Symbol</span>
                <img src={ASSET_03_SVG} alt="Pintree brand icon" className="h-20 w-20 rounded-2xl object-contain shadow-sm" />
              </div>
              <div className="flex flex-1 flex-col justify-between bg-[#F7F7F7]/40 p-7 sm:p-8">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#777777]">Asset 03</span>
                    <span className="text-xs text-[#777777]">SVG / PNG</span>
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-[#202020] sm:text-[20px]">Brand Icon</h3>
                  <p className="mb-6 text-sm leading-relaxed text-[#666666]">
                    The standalone Pintree symbol for compact placements, profile imagery, app store badges and favicon identification.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 border-t border-[#E5E5E5] pt-4">
                  <FileLink href={ASSET_03_SVG} fileName="asset_03.svg" solid>Download SVG</FileLink>
                  <FileLink href={ASSET_03_PNG} fileName="asset_03.png">Download PNG</FileLink>
                </div>
              </div>
            </article>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="flex flex-col gap-6 lg:col-span-7">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#777777]">Asset 04</span>
                  <h3 className="text-lg font-medium text-[#202020] sm:text-[20px]">Logo Variations (Contrast Tiers)</h3>
                </div>
                <span className="text-xs text-[#777777]">Light & Dark themes</span>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="flex flex-col justify-between rounded-xl border border-[#E5E5E5] bg-white p-5">
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-medium text-[#202020]">Dark Logo</span>
                      <span className="text-[10px] text-[#777777]">For light surfaces</span>
                    </div>
                    <div className={`relative mb-4 flex h-28 items-center justify-center overflow-hidden rounded-lg border border-[#E5E5E5]/60 p-4 ${grid}`}>
                      <img src={ASSET_04_DARK_SVG} alt="Pintree Dark Logo" className="h-6 w-auto max-w-[85%] object-contain sm:h-7" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border-t border-[#E5E5E5] pt-2 text-xs font-medium text-[#202020]">
                    <a href={ASSET_04_DARK_SVG} download="asset_04.svg" className="hover:underline">SVG ↓</a>
                    <span className="text-[#E5E5E5]">|</span>
                    <a href={ASSET_04_DARK_PNG} download="asset_04.png" className="hover:underline">PNG ↓</a>
                  </div>
                </div>
                <div className="flex flex-col justify-between rounded-xl border border-[#E5E5E5] bg-white p-5">
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-medium text-[#202020]">Light Logo</span>
                      <span className="text-[10px] text-[#777777]">For dark surfaces</span>
                    </div>
                    <div className="relative mb-4 flex h-28 items-center justify-center overflow-hidden rounded-lg border border-[#E5E5E5] bg-[#202020] p-4 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px]">
                      <img src={ASSET_04_LIGHT_SVG} alt="Pintree Light Logo" className="h-6 w-auto max-w-[85%] object-contain sm:h-7" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border-t border-[#E5E5E5] pt-2 text-xs font-medium text-[#202020]">
                    <a href={ASSET_04_LIGHT_SVG} download="asset_04_light.svg" className="hover:underline">SVG ↓</a>
                    <span className="text-[#E5E5E5]">|</span>
                    <a href={ASSET_04_LIGHT_PNG} download="asset_04_light.png" className="hover:underline">PNG ↓</a>
                  </div>
                </div>
              </div>
            </div>

            <article className="flex flex-col justify-between overflow-hidden rounded-xl border border-[#E5E5E5] bg-white transition-colors hover:border-[#CCCCCC] lg:col-span-5">
              <div className="flex flex-1 flex-col justify-between bg-[#F7F7F7]/40 p-7 sm:p-8">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#777777]">Asset 05</span>
                    <span className="inline-flex items-center rounded bg-[#E5E5E5]/80 px-2 py-0.5 text-[11px] font-medium text-[#202020]">PDF Format</span>
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-[#202020] sm:text-[20px]">Pintree Brand Guidelines</h3>
                  <p className="mb-6 text-sm leading-relaxed text-[#666666]">
                    An overview of Pintree&apos;s visual identity, logo clearspace, color palettes, Aeonik typography scales, and co-branding presentation rules.
                  </p>
                </div>
                <div className="border-t border-[#E5E5E5] pt-4">
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#202020] px-4 py-2.5 text-xs font-medium text-white opacity-50 cursor-not-allowed select-none"
                  >
                    Download Brand Guidelines →
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="platform" className="mx-auto max-w-[1280px] scroll-mt-24 border-b border-[#E5E5E5] py-16 md:py-24">
        <div className="mb-8 max-w-3xl md:mb-10">
          <span className="mb-3 block text-xs font-medium uppercase tracking-widest text-[#777777]">The Platform</span>
          <h2 className="font-aeonik-regular mb-4 text-3xl font-normal leading-[1.18] text-[#202020] sm:text-4xl md:text-[36px]">
            A different space for social connection.
          </h2>
          <p className="max-w-3xl text-lg font-normal leading-relaxed text-[#525252]">
            Pintree brings people, communities and conversations together in one connected social experience.
          </p>
        </div>
        <div className="mb-12 border-b border-[#E5E5E5] pb-12">
          <h3 className="font-aeonik-regular mb-4 text-[28px] font-normal leading-[1.2] text-[#202020]">
            More than a place to share.
          </h3>
          <div className="w-full space-y-4 text-[16px] leading-relaxed text-[#525252]">
            <p>
              Pintree brings together personal profiles, community spaces and focused conversations, giving people different ways to connect and participate. Whether connecting with individuals, joining communities or sharing ideas, every experience is built around people and their interests.
            </p>
            <p>
              From following people and building friendships to participating in community discussions and discovering new interests, Pintree creates a connected social environment that goes beyond the traditional feed.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-5 md:gap-0 md:divide-x md:divide-[#E5E5E5]">
          {EXPERIENCES.map(([title, text], index) => (
            <div
              key={title}
              className={`space-y-2 ${
                index === 0
                  ? "md:pr-6"
                  : index === EXPERIENCES.length - 1
                    ? "border-t border-[#E5E5E5] pt-6 md:border-t-0 md:pl-6 md:pt-0"
                    : "border-t border-[#E5E5E5] pt-6 md:border-t-0 md:px-6 md:pt-0"
              }`}
            >
              <h4 className="text-lg font-medium text-[#202020] sm:text-[20px]">{title}</h4>
              <p className="text-sm leading-relaxed text-[#666666]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="enquiries" className="mx-auto max-w-[1280px] scroll-mt-24 pt-16 md:pt-24">
        <div className="rounded-2xl border border-[#E5E5E5] bg-[#F7F7F7] p-8 sm:p-12 md:p-16">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="space-y-4 lg:col-span-7">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#CAFFA6]" />
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#777777]">Media Enquiries</span>
              </div>
              <h2 className="font-aeonik-regular text-3xl font-normal leading-[1.2] text-[#202020] sm:text-4xl md:text-[36px]">
                Have a story about Pintree?
              </h2>
              <p className="max-w-xl text-sm leading-relaxed text-[#525252] sm:text-base">
                For press coverage, interviews, company information, media resources and other press-related enquiries, get in touch with our team.
              </p>
              <p className="pt-1 text-xs text-[#777777]">
                We welcome enquiries from journalists, publishers and media professionals.
              </p>
            </div>
            <div className="flex flex-col items-start justify-center gap-4 sm:flex-row lg:col-span-5 lg:flex-col lg:items-end">
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setIsModalOpen(true);
                }}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#202020] px-6 py-3.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-black sm:w-auto"
              >
                Contact Media Team →
              </button>
              <div className="text-xs text-[#777777] lg:text-right">
                <span>Press email: </span>
                <a href="mailto:hello@pintree.co" className="font-medium text-[#202020] hover:underline">
                  hello@pintree.co
                </a>
                <span className="mt-0.5 block text-[11px] text-[#777777]">(Subject to confirmation)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div
          id="media-enquiry-modal"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/40 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="media-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseModal();
            }
          }}
        >
          <div className="relative w-full max-w-[620px] overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white p-5 shadow-2xl sm:p-7">
            <button
              type="button"
              id="close-media-modal-btn"
              aria-label="Close modal"
              onClick={handleCloseModal}
              className="absolute right-4 top-4 inline-flex items-center justify-center rounded-full p-2 text-[#666666] transition-colors hover:bg-[#F7F7F7] hover:text-[#202020] cursor-pointer sm:right-5 sm:top-5"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {isSubmitted ? (
              <div className="flex flex-col items-center pt-2 text-center sm:pt-4 animate-in fade-in duration-200">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#CAFFA6]/40 border border-[#CAFFA6] text-[#204654] shadow-xs">
                  <svg className="h-7 w-7 text-[#204654]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#204654]" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#777777]">
                    Enquiry Received
                  </span>
                </div>
                <h2
                  id="media-modal-title"
                  className="font-aeonik-regular mb-2 text-2xl font-normal leading-[1.2] text-[#202020] sm:text-[28px]"
                >
                  Thank you for reaching out.
                </h2>
                <p className="mb-5 max-w-md text-xs sm:text-sm font-normal leading-relaxed text-[#666666]">
                  Your media enquiry has been successfully delivered to the Pintree communications team.
                </p>

                {/* Reference Information Box */}
                <div className="mb-5 w-full rounded-2xl border border-[#E5E5E5] bg-[#F7F7F7] p-5 text-left transition-all">
                  <div className="flex items-center justify-between pb-3.5 border-b border-[#E5E5E5]">
                    <div>
                      <span className="block text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#777777]">
                        YOUR REFERENCE NUMBER
                      </span>
                      <span className="text-xl sm:text-2xl font-aeonik-regular text-[#202020] tracking-tight">
                        {submissionResult?.referenceId || submissionResult?.id || "PRS-2026-00042"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyReference}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E5E5] bg-white text-xs font-medium text-[#202020] hover:border-black transition-colors focus:outline-none cursor-pointer"
                      title="Copy Reference ID"
                    >
                      {isCopied ? (
                        <>
                          <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-emerald-700 font-semibold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5 text-[#777777]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                          </svg>
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="pt-3.5 space-y-2 text-xs sm:text-[13px] text-[#666666] leading-relaxed">
                    <div className="flex justify-between items-center">
                      <span className="text-[#777777]">Publication:</span>
                      <span className="font-medium text-[#202020] truncate max-w-[240px]">
                        {formData.publicationName}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#777777]">Media Type:</span>
                      <span className="font-medium text-[#202020]">
                        {PRESS_MEDIA_TYPES.find((m) => m.value === formData.mediaType)?.label || formData.mediaType}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#777777]">Contact:</span>
                      <span className="font-medium text-[#202020] truncate max-w-[240px]">
                        {formData.contactName} ({formData.email})
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#777777]">Response Timeframe:</span>
                      <span className="font-medium text-[#202020]">Within 24 to 48 business hours</span>
                    </div>
                  </div>
                </div>

                <div className="w-full space-y-2.5">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#101010] px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-black"
                  >
                    <span>Back to Press &amp; Media</span>
                    <svg className="h-4 w-4 text-[#CAFFA6] transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="text-xs text-[#666666] hover:text-[#202020] underline underline-offset-4 transition-colors cursor-pointer block mx-auto pt-0.5"
                  >
                    Submit another enquiry
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="pr-10">
                  <div className="mb-1.5 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#204654]" />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#777777]">
                      Media Enquiries
                    </span>
                  </div>
                  <h2
                    id="media-modal-title"
                    className="font-aeonik-regular text-2xl font-normal leading-[1.2] text-[#202020] sm:text-[28px]"
                  >
                    Contact Pintree Media Team
                  </h2>
                  <p className="mt-1 text-xs font-normal leading-relaxed text-[#666666] sm:text-sm">
                    Tell us a little about your enquiry. Our team will get back to you promptly.
                  </p>
                </div>

                {submitError && (
                  <div className="mt-3.5 rounded-xl border border-red-200 bg-red-50/80 p-3 text-xs font-medium text-red-700 animate-in fade-in">
                    {submitError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-4 space-y-3 sm:space-y-3.5">
                  <div>
                    <label
                      htmlFor="media-type"
                      className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#202020]"
                    >
                      Media Type <span className="text-[#204654]">*</span>
                    </label>
                    <select
                      id="media-type"
                      required
                      value={formData.mediaType}
                      onChange={(e) => setFormData({ ...formData, mediaType: e.target.value })}
                      className="w-full cursor-pointer rounded-xl border border-[#E5E5E5] bg-white px-3.5 py-2 text-sm text-[#202020] transition-all focus:border-[#204654] focus:outline-none focus:ring-2 focus:ring-[#204654]/20"
                    >
                      {PRESS_MEDIA_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                    <div>
                      <label
                        htmlFor="publication-name"
                        className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#202020]"
                      >
                        Media / Publication <span className="text-[#204654]">*</span>
                      </label>
                      <input
                        type="text"
                        id="publication-name"
                        required
                        placeholder="e.g. TechCrunch / The Daily Chronicle"
                        value={formData.publicationName}
                        onChange={(e) => setFormData({ ...formData, publicationName: e.target.value })}
                        className="w-full rounded-xl border border-[#E5E5E5] bg-white px-3.5 py-2 text-sm text-[#202020] transition-all focus:border-[#204654] focus:outline-none focus:ring-2 focus:ring-[#204654]/20"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#202020]"
                      >
                        Contact Person <span className="text-[#204654]">*</span>
                      </label>
                      <input
                        type="text"
                        id="contact-name"
                        required
                        placeholder="e.g. Rachel Vance"
                        value={formData.contactName}
                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                        className="w-full rounded-xl border border-[#E5E5E5] bg-white px-3.5 py-2 text-sm text-[#202020] transition-all focus:border-[#204654] focus:outline-none focus:ring-2 focus:ring-[#204654]/20"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="designation"
                        className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#202020]"
                      >
                        Role / Designation <span className="text-[#204654]">*</span>
                      </label>
                      <input
                        type="text"
                        id="designation"
                        required
                        placeholder="e.g. Senior Tech Editor"
                        value={formData.designation}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                        className="w-full rounded-xl border border-[#E5E5E5] bg-white px-3.5 py-2 text-sm text-[#202020] transition-all focus:border-[#204654] focus:outline-none focus:ring-2 focus:ring-[#204654]/20"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#202020]"
                      >
                        Email Address <span className="text-[#204654]">*</span>
                      </label>
                      <input
                        type="email"
                        id="contact-email"
                        required
                        placeholder="e.g. rachel.vance@techcrunch.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-xl border border-[#E5E5E5] bg-white px-3.5 py-2 text-sm text-[#202020] transition-all focus:border-[#204654] focus:outline-none focus:ring-2 focus:ring-[#204654]/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                    <div>
                      <label
                        htmlFor="contact-phone"
                        className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#202020]"
                      >
                        Phone Number <span className="font-normal lowercase text-[#777777]">(optional)</span>
                      </label>
                      <input
                        type="tel"
                        id="contact-phone"
                        placeholder="+1 (415) 890-2341"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        className="w-full rounded-xl border border-[#E5E5E5] bg-white px-3.5 py-2 text-sm text-[#202020] transition-all focus:border-[#204654] focus:outline-none focus:ring-2 focus:ring-[#204654]/20"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="enquiry-subject"
                        className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#202020]"
                      >
                        Subject <span className="text-[#204654]">*</span>
                      </label>
                      <input
                        type="text"
                        id="enquiry-subject"
                        required
                        placeholder="e.g. Feature interview / Q3 enquiry"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full rounded-xl border border-[#E5E5E5] bg-white px-3.5 py-2 text-sm text-[#202020] transition-all focus:border-[#204654] focus:outline-none focus:ring-2 focus:ring-[#204654]/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="enquiry-message"
                      className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#202020]"
                    >
                      Message / Details <span className="text-[#204654]">*</span>
                    </label>
                    <textarea
                      id="enquiry-message"
                      required
                      rows={3}
                      placeholder="Provide context, interview topics, editorial deadlines, or specific information requested..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full resize-none rounded-xl border border-[#E5E5E5] bg-white px-3.5 py-2 text-sm text-[#202020] transition-all focus:border-[#204654] focus:outline-none focus:ring-2 focus:ring-[#204654]/20"
                    />
                  </div>

                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#101010] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-black disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Submitting...</span>
                        </span>
                      ) : (
                        <>
                          <span>Submit Enquiry</span>
                          <svg className="h-4 w-4 text-[#CAFFA6] transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-0.5 pt-0.5 text-center">
                    <p className="text-xs text-[#525252]">
                      Prefer direct email? Reach us at{" "}
                      <a href="mailto:hello@pintree.co" className="font-medium text-[#202020] underline hover:text-black">
                        hello@pintree.co
                      </a>
                    </p>
                    <p className="text-[11px] text-[#777777]">
                      Your information will only be used to respond to this press enquiry.
                    </p>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
