import Footer from "@/components/Footer";
import NewsroomView from "./NewsroomView";

export const metadata = {
  title: "Newsroom | Pintree",
  description:
    "The latest news, announcements, stories and updates from Pintree.",
};

export default function NewsroomPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-[#CAFFA6] selection:text-[#202020]">
      <NewsroomView />
      <Footer />
    </div>
  );
}
