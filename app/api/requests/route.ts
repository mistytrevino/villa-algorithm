import { guardRequest } from "@/lib/apiGuard";
import { getSupabase } from "@/lib/supabase";

// Feature requests from visitors. Stored in Supabase, same pattern as voting.

const MAX_BODY_CHARS = 280;
const LIST_LIMIT = 50;

// Light per-IP submit limit (in-memory, per instance). Reads are not limited.
const SUBMIT_LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000;
const submits = new Map<string, number[]>();

function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (submits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= SUBMIT_LIMIT) {
    submits.set(ip, recent);
    return true;
  }
  recent.push(now);
  submits.set(ip, recent);
  return false;
}

export async function POST(request: Request) {
  const guard = await guardRequest(request, { requireToken: true });
  if (!guard.ok) return guard.response;

  const supabase = getSupabase();
  if (!supabase) {
    return Response.json(
      { error: "The request board is offline. The database is not configured yet." },
      { status: 503 }
    );
  }

  let payload: { body?: string; voter?: string };
  try {
    payload = guard.bodyText ? JSON.parse(guard.bodyText) : {};
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const body = payload.body?.trim();

  // Submitting a request (an empty body just reads the list).
  if (body) {
    if (body.length > MAX_BODY_CHARS) {
      return Response.json(
        { error: "Keep it under 280 characters." },
        { status: 400 }
      );
    }
    if (rateLimited(clientIp(request))) {
      return Response.json(
        { error: "Easy now. A few requests an hour is plenty." },
        { status: 429 }
      );
    }
    const { error } = await supabase
      .from("feature_requests")
      .insert({ body, voter: payload.voter ?? null });
    if (error) {
      console.error("Feature request write error:", error);
      return Response.json({ error: "Could not save your request." }, { status: 502 });
    }
  }

  const { data, error: readError } = await supabase
    .from("feature_requests")
    .select("id, body, created_at")
    .order("created_at", { ascending: false })
    .limit(LIST_LIMIT);
  if (readError) {
    console.error("Feature request read error:", readError);
    return Response.json({ error: "Could not load the board." }, { status: 502 });
  }

  return Response.json({ requests: data ?? [] });
}
