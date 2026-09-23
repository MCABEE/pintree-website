"use client";

import React from "react";
import { motion } from "framer-motion";

const sectionWrap =
  "mx-auto w-full max-w-[1536px] px-6 sm:px-10 lg:px-[136px]";

const illustrationSrc = "/Group-1410097221.svg";
const illustrationFallback = "/Group 1410097221.svg";

const columns = [
  {
    title: "Our Story",
    body: "From an idea to a platform built around people, communities, and conversations.",
    linkText: "Our Story",
    linkHref: "#",
  },
  {
    title: "The Company",
    body: "Meet the team and the company building Pintree for a more connected social experience.",
    linkText: "About",
    linkHref: "#",
  },
  {
    title: "Our Approach",
    body: "A thoughtful approach to building social spaces around connection, participation, and discovery.",
    linkText: "Approach",
    linkHref: "#",
  },
];

export default function Section4() {
  return (
    <section className="w-full overflow-hidden bg-white pb-[20px] pt-[60px] sm:pb-[30px] sm:pt-[80px] lg:pt-[90px]">
      <div className={sectionWrap}>
        <p className="text-left text-[14px] leading-[20px] font-aeonik-regular font-normal text-[#555555] sm:text-[16px]">
          About
        </p>

        <h2 className="mt-[12px] text-left text-[32px] font-aeonik-medium font-medium leading-[1.12] tracking-[-0.02em] text-[#0C0C0C] sm:mt-[16px] sm:text-[44px] lg:text-[54px] xl:text-[60px]">
          Built around people,
          <br />
          communities, and conversations.
        </h2>

        <p className="mt-[18px] max-w-[730px] text-left text-[13px] leading-[1.5] font-aeonik-regular font-normal text-[#555555] sm:mt-[22px] sm:text-[15px] lg:text-[16px]">
          Pintree is a community-first social platform designed to make online
          interaction feel more organized, meaningful, and human. From personal
          connections to shared-interest communities, Pintree creates spaces where
          conversations can grow with purpose.
        </p>

        <div className="mt-[48px] grid grid-cols-1 gap-8 sm:mt-[64px] md:grid-cols-3 sm:gap-10 lg:mt-[76px] lg:gap-12">
          {columns.map((col) => (
            <div key={col.title} className="flex flex-col justify-between text-left">
              <div>
                <h3 className="text-[18px] font-aeonik-medium font-medium text-[#0C0C0C] sm:text-[20px]">
                  {col.title}
                </h3>
                <p className="mt-2 text-[13px] leading-[1.45] font-aeonik-regular text-[#555555] sm:text-[14px]">
                  {col.body}
                </p>
              </div>
              <a
                href={col.linkHref}
                className="mt-4 inline-block text-[13px] font-aeonik-medium font-medium text-[#0C0C0C] underline underline-offset-4 transition-opacity hover:opacity-80 sm:text-[14px]"
              >
                {col.linkText}
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-[48px] w-full overflow-hidden sm:mt-[56px] lg:mt-[64px]">
        <motion.div
          className="flex w-max will-change-transform"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          aria-hidden
        >
          {[0, 1].map((key) => (
            <img
              key={key}
              src={illustrationSrc}
              alt=""
              className="h-[100px] w-auto max-w-none shrink-0 sm:h-[130px] lg:h-[153px]"
              onError={(e) => {
                if (e.currentTarget.src !== illustrationFallback) {
                  e.currentTarget.src = illustrationFallback;
                }
              }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
