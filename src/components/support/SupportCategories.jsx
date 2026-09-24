"use client";

import Link from "next/link";

const supportCards = [
  {
    title: (
      <>
        Quick answers,
        <br />
        Anytime !
      </>
    ),
    description: (
      <>
        Find quick answers to common
        <br />
        questions about Pintree.
      </>
    ),
    buttonLabel: "FAQ",
    href: "/contact-quick-answer",
  },
  {
    title: (
      <>
        Need Support?
        <br />
        Help Center
      </>
    ),
    description: (
      <>
        Get help with using Pintree, your account,
        <br />
        and common issues.
      </>
    ),
    buttonLabel: "Help Center",
    href: "/contact-found-a-problem",
  },
  {
    title: (
      <>
        Press &
        <br />
        Media resources
      </>
    ),
    description: (
      <>
        Find information, resources, and contacts
        <br />
        for media and press inquiries.
      </>
    ),
    buttonLabel: "Press & Media",
    href: "/newsroom",
  },
];

export default function SupportCategories() {
  return (
    <section className="bg-black px-6 py-16 sm:px-10 sm:py-20 lg:px-[136px] lg:py-24">
      <div className="mx-auto w-full max-w-[1536px] text-left">
        <header className="max-w-[640px]">
          <h2 className="text-[32px] font-aeonik-medium leading-[1.12] tracking-[-0.02em] text-white sm:text-[38px] lg:text-[44px] lg:leading-[1.08]">
            Looking for answers,
            <br />
            support, or media information?
          </h2>
          <p className="mt-5 max-w-[560px] text-[14px] leading-[1.55] font-aeonik-regular text-[#9A9A9A] sm:text-[15px] lg:mt-6">
            Choose the section that best matches what you need, and we&apos;ll
            help you find the right information or contact the right team.
          </p>
        </header>

        <div className="mt-12 grid grid-cols-1 items-stretch gap-4 sm:mt-14 md:grid-cols-3 md:gap-5 lg:mt-16">
          {supportCards.map((card) => (
            <article
              key={card.buttonLabel}
              className="box-border flex h-[260px] w-full max-w-[320px] flex-col rounded-[10px] bg-[#1A1A1A] pl-[28px] pr-[32px] pt-[40px] pb-[32px] text-left md:justify-self-start"
            >
              <div className="flex min-h-0 flex-1 flex-col">
                <h3 className="text-[16px] font-aeonik-medium leading-[1.2] text-white">
                  {card.title}
                </h3>
                <p className="mt-2.5 text-[13px] leading-[1.45] font-aeonik-regular text-[#9A9A9A]">
                  {card.description}
                </p>
              </div>
              <Link
                href={card.href}
                className="inline-flex h-[36px] w-[120px] shrink-0 items-center justify-center self-start rounded-[7px] border border-white/30 bg-transparent text-[13px] font-aeonik-regular text-white transition-colors hover:border-white/50 hover:bg-white/[0.06]"
              >
                {card.buttonLabel}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
