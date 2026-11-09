"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getFaqs } from "@/utils/faq";

const fallbackFaqItems = [
  {
    id: "cmw8vhhz5000mo701fqlrxb04",
    question: "What is Pintree?",
    answer:
      "Pintree is a community-first social networking platform that brings people, communities and shared interests together. It allows you to connect with friends, follow people, join communities, participate in discussions, share updates and discover new people and interests. Pintree provides a space to build meaningful connections and engage with communities that matter to you.",
  },
  {
    id: "cmw8vi3va000oo701sdxixoy8",
    question: "How does Pintree work?",
    answer:
      "Getting started with Pintree is simple. Create your account, complete your profile and start exploring. Your Home feed brings together updates from your friends, people you follow and communities you've joined. You can discover new people and communities, share posts, interact with others and participate in community discussions. You can also join Rooms within communities for more focused conversations.",
  },
  {
    id: "cmw8vjhnd000qo70165eq6hs7",
    question: "Can I change my registered mobile number or email address?",
    answer:
      "Yes. You can update your registered mobile number or email address from the Account Settings section. You may be required to verify your new contact information to complete the change.",
  },
  {
    id: "cmw8vjwsn000so701usmdd5fq",
    question: "Can I change my username after creating my account?",
    answer:
      "Yes. You can change your username through the Edit Profile option. However, usernames are unique, so your preferred username must be available before you can use it.",
  },
  {
    id: "cmw8vkn89000uo701f6874t33",
    question: "Who can create a community on Pintree?",
    answer:
      "Anyone with an active Pintree account can create a community. Whether you want to start a discussion group, build an interest-based community or create a private group for your circle, you have the tools to set it up and manage it.",
  },
  {
    id: "cmw8vl89r000wo701416q05r4",
    question: "How can I create a community on Pintree?",
    answer:
      "To create a community, go to the Communities section, click on \"Create Community\", fill in details such as name, description and privacy type (Public or Private) and submit.",
  },
];

function ArrowRightIcon() {
  return (
    <svg
      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      className="h-4 w-4 text-black"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        d="M12 4.5v15m7.5-7.5h-15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg
      className="h-4 w-4 text-black"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path d="M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ForumIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z" />
    </svg>
  );
}

export default function Section9() {
  const [openIndex, setOpenIndex] = useState(null);
  const [items, setItems] = useState(fallbackFaqItems);

  useEffect(() => {
    let cancelled = false;
    async function fetchQuestions() {
      try {
        const topics = await getFaqs();
        if (cancelled) return;
        const allQuestions = (topics || [])
          .flatMap((t) => t.questions || [])
          .filter((q) => q && q.question && q.answer)
          .slice(0, 6);

        if (allQuestions.length > 0) {
          setItems(allQuestions);
        }
      } catch (err) {
        console.error("Failed to load FAQs:", err);
      }
    }

    fetchQuestions();
    return () => {
      cancelled = true;
    };
  }, []);

  const displayItems = items.slice(0, 6);

  return (
    <section
      aria-labelledby="faq-main-heading"
      className="w-full bg-[#fcf9f8] py-20 font-jakarta text-[#1b1c1c] lg:py-24"
    >
      <div className="mx-auto w-full max-w-[1340px] px-8">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-x-20">
          {/* Left column */}
          <div className="lg:sticky lg:top-24 lg:col-span-5 lg:pt-2">
            <div className="mb-6 inline-flex items-center gap-2.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#baee97] ring-4 ring-[#CAFFA6]/30" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#444748]">
                Questions &amp; Answers
              </span>
            </div>

            <h2
              id="faq-main-heading"
              className="font-aeonik-regular text-[36px] font-normal leading-[1.15] tracking-tight text-black sm:text-[44px] lg:text-5xl"
            >
              Answers to your questions.
            </h2>

            <p className="mb-10 mt-5 max-w-sm font-jakarta text-[18px] font-normal leading-7 tracking-[-0.005em] text-[#444748]">
              Everything you need to know about Pintree.
            </p>

            <div>
              <Link
                href="/faq"
                className="group inline-flex items-center gap-2.5 rounded-full border border-black px-7 py-3.5 text-[15px] font-semibold leading-5 tracking-[0.01em] text-black transition-all duration-200 hover:bg-black hover:text-white active:scale-[0.98]"
              >
                <span>More questions</span>
                <ArrowRightIcon />
              </Link>
            </div>

            <div className="mt-16 max-w-xs border-t border-[#e4e2e1]/70 pt-8">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0eded] text-[#444748]">
                  <ForumIcon />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#1b1c1c]">
                    Human Support
                  </div>
                  <div className="text-[14px] font-normal leading-5 tracking-[0.005em] text-[#444748]">
                    Average response under 24 hours
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column — accordion */}
          <div className="lg:col-span-7">
            <div className="flex w-full flex-col">
              {displayItems.map((item, index) => {
                const isOpen = openIndex === index;
                const isLast = index === displayItems.length - 1;
                const contentId = `faq-content-${item.id || index + 1}`;

                return (
                  <div
                    key={item.id || item.question || index}
                    className={`border-t border-[#e4e2e1] transition-colors duration-150 ${
                      isLast ? "border-b" : ""
                    }`}
                  >
                    <button
                      type="button"
                      aria-controls={contentId}
                      aria-expanded={isOpen}
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="group flex w-full items-center justify-between py-6 text-left focus:outline-none"
                    >
                      <span className="pr-6 font-aeonik-regular text-[18px] font-normal leading-7 tracking-[-0.005em] text-black transition-colors">
                        {item.question}
                      </span>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors">
                        {isOpen ? <MinusIcon /> : <PlusIcon />}
                      </span>
                    </button>

                    <div
                      id={contentId}
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen
                          ? "max-h-[500px] opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <p className="pb-6 pr-12 font-jakarta text-[16px] font-normal leading-6 text-[#444748] whitespace-pre-line">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
