"use client";
import React from "react";

export default function () {
  return (
    <section
      className="w-full bg-[#FFFFFF] flex flex-col lg:flex-row 
                      py-[80px] sm:py-[100px]  "
    >
      <div className="w-full lg:w-1/2 flex items-center justify-center  ">
        <img
          src="/mobile.svg"
          alt="Pintree Preview"
          className=" h-[208px] sm:h-[400px] md:h-[500px] 2xl:h-[608px] w-[99px] sm:w-[230px] md:w-[250px]  2xl:w-[288px]  "
        />
      </div>

      <div className="w-full lg:w-1/2 flex flex-col  justify-center">
        <p className="text-center lg:text-left text-[16px] sm:text-[20px] xl:text-[26px] text-[#000000] font-aeonik-regular pt-[48px] lg:pt-0  ">
          For Influencers
        </p>

        <h2
          className="font-aeonik-medium text-center lg:text-left  text-[28px] sm:text-[32px] lg:text-[48px] 
                       leading-[120%] text-[#0C0C0C] mt-[16px] sm:mt-[4px]"
        >
          Showcase talent,
          <br /> explore opportunities.
        </h2>

        <p className=" text-center lg:text-left text-[16px] sm:text-[18px] xl:text-[20px] font-aeonik-regular text-[#1A1A1A] leading-[140%] mt-[17px] sm:mt-[8px] px-[44px] md:px-0">
          Transform your ideas into influence with powerful insights,{" "}
          <br className="hidden sm:inline-block" />
          reach, and authentic engagement.
        </p>

        <div className="flex justify-center lg:justify-start items-center pt-[23px] sm:pt-[54px] ">
          <button className="w-[240px] sm:w-[280px] md:w-[320px] h-[40px] sm:h-[55px] md:h-[60px] border border-[#1A1A1A] rounded-[4px] text-[16px] sm:text-[18px] md:text-[20px] text-[#1A1A1A] font-aeonik-regular  ">
            Create Professional Account
          </button>
        </div>
      </div>
    </section>
  );
}
