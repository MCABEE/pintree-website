"use client";

import React, { useRef, useState } from "react";
import { AiTwotoneLeftCircle, AiTwotoneRightCircle } from "react-icons/ai";

const cards = [
  {
    title:
      "Pintree Launches a New Social Space Built for Meaningful Connections",
    body: "Pintree introduces a fresh approach to social networking, bringing users, creators, and communities together in a space designed for expression, discovery, and genuine engagement.",
    cta: "Read More",
    ctaVariant: "outline",
  },
  {
    title:
      "Pintree Introduces a Fresh Social Platform for Expression and Discovery",
    body: "Pintree offers a modern space for sharing, exploring, and connecting—bringing users, creators, and communities together through personalized content, inspiring moments...",
    cta: "Read More",
    ctaVariant: "solid",
  },
  {
    title: "Product Update: New Creator Tools",
    body: "We shipped creator tool improvements to help creators manage their audience and monetize content more easily.",
    cta: "Read More",
    ctaVariant: "outline",
  },
  {
    title: "Community Spotlight: Success Stories",
    body: "Read how communities on Pintree are building meaningful connections and launching collaborative projects.",
    cta: "Read More",
    ctaVariant: "outline",
  },
  {
    title: "Design Refresh & Accessibility Improvements",
    body: "A cleaner UI, better contrast, and keyboard navigation improvements make Pintree more welcoming to everyone.",
    cta: "Read More",
    ctaVariant: "solid",
  },
];

export default function Section8() {
  const trackRef = useRef(null);
  const cardRefs = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Ensure cardRefs array is same length as cards
  cardRefs.current = [];

  const scrollToIndex = (index) => {
    const clamped = Math.min(Math.max(index, 0), cards.length - 1);
    const node = cardRefs.current[clamped];
    if (node && trackRef.current) {
      // scroll the card into view horizontally, centered when possible
      node.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
      setCurrentIndex(clamped);
    }
  };

  const handlePrev = () => scrollToIndex(currentIndex - 1);
  const handleNext = () => scrollToIndex(currentIndex + 1);

  return (
    <section className="py-[71px] md:py-[197px] bg-[#F1FBE8]">
      <div className="container mx-auto px-5 xl:px-32 3xl:px-12 ">
        <div className="flex  flex-col lg:flex-row items-start justify-between gap-[32px]">
          {/* Left column */}
          <div className="w-full lg:w-1/3 rounded ">
            <h1 className="font-aeonik-medium  text-[28px] sm:text-[32px] lg:text-[48px] 2xl:text-[56px]  text-[#1A1A1A] text-center lg:text-left">
              What’s New at Pintree
            </h1>
            <p className="text-center lg:text-left text-[16px] sm:text-[18px] xl:text-[20px]  font-aeonik-regular  text-[#1A1A1A] leading-[140%] mt-[17px] sm:mt-[8px] px-[44px] md:px-0">
              Explore the latest stories, product
              <br className="hidden md:inline-block" /> updates, and insights
              from our
              <br className="hidden md:inline-block" /> newsroom and blog.
            </p>

            {/* Desktop arrows (visible lg+) */}
            <div className="hidden lg:flex gap-6 mt-20">
              <button
                onClick={handlePrev}
                aria-label="Previous"
                className="p-1 disabled:opacity-40"
                disabled={currentIndex <= 0}
              >
                <AiTwotoneLeftCircle className="text-4xl" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next"
                className="p-1 disabled:opacity-40"
                disabled={currentIndex >= cards.length - 1}
              >
                <AiTwotoneRightCircle className="text-4xl" />
              </button>
            </div>
          </div>

          {/* Carousel track */}
          <div className="w-full lg:w-2/3">
            <div ref={trackRef} className="relative">
              {/* Horizontal scrollable track */}
              <div
                className="flex gap-[32px] overflow-x-auto scroll-smooth py-2 px-1 lg:px-0 no-scrollbar"
                style={{ scrollSnapType: "x mandatory" }}
              >
                {cards.map((card, idx) => (
                  <article
                    key={idx}
                    ref={(el) => (cardRefs.current[idx] = el)}
                    className={`
                      flex-shrink-0
                      bg-white border border-[#E7E7E7] rounded
                      px-[25px] 2xl:px-[55px] py-[34px] 2xl:py-[64px]
                      scroll-snap-align: center;
                      ${
                        // widths: full width on mobile, fixed on lg to match your original
                        "w-[312px] md:w-[48%] xl:w-[339px] 2xl:w-[449px]"
                      }
                    `}
                  >
                    <h2 className="text-[#1A1A1A] text-[20px] sm:text-[20px]  font-aeonik-medium">
                      {card.title}
                    </h2>
                    <p className="text-[#333333] text-[16px] font-aeonik-regular pt-3">
                      {card.body}
                    </p>
                    <button
                      className="w-[144px] h-[48px] rounded-[24px] mt-[51px] 
                       
                          border border-[#1A1A1A] bg-white text-[#333333] hover:bg-[#1A1A1A] hover:text-white"
                    >
                      {card.cta}
                    </button>
                  </article>
                ))}
              </div>

              {/* Mobile arrows (visible < lg) */}
              <div className="flex lg:hidden justify-between mt-6">
                <button
                  onClick={handlePrev}
                  aria-label="Previous"
                  className="p-1 disabled:opacity-40"
                  disabled={currentIndex <= 0}
                >
                  <AiTwotoneLeftCircle className="text-4xl" />
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Next"
                  className="p-1 disabled:opacity-40"
                  disabled={currentIndex >= cards.length - 1}
                >
                  <AiTwotoneRightCircle className="text-4xl" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
