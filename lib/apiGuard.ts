// Shared request guard for the AI API routes. Three checks:
//   1. Origin allowlist  - request must come from NEXT_PUBLIC_SITE_URL.
//   2. Frontend token     - request must carry the X-Oracle-Token header.
//   3. Body size cap      - reject bodies larger than 1kb.
//
// HONESTY NOTE: these are speed bumps, not a vault.
//   - Origin headers are set by browsers but can be forged by non-browser
//     clients (curl can send any Origin), so the origin check stops other
//     websites and casual direct hits, not a determined attacker.
//   - X-Oracle-Token ships to the browser (it is a NEXT_PUBLIC value), so it is
//     visible in devtools. It stops drive-by requests that do not know the
//     token, not someone who reads one real network request.
//   Real protection is the per-IP rate limit plus, in production, a WAF / bot
//   protection (e.g. Vercel BotID) and, for true gating, user auth.

export const MAX_BODY_BYTES = 1024; // 1kb

type GuardOk = { ok: true; bodyText: string };
type GuardFail = { ok: false; response: Response };

function deny(status: number, error: string): GuardFail {
  return { ok: false, response: Response.json({ error }, { status }) };
}

export async function guardRequest(
  request: Request,
  opts: { requireToken?: boolean } = {}
): Promise<GuardOk | GuardFail> {
  // 1. Origin allowlist. Only enforced when NEXT_PUBLIC_SITE_URL is configured.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    const origin = request.headers.get("origin");
    if (origin !== siteUrl) {
      return deny(403, "This request did not come from the villa.");
    }
  }

  // 2. Shared frontend token.
  if (opts.requireToken) {
    const expected = process.env.ORACLE_SECRET;
    const provided = request.headers.get("x-oracle-token");
    if (!expected || provided !== expected) {
      return deny(403, "This request did not come from the villa.");
    }
  }

  // 3. Body size cap. Read once and hand the text back so routes do not re-read.
  const bodyText = await request.text();
  if (new TextEncoder().encode(bodyText).length > MAX_BODY_BYTES) {
    return deny(413, "That request is too big for the Oracle to hold.");
  }

  return { ok: true, bodyText };
}
