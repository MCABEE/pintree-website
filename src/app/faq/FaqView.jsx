"use client";

import { useEffect, useMemo, useState } from "react";
import { getFaqs } from "@/utils/faq";

// Fallback data in case the API is temporarily unreachable or offline
const FALLBACK_CATEGORIES = [
  {
    id: "category-getting-started",
    heading: "Getting Started",
    subHeading: "Discover Pintree and understand the basics.",
    questionCount: 3,
    questions: [
      {
        id: "fb-1",
        question: "What is Pintree?",
        answer:
          "Pintree is a community-first social platform built around people, communities and meaningful conversations. It brings together personal profiles, shared interests, community spaces and discovery to help people connect and participate with purpose.",
      },
      {
        id: "fb-2",
        question: "How is Pintree different from other social platforms?",
        answer:
          "Pintree puts people, communities and conversations at the center of the experience. Instead of focusing only on scrolling through content, it encourages meaningful connections, participation in shared interests and conversations that bring people together.",
      },
      {
        id: "fb-3",
        question: "Is Pintree free to use?",
        answer:
          "Pintree is designed to make social connections and community participation accessible. You can create an account and explore the platform's core social experiences.",
      },
    ],
  },
  {
    id: "category-accounts-profiles",
    heading: "Accounts & Profiles",
    subHeading: "Learn about account types and how your identity works on Pintree.",
    questionCount: 3,
    questions: [
      {
        id: "fb-4",
        question: "Who can join Pintree?",
        answer:
          "Anyone who meets the platform's applicable age and usage requirements can join Pintree. Whether you want to connect with people, participate in communities or explore shared interests, there is a place for you.",
      },
      {
        id: "fb-5",
        question: "What types of accounts are available on Pintree?",
        answer:
          "Pintree supports different account identities, including Personal, Professional, Community, Business, News & Media and Public Figure accounts.",
      },
      {
        id: "fb-6",
        question: "Can I change my registered mobile number or email address?",
        answer:
          "Yes. You can update your registered mobile number or email address from the Account Settings section.",
      },
    ],
  },
  {
    id: "category-communities-rooms",
    heading: "Communities & Rooms",
    subHeading: "Explore shared spaces and focused conversations.",
    questionCount: 2,
    questions: [
      {
        id: "fb-7",
        question: "What are Pintree communities?",
        answer:
          "Communities are spaces where people come together around shared interests, organizations, activities or common goals.",
      },
      {
        id: "fb-8",
        question: "What are Rooms, and how do they work?",
        answer:
          "Rooms are focused conversation spaces within communities. They help members participate in more specific discussions.",
      },
    ],
  },
];

function PlusIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      className="h-4 w-4 text-gray-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden>
      <circle cx="11" cy="11" r="8" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function SkeletonCategory() {
  return (
    <div className="animate-pulse space-y-6 border-b border-[#E5E5E5] pb-12">
      <div className="space-y-2">
        <div className="h-6 w-48 rounded bg-gray-200" />
        <div className="h-4 w-80 rounded bg-gray-100" />
      </div>
      <div className="divide-y divide-[#E5E5E5] border-y border-[#E5E5E5]">
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex items-center justify-between py-6">
            <div className="h-5 w-3/4 rounded bg-gray-200" />
            <div className="h-8 w-8 rounded-full bg-gray-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FaqView() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [openKeys, setOpenKeys] = useState(new Set());
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  // Fetch real FAQ data from https://api.places.mcabee.in/v1/faqs
  useEffect(() => {
    let isMounted = true;

    async function loadFaqs() {
      setLoading(true);
      setError(null);
      try {
        const data = await getFaqs();
        if (isMounted) {
          if (Array.isArray(data) && data.length > 0) {
            setTopics(data);
            setIsUsingFallback(false);
            // Open the first question by default
            const firstTopicWithQuestions = data.find(
              (t) => Array.isArray(t.questions) && t.questions.length > 0
            );
            if (firstTopicWithQuestions && firstTopicWithQuestions.questions[0]) {
              setOpenKeys(new Set([firstTopicWithQuestions.questions[0].id]));
            }
          } else {
            // Empty data, fallback gracefully
            setTopics(FALLBACK_CATEGORIES);
            setIsUsingFallback(true);
            setOpenKeys(new Set(["fb-1"]));
          }
        }
      } catch (err) {
        console.error("Error fetching FAQ data from API:", err);
        if (isMounted) {
          setError(err.message || "Failed to load FAQs");
          setTopics(FALLBACK_CATEGORIES);
          setIsUsingFallback(true);
          setOpenKeys(new Set(["fb-1"]));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadFaqs();

    return () => {
      isMounted = false;
    };
  }, []);

  function toggle(key) {
    setOpenKeys((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  // Only include topics that have at least 1 question
  const availableTopics = useMemo(() => {
    return (topics || []).filter(
      (t) => Array.isArray(t.questions) && t.questions.length > 0
    );
  }, [topics]);

  // Filter topics and questions based on the search query
  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) {
      return availableTopics;
    }
    const q = searchQuery.toLowerCase().trim();

    return availableTopics
      .map((topic) => {
        const topicMatches =
          topic.heading?.toLowerCase().includes(q) ||
          topic.subHeading?.toLowerCase().includes(q);

        const matchingQuestions = (topic.questions || []).filter(
          (item) =>
            item.question?.toLowerCase().includes(q) ||
            item.answer?.toLowerCase().includes(q)
        );

        if (topicMatches || matchingQuestions.length > 0) {
          return {
            ...topic,
            // If topic name matched but no specific questions matched, keep all its questions;
            // otherwise keep only matching questions
            questions:
              matchingQuestions.length > 0 ? matchingQuestions : topic.questions,
          };
        }
        return null;
      })
      .filter((t) => t && Array.isArray(t.questions) && t.questions.length > 0);
  }, [availableTopics, searchQuery]);

  // Count total questions matching
  const totalQuestionsCount = useMemo(() => {
    return filteredTopics.reduce(
      (sum, t) => sum + (Array.isArray(t.questions) ? t.questions.length : 0),
      0
    );
  }, [filteredTopics]);

  return (
    <main className="font-jakarta mx-auto w-full max-w-[1536px] bg-white px-6 py-16 text-[#525252] selection:bg-[#CAFFA6] selection:text-[#202020] sm:px-12 md:px-20 md:py-24 lg:px-[128px] lg:py-28">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16 xl:gap-20">
          {/* Left Column / Sidebar */}
          <aside className="lg:sticky lg:top-[88px] lg:col-span-4 lg:self-start lg:pr-4">
            <div className="space-y-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2">
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-[#204654]"
                    aria-hidden
                  />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#777777]">
                    Questions &amp; Answers
                  </span>
                </div>
                <h1 className="font-aeonik-regular text-4xl font-normal leading-[1.1] tracking-[-0.03em] text-[#202020] sm:text-5xl lg:text-[48px]">
                  Answers to your questions.
                </h1>
                <p className="max-w-sm text-[15px] leading-relaxed text-[#666666] sm:text-base">
                  Everything you need to know about Pintree, how it works and how
                  to be part of it.
                </p>
                <div className="pt-2">
                  <a
                    href="/support"
                    className="group inline-flex items-center justify-between gap-4 rounded-full border border-[#202020] px-5 py-3 text-sm font-medium text-[#202020] transition-all duration-200 hover:bg-[#202020] hover:text-white">
                    <span>Contact support</span>
                    <span
                      className="text-base transition-transform duration-200 group-hover:translate-x-1"
                      aria-hidden>
                      →
                    </span>
                  </a>
                </div>
              </div>

              {/* Jump to topic navigation */}
              <div className="hidden space-y-3 border-t border-[#E5E5E5] pt-8 sm:block">
                <span className="block text-[14px] font-semibold uppercase tracking-wider text-[#777777]">
                  Jump to topic
                </span>
                <nav className="flex max-h-[380px] flex-col space-y-2.5 overflow-y-auto pr-2 text-[14px]">
                  {loading ? (
                    <div className="space-y-2.5 pt-1">
                      <div className="h-4 w-32 rounded bg-gray-200" />
                      <div className="h-4 w-40 rounded bg-gray-100" />
                      <div className="h-4 w-28 rounded bg-gray-200" />
                    </div>
                  ) : (
                    availableTopics.map((topic) => (
                      <a
                        key={topic.id}
                        href={`#topic-${topic.id}`}
                        className="inline-flex items-center leading-relaxed text-[#525252] transition-all hover:translate-x-1 hover:text-[#202020]">
                        {topic.heading}
                      </a>
                    ))
                  )}
                </nav>
              </div>

              {/* Support contact info */}
              <div
                id="support"
                className="scroll-mt-28 space-y-3 border-t border-[#E5E5E5] pt-8">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-2 w-2 rounded-full bg-[#CAFFA6] ring-2 ring-[#CAFFA6]/30"
                    aria-hidden
                  />
                  <span className="text-[14px] font-semibold uppercase tracking-[0.16em] text-[#777777]">
                    Human Support
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-[#525252]">
                  Have another question? Our support team is here to help.
                </p>
                <div className="pt-1">
                  <a
                    href="mailto:hello@pintree.co"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#204654] underline-offset-4 hover:underline">
                    <span>hello@pintree.co</span>
                    <svg
                      className="h-3 w-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column / FAQ Topics List */}
          <section className="space-y-12 lg:col-span-8 lg:space-y-16">
            {/* Live Search Input */}
            <div className="relative w-full">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Search questions or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-[#E5E5E5] bg-[#F7F7F7] py-3.5 pl-11 pr-10 text-[15px] text-[#202020] placeholder-gray-400 transition-all focus:border-[#204654] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#204654]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-xs font-semibold text-gray-400 hover:text-gray-600">
                  Clear
                </button>
              )}
            </div>

            {/* Offline/Error notice if API couldn't be reached */}
            {isUsingFallback && (
              <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
                <span>Displaying cached FAQ topics. Live API server is temporarily unreachable.</span>
                <button
                  onClick={() => window.location.reload()}
                  className="font-semibold underline hover:no-underline">
                  Retry
                </button>
              </div>
            )}

            {/* Search results banner */}
            {searchQuery && (
              <div className="text-sm text-gray-500">
                Found <strong className="text-[#202020]">{totalQuestionsCount}</strong> questions matching &quot;{searchQuery}&quot;
              </div>
            )}

            {/* Skeleton Loading State */}
            {loading && (
              <div className="space-y-12">
                <SkeletonCategory />
                <SkeletonCategory />
              </div>
            )}

            {/* Zero Results State */}
            {!loading && filteredTopics.length === 0 && (
              <div className="rounded-2xl border border-[#E5E5E5] bg-[#F7F7F7] p-12 text-center">
                <h3 className="font-aeonik-medium text-lg text-[#202020]">
                  No questions found
                </h3>
                <p className="mt-2 text-sm text-[#666666]">
                  We couldn&apos;t find any questions matching &quot;{searchQuery}&quot;. Try another search term or contact our support team.
                </p>
                <div className="mt-6 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="rounded-full bg-[#202020] px-5 py-2 text-xs font-semibold text-white transition hover:bg-black">
                    Clear Search
                  </button>
                  <a
                    href="/support"
                    className="rounded-full border border-[#E5E5E5] bg-white px-5 py-2 text-xs font-semibold text-[#202020] transition hover:border-[#202020]">
                    Contact Support
                  </a>
                </div>
              </div>
            )}

            {/* Topics and Questions list */}
            {!loading &&
              filteredTopics.map((topic) => {
                const topicQuestions = topic.questions || [];

                return (
                  <div
                    key={topic.id}
                    id={`topic-${topic.id}`}
                    className="scroll-mt-28 space-y-6">
                    <div className="space-y-1 pb-1">
                      <h2 className="font-aeonik-medium text-[22px] font-medium tracking-[-0.02em] text-[#202020]">
                        {topic.heading}
                      </h2>
                      {topic.subHeading && (
                        <p className="text-sm text-[#666666] sm:text-[15px]">
                          {topic.subHeading}
                        </p>
                      )}
                    </div>

                    <div className="divide-y divide-[#E5E5E5] border-y border-[#E5E5E5]">
                      {topicQuestions.map((item) => {
                        const key = item.id;
                        const isOpen = openKeys.has(key);
                        return (
                          <div
                            key={key}
                            className="group py-5 transition-colors sm:py-6">
                            <button
                              type="button"
                              aria-expanded={isOpen}
                              onClick={() => toggle(key)}
                              className="flex w-full cursor-pointer items-center justify-between gap-6 text-left focus:outline-none">
                              <span className="text-base font-medium text-[#202020] transition-colors group-hover:text-[#204654] sm:text-lg">
                                {item.question}
                              </span>
                              <span
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F7F7F7] text-[#202020] transition-all duration-300 group-hover:bg-[#E5E5E5]/60 ${
                                  isOpen ? "rotate-45" : ""
                                }`}>
                                <PlusIcon />
                              </span>
                            </button>
                            <div
                              className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out ${
                                isOpen
                                  ? "mt-4 grid-rows-[1fr] opacity-100"
                                  : "grid-rows-[0fr] opacity-0"
                              }`}>
                              <div className="overflow-hidden">
                                <p className="pr-6 text-[15px] leading-relaxed text-[#525252] sm:pr-12">
                                  {item.answer}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </section>
        </div>
      </div>
    </main>
  );
}
