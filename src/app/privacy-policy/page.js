import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PrivacyPolicyContent from "@/components/PrivacyPolicyContent";

/** Narrow column — matches target Privacy Policy screenshot (~440px). */
export const PRIVACY_COLUMN =
  "mx-auto w-full max-w-[440px] px-5 sm:px-6";

export const metadata = {
  title: "Privacy Policy | Pintree",
  description:
    "These terms govern your access to and use of Pintree's services, features, content, and community tools.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        <section className={PRIVACY_COLUMN}>
          <h1 className="pt-[56px] sm:pt-[64px] text-center text-[28px] leading-[1.12] font-aeonik-medium text-[#1A1A1A] tracking-[-0.02em] pb-[14px]">
            Privacy Policy
          </h1>
          <p className="text-center text-[12px] leading-[1.45] font-aeonik-regular text-[#4B5563]">
            These terms govern your access to and use of Pintree&apos;s services,
            features, content, and community tools.
          </p>
        </section>

        <PrivacyPolicyContent />
      </main>

      <Footer />
    </div>
  );
}
