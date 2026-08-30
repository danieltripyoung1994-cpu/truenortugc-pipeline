import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "HeyGen API key not configured." }, { status: 500 });
  }
  try {
    const res = await fetch("https://api.heygen.com/v2/avatars", {
      headers: { "X-Api-Key": apiKey },
    });
    if (!res.ok) {
      return NextResponse.json({ error: `HeyGen API error (${res.status})` }, { status: res.status });
    }
    const data = await res.json();
    const avatars = (data.data?.avatars || []).map((a: any) => ({
      avatar_id: a.avatar_id,
      avatar_name: a.avatar_name || a.avatar_id,
      preview_image_url: a.preview_image_url || null,
      gender: a.gender || "unknown",
    }));
    return NextResponse.json({ avatars });
  } catch (error) {
    console.error("Failed to fetch avatars:", error);
    return NextResponse.json({ error: "Failed to fetch avatars." }, { status: 500 });
  }
}
