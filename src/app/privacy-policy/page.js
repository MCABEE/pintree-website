import Footer from "@/components/Footer";
import PrivacyPolicyContent from "@/components/PrivacyPolicyContent";
import { LEGAL_PAGE_COLUMN } from "@/components/legalDocumentIntro";

export const PRIVACY_COLUMN = LEGAL_PAGE_COLUMN;

export const metadata = {
  title: "Privacy Policy | Pintree",
  description:
    "These terms govern your access to and use of Pintree's services, features, content, and community tools.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <section className={LEGAL_PAGE_COLUMN}>
          <h1 className="pt-[92px] sm:pt-[104px] text-center text-[28px] leading-[1.12] font-aeonik-medium text-[#1A1A1A] tracking-[-0.02em] pb-5 sm:pb-6">
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
