import { NextResponse } from "next/server";
import { USER_API_BASE } from "@/config/api";

export async function POST(request) {
  try {
    const body = await request.json();

    const backendRes = await fetch(
      `${USER_API_BASE}/auth/web/validating-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await backendRes.json().catch(() => null);

    const response = NextResponse.json(data, {
      status: backendRes.status,
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    };

    let refreshFromHeader = null;
    const setCookieHeaders = backendRes.headers.getSetCookie
      ? backendRes.headers.getSetCookie()
      : [backendRes.headers.get("set-cookie")].filter(Boolean);

    for (const cookieStr of setCookieHeaders) {
      const match = cookieStr.match(/refreshToken=([^;]+)/);
      if (match) {
        refreshFromHeader = match[1];
        break;
      }
    }

    // Prefer Set-Cookie from backend; fall back to refreshToken in JSON body
    const refreshToken = refreshFromHeader || data?.data?.refreshToken;
    if (refreshToken) {
      response.cookies.set("refreshToken", refreshToken, cookieOptions);
    }

    return response;
  } catch (error) {
    console.error("API proxy validating-otp error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to connect to authentication server" },
      { status: 502 }
    );
  }
}
