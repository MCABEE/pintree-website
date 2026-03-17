import React from "react";

function Section2() {
  return (
    <div>
      <div className="bg-[#1A1A1A] py-[75px] sm:py-[150px] md:py-[200px] lg:py-[293px] ">
        <h1 className="font-aeonik-medium text-[16px] sm:text-[20px] md:text-[28px]  text-[#FFFFFF] text-center ">
          For Everyone
        </h1>
        <p className="font-aeonik-medium  text-[28px] sm:text-[32px] lg:text-[48px] 2xl:text-[56px]  text-[#FFFFFF] text-center leading-[120%]">
          Connect, explore,
          <br className=" sm:hidden  inline-block" /> and enjoy a{" "}
          <br className="hidden sm:inline-block" /> space{" "}
          <br className=" sm:hidden  inline-block" /> made for you.
        </p>
        <div className="flex justify-center items-center pt-[40px] ">
          <button className="w-[200px] sm:w-[280px]  h-[40px] sm:h-[55px]  border border-[#FFFFFF] rounded-[4px] text-[16px] sm:text-[18px] md:text-[20px] text-[#FFFFFF] font-aeonik-regular  ">
            How Pintree Works?
          </button>
        </div>
      </div>
    </div>
  );
}

export default Section2;
