"use client";
import React, { useEffect, useState } from "react";

function Section1() {
  const [active, setActive] = useState(0);
  const [flash, setFlash] = useState(false);

  const images = ["/img1.svg", "/playStore.svg"];

  // Flash + image switching
  useEffect(() => {
    const interval = setInterval(() => {
      setFlash(true);
      setTimeout(() => {
        setFlash(false);
        setActive((prev) => (prev + 1) % images.length);
      }, 200);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="
      flex flex-col lg:flex-row 
      h-auto 
      px-6 sm:px-10 lg:px-[80px] xl:px-[140px] 2xl:px-[240px] 
      pt-10 lg:pt-0
    "
    >
      {/* LEFT TEXT SECTION */}
      <div className="w-full lg:w-1/2 text-[#1A1A1A] flex flex-col justify-center pb-10 lg:pb-0">
        <h1
          className="
          text-[32px] sm:text-[40px] md:text-[48px] lg:text-[54px] 2xl:text-[64px] 
          font-aeonik-medium leading-[120%]  
           text-center lg:text-left
        "
        >
          Your space <br />
          to shine, explore, <br />
          and connect.
        </h1>

        <h2
          className="
          text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] 2xl:text-[24px] 
          pt-[14px]
          text-center lg:text-left
        "
        >
         Pintree brings creativity, connection, and <br className="inline-block lg:hidden"/> visibility together— <br className="hidden 3xl:inline-block"/>helping everyone share, grow,  and be seen.
        </h2>

        <p
          className="
          text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] 2xl:text-[24px] 
          font-aeonik-medium pt-[30px] text-center lg:text-left
        "
        >
          Get the Pintree App
        </p>

        <div className="flex gap-2 pt-[18px] justify-center lg:justify-start">
          <img
            src="/appStore.svg"
            alt="App Store"
            className="w-[120px] sm:w-[140px]"
          />
          <img
            src="/playStore.svg"
            alt="Play Store"
            className="w-[120px] sm:w-[140px]"
          />
        </div>
      </div>

      {/* RIGHT PHONE SECTION */}
      <div
        className="
        w-full lg:w-1/2 
        flex justify-center items-center 
        relative 
        pt-10 lg:pt-[169px]
      "
      >
        {/* PHONE FRAME */}
        <img
          src="/mobile-frame.svg"
          alt="mobile frame"
          className="
            relative z-10 pointer-events-none
            w-[240px] sm:w-[260px] md:w-[300px] lg:w-[350px] 2xl:w-[420px]
          "
        />

        {/* IMAGE SCREEN AREA (scaled WITH frame) */}
        <div
          className="
            absolute z-0 
            overflow-hidden 
            w-[240px] h-[300px]
            sm:w-[260px] sm:h-[320px]
            md:w-[300px] md:h-[380px]
            lg:w-[350px] lg:h-[450px]
            2xl:w-[420px] 2xl:h-[520px]
          "
        >
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt=""
              className={`
                absolute inset-0 w-full h-full object-cover
                transition-all duration-500 ease-out
                ${active === index ? "opacity-100" : "opacity-0"}
                ${
                  flash && active === index
                    ? "brightness-150 scale-105"
                    : "brightness-100 scale-100"
                }
              `}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Section1;
