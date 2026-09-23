import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import CommunityGuidelinesContent from "@/components/CommunityGuidelinesContent";

const COLUMN = "mx-auto w-full max-w-[830px]";

export const metadata = {
  title: "Community Guidelines | Pintree",
  description:
    "Our principles for respectful conversations, responsible sharing, and a trusted community space.",
};

export default function CommunityGuidelinesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        <section className={`${COLUMN} px-6 sm:px-8`}>
          <h1 className="pt-[72px] sm:pt-[80px] text-center text-[32px] sm:text-[40px] lg:text-[48px] leading-[1.12] font-aeonik-medium text-[#1A1A1A] tracking-[-0.02em] pb-[20px]">
            Community Guidelines
          </h1>
          <p className="mx-auto max-w-[640px] text-center text-[16px] sm:text-[18px] lg:text-[20px] leading-[1.5] font-aeonik-regular text-[#4B5563]">
            Our principles for respectful conversations, responsible sharing, and
            a trusted community space.
          </p>
        </section>

        <CommunityGuidelinesContent />
      </main>

      <Footer />
    </div>
  );
}
