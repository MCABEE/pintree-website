import { NextResponse } from "next/server";
import { PLACES_API_BASE } from "@/config/api";

const VALID_MEDIA_TYPES = new Set([
  "PRINT_MEDIA",
  "BROADCAST_MEDIA_TELEVISION",
  "BROADCAST_MEDIA_RADIO",
  "DIGITAL_ONLINE_MEDIA",
  "NEWS_AGENCY",
  "INDEPENDENT_MEDIA_JOURNALISTS",
  "PODCAST_AUDIO_MEDIA",
]);

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { status: "error", message: "Invalid request payload." },
        { status: 400 }
      );
    }

    const {
      mediaType,
      publicationName,
      contactName,
      designation,
      email,
      phoneNumber,
      subject,
      message,
    } = body;

    // Validate required fields
    if (!mediaType || !VALID_MEDIA_TYPES.has(mediaType)) {
      return NextResponse.json(
        {
          status: "error",
          message: "Please select a valid media type category.",
        },
        { status: 400 }
      );
    }

    if (!publicationName?.trim()) {
      return NextResponse.json(
        { status: "error", message: "Publication / Media name is required." },
        { status: 400 }
      );
    }

    if (!contactName?.trim()) {
      return NextResponse.json(
        { status: "error", message: "Contact person name is required." },
        { status: 400 }
      );
    }

    if (!designation?.trim()) {
      return NextResponse.json(
        { status: "error", message: "Role / Designation is required." },
        { status: 400 }
      );
    }

    if (!email?.trim() || !email.includes("@")) {
      return NextResponse.json(
        { status: "error", message: "A valid email address is required." },
        { status: 400 }
      );
    }

    if (!subject?.trim()) {
      return NextResponse.json(
        { status: "error", message: "Enquiry subject is required." },
        { status: 400 }
      );
    }

    if (!message?.trim()) {
      return NextResponse.json(
        { status: "error", message: "Enquiry message / details are required." },
        { status: 400 }
      );
    }

    const payload = {
      mediaType,
      publicationName: publicationName.trim(),
      contactName: contactName.trim(),
      designation: designation.trim(),
      email: email.trim(),
      phoneNumber: phoneNumber?.trim() || null,
      subject: subject.trim(),
      message: message.trim(),
    };

    const backendRes = await fetch(
      `${PLACES_API_BASE}/support/press-enquiries`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await backendRes.json().catch(() => null);

    if (!backendRes.ok) {
      return NextResponse.json(
        data || {
          status: "error",
          message: "Failed to submit press enquiry to backend service.",
        },
        { status: backendRes.status }
      );
    }

    return NextResponse.json(data, {
      status: backendRes.status || 201,
    });
  } catch (error) {
    console.error("Press enquiry proxy error:", error);
    return NextResponse.json(
      {
        status: "error",
        message:
          "Unable to connect to the media enquiry service. Please try again later.",
      },
      { status: 502 }
    );
  }
}

