// "use client";
// import React, { useEffect, useState, useRef } from "react";

// const Section2 = () => {
//   const sectionRef = useRef(null);
//   const [fade, setFade] = useState(0);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (!sectionRef.current) return;

//       const rect = sectionRef.current.getBoundingClientRect();
//       const windowHeight = window.innerHeight;

//       // progress 0 → 1
//       const progress = Math.min(Math.max(-rect.top / windowHeight, 0), 1);

//       const fadeStart = 0.2;
//       const fadeEnd = 0.7;

//       let value;
//       if (progress <= fadeStart) value = 0;
//       else if (progress >= fadeEnd) value = 1;
//       else value = (progress - fadeStart) / (fadeEnd - fadeStart);

//       setFade(value);
//     };

//     window.addEventListener("scroll", handleScroll, { passive: true });
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <section ref={sectionRef} className="relative w-full h-[200vh]">
//       {/* Sticky: holds video + text */}
//       <div className="sticky top-0 w-full h-screen overflow-hidden">
//         {/* VIDEO 1 — Visible only when fade < 0.5 */}
//         {fade < 0.5 && (
//           <video
//             src="/33103-395456671.mp4"
//             autoPlay
//             muted
//             loop
//             playsInline
//             className="absolute inset-0 w-full h-full object-cover"
//             style={{
//               opacity: 1 - fade * 2, // fade slightly before switch
//               transition: "opacity 0.4s ease-out",
//             }}
//           />
//         )}

//         {/* VIDEO 2 — Visible only when fade >= 0.5 */}
//         {fade >= 0.5 && (
//           <video
//             src="/video.mp4"
//             autoPlay
//             muted
//             loop
//             playsInline
//             className="absolute inset-0 w-full h-full object-cover"
//             style={{
//               opacity: (fade - 0.5) * 2, // fade in after midpoint
//               transition: "opacity 0.4s ease-out",
//             }}
//           />
//         )}

//         {/* TEXT CONTAINER */}
//         <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
//           {/* TEXT 1 */}
//           {fade < 0.5 && (
//             <h1 className="absolute text-white text-[32px] text-center font-aeonik-medium px-4 leading-[1.3]">
//               Everyone <br />
//               Connect, explore, and enjoy a space made for you.
//             </h1>
//           )}

//           {/* TEXT 2 */}
//           {fade >= 0.5 && (
//             <h1 className="absolute text-white text-[32px] text-center font-aeonik-medium px-4 leading-[1.3]">
//               Express, engage, and grow your audience with ease.
//             </h1>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Section2;


import React from "react";

function Section2() {
  return (
    <div>
      <div className="bg-[#1A1A1A] py-[75px] sm:py-[150px] md:py-[200px] lg:py-[293px] ">
        <h1 className="font-aeonik-medium text-[16px] sm:text-[20px] md:text-[28px] lg:text-[30px] xl:text-[32px] text-[#FFFFFF] text-center ">
          For Everyone
        </h1>
        <p className="font-aeonik-medium text-[32px] sm:text-[40px] md:text-[50px] lg:text-[62px] xl:text-[64px] text-[#FFFFFF] text-center leading-[120%]">
          Connect, explore,<br className=" sm:hidden  inline-block" /> and enjoy a <br className="hidden sm:inline-block" /> space <br className=" sm:hidden  inline-block" />  made for you.
        </p>
        <div className="flex justify-center items-center pt-[40px] ">
          <button className="w-[200px] sm:w-[280px] md:w-[300px] lg:w-[336px] h-[40px] sm:h-[55px] md:h-[60px] lg:h-[64px] border border-[#FFFFFF] rounded-[4px] text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] text-[#FFFFFF] font-aeonik-regular  ">
            How Pintree Works?
          </button>
        </div>
      </div>
    </div>
  );
}

export default Section2;