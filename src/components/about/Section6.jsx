"use client";

import React from "react";
import { motion } from "framer-motion";

const starIcon = "/Vector-(7).svg";
const starIconFallback = "/Vector (7).svg";
const phoneMockup = "/01-removebg-preview-1.svg";
const phoneMockupFallback = "/01-removebg-preview 1.svg";

const cards = [
  {
    name: "New Interests",
    asset: "/Group 1410097222.svg",
    fallbackAsset: "/Group-1410097222.svg",
  },
  {
    name: "New people",
    asset: "/Group 1410097223.svg",
    fallbackAsset: "/Group-1410097223.svg",
  },
  {
    name: "New Communities",
    asset: "/Group 1410097224.svg",
    fallbackAsset: "/Group-1410097224.svg",
  },
  {
    name: "New Topics",
    asset: "/Group 1410097225.svg",
    fallbackAsset: "/Group-1410097225.svg",
  },
];

const bulletItems = [
  {
    title: "Discover new interests",
    description:
      "Explore content beyond the people and communities you already follow.",
  },
  {
    title: "See different perspectives",
    description:
      "Find ideas and conversations from people outside your existing network.",
  },
  {
    title: "Find communities to join",
    description:
      "Explore communities that connect with your interests and passions.",
  },
];

const sectionWrap =
  "mx-auto w-full max-w-[1536px] px-6 sm:px-10 lg:px-[136px]";

{/* Desktop Showcase Strip with automatic movement & hover pause */}
function DesktopShowcaseStrip() {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      className="hidden lg:block w-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="flex items-end gap-3 w-max will-change-transform pb-1"
        animate={isHovered ? {} : { x: ["0%", "-50%"] }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {[0, 1].map((loopKey) => (
          <div key={loopKey} className="flex items-end gap-2.5 pb-0 shrink-0 pr-3">
            {/* Card 1: New Interests */}
            <img
              src={cards[0].asset}
              alt={cards[0].name}
              width={120}
              height={192}
              className="h-[192px] w-[120px] shrink-0 rounded-[12px] object-contain transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-1.5 hover:shadow-lg cursor-pointer"
              onError={(e) => {
                e.currentTarget.src = cards[0].fallbackAsset;
              }}
            />

            {/* Center Phone Mockup */}
            <div className="relative z-20 shrink-0 -mx-0.5 transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-1.5 hover:shadow-xl cursor-pointer">
              <img
                src={phoneMockup}
                alt="Discover app"
                width={152}
                height={320}
                className="h-[320px] w-[152px] shrink-0 object-contain drop-shadow-md"
                onError={(e) => {
                  e.currentTarget.src = phoneMockupFallback;
                }}
              />
            </div>

            {/* Cards 2, 3, 4 */}
            {cards.slice(1).map((card, idx) => (
              <img
                key={card.name + idx}
                src={card.asset}
                alt={card.name}
                width={120}
                height={192}
                className="h-[192px] w-[120px] shrink-0 rounded-[12px] object-contain transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-1.5 hover:shadow-lg cursor-pointer"
                onError={(e) => {
                  e.currentTarget.src = card.fallbackAsset;
                }}
              />
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

{/* Mobile Showcase Strip for right-to-left marquee */}
function MobileShowcaseStrip() {
  return (
    <div className="flex items-end gap-3 shrink-0 pr-3">
      <img
        src={cards[0].asset}
        alt={cards[0].name}
        width={114}
        height={180}
        className="h-[180px] w-[114px] shrink-0 rounded-[12px] object-contain"
        onError={(e) => {
          e.currentTarget.src = cards[0].fallbackAsset;
        }}
      />

      <div className="relative z-20 shrink-0 -mx-0.5">
        <img
          src={phoneMockup}
          alt="Discover app"
          width={142}
          height={300}
          className="h-[300px] w-[142px] shrink-0 object-contain drop-shadow-md"
          onError={(e) => {
            e.currentTarget.src = phoneMockupFallback;
          }}
        />
      </div>

      {cards.slice(1).map((card, idx) => (
        <img
          key={card.name + idx}
          src={card.asset}
          alt={card.name}
          width={114}
          height={180}
          className="h-[180px] w-[114px] shrink-0 rounded-[12px] object-contain"
          onError={(e) => {
            e.currentTarget.src = card.fallbackAsset;
          }}
        />
      ))}
    </div>
  );
}

export default function Section6() {
  return (
    <section className="w-full overflow-hidden bg-white py-[50px] sm:py-[64px] lg:py-[80px]">
      <div className={sectionWrap}>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-8 xl:gap-12">
          {/* Left Side Content - Single line feature descriptions */}
          <div className="w-full shrink-0 text-left lg:max-w-[500px] xl:max-w-[540px]">
            <h2 className="text-[28px] font-aeonik-medium font-medium leading-[1.12] tracking-[-0.02em] text-[#0C0C0C] sm:text-[36px] lg:text-[40px] xl:text-[44px] lg:leading-[48px] xl:leading-[52px]">
              <span className="block">Discover</span>
              <span className="block">beyond your network</span>
            </h2>

            <p className="mt-[14px] max-w-[480px] text-[13px] leading-[1.45] font-aeonik-regular font-normal text-[#555555] sm:mt-[18px] sm:text-[14.5px] lg:text-[15px] lg:leading-[1.5]">
              Explore content from people and communities you haven&apos;t connected
              with yet, opening up new conversations, interests, and perspectives.
            </p>

            <ul className="mt-[28px] flex flex-col gap-4 sm:mt-[32px] sm:gap-5">
              {bulletItems.map((item) => (
                <li key={item.title} className="flex items-start gap-3.5 sm:gap-4">
                  <img
                    src={starIcon}
                    alt=""
                    className="mt-0.5 h-[16px] w-[16px] shrink-0 object-contain sm:h-[18px] sm:w-[18px]"
                    onError={(e) => {
                      e.currentTarget.src = starIconFallback;
                    }}
                  />
                  <div>
                    <h3 className="text-[15px] font-aeonik-medium font-medium leading-[1.2] text-[#0C0C0C] sm:text-[16px]">
                      {item.title}
                    </h3>
                    <p className="mt-0.5 text-[12px] leading-[1.35] font-aeonik-regular font-normal text-[#555555] sm:text-[13px] lg:text-[13.5px] whitespace-normal xl:whitespace-nowrap">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop Right Side Visual Strip Container (Aligned with bottom text line) */}
          <div className="hidden min-w-0 flex-1 lg:flex lg:justify-start overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-0 pt-2">
            <DesktopShowcaseStrip />
          </div>
        </div>

        {/* Mobile Visual Strip: Positioned below content, continuous Right-to-Left movement */}
        <div className="mt-8 w-full overflow-hidden lg:hidden">
          <motion.div
            className="flex w-max items-end will-change-transform"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            aria-hidden
          >
            {[0, 1].map((loopKey) => (
              <MobileShowcaseStrip key={loopKey} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}




