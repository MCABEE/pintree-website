"use client";

import React from "react";

const sectionWrap =
  "mx-auto w-full max-w-[1536px] px-6 sm:px-10 lg:px-[136px]";

function CircledText({ children }) {
  return (
    <span className="relative inline-block px-1.5 py-0.5 mx-0.5 align-baseline">
      <svg
        className="pointer-events-none absolute -inset-x-2 -inset-y-1.5 h-[calc(100%+12px)] w-[calc(100%+16px)] overflow-visible"
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden
      >
        <path
          d="M 6 20 C 6 8, 30 4, 50 4 C 80 4, 96 10, 96 20 C 96 30, 75 36, 50 36 C 20 36, 4 30, 6 20 C 8 10, 35 5, 65 5"
          stroke="white"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />
      </svg>
      <span className="relative z-10">{children}</span>
    </span>
  );
}

const purposeCards = [
  {
    titleLine1: "Structured",
    titleLine2: "Conversations",
    description: (
      <>
        <CircledText>Communities</CircledText> and{" "}
        <CircledText>rooms</CircledText> help discussions stay focused and
        organized.
      </>
    ),
    icon: "/Vector (3).svg",
    iconFallback: "/Vector_(3).svg",
    iconWidth: "w-[48px]",
    iconHeight: "h-[46px]",
    paddingLeft: "pl-[33px]",
  },
  {
    titleLine1: "Meaningful",
    titleLine2: "Participation",
    description: (
      <>
        Interact through <CircledText>shared interests</CircledText>,
        communities, and relevant conversations.
      </>
    ),
    icon: "/Vector (4).svg",
    iconFallback: "/Vector_(4).svg",
    iconWidth: "w-[66px]",
    iconHeight: "h-[46px]",
    paddingLeft: "pl-[34px]",
  },
  {
    titleLine1: "Cleaner",
    titleLine2: "Social Experience",
    description: (
      <>
        Designed to <CircledText>reduce noise</CircledText>, distraction, and
        low-quality interaction.
      </>
    ),
    icon: "/Vector (5).svg",
    iconFallback: "/Vector_(5).svg",
    iconWidth: "w-[46px]",
    iconHeight: "h-[46px]",
    paddingLeft: "pl-[31px]",
  },
];

function PurposeCard({
  titleLine1,
  titleLine2,
  description,
  icon,
  iconFallback,
  iconWidth,
  iconHeight,
  paddingLeft,
}) {
  return (
    <div
      className={`group relative flex h-[315px] w-full max-w-[415px] cursor-pointer flex-col justify-start rounded-[10px] bg-[#214D5B] ${paddingLeft} pr-[56px] pt-[65px] text-left transition-colors hover:bg-[#1b414e]`}
    >
      <img
        src={icon}
        alt=""
        className={`${iconWidth} ${iconHeight} shrink-0 object-contain`}
        onError={(e) => {
          if (iconFallback && e.currentTarget.src !== iconFallback) {
            e.currentTarget.src = iconFallback;
          }
        }}
      />

      <h3 className="mt-[19px] max-w-[270px] text-[20px] font-aeonik-medium font-medium leading-[1.15] text-white">
        <span className="block">{titleLine1}</span>
        <span className="block">{titleLine2}</span>
      </h3>

      <p className="mt-[16px] max-w-[326px] text-[16px] leading-[1.38] font-aeonik-regular text-white/90">
        {description}
      </p>
    </div>
  );
}

export default function Section3() {
  return (
    <section className="w-full bg-white pb-[60px] pt-[40px] sm:pb-[80px] sm:pt-[50px] lg:pb-[90px] lg:pt-[60px]">
      <div className={sectionWrap}>
        <h2 className="m-0 text-center text-[30px] font-aeonik-medium font-medium leading-[1.12] tracking-[-0.02em] text-[#0C0C0C] sm:text-[38px] lg:text-[44px]">
          Social, with more purpose.
        </h2>

        <p className="mx-auto mt-[14px] max-w-[620px] text-center text-[13px] leading-[1.5] font-aeonik-regular font-normal text-[#555555] sm:text-[14px] lg:text-[15px]">
          Pintree is designed to encourage focused participation, meaningful
          discovery, and community-driven interaction — creating a cleaner, more
          organized social experience.
        </p>

        <div className="mt-[44px] w-full lg:mt-[52px]">
          <div className="grid grid-cols-1 justify-items-center gap-[10px] md:grid-cols-3">
            {purposeCards.map((card) => (
              <PurposeCard key={card.titleLine1 + card.titleLine2} {...card} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
