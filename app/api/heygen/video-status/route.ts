import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "HeyGen API key not configured." }, { status: 500 });
  }
  const videoId = req.nextUrl.searchParams.get("video_id");
  if (!videoId) {
    return NextResponse.json({ error: "video_id is required." }, { status: 400 });
  }
  try {
    const res = await fetch(
      `https://api.heygen.com/v1/video_status.get?video_id=${encodeURIComponent(videoId)}`,
      { headers: { "X-Api-Key": apiKey } }
    );
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.message || `HeyGen error (${res.status})` }, { status: res.status });
    }
    const info = data.data || {};
    return NextResponse.json({
      status: info.status,
      video_url: info.video_url || null,
      thumbnail_url: info.thumbnail_url || null,
      duration: info.duration || null,
      error: info.error || null,
    });
  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json({ error: "Failed to check video status." }, { status: 500 });
  }
}
