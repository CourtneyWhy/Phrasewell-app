-- Generated slide images + TikTok viral metadata on content drafts

alter table public.growth_content_drafts
  add column if not exists generated_images jsonb default '[]'::jsonb,
  add column if not exists hashtags text,
  add column if not exists audio_suggestion text,
  add column if not exists on_screen_hook text;

-- Public bucket for generated social slides
insert into storage.buckets (id, name, public)
values ('growth-assets', 'growth-assets', true)
on conflict (id) do update set public = true;
