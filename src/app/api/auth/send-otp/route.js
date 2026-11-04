import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();

    const backendRes = await fetch(
      "https://dev.user.pintree.co/v1/auth/web/send-otp",
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
