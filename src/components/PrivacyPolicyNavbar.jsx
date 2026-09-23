"use client";

import Link from "next/link";

const navLinks = [
  { href: "/", label: "Product" },
  { href: "/", label: "About" },
  { href: "/newsroom", label: "Newsroom" },
  { href: "/contact", label: "Support" },
  { href: "/contact", label: "Create Account" },
  { href: "/", label: "Get the App" },
];

export default function PrivacyPolicyNavbar() {
  return (
    <header className="w-full bg-white border-b border-[#F0F0F0]">
      <div className="mx-auto flex items-center justify-between gap-6 px-6 sm:px-10 lg:px-[80px] xl:px-[140px] py-[22px] min-h-[72px]">
        <Link href="/" className="shrink-0">
          <img
            src="/Group-1410097178.svg"
            alt="Pintree"
            className="h-[26px] w-auto sm:h-[28px] xl:h-[30px]"
          />
        </Link>

        <nav className="flex flex-1 items-center justify-end gap-4 sm:gap-6 lg:gap-8 xl:gap-10 overflow-x-auto no-scrollbar">
          {navLinks.map((link) => {
            const isActive = link.label === "Newsroom";

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`shrink-0 whitespace-nowrap text-[13px] sm:text-[14px] lg:text-[15px] font-aeonik-medium text-[#333333] transition-colors ${
                  isActive
                    ? "rounded-[8px] bg-[#F2F2F2] px-[16px] py-[6px]"
                    : "hover:text-[#1A1A1A]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
