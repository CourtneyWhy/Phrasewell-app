-- Service role policies for growth tables (if RLS blocks admin API reads/writes)
-- Run after 004 and 007. Safe to run multiple times.

do $$
declare
  t text;
begin
  foreach t in array array[
    'growth_communities',
    'growth_creators',
    'growth_content_calendar',
    'growth_daily_tasks',
    'growth_outreach',
    'growth_metrics_daily',
    'growth_revenue_daily',
    'growth_agent_runs'
  ]
  loop
    execute format('drop policy if exists service_role_all on public.%I', t);
    execute format(
      'create policy service_role_all on public.%I for all to service_role using (true) with check (true)',
      t
    );
  end loop;
end $$;
