-- Run in Supabase SQL editor or via CLI
create table if not exists public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  email text not null,
  parent_type text not null,
  source text not null default 'landing_page',
  created_at timestamptz not null default now()
);

create unique index if not exists waitlist_signups_email_key on public.waitlist_signups (lower(email));

alter table public.waitlist_signups enable row level security;

-- No public policies: inserts go through the Next.js API using the service role key.
