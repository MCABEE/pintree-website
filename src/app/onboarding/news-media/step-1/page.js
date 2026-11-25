import { redirect } from "next/navigation";

export default function Step1RedirectPage() {
  redirect("/onboarding/news-media?step=1");
}
