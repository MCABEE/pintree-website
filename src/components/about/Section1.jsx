// import React from "react";

// const Section1 = () => {
//   return (
//     <div className="flex px-[240px]">
//       <div className="w-1/2  text-[#1A1A1A]">
//         <h1 className="text-[64px] font-aeonik-bold leading-[120%] pt-[169px]">
//           Inspiring moments. <br />
//           Empowering creators. <br />
//           Uniting people.
//         </h1>
//         <h2 className="text-[24px] pt-[14px]">
//           Pintree brings connections, entertainment, creativity, and visibility
//           together—helping everyone share, grow, and be seen.
//         </h2>
//         <p className="text-[24px] font-aeonik-medium pt-[37px]">
//             Get th Pintree App
//         </p>
//         <div className="flex gap-2 pt-[18px]">
//             <img src="/appStore.svg" alt="" />
//             <img src="/playStore.svg" alt="" />

//         </div>
//       </div>
//       <div className="w-1/2 flex justify-center items-center pt-[59px] pb-[97px] ">
//       <div className="w-[360px] h-[640px] flex justify-center items-center border border-[#B4B4B4] rounded-[32px] bg-[#F2F2F2]">
//         <div className="w-[269px] h-[454px] bg-amber-300 rounded-[24px] overflow-hidden overflow-y-scroll">
// <img src="/feed.png" alt="" />
//         </div>
//       </div>
//       </div>
//     </div>
//   );
// };

// export default Section1;

// "use client";
// import React, { useRef, useState, useEffect } from "react";

// const Section3 = () => {
//   const bannerRef = useRef(null);
//   const feedRef = useRef(null);
//   const [feedScroll, setFeedScroll] = useState(0);

//   // Feed items defined here (inside the same page)
//   const feedItems = [
//     { img: "/feed.png" },

//   ];

//   const handleWheel = (e) => {
//     e.preventDefault(); // prevent default page scroll initially
//     const feedEl = feedRef.current;
//     if (!feedEl) return;

//     const frameHeight = 800; // phone frame height
//     const feedHeight = feedEl.scrollHeight;
//     let delta = e.deltaY; // scroll amount
//     let newScroll = feedScroll + delta;

//     // constrain scroll between 0 and max
//     const maxScroll = feedHeight - frameHeight;
//     if (newScroll < 0) newScroll = 0;
//     if (newScroll > maxScroll) newScroll = maxScroll;
//     setFeedScroll(newScroll);

//     // If at top or bottom, allow normal page scroll
//     if (newScroll >= maxScroll || newScroll <= 0) {
//       window.scrollBy({ top: delta, behavior: "smooth" });
//     }
//   };

//   useEffect(() => {
//     const banner = bannerRef.current;
//     if (!banner) return;
//     banner.addEventListener("wheel", handleWheel, { passive: false });
//     return () => banner.removeEventListener("wheel", handleWheel);
//   }, [feedScroll]);

//   return (
//     <div className="banner-container " ref={bannerRef}>
//       {/* Left Text Section */}
//         <div className="w-1/2 text-[#1A1A1A]">
//         <h1 className="text-[64px] font-aeonik-bold leading-[120%]">
//           Inspiring moments. <br />
//           Empowering creators. <br />
//           Uniting people.
//         </h1>
//         <h2 className="text-[24px] pt-[14px]">
//           Pintree brings connections, entertainment, creativity, and visibility
//           together—helping everyone share, grow, and be seen.
//         </h2>
//         <p className="text-[24px] font-aeonik-medium pt-[37px]">
//           Get the Pintree App
//         </p>
//         <div className="flex gap-2 pt-[18px]">
//           <img src="/appStore.svg" alt="App Store" />
//           <img src="/playStore.svg" alt="Play Store" />
//         </div>
//       </div>

//       {/* Right Phone Frame */}
//     <div className="w-1/2 flex justify-center items-center">
//         <div className="phone-frame">
//         <div
//           className="feed-container"
//           ref={feedRef}
//           style={{
//             transform: `translateY(-${feedScroll}px)`,
//             transition: "transform 0.1s linear",
//           }}
//         >
//           {feedItems.map((item, idx) => (
//             <div key={idx} className="feed-item">
//               <img src={item.img} alt={`feed-${idx}`} />
//             </div>
//           ))}
//         </div>
//       </div>
// {/*
//       <div
//   className="w-[360px] h-[640px] border border-[#B4B4B4] rounded-[32px] bg-[#F2F2F2] flex justify-center items-center"
// >
//   <div className="w-[269px] h-[454px] bg-white rounded-[24px] overflow-hidden relative">
//     <div
//       className="absolute top-0 left-0 w-full"
//       ref={feedRef}
//       style={{
//         transform: `translateY(-${feedScroll}px)`,
//         transition: "transform 0.1s linear",
//       }}
//     >
//       {feedItems.map((item, idx) => (
//         <div key={idx} className="feed-item">
//           <img src={item.img} alt={`feed-${idx}`} className="w-full" />
//         </div>
//       ))}
//     </div>
//   </div>
// </div> */}
//     </div>

//     </div>
//   );
// };

// export default Section3;

// "use client";
// import React, { useRef, useState, useEffect } from "react";

// const Section3 = () => {
//   const bannerRef = useRef(null);
//   const feedRef = useRef(null);
//   const [feedScroll, setFeedScroll] = useState(0);

//   // Feed items defined inside the same page
//   const feedItems = [
//     { img: "/feed.png" },

//   ];

//   const handleWheel = (e) => {
//     e.preventDefault(); // prevent default page scroll
//     const feedEl = feedRef.current;
//     if (!feedEl) return;

//     const frameHeight = 454; // visible phone height
//     const feedHeight = feedEl.scrollHeight;
//     let delta = e.deltaY;
//     let newScroll = feedScroll + delta;

//     const maxScroll = feedHeight - frameHeight;
//     if (newScroll < 0) newScroll = 0;
//     if (newScroll > maxScroll) newScroll = maxScroll;
//     setFeedScroll(newScroll);

//     // Allow page scroll when top or bottom reached
//     if (newScroll === 0 || newScroll === maxScroll) {
//       window.scrollBy({ top: delta, behavior: "smooth" });
//     }
//   };

//   useEffect(() => {
//     const banner = bannerRef.current;
//     if (!banner) return;
//     banner.addEventListener("wheel", handleWheel, { passive: false });
//     return () => banner.removeEventListener("wheel", handleWheel);
//   }, [feedScroll]);

//   return (
//     <div className="flex px-[240px]" ref={bannerRef}>
//       {/* Left Text Section */}
//       <div className="w-1/2 text-[#1A1A1A]">
//         <h1 className="text-[64px] font-aeonik-bold leading-[120%] pt-[169px]">
//           Inspiring moments. <br />
//           Empowering creators. <br />
//           Uniting people.
//         </h1>
//         <h2 className="text-[24px] pt-[14px]">
//           Pintree brings connections, entertainment, creativity, and visibility
//           together—helping everyone share, grow, and be seen.
//         </h2>
//         <p className="text-[24px] font-aeonik-medium pt-[37px]">
//           Get the Pintree App
//         </p>
//         <div className="flex gap-2 pt-[18px]">
//           <img src="/appStore.svg" alt="App Store" />
//           <img src="/playStore.svg" alt="Play Store" />
//         </div>
//       </div>

//       {/* Right Phone Frame Section */}
//       <div className="w-1/2 flex justify-center items-center pt-[59px] pb-[97px]">
//         <div className="w-[360px] h-[640px] border border-[#B4B4B4] rounded-[32px] bg-[#F2F2F2] flex justify-center items-center">
//           <div className="w-[269px] h-[454px] bg-white rounded-[24px] overflow-hidden relative">
//             <div
//               className="absolute top-0 left-0 w-full"
//               ref={feedRef}
//               style={{
//                 transform: `translateY(-${feedScroll}px)`,
//                 transition: "transform 0.1s linear",
//               }}
//             >
//               {feedItems.map((item, idx) => (
//                 <div key={idx} className="feed-item">
//                   <img src={item.img} alt={`feed-${idx}`} className="w-full" />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Section3;

// "use client";
// import React, { useRef, useState, useEffect } from "react";

// const Section3 = () => {
//   const bannerRef = useRef(null);
//   const feedRef = useRef(null);
//   const [feedScroll, setFeedScroll] = useState(0);

//   // Enable smooth normal page scroll globally
//   useEffect(() => {
//     document.documentElement.style.scrollBehavior = "smooth";
//     return () => {
//       document.documentElement.style.scrollBehavior = "auto";
//     };
//   }, []);

//   // Feed items defined inside the same page
//   const feedItems = [
//     { img: "/feed.png" },
//   ];

//   const handleWheel = (e) => {
//     e.preventDefault(); // prevent default page scroll
//     const feedEl = feedRef.current;
//     if (!feedEl) return;

//     const frameHeight = 454; // visible phone height
//     const feedHeight = feedEl.scrollHeight;
//     let delta = e.deltaY;
//     let newScroll = feedScroll + delta;

//     const maxScroll = feedHeight - frameHeight;
//     if (newScroll < 0) newScroll = 0;
//     if (newScroll > maxScroll) newScroll = maxScroll;
//     setFeedScroll(newScroll);

//     // Allow page scroll when top or bottom reached
//     if (newScroll === 0 || newScroll === maxScroll) {
//       window.scrollBy({ top: delta, behavior: "smooth" });
//     }
//   };

//   useEffect(() => {
//     const banner = bannerRef.current;
//     if (!banner) return;
//     banner.addEventListener("wheel", handleWheel, { passive: false });
//     return () => banner.removeEventListener("wheel", handleWheel);
//   }, [feedScroll]);

//   return (
//     <div className="flex px-[240px]" ref={bannerRef}>
//       {/* Left Text Section */}
//       <div className="w-1/2 text-[#1A1A1A]">
//         <h1 className="text-[64px] font-aeonik-bold leading-[120%] pt-[169px]">
//           Inspiring moments. <br />
//           Empowering creators. <br />
//           Uniting people.
//         </h1>
//         <h2 className="text-[24px] pt-[14px]">
//           Pintree brings connections, entertainment, creativity, and visibility
//           together—helping everyone share, grow, and be seen.
//         </h2>
//         <p className="text-[24px] font-aeonik-medium pt-[37px]">
//           Get the Pintree App
//         </p>
//         <div className="flex gap-2 pt-[18px]">
//           <img src="/appStore.svg" alt="App Store" />
//           <img src="/playStore.svg" alt="Play Store" />
//         </div>
//       </div>

//       {/* Right Phone Frame Section */}
//       <div className="w-1/2 flex justify-center items-center pt-[59px] pb-[97px]">
//         <div className="w-[360px] h-[640px] border border-[#B4B4B4] rounded-[32px] bg-[#F2F2F2] flex justify-center items-center">
//           <div className="w-[269px] h-[454px] bg-white rounded-[24px] overflow-hidden relative">
//             <div
//               className="absolute top-0 left-0 w-full"
//               ref={feedRef}
//               style={{
//                 transform: `translateY(-${feedScroll}px)`,
//                 transition: "transform 0.1s linear",
//               }}
//             >
//               {feedItems.map((item, idx) => (
//                 <div key={idx} className="feed-item">
//                   <img src={item.img} alt={`feed-${idx}`} className="w-full" />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Section3;

// "use client";
// import React, { useRef, useState, useEffect } from "react";

// const Section3 = () => {
//   const bannerRef = useRef(null);
//   const feedRef = useRef(null);
//   const [feedScroll, setFeedScroll] = useState(0);

//   // Enable smooth normal page scroll globally
//   useEffect(() => {
//     document.documentElement.style.scrollBehavior = "smooth";
//     return () => {
//       document.documentElement.style.scrollBehavior = "auto";
//     };
//   }, []);

//   // Feed items defined inside the same page
//   const feedItems = [{ img: "/feed.png" }];

//   const handleWheel = (e) => {
//     const feedEl = feedRef.current;
//     if (!feedEl) return;

//     const frameHeight = 454; // visible phone height
//     const feedHeight = feedEl.scrollHeight;
//     let delta = e.deltaY;
//     let newScroll = feedScroll + delta;
//     const maxScroll = feedHeight - frameHeight;

//     // clamp feed scroll
//     if (newScroll < 0) newScroll = 0;
//     if (newScroll > maxScroll) newScroll = maxScroll;
//     setFeedScroll(newScroll);

//     // if at boundaries, let page scroll smoothly
//     if (newScroll === 0 || newScroll === maxScroll) {
//       window.scrollBy({ top: delta, behavior: "smooth" });
//     } else {
//       e.preventDefault(); // prevent page scroll only during internal feed scroll
//     }
//   };

//   useEffect(() => {
//     const banner = bannerRef.current;
//     if (!banner) return;
//     banner.addEventListener("wheel", handleWheel, { passive: false });
//     return () => banner.removeEventListener("wheel", handleWheel);
//   }, [feedScroll]);

//   return (
//     <div className="flex px-[240px]" ref={bannerRef}>
//       {/* Left Text Section */}
//       <div className="w-1/2 text-[#1A1A1A]">
//         <h1 className="text-[64px] font-aeonik-bold leading-[120%] pt-[169px]">
//           Inspiring moments. <br />
//           Empowering creators. <br />
//           Uniting people.
//         </h1>
//         <h2 className="text-[24px] pt-[14px]">
//           Pintree brings connections, entertainment, creativity, and visibility
//           together—helping everyone share, grow, and be seen.
//         </h2>
//         <p className="text-[24px] font-aeonik-medium pt-[37px]">
//           Get the Pintree App
//         </p>
//         <div className="flex gap-2 pt-[18px]">
//           <img src="/appStore.svg" alt="App Store" />
//           <img src="/playStore.svg" alt="Play Store" />
//         </div>
//       </div>

//       {/* Right Phone Frame Section */}
//       <div className="w-1/2 flex justify-center items-center pt-[59px] pb-[97px]">
//         <div className="w-[360px] h-[640px] border border-[#B4B4B4] rounded-[32px] bg-[#F2F2F2] flex justify-center items-center">
//           <div className="w-[269px] h-[454px] bg-white rounded-[24px] overflow-hidden relative">
//             <div
//               className="absolute top-0 left-0 w-full"
//               ref={feedRef}
//               style={{
//                 transform: `translateY(-${feedScroll}px)`,
//                 transition: "transform 0.1s linear",
//               }}
//             >
//               {feedItems.map((item, idx) => (
//                 <div key={idx} className="feed-item">
//                   <img src={item.img} alt={`feed-${idx}`} className="w-full" />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Section3;

// "use client";
// import React, { useRef, useState, useEffect } from "react";

// const Section3 = () => {
//   const bannerRef = useRef(null);
//   const feedRef = useRef(null);
//   const [feedScroll, setFeedScroll] = useState(0);
//   const touchStartY = useRef(0);

//   // Enable smooth normal page scroll globally
//   useEffect(() => {
//     document.documentElement.style.scrollBehavior = "smooth";
//     return () => {
//       document.documentElement.style.scrollBehavior = "auto";
//     };
//   }, []);

//   const feedItems = [{ img: "/feed.png" }];

//   const scrollFeed = (deltaY) => {
//     const feedEl = feedRef.current;
//     if (!feedEl) return;

//     const frameHeight = 454;
//     const feedHeight = feedEl.scrollHeight;
//     let newScroll = feedScroll + deltaY;
//     const maxScroll = feedHeight - frameHeight;

//     if (newScroll < 0) newScroll = 0;
//     if (newScroll > maxScroll) newScroll = maxScroll;
//     setFeedScroll(newScroll);

//     // Allow page scroll when top or bottom reached
//     if (newScroll === 0 || newScroll === maxScroll) {
//       window.scrollBy({ top: deltaY, behavior: "smooth" });
//     }
//   };

//   const handleWheel = (e) => {
//     const feedEl = feedRef.current;
//     if (!feedEl) return;

//     const frameHeight = 454;
//     const feedHeight = feedEl.scrollHeight;
//     const maxScroll = feedHeight - frameHeight;

//     const delta = e.deltaY;
//     const newScroll = feedScroll + delta;

//     // prevent page scroll only when custom scroll is active
//     if (newScroll > 0 && newScroll < maxScroll) {
//       e.preventDefault();
//       scrollFeed(delta);
//     } else {
//       scrollFeed(delta);
//     }
//   };

//   // Touch handlers for mobile
//   const handleTouchStart = (e) => {
//     touchStartY.current = e.touches[0].clientY;
//   };

//   const handleTouchMove = (e) => {
//     const currentY = e.touches[0].clientY;
//     const deltaY = touchStartY.current - currentY; // positive when scrolling down
//     scrollFeed(deltaY);
//     touchStartY.current = currentY; // update for continuous scroll
//   };

//   useEffect(() => {
//     const banner = bannerRef.current;
//     if (!banner) return;

//     banner.addEventListener("wheel", handleWheel, { passive: false });
//     banner.addEventListener("touchstart", handleTouchStart, { passive: true });
//     banner.addEventListener("touchmove", handleTouchMove, { passive: false });

//     return () => {
//       banner.removeEventListener("wheel", handleWheel);
//       banner.removeEventListener("touchstart", handleTouchStart);
//       banner.removeEventListener("touchmove", handleTouchMove);
//     };
//   }, [feedScroll]);

//   return (
//     <div className="flex px-[240px]" ref={bannerRef}>
//       {/* Left Text Section */}
//       <div className="w-1/2 text-[#1A1A1A]">
//         <h1 className="text-[64px] font-aeonik-bold leading-[120%] pt-[169px]">
//           Inspiring moments. <br />
//           Empowering creators. <br />
//           Uniting people.
//         </h1>
//         <h2 className="text-[24px] pt-[14px]">
//           Pintree brings connections, entertainment, creativity, and visibility
//           together—helping everyone share, grow, and be seen.
//         </h2>
//         <p className="text-[24px] font-aeonik-medium pt-[37px]">
//           Get the Pintree App
//         </p>
//         <div className="flex gap-2 pt-[18px]">
//           <img src="/appStore.svg" alt="App Store" />
//           <img src="/playStore.svg" alt="Play Store" />
//         </div>
//       </div>

//       {/* Right Phone Frame Section */}
//       <div className="w-1/2 flex justify-center items-center pt-[59px] pb-[97px]">
//         <div className="w-[360px] h-[640px] border border-[#B4B4B4] rounded-[32px] bg-[#F2F2F2] flex justify-center items-center">
//           <div className="w-[269px] h-[454px] bg-white rounded-[24px] overflow-hidden relative">
//             <div
//               className="absolute top-0 left-0 w-full"
//               ref={feedRef}
//               style={{
//                 transform: `translateY(-${feedScroll}px)`,
//                 transition: "transform 0.1s linear",
//               }}
//             >
//               {feedItems.map((item, idx) => (
//                 <div key={idx} className="feed-item">
//                   <img src={item.img} alt={`feed-${idx}`} className="w-full" />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Section3;

// "use client";
// import React, { useRef, useState, useEffect } from "react";

// const Section3 = () => {
//   const bannerRef = useRef(null);
//   const feedRef = useRef(null);
//   const nextSectionRef = useRef(null); // 🔥 NEW
//   const [feedScroll, setFeedScroll] = useState(0);
//   const touchStartY = useRef(0);

//   // Enable smooth page scroll
//   useEffect(() => {
//     document.documentElement.style.scrollBehavior = "smooth";
//     return () => {
//       document.documentElement.style.scrollBehavior = "auto";
//     };
//   }, []);

//   const feedItems = [{ img: "/feed.png" }];

//   // UPDATED scrollFeed with snap
//   const scrollFeed = (deltaY) => {
//     const feedEl = feedRef.current;
//     if (!feedEl) return;

//     const frameHeight = 454;
//     const feedHeight = feedEl.scrollHeight;

//     let newScroll = feedScroll + deltaY;
//     const maxScroll = feedHeight - frameHeight;

//     if (newScroll < 0) newScroll = 0;
//     if (newScroll > maxScroll) newScroll = maxScroll;

//     setFeedScroll(newScroll);

//     // 🔥 SNAP TO NEXT SECTION
//     if (newScroll === maxScroll && deltaY > 0) {
//       setTimeout(() => {
//         nextSectionRef.current?.scrollIntoView({ behavior: "smooth" });
//       }, 50);
//       return; // stop
//     }

//     // allow normal page scroll when top reached
//     if (newScroll === 0 && deltaY < 0) {
//       window.scrollBy({ top: deltaY, behavior: "smooth" });
//     }
//   };

//   const handleWheel = (e) => {
//     const feedEl = feedRef.current;
//     if (!feedEl) return;

//     const frameHeight = 454;
//     const feedHeight = feedEl.scrollHeight;
//     const maxScroll = feedHeight - frameHeight;

//     const delta = e.deltaY;
//     const newScroll = feedScroll + delta;

//     // prevent page scroll only when feed can scroll
//     if (newScroll > 0 && newScroll < maxScroll) {
//       e.preventDefault();
//       scrollFeed(delta);
//     } else {
//       scrollFeed(delta);
//     }
//   };

//   // Touch handlers
//   const handleTouchStart = (e) => {
//     touchStartY.current = e.touches[0].clientY;
//   };

//   const handleTouchMove = (e) => {
//     const currentY = e.touches[0].clientY;
//     const deltaY = touchStartY.current - currentY;
//     scrollFeed(deltaY);
//     touchStartY.current = currentY;
//   };

//   // add scroll/touch listeners
//   useEffect(() => {
//     const banner = bannerRef.current;
//     if (!banner) return;

//     banner.addEventListener("wheel", handleWheel, { passive: false });
//     banner.addEventListener("touchstart", handleTouchStart, { passive: true });
//     banner.addEventListener("touchmove", handleTouchMove, { passive: false });

//     return () => {
//       banner.removeEventListener("wheel", handleWheel);
//       banner.removeEventListener("touchstart", handleTouchStart);
//       banner.removeEventListener("touchmove", handleTouchMove);
//     };
//   }, [feedScroll]);

//   return (
//     <>
//       {/* SECTION 1 */}
//       <div
//         className="flex px-[240px] h-screen overflow-hidden snap-start"
//         ref={bannerRef}
//       >
//         {/* Left Text Section */}
//         <div className="w-1/2 text-[#1A1A1A]">
//           <h1 className="text-[64px] font-aeonik-bold leading-[120%] pt-[169px]">
//             Inspiring moments. <br />
//             Empowering creators. <br />
//             Uniting people.
//           </h1>

//           <h2 className="text-[24px] pt-[14px]">
//             Pintree brings connections, entertainment, creativity, and visibility
//             together—helping everyone share, grow, and be seen.
//           </h2>

//           <p className="text-[24px] font-aeonik-medium pt-[37px]">
//             Get the Pintree App
//           </p>

//           <div className="flex gap-2 pt-[18px]">
//             <img src="/appStore.svg" alt="App Store" />
//             <img src="/playStore.svg" alt="Play Store" />
//           </div>
//         </div>

//         {/* Right Phone Section */}
//         <div className="w-1/2 flex justify-center items-center pt-[59px] pb-[97px]">
//           <div className="w-[360px] h-[640px] border border-[#B4B4B4] rounded-[32px] bg-[#F2F2F2] flex justify-center items-center">
//             <div className="w-[269px] h-[454px] bg-white rounded-[24px] overflow-hidden relative">
//               <div
//                 className="absolute top-0 left-0 w-full"
//                 ref={feedRef}
//                 style={{
//                   transform: `translateY(-${feedScroll}px)`,
//                   transition: "transform 0.1s linear",
//                 }}
//               >
//                 {feedItems.map((item, idx) => (
//                   <div key={idx}>
//                     <img src={item.img} alt={`feed-${idx}`} className="w-full" />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//     </>
//   );
// };

// export default Section3;

// "use client";
// import React, { useRef, useState, useEffect } from "react";

// const Section1 = () => {
//   const bannerRef = useRef(null);
//   const feedRef = useRef(null);
//   const [feedScroll, setFeedScroll] = useState(0);
//   const touchStartY = useRef(0);

//   // Smooth page scroll
//   useEffect(() => {
//     document.documentElement.style.scrollBehavior = "smooth";
//     return () => {
//       document.documentElement.style.scrollBehavior = "auto";
//     };
//   }, []);

//   const feedItems = [{ img: "/feed.png" }];

//   // scroll inside phone frame
//   const scrollFeed = (deltaY) => {
//     const feedEl = feedRef.current;
//     if (!feedEl) return;

//     const frameHeight = 454;
//     const feedHeight = feedEl.scrollHeight;

//     let newScroll = feedScroll + deltaY;
//     const maxScroll = feedHeight - frameHeight;

//     if (newScroll < 0) newScroll = 0;
//     if (newScroll > maxScroll) newScroll = maxScroll;

//     setFeedScroll(newScroll);

//     // 🔥 When feed reaches bottom → LET THE PAGE SCROLL → snap will happen automatically
//     if (newScroll === maxScroll && deltaY > 0) {
//       // do nothing → allow natural scroll (snap container handles it)
//       return;
//     }

//     // At top and scrolling up → allow natural scroll (snap handles it)
//     if (newScroll === 0 && deltaY < 0) {
//       return;
//     }
//   };

//   const handleWheel = (e) => {
//     const feedEl = feedRef.current;
//     if (!feedEl) return;

//     const frameHeight = 454;
//     const feedHeight = feedEl.scrollHeight;
//     const maxScroll = feedHeight - frameHeight;

//     const delta = e.deltaY;
//     const newScroll = feedScroll + delta;

//     // prevent page scroll only while feed can scroll
//     if (newScroll > 0 && newScroll < maxScroll) {
//       e.preventDefault();
//       scrollFeed(delta);
//     } else {
//       scrollFeed(delta);
//     }
//   };

//   // Touch handlers
//   const handleTouchStart = (e) => {
//     touchStartY.current = e.touches[0].clientY;
//   };

//   const handleTouchMove = (e) => {
//     const currentY = e.touches[0].clientY;
//     const deltaY = touchStartY.current - currentY;
//     scrollFeed(deltaY);
//     touchStartY.current = currentY;
//   };

//   useEffect(() => {
//     const banner = bannerRef.current;
//     if (!banner) return;

//     banner.addEventListener("wheel", handleWheel, { passive: false });
//     banner.addEventListener("touchstart", handleTouchStart, { passive: true });
//     banner.addEventListener("touchmove", handleTouchMove, { passive: false });

//     return () => {
//       banner.removeEventListener("wheel", handleWheel);
//       banner.removeEventListener("touchstart", handleTouchStart);
//       banner.removeEventListener("touchmove", handleTouchMove);
//     };
//   }, [feedScroll]);

//   return (
//     <div
//       className="flex px-[240px] h-screen overflow-hidden snap-start"
//       ref={bannerRef}
//     >
//       {/* Left Section */}
      // <div className="w-1/2 text-[#1A1A1A]">
      //   <h1 className="text-[64px] font-aeonik-bold leading-[120%] pt-[169px]">
      //     Inspiring moments. <br />
      //     Empowering creators. <br />
      //     Uniting people.
      //   </h1>

      //   <h2 className="text-[24px] pt-[14px]">
      //     Pintree brings connections, entertainment, creativity, and visibility
      //     together—helping everyone share, grow, and be seen.
      //   </h2>

      //   <p className="text-[24px] font-aeonik-medium pt-[37px]">
      //     Get the Pintree App
      //   </p>

      //   <div className="flex gap-2 pt-[18px]">
      //     <img src="/appStore.svg" alt="App Store" />
      //     <img src="/playStore.svg" alt="Play Store" />
      //   </div>
      // </div>

//       {/* Phone Frame */}
//       <div className="w-1/2 flex justify-center items-center pt-[59px] pb-[97px]">
//         <div className="w-[360px] h-[640px] border border-[#B4B4B4] rounded-[32px] bg-[#F2F2F2] flex justify-center items-center">
//           <div className="w-[269px] h-[454px] bg-white rounded-[24px] overflow-hidden relative">
//             <div
//               className="absolute top-0 left-0 w-full"
//               ref={feedRef}
//               style={{
//                 transform: `translateY(-${feedScroll}px)`,
//                 transition: "transform 0.1s linear",
//               }}
//             >
//               {feedItems.map((item, idx) => (
//                 <div key={idx}>
//                   <img src={item.img} alt={`feed-${idx}`} className="w-full" />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Section1;

// import React from "react";

// function Section1() {
//   return <div className="flex h-full px-[240px]">

//  <div className="w-1/2 text-[#1A1A1A]">
//         <h1 className="text-[64px] font-aeonik-bold leading-[120%] pt-[169px]">
//         Your space <br/>
// to shine, explore, <br/>
// and connect.
//         </h1>

//         <h2 className="text-[24px] pt-[14px]">
//           Pintree brings connections, entertainment, creativity, and visibility
//           together—helping everyone share, grow, and be seen.
//         </h2>

//         <p className="text-[24px] font-aeonik-medium pt-[37px]">
//           Get the Pintree App
//         </p>

//         <div className="flex gap-2 pt-[18px]">
//           <img src="/appStore.svg" alt="App Store" />
//           <img src="/playStore.svg" alt="Play Store" />
//         </div>
      
// </div>
// <div className="w-1/2 pt-[169px] flex justify-center items-center">
// <img src="/mobile-frame.svg" alt="" />
// <img src="/img1.svg" alt="" />
// </div>
//   </div>;
// }

// export default Section1;


// "use client";
// import React, { useEffect, useState } from "react";

// function Section1() {
//   const [active, setActive] = useState(0);
//   const [flash, setFlash] = useState(false);

//   const images = ["/img1.svg", "/playStore.svg"];

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setFlash(true);

//       // flash lasts 200ms
//       setTimeout(() => {
//         setFlash(false);
//         setActive((prev) => (prev + 1) % images.length);
//       }, 200);
//     }, 1200); // switch every 1.2 sec

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="flex h-full px-[140px] 2xl:px-[240px]">
//       {/* LEFT TEXT SECTION */}
//       <div className="w-1/2 text-[#1A1A1A]">
//         <h1 className="text-[54px] 2xl:text-[64px] font-aeonik-bold leading-[120%] pt-[169px]">
//           Your space <br />
//           to shine, explore, <br />
//           and connect.
//         </h1>

//         <h2 className="text-[20px] 2xl:text-[24px] pt-[14px]">
//           Pintree brings connections, entertainment, creativity, and visibility
//           together—helping everyone share, grow, and be seen.
//         </h2>

//         <p className="text-[20px] 2xl:text-[24px] font-aeonik-medium pt-[37px]">
//           Get the Pintree App
//         </p>

//         <div className="flex gap-2 pt-[18px]">
//           <img src="/appStore.svg" alt="App Store" />
//           <img src="/playStore.svg" alt="Play Store" />
//         </div>
//       </div>

//       {/* RIGHT PHONE SECTION */}
//       <div className="w-1/2 pt-[169px] flex justify-center items-center relative">

//         {/* PHONE FRAME */}
//         <img
//           src="/mobile-frame.svg"
//           alt="mobile frame"
//           className="relative z-10 pointer-events-none"
//         />

//         {/* IMAGE SCREEN */}
//         <div className="absolute z-0 w-[380px] h-[480px] overflow-hidden r">

//           {/* LOOP IMAGES */}
//           {images.map((src, index) => (
//             <img
//               key={index}
//               src={src}
//               alt=""
//               className={`
//                 absolute inset-0 w-full h-full object-cover
//                 transition-all duration-500 ease-out
//                 ${active === index ? "opacity-100" : "opacity-0"}
//                 ${flash && active === index ? "brightness-150 scale-105" : "brightness-100 scale-100"}
//               `}
//             />
//           ))}
//         </div>

//       </div>
//     </div>
//   );
// }

// export default Section1;




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
    <div className="
      flex flex-col lg:flex-row 
      h-auto 
      px-6 sm:px-10 lg:px-[80px] xl:px-[140px] 2xl:px-[240px] 
      pt-10 lg:pt-0
    ">
      
      {/* LEFT TEXT SECTION */}
      <div className="w-full lg:w-1/2 text-[#1A1A1A] flex flex-col justify-center pb-10 lg:pb-0">
        <h1 className="
          text-[32px] sm:text-[40px] md:text-[48px] lg:text-[54px] 2xl:text-[64px] 
          font-aeonik-bold leading-[120%]  
        ">
          Your space <br />
          to shine, explore, <br />
          and connect.
        </h1>

        <h2 className="
          text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] 2xl:text-[24px] 
          pt-[14px]
        ">
          Pintree brings connections, entertainment, creativity, and visibility
          together—helping everyone share, grow, and be seen.
        </h2>

        <p className="
          text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] 2xl:text-[24px] 
          font-aeonik-medium pt-[30px]
        ">
          Get the Pintree App
        </p>

        <div className="flex gap-2 pt-[18px]">
          <img src="/appStore.svg" alt="App Store" className="w-[120px] sm:w-[140px]" />
          <img src="/playStore.svg" alt="Play Store" className="w-[120px] sm:w-[140px]" />
        </div>
      </div>

      {/* RIGHT PHONE SECTION */}
      <div className="
        w-full lg:w-1/2 
        flex justify-center items-center 
        relative 
        pt-10 lg:pt-[169px]
      ">

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
                ${flash && active === index ? "brightness-150 scale-105" : "brightness-100 scale-100"}
              `}
            />
          ))}
        </div>

      </div>
    </div>
  );
}

export default Section1;
