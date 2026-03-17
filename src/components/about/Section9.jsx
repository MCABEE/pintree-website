import React from "react";

function Section9() {
  return (
    <div>
      <div className="bg-[#FFFFFF] py-[75px] sm:py-[150px] md:py-[200px] lg:py-[293px] ">
        <p className="font-aeonik-medium  text-[28px] sm:text-[32px] lg:text-[48px] 2xl:text-[56px]  text-[#1A1A1A] text-center leading-[120%]">
          Your story <br className="inline-block sm:hidden"/>belongs here.
        </p>
        <p className="font-aeonik-regular text-[16px]  md:text-[20px] text-[#1A1A1A] text-center leading-[120%] pt-3">
          {" "}
          Join the space where creativity,<br className="inline-block sm:hidden"/> connection, and growth
          <br className="hidden sm:inline-block" /> come together.
        </p>
        <p className="font-aeonik-regular text-[16px]  md:text-[20px]  text-[#1A1A1A] text-center leading-[120%] pt-3">
          Get th Pintree App
        </p>
              <div className="flex gap-2 justify-center items-center pt-[18px]">
        <img src="/appStore.svg" alt="" />
        <img src="/playStore.svg" alt="" />
      </div>
      </div>

    </div>
  );
}

export default Section9;
