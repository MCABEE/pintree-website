import Footer from "@/components/Footer";
import DownloadView from "./DownloadView";

export const metadata = {
  title: "Download App",
  description:
    "Get Pintree on your phone and discover a different social experience.",
};

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-[#CAFFA6] selection:text-[#204654]">
      <DownloadView />
      <Footer />
    </div>
  );
}
