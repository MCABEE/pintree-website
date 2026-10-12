import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();

    const backendRes = await fetch("https://dev.user.pintree.co/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json().catch(() => null);

    const response = NextResponse.json(data, {
      status: backendRes.status,
    });

    // Extract refreshToken from backend Set-Cookie header and set it same-origin
    const setCookieHeaders = backendRes.headers.getSetCookie
      ? backendRes.headers.getSetCookie()
      : [backendRes.headers.get("set-cookie")].filter(Boolean);

    for (const cookieStr of setCookieHeaders) {
      const match = cookieStr.match(/refreshToken=([^;]+)/);
      if (match) {
        const token = match[1];
        response.cookies.set("refreshToken", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 7 * 24 * 60 * 60, // 7 days
        });
        break;
      }
    }

    return response;
  } catch (error) {
    console.error("API proxy login error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to connect to authentication server" },
      { status: 502 }
    );
  }
}
