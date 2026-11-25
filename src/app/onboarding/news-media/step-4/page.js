import { redirect } from "next/navigation";

export default function Step4RedirectPage() {
  redirect("/onboarding/news-media?step=4");
}
