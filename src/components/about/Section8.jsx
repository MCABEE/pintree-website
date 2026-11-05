"use client";

const stories = [
  {
    id: "story-1",
    title:
      "Pintree Launches a New Social Space Built for Meaningful Connections",
    excerpt:
      "Discover a fresh approach to social networking, bringing people, creators, and communities together in one place.",
    href: "/newsroom/introducing-a-new-space",
  },
  {
    id: "story-2",
    title:
      "Pintree Introduces a Fresh Social Platform for Expression and Discovery",
    excerpt:
      "Explore a modern space for sharing, discovering interests, and connecting with people and communities.",
    href: "/newsroom/introducing-a-new-space",
  },
  {
    id: "story-3",
    title: "Building a More Community-First Social Experience",
    excerpt:
      "Learn about the ideas and principles shaping Pintree's approach to meaningful participation and discovery.",
    href: "/newsroom/introducing-a-new-space",
  },
];

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
  return (
    <section
      aria-labelledby="newsroom-headline"
      className="w-full bg-white py-20 font-jakarta text-[#1b1c1c] lg:py-24"
    >
      <div className="mx-auto w-full max-w-[1340px] px-8">
        <header className="flex flex-col justify-between gap-6 pb-2 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#baee97]" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#444748]">
                Newsroom
              </span>
            </div>

            <h2
              id="newsroom-headline"
              className="font-aeonik-regular text-[32px] font-normal tracking-tight text-black sm:text-[40px] lg:text-[48px] lg:leading-[56px]"
            >
              What&apos;s New at Pintree
            </h2>

            <p className="mt-2.5 max-w-xl font-jakarta text-[16px] font-normal leading-6 text-[#444748]">
              The latest updates, stories, and things happening around Pintree.
            </p>
          </div>

          <div
            aria-label="Newsroom stories navigation"
            className="flex items-center gap-3 self-start pb-1 md:self-end"
          >
            <button
              type="button"
              aria-label="Previous stories"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#c4c7c7] bg-white text-[#1b1c1c] transition-all duration-150 hover:border-black focus:outline-none active:scale-[0.98]"
            >
              <ArrowIcon direction="left" />
            </button>
            <button
              type="button"
              aria-label="Next stories"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#c4c7c7] bg-white text-[#1b1c1c] transition-all duration-150 hover:border-black focus:outline-none active:scale-[0.98]"
            >
              <ArrowIcon direction="right" />
            </button>
          </div>
        </header>

        <div className="mt-12 grid grid-cols-1 items-stretch gap-6 md:grid-cols-3 lg:mt-14 lg:gap-8">
          {stories.map((story) => (
            <a
              key={story.id}
              href={story.href}
              className="group flex flex-col justify-between rounded-2xl border border-[#e4e2e1] bg-white p-8 transition-[transform,box-shadow,border-color] duration-250 hover:-translate-y-[3px] hover:border-[#747878] hover:shadow-[0_16px_36px_-12px_rgba(19,19,19,0.05)]"
            >
              <div>
                <h3 className="mt-6 font-aeonik-regular text-[22px] font-normal leading-[30px] text-black transition-colors group-hover:text-[#444748]">
                  {story.title}
                </h3>
                <p className="mt-3.5 font-jakarta text-[16px] font-normal leading-6 text-[#444748]">
                  {story.excerpt}
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
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
