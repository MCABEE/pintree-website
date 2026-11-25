import { redirect } from "next/navigation";

export default function Step3RedirectPage() {
  redirect("/onboarding/news-media?step=3");
}
