// "use client";

// export default function Pagination({
//   current = 1,
//   total = 3,
//   onChange = () => {},
// }) {
//   const pages = Array.from({ length: total }, (_, i) => i + 1);

//   return (
//     <div className="flex items-center mt-10 select-none">

//       {/* ---------- Previous Button ---------- */}
//       <button
//         onClick={() => current > 1 && onChange(current - 1)}
//         className={`
//           w-[96px] h-[56px] flex items-center justify-center 
//           border 
//           ${
//             current === 1
//               ? "border-[#AAAAAA] text-[#A0A0A0] cursor-not-allowed"
//               : "border-[#AAAAAA] text-[#A0A0A0] cursor-not-allowed"
//           }
//           rounded-l-[6px]
//         `}
//       >
//         ‹
//       </button>

//       {/* ---------- Page Numbers ---------- */}
//       {pages.map((num) => (
//         <button
//           key={num}
//           onClick={() => onChange(num)}
//           className={`
//             w-[96px] h-[56px] flex items-center justify-center 
//             border border-[#AAAAAA] 
//             text-[16px]
//             ${
//               current === num
//                 ? "bg-[#AAAAAA] text-[#333333]"
//                 : "bg-white text-[#333333]"
//             }
//           `}
//         >
//           {num}
//         </button>
//       ))}

//       {/* ---------- Next Button ---------- */}
//       <button
//         onClick={() => current < total && onChange(current + 1)}
//         className={`
//           w-[96px] h-[56px] flex items-center justify-center 
//           border 
//           ${
//             current === total
//               ? "border-[#AAAAAA] text-[#A0A0A0] cursor-not-allowed"
//               : "border-[#AAAAAA] text-[#333]"
//           }
//           rounded-r-[6px]
//         `}
//       >
//         ›
//       </button>
//     </div>
//   );
// }









"use client";

import React from "react";

export default function Pagination({
  current = 1,
  total = 3,
  onChange = () => {},
}) {
  const pages = Array.from({ length: total }, (_, i) => i + 1);

  const handleKey = (e, value) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onChange(value);
    }
  };

  return (
    <nav
      className="mt-6"
      role="navigation"
      aria-label="Pagination Navigation"
    >
      {/* scrollable on small screens, centered on larger */}
      <div className="overflow-x-auto">
        <div className="inline-flex items-center select-none">
          {/* Previous */}
          <button
            onClick={() => current > 1 && onChange(current - 1)}
            onKeyDown={(e) => handleKey(e, Math.max(1, current - 1))}
            disabled={current === 1}
            aria-label="Previous page"
            className={
              "flex items-center justify-center " +
              // responsive sizing: mobile -> md -> xl
              "min-w-[44px] md:min-w-[96px] h-[40px] md:h-[56px] " +
              "px-3 md:px-0 " +
              // border + rounded-left only for the first button in the row
              "border border-[#AAAAAA] rounded-l-[6px] " +
              // disabled vs enabled styles
              (current === 1
                ? "bg-white text-[#A0A0A0] cursor-not-allowed"
                : "bg-white text-[#333333] hover:bg-[#F3F3F3] cursor-pointer")
            }
          >
            <span className="text-[20px] md:text-[24px]" aria-hidden>
              ‹
            </span>
          </button>

          {/* Page numbers (flex-nowrap so they stay in one row) */}
          <div className="inline-flex flex-nowrap">
            {pages.map((num, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === pages.length - 1;
              return (
                <button
                  key={num}
                  onClick={() => onChange(num)}
                  onKeyDown={(e) => handleKey(e, num)}
                  aria-current={current === num ? "page" : undefined}
                  aria-label={`Page ${num}`}
                  className={
                    // keep consistent size, allow labels to scale
                    "min-w-[44px] md:min-w-[96px] h-[40px] md:h-[56px] px-3 md:px-0 " +
                    "flex items-center justify-center border border-[#AAAAAA] text-[14px] md:text-[16px] " +
                    (current === num
                      ? "bg-[#AAAAAA] text-[#333333] cursor-default"
                      : "bg-white text-[#333333] hover:bg-[#F8F8F8] cursor-pointer")
                  }
                >
                  {num}
                </button>
              );
            })}
          </div>

          {/* Next */}
          <button
            onClick={() => current < total && onChange(current + 1)}
            onKeyDown={(e) => handleKey(e, Math.min(total, current + 1))}
            disabled={current === total}
            aria-label="Next page"
            className={
              "flex items-center justify-center " +
              "min-w-[44px] md:min-w-[96px] h-[40px] md:h-[56px] " +
              "px-3 md:px-0 border border-[#AAAAAA] rounded-r-[6px] " +
              (current === total
                ? "bg-white text-[#A0A0A0] cursor-not-allowed"
                : "bg-white text-[#333333] hover:bg-[#F3F3F3] cursor-pointer")
            }
          >
            <span className="text-[20px] md:text-[24px]" aria-hidden>
              ›
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
