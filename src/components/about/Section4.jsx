"use client";
import React from "react";

export default function () {
  return (
    <section
      className="w-full bg-[#E8FBF9] flex flex-col lg:flex-row 
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
        <p className="text-center lg:text-left text-[16px] sm:text-[20px] text-[#000000] font-aeonik-regular pt-[48px] lg:pt-0  ">
          Communities
        </p>

        <h2
          className="font-aeonik-medium text-center lg:text-left  text-[28px] sm:text-[32px] lg:text-[48px] 
                       leading-[120%] text-[#0C0C0C] mt-[16px] sm:mt-[4px]"
        >
          Where ideas meet <br /> like-minded people.
        </h2>

        <p className=" text-center lg:text-left text-[16px] sm:text-[18px] xl:text-[20px] font-aeonik-regular text-[#1A1A1A] leading-[140%] mt-[17px] sm:mt-[8px] px-[44px] md:px-0">
          Just communities built around your passions, 
          <br className="hidden sm:inline-block" /> curiosity, and conversations.
        </p>

        <p className=" text-center lg:text-left text-[16px] sm:text-[18px] xl:text-[20px] font-aeonik-medium text-[#1A1A1A] mt-[19px] sm:mt-[25px] xl:mt-[31px]">
          Get the Pintree App
        </p>

        <div className="flex gap-[8px] mt-[16px] sm:mt-[18px] justify-center lg:justify-start">
          <img
            src="/appStore.svg"
            alt="App Store"
            className="w-[128px] sm:w-[100px] 2xl:w-[140px] h-auto"
          />
          <img
            src="/playStore.svg"
            alt="Google Play"
            className="w-[128px] sm:w-[100px] 2xl:w-[140px] h-auto"
          />
        </div>
      </div>
    </section>
  );
}
