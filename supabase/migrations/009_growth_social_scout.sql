-- Social scout opportunities (Reddit threads, X posts) + daily content drafts

create table if not exists public.growth_social_opportunities (
  id uuid primary key default gen_random_uuid(),
  scout_date date not null default current_date,
  platform text not null check (platform in ('reddit', 'x')),
  source_name text,
  thread_url text not null,
  thread_title text,
  thread_excerpt text,
  draft_response text,
  relevance_score integer default 0,
  status text not null default 'new'
    check (status in ('new', 'used', 'skipped', 'duplicate')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists growth_social_opportunities_url_key
  on public.growth_social_opportunities (thread_url);

create index if not exists growth_social_opportunities_scout_date_idx
  on public.growth_social_opportunities (scout_date desc);

create index if not exists growth_social_opportunities_platform_date_idx
  on public.growth_social_opportunities (platform, scout_date desc);

create table if not exists public.growth_content_drafts (
  id uuid primary key default gen_random_uuid(),
  draft_date date not null,
  platform text not null,
  content_type text not null default 'post',
  behavior_id text,
  behavior_title text,
  hook text,
  body text,
  cta text,
  image_prompts jsonb default '[]'::jsonb,
  video_script text,
  status text not null default 'draft'
    check (status in ('draft', 'approved', 'scheduled', 'posted', 'skipped')),
  source_task_title text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists growth_content_drafts_date_idx
  on public.growth_content_drafts (draft_date desc);

create unique index if not exists growth_content_drafts_date_platform_type_key
  on public.growth_content_drafts (draft_date, platform, content_type);

grant all privileges on table public.growth_social_opportunities to postgres, service_role;
grant all privileges on table public.growth_content_drafts to postgres, service_role;
