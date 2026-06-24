-- Phrase-level feedback from the app (beta + post-launch)
create table if not exists public.phrase_feedback (
  id uuid primary key default gen_random_uuid(),
  helpful boolean not null,
  comment text,
  card_id text not null,
  behavior_id text not null,
  behavior_name text,
  category_id text,
  category_name text,
  age_band text not null,
  moment_id text not null,
  say_this text not null,
  do_this text,
  helpful_note text,
  page_path text,
  source text not null default 'app',
  created_at timestamptz not null default now()
);

create index if not exists phrase_feedback_created_at_idx
  on public.phrase_feedback (created_at desc);

create index if not exists phrase_feedback_behavior_id_idx
  on public.phrase_feedback (behavior_id);

alter table public.phrase_feedback enable row level security;

grant usage on schema public to postgres, anon, authenticated, service_role;
grant all privileges on table public.phrase_feedback to postgres, anon, authenticated, service_role;
