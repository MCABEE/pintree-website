"use client";

import React, { useState } from "react";
import Link from "next/link";

const sectionWrap =
  "mx-auto w-full max-w-[1536px] px-6 sm:px-10 lg:px-[136px]";

const faqItems = [
  {
    question: "The creative platform to direct your best work.",
    answer:
      "Pintree gives you one place to share, connect, and grow—built for people who want their work and communities to stay organized and visible.",
  },
  {
    question: "More than 1 million subscribers across creatives, enterprises?",
    answer:
      "Our community spans creators, teams, and organizations who use Pintree for meaningful participation—not passive scrolling.",
  },
  {
    question: "The creative platform to direct?",
    answer:
      "You control what you share, who sees it, and which communities you join, with tools designed for clarity and purpose.",
  },
  {
    question: "More than 1 million subscribers across creativesp?",
    answer:
      "From solo creators to larger groups, Pintree scales with how you work and how your audience engages.",
  },
  {
    question: "More than 1 million p subscribers across creatives?",
    answer:
      "Join a growing network of people building focused spaces for conversation, discovery, and collaboration.",
  },
];

function PlusIcon({ open }) {
  return (
    <span
      className="flex h-6 w-6 shrink-0 items-center justify-center text-[22px] font-light leading-none text-[#B0B0B0]"
      aria-hidden
    >
      {open ? "−" : "+"}
    </span>
  );
}

export default function Section9() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="w-full bg-white py-[56px] sm:py-[72px] lg:py-[96px]">
      <div className={sectionWrap}>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-[80px] xl:gap-[120px]">
          <div className="shrink-0 text-left lg:max-w-[420px] xl:max-w-[480px]">
            <h2 className="text-[32px] font-aeonik-medium font-medium leading-[1.12] tracking-[-0.02em] text-[#0C0C0C] sm:text-[40px] lg:text-[44px] xl:text-[48px]">
              Answers to your top question&apos;s
            </h2>
            <Link
              href="/support"
              className="mt-[28px] inline-flex h-[44px] items-center justify-center rounded-[10px] border border-[#D8D8D8] bg-white px-7 text-[14px] font-aeonik-medium font-medium text-[#1A1A1A] transition-colors hover:border-[#B8B8B8] sm:mt-[32px] sm:text-[15px]"
            >
              Contact support
            </Link>
          </div>

          <div className="min-w-0 flex-1 lg:max-w-[640px]">
            <ul className="divide-y divide-[#E8E8E8]">
              {faqItems.map((item, index) => {
                const isOpen = openIndex === index;
                return (
                  <li key={item.question}>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenIndex(isOpen ? null : index)
                      }
                      className="flex w-full items-start justify-between gap-6 py-[18px] text-left sm:py-[20px]"
                      aria-expanded={isOpen}
                    >
                      <span className="text-[14px] font-aeonik-regular font-normal leading-[1.45] text-[#1A1A1A] sm:text-[15px]">
                        {item.question}
                      </span>
                      <PlusIcon open={isOpen} />
                    </button>
                    {isOpen ? (
                      <p className="pb-[18px] pr-10 text-[13px] leading-[1.5] font-aeonik-regular text-[#555555] sm:pb-[20px] sm:text-[14px]">
                        {item.answer}
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
