import Footer from "@/components/Footer";
import PressMediaView from "./PressMediaView";

export const metadata = {
  title: "Press & Media",
  description:
    "Discover Pintree, explore our story and access official brand resources, product information and media materials.",
};

export default function PressMediaPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-[#CAFFA6] selection:text-[#202020]">
      <PressMediaView />
      <Footer />
    </div>
  );
}
