import CustomSelect from "@/components/CustomSelect";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";

function page() {
  return (
    <div>
      <>
        <Navbar />
        <div className="bg-white pb-20">
          {/* <div className=" py-[60px] lg:py-[100px] 3xl:py-[156px] min-h-screen mx-4 sm:w-[600px] lg:w-[950px] xl:w-[1050px] 2xl:w-[1440px] 3xl:w-[1700px] bg-white flex flex-col justify-center items-center border border-[#FFFFFF] shadow-xl sm:mx-auto"> */}
          {/* Title */}
          <div className=" py-[60px] lg:py-[100px] 3xl:py-[156px] min-h-screen mx-4 sm:w-[600px] lg:w-[950px] xl:w-[1050px] 3xl:w-[1440px] bg-white flex flex-col justify-center items-center border border-[#FFFFFF] shadow-xl sm:mx-auto">
            <h1 className="text-center text-[#000000] text-[20px] lg:text-[32px] font-aeonik-bold ">
              Report a Problem
            </h1>

            <p className="text-center mt-[15px] text-[#1A1A1A] text-[14px] lg:text-[24px] font-aeonik-regular px-4 sm:px-28 lg:px-0">
              For bug reports, app issues, UI errors, glitches, technical
              problems, <br /> broken pages, etc.
            </p>
            <div className="w-full max-w-2xl ">
              {/* Form */}
              <form className="space-y-7 mt-[59px] text-[#333333] text-[20px] font-aeonik-regular px-4">
                {/* Full Name */}
                <div>
                  <label className="block text-[14px] md:text-[16px] font-aeonik-medium mb-1.5 text-[#333333]">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    className="w-full border border-[#0C0C0C] rounded-[4px] px-[25px] h-[48px] md:py-4 placeholder:text-[#333333] placeholder:text-[16px] md:placeholder:text-[20px] placeholder:font-aeonik-regular"
                    placeholder="Carlo Acutis"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-[14px] md:text-[16px] font-aeonik-medium mb-1.5 text-[#333333]">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    className="w-full border border-[#0C0C0C] rounded-[4px] px-[25px]  h-[48px] md:py-4 placeholder:text-[#333333] placeholder:text-[16px] md:placeholder:text-[20px] placeholder:font-aeonik-regular"
                    placeholder="India"
                  />
                </div>

                {/* Account Username */}
                <div>
                  <label className="block text-[14px] md:text-[16px] font-aeonik-medium mb-1.5 text-[#333333]">
                    Account Username *
                  </label>
                  <input
                    type="text"
                    className="w-full border border-[#0C0C0C] rounded-[4px] px-[25px]  h-[48px] md:py-4 placeholder:text-[#333333] placeholder:text-[16px] md:placeholder:text-[20px] placeholder:font-aeonik-regular"
                    placeholder="Account ID"
                  />
                </div>

                {/* Type of Concern */}
                <div>
                  <label className="block text-[14px] md:text-[16px] font-aeonik-medium mb-1.5 text-[#333333]">
                    Issue Category *
                  </label>
                  <CustomSelect />
                </div>

                <div>
                  <label className="block text-[14px] md:text-[16px] font-aeonik-medium mb-1.5 text-[#333333]">
                    Device Details *
                  </label>
                  <CustomSelect />
                </div>

                <div>
                  <label className="block text-[14px] md:text-[16px] font-aeonik-medium mb-1.5 text-[#333333]">
                    App version (Optional)
                  </label>
                  <CustomSelect />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[14px] md:text-[16px] font-aeonik-medium mb-1.5 text-[#333333]">
                    Describe the Issue *
                  </label>
                  <textarea
                    className="w-full px-[25px] border border-[#0C0C0C] rounded-[4px] h-[128px] pt-[16px] placeholder:text-[#333333] placeholder:text-[16px] md:placeholder:text-[20px] placeholder:font-aeonik-regular"
                    placeholder="Write here"
                  ></textarea>
                </div>

                {/* Upload Evidence */}
                <div>
                  <label className="block text-[14px] md:text-[16px] font-aeonik-medium mb-1.5 text-[#333333]">
                    Attach Screenshots if any (Optional)
                  </label>

                  <button
                    type="button"
                    className="bg-[#0453F1] text-white px-[25px] py-[10px] 2xl:py-[16px] rounded-[4px] text-[20px] font-aeonik-regular"
                  >
                    Upload File
                  </button>

                  <p className="text-[14px] md:text-[16px] text-[#333333] font-aeonik-regular mt-[12px]">
                    Supported file types include: <br />
                    7Z, BMP, GIF, GZ, JPEG, JPG, PNG, TIF, TIFF, RAR, TAR, ZIP
                  </p>
                </div>

                {/* Preferred Response */}

                <div>
                  <label className="block text-[14px] md:text-[16px] font-aeonik-medium mb-1.5 text-[#333333]">
                    Preferred Response Method *
                  </label>
                  <CustomSelect />
                </div>

                {/* Declaration */}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-[#0453F1] text-white  py-[15px] rounded-[4px] text-[20px] font-aeonik-medium "
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
        <Footer />
      </>
    </div>
  );
}

export default page;
