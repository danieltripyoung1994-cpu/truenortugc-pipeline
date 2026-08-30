import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "edge";

const SYSTEM_PROMPT = `You are a world-class UGC video scriptwriter for TrueNorthUGC. Craft authentic, engaging, conversion-driven scripts for short-form video (TikTok, Reels, Shorts).

Provide:
- A hook (first 3 seconds)
- The body (storytelling, pain points, transformation)
- A call to action
- Suggested on-screen text
- Tone/delivery notes

Keep it conversational and authentic. Format clearly with labeled sections.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
    }
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OpenAI API key not configured." }, { status: 500 });
    }
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      temperature: 0.8,
      max_tokens: 1500,
    });
    const reply = completion.choices[0]?.message?.content || "Could not generate script.";
    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Script generation error:", error);
    const message = error?.status === 401 ? "Invalid OpenAI API key." : "Failed to generate script.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
