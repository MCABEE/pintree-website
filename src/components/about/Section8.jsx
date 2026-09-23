"use client";

import React, { useEffect, useRef, useState } from "react";

const cards = [
  {
    title:
      "Pintree Launches a New Social Space Built for Meaningful Connections part..",
    body: "Pintree introduces a fresh approach to social networking, bringing users, creators, and communities together in a space..",
  },
  {
    title:
      "Pintree Introduces a Fresh Social Platform for Expression and Discovery",
    body: "Pintree offers a modern space for sharing, exploring, and connecting—bringing users, creators, and communities together through personalized content, inspiring moments..",
  },
  {
    title: "Pintree Launches a New Social Space Built for Meaningful Connections",
    body: "Stay up to date with product news, community stories, and platform updates from the Pintree team.",
  },
];

function ArrowIcon({ direction }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {direction === "left" ? (
        <>
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </>
      ) : (
        <>
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </>
      )}
    </svg>
  );
}

function CardArrowButton({ label = "Read story" }) {
  return (
    <button
      type="button"
      className="mt-auto flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full border border-[#3A3A3A] bg-transparent text-[#A0A0A0] transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-[#121212] group-hover:scale-105 active:scale-95 cursor-pointer"
      aria-label={label}
    >
      <ArrowIcon direction="right" />
    </button>
  );
}

function NavArrowButton({ direction, onClick, disabled, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex h-[42px] w-[42px] items-center justify-center rounded-full border transition-all duration-300 ${
        disabled
          ? "cursor-default border-[#2B2B2B] text-[#404040] opacity-40"
          : "cursor-pointer border-[#3A3A3A] text-[#CCCCCC] hover:border-white hover:bg-white hover:text-black hover:scale-105 active:scale-95"
      }`}
      aria-label={label}
    >
      <ArrowIcon direction={direction} />
    </button>
  );
}

export default function Section8() {
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!trackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
  };

  useEffect(() => {
    checkScroll();
    const node = trackRef.current;
    if (!node) return undefined;
    node.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      node.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scroll = (direction) => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({
      left: direction === "left" ? -340 : 340,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full bg-black py-[56px] sm:py-[72px] lg:py-[88px]">
      <div className="mx-auto w-full max-w-[1536px] px-6 sm:px-10 lg:px-[136px]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-[520px] text-left">
            <h2 className="text-[28px] font-aeonik-medium font-medium leading-[1.12] tracking-[-0.02em] text-white sm:text-[36px] lg:text-[40px]">
              What&apos;s new at Pintree
            </h2>
            <p className="mt-[12px] text-[14px] font-aeonik-regular font-normal leading-[1.5] text-white/55 sm:text-[15px]">
              The latest updates, stories, and things happening around Pintree.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-[10px] sm:pt-1">
            <NavArrowButton
              direction="left"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              label="Previous updates"
            />
            <NavArrowButton
              direction="right"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              label="Next updates"
            />
          </div>
        </div>

        <div
          ref={trackRef}
          className="mt-[32px] flex gap-[16px] overflow-x-auto pb-2 sm:mt-[40px] sm:gap-[20px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {cards.map((card) => (
            <article
              key={card.title}
              className="group flex h-[320px] w-[min(100%,320px)] shrink-0 flex-col rounded-[16px] bg-[#1A1A1A] p-[28px] text-left sm:h-[340px] sm:w-[340px] sm:p-[32px] lg:w-[360px] transition-all duration-300 hover:-translate-y-1 hover:bg-[#202020] cursor-pointer"
            >
              <h3 className="text-[17px] font-aeonik-regular font-normal leading-[1.35] text-white sm:text-[18px]">
                {card.title}
              </h3>
              <p className="mt-[14px] text-[14px] font-aeonik-regular font-normal leading-[1.5] text-white/50 sm:text-[15px]">
                {card.body}
              </p>
              <CardArrowButton />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
