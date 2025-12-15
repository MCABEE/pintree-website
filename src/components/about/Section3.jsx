"use client";
import React from "react";

export default function () {
  return (
    <section className="w-full bg-white flex flex-col lg:flex-row  
                      mt-[50px] md:mt-[145px] xl:mt-[150px] 2xl:mt-[160px] 3xl:mt-[168px] pt-[40px] sm:py-[56px]  pb-[100px] sm:pb-0">

      
      <div className="w-full lg:w-1/2 flex items-center justify-center ">
        <img
          src="/discover-mobile.svg" 
          alt="Pintree Preview"
          className=" h-[480px] sm:h-[400px]  md:h-auto w-[256px] sm:w-[300px] xl:w-[350px] 2xl:w-[384px]  "
        />
      </div>

     
      <div className="w-full lg:w-1/2 flex flex-col mt-[59px] sm:mt-[50px]">
        
        <p className="text-center lg:text-left text-[16px] sm:text-[20px] xl:text-[26px]  2xl:text-[32px] text-[#000000] font-aeonik-regular   ">
          Discover
        </p>

        <h2 className="font-aeonik-medium text-center lg:text-left text-[32px] sm:text-[40px] xl:text-[45px] 2xl:text-[64px]
                       leading-[120%] text-[#0C0C0C] mt-[16px] sm:mt-[4px]">
          Explore what inspires <br /> you, endlessly
        </h2>

        <p className=" text-center lg:text-left text-[16px] sm:text-[18px] xl:text-[20px] 2xl:text-[24px] font-aeonik-regular text-[#1A1A1A] leading-[140%] mt-[17px] sm:mt-[8px]">
         Discover trends, talents, and ideas tailored <br /> to what you love.
        </p>

        <p className=" text-center lg:text-left text-[16px] sm:text-[18px] xl:text-[20px] 2xl:text-[24px] font-aeonik-medium text-[#1A1A1A] mt-[19px] sm:mt-[25px] xl:mt-[31px]">
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