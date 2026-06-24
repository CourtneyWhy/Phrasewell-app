-- Phrasewell Email Marketing CRM + Content Engine

create table if not exists public.growth_email_segments (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  definition text,
  klaviyo_segment_name text,
  lifecycle_stage text,
  estimated_count integer default 0,
  priority text default 'medium' check (priority in ('high', 'medium', 'low')),
  status text not null default 'active'
    check (status in ('active', 'draft', 'archived')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.growth_email_flows (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  purpose text,
  trigger_description text,
  goal text,
  status text not null default 'not_started'
    check (status in ('not_started', 'in_klaviyo', 'live', 'paused', 'planned')),
  owner text default 'Courtney',
  lifecycle_stage text,
  klaviyo_flow_name text,
  sort_order integer default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.growth_email_flow_emails (
  id uuid primary key default gen_random_uuid(),
  flow_slug text not null,
  step_number integer not null,
  send_timing text,
  subject text,
  preview_text text,
  body_outline text,
  goal text,
  cta text,
  graphic_recommendation text,
  status text not null default 'idea'
    check (status in ('idea', 'drafted', 'in_klaviyo', 'live', 'sent')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists growth_email_flow_emails_flow_idx
  on public.growth_email_flow_emails (flow_slug, step_number);

create table if not exists public.growth_email_campaigns (
  id uuid primary key default gen_random_uuid(),
  send_date date,
  campaign_name text not null,
  campaign_type text,
  segment_slug text,
  subject text,
  preview_text text,
  goal text,
  cta text,
  graphic_recommendation text,
  status text not null default 'planned'
    check (status in ('planned', 'drafted', 'scheduled', 'sent', 'skipped')),
  flow_slug text,
  revenue_attributed numeric,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists growth_email_campaigns_date_idx
  on public.growth_email_campaigns (send_date);

create table if not exists public.growth_email_library (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  subject text not null,
  preview_text text,
  goal text,
  cta text,
  graphic_recommendation text,
  body_outline text,
  status text not null default 'idea'
    check (status in ('idea', 'drafted', 'in_klaviyo', 'live', 'sent')),
  campaign text,
  flow_slug text,
  lifecycle_stage text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.growth_email_analytics_daily (
  id uuid primary key default gen_random_uuid(),
  metric_date date not null unique,
  subscribers integer,
  open_rate numeric,
  click_rate numeric,
  unsubscribes integer,
  waitlist_conversion numeric,
  beta_conversion numeric,
  ltd_conversion numeric,
  revenue_per_email numeric,
  revenue_per_subscriber numeric,
  top_email text,
  worst_email text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.growth_content_pipeline (
  id uuid primary key default gen_random_uuid(),
  behavior_id text not null unique,
  behavior_title text not null,
  category_id text not null,
  category_title text not null,
  blog_status text not null default 'not_started',
  newsletter_status text not null default 'not_started',
  linkedin_status text not null default 'not_started',
  x_status text not null default 'not_started',
  facebook_status text not null default 'not_started',
  reddit_status text not null default 'not_started',
  instagram_status text not null default 'not_started',
  tiktok_status text not null default 'not_started',
  pinterest_status text not null default 'not_started',
  blog_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists growth_content_pipeline_category_idx
  on public.growth_content_pipeline (category_id);

grant all privileges on table public.growth_email_segments to postgres, anon, authenticated, service_role;
grant all privileges on table public.growth_email_flows to postgres, anon, authenticated, service_role;
grant all privileges on table public.growth_email_flow_emails to postgres, anon, authenticated, service_role;
grant all privileges on table public.growth_email_campaigns to postgres, anon, authenticated, service_role;
grant all privileges on table public.growth_email_library to postgres, anon, authenticated, service_role;
grant all privileges on table public.growth_email_analytics_daily to postgres, anon, authenticated, service_role;
grant all privileges on table public.growth_content_pipeline to postgres, anon, authenticated, service_role;
