import islanders from "@/data/islanders.json";
import { guardRequest } from "@/lib/apiGuard";
import { getSupabase } from "@/lib/supabase";
import type { Islander } from "@/lib/types";

// Beat the Oracle. Teaches a real DATABASE: fans submit a pick for who gets
// dumped next, stored in Supabase, and everyone sees the live tally against
// the Oracle's own pick.

const ACTIVE_ROUND = 1;
const cast = islanders as Islander[];

// The Oracle's pick is the participating islander with the highest dumping risk.
function oraclePick() {
  const participating = cast.filter((i) => i.status === "participating" && i.riskScore !== null);
  if (participating.length === 0) return null;
  const top = participating.reduce((a, b) => ((b.riskScore ?? 0) > (a.riskScore ?? 0) ? b : a));
  return { id: top.id, name: top.name, riskScore: top.riskScore };
}

export async function POST(request: Request) {
  const guard = await guardRequest(request, { requireToken: true });
  if (!guard.ok) return guard.response;

  const supabase = getSupabase();
  if (!supabase) {
    return Response.json(
      { error: "Voting is offline. The database is not configured yet." },
      { status: 503 }
    );
  }

  let body: { islanderId?: string; voter?: string };
  try {
    body = guard.bodyText ? JSON.parse(guard.bodyText) : {};
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { islanderId, voter } = body;

  // Submitting a pick (optional — an empty body just reads the current results).
  if (islanderId) {
    const valid = cast.find((i) => i.id === islanderId && i.status === "participating");
    if (!valid) {
      return Response.json({ error: "That islander is not in the running." }, { status: 400 });
    }
    if (!voter) {
      return Response.json({ error: "Missing voter id." }, { status: 400 });
    }
    const { error } = await supabase
      .from("picks")
      .upsert({ round: ACTIVE_ROUND, islander_id: islanderId, voter }, { onConflict: "voter,round" });
    if (error) {
      console.error("Beat the Oracle write error:", error);
      return Response.json({ error: "Could not save your pick." }, { status: 502 });
    }
  }

  // Read the current tally for this round.
  const { data: rows, error: readError } = await supabase
    .from("picks")
    .select("islander_id, voter")
    .eq("round", ACTIVE_ROUND);
  if (readError) {
    console.error("Beat the Oracle read error:", readError);
    return Response.json({ error: "Could not load the results." }, { status: 502 });
  }

  const counts = new Map<string, number>();
  for (const r of rows ?? []) counts.set(r.islander_id, (counts.get(r.islander_id) ?? 0) + 1);
  const total = rows?.length ?? 0;

  const nameById = new Map(cast.map((i) => [i.id, i.name]));
  const results = [...counts.entries()]
    .map(([id, count]) => ({
      id,
      name: nameById.get(id) ?? id,
      count,
      pct: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const yourPick = voter ? rows?.find((r) => r.voter === voter)?.islander_id ?? null : null;

  return Response.json({ oraclePick: oraclePick(), results, total, yourPick });
}
