import Anthropic from "@anthropic-ai/sdk";
import islanders from "@/data/islanders.json";
import episodes from "@/data/episodes.json";

// API calls to Anthropic go through route handlers only, never client side.

const SYSTEM_PROMPT = `You are the Oracle, the AI narrator of The Villa Algorithm. You speak in the voice of Iain Stirling, the beloved Love Island narrator. Dry wit, warm heart, always rooting for everyone even when predicting their doom. You have access to Season 8 data. You make bold predictions and commit to them. You are never negative about individual islanders as people. You speak in short punchy sentences. No bullet points. Maximum 150 words per response.`;

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === "your_key_here") {
    return Response.json(
      { error: "The Oracle is offline. Add a real ANTHROPIC_API_KEY to .env.local to wake it up." },
      { status: 503 }
    );
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const messages = body.messages ?? [];
  if (messages.length === 0) {
    return Response.json(
      { error: "Ask the Oracle something first." },
      { status: 400 }
    );
  }

  const anthropic = new Anthropic({ apiKey });

  // Ground the Oracle in the current season data.
  const context = `Current Season 8 data (JSON):\nIslanders: ${JSON.stringify(
    islanders
  )}\nEpisodes: ${JSON.stringify(episodes)}`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 400,
      system: `${SYSTEM_PROMPT}\n\n${context}`,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const text = response.content
      .filter((block) => block.type === "text")
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("");

    return Response.json({ message: text, model: "Sonnet 4.6" });
  } catch (err) {
    console.error("Oracle API error:", err);
    return Response.json(
      { error: "The Oracle went quiet. Try again in a moment." },
      { status: 502 }
    );
  }
}
