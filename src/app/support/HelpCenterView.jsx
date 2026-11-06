"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const POPULAR_SEARCHES = [
  "Account Settings",
  "Communities",
  "Rooms",
  "Privacy",
  "Connections",
];

const SEARCH_TERMS = {
  "account settings": ["account", "profile", "password", "username"],
  communities: ["communit"],
  rooms: ["room"],
  privacy: ["privacy", "private"],
  connections: ["connection", "follow", "friend", "circle"],
};

const CATEGORIES = [
  {
    title: "Account & Profile",
    description: "Manage your account, personal information and profile settings.",
    countLabel: "View all 6 articles",
    icon: "user",
    articles: [
      "Creating your Pintree account",
      "Logging in and managing your password",
      "Setting up and editing your profile",
      "Changing your username",
      "Managing account visibility",
      "Deactivating or deleting your account",
    ],
  },
  {
    title: "People & Connections",
    description: "Learn how to follow people, manage relationships and connect with others.",
    countLabel: "View all 6 articles",
    icon: "people",
    articles: [
      "Following and unfollowing people",
      "Understanding followers and friends",
      "Managing follow requests",
      "Creating and managing Circles",
      "Controlling who sees your posts",
      "Blocking and managing users",
    ],
  },
  {
    title: "Communities & Rooms",
    description: "Discover how to create, join and participate in communities and Rooms.",
    countLabel: "View all 7 articles",
    icon: "grid",
    articles: [
      "Creating a community",
      "Choosing community type and visibility",
      "Joining or leaving a community",
      "Managing community membership",
      "Creating and joining Rooms",
      "Participating in Room discussions",
    ],
  },
  {
    title: "Posts & Discovery",
    description: "Learn how to share content and discover people, posts and communities.",
    countLabel: "View all 6 articles",
    icon: "star",
    articles: [
      "Creating and publishing a post",
      "Adding images and files to posts",
      "Creating polls",
      "Commenting and reacting to posts",
      "Exploring the Discover feed",
      "Finding new communities and people",
    ],
  },
  {
    title: "Privacy & Safety",
    description: "Understand privacy settings and how to keep your Pintree experience safe.",
    countLabel: "View all 7 articles",
    icon: "shield",
    articles: [
      "Managing your privacy settings",
      "Choosing who can see your posts",
      "Reporting inappropriate content",
      "Blocking unwanted interactions",
      "Understanding account restrictions",
      "Understanding community guidelines",
    ],
  },
  {
    title: "Troubleshooting",
    description: "Find solutions to common account, notification and app-related issues.",
    countLabel: "View all 6 articles",
    icon: "settings",
    articles: [
      "Unable to log in",
      "OTP or verification problems",
      "Not receiving notifications",
      "Problems uploading images or files",
      "App not responding or loading",
      "Reporting a technical issue",
    ],
  },
];

const POPULAR = [
  { category: "Account & Profile", title: "How do I create a Pintree account?" },
  { category: "Privacy & Safety", title: "How do I make my account private?" },
  { category: "Communities & Rooms", title: "How do I create or join a community?" },
  { category: "People & Connections", title: "How do following and friendships work?" },
  { category: "People & Connections", title: "How do I create and manage Circles?" },
  { category: "Privacy & Safety", title: "How do I report inappropriate content?" },
];

function matches(text, query) {
  const value = text.toLowerCase();
  const terms = SEARCH_TERMS[query] || [query];
  return terms.some((term) => value.includes(term));
}

function CategoryIcon({ name }) {
  const props = {
    className: "h-5 w-5",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  if (name === "user") {
    return (
      <svg {...props}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    );
  }
  if (name === "people") {
    return (
      <svg {...props}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }
  if (name === "grid") {
    return (
      <svg {...props}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    );
  }
  if (name === "star") {
    return (
      <svg {...props}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    );
  }
  if (name === "shield") {
    return (
      <svg {...props}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default function HelpCenterView() {
  const [query, setQuery] = useState("");
  const active = query.trim().toLowerCase();

  const categories = useMemo(() => {
    if (!active) return CATEGORIES;
    return CATEGORIES.map((category) => {
      const categoryHit = matches(category.title, active) || matches(category.description, active);
      const articles = categoryHit
        ? category.articles
        : category.articles.filter((article) => matches(article, active));
      return articles.length ? { ...category, articles } : null;
    }).filter(Boolean);
  }, [active]);

  const popular = useMemo(() => {
    if (!active) return POPULAR;
    return POPULAR.filter(
      (article) => matches(article.title, active) || matches(article.category, active),
    );
  }, [active]);

  const popularColumns = [popular.slice(0, Math.ceil(popular.length / 2)), popular.slice(Math.ceil(popular.length / 2))];

  return (
    <main className="font-jakarta mx-auto w-full max-w-[1536px] px-6 pb-24 pt-14 text-[#525252] selection:bg-[#CAFFA6] selection:text-[#202020] sm:px-12 md:px-20 md:pb-32 md:pt-20 lg:px-28 xl:px-[128px]">
      <div className="mx-auto w-full max-w-[1280px]">
        <section className="mx-auto max-w-[780px] pb-16 text-center md:pb-24">
          <div className="mb-4 inline-flex items-center justify-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-[#204654]" aria-hidden />
            <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#777777]">
              Support Center
            </span>
          </div>

          <h1 className="font-aeonik-regular mb-4 text-[40px] font-normal leading-[1.16] tracking-[-0.025em] text-[#202020] sm:text-[48px]">
            How can we help?
          </h1>
          <p className="mx-auto mb-9 text-[16px] font-normal leading-[1.6] text-[#666666] md:text-[17px]">
            Find answers, explore helpful guides and learn how to make the most of Pintree.
          </p>

          <div className="mx-auto max-w-[680px]">
            <div className="group relative">
              <label htmlFor="help-search" className="sr-only">
                Search help articles, topics or questions
              </label>
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-5 text-[#777777] transition-colors group-focus-within:text-[#202020]">
                <svg className="h-5 w-5" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <circle cx="11" cy="11" r="7" strokeWidth="1.75" />
                  <path d="M16 16L21 21" strokeWidth="1.75" strokeLinecap="round" />
                </svg>
              </div>
              <input
                id="help-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search for articles, topics or questions..."
                className="h-[58px] w-full rounded-[10px] border border-[#E5E5E5] bg-white pl-14 pr-5 text-[15px] text-[#202020] shadow-[0_1px_2px_rgba(0,0,0,0.03)] placeholder:text-[#777777] transition-all focus:border-[#202020] focus:outline-none focus:ring-1 focus:ring-[#202020]"
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-[13px] text-[#777777]">
              <span className="mr-1 text-[11px] font-medium uppercase tracking-[0.06em] text-[#777777]">
                Popular searches:
              </span>
              {POPULAR_SEARCHES.map((label, index) => (
                <span key={label} className="contents">
                  {index > 0 ? (
                    <span className="select-none text-[#E5E5E5]" aria-hidden>
                      ·
                    </span>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setQuery(label)}
                    className="cursor-pointer underline-offset-4 transition-colors hover:text-[#202020] hover:underline"
                  >
                    {label}
                  </button>
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className="mb-16 w-full border-t border-[#E5E5E5] md:mb-20" />

        <section className="mb-20 md:mb-28">
          <div className="mb-10 flex flex-col justify-between gap-3 sm:flex-row sm:items-end md:mb-12">
            <div>
              <span className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.14em] text-[#777777]">
                Knowledge Base
              </span>
              <h2 className="font-aeonik-regular text-[28px] font-normal tracking-[-0.015em] text-[#202020] md:text-[32px]">
                Explore Help Topics
              </h2>
            </div>
            <p className="max-w-[420px] text-[14px] text-[#666666] md:text-[15px]">
              Find step-by-step guidance for different parts of Pintree.
            </p>
          </div>

          {categories.length ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-7 lg:grid-cols-3">
              {categories.map((category) => (
                <article
                  key={category.title}
                  className="group flex flex-col justify-between rounded-[12px] border border-[#E5E5E5] bg-white p-7 transition-all duration-200 hover:border-[#D4D4D4] hover:bg-[#FCFCFC] md:p-8"
                >
                  <div>
                    <div className="mb-6 flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-[#F7F7F7] text-[#204654] transition-colors group-hover:bg-[#CAFFA6]/30">
                        <CategoryIcon name={category.icon} />
                      </div>
                    </div>
                    <h3 className="mb-2 text-[19px] font-semibold tracking-[-0.01em] text-[#202020]">
                      {category.title}
                    </h3>
                    <p className="mb-6 text-[14px] leading-[1.55] text-[#666666]">{category.description}</p>
                    <div className="mb-6 border-t border-[#E5E5E5] pt-4">
                      <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#202020]">
                        Popular Articles
                      </p>
                      <ul className="space-y-2.5 text-[13.5px] text-[#525252]">
                        {category.articles.map((article) => (
                          <li key={article}>
                            <a href="#articles" className="block truncate transition-colors hover:text-[#202020] hover:underline">
                              {article}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#E5E5E5] pt-2 text-[13px] font-medium text-[#202020]">
                    <span>{active ? `${category.articles.length} matching` : category.countLabel}</span>
                    <span className="text-[#777777] transition-transform duration-200 group-hover:translate-x-[3px] group-hover:text-[#202020]">
                      →
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-[15px] text-[#666666]">No help topics match that search.</p>
          )}
        </section>

        <div className="mb-16 w-full border-t border-[#E5E5E5] md:mb-20" />

        <section id="articles" className="mb-20 scroll-mt-24 md:mb-28">
          <div className="mb-10 flex flex-col justify-between gap-3 sm:flex-row sm:items-end md:mb-12">
            <div>
              <span className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.14em] text-[#777777]">
                Frequently Read
              </span>
              <h2 className="text-[28px] font-semibold tracking-[-0.015em] text-[#202020] md:text-[32px]">
                Popular Help Articles
              </h2>
            </div>
            <p className="max-w-[440px] text-[14px] text-[#666666] md:text-[15px]">
              Quick answers to some of the most common questions from Pintree users.
            </p>
          </div>

          {popular.length ? (
            <div className="grid grid-cols-1 gap-x-12 border-t border-[#E5E5E5] lg:grid-cols-2">
              {popularColumns.map((column, columnIndex) => (
                <div
                  key={columnIndex}
                  className={`divide-y divide-[#E5E5E5] ${columnIndex === 1 ? "border-t border-[#E5E5E5] lg:border-t-0" : ""}`}
                >
                  {column.map((article) => (
                    <a
                      key={article.title}
                      href="#articles"
                      className="group -mx-3 flex items-center justify-between rounded-[8px] px-3 py-5 transition-colors hover:bg-[#FAFAFA]"
                    >
                      <div className="pr-6">
                        <span className="mb-1 inline-block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#777777]">
                          {article.category}
                        </span>
                        <h3 className="text-[16px] font-medium leading-snug text-[#202020] group-hover:text-black md:text-[17px]">
                          {article.title}
                        </h3>
                      </div>
                      <div className="shrink-0 text-[#777777] transition-transform group-hover:translate-x-[3px] group-hover:text-[#202020]">
                        <Arrow />
                      </div>
                    </a>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <p className="border-t border-[#E5E5E5] pt-6 text-[15px] text-[#666666]">
              No articles match that search.
            </p>
          )}
        </section>

        <section className="rounded-[16px] border border-[#E5E5E5] bg-[#F7F7F7] p-8 text-center sm:p-12 md:p-14">
          <div className="mx-auto max-w-[620px]">
            <div className="mb-4 inline-flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-[#CAFFA6]" aria-hidden />
              <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#777777]">
                Direct Assistance
              </span>
            </div>
            <h2 className="font-aeonik-regular mb-3 text-[26px] font-normal tracking-[-0.015em] text-[#202020] md:text-[30px]">
              Still need a hand?
            </h2>
            <p className="mb-8 text-[15px] font-normal leading-[1.6] text-[#666666] md:text-[16px]">
              Couldn&apos;t find what you were looking for? Our support team is here to help with questions, technical issues and other concerns.
            </p>
            <div className="mb-4">
              <Link
                href="/support"
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[8px] bg-black px-7 py-3.5 text-[14px] font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.06)] transition-all hover:bg-[#202020] hover:shadow-md"
              >
                <span>Contact Support</span>
                <span className="text-[#CAFFA6]" aria-hidden>
                  →
                </span>
              </Link>
            </div>
            <p className="text-[13px] text-[#777777]">We&apos;re here to help you get the most out of Pintree.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
