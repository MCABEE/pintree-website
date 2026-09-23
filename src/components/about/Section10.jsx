"use client";

import React from "react";

const bgAsset = "/geralt-people.svg";
const bgAssetFallback = "/geralt-people-2923048_1920-1.svg";

export default function Section10() {
  return (
    <section className="relative flex min-h-[520px] w-full items-center justify-center overflow-hidden bg-[#101010] py-[96px] sm:min-h-[560px] sm:py-[112px] lg:min-h-[600px] lg:py-[128px]">
      <img
        src={bgAsset}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
        onError={(e) => {
          if (e.currentTarget.src !== bgAssetFallback) {
            e.currentTarget.src = bgAssetFallback;
          }
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[#101010]/72"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1536px] flex-col items-center px-6 text-center sm:px-10 lg:px-[136px]">
        <h2 className="mx-auto max-w-[640px] text-[30px] font-aeonik-medium font-medium leading-[1.15] tracking-[-0.02em] text-[#F0F0F0] sm:text-[36px] lg:text-[40px]">
          Your story belongs here
        </h2>
        <p className="mx-auto mt-[14px] max-w-[620px] text-[14px] font-aeonik-regular font-normal leading-[1.5] text-[#9A9A9A] sm:text-[15px] lg:mt-[16px] lg:whitespace-nowrap">
          Pintree is where people, communities, and discovery come together.
        </p>
        <div className="mt-[26px] flex justify-center sm:mt-[28px]">
          <a
            href="#"
            className="inline-flex h-[42px] min-w-[148px] items-center justify-center rounded-[10px] bg-[#2B2B2B] px-7 text-[14px] font-aeonik-regular font-normal text-[#D4D4D4] transition-colors hover:bg-[#353535] sm:h-[44px] sm:px-8 sm:text-[15px]"
          >
            Download app
          </a>
        </div>
      </div>
    </section>
  );
}
