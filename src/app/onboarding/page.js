import AccountTypeSelection from "@/components/onboarding/AccountTypeSelection";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Account Onboarding | Pintree",
  description: "Get started with professional and public spaces on Pintree.",
};

export default function OnboardingGatewayPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <AccountTypeSelection />
      <Footer />
    </div>
  );
}
