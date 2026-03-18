// import Section1 from "@/components/about/Section1";
// import Section2 from "@/components/about/Section2";
// import Section3 from "@/components/about/Section3";
// import Navbar from "@/components/Navbar";
// import Image from "next/image";

// export default function Home() {
//   return (
// <div className="h-screen overflow-y-scroll snap-y snap-mandatory">    {/* <Navbar/> */}
//   <Section1/>
//   <Section2/>
//   <Section3/>
// </div>
//   );
// }

// app/page.jsx or pages/index.jsx (wherever you render)
import Section1 from "@/components/about/Section1";
import Section2 from "@/components/about/Section2";
import Section3 from "@/components/about/Section3";
import Section4 from "@/components/about/Section4";
import Section5 from "@/components/about/Section5";
import Section6 from "@/components/about/Section6";
import Section7 from "@/components/about/Section7";
import Section8 from "@/components/about/Section8";
import Section9 from "@/components/about/Section9";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    // outer snap container — must be scrollable and full height
    <div className="">
      <Navbar />

      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
      <Section6/>
      <Section7/>
      <Section8/>
      <Section9/>
      <Footer/>
    </div>
  );
}
