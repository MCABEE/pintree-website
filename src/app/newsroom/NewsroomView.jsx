"use client";

import { useMemo, useState } from "react";
import { FEATURED, MORE, UPDATES } from "./articles";

const CATEGORIES = [
  "All News",
  "Announcements",
  "Product Updates",
  "Company News",
  "Stories",
];

function ArrowRight({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <path
        d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowOut() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path
        d="M4 12L12 4M12 4H6M12 4V10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function matches(category, active) {
  return active === "All News" || category === active;
}

export default function NewsroomView() {
  const [active, setActive] = useState("All News");

  const updates = useMemo(
    () => UPDATES.filter((item) => matches(item.category, active)),
    [active]
  );
  const more = useMemo(
    () => MORE.filter((item) => matches(item.category, active)),
    [active]
  );
  const showFeatured = matches(FEATURED.category, active);

  return (
    <main className="mx-auto w-full max-w-[1536px] px-6 pb-28 pt-14 font-jakarta sm:px-12 lg:px-[128px]">
      <div className="mx-auto max-w-[1280px]">
        <section className="mb-12 md:mb-16">
          <div className="mb-4 flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-[#202020]" />
            <span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-[#777777]">
              Newsroom
            </span>
          </div>
          <h1 className="font-aeonik-regular mb-4 max-w-3xl text-4xl font-normal leading-[1.12] text-[#202020] sm:text-5xl lg:text-[48px]">
            What’s happening at Pintree.
          </h1>
          <p className="max-w-2xl text-base font-normal leading-relaxed text-[#666666] sm:text-lg">
            The latest news, announcements, stories and updates from Pintree.
          </p>
        </section>

        <section className="mb-12 border-b border-[#E5E5E5]">
          <nav
            className="no-scrollbar flex items-center gap-6 overflow-x-auto py-1 sm:gap-8"
            aria-label="News categories"
          >
            {CATEGORIES.map((category) => {
              const isActive = category === active;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActive(category)}
                  className={
                    isActive
                      ? "relative whitespace-nowrap pb-3 text-sm font-semibold text-[#202020] transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-[#202020]"
                      : "whitespace-nowrap pb-3 text-sm font-medium text-[#777777] transition-colors hover:text-[#202020]"
                  }
                >
                  {category}
                </button>
              );
            })}
          </nav>
        </section>

        {showFeatured || updates.length > 0 ? (
          <section className="mb-24">
            <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 xl:gap-14">
              {showFeatured ? (
                <a
                  href={`/newsroom/${FEATURED.slug}`}
                  className="group flex cursor-pointer flex-col lg:col-span-8"
                >
                  <div className="relative mb-6 aspect-[16/9] w-full overflow-hidden rounded-sm border border-[#E5E5E5]/60 bg-[#F7F7F7]">
                    <img
                      src={FEATURED.image}
                      alt={FEATURED.imageAlt}
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.015]"
                    />
                  </div>
                  <div className="mb-3 flex items-center gap-3 text-xs uppercase tracking-wider">
                    <span className="rounded-sm bg-[#A9E0F1]/20 px-2 py-0.5 font-semibold text-[#204654]">
                      {FEATURED.category}
                    </span>
                    <span className="text-[#E5E5E5]">•</span>
                    <time className="font-medium text-[#777777]" dateTime={FEATURED.dateTime}>
                      {FEATURED.date}
                    </time>
                  </div>
                  <h2 className="mb-3 font-jakarta text-2xl font-normal leading-snug text-[#202020] transition-colors group-hover:text-black sm:text-3xl lg:text-[34px]">
                    {FEATURED.title}
                  </h2>
                  <p className="mb-5 max-w-3xl text-base leading-relaxed text-[#525252]">
                    {FEATURED.excerpt}
                  </p>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#202020] transition-transform group-hover:translate-x-1">
                    <span>Read Full Story</span>
                    <ArrowRight />
                  </div>
                </a>
              ) : null}

              {updates.length > 0 ? (
                <aside
                  className={`flex flex-col pt-2 font-jakarta lg:pt-0 ${
                    showFeatured ? "lg:col-span-4 lg:pl-4 xl:pl-6" : "lg:col-span-12"
                  }`}
                >
                  <div className="mb-2 flex items-baseline justify-between border-b border-[#202020] pb-3">
                    <h3 className="font-aeonik-medium text-xl font-medium text-[#202020] lg:text-[22px]">
                      Latest Updates
                    </h3>
                    <span className="text-xs font-medium text-[#777777]">
                      The latest from Pintree
                    </span>
                  </div>
                  <div className="divide-y divide-[#E5E5E5]">
                    {updates.map((item) => (
                      <a
                        key={item.slug}
                        href={`/newsroom/${item.slug}`}
                        className="group block py-5 transition-colors first:pt-4"
                      >
                        <div className="mb-1.5 flex items-center gap-2 text-[11px] uppercase tracking-wider text-[#777777]">
                          <span className="font-semibold text-[#202020]">
                            {item.category}
                          </span>
                          <span>•</span>
                          <time dateTime={item.dateTime}>{item.date}</time>
                        </div>
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="font-jakarta text-[17px] font-normal leading-snug text-[#202020] transition-colors group-hover:text-[#204654]">
                            {item.title}
                          </h4>
                          <span className="mt-1 flex-shrink-0 text-[#777777] transition-all group-hover:translate-x-0.5 group-hover:text-[#202020]">
                            <ArrowOut />
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                  <div className="mt-8 rounded-sm border border-[#E5E5E5] bg-[#F7F7F7] p-5">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#CAFFA6]" />
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#777777]">
                        Press & media inquiries
                      </span>
                    </div>
                    <p className="mb-3 text-xs leading-relaxed text-[#666666]">
                      Working on a story? Contact our global communications team
                      for press kits and interview requests.
                    </p>
                    <a
                      href="mailto:press@pintree.com"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#202020] hover:text-[#204654]"
                    >
                      <span>press@pintree.com</span>
                      <ArrowRight size={12} />
                    </a>
                  </div>
                </aside>
              ) : null}
            </div>
          </section>
        ) : null}

        {more.length > 0 ? (
          <section className="mb-20 border-t border-[#E5E5E5] pt-16">
            <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 className="font-aeonik-regular mb-2 text-2xl font-normal leading-tight text-[#202020] sm:text-3xl lg:text-[32px]">
                  More from Pintree
                </h2>
                <p className="text-base font-normal text-[#666666]">
                  Explore more stories, announcements and updates from across
                  Pintree.
                </p>
              </div>
              <div className="hidden items-center gap-2 text-xs font-medium text-[#777777] sm:flex">
                <span>
                  Showing {more.length} of 24 articles
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {more.map((article) => (
                <a
                  key={article.slug}
                  href={`/newsroom/${article.slug}`}
                  className="group flex cursor-pointer flex-col"
                >
                  <div className="mb-4 aspect-[16/9] w-full overflow-hidden rounded-sm border border-[#E5E5E5]/60 bg-[#F7F7F7]">
                    <img
                      src={article.image}
                      alt={article.imageAlt}
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-[#777777]">
                    <span className="font-semibold text-[#202020]">
                      {article.category}
                    </span>
                    <span>•</span>
                    <time dateTime={article.dateTime}>{article.date}</time>
                  </div>
                  <h3 className="mb-2 font-jakarta text-xl font-normal leading-snug text-[#202020] transition-colors group-hover:text-[#204654]">
                    {article.title}
                  </h3>
                  <p className="mb-4 line-clamp-2 flex-grow text-sm leading-relaxed text-[#525252]">
                    {article.excerpt}
                  </p>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#202020] transition-transform group-hover:translate-x-1">
                    <span>Read Story</span>
                    <ArrowRight size={14} />
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-16 text-center">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#202020] px-8 py-3.5 text-sm font-semibold text-[#202020] transition-all duration-200 hover:bg-[#202020] hover:text-white"
              >
                <span>Load More Stories</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden
                >
                  <path
                    d="M8 3V13M8 13L3.5 8.5M8 13L12.5 8.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </section>
        ) : null}

        <section className="border-t border-[#E5E5E5] pt-12">
          <div className="flex flex-col justify-between gap-8 rounded-sm border border-[#E5E5E5] bg-[#F7F7F7] p-8 sm:p-10 md:flex-row md:items-center">
            <div className="max-w-xl">
              <span className="mb-2 block font-jakarta text-[11px] font-semibold uppercase tracking-widest text-[#777777]">
                Newsletter
              </span>
              <h3 className="font-aeonik-regular mb-2 text-2xl font-normal text-[#202020]">
                Stay updated with Pintree Newsroom
              </h3>
              <p className="text-sm leading-relaxed text-[#666666]">
                Get official announcements, release notes, and community essays
                delivered directly to your inbox once a month. No spam, ever.
              </p>
            </div>
            <form
              className="flex w-full flex-col gap-3 sm:flex-row md:w-auto"
              onSubmit={(event) => event.preventDefault()}
            >
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full rounded-full border border-[#E5E5E5] bg-white px-4 py-3 text-sm text-[#202020] placeholder-[#777777] focus:border-[#202020] focus:outline-none sm:w-72"
              />
              <button
                type="submit"
                className="whitespace-nowrap rounded-full bg-[#202020] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-black"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
