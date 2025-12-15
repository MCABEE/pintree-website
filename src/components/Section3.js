// "use client";
// import Link from "next/link";
// import React from "react";

// export default function Section3() {
//   const items = [
//     {
//       title: "Your Privacy Matters",
//       text: "Report privacy concerns or data issues — our team ensures your safety and trust.",
//       bg: "bg-[#C6F4F0]",
//       href: "/contact-privacy",
//     },
//     {
//       title: "Found a Problem?",
//       text: "Tell us what’s wrong — we’ll fix it quickly and keep your experience smooth.",
//       bg: "bg-[#DCF4C6]",
//     },
//     {
//       title: "Quick Answers, Anytime",
//       text: "Explore common questions and get instant help for your Pintree experience.",
//       bg: "bg-[#D5C6F4]",
//     },
//     {
//       title: "Press & Media Resources",
//       text: "Access brand assets, logos, and official media information for your stories.",
//       bg: "bg-[#FED2E4]",
//     },
//   ];

//   return (
//     <section className="grid grid-cols-1 md:grid-cols-2">
//       {items.map((item, index) => (
//         <div
//           key={index}
//           className={`${item.bg} flex flex-col justify-start items-start px-[20px] md:px-[40px] lg:px-[130px] 2xl:px-[212px] py-16 md:py-24 md:min-h-[420px]`}
//         >
//           <h3 className="text-[20px] lg:text-[28px] md:text-[32px] font-aeonik-medium leading-[1.15] text-[#0C0C0C]  mb-3">
//             {item.title}
//           </h3>

//           <p className="text-[16px] lg:text-[18px] font-aeonik-regular leading-[1.5] text-[#1A1A1A] max-w-lg">
//             {item.text}
//           </p>

//           <Link
//             href="/contact-privacy"
//             className="mt-6 border border-[#1A1A1A] text-[#1A1A1A] w-[180px] h-[48px] rounded-[6px] flex items-center justify-center text-[16px] lg:text-[20px] font-aeonik-regular"
//           >
//             Get in Touch
//           </Link>
//         </div>
//       ))}
//     </section>
//   );
// }


"use client";
import Link from "next/link";
import React from "react";

export default function Section3() {
  const items = [
    {
      title: "Your Privacy Matters",
      text: "Report privacy concerns or data issues — our team ensures your safety and trust.",
      bg: "bg-[#C6F4F0]",
      href: "/contact-privacy",
    },
    {
      title: "Found a Problem?",
      text: "Tell us what’s wrong — we’ll fix it quickly and keep your experience smooth.",
      bg: "bg-[#DCF4C6]",
      href: "/contact-found-a-problem",
    },
    {
      title: "Quick Answers, Anytime",
      text: "Explore common questions and get instant help for your Pintree experience.",
      bg: "bg-[#D5C6F4]",
      href: "/contact-quick-answer",
    },
    {
      title: "Press & Media Resources",
      text: "Access brand assets, logos, and official media information for your stories.",
      bg: "bg-[#FED2E4]",
      href: "/press-media",
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      {items.map((item, index) => (
        <div
          key={index}
          className={`${item.bg} flex flex-col justify-start items-start px-[20px] md:px-[40px] lg:px-[130px] 2xl:px-[212px] py-16 md:py-24 md:min-h-[420px]`}
        >
          <h3 className="text-[20px] lg:text-[28px] md:text-[32px] font-aeonik-medium leading-[1.15] text-[#0C0C0C] mb-3">
            {item.title}
          </h3>

          <p className="text-[16px] lg:text-[18px] font-aeonik-regular leading-[1.5] text-[#1A1A1A] max-w-lg">
            {item.text}
          </p>

          {/* 🔥 Dynamic Link */}
          <Link
            href={item.href}
            className="mt-6 border border-[#1A1A1A] text-[#1A1A1A] w-[180px] h-[48px] rounded-[6px] flex items-center justify-center text-[16px] lg:text-[20px] font-aeonik-regular"
          >
            Get in Touch
          </Link>
        </div>
      ))}
    </section>
  );
}
