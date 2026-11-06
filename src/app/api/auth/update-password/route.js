import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const authorization = request.headers.get("authorization");

    const backendRes = await fetch(
      "https://dev.user.pintree.co/v1/auth/web/update-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authorization ? { Authorization: authorization } : {}),
        },
        body: JSON.stringify({ password: body?.password }),
      }
    );

    const data = await backendRes.json().catch(() => null);

    return NextResponse.json(data, {
      status: backendRes.status,
    });
  } catch (error) {
    console.error("API proxy update-password error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to connect to authentication server" },
      { status: 502 }
    );
  }
}
