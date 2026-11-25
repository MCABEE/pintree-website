"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ACCOUNT_OPTIONS = [
  {
    id: "news-media",
    title: "News & Media",
    description: "Broadcasters, publishers, and journals",
    badge: "Available Now",
    icon: (
      <svg className="w-5 h-5 stroke-current" fill="none" strokeWidth="1.6" viewBox="0 0 24 24">
        <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "public-figures",
    title: "Public Figures & Celebrities",
    description: "Authors, artists, and leaders",
    badge: "Coming Soon",
    icon: (
      <svg className="w-5 h-5 stroke-current" fill="none" strokeWidth="1.6" viewBox="0 0 24 24">
        <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "creators-influencers",
    title: "Creators & Influencers",
    description: "Digital storytellers, vloggers, and curators",
    badge: "Coming Soon",
    icon: (
      <svg className="w-5 h-5 stroke-current" fill="none" strokeWidth="1.6" viewBox="0 0 24 24">
        <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "licensed-professionals",
    title: "Licensed Professionals",
    description: "Medical, legal, architecture, and finance",
    badge: "Coming Soon",
    icon: (
      <svg className="w-5 h-5 stroke-current" fill="none" strokeWidth="1.6" viewBox="0 0 24 24">
        <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "businesses-brands",
    title: "Businesses & Brands",
    description: "Companies, agencies, and retail studios",
    badge: "Coming Soon",
    icon: (
      <svg className="w-5 h-5 stroke-current" fill="none" strokeWidth="1.6" viewBox="0 0 24 24">
        <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function AccountTypeSelection() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState("news-media");
  const [feedback, setFeedback] = useState(null);

  const handleSelect = (id) => {
    setSelectedId(id);
    setFeedback(null);
  };

  const handleContinue = () => {
    if (!selectedId) return;

    if (selectedId === "news-media") {
      router.push("/onboarding/news-media");
    } else {
      const selected = ACCOUNT_OPTIONS.find((opt) => opt.id === selectedId);
      setFeedback({
        type: "notice",
        message: `${selected?.title} onboarding is opening soon. News & Media onboarding is currently active.`,
      });
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-68px)] bg-white text-[#1b1c1c] font-jakarta flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <main className="w-full max-w-[1360px] mx-auto py-6 sm:py-10">
        <div className="w-full grid grid-cols-1 lg:grid-cols-[55%_45%] gap-8 lg:gap-12 items-center">
          {/* LEFT SECTION: Vector Illustration & Copy */}
          <div className="flex flex-col items-center lg:items-start justify-center w-full max-w-[560px] mx-auto lg:mx-0">
            <div className="w-full flex items-center justify-center">
              <img
                alt="Pintree Professional & Public Communities Illustration"
                className="max-w-[500px] max-h-[350px] w-full h-auto object-contain mx-auto block"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAu0ryiy8ecdTHWKyRCpe86mX-DYywEmoiBjpvwZfnF07cZ2OvRrbQisGjFtQtvcX91Xln8EIsRLVvlRlOLHEfX8EJC-LeWjGYYj3bLpXazslWAQSYgatMVJEYM5V_5XTyVPwFbUvB5qRCPqKeoLQJRawui1SV4HdLLT5BeLDGE1B3882Lplqgx168q6ulU-1coKD7TP_p24OaDZ8KYc9EjplVps2hthim-9fPbbygCpsIeaj4zJWg0"
              />
            </div>

            <div className="mt-6 w-full text-center flex flex-col items-center">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase text-[#666666] mb-2 justify-center">
                <span className="text-[8px] text-[#666666] leading-none">●</span>
                <span>PUBLIC &amp; PROFESSIONAL SPACES</span>
              </div>

              <h2 className="font-aeonik text-[30px] sm:text-[34px] font-semibold text-[#202020] tracking-tight leading-tight mb-2.5">
                Your presence. your space.
              </h2>

              <p className="font-normal text-[14px] leading-relaxed text-[#525252] max-w-[480px] mx-auto">
                Build your identity, connect with people and grow your presence on Pintree. A space for publishers, public figures, creators, professionals and businesses.
              </p>
            </div>
          </div>

          {/* RIGHT SECTION: Account Selection Card */}
          <div className="flex justify-center lg:justify-end w-full items-center">
            <div className="w-full bg-white rounded-2xl border border-[#E5E5E5] p-6 sm:p-8 shadow-sm flex flex-col justify-between max-w-[520px]">
              <div className="w-full max-w-[420px] mx-auto">
                {/* Header */}
                <div className="mb-5 text-left">
                  <h1 className="font-aeonik text-[26px] font-semibold text-[#202020] tracking-tight leading-tight mb-1">
                    Get Started with Pintree
                  </h1>
                  <p className="font-normal text-[13px] text-[#666666] leading-normal">
                    Choose the account type that best represents you or your organisation.
                  </p>
                </div>

                {/* Account Selection Options */}
                <div
                  aria-label="Select Account Type"
                  className="space-y-2.5 mb-5"
                  role="radiogroup"
                >
                  {ACCOUNT_OPTIONS.map((option) => {
                    const isSelected = selectedId === option.id;
                    return (
                      <div
                        key={option.id}
                        role="radio"
                        aria-checked={isSelected}
                        tabIndex={0}
                        onClick={() => handleSelect(option.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleSelect(option.id);
                          }
                        }}
                        className={`group cursor-pointer rounded-xl py-3 px-3.5 flex items-center justify-between transition-all duration-150 select-none min-h-[64px] border ${
                          isSelected
                            ? "border-[#202020] bg-[#F9F9F9] shadow-xs"
                            : "border-[#E5E5E5] hover:border-black/30 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`flex items-center justify-center shrink-0 ${isSelected ? "text-[#000000]" : "text-[#525252]"}`}>
                            {option.icon}
                          </div>
                          <div className="leading-tight min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="block text-[13.5px] font-semibold text-[#202020]">
                                {option.title}
                              </span>
                            </div>
                            <span className="text-[11.5px] font-normal text-[#666666] leading-tight block mt-0.5 truncate">
                              {option.description}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 ml-3">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                              isSelected ? "border-[#202020]" : "border-[#D1D5DB]"
                            }`}
                          >
                            <div
                              className={`w-2 h-2 rounded-full bg-black transition-transform ${
                                isSelected ? "scale-100" : "scale-0"
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Continue CTA Button */}
                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={!selectedId}
                  className={`w-full h-[44px] rounded-lg text-[13px] font-medium flex items-center justify-center transition-all duration-150 shadow-sm ${
                    selectedId
                      ? "bg-[#000000] hover:bg-[#1a1a1a] text-white cursor-pointer active:scale-[0.99]"
                      : "bg-[#F0F0F0] text-[#A0A0A0] cursor-not-allowed"
                  }`}
                >
                  Continue
                </button>

                {/* Feedback Banner */}
                {feedback && (
                  <div className="mt-3 p-2.5 bg-[#F7F7F7] border border-[#E5E5E5] rounded-md text-[12px] text-[#202020] flex items-center justify-between animate-fadeIn">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3f6372]" />
                      {feedback.message}
                    </span>
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-[#f0f0f0] text-center">
                  <p className="text-[12px] text-[#666666]">
                    Already have an account?{" "}
                    <a href="/login" className="text-black font-medium hover:underline">
                      Log in here
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
