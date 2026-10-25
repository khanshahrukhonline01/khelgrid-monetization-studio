-- Cache only genuine provider responses for the live sports feed.
-- Provider credentials must remain in Supabase Edge Function secrets.
create table if not exists public.sports_feed_cache (
  sport text primary key check (sport in ('cricket', 'football', 'tennis')),
  payload jsonb not null default '{"matches":[]}'::jsonb,
  source text not null,
  fetched_at timestamptz not null default now(),
  expires_at timestamptz not null,
  updated_at timestamptz not null default now()
);
create index if not exists sports_feed_cache_expires_at_idx
  on public.sports_feed_cache (expires_at);
alter table public.sports_feed_cache enable row level security;
revoke all on table public.sports_feed_cache from anon, authenticated;
grant all on table public.sports_feed_cache to service_role;
comment on table public.sports_feed_cache is
  'Server-only cache of normalized sports data returned by authorized external providers. Never populate with simulated or fabricated match records.';
