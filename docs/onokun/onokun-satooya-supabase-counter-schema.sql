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
  top_type_keys jsonb not null,
  main_type_key text not null,
  main_type_name text not null,
  sub_type_key text not null,
  sub_type_name text not null,
  support_type_key text not null,
  support_type_name text not null,
  cluster_key text not null,
  cluster_name text not null,
  partner_type_key text not null,
  partner_type_name text not null,
  evidence_highlights jsonb not null,

  constraint onokun_satooya_diagnosis_results_run_number_unique
    unique (project_key, diagnosis_run_number),
  constraint onokun_satooya_diagnosis_results_answer_count_check
    check (answer_count = 33),
  constraint onokun_satooya_diagnosis_results_run_number_check
    check (diagnosis_run_number >= 1)
);

create index if not exists onokun_satooya_diagnosis_results_created_at_idx
  on public.onokun_satooya_diagnosis_results (created_at desc);

create index if not exists onokun_satooya_diagnosis_results_main_type_idx
  on public.onokun_satooya_diagnosis_results (main_type_key);

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
    top_type_keys,
    main_type_key,
    main_type_name,
    sub_type_key,
    sub_type_name,
    support_type_key,
    support_type_name,
    cluster_key,
    cluster_name,
    partner_type_key,
    partner_type_name,
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
    p_payload -> 'top_type_keys',
    p_payload ->> 'main_type_key',
    p_payload ->> 'main_type_name',
    p_payload ->> 'sub_type_key',
    p_payload ->> 'sub_type_name',
    p_payload ->> 'support_type_key',
    p_payload ->> 'support_type_name',
    p_payload ->> 'cluster_key',
    p_payload ->> 'cluster_name',
    p_payload ->> 'partner_type_key',
    p_payload ->> 'partner_type_name',
    p_payload -> 'evidence_highlights'
  );

  return v_total_count;
end;
$$;

alter table public.onokun_satooya_diagnosis_counters enable row level security;
alter table public.onokun_satooya_diagnosis_results enable row level security;

-- public insert/select policy は作らない。
-- Next.js API route から service role key でのみ保存する。
