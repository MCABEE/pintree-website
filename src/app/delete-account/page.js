"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PublicDeleteAccountPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // If already logged in, redirect directly to the account deletion page
  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("pintree_access_token");
    if (token) {
      setIsAuthenticated(true);
      router.replace("/account/delete");
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-white text-[#131313] font-jakarta antialiased flex flex-col justify-between selection:bg-[#bdf19a] selection:text-[#131313]">
      {/* Main Canvas: Centered 1280px envelope with editorial poise */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12 py-12 md:py-16">
        {/* Focused Flow Container: max-w-[620px] centered */}
        <div className="max-w-[620px] mx-auto">
          {/* Breadcrumb indicator */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 mb-8 text-[#666666] text-[11px] uppercase tracking-wider font-bold"
          >
            <Link className="hover:text-[#131313] transition-colors" href="/support">
              Support
            </Link>
            <span className="text-[#e3e3e3]">/</span>
            <Link className="hover:text-[#131313] transition-colors" href="/support">
              Account &amp; Security
            </Link>
            <span className="text-[#e3e3e3]">/</span>
            <span className="text-[#131313] font-bold">Deletion</span>
          </nav>

          {/* 1. Intro Section */}
          <section className="text-center md:text-left mb-10">
            {/* Shield / User-Minus Badge with refined deletion color palette */}
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#FFF5F5] border border-[#F0CCCC] text-[#B42318] mb-6 shadow-sm">
              <svg
                className="w-6 h-6 text-[#B42318]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM16 11h6"
                />
              </svg>
            </div>
            <h1
              className="font-playfair font-normal tracking-tight text-[#131313] text-[36px] md:text-[42px] leading-[1.15] mb-3"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              Delete your Pintree account
            </h1>
            <p className="text-[17px] md:text-[18px] leading-[28px] text-[#666666] font-normal leading-relaxed">
              You can request permanent deletion of your Pintree account through our website or mobile app.
            </p>
          </section>

          {/* 2. Primary Action Card */}
          <div className="rounded-2xl border border-[#E3E3E3] p-6 bg-white shadow-sm mb-6">
            <Link
              href={isAuthenticated ? "/account/delete" : "/login?action=delete_account"}
              className="bg-[#131313] hover:bg-neutral-800 text-white font-medium py-3.5 px-6 rounded-full flex items-center justify-center gap-2 transition-all w-full text-[15px] active:scale-[0.98]"
            >
              <span>{isAuthenticated ? "Continue to delete your account" : "Log in to delete your account"}</span>
              <svg
                className="w-4.5 h-4.5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            <div className="text-[13px] text-[#666666] flex items-center justify-center gap-1.5 mt-3">
              <svg
                className="w-4 h-4 text-[#747878]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span>You&apos;ll verify your identity before confirming deletion.</span>
            </div>

            <Link
              href={isAuthenticated ? "/account" : "/account/delete"}
              className="text-[13px] text-[#666666] hover:text-[#131313] font-medium transition-colors text-center block mt-2.5 underline-offset-2 hover:underline"
            >
              {isAuthenticated ? "Back to account overview" : "Already signed in? Continue to your account"}
            </Link>
          </div>

          {/* 3. How account deletion works */}
          <section className="bg-white border border-[#E3E3E3] rounded-2xl p-6 md:p-8 mb-10 shadow-[0_4px_24px_-4px_rgba(19,19,19,0.04)]">
            <div className="flex items-center justify-between mb-6">
              <h2
                className="font-playfair font-normal text-[26px] md:text-[28px] text-[#131313]"
                style={{ fontFamily: '"Playfair Display", serif' }}
              >
                How account deletion works
              </h2>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#FFF5F5] text-[#B42318] border border-[#F0CCCC]">
                3 Simple Steps
              </span>
            </div>

            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex items-start gap-4 p-5 md:p-6 rounded-xl border border-[#E3E3E3] bg-white transition-colors hover:border-neutral-400 hover:bg-[#FAFAFA]">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FFF5F5] text-[#B42318] border border-[#F0CCCC] flex items-center justify-center text-[13px] font-semibold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-[#131313] text-[16px] md:text-[17px] mb-1">
                    Log in to your account
                  </h3>
                  <p className="text-[#666666] text-[14px] leading-relaxed">
                    Sign in using your registered login method.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-4 p-5 md:p-6 rounded-xl border border-[#E3E3E3] bg-white transition-colors hover:border-neutral-400 hover:bg-[#FAFAFA]">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FFF5F5] text-[#B42318] border border-[#F0CCCC] flex items-center justify-center text-[13px] font-semibold">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-[#131313] text-[16px] md:text-[17px] mb-1">
                    Verify your identity
                  </h3>
                  <p className="text-[#666666] text-[14px] leading-relaxed">
                    Verify that you own the account using an available method, such as email OTP, SMS OTP or supported Google reauthentication.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-4 p-5 md:p-6 rounded-xl border border-[#E3E3E3] bg-white transition-colors hover:border-neutral-400 hover:bg-[#FAFAFA]">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FFF5F5] text-[#B42318] border border-[#F0CCCC] flex items-center justify-center text-[13px] font-semibold">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-[#131313] text-[16px] md:text-[17px] mb-1">
                    Confirm account deletion
                  </h3>
                  <p className="text-[#666666] text-[14px] leading-relaxed">
                    Review what will be deleted and confirm your request. Your account and associated data will be handled according to our account-deletion policy.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Mobile App Alternative */}
          <section className="mb-12">
            <div className="rounded-2xl border border-[#E3E3E3] bg-[#f8f8f8] p-6 transition-all hover:shadow-[0_8px_30px_-4px_rgba(19,19,19,0.04)]">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white border border-[#E3E3E3] flex items-center justify-center text-[#131313] flex-shrink-0 mt-0.5">
                  <svg
                    className="w-5 h-5 text-[#131313]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.75"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-[15px] font-semibold text-[#131313] mb-1">
                    Prefer using the mobile app?
                  </h3>
                  <p className="text-[14px] text-[#666666] mb-3 leading-relaxed">
                    You can also request account deletion directly from the Pintree app through your account settings.
                  </p>
                  {/* Subtle badge / breadcrumb path */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#E3E3E3] text-[12px] text-[#131313]">
                    <svg
                      className="w-4 h-4 text-[#747878]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                      />
                    </svg>
                    <span>
                      Open Pintree and go to <strong>Account Center → Delete account</strong>.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 5. Reassurance & Support Link */}
          <section className="border-t border-[#E3E3E3] pt-8 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[14px] leading-[20px] text-[#666666]">
              <svg
                className="w-4.5 h-4.5 text-[#747878] flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                Need help?{" "}
                <Link
                  className="text-[#131313] font-semibold underline underline-offset-2 hover:text-neutral-700 transition-colors"
                  href="/support"
                >
                  Contact Pintree Support
                </Link>
                .
              </span>
            </div>
          </section>
        </div>
      </main>

      {/* Footer matching standard design */}
      <footer className="z-30 w-full shrink-0 border-t border-neutral-100 bg-[#f8f8f8] py-8 mt-auto font-jakarta">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 text-center text-[13px] text-[#666666]">
          <span>© 2025 Pintree</span>
          <span className="text-neutral-300">·</span>
          <Link className="transition-colors hover:text-neutral-900 hover:underline" href="/terms-of-service">
            Terms of Use
          </Link>
          <span className="text-neutral-300">·</span>
          <Link className="transition-colors hover:text-neutral-900 hover:underline" href="/privacy-policy">
            Privacy Policy
          </Link>
          <span className="text-neutral-300">·</span>
          <Link className="transition-colors hover:text-neutral-900 hover:underline" href="/community-guidlines">
            Community Guidelines
          </Link>
          <span className="text-neutral-300">·</span>
          <Link className="transition-colors hover:text-neutral-900 hover:underline" href="/contact">
            Report a problem
          </Link>
        </div>
      </footer>
    </div>
  );
}
