// import React from "react";

// const Section2 = () => {
//   return (
//     <div className="w-full h-[920px] overflow-hidden">
//       <video
//         src="/33103-395456671.mp4"
//         className="w-full h-[820px] object-cover"
//         autoPlay
//         muted
//         loop
//         playsInline
//       >
//      <h1 className="text-[#FFFFFF] text-[32px] font-aeonik-medium">
//          Everyone
//         Connect, explore, and enjoy a space made for you.
//      </h1>
//       </video>
//     </div>
//   );
// };

// export default Section2;

// import React from "react";

// const Section2 = () => {
//   return (
//    <div>
//      <div className="relative w-full h-[920px] overflow-hidden">
//       {/* Background Video */}
//       <video
//         src="/33103-395456671.mp4"
//         className="absolute top-0 left-0 w-full h-full object-cover"
//         autoPlay
//         muted
//         loop
//         playsInline
//       ></video>

//       {/* Centered Text */}
//       <div className="absolute inset-0 flex items-center justify-center bg-black/30">
//         <h1 className="text-[#FFFFFF] text-[32px] font-aeonik-medium text-center leading-[1.3] px-4">
//           Everyone <br />
//           Connect, explore, and enjoy a space made for you.
//         </h1>
//       </div>
//     </div>
//      <div className="relative w-full h-[920px] overflow-hidden">
//       {/* Background Video */}
//       <video
//         src="/video.mp4"
//         className="absolute top-0 left-0 w-full h-full object-cover"
//         autoPlay
//         muted
//         loop
//         playsInline
//       ></video>

//       {/* Centered Text */}
//       <div className="absolute inset-0 flex items-center justify-center bg-black/30">
//         <h1 className="text-[#FFFFFF] text-[32px] font-aeonik-medium text-center leading-[1.3] px-4">
//           Express, engage, and grow your audience with ease.
//         </h1>
//       </div>
//     </div>
//    </div>
//   );
// };

// export default Section2;


// "use client";
// import React, { useEffect, useState, useRef } from "react";

// const Section2 = () => {
//   const sectionRef = useRef(null);
//   const [fade, setFade] = useState(0); // 0 = first video, 1 = second video

//   useEffect(() => {
//     const handleScroll = () => {
//       if (!sectionRef.current) return;

//       const rect = sectionRef.current.getBoundingClientRect();
//       const windowHeight = window.innerHeight;

//       // progress from 0 → 1 across the full scroll of 200vh
//       const progress = Math.min(Math.max(-rect.top / windowHeight, 0), 1);

//       // smooth fade: start at 0.2, end at 0.7
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
//     <section
//       ref={sectionRef}
//       className="relative w-full h-[200vh] snap-start"
//     >
//       {/* Sticky container (both videos share same viewport) */}
//       <div className="sticky top-0 w-full h-screen overflow-hidden">

//         {/* FIRST VIDEO */}
//         <video
//           src="/33103-395456671.mp4"
//           autoPlay
//           muted
//           loop
//           playsInline
//           className="absolute top-0 left-0 w-full h-full object-cover"
//           style={{
//             opacity: 1 - fade,
//             transition: "opacity 0.6s ease-out",
//           }}
//         />

//         {/* SECOND VIDEO */}
//         <video
//           src="/video.mp4"
//           autoPlay
//           muted
//           loop
//           playsInline
//           className="absolute top-0 left-0 w-full h-full object-cover"
//           style={{
//             opacity: fade,
//             transition: "opacity 0.6s ease-out",
//           }}
//         />

//         {/* TEXT OVERLAY */}
//         <div className="absolute inset-0 bg-black/30 flex items-center justify-center">

//           {/* Text 1 */}
//           <h1
//             className="absolute text-white text-[32px] text-center font-aeonik-medium px-4 leading-[1.3]"
//             style={{
//               opacity: 1 - fade,
//               transition: "opacity 0.6s ease-out",
//             }}
//           >
//             Everyone <br />
//             Connect, explore, and enjoy a space made for you.
//           </h1>

//           {/* Text 2 */}
//           <h1
//             className="absolute text-white text-[32px] text-center font-aeonik-medium px-4 leading-[1.3]"
//             style={{
//               opacity: fade,
//               transition: "opacity 0.6s ease-out",
//             }}
//           >
//             Express, engage, and grow your audience with ease.
//           </h1>

//         </div>
//       </div>
//     </section>
//   );
// };

// export default Section2;






// "use client";
// import React, { useEffect, useRef, useState } from "react";

// const Section2 = () => {
//   const sectionRef = useRef(null);
//   const [fadeIn, setFadeIn] = useState(0); // fade effect for second section

//   useEffect(() => {
//     const handleScroll = () => {
//       if (!sectionRef.current) return;

//       const rect = sectionRef.current.getBoundingClientRect();
//       const windowHeight = window.innerHeight;

//       // When top of Section2 enters viewport, fade starts
//       const visible = Math.min(Math.max((windowHeight - rect.top) / windowHeight, 0), 1);
//       setFadeIn(visible);
//     };

//     window.addEventListener("scroll", handleScroll, { passive: true });
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <section ref={sectionRef} className="w-full">
      
//       {/* SECTION 1 (Video 1) */}
//       <div className="relative w-full h-screen overflow-hidden">
//         <video
//           src="/33103-395456671.mp4"
//           className="absolute inset-0 w-full h-full object-cover"
//           autoPlay
//           muted
//           loop
//           playsInline
//         ></video>

//         <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
//           <h1 className="text-white text-[32px] text-center font-aeonik-medium px-4 leading-[1.3]">
//             Everyone <br />
//             Connect, explore, and enjoy a space made for you.
//           </h1>
//         </div>
//       </div>

//       {/* SECTION 2 (Video 2 — fade in) */}
//       <div
//         className="relative w-full h-screen overflow-hidden"
//         style={{
//           opacity: fadeIn,
//           transition: "opacity 0.5s ease-out",
//         }}
//       >
//         <video
//           src="/video.mp4"
//           className="absolute inset-0 w-full h-full object-cover"
//           autoPlay
//           muted
//           loop
//           playsInline
//         ></video>

//         <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
//           <h1 className="text-white text-[32px] text-center font-aeonik-medium px-4 leading-[1.3]">
//             Express, engage, and grow your audience with ease.
//           </h1>
//         </div>
//       </div>

//     </section>
//   );
// };

// export default Section2;







// "use client";
// import React, { useEffect, useState, useRef } from "react";

// const Section2 = () => {
//   const sectionRef = useRef(null);
//   const [fade, setFade] = useState(0); // 0 = first video, 1 = second video

//   useEffect(() => {
//     const handleScroll = () => {
//       if (!sectionRef.current) return;

//       const rect = sectionRef.current.getBoundingClientRect();
//       const windowHeight = window.innerHeight;

//       // progress from 0 → 1 across the full scroll of 200vh
//       const progress = Math.min(Math.max(-rect.top / windowHeight, 0), 1);

//       // smooth fade: start at 0.2, end at 0.7
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
//     <section
//       ref={sectionRef}
//       className="relative w-full h-[200vh] snap-start"
//     >
//       {/* Sticky container (both videos share same viewport) */}
//       <div className="sticky top-0 w-full h-screen overflow-hidden">

//         {/* FIRST VIDEO */}
//         <video
//           src="/33103-395456671.mp4"
//           autoPlay
//           muted
//           loop
//           playsInline
//           className="absolute top-0 left-0 w-full h-full object-cover"
//           style={{
//             opacity: 1 - fade,
//             transition: "opacity 0.6s ease-out",
//           }}
//         />

//         {/* SECOND VIDEO */}
//         <video
//           src="/video.mp4"
//           autoPlay
//           muted
//           loop
//           playsInline
//           className="absolute top-0 left-0 w-full h-full object-cover"
//           style={{
//             opacity: fade,
//             transition: "opacity 0.6s ease-out",
//           }}
//         />

//         {/* TEXT OVERLAY */}
//         <div className="absolute inset-0 bg-black/30 flex items-center justify-center">

//           {/* Text 1 */}
//           <h1
//             className="absolute text-white text-[32px] text-center font-aeonik-medium px-4 leading-[1.3]"
//             style={{
//               opacity: 1 - fade,
//               transition: "opacity 0.6s ease-out",
//             }}
//           >
//             Everyone <br />
//             Connect, explore, and enjoy a space made for you.
//           </h1>

//           {/* Text 2 */}
//           <h1
//             className="absolute text-white text-[32px] text-center font-aeonik-medium px-4 leading-[1.3]"
//             style={{
//               opacity: fade,
//               transition: "opacity 0.6s ease-out",
//             }}
//           >
//             Express, engage, and grow your audience with ease.
//           </h1>

//         </div>
//       </div>
//     </section>
//   );
// };

// export default Section2;





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
//     <section
//       ref={sectionRef}
//       className="relative w-full h-[200vh]"
//     >
//       {/* Sticky: holds both videos */}
//       <div className="sticky top-0 w-full h-screen overflow-hidden">

//         {/* VIDEO 1 */}
//         <video
//           src="/33103-395456671.mp4"
//           autoPlay
//           muted
//           loop
//           playsInline
//           className="absolute inset-0 w-full h-full object-cover"
//           style={{
//             opacity: 1 - fade,
//             transition: "opacity 0.6s ease-out",
//           }}
//         />

//         {/* VIDEO 2 */}
//         <video
//           src="/video.mp4"
//           autoPlay
//           muted
//           loop
//           playsInline
//           className="absolute inset-0 w-full h-full object-cover"
//           style={{
//             opacity: fade,
//             transition: "opacity 0.6s ease-out",
//           }}
//         />

//         {/* TEXT CONTAINER */}
//         <div className="absolute inset-0 bg-black/30 flex items-center justify-center">

//           {/* TEXT 1 — SHOW ONLY when fade < 0.5 */}
//           {fade < 0.5 && (
//             <h1 className="absolute text-white text-[32px] text-center font-aeonik-medium px-4 leading-[1.3]">
//               Everyone <br />
//               Connect, explore, and enjoy a space made for you.
//             </h1>
//           )}

//           {/* TEXT 2 — SHOW ONLY when fade > 0.5 */}
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






"use client";
import React, { useEffect, useState, useRef } from "react";

const Section2 = () => {
  const sectionRef = useRef(null);
  const [fade, setFade] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // progress 0 → 1
      const progress = Math.min(Math.max(-rect.top / windowHeight, 0), 1);

      const fadeStart = 0.2;
      const fadeEnd = 0.7;

      let value;
      if (progress <= fadeStart) value = 0;
      else if (progress >= fadeEnd) value = 1;
      else value = (progress - fadeStart) / (fadeEnd - fadeStart);

      setFade(value);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[200vh]"
    >
      {/* Sticky: holds video + text */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">

        {/* VIDEO 1 — Visible only when fade < 0.5 */}
        {fade < 0.5 && (
          <video
            src="/33103-395456671.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: 1 - fade * 2,  // fade slightly before switch
              transition: "opacity 0.4s ease-out",
            }}
          />
        )}

        {/* VIDEO 2 — Visible only when fade >= 0.5 */}
        {fade >= 0.5 && (
          <video
            src="/video.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: (fade - 0.5) * 2, // fade in after midpoint
              transition: "opacity 0.4s ease-out",
            }}
          />
        )}

        {/* TEXT CONTAINER */}
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">

          {/* TEXT 1 */}
          {fade < 0.5 && (
            <h1 className="absolute text-white text-[32px] text-center font-aeonik-medium px-4 leading-[1.3]">
              Everyone <br />
              Connect, explore, and enjoy a space made for you.
            </h1>
          )}

          {/* TEXT 2 */}
          {fade >= 0.5 && (
            <h1 className="absolute text-white text-[32px] text-center font-aeonik-medium px-4 leading-[1.3]">
              Express, engage, and grow your audience with ease.
            </h1>
          )}
        </div>
      </div>
    </section>
  );
};

export default Section2;
