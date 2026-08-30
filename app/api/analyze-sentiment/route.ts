import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "edge";

const SYSTEM_PROMPT = `You are a social media sentiment analyst for TrueNorthUGC. Your job is to analyze video comments and provide actionable insights.

When given a set of comments, provide:

1. **Overall Sentiment Score**: A breakdown showing the percentage of Positive, Negative, and Neutral comments.

2. **Sentiment Summary**: A 2-3 sentence overview of the general audience mood.

3. **Comment-by-Comment Breakdown**: For each comment, label it as \ud83d\udfe2 Positive, \ud83d\udd34 Negative, or \ud83d\udfe1 Neutral with a brief reason.

4. **Key Themes**: Recurring topics, praise points, or complaints.

5. **Actionable Insights**: 2-3 specific recommendations for the content creator based on the sentiment patterns.

Format everything clearly with headers and bullet points. Be specific and data-driven.`;

export async function POST(req: NextRequest) {
  try {
    const { comments } = await req.json();
    if (!comments || typeof comments !== "string" || comments.trim().length === 0) {
      return NextResponse.json({ error: "Comments text is required" }, { status: 400 });
    }
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OpenAI API key not configured." }, { status: 500 });
    }
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Analyze the sentiment of these video comments:\n\n${comments}` },
      ],
      temperature: 0.4,
      max_tokens: 2000,
    });
    const analysis = completion.choices[0]?.message?.content || "Could not analyze.";
    return NextResponse.json({ analysis });
  } catch (error: any) {
    console.error("Sentiment analysis error:", error);
    const message = error?.status === 401 ? "Invalid OpenAI API key." : "Failed to analyze comments.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
