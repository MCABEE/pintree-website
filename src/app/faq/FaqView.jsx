"use client";

import { useState } from "react";

const CATEGORIES = [
  {
    id: "category-getting-started",
    title: "Getting Started",
    description: "Discover Pintree and understand the basics.",
    items: [
      {
        question: "What is Pintree?",
        answer:
          "Pintree is a community-first social platform built around people, communities and meaningful conversations. It brings together personal profiles, shared interests, community spaces and discovery to help people connect and participate with purpose.",
      },
      {
        question: "How is Pintree different from other social platforms?",
        answer:
          "Pintree puts people, communities and conversations at the center of the experience. Instead of focusing only on scrolling through content, it encourages meaningful connections, participation in shared interests and conversations that bring people together.",
      },
      {
        question: "Is Pintree free to use?",
        answer:
          "Pintree is designed to make social connections and community participation accessible. You can create an account and explore the platform's core social experiences. Check the relevant service information for any features or services that may have separate conditions.",
      },
    ],
  },
  {
    id: "category-accounts-profiles",
    title: "Accounts & Profiles",
    description: "Learn about account types and how your identity works on Pintree.",
    items: [
      {
        question: "Who can join Pintree?",
        answer:
          "Anyone who meets the platform's applicable age and usage requirements can join Pintree. Whether you want to connect with people, participate in communities or explore shared interests, there is a place for you.",
      },
      {
        question: "What types of accounts are available on Pintree?",
        answer:
          "Pintree supports different account identities, including Personal, Professional, Community, Business, News & Media and Public Figure accounts. Each is designed for a different way of participating and presenting yourself on the platform.",
      },
      {
        question: "Can I create a professional or business account?",
        answer:
          "Yes. Pintree supports professional and business identities. These account types follow a linked account creation process, starting with a personal account before creating the additional identity.",
      },
      {
        question: "Can I have a private profile?",
        answer:
          "Yes. Pintree supports public and private personal accounts. With a private account, you have greater control over who can connect with you and access content shared with your approved audience.",
      },
    ],
  },
  {
    id: "category-communities-rooms",
    title: "Communities & Rooms",
    description: "Explore shared spaces and focused conversations.",
    items: [
      {
        question: "What are Pintree communities?",
        answer:
          "Communities are spaces where people come together around shared interests, organizations, activities or common goals. Members can participate, share posts and connect with others who have similar interests.",
      },
      {
        question: "Can anyone create a community?",
        answer:
          "Pintree allows users to create communities around interests and organizations, subject to the platform's community creation requirements and guidelines.",
      },
      {
        question: "What are Rooms, and how do they work?",
        answer:
          "Rooms are focused conversation spaces within communities. They help members participate in more specific discussions and activities rather than having every conversation in one general feed.",
      },
      {
        question: "Are Pintree communities public or private?",
        answer:
          "Pintree supports both public and private communities. Public communities provide an open space for discovery and participation, while private communities offer a more controlled membership experience.",
      },
    ],
  },
  {
    id: "category-connections-privacy",
    title: "Connections & Privacy",
    description: "Understand how relationships, discovery and privacy work.",
    items: [
      {
        question: "How do connections and friendships work on Pintree?",
        answer:
          "Pintree allows people to follow one another and build connections. When a follow relationship becomes mutual, the two users are considered friends. Private accounts can require approval before someone becomes a follower.",
      },
      {
        question: "How can I control my privacy on Pintree?",
        answer:
          "Pintree provides privacy controls for your account and shared content. Depending on the content and settings, you can choose to share with everyone, followers, friends or selected groups of friends.",
      },
      {
        question: "Can I discover people and communities outside my network?",
        answer:
          "Yes. Pintree's Discover experience helps you find people, posts and communities beyond your existing connections. It gives you opportunities to explore new interests and discover conversations you might otherwise miss.",
      },
    ],
  },
];

function PlusIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

export default function FaqView() {
  const [openKeys, setOpenKeys] = useState(() => new Set(["category-getting-started-0"]));

  function toggle(key) {
    setOpenKeys((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <main className="font-jakarta mx-auto w-full max-w-[1536px] bg-white px-6 py-16 text-[#525252] selection:bg-[#CAFFA6] selection:text-[#202020] sm:px-12 md:px-20 md:py-24 lg:px-[128px] lg:py-28">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16 xl:gap-20">
          <aside className="lg:sticky lg:top-[88px] lg:col-span-4 lg:self-start lg:pr-4">
            <div className="space-y-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#204654]" aria-hidden />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#777777]">
                    Questions &amp; Answers
                  </span>
                </div>
                <h1 className="font-aeonik-regular text-4xl font-normal leading-[1.1] tracking-[-0.03em] text-[#202020] sm:text-5xl lg:text-[48px]">
                  Answers to your questions.
                </h1>
                <p className="max-w-sm text-[15px] leading-relaxed text-[#666666] sm:text-base">
                  Everything you need to know about Pintree, how it works and how to be part of it.
                </p>
                <div className="pt-2">
                  <a
                    href="/support"
                    className="group inline-flex items-center justify-between gap-4 rounded-full border border-[#202020] px-5 py-3 text-sm font-medium text-[#202020] transition-all duration-200 hover:bg-[#202020] hover:text-white"
                  >
                    <span>Contact support</span>
                    <span className="text-base transition-transform duration-200 group-hover:translate-x-1" aria-hidden>
                      →
                    </span>
                  </a>
                </div>
              </div>

              <div className="hidden space-y-3 border-t border-[#E5E5E5] pt-8 sm:block">
                <span className="block text-[14px] font-semibold uppercase tracking-wider text-[#777777]">
                  Jump to topic
                </span>
                <nav className="flex flex-col space-y-3 text-[14px]">
                  {CATEGORIES.map((category) => (
                    <a
                      key={category.id}
                      href={`#${category.id}`}
                      className="inline-flex items-center leading-relaxed text-[#525252] transition-all hover:translate-x-1 hover:text-[#202020]"
                    >
                      {category.title}
                    </a>
                  ))}
                </nav>
              </div>

              <div id="support" className="scroll-mt-28 space-y-3 border-t border-[#E5E5E5] pt-8">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#CAFFA6] ring-2 ring-[#CAFFA6]/30" aria-hidden />
                  <span className="text-[14px] font-semibold uppercase tracking-[0.16em] text-[#777777]">
                    Human Support
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-[#525252]">
                  Have another question? Our support team is here to help.
                </p>
                <div className="pt-1">
                  <a
                    href="mailto:support@pintree.com"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#204654] underline-offset-4 hover:underline"
                  >
                    <span>support@pintree.com</span>
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </aside>

          <section className="space-y-20 lg:col-span-8 lg:space-y-24">
            {CATEGORIES.map((category) => (
              <div key={category.id} id={category.id} className="scroll-mt-28 space-y-8">
                <div className="space-y-2 pb-2">
                  <h2 className="font-aeonik-medium text-[22px] font-medium tracking-[-0.02em] text-[#202020]">
                    {category.title}
                  </h2>
                  <p className="text-sm text-[#666666] sm:text-[15px]">{category.description}</p>
                </div>
                <div className="divide-y divide-[#E5E5E5] border-y border-[#E5E5E5]">
                  {category.items.map((item, index) => {
                    const key = `${category.id}-${index}`;
                    const isOpen = openKeys.has(key);
                    return (
                      <div key={key} className="group py-5 transition-colors sm:py-6">
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          onClick={() => toggle(key)}
                          className="flex w-full cursor-pointer items-center justify-between gap-6 text-left focus:outline-none"
                        >
                          <span className="text-base font-medium text-[#202020] transition-colors group-hover:text-[#204654] sm:text-lg">
                            {item.question}
                          </span>
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F7F7F7] text-[#202020] transition-all duration-300 group-hover:bg-[#E5E5E5]/60 ${
                              isOpen ? "rotate-45" : ""
                            }`}
                          >
                            <PlusIcon />
                          </span>
                        </button>
                        <div
                          className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out ${
                            isOpen ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <p className="pr-6 text-[15px] leading-relaxed text-[#525252] sm:pr-12">{item.answer}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </main>
  );
}
