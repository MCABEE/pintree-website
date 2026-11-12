import { NextResponse } from "next/server";
import { PLACES_API_BASE } from "@/config/api";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "100";
    const search = searchParams.get("search");

    const params = new URLSearchParams({ page, limit });
    if (search) params.set("search", search);

    const backendRes = await fetch(
      `${PLACES_API_BASE}/country?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await backendRes.json().catch(() => null);

    return NextResponse.json(data, {
      status: backendRes.status,
    });
  } catch (error) {
    console.error("API proxy countries error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch countries" },
      { status: 502 }
    );
  }
}
