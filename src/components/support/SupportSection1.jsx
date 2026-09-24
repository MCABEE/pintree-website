"use client";

/** Support page hero — separate from `/contact` Section1. */
export default function SupportSection1() {
  return (
    <section className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-white px-6 py-12 sm:px-10 lg:px-[136px] lg:py-16">
      <div className="mx-auto max-w-[900px] text-center">
        <p className="text-[15px] font-aeonik-medium text-[#333333] sm:text-[16px] lg:text-[18px]">
          Get in touch with Pintree
        </p>

        <h1 className="mt-5 text-[32px] font-aeonik-medium leading-[1.12] tracking-[-0.02em] text-[#1A1A1A] sm:text-[40px] lg:text-[48px]">
          <span className="block">
            <span className="bg-[#DCF4C6] px-2 pb-3">Questions,</span>{" "}
            <span className="bg-[#C6F4F0] px-2 pb-3">support,</span>
          </span>
          <span className="mt-1 block">
            or something to{" "}
            <span className="bg-[#D5C6F4] px-2 pb-3">share?</span>
          </span>
          <span className="mt-2 block text-[#1A1A1A]">
            We&apos;re here to help.
          </span>
        </h1>

        <p className="mx-auto mt-8 max-w-[620px] text-[15px] leading-[1.55] font-aeonik-regular text-[#555555] sm:text-[16px] lg:mt-10">
          Have a question, need support, or want to connect with our team?
          <br className="hidden sm:block" />
          <span className="sm:mt-1 sm:inline-block">
            Whether you&apos;re a user, creator, business, or professional,
            we&apos;re happy to hear from you.
          </span>
        </p>
      </div>
    </section>
  );
}
