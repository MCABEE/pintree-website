import React from "react";

function Section5() {
  return (
    <div>
      <div className="bg-[#EEE8FB] py-[75px] sm:py-[150px] md:py-[200px] lg:py-[293px] ">
        <h1 className="font-aeonik-medium text-[16px] sm:text-[24px] text-[#1A1A1A] text-center ">
          As a Public Figure
        </h1>
        <p className="font-aeonik-medium  text-[28px] sm:text-[32px] lg:text-[48px] 2xl:text-[56px]  text-[#1A1A1A] text-center leading-[120%]">
          Express, engage, and <br className="sm:hidden inline-block" /> grow{" "}
          <br className="hidden sm:inline-block" />
          your audience <br className="sm:hidden inline-block" />
          with ease.{" "}
        </p>
        <p className="font-aeonik-medium text-[16px]  md:text-[20px]  text-[#1A1A1A] text-center leading-[120%] pt-3">
          {" "}
          Showcase your personality, share your story,
          <br /> and build a loyal community.
        </p>
        <div className="flex justify-center items-center pt-[23px] sm:pt-[54px] ">
          <button className="w-[240px] sm:w-[280px] md:w-[300px] lg:w-[360px] h-[40px] sm:h-[55px] md:h-[60px] lg:h-[64px] border border-[#1A1A1A] rounded-[4px] text-[16px] sm:text-[18px] md:text-[20px]  text-[#1A1A1A] font-aeonik-regular  ">
            Create Professional Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Section5;
