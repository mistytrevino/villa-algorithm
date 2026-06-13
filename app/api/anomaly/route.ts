import Anthropic from "@anthropic-ai/sdk";
import islanders from "@/data/islanders.json";
import episodes from "@/data/episodes.json";
import { guardRequest } from "@/lib/apiGuard";

// Anomaly Engine. Teaches PATTERN DETECTION over structured data.
// Claude reads the whole cast and surfaces non-obvious correlations, returned
// as structured JSON (forced tool use) so the UI can render them as findings.

const SYSTEM_PROMPT = `You are the Anomaly Engine behind The Villa Algorithm, a Love Island USA Season 8 prediction site. You find non-obvious patterns hiding in the cast data that a casual viewer would miss.

Look across every field: age, hometown, occupation, entry day, original vs bombshell, couple status, partner, and risk score. Find surprising correlations and clusters. Examples of the shape of a finding: a hometown cluster, an age pattern among the dumped, an entry-day effect on risk, a coupling structure nobody noticed.

Hard rules:
- Only claim a pattern the data actually supports. Cite the specific islanders or numbers behind it. Never invent data.
- Never negative about an islander as a person. Talk about the pattern, not their worth.
- Present tense. Plain spoken. No em dashes. Use commas or periods.
- Return four to six findings. Each gets a punchy title, a one or two sentence explanation, and a signal strength.

You must respond by calling the record_anomalies tool. Do not write prose.`;

const ANOMALY_TOOL: Anthropic.Tool = {
  name: "record_anomalies",
  description: "Record the patterns and anomalies found in the Season 8 cast data.",
  input_schema: {
    type: "object",
    properties: {
      anomalies: {
        type: "array",
        description: "Four to six non-obvious findings.",
        items: {
          type: "object",
          properties: {
            title: { type: "string", description: "A short punchy headline for the pattern." },
            finding: {
              type: "string",
              description:
                "One or two present tense sentences explaining the pattern, citing the specific data behind it.",
            },
            signal: {
              type: "string",
              enum: ["low", "medium", "high"],
              description: "How strong and surprising the pattern is.",
            },
          },
          required: ["title", "finding", "signal"],
        },
      },
    },
    required: ["anomalies"],
  },
};

type Anomaly = { title: string; finding: string; signal: "low" | "medium" | "high" };

export async function POST(request: Request) {
  const guard = await guardRequest(request, { requireToken: true });
  if (!guard.ok) return guard.response;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === "your_key_here") {
    return Response.json(
      { error: "The Anomaly Engine is offline. Add a real ANTHROPIC_API_KEY to .env.local." },
      { status: 503 }
    );
  }

  const anthropic = new Anthropic({ apiKey });

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1200,
      system: SYSTEM_PROMPT,
      tools: [ANOMALY_TOOL],
      tool_choice: { type: "tool", name: "record_anomalies" },
      messages: [
        {
          role: "user",
          content: `Scan the Season 8 cast and episodes for hidden patterns.\nIslanders: ${JSON.stringify(
            islanders
          )}\nEpisodes: ${JSON.stringify(episodes)}`,
        },
      ],
    });

    const toolUse = response.content.find((block) => block.type === "tool_use");
    if (!toolUse || toolUse.type !== "tool_use") {
      return Response.json({ error: "No structured output returned." }, { status: 502 });
    }

    const anomalies = (toolUse.input as { anomalies: Anomaly[] }).anomalies;
    return Response.json({ anomalies, model: "Sonnet 4.6" });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return Response.json(
        { error: "The Anomaly Engine is resting for the month. Check back soon." },
        { status: 429 }
      );
    }
    console.error("Anomaly Engine API error:", err);
    return Response.json(
      { error: "The Anomaly Engine stalled. Try again in a moment." },
      { status: 502 }
    );
  }
}
