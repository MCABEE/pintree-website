"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getNews, FALLBACK_ARTICLES } from "@/utils/news";

function ArrowIcon({ direction }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {direction === "left" ? (
        <>
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </>
      ) : (
        <>
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </>
      )}
    </svg>
  );
}

function SmallArrowIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export default function Section8() {
  const [articles, setArticles] = useState(FALLBACK_ARTICLES);
  const [pageIndex, setPageIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getNews({ page: 1, limit: 12 })
      .then((res) => {
        if (isMounted && res.articles && res.articles.length > 0) {
          setArticles(res.articles);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch newsroom real data for homepage:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const pageSize = 3;
  const totalPages = Math.ceil(articles.length / pageSize);
  const canPrev = pageIndex > 0;
  const canNext = pageIndex < totalPages - 1;

  const handlePrev = () => {
    if (isSliding || !canPrev) return;
    setIsSliding(true);
    setPageIndex((prev) => Math.max(0, prev - 1));
    setTimeout(() => setIsSliding(false), 1500);
  };

  const handleNext = () => {
    if (isSliding || !canNext) return;
    setIsSliding(true);
    setPageIndex((prev) => Math.min(totalPages - 1, prev + 1));
    setTimeout(() => setIsSliding(false), 1500);
  };

  return (
    <section
      aria-labelledby="newsroom-headline"
      className="w-full bg-white py-20 font-jakarta text-[#1b1c1c] lg:py-24"
    >
      <div className="mx-auto w-full max-w-[1340px] px-8">
        <header className="flex flex-col justify-between gap-6 pb-2 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <Link
              href="/newsroom"
              className="group mb-3 inline-flex items-center gap-2 transition hover:opacity-80"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#baee97]" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#444748] group-hover:text-black">
                Newsroom
              </span>
            </Link>

            <h2
              id="newsroom-headline"
              className="font-aeonik-regular text-[32px] font-normal tracking-tight text-black sm:text-[40px] lg:text-[48px] lg:leading-[56px]"
            >
              What&apos;s new at Pintree
            </h2>

            <p className="mt-2.5 max-w-xl font-jakarta text-[16px] font-normal leading-6 text-[#444748]">
              The latest updates, stories, and things happening around Pintree.
            </p>
          </div>

          {totalPages > 1 && (
            <div
              aria-label="Newsroom stories navigation"
              className="flex items-center gap-2.5 self-start pb-1 md:self-end"
            >
              <button
                type="button"
                onClick={handlePrev}
                disabled={!canPrev}
                aria-label="Previous stories"
                className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-150 focus:outline-none ${
                  canPrev
                    ? "cursor-pointer border-[#c4c7c7] bg-white text-[#1b1c1c] hover:border-black active:scale-[0.98]"
                    : "cursor-not-allowed border-[#e4e2e1] bg-white text-[#c4c7c7] opacity-40"
                }`}
              >
                <ArrowIcon direction="left" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={!canNext}
                aria-label="Next stories"
                className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-150 focus:outline-none ${
                  canNext
                    ? "cursor-pointer border-[#c4c7c7] bg-white text-[#1b1c1c] hover:border-black active:scale-[0.98]"
                    : "cursor-not-allowed border-[#e4e2e1] bg-white text-[#c4c7c7] opacity-40"
                }`}
              >
                <ArrowIcon direction="right" />
              </button>
            </div>
          )}
        </header>

        <div className="mt-12 overflow-hidden py-1 lg:mt-14">
          <div
            className="flex transition-transform duration-[1500ms] ease-[cubic-bezier(0.25,1,0.1,1)]"
            style={{ transform: `translateX(-${pageIndex * 100}%)` }}
          >
            {Array.from({ length: Math.max(1, totalPages) }).map((_, pIdx) => {
              const pageArticles = articles.slice(
                pIdx * pageSize,
                pIdx * pageSize + pageSize
              );
              return (
                <div
                  key={pIdx}
                  className="grid w-full shrink-0 grid-cols-1 items-stretch gap-6 px-1 md:grid-cols-3 lg:gap-8"
                >
                  {pageArticles.map((story) => (
                    <Link
                      key={story.id || story.slug}
                      href={`/newsroom/${story.slug}`}
                      className="group flex flex-col justify-between rounded-2xl border border-[#e4e2e1] bg-white p-8 transition-[background-color,border-color] duration-250 hover:border-[#204654]/30 hover:bg-[#F7F7F7]"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#525252]">
                            {story.category || "News"}
                          </span>
                          {story.date && (
                            <>
                              <span className="text-gray-300">•</span>
                              <span className="text-[12px] text-[#777777]">
                                {story.date}
                              </span>
                            </>
                          )}
                        </div>

                        <h3 className="mt-4 font-aeonik-regular text-[22px] font-normal leading-[30px] text-black transition-colors group-hover:text-[#204654] line-clamp-2">
                          {story.title || story.headline}
                        </h3>
                        <p className="mt-3.5 font-jakarta text-[15px] font-normal leading-6 text-[#444748] line-clamp-3">
                          {story.excerpt || story.summary}
                        </p>
                      </div>

                      <div className="mt-6 flex items-center justify-between border-t border-[#f6f3f2] pt-8">
                        <span className="text-[13px] font-semibold tracking-[0.02em] text-[#1b1c1c] transition-colors group-hover:text-black">
                          Read story
                        </span>
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e4e2e1] bg-[#f6f3f2] text-[#1b1c1c] transition-all duration-150 group-hover:border-black group-hover:bg-black group-hover:text-white">
                          <SmallArrowIcon />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
