import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages, // format: [{ role: "user" | "assistant", content: string }]
    }),
  });

  const data = await response.json();

  return NextResponse.json({
    reply: data.choices?.[0]?.message?.content ?? "No response.",
  });
}
