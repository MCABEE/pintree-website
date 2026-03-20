"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaArrowRight } from "react-icons/fa6";
import { HiMenuAlt3, HiX } from "react-icons/hi";

const Navbar = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/", label: "About" },
    { href: "/newsroom", label: "Newsroom" },
    { href: "/contact", label: "Contact" },
    // { href: "/blog", label: "Blog" },
  ];
  return (
    <>
      {/* NAVBAR */}
   <div
  className="
    flex justify-between items-center 
    px-6 sm:px-10 lg:px-[80px] xl:px-[140px] 
    py-[24px] 
    z-50 bg-white border-b border-[#F0F0F0] relative
    xl:sticky top-0
  "
>
        {/* LOGO */}
        <img
          src="/pintree.svg"
          alt="logo"
          className="w-[84px] sm:w-[100px] 2xl:w-[113px] lg:mb-2"
        />

        {/* DESKTOP LINKS */}
        <div className="hidden xl:flex iv gap-[57px] text-[#333333] text-[16px]">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-[20px] py-[6px] rounded-[8px] transition duration-200 ${
                pathname === link.href
                  ? "bg-[#F2F2F2] font-medium"
                  : "hover:bg-[#F2F2F2]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* DESKTOP CTA */}
        <div className="hidden xl:flex gap-2.5 items-center  text-[#333333] text-[16px]  font-aeonik-medium cursor-pointer">
          <h1>Professional Account</h1>
          <FaArrowRight />
        </div>

        {/* MOBILE HAMBURGER */}
        <button
          className="xl:hidden text-2xl sm:text-4xl text-[#333333]"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`
          lg:hidden 
          absolute top-[90px] left-0 w-full bg-white shadow-md 
          transition-all duration-300 overflow-hidden 
          ${menuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        {/* LINKS */}
        <div className="flex flex-col px-6 py-4 gap-4 text-[#333333] text-[16px] font-medium">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-2 rounded-md transition ${
                pathname === link.href ? "bg-[#F2F2F2]" : "hover:bg-[#F9F9F9]"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* MOBILE CTA */}
          <div
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-[16px] font-aeonik-medium cursor-pointer hover:bg-[#F9F9F9] rounded-md"
          >
            <h1>Professional Account</h1>
            <FaArrowRight />
          </div>
        </div>
      </div>
    </>

  );
};

export default Navbar;
