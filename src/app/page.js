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
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    // outer snap container — must be scrollable and full height
    <div className="">
      <Navbar/>
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4/>
    </div>
  );
}
