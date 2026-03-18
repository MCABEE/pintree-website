"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Pagination from "@/components/Pagination";
import { useState } from "react";

export default function Page() {
  const [page, setPage] = useState(1);
  return (
    <>
      <Navbar />
      <div className="bg-white w-full min-h-screen pt-[100px] xl:pt-[140px] 2xl:pt-[190px] px-[32px] md:px-[100px] xl:px-[180px] 2xl:px-[240px]">
        <div className="text-left sm:text-center  ">
          <h1 className="text-[48px] md:text-[56px] xl:text-[86px] 2xl:text-[96px] text-[#1A1A1A] font-aeonik-medium ">
            Pintree Blog
          </h1>
          <p className=" text-[16px] md:text-[18px] xl:text-[20px] 2xl:text-[24px] text-[#1A1A1A] font-aeonik-regular leading-[140%] ">
            Insights, updates, and stories that show how Pintree evolves,
            improves, <br /> and empowers its community.
          </p>
        </div>

        <div className="mt-[138px] xl:mt-[169px] 2xl:mt-[189px]">
          <p className="text-[#000000] text-[16px] md:text-[20px] 2xl:text-[24px]  font-aeonik-regular">
            27 November 2025, Thu
          </p>

          <h2 className="mt-[5px] md:mt-[39px] text-[32px] xl:text-[56px] 2xl:text-[66px]  font-aeonik-regular leading-[120%] text-[#0C0C0C] ">
            How Pintree’s discovery feed helps you find what truly matters
          </h2>

          <img
            src="/blog1.svg"
            alt="blog image"
            className="w-full rounded-[4px] mt-[57px] "
          />

          <p className="text-[#333333] font-aeonik-regular text-[16px] md:text-[18px] xl:text-[20px] 2xl:text-[24px] leading-[140%]  mt-[45px]">
            On Pintree, your feed evolves with your interests, not random
            trends. <br /> Our discovery system highlights creators,
            communities, and ideas that genuinely match what you explore and
            engage with. Whether <br />
            you’re here for inspiration, entertainment, or meaningful
            conversations, your feed becomes more personal every day.
          </p>

          <button className="mt-[21px] md:mt-[39px] w-[120px] md:w-[139px] xl:w-[169px] 2xl:w-[192px] h-[40px] xl:h-[54px] 2xl:h-[64px] border border-[#1A1A1A] rounded-[32px] text-[16px] md:text-[18px] xl:text-[20px] 2xl:text-[24px] font-aeonik-regular text-[#333333] ">
            Read More
          </button>
        </div>

        <div className="  mt-[41px] md:mt-[60px] xl:mt-[80px] 2xl:mt-[100px] ">
          <h3 className="text-[24px] xl:text-[30px] 2xl:text-[40px] font-aeonik-regular text-[#0C0C0C] ">
            More From Pintree
          </h3>

          <div className="flex flex-col xl:flex-row gap-[40px] pt-[33px] xl:pt-[43px]">
            {/* IMAGE SECTION */}
            <div className="w-full xl:w-[40%] h-[250px] md:h-auto">
              <img
                src="/blog2.svg"
                alt="blog preview"
                className="w-full h-full object-cover rounded-[4px]"
              />
            </div>

            {/* TEXT SECTION */}
            <div className="flex flex-col w-full xl:w-[60%]">
              <p className="text-[#000000] text-[14px] md:text-[18px] 2xl:text-[20px] ">
                27 November 2025, Thu
              </p>

              <h4 className="text-[20px] xl:text-[30px] 2xl:text-[40px] font-aeonik-regular mt-[9px] md:mt-[14px] leading-[120%] text-[#0C0C0C] ">
                How Pintree’s discovery feed helps you find what truly matters
              </h4>

              <p className="text-[#333333] font-aeonik-regular text-[14px] md:text-[16px] 2xl:text-[20px] leading-[140%] pt-[6px] mt:pt-1 ">
                On Pintree, your feed evolves with your interests, not random
                trends.
                <br />
                Our discovery system highlights creators, communities, and ideas
                that genuinely match what you explore and engage with.
              </p>

              <button className="mt-[28px] w-[120px] 2x:w-[114px] h-[40px] 2xl:h-[48px] border border-[#1A1A1A] rounded-[24px] text-[#333333] text-[14px] 2xl:text-[16px] ">
                Read More
              </button>
            </div>
          </div>

          {/* -------------- SECOND BLOG CARD -------------- */}
          <div className="flex flex-col xl:flex-row gap-[40px] pt-[43px]">
            <div className="w-full xl:w-[40%] h-[250px] md:h-auto">
              <img
                src="/blog3.svg"
                alt="blog preview"
                className="w-full h-full object-cover rounded-[4px]"
              />
            </div>

            <div className="flex flex-col w-full xl:w-[60%]">
              <p className="text-[#000000] text-[14px] md:text-[18px] 2xl:text-[20px] ">
                21 November 2025, Fri
              </p>

              <h4 className="text-[24px] md:text-[30px] 2xl:text-[40px] font-aeonik-regular mt-[14px] leading-[120%] text-[#0C0C0C] ">
                Why Intent-Based Communities Are the Heart of Pintree?
              </h4>

              <p className="text-[#333333] font-aeonik-regular text-[14px]  md:text-[16px] 2xl:text-[20px] leading-[140%] pt-1 ">
                Pintree communities bring together people who share the same
                passions, hobbies, and goals. From local groups to global
                interest circles, each community offers a richer way to exchange
                ideas.
              </p>

              <button className="mt-[28px] w-[120px] 2x:w-[144px] h-[40px] 2xl:h-[48px] border border-[#1A1A1A] rounded-[18px] 2xl:rounded-[24px] text-[#333333] text-[14px] 2xl:text-[16px] ">
                Read More
              </button>
            </div>
          </div>

          {/* ---------- PAGINATION SECTION ---------- */}
          <div className="flex justify-center pb-[180px]">
            <Pagination current={page} total={3} onChange={setPage} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
