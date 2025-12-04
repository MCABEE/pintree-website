"use client";

export default function Pagination({
  current = 1,
  total = 3,
  onChange = () => {},
}) {
  const pages = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <div className="flex items-center mt-10 select-none">

      {/* ---------- Previous Button ---------- */}
      <button
        onClick={() => current > 1 && onChange(current - 1)}
        className={`
          w-[96px] h-[56px] flex items-center justify-center 
          border 
          ${
            current === 1
              ? "border-[#AAAAAA] text-[#A0A0A0] cursor-not-allowed"
              : "border-[#AAAAAA] text-[#A0A0A0] cursor-not-allowed"
          }
          rounded-l-[6px]
        `}
      >
        ‹
      </button>

      {/* ---------- Page Numbers ---------- */}
      {pages.map((num) => (
        <button
          key={num}
          onClick={() => onChange(num)}
          className={`
            w-[96px] h-[56px] flex items-center justify-center 
            border border-[#AAAAAA] 
            text-[16px]
            ${
              current === num
                ? "bg-[#AAAAAA] text-[#333333]"
                : "bg-white text-[#333333]"
            }
          `}
        >
          {num}
        </button>
      ))}

      {/* ---------- Next Button ---------- */}
      <button
        onClick={() => current < total && onChange(current + 1)}
        className={`
          w-[96px] h-[56px] flex items-center justify-center 
          border 
          ${
            current === total
              ? "border-[#AAAAAA] text-[#A0A0A0] cursor-not-allowed"
              : "border-[#AAAAAA] text-[#333]"
          }
          rounded-r-[6px]
        `}
      >
        ›
      </button>
    </div>
  );
}
