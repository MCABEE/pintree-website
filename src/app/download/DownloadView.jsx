const PLAY_QR = "/download/playstore-qr.jpeg";
const APP_STORE_QR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBVkYmsI3Uez51k7j7F6UQmufFPuehf-Jr4sq4BmH7XdOUhK69o8eJfBIpPVMrrdzXb93vppi_HAUVg30crO5Rao_0npPQR7W44pB0fb0L1suoR1bNGKztvPbkuVFvHZbt6R9jZHK6aCBCzFGHTjHoIS_IoPDWArMCKnEnjoP7Hb8mJlKXKsymoldn_U4u83p7ZN5CirI2Oy-JNW4sF5BbRiGcRj2zv1XNoirvxqCLDiA6scQoCnFSG";

const FEATURES = [
  {
    number: "01",
    title: "User Accounts",
    body: "Create your personal identity on Pintree. Build your profile, express your interests and connect with people through a profile that represents you.",
    tag: "Identity & Profile Architecture",
    badge: "bg-[#CAFFA6]/30 border-[#CAFFA6]",
    tagClass: "bg-[#CAFFA6]/25 border-[#CAFFA6]/50",
  },
  {
    number: "02",
    title: "Communities",
    body: "Create or join communities built around shared interests, organizations and common goals. Share updates and participate with like-minded people.",
    tag: "Interest/Organization - based Networks",
    badge: "bg-[#A9E0F1]/40 border-[#A9E0F1]",
    tagClass: "bg-[#A9E0F1]/25 border-[#A9E0F1]/50",
  },
  {
    number: "03",
    title: "Rooms",
    body: "Take part in focused conversations within communities. Join structured discussion spaces around specific topics and shared interests.",
    tag: "Focused Topic Threads",
    badge: "bg-[#204654]/10 border-[#204654]/20",
    tagClass: "bg-[#204654]/10 border-[#204654]/20",
  },
  {
    number: "04",
    title: "Connections",
    body: "Follow people, build mutual friendships and stay connected. Share personal moments with friends and selected circles.",
    tag: "Curated Circles & Following",
    badge: "bg-[#CAFFA6]/30 border-[#CAFFA6]",
    tagClass: "bg-[#CAFFA6]/25 border-[#CAFFA6]/50",
  },
  {
    number: "05",
    title: "Discovery",
    body: "Explore people, posts and communities beyond your existing network. Find new interests and discover conversations worth participating in.",
    tag: "Global Feed & Topics",
    badge: "bg-[#A9E0F1]/40 border-[#A9E0F1]",
    tagClass: "bg-[#A9E0F1]/25 border-[#A9E0F1]/50",
  },
  {
    number: "06",
    title: "Chat",
    body: "Connect privately with your friends through direct messaging. Keep conversations and personal interactions in one dedicated space.",
    tag: "Private Direct Messaging",
    badge: "bg-[#204654]/10 border-[#204654]/20",
    tagClass: "bg-[#204654]/10 border-[#204654]/20",
  },
];

function AppleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.85.94-2.93-.91.04-2.02.61-2.67 1.37-.58.67-1.09 1.77-.95 2.83 1.02.08 2.05-.5 2.68-1.27z" />
    </svg>
  );
}

function PlayIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M3.609 1.813L13.793 12 3.61 22.188c-.378-.403-.61-.963-.61-1.605V3.418c0-.642.232-1.202.61-1.605z" />
      <path fill="#34A853" d="M17.228 8.566l-3.435 3.434 3.435 3.434 3.882-2.203c.71-.403.71-1.062 0-1.465l-3.882-3.2z" />
      <path fill="#FBBC04" d="M3.609 1.813c.273-.292.687-.413 1.155-.147l12.464 7.07-3.435 3.264-10.184-10.187z" />
      <path fill="#EA4335" d="M13.793 12l3.435 3.264L4.764 22.334c-.468.266-.882.145-1.155-.146L13.793 12z" />
    </svg>
  );
}

export default function DownloadView() {
  return (
    <main className="mx-auto w-full max-w-[1536px] px-6 py-16 font-jakarta sm:px-12 sm:py-24 md:px-20 lg:px-32">
      <section className="mx-auto flex max-w-[1280px] flex-col items-center text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#CAFFA6] px-3 py-1 text-[12px] font-semibold uppercase tracking-wider text-[#204654]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#204654]" />
          <span>Download Pintree App</span>
        </div>
        <h1 className="font-aeonik-regular w-full text-2xl font-normal tracking-tight text-[#202020] sm:text-3xl md:text-[44px] md:leading-[1.15] lg:whitespace-nowrap lg:text-[48px]">
          People . Communities . Discovery
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base font-normal leading-relaxed text-[#525252] sm:text-[17px]">
          A space for meaningful connections, shared interests and conversations. Get Pintree on your phone and discover a different social experience.
        </p>
        <div className="mx-auto mt-10 flex w-full max-w-md flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#download-ios"
            className="group flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-black px-4 text-white shadow-sm transition-all duration-200 hover:bg-neutral-800 hover:shadow active:scale-[0.99] sm:w-[210px]"
          >
            <AppleIcon className="h-6 w-6 shrink-0 fill-current text-white transition-transform group-hover:scale-105" />
            <span className="text-left leading-none">
              <span className="block text-[10px] font-medium uppercase tracking-wider text-neutral-300">Download on the</span>
              <span className="mt-0.5 block text-sm font-semibold tracking-tight text-white">App Store</span>
            </span>
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.mcabee.pintree&pcampaignid=web_share"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-black px-4 text-white shadow-sm transition-all duration-200 hover:bg-neutral-800 hover:shadow active:scale-[0.99] sm:w-[210px]"
          >
            <PlayIcon className="h-6 w-6 shrink-0 transition-transform group-hover:scale-105" />
            <span className="text-left leading-none">
              <span className="block text-[10px] font-medium uppercase tracking-wider text-neutral-300">Get it on</span>
              <span className="mt-0.5 block text-sm font-semibold tracking-tight text-white">Google Play</span>
            </span>
          </a>
        </div>
        <div className="mx-auto mt-12 w-full max-w-2xl border-t border-[#E5E5E5] pt-10">
          <div className="grid grid-cols-1 items-stretch justify-center gap-6 sm:grid-cols-2">
            <div className="flex flex-col items-center justify-between rounded-2xl border border-[#E5E5E5] bg-[#F7F7F7] p-6 text-center transition-colors hover:border-[#CAFFA6] sm:p-7">
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[#CAFFA6] bg-[#CAFFA6]/30 px-3 py-1 text-[11px] font-medium text-[#204654]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#204654]" />
                <span>Google Play</span>
                <span className="text-[#204654]/40">•</span>
                <span>Android</span>
              </div>
              <div className="flex h-36 w-36 items-center justify-center rounded-xl border border-[#E5E5E5] bg-white p-3">
                <img src={PLAY_QR} alt="Google Play QR Code" className="h-full w-full object-contain" />
              </div>
              <p className="mt-4 text-xs font-medium text-[#666666] sm:text-[13px]">Scan to download on Android.</p>
            </div>
            <div className="flex flex-col items-center justify-between rounded-2xl border border-[#E5E5E5] bg-[#F7F7F7] p-6 text-center transition-colors hover:border-[#A9E0F1] sm:p-7">
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[#A9E0F1] bg-[#A9E0F1]/30 px-3 py-1 text-[11px] font-medium text-[#204654]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#204654]" />
                <span>App Store</span>
                <span className="text-[#204654]/40">•</span>
                <span>iOS</span>
              </div>
              <div className="flex h-36 w-36 items-center justify-center rounded-xl border border-[#E5E5E5] bg-white p-3">
                <img src={APP_STORE_QR} alt="App Store Download QR Code" className="h-full w-full object-contain p-1.5" />
              </div>
              <p className="mt-4 text-xs font-medium text-[#666666] sm:text-[13px]">Scan to download on iPhone.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-[1280px] border-t border-[#E5E5E5] pt-16">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex flex-col items-center gap-2 text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#CAFFA6] bg-[#CAFFA6]/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#204654]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#204654]" />
              <span>Verified Ratings</span>
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#666666]">Store Ratings</span>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col justify-between rounded-2xl border border-[#E5E5E5] bg-[#F7F7F7] p-6 transition-all hover:border-[#204654]/30 sm:p-7">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E5E5E5] bg-white">
                    <PlayIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-aeonik-regular text-base font-medium text-[#202020]">Google Play</h3>
                    <span className="text-xs font-normal text-[#777777]">Available on Android</span>
                  </div>
                </div>
                <span className="rounded-full border border-[#CAFFA6] bg-[#CAFFA6]/30 px-2.5 py-0.5 text-[11px] font-medium text-[#204654]">Official</span>
              </div>
              <div className="mt-6 flex items-baseline justify-between border-t border-[#E5E5E5]/80 pt-5">
                <div>
                  <div className="flex items-center gap-1.5 text-2xl font-semibold tracking-tight text-[#204654]">
                    <span className="text-xl text-amber-500">★</span>
                    <span>4.4</span>
                    <span className="text-sm font-normal text-[#777777]">/ 5</span>
                  </div>
                  <span className="mt-1 block text-xs text-[#666666]">Based on user ratings</span>
                </div>
                <span className="inline-block rounded-md bg-[#204654]/10 px-2.5 py-1 text-[11px] font-medium text-[#204654]">Verified Reviews</span>
              </div>
            </div>
            <div className="flex flex-col justify-between rounded-2xl border border-[#E5E5E5] bg-[#F7F7F7] p-6 transition-all hover:border-[#204654]/30 sm:p-7">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E5E5E5] bg-white">
                    <AppleIcon className="h-5 w-5 fill-current text-[#202020]" />
                  </div>
                  <div>
                    <h3 className="font-aeonik-regular text-base font-medium text-[#202020]">App Store</h3>
                    <span className="text-xs font-normal text-[#777777]">Available on iOS</span>
                  </div>
                </div>
                <span className="rounded-full border border-[#A9E0F1] bg-[#A9E0F1]/30 px-2.5 py-0.5 text-[11px] font-medium text-[#204654]">Official</span>
              </div>
              <div className="mt-6 flex items-baseline justify-between border-t border-[#E5E5E5]/80 pt-5">
                <div>
                  <div className="flex items-center gap-1.5 text-2xl font-semibold tracking-tight text-[#204654]">
                    <span className="text-xl text-amber-500">★</span>
                    <span>4.2</span>
                    <span className="text-sm font-normal text-[#777777]">/ 5</span>
                  </div>
                  <span className="mt-1 block text-xs text-[#666666]">Based on user ratings</span>
                </div>
                <span className="inline-block rounded-md bg-[#204654]/10 px-2.5 py-1 text-[11px] font-medium text-[#204654]">Verified Reviews</span>
              </div>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-[#777777]">
            Store ratings are updated periodically from live App Store and Google Play submissions.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-[1280px] border-t border-[#E5E5E5] pt-20">
        <div className="max-w-2xl">
          <div className="mb-3 flex flex-col items-start gap-2 sm:flex-row sm:items-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#A9E0F1] bg-[#A9E0F1]/40 px-3 py-1 text-[12px] font-semibold uppercase tracking-wider text-[#204654]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#204654]" />
              <span>Core Capabilities</span>
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#666666]">Platform Overview</span>
          </div>
          <h2 className="font-aeonik-regular text-2xl font-normal tracking-tight text-[#202020] sm:text-3xl md:text-4xl">
            Everything you need to connect.
          </h2>
          <p className="mt-3 text-base font-normal leading-relaxed text-[#525252]">
            Pintree brings people, communities and conversations together through a set of connected social experiences.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.number}
              className="flex h-full flex-col justify-between rounded-2xl border border-[#E5E5E5] bg-[#F7F7F7] p-7 transition-all hover:border-[#204654]/30 sm:p-8"
            >
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <span className={`rounded-full border px-2.5 py-0.5 font-mono text-xs font-medium uppercase tracking-widest text-[#204654] ${feature.badge}`}>
                    {feature.number}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#204654]" />
                </div>
                <h3 className="font-aeonik-regular mb-3 text-xl font-normal tracking-tight text-[#202020]">{feature.title}</h3>
                <p className="text-[15px] font-normal leading-relaxed text-[#525252]">{feature.body}</p>
              </div>
              <div className="mt-6 flex items-center border-t border-[#E5E5E5]/60 pt-4 text-xs font-medium text-[#204654]">
                <span className={`rounded border px-2 py-0.5 ${feature.tagClass}`}>{feature.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      <div className="mt-20" />
    </main>
  );
}
