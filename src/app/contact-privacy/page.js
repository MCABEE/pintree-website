import CustomSelect from "@/components/CustomSelect";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";

const page = () => {
  return (
    <>
    <Navbar/>
    <div className="bg-white pb-20">
      <div className=" py-[60px] lg:py-[100px] 3xl:py-[156px] min-h-screen mx-4 sm:w-[600px] lg:w-[950px] xl:w-[1050px] 3xl:w-[1440px] bg-white flex flex-col justify-center items-center border border-[#FFFFFF] shadow-xl sm:mx-auto">
          {/* Title */}
          <h1 className="text-center text-[#000000] text-[20px] lg:text-[32px] font-aeonik-bold ">
            Your Privacy Matter’s
          </h1>

          <p className="text-center mt-[15px] text-[#1A1A1A] text-[14px] lg:text-[24px] font-aeonik-regular px-4 sm:px-28 lg:px-0">
            Report privacy violations, data misuse, impersonation, hacking, or
            any <br className="hidden lg:inline-block"/> security concern here.
          </p>
        <div className="w-full max-w-2xl ">

          {/* Form */}
          <form className="space-y-7 mt-[27px] sm:mt-[59px] text-[#333333] text-[20px] font-aeonik-regular px-4">
            {/* Full Name */}
            <div>
              <label className="block text-[16px] font-aeonik-medium mb-1.5 text-[#333333]">
                Full Name *
              </label>
              <input
                type="text"
                className="w-full border border-[#0C0C0C] rounded-[4px] px-[25px] h-[48px] 2xl:h-[56px] placeholder:text-[#333333] placeholder:text-[16px] 2xl:placeholder:text-[20px] placeholder:font-aeonik-regular outline-none"
                placeholder="Carlo Acutis"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-[16px] font-aeonik-medium mb-1.5 text-[#333333]">
                Email Address *
              </label>
              <input
                type="email"
                className="w-full border border-[#0C0C0C] rounded-[4px] px-[25px] h-[48px] 2xl:h-[56px] placeholder:text-[#333333] placeholder:text-[16px] 2xl:placeholder:text-[20px] placeholder:font-aeonik-regular outline-none"
                placeholder="India"
              />
            </div>

            {/* Account Username */}
            <div>
              <label className="block text-[16px] font-aeonik-medium mb-1.5 text-[#333333]">
                Account Username *
              </label>
              <input
                type="text"
                className="w-full border border-[#0C0C0C] rounded-[4px] px-[25px] h-[48px] 2xl:h-[56px] placeholder:text-[#333333] placeholder:text-[16px] 2xl:placeholder:text-[20px] placeholder:font-aeonik-regular outline-none"
                placeholder="Account ID"
              />
            </div>

            {/* Type of Concern */}
            <div>
              <label className="block text-[16px] font-aeonik-medium mb-1.5 text-[#333333]">
                Type of Concern *
              </label>
              <CustomSelect />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[16px] font-aeonik-medium mb-1.5 text-[#333333]">
                Describe the Issue *
              </label>
              <textarea
                className="w-full px-[25px] border border-[#0C0C0C] rounded-[4px] h-[128px] pt-[16px] placeholder:text-[#333333] placeholder:text-[16px] 2xl:placeholder:text-[20px] placeholder:font-aeonik-regular outline-none"
                placeholder="Write here"
              ></textarea>
            </div>

            {/* Related Profile */}
            <div>
              <label className="block text-[16px] font-aeonik-medium mb-1.5 text-[#333333]">
                Related Profile (Optional)
              </label>
              <input
                type="text"
                className="w-full border border-[#0C0C0C] rounded-[4px] px-[25px] h-[48px] 2xl:h-[56px] placeholder:text-[#333333] placeholder:text-[16px] 2xl:placeholder:text-[20px] placeholder:font-aeonik-regular outline-none"
                placeholder="Profile ID / URL"
              />
            </div>

            {/* Upload Evidence */}
            <div>
              <label className="block text-[16px] font-aeonik-medium mb-1.5 text-[#333333]">
                Upload Evidence (Optional)
              </label>

              <button
                type="button"
                className="bg-[#0453F1] text-white w-[104px] 2xl:w-[144px] h-[48px] 2xl:h-[56px] rounded-[4px] text-[16px] 2xl:text-[20px] font-aeonik-regular"
              >
                Upload File
              </button>

              <p className="text-[16px] text-[#333333] font-aeonik-regular mt-[12px]">
                Supported file types include: <br />
                7Z, BMP, GIF, GZ, JPEG, JPG, PNG, TIF, TIFF, RAR, TAR, ZIP
              </p>
            </div>

            {/* Preferred Response */}
            <div>
              <label className="block text-[16px] font-aeonik-medium mb-1.5 text-[#333333]">
                Preferred Response Method *
              </label>
              <CustomSelect />
            </div>

            <div>
              <label className="block text-[16px] font-aeonik-medium mb-1.5 text-[#333333]">
                Declaration
              </label>
                   <p className="text-[#333333] font-aeonik-regular text-[16px] leading-[140%]  ">
              I affirm that the information I have provided is complete and
              accurate to the best of my ability. By submitting this form, I
              acknowledge that Pintree will handle my data in accordance with
              its Privacy Policy.
            </p>
            </div>

            {/* Declaration */}
       

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#0453F1] text-white  py-[12px] xl:py-[15px] rounded-[4px] text-[16px] 2xl:text-[20px] font-aeonik-medium "
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default page;
