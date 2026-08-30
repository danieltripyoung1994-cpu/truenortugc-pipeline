import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "HeyGen API key not configured." }, { status: 500 });
  }
  try {
    const { script, avatar_id, voice_id } = await req.json();
    if (!script || typeof script !== "string" || script.trim().length === 0) {
      return NextResponse.json({ error: "Script text is required." }, { status: 400 });
    }
    const payload: any = {
      video_inputs: [{
        character: { type: "avatar", avatar_id: avatar_id || "default", avatar_style: "normal" },
        voice: { type: "text", input_text: script.trim(), ...(voice_id ? { voice_id } : {}) },
        background: { type: "color", value: "#FAFAFA" },
      }],
      dimension: { width: 1080, height: 1920 },
      aspect_ratio: "9:16",
      test: false,
    };
    const res = await fetch("https://api.heygen.com/v2/video/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Api-Key": apiKey },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.message || `HeyGen error (${res.status})` }, { status: res.status });
    }
    const videoId = data.data?.video_id;
    if (!videoId) {
      return NextResponse.json({ error: "No video_id returned." }, { status: 500 });
    }
    return NextResponse.json({ video_id: videoId, status: "processing" });
  } catch (error) {
    console.error("Video generation error:", error);
    return NextResponse.json({ error: "Failed to start video generation." }, { status: 500 });
  }
}
