import Link from "next/link";
import React from "react";

function Footer() {
  return (
    <div className="w-full flex flex-col xl:flex-row items-center justify-between  px-[24px] 2xl:px-[140px] 3xl:px-[240px] pb-[90px] pt-[57px]  bg-white border border-t border-[#AAAAAA]">
      <img src="/pintree.svg" alt="" className="order-1 xl:order-none mt-10 xl:mt-0" />

      <div className="flex flex-col xl:flex-row justify-center items-center gap-[12px] xl:gap-[96px]">
        <Link href={"/terms-of-service"} className=" text-[20px] text-[#333333] font-aeonik-regular cursor-pointer">
          Terms of Service
        </Link>
        <Link href={"/privacy-policy"} className=" text-[#333333] font-aeonik-regular text-[20px] cursor-pointer">
          Privacy
        </Link>
        <Link href={"/community-guidlines"} className=" text-[#333333] font-aeonik-regular text-[20px]  cursor-pointer">
          Community Guidelines
        </Link>
      </div>
      <div className="flex justify-center items-center gap-[10px] order-2 xl:order-none mt-4 xl:mt-0 ">
        <img src="/@.svg" alt="" />
        <div className="text-[#333333] font-aeonik-regular text-[20px] ">
          2025 Pintree
        </div>
      </div>
    </div>
  );
}

export default Footer;
