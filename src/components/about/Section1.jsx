"use client";

function Section1() {
  return (
    <section className="relative min-h-[calc(100vh-64px)] w-full overflow-hidden flex items-center">
      <img
        src="/hero-home.svg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.52)_0%,rgba(0,0,0,0.38)_42%,rgba(0,0,0,0.22)_100%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto h-full w-full max-w-[1536px] px-6 sm:px-10 lg:px-[136px] flex items-center">
        <div className="max-w-[560px] pb-[48px] pt-[64px] sm:pt-[72px] lg:max-w-[520px] lg:pb-[56px] lg:pt-[75px]">
          <p className="mb-[12px] text-[9px] uppercase leading-none tracking-[0.02em] text-white/85 font-aeonik-medium font-medium">
            HOME / PINTREE
          </p>

          <h1 className="m-0 max-w-[500px] text-[28px] font-aeonik-medium font-medium leading-[1.12] tracking-[-0.02em] text-white sm:text-[32px] lg:text-[36px] lg:leading-[1.08] lg:whitespace-nowrap">
            People, Communities, Discovery
          </h1>

          <p className="mt-[10px] max-w-[470px] text-[11px] leading-[1.5] font-aeonik-regular font-normal text-white/90 sm:text-[12px] lg:mt-[11px] lg:text-[13px] lg:leading-[1.45]">
            People you know → Communities you belong to → A world beyond your
            network.
          </p>

          <p className="mb-[8px] mt-[32px] text-[9px] leading-none font-aeonik-regular font-normal text-white lg:mt-[34px]">
            Get the Pintree App
          </p>

          <div className="flex items-center gap-[8px]">
            <a
              href="#"
              className="relative inline-flex h-[29px] w-[38px] shrink-0 items-center justify-center transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
              aria-label="Download on the App Store"
            >
              <img
                src="/Rectangle-151850.svg"
                alt=""
                className="absolute inset-0 h-full w-full"
              />
              <img
                src="/hero-app-store-icon.svg"
                alt=""
                className="relative z-10 h-[16px] w-[15px] object-contain"
              />
            </a>
            <a
              href="#"
              className="relative inline-flex h-[29px] w-[38px] shrink-0 items-center justify-center transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
              aria-label="Get it on Google Play"
            >
              <img
                src="/Rectangle-151850.svg"
                alt=""
                className="absolute inset-0 h-full w-full"
              />
              <img
                src="/hero-google-play-icon.svg"
                alt=""
                className="relative z-10 h-[16px] w-[14px] object-contain"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Section1;
