"use client";

import Link from "next/link";
import { useState } from "react";

function BackLink() {
  return (
    <Link
      href="/newsroom"
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
      <span>Back to Newsroom</span>
    </Link>
  );
}

function ReadStoryLink({ href }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 font-jakarta text-[14px] font-medium text-[#202020] transition-colors group-hover:text-[#204654]"
    >
      <span>Read Story</span>
      <svg
        className="h-4 w-4 transition-transform group-hover:translate-x-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
        />
      </svg>
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

export default function ArticleView({ article, related }) {
  const [copied, setCopied] = useState(false);
  const sameCategoryRelated = (related || []).filter(
    (item) =>
      item &&
      item.slug !== article?.slug &&
      (!article?.category ||
        item.category === article.category ||
        (item.categoryRaw && item.categoryRaw === article.categoryRaw))
  );
  const shareUrl = () =>
    typeof window === "undefined" ? "" : window.location.href;

  function openShare(base) {
    const url = shareUrl();
    if (!url) return;
    const share = new URL(base);
    if (base.includes("twitter.com")) {
      share.searchParams.set("url", url);
      share.searchParams.set("text", article.title);
    } else if (base.includes("linkedin.com")) {
      share.searchParams.set("url", url);
    } else {
      share.searchParams.set("u", url);
    }
    window.open(share.toString(), "_blank", "noopener,noreferrer");
  }

  async function copyLink() {
    const url = shareUrl();
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  async function shareOnPintree() {
    const url = shareUrl();
    if (navigator.share && url) {
      try {
        await navigator.share({ title: article.title, url });
        return;
      } catch {
        return;
      }
    }
    copyLink();
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-[1536px] px-4 py-10 font-jakarta sm:px-8 sm:py-16 md:px-16 lg:px-32">
      <div className="mx-auto max-w-[1280px]">
        <nav className="mb-10 sm:mb-14">
          <BackLink />
        </nav>

        <header className="mx-auto mb-10 max-w-[980px] text-left sm:mb-14 md:text-center">
          <div className="mb-5 flex items-center gap-3 text-[13px] font-semibold uppercase tracking-wider text-[#777777] md:justify-center">
            <span className="inline-flex items-center gap-1.5 rounded border border-[#E5E5E5] bg-[#F7F7F7] px-2.5 py-1 text-[11px] font-medium tracking-widest text-[#204654]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#CAFFA6]" />
              {article.category}
            </span>
            <span className="text-[#E5E5E5]">·</span>
            <time
              dateTime={article.dateTime}
              className="font-normal normal-case tracking-normal text-[#777777]"
            >
              {article.date}
            </time>
          </div>

          <h1 className="font-aeonik-regular mx-auto mb-6 max-w-[880px] text-[34px] font-normal leading-[1.2] tracking-[-0.025em] text-[#202020] md:text-[48px] md:leading-[1.16]">
            {article.title}
          </h1>

          {article.summary ? (
            <p className="mx-auto max-w-[760px] font-jakarta text-[17px] leading-[1.65] text-[#525252] sm:text-[18px] md:mx-auto">
              {article.summary}
            </p>
          ) : null}

          <div className="mt-8 flex items-center justify-between gap-6 border-t border-[#E5E5E5] pt-8 font-jakarta text-[13px] text-[#777777] md:justify-center">
            <div className="flex items-center gap-3">
              <img
                src={article.authorImage}
                alt="Pintree"
                className="h-6 w-6 shrink-0 rounded-full object-cover"
              />
              <span>
                Published by{" "}
                <strong className="font-medium text-[#202020]">
                  {article.author}
                </strong>
              </span>
            </div>
            <span className="hidden text-[#E5E5E5] sm:inline">·</span>
            <span className="hidden sm:inline">{article.readTime}</span>
          </div>
        </header>

        {article.image ? (
          <figure className="mx-auto mb-14 max-w-[1120px] sm:mb-16">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md border border-[#E5E5E5] bg-[#F7F7F7]">
              <img
                src={article.image}
                alt={article.imageAlt || ""}
                className="h-full w-full object-cover object-center"
              />
            </div>
            {article.caption ? (
              <figcaption className="mt-3 text-center font-jakarta text-[13px] text-[#777777] md:text-left">
                {article.caption}
              </figcaption>
            ) : null}
          </figure>
        ) : null}

        <article className="mx-auto max-w-[760px] font-jakarta">
          {Array.isArray(article.blocks) && article.blocks.length > 0 ? (
            <div className="mb-10">
              {article.blocks.map((block, index) => renderBlock(block, index))}
            </div>
          ) : (
            <>
              {article.lead || article.paragraphs?.length ? (
                <div className="mb-10 space-y-6">
                  {article.lead ? (
                    <p className="text-[18px] font-normal leading-[1.8] text-[#202020] sm:text-[19px]">
                      {article.lead}
                    </p>
                  ) : null}
                  {article.paragraphs?.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-[17px] leading-[1.76] text-[#525252]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : null}

              {article.sections?.map((section) => {
                if (section.type === "quote") {
                  return (
                    <blockquote
                      key={section.text}
                      className="my-10 rounded-r-md border-l-2 border-[#202020] bg-[#F7F7F7] px-6 py-6 sm:px-8 sm:py-8"
                    >
                      <p className="mb-3 font-jakarta text-[20px] font-normal italic leading-[1.4] text-[#202020] sm:text-[23px]">
                        “{section.text}”
                      </p>
                      <cite className="block font-jakarta text-[13px] font-medium not-italic text-[#777777]">
                        — {section.cite}
                      </cite>
                    </blockquote>
                  );
                }

                if (section.type === "figure") {
                  return (
                    <figure key={section.image} className="my-10">
                      <div className="aspect-[16/9] w-full overflow-hidden rounded-md border border-[#E5E5E5] bg-[#F7F7F7]">
                        <img
                          src={section.image}
                          alt={section.imageAlt || ""}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      {section.caption ? (
                        <figcaption className="mt-2.5 font-jakarta text-[13px] text-[#777777]">
                          {section.caption}
                        </figcaption>
                      ) : null}
                    </figure>
                  );
                }

                if (section.type === "list") {
                  return (
                    <div key={section.heading} className="mb-10">
                      <h2 className="font-aeonik-regular mb-4 text-[24px] font-normal leading-[1.3] tracking-[-0.015em] text-[#202020] md:text-[28px] md:leading-[1.28]">
                        {section.heading}
                      </h2>
                      {section.intro ? (
                        <p className="mb-6 text-[17px] leading-[1.76] text-[#525252]">
                          {section.intro}
                        </p>
                      ) : null}
                      <ul className="my-6 space-y-4 pl-1 font-jakarta text-[16px] leading-[1.65] sm:text-[17px]">
                        {section.items.map((item, index) => (
                          <li key={item.title} className="flex items-start gap-3">
                            <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#CAFFA6] text-[11px] font-bold text-[#204654]">
                              {index + 1}
                            </span>
                            <div>
                              <strong className="font-semibold text-[#202020]">
                                {item.title}
                              </strong>
                              <span className="text-[#525252]"> — {item.text}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                }

                return (
                  <div key={section.heading} className="mb-10">
                    <h2 className="font-aeonik-regular mb-4 text-[24px] font-normal leading-[1.3] tracking-[-0.015em] text-[#202020] md:text-[28px] md:leading-[1.28]">
                      {section.heading}
                    </h2>
                    {section.paragraphs?.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="mb-5 text-[17px] leading-[1.76] text-[#525252] last:mb-0"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                );
              })}
            </>
          )}

          <div className="flex flex-col items-start justify-between gap-4 border-y border-[#E5E5E5] py-8 sm:flex-row sm:items-center">
            <div className="text-[12px] font-semibold uppercase tracking-wider text-[#777777]">
              Share this article
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Copy article link"
                title="Copy Link"
                onClick={copyLink}
                className="inline-flex items-center gap-1.5 rounded border border-[#E5E5E5] bg-[#F7F7F7] px-3 py-1.5 text-[13px] font-medium text-[#202020] transition-colors hover:bg-[#E5E5E5]"
              >
                <svg
                  className="h-4 w-4 text-[#666666]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                <span>{copied ? "Copied" : "Copy link"}</span>
              </button>
              <button
                type="button"
                aria-label="Share on X"
                title="Share on X"
                onClick={() => openShare("https://twitter.com/intent/tweet")}
                className="flex h-8 w-8 items-center justify-center rounded border border-[#E5E5E5] bg-[#F7F7F7] text-[#202020] transition-colors hover:bg-[#E5E5E5]"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" aria-hidden>
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Share on LinkedIn"
                title="Share on LinkedIn"
                onClick={() =>
                  openShare("https://www.linkedin.com/sharing/share-offsite/")
                }
                className="flex h-8 w-8 items-center justify-center rounded border border-[#E5E5E5] bg-[#F7F7F7] text-[#202020] transition-colors hover:bg-[#E5E5E5]"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" aria-hidden>
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Share on Facebook"
                title="Share on Facebook"
                onClick={() => openShare("https://www.facebook.com/sharer/sharer.php")}
                className="flex h-8 w-8 items-center justify-center rounded border border-[#E5E5E5] bg-[#F7F7F7] text-[#202020] transition-colors hover:bg-[#E5E5E5]"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" aria-hidden>
                  <path d="M22 12c0-5.523-4.477-10-10-10s-10 4.477-10 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54v-2.891h2.54v-2.203c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.876h2.773l-.443 2.891h-2.33v6.988c4.781-.75 8.437-4.887 8.437-9.879z" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Share on Pintree"
                title="Share on Pintree"
                onClick={shareOnPintree}
                className="flex h-8 w-8 items-center justify-center rounded border border-[#E5E5E5] bg-[#F7F7F7] text-[#202020] transition-colors hover:bg-[#E5E5E5]"
              >
                <img
                  src="/Group-1410097144.svg"
                  alt=""
                  className="h-3.5 w-auto object-contain"
                />
              </button>
            </div>
          </div>
        </article>

        {sameCategoryRelated.length > 0 ? (
          <section className="mt-20 border-t border-[#E5E5E5] pt-16">
            <div className="mb-10 flex flex-col justify-between gap-3 md:flex-row md:items-end">
              <div>
                <span className="mb-2 block font-jakarta text-[12px] font-semibold uppercase tracking-wider text-[#777777]">
                  Same category archive
                </span>
                <h3 className="font-aeonik-regular text-[28px] font-normal leading-tight text-[#202020] sm:text-[32px]">
                  More from this category
                </h3>
              </div>
              <p className="font-jakarta text-[14px] text-[#666666] md:text-right">
                Continue exploring stories and official announcements related to
                this topic.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {sameCategoryRelated.map((item) => (
                <article
                  key={item.slug}
                  className="group flex h-full flex-col font-jakarta"
                >
                  {item.image ? (
                    <Link
                      href={`/newsroom/${item.slug}`}
                      className="mb-4 block aspect-[16/9] w-full overflow-hidden rounded-md border border-[#E5E5E5] bg-[#F7F7F7]"
                    >
                      <img
                        src={item.image}
                        alt={item.imageAlt || ""}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </Link>
                  ) : null}
                  <div className="mb-2 flex items-center gap-2 font-jakarta text-[12px] font-semibold uppercase text-[#777777]">
                    <span className="font-medium tracking-wide text-[#204654]">
                      {item.category}
                    </span>
                    <span className="text-[#E5E5E5]">·</span>
                    <span className="font-normal normal-case text-[#777777]">
                      {item.date}
                    </span>
                  </div>
                  <h4 className="mb-2 font-jakarta text-[20px] font-normal leading-[1.35] tracking-[-0.01em] text-[#202020] transition-colors group-hover:text-[#204654]">
                    <Link href={`/newsroom/${item.slug}`}>{item.title}</Link>
                  </h4>
                  {item.excerpt ? (
                    <p className="mb-4 line-clamp-2 font-jakarta text-[14px] leading-relaxed text-[#666666]">
                      {item.excerpt}
                    </p>
                  ) : null}
                  <div className="mt-auto pt-1">
                    <ReadStoryLink href={`/newsroom/${item.slug}`} />
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <footer className="mt-16 flex items-center justify-between gap-6 border-t border-[#E5E5E5] pt-10 font-jakarta">
          <BackLink />
          <div className="text-right font-jakarta text-[13px] text-[#777777]">
            Pintree Official Newsroom
          </div>
        </footer>
      </div>
    </main>
  );
}
