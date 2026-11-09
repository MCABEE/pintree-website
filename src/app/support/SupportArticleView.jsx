"use client";

import Link from "next/link";
import { useState } from "react";

function BackLink() {
  return (
    <Link
      href="/support"
      className="group inline-flex items-center gap-2.5 text-[14px] font-medium tracking-wide text-[#666666] transition-colors hover:text-[#202020]"
    >
      <svg
        className="h-4 w-4 stroke-current transition-transform group-hover:-translate-x-1"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
        />
      </svg>
      <span>Back to Help Center</span>
    </Link>
  );
}

function renderBlock(block, index) {
  if (!block) return null;
  const key = block.id || `block-${index}`;

  switch (block.type) {
    case "HEADING_2":
      return (
        <h2
          key={key}
          id={block.anchor || undefined}
          className="font-aeonik-regular mb-4 mt-10 text-[24px] font-normal leading-[1.3] tracking-[-0.015em] text-[#202020] md:text-[28px] md:leading-[1.28]"
        >
          {block.text}
        </h2>
      );

    case "HEADING_3":
      return (
        <h3
          key={key}
          id={block.anchor || undefined}
          className="font-aeonik-regular mb-3 mt-8 text-[20px] font-normal leading-[1.3] tracking-[-0.01em] text-[#202020] md:text-[22px]"
        >
          {block.text}
        </h3>
      );

    case "PARAGRAPH":
      return (
        <p
          key={key}
          className="mb-5 text-[17px] leading-[1.76] text-[#525252] last:mb-0"
        >
          {block.text}
        </p>
      );

    case "IMAGE":
      return (
        <figure key={key} className="my-10">
          <div className="aspect-[16/9] w-full overflow-hidden rounded-md border border-[#E5E5E5] bg-[#F7F7F7]">
            <img
              src={block.imageUrl}
              alt={block.title || block.text || ""}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          {block.title || block.attribution ? (
            <figcaption className="mt-2.5 font-jakarta text-[13px] text-[#777777]">
              {block.title || block.attribution}
            </figcaption>
          ) : null}
        </figure>
      );

    case "BULLET_LIST":
      return (
        <div key={key} className="mb-8">
          {block.title ? (
            <h3 className="font-aeonik-regular mb-3 text-[20px] font-normal text-[#202020]">
              {block.title}
            </h3>
          ) : null}
          <ul className="my-4 space-y-2.5 pl-6 list-disc font-jakarta text-[16px] leading-[1.65] text-[#525252] sm:text-[17px]">
            {block.items?.map((item, itemIdx) => (
              <li key={item.id || itemIdx}>{item.text}</li>
            ))}
          </ul>
        </div>
      );

    case "NUMBERED_LIST":
      return (
        <div key={key} className="mb-8">
          {block.title ? (
            <h3 className="font-aeonik-regular mb-3 text-[20px] font-normal text-[#202020]">
              {block.title}
            </h3>
          ) : null}
          <ol className="my-4 space-y-2.5 pl-6 list-decimal font-jakarta text-[16px] leading-[1.65] text-[#525252] sm:text-[17px]">
            {block.items?.map((item, itemIdx) => (
              <li key={item.id || itemIdx}>{item.text}</li>
            ))}
          </ol>
        </div>
      );

    case "QUOTE":
      return (
        <blockquote
          key={key}
          className="my-10 rounded-r-md border-l-2 border-[#202020] bg-[#F7F7F7] px-6 py-6 sm:px-8 sm:py-8"
        >
          <p className="mb-3 font-jakarta text-[20px] font-normal italic leading-[1.4] text-[#202020] sm:text-[23px]">
            “{block.text}”
          </p>
          {block.attribution ? (
            <cite className="block font-jakarta text-[13px] font-medium not-italic text-[#777777]">
              — {block.attribution}
            </cite>
          ) : null}
        </blockquote>
      );

    case "CALLOUT":
      return (
        <div
          key={key}
          className="my-8 rounded-md border border-[#E5E5E5] bg-[#F7F7F7] p-6"
        >
          {block.title ? (
            <h4 className="mb-2 font-jakarta text-[16px] font-semibold text-[#202020]">
              {block.title}
            </h4>
          ) : null}
          <p className="text-[15px] leading-relaxed text-[#525252]">
            {block.text}
          </p>
        </div>
      );

    case "DIVIDER":
      return <hr key={key} className="my-10 border-[#E5E5E5]" />;

    default:
      if (block.text) {
        return (
          <p key={key} className="mb-5 text-[17px] leading-[1.76] text-[#525252]">
            {block.text}
          </p>
        );
      }
      return null;
  }
}

export default function SupportArticleView({ article, topicName, related = [] }) {
  const [feedback, setFeedback] = useState(null);

  return (
    <main className="mx-auto min-h-screen w-full max-w-[1536px] px-4 py-10 font-jakarta sm:px-8 sm:py-16 md:px-16 lg:px-32">
      <div className="mx-auto max-w-[1280px]">
        <nav className="mb-10 sm:mb-14">
          <BackLink />
        </nav>

        {/* Article Header */}
        <header className="mx-auto mb-10 max-w-[980px] text-left sm:mb-14 md:text-center">
          {topicName ? (
            <div className="mb-5 flex items-center gap-3 text-[13px] font-semibold uppercase tracking-wider text-[#777777] md:justify-center">
              <span className="inline-flex items-center gap-1.5 rounded border border-[#E5E5E5] bg-[#F7F7F7] px-2.5 py-1 text-[11px] font-medium tracking-widest text-[#204654]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#CAFFA6]" />
                {topicName}
              </span>
            </div>
          ) : null}

          <h1 className="font-aeonik-regular mx-auto mb-6 max-w-[880px] text-[32px] font-normal leading-[1.2] tracking-[-0.025em] text-[#202020] md:text-[44px] md:leading-[1.16]">
            {article.headline}
          </h1>

          {article.excerpt ? (
            <p className="mx-auto max-w-[760px] font-jakarta text-[17px] leading-[1.65] text-[#525252] sm:text-[18px]">
              {article.excerpt}
            </p>
          ) : null}
        </header>

        {/* Hero image if available */}
        {article.heroImageUrl ? (
          <figure className="mx-auto mb-14 max-w-[1120px] sm:mb-16">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md border border-[#E5E5E5] bg-[#F7F7F7]">
              <img
                src={article.heroImageUrl}
                alt={article.headline || ""}
                className="h-full w-full object-cover object-center"
              />
            </div>
          </figure>
        ) : null}

        {/* Content Body */}
        <article className="mx-auto max-w-[760px] font-jakarta">
          {Array.isArray(article.blocks) && article.blocks.length > 0 ? (
            <div className="mb-12">
              {article.blocks.map((block, index) => renderBlock(block, index))}
            </div>
          ) : article.content ? (
            <div className="mb-12 text-[17px] leading-[1.76] text-[#525252]">
              <p>{article.content}</p>
            </div>
          ) : null}

          {/* Feedback Prompt */}
          <div className="my-12 flex flex-col items-center justify-between gap-4 rounded-xl border border-[#E5E5E5] bg-[#F7F7F7] p-6 sm:flex-row sm:p-8">
            <div>
              <h3 className="text-[16px] font-semibold text-[#202020]">
                Was this article helpful?
              </h3>
              <p className="text-[13px] text-[#666666]">
                Your feedback helps us continuously improve Pintree Help Center.
              </p>
            </div>
            {feedback ? (
              <span className="text-[14px] font-medium text-[#204654]">
                Thank you for your feedback!
              </span>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setFeedback("yes")}
                  className="rounded-full border border-[#202020] bg-white px-5 py-2 text-xs font-semibold text-[#202020] transition-colors hover:bg-black hover:text-white"
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setFeedback("no")}
                  className="rounded-full border border-[#E5E5E5] bg-white px-5 py-2 text-xs font-semibold text-[#666666] transition-colors hover:border-[#202020] hover:text-[#202020]"
                >
                  No
                </button>
              </div>
            )}
          </div>
        </article>

        {/* Related Articles in Same Topic */}
        {related.length > 0 ? (
          <section className="mt-20 border-t border-[#E5E5E5] pt-16">
            <div className="mb-10 flex flex-col justify-between gap-3 md:flex-row md:items-end">
              <div>
                <span className="mb-2 block font-jakarta text-[12px] font-semibold uppercase tracking-wider text-[#777777]">
                  Related Help
                </span>
                <h3 className="font-aeonik-regular text-[28px] font-normal leading-tight text-[#202020] sm:text-[32px]">
                  More from {topicName || "this topic"}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.id || item.slug}
                  href={`/support/${item.slug}`}
                  className="group flex flex-col justify-between rounded-xl border border-[#E5E5E5] bg-white p-6 transition-all hover:border-[#D4D4D4] hover:bg-[#FCFCFC]"
                >
                  <div>
                    <h4 className="mb-2 text-[17px] font-semibold text-[#202020] transition-colors group-hover:text-[#204654]">
                      {item.headline}
                    </h4>
                    {item.excerpt ? (
                      <p className="line-clamp-2 text-[13px] leading-relaxed text-[#666666]">
                        {item.excerpt}
                      </p>
                    ) : null}
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#202020] transition-transform group-hover:translate-x-1">
                    <span>Read Article</span>
                    <span>→</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {/* Still Need Help Box */}
        <section className="mt-20 rounded-[16px] border border-[#E5E5E5] bg-[#F7F7F7] p-8 text-center sm:p-12 md:p-14">
          <div className="mx-auto max-w-[620px]">
            <h2 className="font-aeonik-regular mb-3 text-[26px] font-normal tracking-[-0.015em] text-[#202020] md:text-[30px]">
              Still need assistance?
            </h2>
            <p className="mb-8 text-[15px] font-normal leading-[1.6] text-[#666666] md:text-[16px]">
              Our dedicated support team is ready to help resolve your questions or technical issues.
            </p>
            <Link
              href="/support"
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[8px] bg-black px-7 py-3.5 text-[14px] font-medium text-white shadow-sm transition-all hover:bg-[#202020]"
            >
              <span>Back to Help Center</span>
              <span className="text-[#CAFFA6]" aria-hidden>
                →
              </span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

