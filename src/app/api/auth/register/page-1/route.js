import { NextResponse } from "next/server";
import { USER_API_BASE } from "@/config/api";

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
      `${USER_API_BASE}/auth/web/register/page-1`,
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
