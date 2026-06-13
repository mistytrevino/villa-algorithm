import Anthropic from "@anthropic-ai/sdk";
import { promises as fs } from "fs";
import path from "path";
import type { Islander } from "@/lib/types";
import { guardRequest } from "@/lib/apiGuard";

// Risk Scorer. Teaches STRUCTURED OUTPUTS.
// Instead of letting Claude reply in prose, we hand it a tool with a strict
// schema and force it to call that tool. The result is guaranteed valid JSON
// the leaderboard and risk meters can use directly.

const SYSTEM_PROMPT = `You are the risk engine behind The Villa Algorithm, a Love Island USA Season 8 prediction site. For each participating islander you estimate their dumping risk for the upcoming recoupling, from 0 to 100.

Scoring guidance:
- An islander with no partner is far more exposed at a recoupling. Higher risk.
- A coupled up islander is safer, but not safe. Chemistry and drama still matter.
- Bombshells are wildcards. They often have a grace period but stir things up.

Voice rules for the reasoning:
- One sentence. Present tense. Plain spoken.
- Never negative about the islander as a person. Talk about the situation, not their worth.
- No em dashes. Use commas or periods.

You must respond by calling the record_risk_scores tool. Do not write prose.`;

const RISK_TOOL: Anthropic.Tool = {
  name: "record_risk_scores",
  description:
    "Record the dumping risk score and a one sentence reason for every participating islander.",
  input_schema: {
    type: "object",
    properties: {
      scores: {
        type: "array",
        description: "One entry per participating islander.",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "The islander id, exactly as given." },
            riskScore: {
              type: "integer",
              minimum: 0,
              maximum: 100,
              description: "Dumping risk, 0 safest to 100 most at risk.",
            },
            riskReasoning: {
              type: "string",
              description:
                "One present tense sentence. Never mean about the islander. No em dashes.",
            },
          },
          required: ["id", "riskScore", "riskReasoning"],
        },
      },
    },
    required: ["scores"],
  },
};

type Score = { id: string; riskScore: number; riskReasoning: string };

export async function POST(request: Request) {
  const guard = await guardRequest(request, { requireToken: true });
  if (!guard.ok) return guard.response;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === "your_key_here") {
    return Response.json(
      { error: "The Risk Scorer is offline. Add a real ANTHROPIC_API_KEY to .env.local." },
      { status: 503 }
    );
  }

  const dataPath = path.join(process.cwd(), "data", "islanders.json");

  let islanders: Islander[];
  try {
    islanders = JSON.parse(await fs.readFile(dataPath, "utf8"));
  } catch {
    return Response.json({ error: "Could not read islander data." }, { status: 500 });
  }

  const participating = islanders.filter((i) => i.status === "participating");
  const anthropic = new Anthropic({ apiKey });

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      tools: [RISK_TOOL],
      // Force Claude to answer through the tool. This is the structured output trick.
      tool_choice: { type: "tool", name: "record_risk_scores" },
      messages: [
        {
          role: "user",
          content: `Score every participating islander. Use their id exactly. Here is the cast:\n${JSON.stringify(
            participating
          )}`,
        },
      ],
    });

    const toolUse = response.content.find((block) => block.type === "tool_use");
    if (!toolUse || toolUse.type !== "tool_use") {
      return Response.json({ error: "No structured output returned." }, { status: 502 });
    }

    const scores = (toolUse.input as { scores: Score[] }).scores;
    const byId = new Map(scores.map((s) => [s.id, s]));

    // Merge scores back into the full islander list.
    const updated = islanders.map((islander) => {
      const score = byId.get(islander.id);
      return score
        ? { ...islander, riskScore: score.riskScore, riskReasoning: score.riskReasoning }
        : islander;
    });

    // Persist to the JSON file so the leaderboard updates and scores survive reloads.
    // Best effort: on a read-only host this fails quietly and the scores still return.
    try {
      await fs.writeFile(dataPath, JSON.stringify(updated, null, 2) + "\n", "utf8");
    } catch (writeErr) {
      console.warn("Risk Scorer could not persist to file:", writeErr);
    }

    return Response.json({ islanders: updated, model: "Sonnet 4.6" });
  } catch (err) {
    console.error("Risk Scorer API error:", err);
    return Response.json(
      { error: "The Risk Scorer stalled. Try again in a moment." },
      { status: 502 }
    );
  }
}
