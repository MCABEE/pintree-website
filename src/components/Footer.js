import Link from "next/link";
import React from "react";

const footerColumns = [
  {
    title: "Legal",
    links: [
      { href: "/terms-of-service", label: "Terms of Use" },
      { href: "/community-guidlines", label: "Community Guidelines" },
      { href: "/privacy-policy", label: "Privacy Policy" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/product", label: "Product" },
      { href: "/newsroom", label: "Newsroom" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/faq", label: "FA Questions" },
      { href: "/support", label: "Support" },
      { href: "/press-media", label: "Press & Media" },
    ],
  },
];

const socialLinks = [
  {
    href: "https://www.facebook.com/pintreeofficial",
    label: "Facebook",
    icon: (
      <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" aria-hidden>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    href: "https://www.instagram.com/pintree_official",
    label: "Instagram",
    icon: (
      <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" aria-hidden>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    href: "/",
    label: "Pintree",
    icon: (
      <img
        src="/pintree-mark-white.svg"
        alt=""
        aria-hidden
        className="h-3.5 w-3.5 object-contain opacity-90"
      />
    ),
  },
];

const linkClass =
  "inline-block py-0.5 text-[14px] font-normal leading-5 tracking-[0.005em] text-[#858585] transition-colors duration-150 hover:text-white";

function Footer() {
  return (
    <footer className="w-full bg-[#111111] pb-16 pt-20 font-jakarta text-white">
      <div className="mx-auto w-full max-w-[1536px] px-6 sm:px-12 md:px-16 lg:px-[128px]">
        <div className="mx-auto w-full max-w-[1280px] px-0">
          <div className="grid grid-cols-1 gap-y-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-x-8">
            {/* Brand */}
            <div className="flex flex-col justify-between pr-0 lg:col-span-6 lg:pr-12">
              <div>
                <Link
                  href="/"
                  aria-label="Pintree Home"
                  className="group inline-flex items-center gap-2.5">
                  <img
                    src="/pintree-mark-white.svg"
                    alt=""
                    aria-hidden
                    className="h-6 w-auto shrink-0 object-contain transition-transform duration-200 group-hover:scale-105"
                  />
                  <img
                    src="/Group-1410097181.png"
                    alt="Pintree"
                    className="h-6 w-auto shrink-0 object-contain"
                  />
                </Link>

                <p className="mt-4 max-w-sm text-[14px] font-normal leading-5 tracking-[0.005em] text-[#858585]">
                  People you know → Communities you belong to → A world beyond
                  your network.
                </p>

                <div
                  aria-label="Social Media"
                  className="mt-7 flex items-center gap-4">
                  {socialLinks.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      aria-label={item.label}
                      rel={
                        item.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      target={
                        item.href.startsWith("http") ? "_blank" : undefined
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-[#858585] transition-all duration-150 hover:border-white/30 hover:bg-white/[0.04] hover:text-white">
                      {item.icon}
                    </a>
                  ))}
                </div>
              </div>

              <p className="mt-10 text-[11px] font-medium leading-4 tracking-normal text-[#858585] lg:mt-12">
                Copyright © 2025–2026 MCABEE Digital. All rights reserved.
              </p>
            </div>

            {/* Link columns */}
            {footerColumns.map((column) => (
              <div key={column.title} className="lg:col-span-2">
                <h4 className="mb-5 select-none text-sm font-medium tracking-wide text-white">
                  {column.title}
                </h4>
                <ul className="m-0 list-none space-y-3.5 p-0">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className={linkClass}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
