import Footer from "@/components/Footer";
import HelpCenterView from "./HelpCenterView";

export const metadata = {
  title: "Help Center",
  description:
    "Find answers, explore helpful guides and learn how to make the most of Pintree.",
};

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-[#CAFFA6] selection:text-[#202020]">
      <HelpCenterView />
      <Footer />
    </div>
  );
}
