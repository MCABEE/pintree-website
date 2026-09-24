import Footer from "@/components/Footer";
import SupportCareer from "@/components/support/SupportCareer";
import SupportCategories from "@/components/support/SupportCategories";
import SupportSection1 from "@/components/support/SupportSection1";

export const metadata = {
  title: "Support | Pintree",
  description:
    "Questions, support, or something to share? Get help with Pintree — FAQ, help center, press and media, and careers.",
};

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <SupportSection1 />
        <SupportCategories />
        <SupportCareer />
      </main>
      <Footer />
    </div>
  );
}
