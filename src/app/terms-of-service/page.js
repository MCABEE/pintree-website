import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import TermsOfServiceContent from "@/components/TermsOfServiceContent";

const COLUMN = "mx-auto w-full max-w-[440px] px-5 sm:px-6";

export const metadata = {
  title: "Terms of Service | Pintree",
  description:
    "Guidelines that define your rights, responsibilities, and safe usage of Pintree's platform and community features.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        <section className={COLUMN}>
          <h1 className="pt-[56px] sm:pt-[64px] text-center text-[28px] leading-[1.12] font-aeonik-medium text-[#1A1A1A] tracking-[-0.02em] pb-[14px]">
          Terms of Service
          </h1>
          <p className="text-center text-[12px] leading-[1.45] font-aeonik-regular text-[#4B5563]">
            Guidelines that define your rights, responsibilities, and safe usage
            of Pintree&apos;s platform and community features.
          </p>
        </section>

        <TermsOfServiceContent />
      </main>

      <Footer />
    </div>
  );
}
