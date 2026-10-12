import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // 1. Get refreshToken from cookie (or body fallback if present)
    let refreshToken = request.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      try {
        const body = await request.json().catch(() => null);
        if (body?.refreshToken) {
          refreshToken = body.refreshToken;
        }
      } catch (e) {
        // body may be empty
      }
    }

    if (!refreshToken) {
      return NextResponse.json(
        {
          status: "error",
          code: 400,
          message: "Refresh token not found",
        },
        { status: 400 }
      );
    }

    // 2. Call Pintree dev auth server with Cookie header
    const backendRes = await fetch("https://dev.user.pintree.co/v1/auth/refresh-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}`,
      },
      body: JSON.stringify({}),
    });

    const data = await backendRes.json().catch(() => null);

    const response = NextResponse.json(data, {
      status: backendRes.status,
    });

    // 3. If backend returned a new refreshToken cookie, update it
    const setCookieHeaders = backendRes.headers.getSetCookie
      ? backendRes.headers.getSetCookie()
      : [backendRes.headers.get("set-cookie")].filter(Boolean);

    for (const cookieStr of setCookieHeaders) {
      const match = cookieStr.match(/refreshToken=([^;]+)/);
      if (match) {
        const newToken = match[1];
        response.cookies.set("refreshToken", newToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 7 * 24 * 60 * 60,
        });
        break;
      }
    }

    return response;
  } catch (error) {
    console.error("API proxy refresh error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to connect to authentication server" },
      { status: 502 }
    );
  }
}
