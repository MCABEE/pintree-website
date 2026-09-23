"use client";

import React from "react";

const sectionWrap =
  "mx-auto w-[calc(100%-40px)] max-w-[968px] sm:w-[calc(100%-64px)] lg:w-[calc(100%-80px)]";

const newsCards = [
  {
    title:
      "Pintree launches new community features to strengthen meaningful connections.",
    description:
      "Pintree introduces a fresh approach to online interaction, bringing users, creators, and communities together in a space designed for active participation.",
  },
  {
    title:
      "Pintree introduces a fresh social platform for expression and discovery.",
    description:
      "Pintree offers a cleaner space for sharing, exploring, and connecting through dedicated rooms and community feeds.",
  },
  {
    title: "Building organized spaces for tomorrow's digital communities.",
    description:
      "Discover how Pintree's room architecture enables collaboration and interest-driven discussions without algorithm overload.",
  },
];

function NewsCard({ card }) {
  return (
    <article className="group flex min-h-[270px] flex-col justify-between rounded-[20px] border border-white/10 bg-[#181818] p-7 sm:min-h-[290px]">
      <div className="text-left">
        <h3 className="text-[17px] font-aeonik-medium font-medium leading-[1.35] text-white sm:text-[18px]">
          {card.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-[13px] leading-[1.45] font-aeonik-regular font-normal text-[#888888] sm:text-[13.5px]">
          {card.description}
        </p>
      </div>
      <div className="mt-6 pt-2">
        <div className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
              d="M3.33331 8H12.6666"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M8.66663 4L12.6666 8L8.66663 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </article>
  );
}

export default function Section7() {
  return (
    <section className="w-full overflow-hidden bg-[#0C0C0C] py-[60px] sm:py-[80px] lg:py-[90px]">
      <div className={sectionWrap}>
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="text-left">
            <h2 className="text-[28px] font-aeonik-medium font-medium leading-[1.15] tracking-[-0.02em] text-white sm:text-[36px] lg:text-[42px]">
              What&apos;s now at Pintree
            </h2>
            <p className="mt-2 max-w-[500px] text-[13px] font-aeonik-regular font-normal text-[#999999] sm:text-[14px]">
              The latest updates, stories, and things happening around Pintree.
            </p>
          </div>
          <div className="hidden shrink-0 sm:flex">
            <div className="inline-flex h-[44px] w-[44px] items-center justify-center rounded-full border border-white/25 bg-[#1A1A1A] text-white">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path
                  d="M4.16669 10H15.8334"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M10.8334 5L15.8334 10L10.8334 15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="mt-[36px] grid grid-cols-1 gap-5 sm:mt-[48px] md:grid-cols-2 lg:grid-cols-3">
          {newsCards.map((card) => (
            <NewsCard key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
