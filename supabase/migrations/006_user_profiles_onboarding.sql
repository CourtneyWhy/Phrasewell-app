-- User profiles, children, and extended waitlist (run in Supabase SQL Editor)

-- Extend waitlist for landing onboarding (Layer A)
alter table public.waitlist_signups
  add column if not exists kid_count text,
  add column if not exists challenge_tags text[] not null default '{}',
  add column if not exists age_bands text[] not null default '{}',
  add column if not exists updated_at timestamptz not null default now();

-- Parent profile (links to Supabase Auth)
create table if not exists public.user_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  first_name text,
  parent_types text[] not null default '{}',
  challenge_tags text[] not null default '{}',
  onboarding_version int not null default 0,
  onboarding_completed_at timestamptz,
  default_child_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists user_profiles_email_key on public.user_profiles (lower(email));

-- Children (soft-remove via removed_at)
create table if not exists public.user_children (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles (id) on delete cascade,
  name text not null,
  age_band text not null,
  relationship text not null,
  sort_order int not null default 0,
  removed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_children_user_id_idx on public.user_children (user_id);

alter table public.user_profiles enable row level security;
alter table public.user_children enable row level security;

create policy "Users read own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "Users update own profile"
  on public.user_profiles for update
  using (auth.uid() = id);

create policy "Users insert own profile"
  on public.user_profiles for insert
  with check (auth.uid() = id);

create policy "Users read own children"
  on public.user_children for select
  using (auth.uid() = user_id);

create policy "Users insert own children"
  on public.user_children for insert
  with check (auth.uid() = user_id);

create policy "Users update own children"
  on public.user_children for update
  using (auth.uid() = user_id);

grant all on public.user_profiles to service_role;
grant all on public.user_children to service_role;
grant select, insert, update on public.user_profiles to authenticated;
grant select, insert, update on public.user_children to authenticated;

-- Auto-create profile row on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id, email, first_name)
  values (
    new.id,
    lower(new.email),
    coalesce(new.raw_user_meta_data->>'first_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do update set
    email = excluded.email,
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
