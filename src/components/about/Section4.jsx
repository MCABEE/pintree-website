"use client";

import Link from "next/link";

const columns = [
  {
    title: "Our Story",
    body: "From an idea to a platform built around people, communities, and conversations.",
    linkText: "OUR STORY",
    linkHref: "#",
    className:
      "flex flex-col border-b border-[#E5E5E5] pb-8 pr-8 md:border-b-0 md:border-r md:pb-0 md:pr-10",
  },
  {
    title: "The Company",
    body: "Meet the team and the company building Pintree for a more connected social experience.",
    linkText: "ABOUT MCABEE",
    linkHref: "#",
    className:
      "flex flex-col border-b border-[#E5E5E5] px-0 py-8 md:border-b-0 md:border-r md:px-10 md:py-0",
  },
  {
    title: "Our Approach",
    body: "A thoughtful approach to building social spaces around connection, participation, and discovery.",
    linkText: "OUR APPROACH",
    linkHref: "#",
    className: "flex flex-col pl-0 pt-8 md:pl-10 md:pt-0",
  },
];

export default function Section4() {
  return (
    <section className="w-full border-[#E5E5E5] bg-white pb-12 font-jakarta text-[#202020]">
      <div className="mx-auto w-full max-w-[1340px] px-8">
        <div className="pb-10 pt-12">
          <div className="flex flex-col">
            <div className="mb-3.5 flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-[#CAFFA6] ring-2 ring-[#e6ffd1]" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#525252]">
                ABOUT
              </span>
            </div>

            <h2 className="max-w-2xl font-aeonik-regular text-[32px] font-normal leading-[1.25] tracking-tight text-[#202020] sm:text-[40px] lg:text-[48px]">
              Built around people, communities, and conversations.
            </h2>

            <p className="mt-4 max-w-[620px] text-[16px] font-normal leading-[1.65] text-[#525252]">
              Pintree is a community-first social platform designed to make online
              interaction feel more organized, meaningful, and human. From personal
              connections to shared-interest communities, Pintree creates spaces where
              conversations can grow with purpose.
            </p>
          </div>

          <div className="my-12 w-full border-b border-[#E5E5E5]" />

          <div className="grid grid-cols-1 gap-0 md:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title} className={col.className}>
                <h3 className="font-aeonik-medium text-[24px] font-medium text-[#202020]">
                  {col.title}
                </h3>
                <p className="mb-6 mt-2.5 font-jakarta text-[16px] leading-relaxed text-[#666666]">
                  {col.body}
                </p>
                <div className="mt-auto">
                  <Link
                    href={col.linkHref}
                    className="inline-flex items-center text-[11px] font-semibold uppercase tracking-wider text-[#202020] transition-opacity hover:opacity-70"
                  >
                    {col.linkText}{" "}
                    <span className="ml-1.5 font-normal">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
