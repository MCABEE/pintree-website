"use client";

import React from "react";

function CardArrow({ isGreen = false }) {
  return (
    <div
      className={`inline-flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-full transition-all duration-300 ${
        isGreen
          ? "border border-[#00D685] bg-[#00D685]/20 text-white shadow-[0_0_12px_rgba(0,214,133,0.3)] hover:border-white hover:bg-white hover:text-[#0C0C0C] hover:shadow-none"
          : "border border-white/40 bg-transparent text-white hover:border-white hover:bg-white hover:text-[#0C0C0C]"
      }`}
    >
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M3.33334 8H12.6667M12.6667 8L8 3.33334M12.6667 8L8 12.6667"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function BentoCard({
  image,
  fallbackImage,
  title,
  description,
  className = "",
  isGreenArrow = false,
  isLarge = false,
}) {
  return (
    <div
      className={`group relative flex flex-col items-start overflow-hidden rounded-[8px] px-[32px] py-[32px] ${
        isLarge ? "justify-center pr-[61px]" : "justify-end pr-[52px]"
      } ${className}`}
    >
      <img
        src={image}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        onError={(e) => {
          if (fallbackImage && e.currentTarget.src !== fallbackImage) {
            e.currentTarget.src = fallbackImage;
          }
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-black/15 to-black/60"
        aria-hidden
      />
      <div className="relative z-10 max-w-[320px] text-left text-white">
        <h3 className="m-0 text-[20px] font-aeonik-medium font-medium leading-[1.15] sm:text-[21px]">
          {title}
        </h3>
        <p className="mt-[10px] text-[12.5px] leading-[1.45] font-aeonik-regular text-white/85 sm:text-[13px]">
          {description}
        </p>
        <div className="mt-[24px]">
          <CardArrow isGreen={isGreenArrow} />
        </div>
      </div>
    </div>
  );
}

const featureCards = [
  {
    image: "/charlvera-polar-lights-5858656_1280_1.svg",
    fallbackImage: "/charlvera-polar-lights-5858656_1280 1.svg",
    title: "People",
    description:
      "Start with your own space. Create your profile, share who you are, and manage how you connect with others.",
    className:
      "h-[360px] w-full md:h-[400px] md:col-span-2 lg:col-span-1 lg:row-span-2 lg:h-[537px]",
    isLarge: true,
  },
  {
    image: "/tommyvideo-abstract-5719221_1280_1.svg",
    fallbackImage: "/tommyvideo-abstract-5719221_1280 1.svg",
    title: "Connections",
    description:
      "Build your network. Find people to follow accounts, and build friends through mutual connections.",
    className: "h-[240px] w-full lg:h-[264px]",
    isLarge: false,
  },
  {
    image: "/hans-aurora-3273419_1280_2.svg",
    fallbackImage: "/hans-aurora-3273419_1280 2.svg",
    title: "Communities",
    description:
      "Find places to belong. Create or join communities around shared interests, organizations, local groups, and more.",
    className: "h-[240px] w-full lg:h-[264px]",
    isLarge: false,
  },
  {
    image: "/stux-black-1072366_1280_1.svg",
    fallbackImage: "/stux-black-1072366_1280 1.svg",
    title: "Rooms",
    description:
      "Take conversations deeper. Join focused discussions within communities through dedicated rooms.",
    className: "h-[240px] w-full lg:h-[264px]",
    isLarge: false,
  },
  {
    image: "/pexels-abstract-1850416_1280_1.svg",
    fallbackImage: "/pexels-abstract-1850416_1280 1.svg",
    title: "Discover",
    description:
      "Go beyond your network. Explore posts and communities from people you haven't connected with yet.",
    className: "h-[240px] w-full lg:h-[264px]",
    isLarge: false,
  },
];

export default function Section2() {
  return (
    <section className="w-full bg-white pb-[50px] pt-[50px] sm:pb-[60px] sm:pt-[60px] lg:pb-[70px] lg:pt-[70px]">
      <div className="mx-auto w-full max-w-[1536px] px-6 sm:px-10 lg:px-[136px]">
        <div className="max-w-[980px] text-center">
          <p className="text-[14px] leading-[20px] font-aeonik-regular font-normal text-[#555555] sm:text-[16px]">
            Start with what matters to you
          </p>
          <h2 className="mt-[10px] text-[28px] font-aeonik-medium font-medium leading-[1.15] tracking-[-0.02em] text-[#0C0C0C] sm:text-[36px] lg:text-[48px]">
            Connect. Participate. Discover.
          </h2>
          <p className="mx-auto mt-[12px] max-w-[640px] text-[14px] leading-[24px] font-aeonik-regular font-normal text-[#555555] sm:text-[16px]">
            Pintree brings your profile, connections, communities, and discovery
            experience together in one place.
          </p>
        </div>

        <div className="mt-[42px] w-full max-w-[980px] lg:mt-[48px]">
          <div className="grid grid-cols-1 gap-x-[10px] gap-y-[9px] md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
            {featureCards.map((card) => (
              <BentoCard
                key={card.title}
                image={card.image}
                fallbackImage={card.fallbackImage}
                title={card.title}
                description={card.description}
                className={card.className}
                isGreenArrow={card.isGreenArrow}
                isLarge={card.isLarge}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
