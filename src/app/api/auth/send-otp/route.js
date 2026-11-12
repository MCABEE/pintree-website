import { NextResponse } from "next/server";
import { USER_API_BASE } from "@/config/api";

export async function POST(request) {
  try {
    const body = await request.json();

    const backendRes = await fetch(
      `${USER_API_BASE}/auth/web/send-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await backendRes.json().catch(() => null);

    return NextResponse.json(data, {
      status: backendRes.status,
    });
  } catch (error) {
    console.error("API proxy send-otp error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to connect to authentication server" },
      { status: 502 }
    );
  }
}
