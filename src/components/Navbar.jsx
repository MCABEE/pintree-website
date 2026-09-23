"use client";

import Link from "next/link";
import { useState } from "react";

const mainNavLinks = [
  { href: "/", label: "Product" },
  { href: "/", label: "About" },
  { href: "/newsroom", label: "Newsroom" },
  { href: "/contact", label: "Support" },
];

const navLinkClass =
  "whitespace-nowrap text-[13px] leading-[20px] font-aeonik-regular font-normal text-[#333333] transition-colors hover:text-[#111111] focus-visible:text-[#111111] focus-visible:outline-none";

const authLinkClass = `${navLinkClass} shrink-0`;

const primaryButtonClass =
  "inline-flex h-[36px] shrink-0 items-center justify-center rounded-[7px] bg-[#2C2C2C] text-[13px] leading-none font-aeonik-regular font-normal text-white transition-colors hover:bg-[#242424] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2C2C2C]";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 w-full border-b border-[#1A1A1A]/10 bg-white">
        <div className="mx-auto flex h-16 w-full max-w-[1536px] items-center px-6 lg:px-[136px]">
          <Link href="/" className="shrink-0">
            <img
              src="/Group-1410097178.svg"
              alt="Pintree"
              className="h-[30px] w-[101px] object-contain object-left"
            />
          </Link>

          <nav
            className="ml-[42px] hidden min-w-0 flex-1 items-center lg:flex"
            aria-label="Main"
          >
            <div className="flex items-center gap-[48px]">
              {mainNavLinks.map((link) => (
                <Link key={link.label} href={link.href} className={navLinkClass}>
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="ml-auto flex items-center">
              <Link href="/contact" className={`${authLinkClass} mr-[24px]`}>
                Log in
              </Link>
              <div className="flex items-center gap-[6px]">
                <Link
                  href="/contact"
                  className={`${primaryButtonClass} min-w-[76px] px-[18px]`}
                >
                  Sign up
                </Link>
                <Link
                  href="/"
                  className={`${primaryButtonClass} min-w-[126px] px-[18px]`}
                >
                  Download app
                </Link>
              </div>
            </div>
          </nav>

          <div className="ml-auto flex items-center lg:hidden">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-[7px] text-[#333333] hover:bg-[#F5F5F5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2C2C2C]"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((open) => !open)}
            >
              {mobileOpen ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M5 5L15 15M15 5L5 15"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M3 5H17M3 10H17M3 15H17"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {mobileOpen ? (
          <div
            id="mobile-nav"
            className="border-t border-[#1A1A1A]/10 bg-white px-6 pb-6 pt-4 lg:hidden"
          >
            <div className="flex flex-col gap-4">
              {mainNavLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={navLinkClass}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                className={authLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                Log in
              </Link>
              <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:items-center">
                <Link
                  href="/contact"
                  className={`${primaryButtonClass} w-full sm:min-w-[76px] sm:w-auto`}
                  onClick={() => setMobileOpen(false)}
                >
                  Sign up
                </Link>
                <Link
                  href="/"
                  className={`${primaryButtonClass} w-full sm:min-w-[126px] sm:w-auto`}
                  onClick={() => setMobileOpen(false)}
                >
                  Download app
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </header>
      <div className="h-16 shrink-0" aria-hidden="true" />
    </>
  );
};

export default Navbar;
