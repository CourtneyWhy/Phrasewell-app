-- Run once in Supabase SQL Editor if the waitlist form returns errors.
-- Fixes API permissions for the waitlist_signups table.

grant usage on schema public to postgres, anon, authenticated, service_role;

grant all privileges on table public.waitlist_signups
  to postgres, anon, authenticated, service_role;

grant usage, select on all sequences in schema public
  to postgres, anon, authenticated, service_role;
