-- Icebreak 11 event box
-- Apply this in Supabase SQL Editor after enabling pgcrypto.

create extension if not exists pgcrypto;

create table if not exists public.icebreak_events (
  id uuid primary key default gen_random_uuid(),
  schema_version text not null default 'icebreak-event-v1',
  shell_id text not null default 'icebreak-11-v1',
  event_code text not null unique,
  host_key text not null unique,
  event_name text not null,
  event_date date not null,
  layout_type text not null default 'island',
  table_capacity integer not null default 4 check (table_capacity between 2 and 8),
  copy_variant text not null default 'default',
  status text not null default 'open' check (status in ('open', 'closed')),
  created_at timestamptz not null default now(),
  closed_at timestamptz,
  expires_at timestamptz not null
);

create table if not exists public.icebreak_participants (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.icebreak_events(id) on delete cascade,
  nickname text not null,
  contact text,
  registration_memo text,
  data_use_consent boolean not null default true,
  answers jsonb not null,
  force_scores jsonb not null,
  center_force text not null,
  sub_force text not null,
  slot_force text,
  judgment_mode text not null default 'focused',
  main_type_key text not null,
  partner_type_key text,
  third_type_key text,
  table_no integer,
  seat_no integer,
  seat_reason text,
  joined_at timestamptz not null default now()
);

create table if not exists public.icebreak_seating_runs (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.icebreak_events(id) on delete cascade,
  seating jsonb not null,
  participant_count integer not null,
  created_at timestamptz not null default now()
);

create table if not exists public.icebreak_anonymous_summaries (
  id uuid primary key default gen_random_uuid(),
  schema_version text not null default 'icebreak-event-v1',
  shell_id text not null default 'icebreak-11-v1',
  event_code text not null,
  event_name text not null,
  event_date date not null,
  participant_count integer not null,
  force_combination jsonb not null,
  table_combination jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists icebreak_events_event_code_idx
  on public.icebreak_events(event_code);

create index if not exists icebreak_events_host_key_idx
  on public.icebreak_events(host_key);

create index if not exists icebreak_participants_event_id_joined_at_idx
  on public.icebreak_participants(event_id, joined_at);

create index if not exists icebreak_participants_event_id_table_idx
  on public.icebreak_participants(event_id, table_no, seat_no);

alter table public.icebreak_events enable row level security;
alter table public.icebreak_participants enable row level security;
alter table public.icebreak_seating_runs enable row level security;
alter table public.icebreak_anonymous_summaries enable row level security;

-- No public RLS policies are created here.
-- The Next.js API routes should access these tables with SUPABASE_SERVICE_ROLE_KEY on the server only.

-- Icebreak 33 centered model validation feedback.
-- This table is for real-answer validation of the Icebreak 33 centered-0 model.
-- centeredResultSummary is not stored here; analysis should join later by diagnosis_id or result_url.
-- Do not store personal information. Initial implementation assumes server-only inserts.
create table if not exists public.icebreak_centered_validation_feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  diagnosis_id text,
  result_url text,
  fit_score integer not null check (fit_score between 1 and 5),
  self_like_text text not null,
  discomfort_text text not null,
  conversation_use_score integer not null check (conversation_use_score between 1 and 5),
  matching_use_score integer not null check (matching_use_score between 1 and 5),
  want_to_know_text text,
  free_comment text,
  self_type_text text,
  others_say_text text,
  hard_question_text text,
  neutral_reason_text text,
  matching_resistance text,
  constraint icebreak_centered_validation_feedback_reference_check
    check (diagnosis_id is not null or result_url is not null)
);

alter table public.icebreak_centered_validation_feedback enable row level security;

-- No public RLS policies are created for validation feedback yet.
-- Insert should go through a future Next.js API route using SUPABASE_SERVICE_ROLE_KEY.
