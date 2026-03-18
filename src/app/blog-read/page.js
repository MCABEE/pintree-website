"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <>
      <Navbar />
      <div className="bg-white">
        <div className="px-[24px] sm:px-[50px] xl:px-[140px] 2xl:px-[240px] pt-[70px] md:pt-[160px] 2xl:pt-[190px]">
          <a
            href="/blog"
            className="flex items-center gap-3.5 text-[#0453F1] text-[16px] xl:text-[24px] font-aeonik-medium cursor-pointer"
          >
            <img src="/left.svg" alt="" className="size-[16px] xl:size-auto" />{" "}
            Back to Blog
          </a>

          <h1 className="mt-[45px] 2xl:mt-[55px] text-[32px] xl:text-[54px] 2xl:text-[64px]  font-aeonik-regular leading-[120%] text-[#0C0C0C]">
            How Pintree’s discovery feed helps you find what truly matters
          </h1>

          <img
            src="/blog4.svg"
            className="rounded-[4px]  mt-[58px]"
            alt="Blog Image"
          />

          <div className="mt-[18px] md:mt-[44px] space-y-6 text-[16px] md:text-[20px] 2xl:text-[24px]  font-aeonik-regular leading-[140%] text-[#333333]">
            <p>
              Yes. That’s the whole point of using the essay service. When you
              ask someone to "write my essays for me," it only works if they
              stick to what you asked for. That’s why your instructions matter
              more than anything else in the order. Be clear about what the
              assignment is asking and what you care about most, your writer
              will use that as their framework from the start.
            </p>

            <p>
              Most of our professional paper writers prefer having detailed
              input. You’ll also be able to message your essay helper directly.
              That means if something changes or you forgot to include a detail,
              you can still send it. Yes, of course! When you use an essay
              service, you don’t always know exactly what the final result will
              look like until it’s in front of you. That’s why revisions are
              part of the process, not something extra. If you ask us, "write my
              essay for me," you’re not stuck with a one-and-done draft. Once
              your essay writer delivers the work, you’ll have time to review it
              and see if anything needs tweaking.
            </p>

            <p>
              You’ll have 14 and 30 days (depending on the type of order) to
              send your edit request. Your writer will go back into the draft
              and make changes without hassle. We understand that when you
              decide to "pay someone to write my essay" it should sound like it
              was written for you, not for the next person in line. That's why
              every order is written from the ground up, based on your
              instructions. If you want proof, you can ask for a plagiarism
              report, free. It’s a detailed scan that shows exactly what was
              checked and what the result was.
            </p>

            <p>
              Every writer on our essay writing website work manually, sentence
              by sentence and focus on building something that fits your topic,
              your tone, and your "write essay for me" instructions. You’ve got
              options, and that’s a good thing. When you ask someone, "write me
              an essay", you’re trusting them with something important. You
              should be able to choose who you work with. On our platform, essay
              writers have their profiles. You can see what subjects they cover,
              what students say about them, and how they’re rated. Take your
              time scrolling through. You can message any writer before you hire
              them to write an essay for you. Whether you want someone
              experienced in a specific subject or just someone who writes in a
              tone that matches your own, you’ll find it.
            </p>
          </div>

          <div className="mt-[12px] md:mt-[71px] flex flex-col xl:flex-row justify-between    ">
            <div className="text-[16px] md:text-[20px] 2xl:text-[24px] font-aeonik-regular text-[#000000] space-y-2">
              <p className="flex flex-col sm:flex-row gap-2">
                Published on{" "}
                <span className="text-[#0453F1]  cursor-pointer">
                  27 November 2025, Thu
                </span>
              </p>

              <p className="flex flex-col sm:flex-row gap-2">
                From{" "}
                <span className="text-[#0453F1]  cursor-pointer">
                  Pintree Editorial team
                </span>
              </p>
            </div>

            <div className="flex  gap-[24px] flex-col sm:flex-row ">
              <div className="flex items-center">
                <p className="text-[16px] md:text-[20px] 2xl:text-[24px]  text-[#000000] font-aeonik-regular pt-[41px] md:pt-0  ">
                  Share this Article
                </p>
              </div>

              <div className="flex gap-2 md:gap-6 items-center">
                <div className="relative group flex  items-center justify-center w-fit">
                  <button
                    className="relative size-[54px] 2xl:size-[64px]"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        "https://www.youtube.com/results?search_query=ben10+movie"
                      );
                    }}
                  >
                    {/* Default Icon */}
                    <img
                      src="/copylink.svg"
                      className="absolute inset-0 size-[40px] md:size-auto group-hover:opacity-0 transition-opacity duration-200"
                    />

                    {/* Hover Icon */}
                    <img
                      src="/copylink-black.svg"
                      className="absolute inset-0 size-[40px] md:size-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    />
                  </button>

                  {/* Tooltip */}
                  <div
                    className="
      absolute 
      bottom-[75px] left-1/2 -translate-x-1/2
      bg-black text-white text-[12px]
      px-2 py-1 rounded-md
      opacity-0 group-hover:opacity-100
      pointer-events-none
      transition-all duration-200
      font-aeonik-regular
      whitespace-nowrap
    "
                  >
                    Copy Link
                  </div>
                </div>

                <div className="relative group flex items-center justify-center w-fit">
                  <button className="relative size-[54px] 2xl:size-[64px]">
                    {/* Default Icon */}
                    <img
                      src="/email.svg"
                      className="absolute inset-0 size-[40px] md:size-auto group-hover:opacity-0 transition-opacity duration-200"
                    />

                    {/* Hover Icon */}
                    <img
                      src="/email-black.svg"
                      className="absolute inset-0 size-[40px] md:size-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    />
                  </button>

                  {/* Tooltip */}
                  <div
                    className="
      absolute 
      bottom-[75px] left-1/2 -translate-x-1/2
      bg-black text-white text-[12px]
      px-2 py-1 rounded-md
      opacity-0 group-hover:opacity-100
      pointer-events-none
      transition-all duration-200
      font-aeonik-regular
      whitespace-nowrap
    "
                  >
                    Email
                  </div>
                </div>

                <div className="relative group flex items-center justify-center w-fit">
                  <button className="relative size-[54px] 2xl:size-[64px]">
                    {/* Default Icon */}
                    <img
                      src="/whatsapp.svg"
                      className="absolute inset-0 size-[40px] md:size-auto group-hover:opacity-0 transition-opacity duration-200"
                    />

                    {/* Hover Icon */}
                    <img
                      src="/whatsapp-black.svg"
                      className="absolute inset-0 size-[40px] md:size-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    />
                  </button>

                  {/* Tooltip */}
                  <div
                    className="
      absolute 
      bottom-[75px] left-1/2 -translate-x-1/2
      bg-black text-white text-[12px]
      px-2 py-1 rounded-md
      opacity-0 group-hover:opacity-100
      pointer-events-none
      transition-all duration-200
      font-aeonik-regular
      whitespace-nowrap
    "
                  >
                    WhatsApp
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
