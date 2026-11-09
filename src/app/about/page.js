import Footer from "@/components/Footer";
import AboutView from "./AboutView";

export const metadata = {
  title: "About",
  description:
    "Pintree brings people together through personal connections, shared interests and meaningful conversations.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-[#202020] antialiased selection:bg-[#CAFFA6] selection:text-[#204654]">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20,400,0,0&display=swap"
      />
      <AboutView />
      <Footer />
    </div>
  );
}

