import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";

function page() {
  return (
    <>
      <Navbar />
      <div className=" px-[24px] 2xl:px-[140px] 3xl:px-[240px]  max-h-max ">
        <h1 className=" text-[28px] sm:text-[32px] lg:text-[48px] 2xl:text-[56px]  font-aeonik-medium text-[#1A1A1A] pb-[25px] text-left xl:text-center pt-[100px] ">
          Newsroom
        </h1>
        <p className="text-[16px] sm:text-[20px] font-aeonik-regular text-left xl:text-center text-[#1A1A1A] ">
          Official updates, announcements, and milestones from the Pintree team,
          <br className="hidden md:inline-block"/>
          shared directly with our community and media.
        </p>
        <h1 className="text-[20px] sm:text-[24px]  text-[#0C0C0C] pt-[135px] sm:pt-[187px] pb-2">
          Latest
        </h1>
        <div className="flex flex-col 2xl:flex-row 2xl:gap-10">
          <p className="text-[20px] text-[#000000] pb-3.5 2xl:hidden inline-block ">
            15 December 2025, Mon
          </p>
          <p className="text-[24px] sm:text-[36px] text-[#0C0C0C] leading-[120%] pb-0.5 2xl:hidden inline-block ">
            Pintree Introduces New Community Features to Strengthen Meaningful
            Connections.
          </p>
          <img src="/news1.svg" alt="" className="2xl:w-[600px] h-[338px]" />
          <div>
            <p className="text-[16px] text-[#000000] pb-3.5 hidden 2xl:inline-block ">
              15 December 2025, Mon
            </p>
            <p className="text-[24px]  text-[#0C0C0C] leading-[120%] pb-2 hidden 2xl:inline-block ">
              Pintree Introduces New Community Features to Strengthen Meaningful
              Connections.
            </p>
            <p className="text-[16px] text-[#0C0C0C] leading-[140%]">
              Pintree has rolled out new community-focused features designed to
              help users connect around shared interests more effectively. The
              update enhances discovery, interaction, and moderation tools,
              making it easier for users, creators, and organizations to build
              purposeful spaces and engage..
            </p>
            <p className="text-[#0453F1] pt-2 text-[14px]">Read More</p>
          </div>
        </div>
        <div>
          <p className="pt-10 text-[#0C0C0C] text-[20px] sm:text-[24px] pb-[22px]">
            More from Pintree
          </p>
          <div className="flex flex-col xl:flex-row   gap-6 pb-28 ">
            <div className="flex flex-col xl:w-[464px] ">
              <img src="/news2.svg" alt="" />
              <p className="text-[16px]  text-[#000000] pb-3.5 pt-[20px]">
                09 December 2025, Tue
              </p>
              <p className="text-[24px] text-[#0C0C0C] leading-[120%] pb-3">
                Pintree Expands Community Tools Across the Platform
              </p>
              <p className="text-[16px]  text-[#0C0C0C] leading-[140%]">
                New tools help users create, manage, and engage in
                purpose-driven communities more easily.
              </p>
              <p className="text-[#0453F1] pt-4 text-[14px]">Read More</p>
            </div>
            <div className="flex flex-col xl:w-[464px]">
              <img src="/news2.svg" alt="" />
              <p className="text-[16px]  text-[#000000] pb-3.5 pt-[20px]">
                09 December 2025, Tue
              </p>
              <p className="text-[24px]  text-[#0C0C0C] leading-[120%] pb-3">
                Pintree Expands Community Tools Across the Platform
              </p>
              <p className="text-[16px]  text-[#0C0C0C] leading-[140%]">
                New tools help users create, manage, and engage in
                purpose-driven communities more easily.
              </p>
              <p className="text-[#0453F1] pt-4 text-[14px]">Read More</p>
            </div>
            <div className="flex flex-col xl:w-[464px]">
              <img src="/news2.svg" alt="" />
              <p className="text-[16px]  text-[#000000] pb-3.5 pt-[20px]">
                09 December 2025, Tue
              </p>
              <p className="text-[24px] text-[#0C0C0C] leading-[120%] pb-3">
                Pintree Expands Community Tools Across the Platform
              </p>
              <p className="text-[16px]  text-[#0C0C0C] leading-[140%]">
                New tools help users create, manage, and engage in
                purpose-driven communities more easily.
              </p>
              <p className="text-[#0453F1] pt-4 text-[14px]">Read More</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default page;
