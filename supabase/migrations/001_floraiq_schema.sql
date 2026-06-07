-- ============================================================
-- FloraIQ — Supabase Database Schema
-- Migration: 001_floraiq_schema
-- Run this in: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- Enable UUID extension (already enabled on Supabase by default)
create extension if not exists "pgcrypto";

-- ============================================================
-- TABLE: chat_sessions
-- One row per conversation thread, linked to auth.users
-- ============================================================
create table if not exists public.chat_sessions (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        references auth.users(id) on delete cascade,
  title       text        not null default 'FloraIQ Chat',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Index for fast per-user session lookup
create index if not exists idx_chat_sessions_user_id
  on public.chat_sessions (user_id, created_at desc);

-- Row Level Security: users can only access their own sessions
alter table public.chat_sessions enable row level security;

create policy "Users read own sessions"
  on public.chat_sessions for select
  using (auth.uid() = user_id);

create policy "Users insert own sessions"
  on public.chat_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users update own sessions"
  on public.chat_sessions for update
  using (auth.uid() = user_id);

create policy "Users delete own sessions"
  on public.chat_sessions for delete
  using (auth.uid() = user_id);

-- Service role bypass (used by server-side Supabase client)
create policy "Service role full access to sessions"
  on public.chat_sessions for all
  using (auth.role() = 'service_role');

-- ============================================================
-- TABLE: chat_messages
-- Individual messages inside a session
-- ============================================================
create table if not exists public.chat_messages (
  id          uuid        primary key default gen_random_uuid(),
  session_id  uuid        not null references public.chat_sessions(id) on delete cascade,
  user_id     uuid        references auth.users(id) on delete set null,
  role        text        not null check (role in ('user', 'assistant')),
  content     text        not null,
  created_at  timestamptz not null default now()
);

-- Index for ordered message retrieval per session
create index if not exists idx_chat_messages_session_created
  on public.chat_messages (session_id, created_at asc);

alter table public.chat_messages enable row level security;

create policy "Users read own messages"
  on public.chat_messages for select
  using (auth.uid() = user_id);

create policy "Users insert own messages"
  on public.chat_messages for insert
  with check (auth.uid() = user_id);

create policy "Service role full access to messages"
  on public.chat_messages for all
  using (auth.role() = 'service_role');

-- ============================================================
-- TABLE: observations
-- Species sightings — every scan that gets identified
-- ============================================================
create table if not exists public.observations (
  id              uuid        primary key default gen_random_uuid(),
  user_id         uuid        references auth.users(id) on delete set null,
  scientific_name text        not null,
  common_name     text,
  scan_mode       text        not null default 'plant',
  confidence      numeric(5,2) check (confidence >= 0 and confidence <= 100),
  risk_level      text        check (risk_level in ('safe', 'caution', 'dangerous')),
  photo_url       text,                          -- data-URL or storage path
  latitude        double precision,
  longitude       double precision,
  country         text,
  raw_result      jsonb,                         -- full AI response payload
  created_at      timestamptz not null default now()
);

-- Spatial-ish index for map queries (lat/lon bounding box)
create index if not exists idx_observations_location
  on public.observations (latitude, longitude)
  where latitude is not null and longitude is not null;

create index if not exists idx_observations_user_id
  on public.observations (user_id, created_at desc);

create index if not exists idx_observations_species
  on public.observations (scientific_name);

alter table public.observations enable row level security;

create policy "Observations are publicly readable"
  on public.observations for select
  using (true);

create policy "Users insert own observations"
  on public.observations for insert
  with check (auth.uid() = user_id or user_id is null);

create policy "Users delete own observations"
  on public.observations for delete
  using (auth.uid() = user_id);

create policy "Service role full access to observations"
  on public.observations for all
  using (auth.role() = 'service_role');

-- ============================================================
-- FUNCTION: update updated_at automatically
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger on_chat_sessions_updated
  before update on public.chat_sessions
  for each row execute procedure public.handle_updated_at();

-- ============================================================
-- Done. Run this once in the Supabase SQL Editor.
-- Add to .env:
--   SUPABASE_URL=https://xxxx.supabase.co
--   SUPABASE_SECRET_KEY=sb_secret_...        (server only)
--   VITE_SUPABASE_URL=https://xxxx.supabase.co
--   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...  (browser)
-- ============================================================
