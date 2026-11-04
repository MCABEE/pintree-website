import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { handleId, userId } = body || {};

    if (!userId || !handleId) {
      return NextResponse.json(
        { status: "error", message: "userId and handleId are required" },
        { status: 400 }
      );
    }

    const authorization = request.headers.get("authorization");
    const headers = {
      "Content-Type": "application/json",
    };
    if (authorization) {
      headers.Authorization = authorization;
    }

    const backendRes = await fetch(
      `https://dev.user.pintree.co/v1/auth/web/register/${encodeURIComponent(userId)}/Page-3`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ handleId }),
      }
    );

    const data = await backendRes.json().catch(() => null);

    return NextResponse.json(data, {
      status: backendRes.status,
    });
  } catch (error) {
    console.error("API proxy register/page-3 error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to connect to authentication server" },
      { status: 502 }
    );
  }
}
