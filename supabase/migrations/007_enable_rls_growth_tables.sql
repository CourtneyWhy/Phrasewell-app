-- Enable RLS on admin/growth tables and revoke direct public API access.
-- Next.js routes use service_role (bypasses RLS). anon/authenticated cannot read these tables.

-- Growth OS (004)
alter table public.growth_daily_tasks enable row level security;
alter table public.growth_communities enable row level security;
alter table public.growth_creators enable row level security;
alter table public.growth_content_calendar enable row level security;
alter table public.growth_outreach enable row level security;
alter table public.growth_metrics_daily enable row level security;
alter table public.growth_revenue_daily enable row level security;
alter table public.growth_agent_runs enable row level security;

-- Email CRM (005)
alter table public.growth_email_segments enable row level security;
alter table public.growth_email_flows enable row level security;
alter table public.growth_email_flow_emails enable row level security;
alter table public.growth_email_campaigns enable row level security;
alter table public.growth_email_library enable row level security;
alter table public.growth_email_analytics_daily enable row level security;
alter table public.growth_content_pipeline enable row level security;

-- Feedback (003) — RLS may already be on; ensure it
alter table public.phrase_feedback enable row level security;

-- Waitlist — RLS on, but revoke direct client access (API uses service_role)
alter table public.waitlist_signups enable row level security;

revoke all on table public.growth_daily_tasks from anon, authenticated;
revoke all on table public.growth_communities from anon, authenticated;
revoke all on table public.growth_creators from anon, authenticated;
revoke all on table public.growth_content_calendar from anon, authenticated;
revoke all on table public.growth_outreach from anon, authenticated;
revoke all on table public.growth_metrics_daily from anon, authenticated;
revoke all on table public.growth_revenue_daily from anon, authenticated;
revoke all on table public.growth_agent_runs from anon, authenticated;
revoke all on table public.growth_email_segments from anon, authenticated;
revoke all on table public.growth_email_flows from anon, authenticated;
revoke all on table public.growth_email_flow_emails from anon, authenticated;
revoke all on table public.growth_email_campaigns from anon, authenticated;
revoke all on table public.growth_email_library from anon, authenticated;
revoke all on table public.growth_email_analytics_daily from anon, authenticated;
revoke all on table public.growth_content_pipeline from anon, authenticated;
revoke all on table public.phrase_feedback from anon, authenticated;
revoke all on table public.waitlist_signups from anon, authenticated;
