"use client";

export default function CustomSelect({
  label,
  required = false,
  options = [],
  placeholder = "Select",
  icon = "/arrow.svg",
}) {
  return (
    <div className="w-full">
      {/* Label */}
      <label className="block text-[16px] font-aeonik-medium mb-1.5 text-[#333333]">
        {label} {required && "*"}
      </label>

      {/* Wrapper Box */}
      <div className="flex items-center border border-[#0C0C0C] rounded-[4px] px-[25px]  h-[48px] md:py-4 outline-none">
        
        {/* Select Element */}
        <select className="w-full text-[#333333] text-[16px] 2xl:text-[20px] font-aeonik-regular appearance-none outline-none bg-transparent">
          <option value="" className="text-[16px] lg:text-[24px]">{placeholder}</option>
          {options.map((opt, idx) => (
            <option key={idx} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        {/* Custom Arrow */}
        <img src={icon} alt="dropdown arrow" className="size-3 2xl:size-5 ml-3" />
      </div>
    </div>
  );
}
