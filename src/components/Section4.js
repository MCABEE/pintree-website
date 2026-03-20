"use client";
import React from "react";

export default function Section4() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-16 lg:py-44   bg-white">
      <p className="text-[#000000] leading-[140%] text-[16px] lg:text-[28px]    font-aeonik-regular">
        Career
      </p>

      <h2 className="text-[32px] lg:text-[48px]  font-aeonik-medium text-[#0C0C0C] mt-[13px] leading-tight">
        Be Part of <br className=" sm:hidden inline-block" /> What’s Next
      </h2>

      <p className="mt-[11px] text-[#1A1A1A] leading-[140%] text-[16px] lg:text-[18px] 2xl:text-[24px] font-aeonik-regular">
        Join us in shaping the future of social  connection. <br />
        Explore roles that inspire and make an impact.
      </p>

      <button className="mt-[33px] w-[180px] lg:w-[300px] h-[48px] lg:h-[64px] border border-[#1A1A1A] rounded-[4px] text-[#1A1A1A] text-[16px] lg:text-[18px] 2xl:text-[20px] font-aeonik-regular ">
        View Open Positions
      </button>
    </section>
  );
}
