-- The Villa Algorithm — Beat the Oracle schema.
-- Run this once in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query).

create table if not exists picks (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  round       int  not null default 1,         -- which voting round this pick belongs to
  islander_id text not null,                   -- who the fan thinks gets dumped next
  voter       text not null,                   -- anonymous per-browser id
  unique (voter, round)                        -- one pick per browser per round (changeable)
);

-- The server reaches this table with the service_role key, which bypasses Row
-- Level Security, so no policies are required for this app. RLS stays on by
-- default, which means the anon/public key cannot read or write directly.
alter table picks enable row level security;
