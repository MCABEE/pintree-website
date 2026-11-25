import { Suspense } from "react";
import NewsMediaOnboardingWizard from "@/components/onboarding/NewsMediaOnboardingWizard";
import Icon from "@/components/onboarding/Icon";
import Footer from "@/components/Footer";

export const metadata = {
  title: "News & Media Account Onboarding | Pintree",
  description:
    "Apply for official verification and certification as a News & Media publisher, broadcaster, or digital journal on Pintree.",
};

export default function NewsMediaOnboardingPage() {
  return (
    <div className="min-h-screen bg-[#fbf9f8] flex flex-col justify-between">
      <Suspense
        fallback={
          <div className="min-h-[500px] flex items-center justify-center">
            <Icon name="progress_activity" className="animate-spin text-[32px] text-secondary" />
          </div>
        }
      >
        <NewsMediaOnboardingWizard />
      </Suspense>
      <Footer />
    </div>
  );
}
