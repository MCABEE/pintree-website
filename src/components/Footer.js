import Link from "next/link";
import React from "react";

const footerColumns = [
  {
    title: "Legal",
    links: [
      { href: "/terms-of-service", label: "Terms of Service" },
      { href: "/community-guidlines", label: "Community Guidelines" },
      { href: "/privacy-policy", label: "Privacy policy" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/", label: "About" },
      { href: "/", label: "Product" },
      { href: "/newsroom", label: "Newsroom" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/contact-quick-answer", label: "Quick answers" },
      { href: "/contact", label: "Help center" },
      { href: "/newsroom", label: "Press & Media" },
    ],
  },
];

const socialLinks = [
  { href: "https://x.com", label: "X", icon: "/x-icon.svg" },
  { href: "https://linkedin.com", label: "LinkedIn", icon: "/linkedin-icon.svg" },
  {
    href: "https://instagram.com",
    label: "Instagram",
    icon: "/instagram-icon.svg",
  },
];

const FOOTER_SHELL =
  "mx-auto w-full max-w-[1536px] px-6 sm:px-10 lg:px-[136px]";

const FOOTER_MARK_SRC = "/pintree-mark-white.svg";
const FOOTER_WORDMARK_SRC = "/Group-1410097181.png";

function FooterLogo() {
  return (
    <span className="inline-flex items-center gap-[23px]">
      <img
        src={FOOTER_MARK_SRC}
        alt=""
        aria-hidden
        width={26}
        height={34}
        className="h-[30px] w-[23px] shrink-0 object-contain object-left"
      />
      <img
        src={FOOTER_WORDMARK_SRC}
        alt="Pintree"
        width={128}
        height={34}
        className="h-[30px] w-auto shrink-0 object-contain object-left"
      />
    </span>
  );
}

const columnLinkClass =
  "text-[13px] leading-[1.35] font-aeonik-regular text-white transition-opacity hover:opacity-80 sm:text-[14px]";

const TAGLINE_CLASS =
  "text-left text-[13px] leading-[1.45] font-aeonik-regular text-white sm:text-[14px]";

function FooterSocialIcons({ className = "mt-[45px]" }) {
  return (
    <div
      className={`flex w-full items-center justify-start gap-5 ${className}`}
    >
      {socialLinks.map((item) => (
        <a
          key={item.label}
          href={item.href}
          aria-label={item.label}
          className="inline-flex shrink-0 transition-opacity hover:opacity-75"
        >
          <img
            src={item.icon}
            alt=""
            width={16}
            height={16}
            className="h-4 w-4 object-contain"
          />
        </a>
      ))}
    </div>
  );
}

function FooterTagline() {
  return (
    <div className="flex w-full flex-col items-start text-left">
      <p className={`${TAGLINE_CLASS} whitespace-nowrap`}>
        People you know → Communities you belong to →
      </p>
      <p className={`${TAGLINE_CLASS} mt-[2px]`}>
        A world beyond your network.
      </p>
    </div>
  );
}

function FooterColumn({
  column,
  linkListClassName = "mt-[22px] flex flex-col gap-[22px]",
}) {
  return (
    <div className="min-w-[120px] text-left">
      <p className="text-[13px] leading-[1.55] font-aeonik-medium text-[#8E8E8E]">
        {column.title}
      </p>
      <ul className={linkListClassName}>
        {column.links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className={columnLinkClass}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Footer() {
  return (
    <footer className="w-full bg-black text-white">
      <div
        className={`${FOOTER_SHELL} pt-[56px] pb-[44px] sm:pb-[52px] lg:pt-[64px]`}
      >
        {/* Mobile / tablet */}
        <div className="lg:hidden">
          <Link href="/" className="inline-block shrink-0">
            <FooterLogo />
          </Link>
          <div className="mt-5 w-full max-w-[360px]">
            <FooterTagline />
            <FooterSocialIcons />
          </div>
          <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
            {footerColumns.map((column) => (
              <FooterColumn key={column.title} column={column} />
            ))}
          </div>
          <p className="mt-12 text-[12px] leading-[1.5] font-aeonik-regular text-[#8E8E8E]">
            Copyright © 2025-2026 MCABEE Digital. All rights reserved.
          </p>
        </div>

        {/* Desktop — Legal / Company / Support align with first tagline line */}
        <div className="hidden lg:grid lg:grid-cols-[minmax(0,1fr)_auto_auto_auto] lg:grid-rows-[auto_auto_auto_auto] lg:gap-x-[72px] xl:gap-x-[96px]">
          <Link href="/" className="col-start-1 row-start-1 inline-block shrink-0">
            <FooterLogo />
          </Link>

          <p className="col-start-1 row-start-2 mt-5 whitespace-nowrap text-left text-[13px] leading-[1.45] font-aeonik-regular text-white sm:text-[14px]">
            People you know → Communities you belong to →
          </p>

          {footerColumns.map((column, index) => (
            <p
              key={`${column.title}-label`}
              className="row-start-2 mt-5 min-w-[120px] self-start text-left text-[13px] leading-[1.45] font-aeonik-medium text-[#8E8E8E]"
              style={{ gridColumnStart: index + 2 }}
            >
              {column.title}
            </p>
          ))}

          <div className="col-start-1 row-start-3 mt-[2px] flex w-full max-w-[420px] flex-col items-start text-left">
            <p className={TAGLINE_CLASS}>A world beyond your network.</p>
            <FooterSocialIcons />
            <p className="mt-[48px] text-[12px] leading-[1.5] font-aeonik-regular text-[#8E8E8E]">
              Copyright © 2025-2026 MCABEE Digital. All rights reserved.
            </p>
          </div>

          {footerColumns.map((column, index) => (
            <div
              key={`${column.title}-links`}
              className="row-start-3 mt-[22px] min-w-[120px] self-start text-left"
              style={{ gridColumnStart: index + 2 }}
            >
              <ul className="flex flex-col gap-[22px]">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className={columnLinkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
