"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DeleteAccountGatePage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("pintree_access_token");
    if (token) {
      router.replace("/account/delete");
      return;
    }

    router.replace("/login?action=delete_account");
  }, [router]);

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-white text-[#666666] text-sm">
      <span className="flex items-center gap-2">
        <svg className="h-4 w-4 animate-spin text-[#131313]" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span>Loading...</span>
      </span>
    </div>
  );
}
