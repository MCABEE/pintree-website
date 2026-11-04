import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const authorization = request.headers.get("authorization");

    const headers = {
      "Content-Type": "application/json",
    };
    if (authorization) {
      headers.Authorization = authorization;
    }

    const backendRes = await fetch(
      `https://dev.user.pintree.co/v1/shared/gender?page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}`,
      {
        method: "GET",
        headers,
      }
    );

    const data = await backendRes.json().catch(() => null);

    return NextResponse.json(data, {
      status: backendRes.status,
    });
  } catch (error) {
    console.error("API proxy gender error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch genders" },
      { status: 502 }
    );
  }
}
