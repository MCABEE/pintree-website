"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  formatRelativeTime,
  estimateReadTime,
  getSupportArticles,
} from "@/utils/support";

export default function SupportTopicView({
  topic,
  initialArticles = [],
}) {
  const [articles, setArticles] = useState(initialArticles);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);

  // Sync / refresh articles on client mount from API if topic.id is present
  useEffect(() => {
    let cancelled = false;

    async function fetchTopicArticles() {
      if (!topic?.id) return;
      try {
        const res = await getSupportArticles({ topicId: topic.id, limit: 100 });
        if (cancelled) return;
        if (res.articles && res.articles.length > 0) {
          setArticles(res.articles);
        }
      } catch (err) {
        console.warn("Client fetch for topic articles failed:", err);
      }
    }

    fetchTopicArticles();

    return () => {
      cancelled = true;
    };
  }, [topic?.id]);

  const activeQuery = searchQuery.trim().toLowerCase();

  const filteredArticles = useMemo(() => {
    if (!activeQuery) return articles;

    return articles.filter((article) => {
      const titleMatch = (article.headline || "")
        .toLowerCase()
        .includes(activeQuery);
      const excerptMatch = (article.excerpt || "")
        .toLowerCase()
        .includes(activeQuery);
      return titleMatch || excerptMatch;
    });
  }, [articles, activeQuery]);

  const totalCount = topic?.articleCount || articles.length;

  return (
    <main className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 md:px-16 lg:px-28 xl:px-32 py-12 md:py-16 selection:bg-[#CAFFA6] selection:text-[#202020] font-jakarta">
      {/* Scoped Reading Width Container (~880px for optimal typography scanability) */}
      <div className="max-w-[880px] mx-auto">
        {/* 1. CATEGORY HEADER & BREADCRUMB */}
        <header className="mb-10 md:mb-12">
          {/* Breadcrumb & Back Action */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 mb-6 text-[13px] text-[#666666]"
          >
            <Link
              href="/support"
              className="inline-flex items-center gap-1.5 hover:text-[#202020] transition-colors group"
            >
              <svg
                className="w-4 h-4 text-[#777777] group-hover:text-[#202020] transition-transform group-hover:-translate-x-0.5"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.75"
                viewBox="0 0 16 16"
                aria-hidden
              >
                <path d="M10 13L5 8L10 3" />
              </svg>
              <span>Support Center</span>
            </Link>
            <span className="text-[#E5E5E5] select-none">/</span>
            <div className="inline-flex items-center gap-2">
              <span
                aria-hidden="true"
                className="w-1.5 h-1.5 rounded-full bg-[#204654]"
              />
              <span className="font-medium text-[#202020]">
                {topic?.heading || "Topic"}
              </span>
            </div>
          </nav>

          {/* Category Title & Counter Pill */}
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 mb-4">
            <h1 className="font-aeonik-regular text-4xl sm:text-[44px] sm:leading-[52px] md:text-[48px] md:leading-[56px] text-[#202020] font-normal tracking-[-0.025em]">
              {topic?.heading || "Help Topic"}
            </h1>
            <div className="self-start sm:self-auto inline-flex items-center px-3 py-1 rounded-full bg-[#F7F7F7] border border-[#E5E5E5] text-xs font-medium text-[#666666] tracking-tight whitespace-nowrap">
              {totalCount} {totalCount === 1 ? "article" : "articles"} in this topic
            </div>
          </div>

          {/* Description */}
          {topic?.subHeading ? (
            <p className="text-[16px] leading-[26px] text-[#525252] max-w-2xl">
              {topic.subHeading}
            </p>
          ) : null}
        </header>

        {/* 2. SCOPED SEARCH & FILTER SECTION */}
        <section aria-label="Search and quick filters" className="mb-10">
          <div className="relative w-full mb-4 focus-within:border-[#204654] focus-within:ring-1 focus-within:ring-[#204654] border border-[#E5E5E5] rounded-lg bg-[#FFFFFF] transition-all duration-150">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-[#777777]"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.6"
                viewBox="0 0 20 20"
                aria-hidden
              >
                <circle cx="9" cy="9" r="6" />
                <line x1="13.5" x2="18" y1="13.5" y2="18" />
              </svg>
            </div>
            <input
              ref={searchInputRef}
              autoComplete="off"
              className="w-full pl-12 pr-10 py-3.5 bg-transparent text-[#202020] placeholder-[#A0A0A0] text-sm md:text-base border-none focus:ring-0 focus:outline-none"
              id="category-search"
              placeholder={`Search articles in ${topic?.heading || "this topic"}...`}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery ? (
              <button
                aria-label="Clear search"
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#777777] hover:text-[#202020] cursor-pointer"
                id="clear-search"
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  searchInputRef.current?.focus();
                }}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                  viewBox="0 0 16 16"
                  aria-hidden
                >
                  <line x1="4" x2="12" y1="4" y2="12" />
                  <line x1="12" x2="4" y1="4" y2="12" />
                </svg>
              </button>
            ) : null}
          </div>
        </section>

        {/* 3. ARTICLE LISTING (Clean Vertical Stacked List with Hairline Borders) */}
        <section aria-label="Articles list" className="mb-14">
          {filteredArticles.length > 0 ? (
            <div
              className="border-t border-[#E5E5E5] divide-y divide-[#E5E5E5]"
              id="articles-container"
            >
              {filteredArticles.map((article) => (
                <article
                  key={article.id || article.slug}
                  className="article-item group py-6 px-3 -mx-3 rounded hover:bg-[#FBFBFB] transition-colors duration-150 cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <Link
                        className="block focus:outline-none"
                        href={`/support/${article.slug}`}
                      >
                        <h2 className="text-lg md:text-[18px] font-medium text-[#202020] group-hover:text-[#204654] transition-colors leading-snug">
                          {article.headline}
                        </h2>
                        {article.excerpt ? (
                          <p className="mt-1 text-sm text-[#666666] font-normal leading-relaxed line-clamp-2 md:line-clamp-none">
                            {article.excerpt}
                          </p>
                        ) : null}
                        <div className="mt-2.5 flex items-center gap-2 text-xs text-[#777777]">
                          <span>
                            {estimateReadTime(article.excerpt || article.headline)}
                          </span>
                          <span className="inline-block w-1 h-1 rounded-full bg-[#E5E5E5]" />
                          <span>
                            {formatRelativeTime(
                              article.updatedAt || article.publishedAt
                            )}
                          </span>
                        </div>
                      </Link>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#777777] group-hover:text-[#204654] group-hover:translate-x-1 transition-all duration-150">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.75"
                          viewBox="0 0 16 16"
                          aria-hidden
                        >
                          <path d="M6 3L11 8L6 13" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div
              className="py-16 text-center border-t border-[#E5E5E5]"
              id="empty-state"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#F7F7F7] flex items-center justify-center text-[#777777]">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" x2="16.65" y1="21" y2="16.65" />
                </svg>
              </div>
              <h3 className="text-base font-medium text-[#202020] mb-1">
                No articles found
              </h3>
              <p className="text-sm text-[#666666] max-w-sm mx-auto mb-4">
                We couldn&apos;t find anything matching your search. Try another
                keyword or browse all topics.
              </p>
              <button
                className="px-4 py-2 text-xs font-medium rounded bg-[#000000] text-[#FFFFFF] hover:bg-[#303030] transition-colors cursor-pointer"
                id="reset-filter-btn"
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  searchInputRef.current?.focus();
                }}
              >
                Reset filters
              </button>
            </div>
          )}
        </section>

        {/* 4. BOTTOM HELP & ESCALATION NOTICE */}
        <footer className="pt-8 border-t border-[#E5E5E5]">
          <div className="p-6 md:p-8 rounded-lg bg-[#F7F7F7] border border-[#E5E5E5] flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h4 className="text-base font-medium text-[#202020]">
                Can&apos;t find what you&apos;re looking for in {topic?.heading}?
              </h4>
              <p className="text-sm text-[#666666]">
                Our support team is available Monday through Friday to help resolve personal account issues.
              </p>
            </div>
            <div className="flex shrink-0 items-center">
              <a
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded text-sm font-medium text-white bg-black hover:bg-[#204654] transition-colors whitespace-nowrap group shadow-sm"
                href="mailto:hello@pintree.co"
              >
                <span>Contact Support</span>
                <svg
                  className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.75"
                  viewBox="0 0 16 16"
                  aria-hidden
                >
                  <path d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5" />
                </svg>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}

