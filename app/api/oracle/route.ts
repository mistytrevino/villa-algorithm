import Anthropic from "@anthropic-ai/sdk";
import islanders from "@/data/islanders.json";
import episodes from "@/data/episodes.json";
import { guardRequest } from "@/lib/apiGuard";

// API calls to Anthropic go through route handlers only, never client side.

const SYSTEM_PROMPT = `You are the Oracle, the AI narrator of The Villa Algorithm. You speak in the voice of Iain Stirling, the beloved Love Island narrator. Dry wit, warm heart, always rooting for everyone even when predicting their doom. You have access to Season 8 data. You make bold predictions and commit to them. You are never negative about individual islanders as people. You speak in short punchy sentences. No bullet points. Maximum 150 words per response.`;

type ChatMessage = { role: "user" | "assistant"; content: string };

// ---- Abuse protection ----

// Layer 2: input validation.
const MAX_MESSAGE_CHARS = 200;

// Layer 1: in-memory IP rate limit, 5 requests per IP per hour.
// Note: this Map lives per server instance, so it resets on cold start and is
// not shared across serverless instances. A production-grade limit would use a
// shared store (e.g. Vercel KV / Upstash). Good enough to blunt casual abuse.
const RATE_LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const ipHits = new Map<string, number[]>();

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

// Records the request and returns true if the IP is over its hourly budget.
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (ipHits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    ipHits.set(ip, recent); // keep the pruned list, do not record this hit
    return true;
  }
  recent.push(now);
  ipHits.set(ip, recent);
  return false;
}

export async function POST(request: Request) {
  // Origin + token + 1kb body cap.
  const guard = await guardRequest(request, { requireToken: true });
  if (!guard.ok) return guard.response;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === "your_key_here") {
    return Response.json(
      { error: "The Oracle is offline. Add a real ANTHROPIC_API_KEY to .env.local to wake it up." },
      { status: 503 }
    );
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = JSON.parse(guard.bodyText);
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

  // Layer 2: input validation. Only user messages are checked, since the
  // Oracle's own replies can legitimately run past 200 characters.
  const tooLong = messages.some(
    (m) =>
      m.role === "user" &&
      typeof m.content === "string" &&
      m.content.length > MAX_MESSAGE_CHARS
  );
  if (tooLong) {
    return Response.json(
      { error: "Keep it short. The Oracle prefers mystery to essays." },
      { status: 400 }
    );
  }

  // Layer 1: IP rate limit, 5 per hour.
  if (isRateLimited(clientIp(request))) {
    return Response.json(
      { error: "The Oracle needs to rest. Come back later." },
      { status: 429 }
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
    // Layer 3: handle Anthropic rate limits (e.g. monthly cap) gracefully.
    // Never expose the raw API error to the frontend.
    if (err instanceof Anthropic.RateLimitError) {
      return Response.json(
        { error: "The Oracle is resting for the month. Check back soon." },
        { status: 429 }
      );
    }
    console.error("Oracle API error:", err);
    return Response.json(
      { error: "The Oracle went quiet. Try again in a moment." },
      { status: 502 }
    );
  }
}
