import Anthropic from "@anthropic-ai/sdk";
import islanders from "@/data/islanders.json";

// Fab 5. Teaches MULTI-MODEL + PARALLEL CALLS.
// One question goes to five different Claude models at the same time.
// Same prompt for all five, so the only variable is the model itself.

// Five distinct capability tiers. Model IDs are exact, do not add date suffixes.
// (Fable 5 is the frontier model but was suspended on 2026-06-12 to comply with a
// US government directive, so this lineup uses the three Opus generations plus
// Sonnet and Haiku. Fable 5 is shown as a suspended tier on the page.)
const MODELS = [
  { id: "claude-haiku-4-5", label: "Haiku 4.5", tier: "Fast and light" },
  { id: "claude-sonnet-4-6", label: "Sonnet 4.6", tier: "Balanced" },
  { id: "claude-opus-4-6", label: "Opus 4.6", tier: "Flagship, gen one" },
  { id: "claude-opus-4-7", label: "Opus 4.7", tier: "Flagship, gen two" },
  { id: "claude-opus-4-8", label: "Opus 4.8", tier: "Flagship, current" },
] as const;

const SYSTEM_PROMPT = `You are an AI analyst for The Villa Algorithm, a Love Island USA Season 8 prediction site. Answer the question with one bold, specific prediction and a short reason. Commit to your call.

Rules:
- Under 100 words. Present tense. Plain spoken.
- Never negative about an islander as a person.
- No bullet points. No em dashes. Use commas or periods.

Current Season 8 cast data (JSON):
${JSON.stringify(islanders)}`;

type Fab5Result = {
  model: string;
  label: string;
  tier: string;
  answer: string | null;
  ok: boolean;
  error?: string;
};

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === "your_key_here") {
    return Response.json(
      { error: "The Fab 5 is offline. Add a real ANTHROPIC_API_KEY to .env.local." },
      { status: 503 }
    );
  }

  let body: { question?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const question = body.question?.trim();
  if (!question) {
    return Response.json({ error: "Ask the Fab 5 something first." }, { status: 400 });
  }

  const anthropic = new Anthropic({ apiKey });

  // Fire all five at once. allSettled so one model failing never sinks the rest.
  const settled = await Promise.allSettled(
    MODELS.map((m) =>
      anthropic.messages.create({
        model: m.id,
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: question }],
      })
    )
  );

  const results: Fab5Result[] = settled.map((outcome, i) => {
    const m = MODELS[i];
    const base = { model: m.id, label: m.label, tier: m.tier };

    if (outcome.status === "rejected") {
      const reason = outcome.reason;
      const msg = reason instanceof Error ? reason.message : "This model did not respond.";
      return { ...base, answer: null, ok: false, error: msg };
    }

    const response = outcome.value;
    // A model can decline (refusal) instead of answering. Check before reading content.
    if (response.stop_reason === "refusal") {
      return { ...base, answer: null, ok: false, error: "This model declined to answer." };
    }

    const text = response.content
      .filter((block) => block.type === "text")
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("")
      .trim();

    if (!text) {
      return { ...base, answer: null, ok: false, error: "This model returned nothing." };
    }
    return { ...base, answer: text, ok: true };
  });

  return Response.json({ question, results });
}
