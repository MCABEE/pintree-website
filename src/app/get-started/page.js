import AccountTypeSelection from "@/components/onboarding/AccountTypeSelection";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Get Started | Pintree Professional & Public Accounts",
  description:
    "Choose the account type that best represents you or your organisation. Onboarding for news publishers, public figures, creators, licensed professionals, and businesses.",
};

export default function GetStartedPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <AccountTypeSelection />
      <Footer />
    </div>
  );
}
