"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { getNews, CATEGORY_MAP } from "@/utils/news";

const CATEGORIES = [
  "All News",
  "Announcements",
  "Product Updates",
  "Company News",
  "Stories",
];

const FALLBACK_ARTICLES = [
  {
    id: "cmw92pcr5002fo701swkr60r1",
    slug: "enhanced-privacy-controls-granular-audience-tiers-for-personal-profiles",
    title: "Enhanced privacy controls: Granular audience tiers for personal profiles",
    headline: "Enhanced privacy controls: Granular audience tiers for personal profiles",
    excerpt: "New privacy controls offer users more flexibility over who can view their personal profile information.",
    category: "Product Updates",
    categoryRaw: "PRODUCT_UPDATES",
    attribution: "Pintree Product Team",
    image: "https://image.pintree.co/1794217381538-hqdefault.jpg",
    imageAlt: "Enhanced privacy controls: Granular audience tiers for personal profiles",
    date: "Nov 9, 2026",
    dateTime: "2026-11-09",
  },
  {
    id: "cmw92izjb0021o701an5tw4rk",
    slug: "how-independent-book-clubs-and-creative-collectives-found-a-new-home-on-pintree",
    title: "How independent book clubs and creative collectives found a new home on Pintree",
    headline: "How independent book clubs and creative collectives found a new home on Pintree",
    excerpt: "Discover how independent book clubs and creative communities connect, collaborate and share their passions on Pintree.",
    category: "Stories",
    categoryRaw: "COMMUNITY_STORIES",
    attribution: "Pintree Community Team",
    image: "https://image.pintree.co/1794217082683-a92bdf90-dbbe-11f1-b441-2b33b063138f.jpg.webp",
    imageAlt: "How independent book clubs and creative collectives found a new home on Pintree",
    date: "Nov 9, 2026",
    dateTime: "2026-11-09",
  },
  {
    id: "cmw92aua4001uo701ftzlyuwz",
    slug: "pintree-appoints-elena-rostova-as-vice-president-of-community-integrity",
    title: "Pintree appoints Elena Rostova as Vice President of Community Integrity",
    headline: "Pintree appoints Elena Rostova as Vice President of Community Integrity",
    excerpt: "Pintree announces a new leadership appointment focused on community integrity and trust.",
    category: "Company News",
    categoryRaw: "COMPANY_NEWS",
    attribution: "Pintree Communications Team",
    image: "https://image.pintree.co/1794216704400-apple_news-local-expansion_hero_10262021_big.jpg.large_2x.jpg",
    imageAlt: "Pintree appoints Elena Rostova as Vice President of Community Integrity",
    date: "Nov 9, 2026",
    dateTime: "2026-11-09",
  },
  {
    id: "cmw926wgn001jo701y13kitmy",
    slug: "introducing-focused-rooms-intimate-topic-spaces-within-larger-communities",
    title: "Introducing Focused Rooms: Intimate topic spaces within larger communities",
    headline: "Introducing Focused Rooms: Intimate topic spaces within larger communities",
    excerpt: "Discover Focused Rooms, dedicated spaces for meaningful discussions within larger communities.",
    category: "Product Updates",
    categoryRaw: "PRODUCT_UPDATES",
    attribution: "Pintree Product Team",
    image: "https://image.pintree.co/1794216520676-kyrmhas_1701182285359_1709622176270.webp",
    imageAlt: "Introducing Focused Rooms: Intimate topic spaces within larger communities",
    date: "Nov 9, 2026",
    dateTime: "2026-11-09",
  },
  {
    id: "cmw62nxwu0002s901x9sf9hp1",
    slug: "introducing-pintree-s-new-privacy-dashboard",
    title: "Introducing Pintree's New Privacy Dashboard",
    headline: "Introducing Pintree's New Privacy Dashboard",
    excerpt: "A redesigned privacy dashboard gives users greater control and transparency.",
    category: "Product Updates",
    categoryRaw: "PRODUCT_UPDATES",
    attribution: "Pintree Product Team",
    image: "https://image.pintree.co/1794035915605-foodio_delivery_app_showcase.png",
    imageAlt: "Introducing Pintree's New Privacy Dashboard",
    date: "Nov 7, 2026",
    dateTime: "2026-11-07",
  },
  {
    id: "cmw60xb5k0000ld9kbgebxghh",
    slug: "expanding-decentralized-communities-across-40-metropolitan-hubs",
    title: "Expanding Decentralized Communities Across 40+ Metropolitan Hubs",
    headline: "Expanding Decentralized Communities Across 40+ Metropolitan Hubs",
    excerpt: "Pintree expands localized privacy nodes across forty core metropolises.",
    category: "Announcements",
    categoryRaw: "ANNOUNCEMENTS",
    attribution: "Pintree Editorial Team & Ops",
    image: "https://image.pintree.co/1794032742692-vanta_luxury_jewelry_platform_showcase.png",
    imageAlt: "Expanding Decentralized Communities Across 40+ Metropolitan Hubs",
    date: "Nov 7, 2026",
    dateTime: "2026-11-07",
  },
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

export default function NewsroomView() {
  const [active, setActive] = useState("All News");
  const [articles, setArticles] = useState(FALLBACK_ARTICLES);
  const [total, setTotal] = useState(FALLBACK_ARTICLES.length);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [visibleMoreCount, setVisibleMoreCount] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [, startTransition] = useTransition();

  // Reset pagination & visible count on category change
  useEffect(() => {
    setVisibleMoreCount(3);
  }, [active]);

  // Fetch articles on category change
  useEffect(() => {
    let cancelled = false;

    async function fetchArticles() {
      setIsLoading(true);
      try {
        const res = await getNews({
          category: active,
          page: 1,
          limit: 12,
        });
        if (cancelled) return;
        setArticles(res.articles || []);
        setTotal(res.total ?? 0);
        setPage(res.page ?? 1);
        setTotalPages(res.totalPages ?? 1);
      } catch (err) {
        console.error("Failed to fetch newsroom articles:", err);
        // Fallback filter locally if offline
        if (!cancelled) {
          const filtered = FALLBACK_ARTICLES.filter((item) => {
            return active === "All News" || item.category === active;
          });
          setArticles(filtered);
          setTotal(filtered.length);
          setPage(1);
          setTotalPages(1);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchArticles();

    return () => {
      cancelled = true;
    };
  }, [active]);

  // Layout distribution matching the screen design
  const featured = articles[0] || null;
  // Maximum 5 latest news in the sidebar
  const updates = articles.length > 1 ? articles.slice(1, 6) : [];
  const morePool = articles.length > 1 ? articles.slice(1) : [];
  const displayedMore = morePool.slice(0, visibleMoreCount);
  const hasMoreLocal = visibleMoreCount < morePool.length;
  const hasMoreServer = page < totalPages;
  const canLoadMore = hasMoreLocal || hasMoreServer;

  // Load more articles
  async function handleLoadMore() {
    if (hasMoreLocal) {
      setVisibleMoreCount((prev) => prev + 3);
      return;
    }

    if (hasMoreServer && !isLoadingMore) {
      setIsLoadingMore(true);
      try {
        const nextPage = page + 1;
        const res = await getNews({
          category: active,
          page: nextPage,
          limit: 12,
        });
        setArticles((prev) => {
          const existingIds = new Set(prev.map((a) => a.id || a.slug));
          const newOnes = (res.articles || []).filter(
            (a) => !existingIds.has(a.id || a.slug)
          );
          return [...prev, ...newOnes];
        });
        setPage(res.page ?? nextPage);
        setTotalPages(res.totalPages ?? totalPages);
        setVisibleMoreCount((prev) => prev + 3);
      } catch (err) {
        console.error("Failed to load more articles:", err);
      } finally {
        setIsLoadingMore(false);
      }
    }
  }

  return (
    <main className="mx-auto w-full max-w-[1536px] px-6 pb-28 pt-14 font-jakarta sm:px-12 lg:px-[128px]">
      <div className="mx-auto max-w-[1280px]">
        {/* Header Section */}
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

        {/* Filter Bar with Categories */}
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
                  onClick={() => {
                    startTransition(() => {
                      setActive(category);
                    });
                  }}
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

        {/* Featured Article & Latest Updates Sidebar */}
        {featured ? (
          <section className="mb-24">
            <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 xl:gap-14">
              {/* Featured Main Card (8 cols) */}
              <Link
                href={`/newsroom/${featured.slug}`}
                className="group flex cursor-pointer flex-col lg:col-span-8"
              >
                <div className="relative mb-6 aspect-[16/9] w-full overflow-hidden rounded-sm border border-[#E5E5E5]/60 bg-[#F7F7F7]">
                  <img
                    src={featured.image}
                    alt={featured.imageAlt || featured.title}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.015]"
                  />
                </div>
                <div className="mb-3 flex items-center gap-3 text-xs uppercase tracking-wider">
                  <span className="rounded-sm bg-[#A9E0F1]/20 px-2 py-0.5 font-semibold text-[#204654]">
                    {featured.category}
                  </span>
                  <span className="text-[#E5E5E5]">•</span>
                  <time
                    className="font-medium text-[#777777]"
                    dateTime={featured.dateTime}
                  >
                    {featured.date}
                  </time>
                </div>
                <h2 className="mb-3 font-jakarta text-2xl font-normal leading-snug text-[#202020] transition-colors group-hover:text-black sm:text-3xl lg:text-[34px]">
                  {featured.title}
                </h2>
                <p className="mb-5 max-w-3xl text-base leading-relaxed text-[#525252]">
                  {featured.excerpt}
                </p>
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#202020] transition-transform group-hover:translate-x-1">
                  <span>Read Full Story</span>
                  <ArrowRight />
                </div>
              </Link>

              {/* Latest Updates Sidebar (4 cols) */}
              <aside className="flex flex-col pt-2 font-jakarta lg:col-span-4 lg:pl-4 lg:pt-0 xl:pl-6">
                <div className="mb-2 flex items-baseline justify-between border-b border-[#202020] pb-3">
                  <h3 className="font-aeonik-medium text-xl font-medium text-[#202020] lg:text-[22px]">
                    Latest Updates
                  </h3>
                  <span className="text-xs font-medium text-[#777777]">
                    The latest from Pintree
                  </span>
                </div>

                {updates.length > 0 ? (
                  <div className="divide-y divide-[#E5E5E5]">
                    {updates.map((item) => (
                      <Link
                        key={item.id || item.slug}
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
                      </Link>
                    ))}
                  </div>
                ) : null}

                {/* Press & Media Inquiries Box */}
                <div className="mt-8 rounded-sm border border-[#E5E5E5] bg-[#F7F7F7] p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#CAFFA6]" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#777777]">
                      Press &amp; media inquiries
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
            </div>
          </section>
        ) : !isLoading ? (
          /* Empty state */
          <div className="my-20 rounded-md border border-[#E5E5E5] bg-[#F7F7F7] p-12 text-center">
            <h3 className="font-aeonik-regular mb-2 text-2xl font-normal text-[#202020]">
              No articles found
            </h3>
            <p className="mb-6 text-sm text-[#777777]">
              There are currently no articles in "{active}".
            </p>
            <button
              type="button"
              onClick={() => {
                setActive("All News");
              }}
              className="inline-flex items-center justify-center rounded-full border border-[#202020] bg-black px-6 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-neutral-800"
            >
              View All News
            </button>
          </div>
        ) : null}

        {/* More from Pintree Section (3-column grid) */}
        {morePool.length > 0 ? (
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
                  Showing {displayedMore.length} of {morePool.length} articles
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {displayedMore.map((article) => (
                <Link
                  key={article.id || article.slug}
                  href={`/newsroom/${article.slug}`}
                  className="group flex cursor-pointer flex-col"
                >
                  <div className="mb-4 aspect-[16/9] w-full overflow-hidden rounded-sm border border-[#E5E5E5]/60 bg-[#F7F7F7]">
                    <img
                      src={article.image}
                      alt={article.imageAlt || article.title}
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
                </Link>
              ))}
            </div>

            {/* Load More Stories Button */}
            {canLoadMore ? (
              <div className="mt-16 text-center">
                <button
                  type="button"
                  disabled={isLoadingMore}
                  onClick={handleLoadMore}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#202020] px-8 py-3.5 text-sm font-semibold text-[#202020] transition-all duration-200 hover:bg-[#202020] hover:text-white disabled:opacity-50"
                >
                  <span>
                    {isLoadingMore ? "Loading Stories..." : "Load More Stories"}
                  </span>
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
            ) : null}
          </section>
        ) : null}

        {/* Newsletter Section */}
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
