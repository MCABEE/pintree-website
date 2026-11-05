import Footer from "@/components/Footer";
import FaqView from "./FaqView";

export const metadata = {
  title: "Frequently Asked Questions",
  description:
    "Everything you need to know about Pintree, how it works and how to be part of it.",
};

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-[#CAFFA6] selection:text-[#202020]">
      <FaqView />
      <Footer />
    </div>
  );
}
