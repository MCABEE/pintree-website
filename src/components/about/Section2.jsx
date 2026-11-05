"use client";

import Link from "next/link";

const PEOPLE_IMG = "/section2/people-irine-joy.jpg";
const COMMUNITIES_IMG = "/section2/communities-outdoor-dining.jpg";
const ROOMS_IMG = "/section2/rooms-discussion.jpg";
const CONNECTIONS_IMG = "/section2/connections-relaxed-reading.jpg";
const DISCOVER_IMG = "/section2/discover-scenic-hill.jpg";

export default function Section2() {
  return (
    <section className="w-full border-[#E5E5E5] bg-white pb-12 font-jakarta text-[#202020]">
      <div className="mx-auto w-full max-w-[1340px] px-8">
        {/* Section intro */}
        <div className="flex flex-col justify-between gap-6 pb-12 md:flex-row md:items-end">
          <div>
            <div className="mb-3.5 flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-[#CAFFA6] ring-2 ring-[#e6ffd1]" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#777777]">
                START WITH WHAT MATTERS TO YOU
              </span>
            </div>
            <h2 className="font-aeonik-regular text-4xl font-normal leading-[1.08] tracking-tight text-[#202020] sm:text-5xl lg:text-[48px]">
              Connect. Participate.
              <br />
              Discover.
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="font-jakarta text-[16px] font-normal leading-6 tracking-normal text-[#525252]">
              Pintree brings your profile, connections, communities, and
              discovery experience together in one place.
            </p>
          </div>
        </div>

        <div className="w-full border-b border-[#E5E5E5]" />

        {/* People + Communities */}
        <div className="grid grid-cols-1 items-start gap-12 py-16 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col lg:col-span-5">
            <div className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-wider text-[#777777]">
              <span className="font-medium">THE PERSONAL SPACE</span>
            </div>
            <h3 className="mb-3 font-aeonik-regular text-[36px] font-normal leading-tight tracking-tight text-[#202020]">
              People
            </h3>
            <p className="mb-8 max-w-md font-jakarta text-[16px] font-normal leading-6 tracking-normal text-[#525252]">
              Your profile is your space. Create your profile, share who you
              are, and manage how you connect with others.
            </p>
            <div className="relative aspect-[4/5] h-[450px] w-[360px] max-w-full overflow-hidden rounded-2xl border border-[#ececec] shadow-sm">
              <img
                src={PEOPLE_IMG}
                alt="Irine Joy portrait"
                className="block aspect-[4/5] h-[450px] w-full max-w-[360px] object-cover object-top"
              />
              <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-xl border border-white/60 bg-white/90 px-3.5 py-2.5 shadow-sm backdrop-blur-md">
                <div>
                  <p className="font-aeonik-medium text-[12px] font-semibold leading-tight text-[#1a1a1a]">
                    Irine Joy
                  </p>
                  <p className="text-[10px] leading-tight text-[#666666]">
                    Independent Curator
                  </p>
                </div>
                <span className="rounded-md bg-black/5 px-2 py-0.5 text-[10.5px] font-medium text-[#777777]">
                  Joined 2024
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:col-span-7">
            <div className="relative mb-7 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-[#ececec] shadow-sm lg:aspect-[2.1/1]">
              <img
                src={COMMUNITIES_IMG}
                alt="Communities outdoor dining"
                className="block h-full w-full object-cover"
              />
              <div className="absolute right-3.5 top-3.5 flex items-center gap-1.5 rounded-full border border-white/80 bg-white/95 px-3 py-1.5 shadow-sm backdrop-blur-md">
                <span className="inline-block h-2 w-2 rounded-full bg-[#CAFFA6] ring-2 ring-[#e6ffd1]" />
                <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[#777777]">
                  ACTIVE SANCTUARY
                </span>
              </div>
            </div>
            <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-wider text-[#777777]">
              <span className="font-medium">SHARED BELONGING</span>
            </div>
            <h3 className="mb-2 font-aeonik-regular text-[36px] font-normal leading-[1.1] tracking-tight text-[#202020]">
              Communities
            </h3>
            <p className="max-w-xl font-jakarta text-[16px] font-normal leading-6 tracking-normal text-[#525252]">
              Find places to belong. Join communities built around shared
              interests, organizations, and local groups. Share ideas, take part
              in meaningful conversations, discover different perspectives, and
              build connections with people who care about the same things.
            </p>
            <div className="pt-12">
              <Link
                href="/support"
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#000000] px-5 py-2.5 font-jakarta text-[13px] font-medium leading-none text-white transition-colors hover:bg-[#202020]">
                <span className="font-jakarta text-[12px] font-medium">
                  Explore Communities
                </span>
                <span className="text-sm">→</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="w-full border-b border-[#E5E5E5]" />

        {/* Rooms + Connections */}
        <div className="relative grid grid-cols-1 items-start gap-12 py-16 md:grid-cols-2 lg:gap-16">
          <div className="flex flex-col pr-0 md:pr-4">
            <div className="mb-2.5 flex items-center gap-2 text-[11px] uppercase tracking-wider text-[#777777]">
              <span className="font-medium">INTIMATE SPACES</span>
            </div>
            <h3 className="mb-2.5 font-aeonik-regular text-[36px] font-normal tracking-tight text-[#202020]">
              Rooms
            </h3>
            <p className="mb-6 font-jakarta text-[16px] font-normal leading-6 tracking-normal text-[#525252]">
              Take conversations deeper. Join focused discussions within
              communities through dedicated rooms.
            </p>
            <div className="mb-3 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-[#ececec] shadow-sm">
              <img
                src={ROOMS_IMG}
                alt="Rooms discussion"
                className="block h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col border-[#E5E5E5] pl-0 md:border-l md:pl-4">
            <div className="mb-2.5 flex items-center gap-2 text-[11px] uppercase tracking-wider text-[#777777]">
              <span className="font-medium">MEANINGFUL BONDS</span>
            </div>
            <h3 className="mb-2.5 font-aeonik-regular text-[36px] font-normal tracking-tight text-[#202020]">
              Connections
            </h3>
            <p className="mb-6 font-jakarta text-[16px] font-normal leading-6 tracking-normal text-[#525252]">
              Build your network. Find people, follow accounts, and build
              meaningful connections through mutual interests.
            </p>
            <div className="mb-3 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-[#ececec] shadow-sm">
              <img
                src={CONNECTIONS_IMG}
                alt="Connections relaxed reading"
                className="block h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="w-full border-b border-[#E5E5E5]" />

        {/* Discover */}
        <div className="grid grid-cols-1 items-center gap-12 py-16 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col justify-center lg:col-span-5">
            <div className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-wider text-[#777777]">
              <span className="font-medium">THE WIDER WORLD</span>
            </div>
            <h3 className="mb-3 font-aeonik-regular text-[36px] font-normal leading-tight tracking-tight text-[#202020]">
              Discover
            </h3>
            <p className="mb-6 font-jakarta text-[16px] font-normal leading-6 tracking-normal text-[#525252]">
              Go beyond your network. Explore posts and communities from people
              you haven&apos;t connected yet.
            </p>
            <div className="mb-8 space-y-3">
              <div className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#CAFFA6] ring-2 ring-[#e6ffd1]" />
                <p className="font-jakarta text-[14px] font-normal leading-[22px] tracking-normal text-[#525252]">
                  Serendipitous encounters with writers, local workshops, and
                  grassroots collectives curated purely by resonance.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#CAFFA6] ring-2 ring-[#e6ffd1]" />
                <p className="font-jakarta text-[14px] font-normal leading-[22px] tracking-normal text-[#525252]">
                  Open horizons where quiet taste and thoughtful dialogue take
                  precedence over engagement-maximizing noise.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/newsroom"
                className="rounded-full bg-black px-5 py-2.5 text-xs font-medium text-white shadow-sm transition hover:bg-neutral-800">
                Explore Stories
              </Link>
              <Link
                href="/support"
                className="rounded-full border border-[#E5E5E5] bg-[#F7F7F7] px-5 py-2.5 text-xs font-medium text-[#202020] transition hover:bg-[#ececec]">
                Browse Directory
              </Link>
            </div>
          </div>

          <div className="flex flex-col lg:col-span-7">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-[#ececec] shadow-sm">
              <img
                src={DISCOVER_IMG}
                alt="Scenic hill landscape at golden hour"
                className="block h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6 lg:p-8">
                <div className="flex w-full items-end justify-between text-white">
                  <div>
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-300">
                      CULTURAL DISPATCH
                    </p>
                    <h4 className="font-aeonik-regular text-lg font-normal tracking-tight text-white lg:text-xl">
                      The Architecture of Everyday Gathering
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
