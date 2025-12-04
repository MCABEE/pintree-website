"use client";
import React from "react";

export default function Section1() {
  return (
    <section className="flex flex-col items-center justify-center text-center  bg-white py-[69px] lg:pt-[100px] xl:pt-[150px] 2xl:pt-[227px]">
      <p className="text-[20px] lg:text-[32px] font-aeonik-medium text-[#333333] ">
        Get in touch with Pintree
      </p>

      <h1 className="text-[32px] lg:text-[42px] xl:text-[64px] font-aeonik-medium leading-snug text-[#1A1A1A] mb-[7px]">
        Got a{" "}
        <div className="inline bg-[#DCF4C6] pt-0 pb-3 px-2  ">question,</div>{" "}
        <br className="inline-block sm:hidden" /> need{" "}
        <span className="bg-[#C6F4F0] pb-3 px-2  ">support,</span>{" "}
        <br className="hidden sm:inline-block" />
        or <br className="inline-block sm:hidden" /> just want to{" "}
        <span className="bg-[#D5C6F4] pb-3 px-2  ">say hi?</span>
        <br />
        <span className=" block">We’re here to help</span>
      </h1>

      <p className="font-aeonik-regular text-[16px] xl:text-[24px] text-[#1A1A1A] lg:pb-[100px] xl:pb-[200px] 2xl:pb-[239px]">
        Whether you’re a user, creator, business,
        <br className="inline-block sm:hidden" /> or any professional account
        holder — <br /> feel free to reach out, and we’ll get back{" "}
        <br className="inline-block sm:hidden" /> to you soon.
      </p>
    </section>
  );
}
