"use client";

import React, { useRef, useState, useEffect } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

const sectionWrap =
  "mx-auto w-full max-w-[1536px] px-6 sm:px-10 lg:px-[136px]";

const communityCards = [
  {
    id: "organizations",
    title: "Organizations",
    description:
      "Communities and rooms help discussions stay focused and organized.",
    icon: "/Group 1410097197.svg",
    iconFallback: "/Group-1410097197.svg",
  },
  {
    id: "institutions",
    title: "Institutions",
    description:
      "Schools, colleges, campuses, alumni networks, and educational communities.",
    icon: "/Group 1410097196.svg",
    iconFallback: "/Group-1410097196.svg",
  },
  {
    id: "local",
    title: "Local Communities",
    description:
      "Neighborhoods, villages, towns, residential groups, and place-based communities.",
    icon: "/Group 1410097198.svg",
    iconFallback: "/Group-1410097198.svg",
  },
  {
    id: "interest",
    title: "Interest groups",
    description:
      "Hobbies, passions, professions, causes, and shared-interest discussions.",
    icon: "/Group 1410097194.svg",
    iconFallback: "/Group-1410097194.svg",
  },
  {
    id: "families",
    title: "Families & networks",
    description:
      "Families, relatives, alumni circles, and private social networks.",
    icon: "/Group 1410097193.svg",
    iconFallback: "/Group-1410097193.svg",
  },
  {
    id: "religious",
    title: "Religious & Cultural",
    description:
      "Connect faith-based and cultural communities through organized spaces for updates, discussions etc.",
    icon: "/Group 1410097202.svg",
    iconFallback: "/Group-1410097202.svg",
  },
];

export default function Section5() {
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (trackRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    const node = trackRef.current;
    if (node) {
      node.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (node) {
        node.removeEventListener("scroll", checkScroll);
      }
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scroll = (direction) => {
    if (trackRef.current) {
      const scrollAmount = 292; // 272px card width + 20px gap
      trackRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full bg-[#F7F9ED] py-[60px] sm:py-[80px] lg:py-[90px]">
      <div className={sectionWrap}>
        {/* Header Section */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-[660px] text-left">
            <h2 className="text-left text-[30px] font-aeonik-medium font-medium leading-[1.12] tracking-[-0.02em] text-[#0C0C0C] sm:text-[38px] lg:text-[44px] lg:leading-[54px]">
              <span className="block">Communities designed</span>
              <span className="block">for meaningful participation.</span>
            </h2>
            <p className="mt-[14px] text-left text-[13px] leading-[1.45] font-aeonik-regular font-normal text-[#555555] sm:text-[14px] lg:text-[15px]">
              Create or join organized spaces where conversations stay focused
              through community feeds, dedicated rooms, shared interests, and
              active participation.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex shrink-0 items-center gap-2 self-end md:self-auto">
            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-200 ${
                canScrollLeft
                  ? "cursor-pointer border-[#C4C4C4] bg-white text-[#1A1A1A] hover:border-[#A3A3A3]"
                  : "cursor-not-allowed border-[#E3E3E3] bg-transparent text-[#D1D1D1]"
              }`}
              aria-label="Previous communities"
            >
              <FiArrowLeft className="h-5 w-5 stroke-[1.5]" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-200 ${
                canScrollRight
                  ? "cursor-pointer border-[#C4C4C4] bg-white text-[#1A1A1A] hover:border-[#A3A3A3]"
                  : "cursor-not-allowed border-[#E3E3E3] bg-transparent text-[#D1D1D1]"
              }`}
              aria-label="Next communities"
            >
              <FiArrowRight className="h-5 w-5 stroke-[1.5]" />
            </button>
          </div>
        </div>

        {/* Carousel Track */}
        <div
          ref={trackRef}
          className="mt-[32px] flex gap-[20px] overflow-x-auto pb-4 pt-1 sm:mt-[40px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {communityCards.map((card) => (
            <div
              key={card.id}
              className="flex h-[240px] w-[272px] shrink-0 cursor-pointer flex-col rounded-[20px] border border-black/[0.08] bg-white p-[24px] text-left shadow-[0_6px_28px_rgba(0,0,0,0.12),0_2px_10px_rgba(0,0,0,0.08)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.16),0_6px_16px_rgba(0,0,0,0.1)]"
            >
              {/* Icon Container: 64x64px, 24px X & Y inset */}
              <div className="flex h-[64px] w-[64px] shrink-0 items-center justify-center rounded-[16px] bg-[#A9E0F1]">
                <img
                  src={card.icon}
                  alt={card.title}
                  className="h-[28px] w-[28px] object-contain"
                  onError={(e) => {
                    if (
                      card.iconFallback &&
                      e.currentTarget.src !== card.iconFallback
                    ) {
                      e.currentTarget.src = card.iconFallback;
                    }
                  }}
                />
              </div>

              {/* Heading: Gap icon -> heading ~20-24px */}
              <h3 className="mt-[20px] text-[18px] font-aeonik-medium font-medium leading-[1.2] text-[#0C0C0C]">
                {card.title}
              </h3>

              {/* Description: Gap heading -> description ~12-16px */}
              <p className="mt-[12px] text-[13px] font-aeonik-regular font-normal leading-[1.4] text-[#555555]">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        {/* Learn More Button */}
        <div className="mt-[32px] text-left sm:mt-[40px]">
          <button
            type="button"
            className="cursor-pointer rounded-[10px] border border-[#1A1A1A]/20 bg-white px-6 py-2.5 text-[14px] font-aeonik-medium font-medium text-[#1A1A1A] shadow-xs transition-colors hover:bg-[#1A1A1A] hover:text-white sm:px-7 sm:py-3 sm:text-[15px]"
          >
            Learn more
          </button>
        </div>
      </div>
    </section>
  );
}

