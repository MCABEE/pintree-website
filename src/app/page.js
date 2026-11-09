import Section1 from "@/components/about/Section1";
import Section2 from "@/components/about/Section2";
import Section4 from "@/components/about/Section4";
import Section8 from "@/components/about/Section8";
import Section9 from "@/components/about/Section9";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Pintree",
  description:
    "Pintree — a social platform for meaningful connections, communities, and discovery.",
};

export default function Home() {
  return (
    <div className="">
      <Section1 />
      <Section2 />
      <Section4 />
      <Section8 />
      <Section9 />
      <Footer />
    </div>
  );
}
