# Icebreak 33 organizer Supabase final SQL

## 目的

Icebreak 33 organizer の本番イベント運用に向けて、Supabase SQL Editorで将来手動実行するための最終SQL案を残す。

今回はSQL最終版docs作成のみであり、このSQLは実行しない。Supabaseテーブル作成、RLS適用、policy作成、trigger実行、cron、自動削除、API改修は行わない。

## 参照したdocs

- `docs/icebreak/icebreak-organizer-supabase-persistence-plan.md`
- `docs/icebreak/icebreak-organizer-supabase-schema-sql-plan.md`
- `docs/icebreak/icebreak-organizer-supabase-schema-review.md`
- `docs/icebreak/icebreak-organizer-supabase-final-decisions.md`

## 作成対象テーブル

- `icebreak_events`
- `icebreak_event_participants`
- `icebreak_event_seatings`
- `icebreak_event_aggregate_stats`

## 最終SQLに反映する方針

- `event_code` は `text unique not null`
- `host_key_hash` はdeleted時にnull化する可能性があるため、`text unique` とし、`not null` は外す
- activeなイベントではserver-only API側で `host_key_hash` 必須チェックを行う
- `data_delete_at` はserver-only API側で算出する
- `event_end_at` がある場合は `event_end_at + 3 days`
- `event_end_at` がない場合は `event_date` のJST 23:59:59 + 3 days
- `registration_open_at` / `registration_close_at` はserver-only API側で算出する
- `answers jsonb not null` は維持する
- `answers` はイベント終了後3日で削除対象にする
- 個別席順を含む `tables` は削除対象にする
- 匿名統計だけ長期保存する

## 最終SQL案

```sql
-- Icebreak 33 organizer Supabase final SQL draft.
-- This SQL is for review/manual execution in the future.
-- Do not execute it as part of this docs change.

create table if not exists icebreak_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  event_code text not null unique,
  host_key_hash text unique,
  title text not null,
  event_date date,
  event_start_at timestamptz,
  event_end_at timestamptz,
  registration_open_at timestamptz,
  registration_close_at timestamptz,
  data_delete_at timestamptz,
  expected_seats integer,
  table_count integer,
  seats_per_table integer,
  status text not null default 'open',
  copy_variant text not null default 'default',
  constraint icebreak_events_expected_seats_check
    check (expected_seats is null or expected_seats >= 1),
  constraint icebreak_events_table_count_check
    check (table_count is null or table_count >= 1),
  constraint icebreak_events_seats_per_table_check
    check (seats_per_table is null or seats_per_table between 2 and 8),
  constraint icebreak_events_status_check
    check (status in ('draft', 'open', 'closed', 'deleted')),
  constraint icebreak_events_title_not_blank_check
    check (length(trim(title)) > 0)
);

create table if not exists icebreak_event_participants (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references icebreak_events(id) on delete cascade,
  created_at timestamptz not null default now(),
  display_name text not null,
  answers jsonb not null,
  main_type_key text not null,
  partner_type_key text,
  center_force text,
  result_summary jsonb,
  joined_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint icebreak_event_participants_display_name_not_blank_check
    check (length(trim(display_name)) > 0),
  constraint icebreak_event_participants_main_type_key_not_blank_check
    check (length(trim(main_type_key)) > 0)
);

create table if not exists icebreak_event_seatings (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references icebreak_events(id) on delete cascade,
  created_at timestamptz not null default now(),
  generated_at timestamptz not null default now(),
  algorithm_version text,
  tables jsonb not null,
  table_reasons jsonb,
  notes text,
  deleted_at timestamptz
);

create table if not exists icebreak_event_aggregate_stats (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  event_hash text,
  event_month text,
  participant_count integer,
  main_type_distribution jsonb,
  partner_type_distribution jsonb,
  center_force_distribution jsonb,
  answer_summary jsonb,
  table_force_patterns jsonb,
  table_role_patterns jsonb,
  validation_fit_summary jsonb,
  constraint icebreak_event_aggregate_stats_participant_count_check
    check (participant_count is null or participant_count >= 0)
);
```

## index案

```sql
create index if not exists icebreak_events_event_code_idx
  on icebreak_events (event_code);

create index if not exists icebreak_events_host_key_hash_idx
  on icebreak_events (host_key_hash);

create index if not exists icebreak_events_status_idx
  on icebreak_events (status);

create index if not exists icebreak_events_data_delete_at_idx
  on icebreak_events (data_delete_at);

create index if not exists icebreak_events_status_data_delete_at_idx
  on icebreak_events (status, data_delete_at);

create index if not exists icebreak_event_participants_event_id_idx
  on icebreak_event_participants (event_id);

create index if not exists icebreak_event_participants_event_id_deleted_at_idx
  on icebreak_event_participants (event_id, deleted_at);

create index if not exists icebreak_event_participants_main_type_key_idx
  on icebreak_event_participants (main_type_key);

create index if not exists icebreak_event_participants_center_force_idx
  on icebreak_event_participants (center_force);

create index if not exists icebreak_event_seatings_event_id_idx
  on icebreak_event_seatings (event_id);

create index if not exists icebreak_event_seatings_event_id_generated_at_idx
  on icebreak_event_seatings (event_id, generated_at desc);

create index if not exists icebreak_event_seatings_deleted_at_idx
  on icebreak_event_seatings (deleted_at);

create index if not exists icebreak_event_aggregate_stats_event_month_idx
  on icebreak_event_aggregate_stats (event_month);

create index if not exists icebreak_event_aggregate_stats_event_hash_idx
  on icebreak_event_aggregate_stats (event_hash);
```

## RLS案

RLSは有効化前提にする。  
ただし、今回のSQL最終版docsではpolicyを作成しない。

```sql
alter table icebreak_events enable row level security;
alter table icebreak_event_participants enable row level security;
alter table icebreak_event_seatings enable row level security;
alter table icebreak_event_aggregate_stats enable row level security;
```

方針:

- public insert policyは作らない
- policy作成は今回含めない
- 操作はserver-only API + service roleで行う
- クライアントからSupabaseへ直接insertしない
- `SUPABASE_SERVICE_ROLE_KEY` はサーバー側だけで扱う

## updated_at trigger案

`icebreak_events.updated_at` の自動更新候補。  
今回は実行しない。SQL最終案として記載する。

```sql
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_icebreak_events_updated_at
before update on icebreak_events
for each row
execute function set_updated_at();
```

## comment案

```sql
comment on table icebreak_events is
  'Icebreak 33 organizer events. host_key_hash stores a hash, not the plain hostKey.';

comment on column icebreak_events.host_key_hash is
  'Hashed hostKey for organizer access. Plain hostKey must not be stored.';

comment on column icebreak_events.data_delete_at is
  'Timestamp after which event operation personal data should be deleted or anonymized.';

comment on table icebreak_event_participants is
  'Temporary organizer participant data. Rows should be deleted after aggregate stats are created.';

comment on column icebreak_event_participants.display_name is
  'Participant nickname. Temporary data, not for long-term storage.';

comment on column icebreak_event_participants.answers is
  'Temporary answer payload for aggregate creation. Delete after the event retention period.';

comment on table icebreak_event_seatings is
  'Temporary seating results. Contains individual seating data and should be deleted after retention.';

comment on column icebreak_event_seatings.tables is
  'Individual seating table payload. Temporary data, not for long-term storage.';

comment on table icebreak_event_aggregate_stats is
  'Anonymous aggregate stats for long-term Icebreak organizer analysis.';
```

## `host_key_hash` の扱い

- 平文hostKeyはDBに保存しない
- `host_key_hash` はHMAC-SHA-256 + server-only pepperで生成する想定
- pepper候補は `ICEBREAK_HOST_KEY_PEPPER`
- `SUPABASE_SERVICE_ROLE_KEY` とは別のsecretとして扱う
- deleted化時に `host_key_hash` をnull化または無効化できるよう、SQLでは `not null` を外す
- activeなイベントではAPI側で `host_key_hash` 必須チェックを行う

## `answers` の扱い

- 初期本番では `answers jsonb not null` を維持する
- `answers` は一時保存データであり、イベント終了後3日で削除対象にする
- 席順生成だけなら `main_type_key`, `partner_type_key`, `center_force` で足りる
- 将来、診断完了時に即時匿名集計できるなら `answers` 保存なしへ切り替えてよい

## 少人数イベントの匿名統計方針

- 3人未満: aggregateを作らない、または `participant_count` のみ
- 5人未満: `center_force_distribution` 程度まで
- 5人以上: `main_type_distribution` / `partner_type_distribution` / table patterns を保存候補
- `answer_summary` は5人未満では保存しない
- 個人名、個別参加者ID、個別席順、個別回答そのものは長期保存しない

この粒度制御はSQL制約ではなく、aggregate作成ロジックと運用docsで扱う。

## 削除・匿名化方針

- `data_delete_at` はserver-only API側で算出する
- `event_end_at` がある場合は `event_end_at + 3 days`
- `event_end_at` がない場合は `event_date` のJST 23:59:59 + 3 days
- `registration_open_at` はイベント日または開始日時の7日前
- `registration_close_at` は `event_end_at`、なければJST日末
- 削除前に `icebreak_event_aggregate_stats` を作る
- その後、participants / seatings の個別データを削除する
- eventsは `status = deleted` で残す案を優先する
- deleted化時は `host_key_hash` を削除または無効化し、titleも削除または置換する
- `event_code` は再利用防止のため残す

## 既存検証フォームSupabaseとの分離

- 既存 `icebreak_centered_validation_feedback` とは別系統
- organizerイベント運営データとは混ぜない
- `/api/icebreak/centered-validation` は変更しない
- 検証フォームは診断改善の自由記述・しっくり度を扱う
- organizerはイベント作成・参加者登録・席順生成を扱う
- 保存目的と保存期間が違うため、テーブルを分ける

## 今回まだやらないこと

- SQL実行
- Supabaseテーブル作成
- RLS適用
- policy作成
- trigger実行
- cron実装
- 自動削除実装
- API改修
- `.env.local` 変更
- Vercel環境変数変更
- 既存 `/host` 改修
- 既存 `/organizer` 改修
- 既存API変更
- 新しいAPI作成
- 診断本体変更
- 結果ページ変更
- 検証フォーム変更
- `/api/feedback` 変更
- GAS変更
- payload変更
- URL形式変更
- 診断ロジック変更
- 設問変更
- 重み変更
- centeredResult利用
- scripts変更

## 次の推奨ステップ

1. SQL最終版レビュー
2. 必要なら微修正
3. Supabase SQL Editorで手動実行するか最終判断
4. 実行する場合は、事前にバックアップ方針と実行ログdocsを作る
5. その後、server-only API移行へ進む
