"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useState } from "react";

export default function Page() {
  const [openIndex, setOpenIndex] = useState(0);

  const items = [
    {
      question: "How do I create a Pintree account?",
      answer:
        "Creating an account is quick and simple. Download the Pintree app, enter your mobile number or email, verify it using the OTP, and complete your basic profile details. Once done, you can immediately start exploring content, joining communities, and connecting with people who share your interests.",
    },
    {
      question: "How does the Pintree feed work?",
      answer: "",
    },
    {
      question: "How can I join or create a community?",
      answer: "",
    },
  ];

  return (
    <>
      <Navbar />

      <div className="bg-white py-10 md:py-16  px-2 sm:px-10 lg:px-[80px] xl:px-[140px]">
        <div
          className="
            bg-white
            shadow-xl
            border border-[#FFFFFF]
            sm:mx-auto
           max-w-[1440px]
            px-6 sm:px-8 md:px-12 lg:px-[72px] 
            py-12 sm:py-16 md:py-24 lg:py-[100px]
            min-h-[60vh]
            flex flex-col
            mx-4 
          "
        >
          {/* ---------------- Section Header ---------------- */}
          <h1
            className="
              text-[26px] sm:text-[28px]
              font-aeonik-bold
              text-[#0C0C0C]
            "
          >
            Getting Started
          </h1>

          <p
            className="
              text-[#333333]
              font-aeonik-regular
              mt-2 sm:mt-3
              text-[16px] sm:text-[18px]
            "
          >
            Learn how to sign up, log in, and set up your Pintree account.
          </p>

          {/* ---------------- Accordion ---------------- */}
          <div className="mt-10 sm:mt-12">
            {items.map((item, index) => {
              const isOpen = index === openIndex;

              return (
                <div
                  key={index}
                  className="border-b border-[#AAAAAA] py-4 sm:py-6 cursor-pointer"
                >
                  {/* Question Row */}
                  <div
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex justify-between items-center"
                  >
                    <p
                      className="
                        text-[18px] sm:text-[20px] 
                        font-aeonik-medium
                        text-[#1A1A1A]
                      "
                    >
                      {item.question}
                    </p>

                    <span className="text-[16px] md:text-[18px] text-[#000000] select-none">
                      {isOpen ? "—" : "+"}
                    </span>
                  </div>

                  {/* Answer */}
                  {isOpen && item.answer && (
                    <p
                      className="
                        mt-2 sm:mt-3
                        text-[16px] sm:text-[18px]
                        text-[#1A1A1A]
                        font-aeonik-regular
                        leading-[22px] sm:leading-[24px] md:leading-[26px]
                        pr-4 sm:pr-6 md:pr-10
                      "
                    >
                      {item.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
