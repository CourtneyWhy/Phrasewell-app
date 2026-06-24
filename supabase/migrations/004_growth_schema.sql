-- Phrasewell Growth Operating System tables

create table if not exists public.growth_daily_tasks (
  id uuid primary key default gen_random_uuid(),
  task_date date not null,
  task_title text not null,
  task_type text,
  platform text,
  priority text check (priority in ('high', 'medium', 'low')),
  status text not null default 'not_started'
    check (status in ('not_started', 'in_progress', 'done', 'skipped')),
  link text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists growth_daily_tasks_date_idx on public.growth_daily_tasks (task_date);

create table if not exists public.growth_communities (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  name text not null,
  url text,
  audience_type text,
  estimated_size text,
  priority text not null default 'medium'
    check (priority in ('high', 'medium', 'low')),
  joined_status text not null default 'not_joined'
    check (joined_status in ('not_joined', 'requested', 'joined', 'rejected')),
  promo_rules text,
  first_post_allowed_date date,
  last_engaged_date date,
  best_post_angle text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.growth_creators (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  name text not null,
  handle text,
  url text,
  niche text,
  audience_fit text,
  estimated_followers text,
  priority text not null default 'medium'
    check (priority in ('high', 'medium', 'low')),
  contact_method text,
  contact_status text not null default 'not_contacted'
    check (contact_status in ('not_contacted', 'contacted', 'replied', 'interested', 'declined', 'partnered')),
  outreach_angle text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.growth_content_calendar (
  id uuid primary key default gen_random_uuid(),
  publish_date date not null,
  platform text not null,
  content_type text not null,
  topic text not null,
  hook text,
  body text,
  cta text,
  image_prompt text,
  status text not null default 'idea'
    check (status in ('idea', 'drafted', 'approved', 'scheduled', 'posted')),
  url_after_posting text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists growth_content_publish_idx on public.growth_content_calendar (publish_date);

create table if not exists public.growth_outreach (
  id uuid primary key default gen_random_uuid(),
  outreach_date date not null default current_date,
  target_type text not null,
  target_name text not null,
  platform text,
  url text,
  message text,
  status text not null default 'not_sent'
    check (status in ('not_sent', 'sent', 'replied', 'follow_up_needed', 'closed')),
  follow_up_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.growth_metrics_daily (
  id uuid primary key default gen_random_uuid(),
  metric_date date not null unique,
  website_visits integer,
  waitlist_signups integer,
  beta_users_invited integer,
  beta_users_active integer,
  app_sessions integer,
  feedback_submissions integer,
  thumbs_up_count integer,
  thumbs_down_count integer,
  email_subscribers integer,
  email_open_rate numeric,
  email_click_rate numeric,
  x_followers integer,
  linkedin_followers integer,
  instagram_followers integer,
  tiktok_followers integer,
  facebook_groups_joined integer,
  reddit_comments_posted integer,
  creator_outreach_sent integer,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.growth_revenue_daily (
  id uuid primary key default gen_random_uuid(),
  revenue_date date not null unique,
  daily_revenue numeric,
  ltd_units_sold integer,
  ltd_price numeric,
  refunds numeric,
  net_revenue numeric,
  cumulative_launch_revenue numeric,
  daily_target numeric,
  weekly_target numeric,
  monthly_target numeric,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.growth_agent_runs (
  id uuid primary key default gen_random_uuid(),
  agent_name text not null,
  run_date date not null default current_date,
  input text,
  output text,
  status text,
  notes text,
  created_at timestamptz not null default now()
);

-- Testimonial fields on phrase feedback
alter table public.phrase_feedback
  add column if not exists testimonial_permission boolean,
  add column if not exists testimonial_text text,
  add column if not exists parent_type text,
  add column if not exists child_age_range text,
  add column if not exists can_use_publicly boolean default false;

grant usage on schema public to postgres, anon, authenticated, service_role;
grant all privileges on all tables in schema public to postgres, anon, authenticated, service_role;
