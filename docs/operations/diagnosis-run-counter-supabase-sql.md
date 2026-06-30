# Diagnosis run counter Supabase SQL

## Purpose

診断ごとの実行回数を、運営用データベースで集計・確認できるようにする。

このSQLは、診断結果の表示または診断完了ログを受けたときに、診断別の合計回数を増やすためのもの。

## Scope

作成するもの:

- `diagnosis_run_counters`
- `diagnosis_run_counter_events`
- `increment_diagnosis_run_counter(...)`
- RLS enable
- index
- comment

作成しないもの:

- public policy
- drop / delete / truncate
- 既存テーブル変更
- Supabase URL / secret

## SQL

```sql
create table if not exists public.diagnosis_run_counters (
  diagnosis_key text primary key,
  total_count bigint not null default 0 check (total_count >= 0),
  first_counted_at timestamptz not null default now(),
  last_counted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.diagnosis_run_counter_events (
  id uuid primary key default gen_random_uuid(),
  diagnosis_key text not null references public.diagnosis_run_counters(diagnosis_key),
  event_type text not null default 'diagnosis_complete',
  source text,
  payload jsonb not null default '{}'::jsonb,
  counted_at timestamptz not null default now()
);

create index if not exists diagnosis_run_counter_events_diagnosis_key_counted_at_idx
  on public.diagnosis_run_counter_events (diagnosis_key, counted_at desc);

create or replace function public.increment_diagnosis_run_counter(
  p_diagnosis_key text,
  p_event_type text default 'diagnosis_complete',
  p_source text default null,
  p_payload jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_diagnosis_key is null or length(trim(p_diagnosis_key)) = 0 then
    raise exception 'diagnosis key is required';
  end if;

  insert into public.diagnosis_run_counters (
    diagnosis_key,
    total_count,
    first_counted_at,
    last_counted_at,
    updated_at
  )
  values (
    trim(p_diagnosis_key),
    1,
    now(),
    now(),
    now()
  )
  on conflict (diagnosis_key)
  do update set
    total_count = public.diagnosis_run_counters.total_count + 1,
    last_counted_at = now(),
    updated_at = now();

  insert into public.diagnosis_run_counter_events (
    diagnosis_key,
    event_type,
    source,
    payload,
    counted_at
  )
  values (
    trim(p_diagnosis_key),
    coalesce(nullif(trim(p_event_type), ''), 'diagnosis_complete'),
    nullif(trim(p_source), ''),
    coalesce(p_payload, '{}'::jsonb),
    now()
  );
end;
$$;

alter table public.diagnosis_run_counters enable row level security;
alter table public.diagnosis_run_counter_events enable row level security;

comment on table public.diagnosis_run_counters is
  'Operational aggregate counters for completed diagnosis runs.';

comment on table public.diagnosis_run_counter_events is
  'Operational event log for completed diagnosis run counter increments.';

comment on function public.increment_diagnosis_run_counter(text, text, text, jsonb) is
  'Atomically increments a diagnosis run counter and stores a minimal operational event log.';
```

## Counted diagnosis keys

The application currently maps completed diagnosis/result events to these counter keys:

- `light_diagnosis`
- `research_revolist_11_light_v1`
- `research_revolist_energy_light_v1`
- `research_icebreak_11_v1`
- `revo111_monitor_44`
- `monitor_role`
- `monitor_team`
- `monitor_match`
- `monitor_growth`

## Notes

- `SUPABASE_SERVICE_ROLE_KEY` is used only from server-side API routes.
- Browser code never receives Supabase credentials.
- Counter failure should not block result pages or existing feedback forwarding.
- Execute this SQL manually in Supabase SQL Editor before relying on production counters.
