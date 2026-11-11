import Footer from "@/components/Footer";
import ContactSupportView from "./ContactSupportView";

export const metadata = {
  title: "Pintree — Submit a Support Request",
  description: "Submit a support request to the Pintree support team.",
};

export default function ContactSupportPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-white text-[#1b1c1c] selection:bg-[#c2e8fa] selection:text-[#001f29]">
      <ContactSupportView />
      <Footer />
    </div>
  );
}
