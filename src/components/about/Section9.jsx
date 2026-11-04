"use client";

import { useState } from "react";
import Link from "next/link";

const faqItems = [
  {
    question: "What is Pintree?",
    answer:
      "Pintree is a community-first social platform designed to make online interaction feel more organized, meaningful, and human. We bring together personal connections, interest-based groups, and serendipitous discovery in one calm, considered digital environment.",
  },
  {
    question: "How is Pintree different from other social platforms?",
    answer:
      "Unlike traditional platforms driven by viral engagement algorithms and infinite feeds, Pintree is built around intentional participation. We prioritize focused discussions, authentic community rooms, and thoughtful dialogue over vanity metrics.",
  },
  {
    question: "What are Pintree communities?",
    answer:
      "Communities are dedicated shared spaces centered around shared passions, cultural circles, local collectives, and organizations. They allow members to engage in focused topical threads and build lasting connections.",
  },
  {
    question: "What are Rooms, and how do they work?",
    answer:
      "Rooms are intimate, topic-specific spaces within communities for deeper conversation. Whether it's a weekly reflection salon, an open workshop, or an ongoing collaborative project, Rooms keep discussions structured and distraction-free.",
  },
  {
    question: "Who can join Pintree?",
    answer:
      "Pintree is open to anyone seeking a more mindful, human-centric way to connect online—including creators, thinkers, community organizers, and everyday people looking for genuine belonging.",
  },
  {
    question: "How can I control my privacy on Pintree?",
    answer:
      "You maintain full sovereignty over your space. Pintree provides granular controls over who can discover your profile, join your conversations, and access your community rooms, with transparent data policies and zero intrusive tracking.",
  },
];

function ArrowRightIcon() {
  return (
    <svg
      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      className="h-4 w-4 text-black"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        d="M12 4.5v15m7.5-7.5h-15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg
      className="h-4 w-4 text-black"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path d="M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ForumIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z" />
    </svg>
  );
}

export default function Section9() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section
      aria-labelledby="faq-main-heading"
      className="w-full bg-[#fcf9f8] py-20 font-jakarta text-[#1b1c1c] lg:py-24"
    >
      <div className="mx-auto w-full max-w-[1340px] px-8">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-x-20">
          {/* Left column */}
          <div className="lg:sticky lg:top-24 lg:col-span-5 lg:pt-2">
            <div className="mb-6 inline-flex items-center gap-2.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#baee97] ring-4 ring-[#CAFFA6]/30" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#444748]">
                Questions &amp; Answers
              </span>
            </div>

            <h2
              id="faq-main-heading"
              className="font-aeonik-regular text-[36px] font-normal leading-[1.15] tracking-tight text-black sm:text-[44px] lg:text-5xl"
            >
              Answers to your questions.
            </h2>

            <p className="mb-10 mt-5 max-w-sm font-jakarta text-[18px] font-normal leading-7 tracking-[-0.005em] text-[#444748]">
              Everything you need to know about Pintree.
            </p>

            <div>
              <Link
                href="/support"
                className="group inline-flex items-center gap-2.5 rounded-full border border-black px-7 py-3.5 text-[15px] font-semibold leading-5 tracking-[0.01em] text-black transition-all duration-200 hover:bg-black hover:text-white active:scale-[0.98]"
              >
                <span>Contact support</span>
                <ArrowRightIcon />
              </Link>
            </div>

            <div className="mt-16 max-w-xs border-t border-[#e4e2e1]/70 pt-8">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0eded] text-[#444748]">
                  <ForumIcon />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#1b1c1c]">
                    Human Support
                  </div>
                  <div className="text-[14px] font-normal leading-5 tracking-[0.005em] text-[#444748]">
                    Average response under 24 hours
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column — accordion */}
          <div className="lg:col-span-7">
            <div className="flex w-full flex-col">
              {faqItems.map((item, index) => {
                const isOpen = openIndex === index;
                const isLast = index === faqItems.length - 1;
                const contentId = `faq-content-${index + 1}`;

                return (
                  <div
                    key={item.question}
                    className={`border-t border-[#e4e2e1] transition-colors duration-150 ${
                      isLast ? "border-b" : ""
                    }`}
                  >
                    <button
                      type="button"
                      aria-controls={contentId}
                      aria-expanded={isOpen}
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="group flex w-full items-center justify-between py-6 text-left focus:outline-none"
                    >
                      <span className="pr-6 font-aeonik-medium text-[18px] font-medium leading-7 tracking-[-0.005em] text-black transition-colors">
                        {item.question}
                      </span>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors">
                        {isOpen ? <MinusIcon /> : <PlusIcon />}
                      </span>
                    </button>

                    <div
                      id={contentId}
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <p className="pb-6 pr-12 font-jakarta text-[16px] font-normal leading-6 text-[#444748]">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
