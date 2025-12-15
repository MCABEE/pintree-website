"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function quickanswer() {
  return (
    <>
      <Navbar />
      <div className="bg-white py-[71px] ">
        <div className="px-3 sm:px-[32px] md:px-[72px] md:py-[60px] lg:py-[80px] 2xl:py-[166px] min-h-screen 2xl:w-[1440px] bg-white flex flex-col justify-center  border border-[#FFFFFF] shadow-xl mx-4 sm:mx-auto sm:w-[600px] lg:w-[950px] xl:w-[1050px] 3xl:w-[1440px] pb-8">
          <h1 className="text-[20px]  md:text-[32px] text-center md:text-left font-aeonik-bold text-[#0C0C0C] ">
            Quick Answers, Anytime
          </h1>

          <p className="mt-[6px] text-[14px] md:text-[20px] text-center md:text-left font-aeonik-regular leading-[120%] text-[#1A1A1A]">
            Explore common questions and get instant help for your Pintree
            experience.
          </p>

          <p className="mt-[23px] text-[16px] md:text-[24px] font-aeonik-medium text-[#000000] pb-1.5">
            How can I help you?
          </p>

          <div className="flex items-center bg-[#F2F7FF]   rounded-[4px] overflow-hidden max-w-xl">
            <input
              type="text"
              placeholder="Search Topics"
              className="w-full px-[24px] py-[10px] md:py-[16px] text-[#333333] font-aeonik-regular  text-[20px] outline-none placeholder:text-[#333333] placeholder:text-[16px] md:placeholder:text-[20px] placeholder:font-aeonik-regular "
            />
            <button className="px-5  ">
              <img src="/arrow2.svg" alt="arrow" className="" />
            </button>
          </div>

          <h2 className="text-[16px] md:text-[24px] font-aeonik-medium text-[#1A1A1A] mt-[54px] ">
            Popular Topics
          </h2>

          {/* <div className=" mt-[11px] grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-[16px] md:gap-[36px] ">
            {[
              {
                title: "Getting Started",
                desc: "Learn how to sign up, log in, and set up your Pintree account.",
              },
              {
                title: "Profile & Account Settings",
                desc: "Manage your personal profile, login details, and basic account settings.",
              },
              {
                title: "Privacy & Safety",
                desc: "Control your privacy options, security settings, and account protection.",
              },
              {
                title: "Connections & Circles",
                desc: "Understand following, followers, friends, and circle-based interactions.",
              },
              {
                title: "Feed, Discovery & Search",
                desc: "Learn how your feed works and how to discover new people and content.",
              },
              {
                title: "Posting & Sharing",
                desc: "Create, edit, and manage your posts — photos, videos, and stories.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="md:pt-[80px] bg-[#F2F7FF] rounded-[4px] md:w-[408px] md:h-[360px] cursor-pointer p-6 md:px-[56px]"
              >
                <img src="/logo2.svg" className="" />

                <h3 className=" mt-[24px] text-[#1A1A1A] font-aeonik-medium text-[16px] md:text-[24px] leading-[140%] ">
                  {item.title}
                </h3>

                <p className=" mt-[5px] text-[14px] md:text-[20px] text-[#333333]   font-aeonik-regular leading-[120%] ">
                  {item.desc}
                </p>
              </div>
            ))}
          </div> */}

          <div className="mt-[11px] grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-[16px] md:gap-[36px]">
            {[
              {
                title: "Getting Started",
                desc: "Learn how to sign up, log in, and set up your Pintree account.",
              },
              {
                title: "Profile & Account Settings",
                desc: "Manage your personal profile, login details, and basic account settings.",
              },
              {
                title: "Privacy & Safety",
                desc: "Control your privacy options, security settings, and account protection.",
              },
              {
                title: "Connections & Circles",
                desc: "Understand following, followers, friends, and circle-based interactions.",
              },
              {
                title: "Feed, Discovery & Search",
                desc: "Learn how your feed works and how to discover new people and content.",
              },
              {
                title: "Posting & Sharing",
                desc: "Create, edit, and manage your posts — photos, videos, and stories.",
              },
            ].map((item, index) => (
              <Link
                key={index}
                href="/contact-quick-answer-details"
                className="md:pt-[80px] bg-[#F2F7FF] rounded-[4px] md:w-[408px] md:h-[360px] cursor-pointer p-6 md:px-[56px] block"
              >
                <img src="/logo2.svg" className="" />

                <h3 className="mt-[24px] text-[#1A1A1A] font-aeonik-medium text-[16px] md:text-[24px] leading-[140%]">
                  {item.title}
                </h3>

                <p className="mt-[5px] text-[14px] md:text-[20px] text-[#333333] font-aeonik-regular leading-[120%]">
                  {item.desc}
                </p>
              </Link>
            ))}
          </div>

          <h2 className="text-[16px] md:text-[24px] text-[#1A1A1A]  font-aeonik-medium mt-[30px]">
            Popular Articles
          </h2>

          <div className="mt-[19px] space-y-[25px] text-[14px] md:text-[20px] font-aeonik-regular text-[#0C0C0C]">
            <p>Understanding your feed: Why you see certain posts</p>
            <p>
              Managing your connections: Follow, Request, and Circles explained
            </p>
            <p>A quick guide to posting photos and contents</p>
            <p>Finding and joining intent-based communities</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
