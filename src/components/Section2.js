"use client";
import React from "react";

export default function Section2() {
  return (
    <section className="">
      <div className="flex flex-col md:flex-row">
        {/* ---- Top Left Image ---- */}
        <div className="w-full md:w-1/2  h-[360px] md:h-[400px] lg:h-[500px]">
          <img
            src="/img3.svg"
            alt="user feedback"
            className="w-full h-full object-cover"
          />
        </div>

        {/* ---- Top Right Text ---- */}
        <div className="w-full md:w-1/2  flex flex-col justify-center items-start  p-[20px]  lg:p-[55px]  bg-white">
          <p className="font-aeonik-regular text-[20px] sm:text-[28px] text-[#000000]">
            Users
          </p>
          <h2 className="text-[32px] lg:text-[48px] text-[#0C0C0C] font-aeonik-medium  mb-[4px]">
            Have a question or suggestion?
          </h2>
          <p className="font-aeonik-regular text-[16px] 2xl:text-[24px] text-[#1A1A1A] leading-relaxed">
            We value your feedback — share your thoughts or ideas{" "}
            <br className="hidden sm:inline-block" /> to help us make Pintree
            even better.
          </p>
          <button className="border border-[#1A1A1A] px-[40px] md:px-[94px] py-[12px] rounded-[4px] text-[#1A1A1A] text-[16px] 2xl:text-[24px] font-aeonik-regular mt-[32px]">
            Let’s Connect
          </button>
        </div>
      </div>

      <div className="flex flex-col-reverse md:flex-row ">
        {/* ---- Bottom Left Text ---- */}
        <div className="w-full md:w-1/2  flex flex-col justify-center items-start  p-[20px]  lg:p-[55px]  bg-white">
          <div className="">
            <p className=" text-[20px] sm:text-[28px] font-aeonik-regular text-[#000000]">
              Contributors
            </p>
            <h2 className=" text-[#0C0C0C] font-aeonik-medium text-[32px] lg:text-[48px] leading-[120%] ">
              For Professionals, Businesses..
            </h2>
          </div>
          <p className="text-[#1A1A1A] font-aeonik-regular  text-[16px] 2xl:text-[24px] leading-[140%] md:pe-[85px]">
            Explore better ways to grow, connect, and collaborate —{" "}
            <br className="hidden sm:inline-block" /> our team is here to help
            you make the most of Pintree.
          </p>
          <button className="border border-[#1A1A1A] px-[40px] md:px-[94px] py-[12px] rounded-[4px] text-[#1A1A1A] text-[16px] 2xl:text-[24px] font-aeonik-regular mt-[32px]">
            Let’s Connect
          </button>
        </div>

        {/* ---- Bottom Right Image ---- */}
        <div className="w-full md:w-1/2  h-[360px] md:h-[400px] lg:h-[500px] ">
          <img
            src="/img2.svg" // replace with your image path
            alt="contributors help"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
