import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const authorization = request.headers.get("authorization");

    const headers = {
      "Content-Type": "application/json",
    };
    if (authorization) {
      headers.Authorization = authorization;
    }

    const backendRes = await fetch(
      "https://dev.user.pintree.co/v1/auth/web/register/page-1",
      {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      }
    );

    const data = await backendRes.json().catch(() => null);

    return NextResponse.json(data, {
      status: backendRes.status,
    });
  } catch (error) {
    console.error("API proxy register/page-1 error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to connect to authentication server" },
      { status: 502 }
    );
  }
}
