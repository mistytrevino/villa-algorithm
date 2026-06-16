import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-only Supabase client. Uses the service_role key, so it must NEVER be
// imported into a client component. All DB access goes through /app/api/ routes,
// same rule as the Anthropic key.

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  if (!client) {
    client = createClient(url, key, { auth: { persistSession: false } });
  }
  return client;
}
