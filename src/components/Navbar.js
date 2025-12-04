export default function Navbar() {
  return (
    <div className="w-full flex items-center justify-between px-[240px] py-[20px]  bg-white">
      {/* Left Section - Logo */}

      <img src="/pintree.svg" alt="" className="w-[100px] h-[22px] 2xl:size-auto" />

      <div className="flex justify-center items-center gap-[77px]">
        <h1>
          <button className="w-[104px] h-[40px] rounded-[8px] bg-[#F2F2F2] text-[20px] text-[#333333] font-aeonik-regular cursor-pointer">
            About
          </button>
        </h1>
        <h1 className=" text-[#333333] font-aeonik-regular text-[20px] cursor-pointer">
          Newsroom
        </h1>
        <h1 className=" text-[#333333] font-aeonik-regular text-[20px]  cursor-pointer">
          Contact
        </h1>
        <h1 className=" text-[#333333] font-aeonik-regular text-[20px]  cursor-pointer">
          Blog
        </h1>
      </div>
      <div className="flex justify-center items-center gap-[11px]">
        <button className="font-aeonik-medium text-[20px] text-[#333333] cursor-pointer">
          Professional Account
        </button>
        <img src="/tick.svg" alt="" className="justify-center items-center" />
      </div>
    </div>
  );
}
