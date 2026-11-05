import Footer from "@/components/Footer";
import Section1 from "@/components/about/Section1";

export const metadata = {
  title: "Sign Up",
  description: "Create your Pintree account.",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-[#CAFFA6] selection:text-[#202020]">
      <Section1 variant="page" />
      <Footer />
    </div>
  );
}
