-- おのくん里親さん 11ご縁タイプ診断
-- Supabase保存 + 診断回数カウンター用SQL
--
-- 方針:
-- - ブラウザからSupabaseへ直接書き込まない。
-- - Next.js APIが service role key で保存する。
-- - 個人情報は保存しない。
-- - 診断1回ごとに counter を原子的に +1 し、その番号を結果行にも保存する。

create extension if not exists pgcrypto;

create table if not exists public.onokun_satooya_diagnosis_counters (
  project_key text primary key,
  total_count bigint not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.onokun_satooya_diagnosis_results (
  id uuid primary key default gen_random_uuid(),
  project_key text not null,
  diagnosis_run_number bigint not null,
  diagnosis_id text not null,
  result_url text,
  created_at timestamptz not null default now(),

  research_project text not null,
  research_type text not null,
  diagnosis_version text not null,
  question_version text not null,
  logic_version text not null,
  result_version text not null,

  client_session_id text,
  event_id text,
  payload_schema_version text,
  page_path text,
  device text,

  answer_count integer not null,
  answers jsonb not null,
  scores jsonb not null,
  revo_scores jsonb,
  top_type_keys jsonb not null,
  top_revo_type_keys jsonb,
  main_type_key text not null,
  main_type_name text not null,
  main_revo_type_key text,
  main_original_role text,
  sub_type_key text not null,
  sub_type_name text not null,
  sub_revo_type_key text,
  sub_original_role text,
  support_type_key text not null,
  support_type_name text not null,
  support_revo_type_key text,
  support_original_role text,
  cluster_key text not null,
  cluster_name text not null,
  partner_type_key text not null,
  partner_type_name text not null,
  partner_revo_type_key text,
  partner_original_role text,
  evidence_highlights jsonb not null,

  constraint onokun_satooya_diagnosis_results_run_number_unique
    unique (project_key, diagnosis_run_number),
  constraint onokun_satooya_diagnosis_results_answer_count_check
    check (answer_count in (11, 33)),
  constraint onokun_satooya_diagnosis_results_run_number_check
    check (diagnosis_run_number >= 1)
);

create index if not exists onokun_satooya_diagnosis_results_created_at_idx
  on public.onokun_satooya_diagnosis_results (created_at desc);

create index if not exists onokun_satooya_diagnosis_results_main_type_idx
  on public.onokun_satooya_diagnosis_results (main_type_key);

alter table public.onokun_satooya_diagnosis_results
  add column if not exists revo_scores jsonb,
  add column if not exists top_revo_type_keys jsonb,
  add column if not exists main_revo_type_key text,
  add column if not exists main_original_role text,
  add column if not exists sub_revo_type_key text,
  add column if not exists sub_original_role text,
  add column if not exists support_revo_type_key text,
  add column if not exists support_original_role text,
  add column if not exists partner_revo_type_key text,
  add column if not exists partner_original_role text;

alter table public.onokun_satooya_diagnosis_results
  drop constraint if exists onokun_satooya_diagnosis_results_answer_count_check;

alter table public.onokun_satooya_diagnosis_results
  add constraint onokun_satooya_diagnosis_results_answer_count_check
    check (answer_count in (11, 33));

create index if not exists onokun_satooya_diagnosis_results_main_revo_type_idx
  on public.onokun_satooya_diagnosis_results (main_revo_type_key);

create index if not exists onokun_satooya_diagnosis_results_partner_revo_type_idx
  on public.onokun_satooya_diagnosis_results (partner_revo_type_key);

create table if not exists public.onokun_satooya_share_events (
  id uuid primary key default gen_random_uuid(),
  project_key text not null,
  event_name text not null,
  diagnosis_id text not null,
  result_url text,
  created_at timestamptz not null default now(),

  client_session_id text,
  event_id text,
  payload_schema_version text,
  page_path text,
  device text,

  main_type_key text not null,
  main_type_name text not null,
  main_revo_type_key text,

  share_variant_id text not null,
  share_variant_kind text not null,
  opening_copy_id text not null,
  call_to_action_copy_id text not null,
  special_copy_id text,
  share_channel text,

  constraint onokun_satooya_share_events_event_name_check
    check (event_name in ('share_copy_assigned', 'share_button_clicked', 'open_chat_clicked')),
  constraint onokun_satooya_share_events_variant_kind_check
    check (share_variant_kind in ('normal', 'lucky', 'funny')),
  constraint onokun_satooya_share_events_share_channel_check
    check (
      share_channel is null
      or share_channel in ('x', 'line', 'native', 'copy', 'open_chat')
    )
);

create index if not exists onokun_satooya_share_events_created_at_idx
  on public.onokun_satooya_share_events (created_at desc);

create index if not exists onokun_satooya_share_events_project_event_idx
  on public.onokun_satooya_share_events (project_key, event_name);

create index if not exists onokun_satooya_share_events_variant_idx
  on public.onokun_satooya_share_events (project_key, share_variant_id);

create index if not exists onokun_satooya_share_events_main_type_idx
  on public.onokun_satooya_share_events (project_key, main_type_key);

create or replace function public.increment_onokun_satooya_diagnosis_counter(
  p_project_key text
)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_total_count bigint;
begin
  insert into public.onokun_satooya_diagnosis_counters (
    project_key,
    total_count,
    updated_at
  )
  values (
    p_project_key,
    1,
    now()
  )
  on conflict (project_key)
  do update set
    total_count = public.onokun_satooya_diagnosis_counters.total_count + 1,
    updated_at = now()
  returning total_count into v_total_count;

  return v_total_count;
end;
$$;

create or replace function public.save_onokun_satooya_diagnosis_result(
  p_project_key text,
  p_payload jsonb
)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_total_count bigint;
begin
  v_total_count := public.increment_onokun_satooya_diagnosis_counter(p_project_key);

  insert into public.onokun_satooya_diagnosis_results (
    project_key,
    diagnosis_run_number,
    diagnosis_id,
    result_url,
    created_at,
    research_project,
    research_type,
    diagnosis_version,
    question_version,
    logic_version,
    result_version,
    client_session_id,
    event_id,
    payload_schema_version,
    page_path,
    device,
    answer_count,
    answers,
    scores,
    revo_scores,
    top_type_keys,
    top_revo_type_keys,
    main_type_key,
    main_type_name,
    main_revo_type_key,
    main_original_role,
    sub_type_key,
    sub_type_name,
    sub_revo_type_key,
    sub_original_role,
    support_type_key,
    support_type_name,
    support_revo_type_key,
    support_original_role,
    cluster_key,
    cluster_name,
    partner_type_key,
    partner_type_name,
    partner_revo_type_key,
    partner_original_role,
    evidence_highlights
  )
  values (
    p_project_key,
    v_total_count,
    p_payload ->> 'diagnosis_id',
    p_payload ->> 'result_url',
    coalesce((p_payload ->> 'created_at')::timestamptz, now()),
    p_payload ->> 'research_project',
    p_payload ->> 'research_type',
    p_payload ->> 'diagnosis_version',
    p_payload ->> 'question_version',
    p_payload ->> 'logic_version',
    p_payload ->> 'result_version',
    nullif(p_payload ->> 'client_session_id', ''),
    nullif(p_payload ->> 'event_id', ''),
    nullif(p_payload ->> 'payload_schema_version', ''),
    nullif(p_payload ->> 'page_path', ''),
    nullif(p_payload ->> 'device', ''),
    (p_payload ->> 'answer_count')::integer,
    p_payload -> 'answers',
    p_payload -> 'scores',
    p_payload -> 'revo_scores',
    p_payload -> 'top_type_keys',
    p_payload -> 'top_revo_type_keys',
    p_payload ->> 'main_type_key',
    p_payload ->> 'main_type_name',
    nullif(p_payload ->> 'main_revo_type_key', ''),
    nullif(p_payload ->> 'main_original_role', ''),
    p_payload ->> 'sub_type_key',
    p_payload ->> 'sub_type_name',
    nullif(p_payload ->> 'sub_revo_type_key', ''),
    nullif(p_payload ->> 'sub_original_role', ''),
    p_payload ->> 'support_type_key',
    p_payload ->> 'support_type_name',
    nullif(p_payload ->> 'support_revo_type_key', ''),
    nullif(p_payload ->> 'support_original_role', ''),
    p_payload ->> 'cluster_key',
    p_payload ->> 'cluster_name',
    p_payload ->> 'partner_type_key',
    p_payload ->> 'partner_type_name',
    nullif(p_payload ->> 'partner_revo_type_key', ''),
    nullif(p_payload ->> 'partner_original_role', ''),
    p_payload -> 'evidence_highlights'
  );

  return v_total_count;
end;
$$;

alter table public.onokun_satooya_diagnosis_counters enable row level security;
alter table public.onokun_satooya_diagnosis_results enable row level security;
alter table public.onokun_satooya_share_events enable row level security;

-- public insert/select policy は作らない。
-- Next.js API route から service role key でのみ保存する。
