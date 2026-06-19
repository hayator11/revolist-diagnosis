# Icebreak 33 organizer Supabase schema SQL plan

## 目的

Icebreak 33 organizer の本番イベント運用に必要なSupabaseテーブルのSQL案を整理する。

今回はレビュー用のSQL案を作成するだけで、Supabase SQL Editorでの実行、テーブル作成、RLS適用、policy作成、trigger作成、cron、自動削除、API改修は行わない。

## 参照したdocs

- `docs/icebreak/icebreak-organizer-supabase-persistence-plan.md`
- `docs/icebreak/icebreak-organizer-phase2-production-check.md`
- `docs/icebreak/icebreak-organizer-event-data-lifecycle-plan.md`

## 作成予定テーブル

SQL案の対象テーブルは以下の4つ。

- `icebreak_events`
- `icebreak_event_participants`
- `icebreak_event_seatings`
- `icebreak_event_aggregate_stats`

## 共通方針

- UUID主キーを使う
- `created_at` は `now()` defaultにする
- `updated_at` が必要なテーブルには入れる
- RLSは有効化前提にする
- public insert policyは作らない
- 操作はserver-only API経由にする
- `SUPABASE_SERVICE_ROLE_KEY` はサーバー側だけで扱う
- `.env.local` はコミットしない
- hostKeyは平文保存しない
- 個別参加者データはイベント終了後3日までの一時データとして扱う
- 匿名統計だけ長期保存する
- 既存 `icebreak_centered_validation_feedback` とは別系統にする

## SQL案: `icebreak_events`

目的:

- イベント作成情報を保存する
- 参加者URLの `event_code` と主催者確認URLの `host_key_hash` を解決する
- 登録期間、削除予定日、ステータスを管理する

```sql
create table if not exists icebreak_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  event_code text not null unique,
  host_key_hash text not null unique,
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
```

index案:

```sql
create index if not exists icebreak_events_event_code_idx
  on icebreak_events (event_code);

create index if not exists icebreak_events_host_key_hash_idx
  on icebreak_events (host_key_hash);

create index if not exists icebreak_events_status_idx
  on icebreak_events (status);

create index if not exists icebreak_events_data_delete_at_idx
  on icebreak_events (data_delete_at);
```

補足:

- `event_code` は参加者用URLに入るため保存してよい
- `hostKey` は平文保存しない
- DBには `host_key_hash` を保存し、server-only API側で受け取ったhostKeyをハッシュ化して照合する
- `data_delete_at` はイベント終了後3日を基準にする

## SQL案: `icebreak_event_participants`

目的:

- イベントに紐づく参加者の診断結果を保存する
- 席順生成に必要な `main_type_key`, `partner_type_key`, `center_force` を保持する
- 参加者名や個別回答は一時データとして扱う

```sql
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
```

index案:

```sql
create index if not exists icebreak_event_participants_event_id_idx
  on icebreak_event_participants (event_id);

create index if not exists icebreak_event_participants_main_type_key_idx
  on icebreak_event_participants (main_type_key);

create index if not exists icebreak_event_participants_center_force_idx
  on icebreak_event_participants (center_force);

create index if not exists icebreak_event_participants_deleted_at_idx
  on icebreak_event_participants (deleted_at);
```

補足:

- `display_name` はニックネームでよい
- 本名必須にしない
- `display_name` と `answers` はイベント終了後3日で削除対象
- 個別参加者ID、個別回答、参加者名は長期保存しない

## SQL案: `icebreak_event_seatings`

目的:

- 生成済み席順とテーブルごとの理由を保存する
- 運営者がイベント当日から終了後3日まで席順を確認できるようにする

```sql
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
```

index案:

```sql
create index if not exists icebreak_event_seatings_event_id_idx
  on icebreak_event_seatings (event_id);

create index if not exists icebreak_event_seatings_generated_at_idx
  on icebreak_event_seatings (generated_at);

create index if not exists icebreak_event_seatings_deleted_at_idx
  on icebreak_event_seatings (deleted_at);
```

補足:

- `tables` には個別席順が含まれるため一時データ扱いにする
- 席順はイベント終了後3日で削除対象
- 長期保存する場合は、個人が特定されない集計だけにする

## SQL案: `icebreak_event_aggregate_stats`

目的:

- イベント運営用の個別データを削除する前に、匿名統計だけを保存する
- 診断改善、席順ロジック改善、11タイプ分布の検証に使う

```sql
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

index案:

```sql
create index if not exists icebreak_event_aggregate_stats_event_month_idx
  on icebreak_event_aggregate_stats (event_month);

create index if not exists icebreak_event_aggregate_stats_event_hash_idx
  on icebreak_event_aggregate_stats (event_hash);
```

補足:

- 個人名を含めない
- 個別参加者IDを含めない
- 個別席順を含めない
- 個別回答そのものを長期保存しない
- 長期保存してよいのは匿名統計だけ

## RLS案

今回は実装しないが、SQL案として以下を想定する。

```sql
alter table icebreak_events enable row level security;
alter table icebreak_event_participants enable row level security;
alter table icebreak_event_seatings enable row level security;
alter table icebreak_event_aggregate_stats enable row level security;
```

方針:

- public insert policyは作らない
- 参加者や運営者がブラウザからSupabaseへ直接書かない
- organizerの操作はserver-only APIからservice roleで実行する
- `SUPABASE_SERVICE_ROLE_KEY` はサーバー側だけで扱う
- 将来的に必要なら読み取りpolicyを別途検討する
- まずはAPI責任範囲を固めてからpolicyを設計する

## updated_at運用案

`icebreak_events.updated_at` は更新時に自動更新したい。

今回triggerは作成しないが、将来案として以下を検討する。

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

注意:

- このtrigger案は今回実行しない
- 他テーブルに `updated_at` を追加するかは、APIの更新頻度を見て判断する

## 削除・匿名化方針

削除対象の基準:

```text
data_delete_at < now()
```

処理方針:

1. 削除対象イベントを取得する
2. 削除前に `icebreak_event_aggregate_stats` を作る
3. `icebreak_event_participants` の個別データを削除する
4. `icebreak_event_seatings` の個別席順を削除する
5. `icebreak_events` は `status = deleted` にするか削除するか、今後判断する

削除対象:

- 参加者名
- 個別回答
- 個別参加者IDと席順の紐づき
- 個別席順
- hostKey紐づき

長期保存してよいもの:

- 参加人数
- mainTypeKey分布
- partnerTypeKey分布
- centerForce分布
- 回答傾向の集計
- テーブル構成の匿名パターン
- 検証フォームと接続できる場合の匿名集計

個人情報や参加者名は長期保存しない。

## 既存検証フォームSupabaseとの分離

既存 `icebreak_centered_validation_feedback` とは別系統にする。

分ける理由:

- 検証フォームは、診断改善のための自由記述・しっくり度・違和感を集める
- organizerは、イベント作成・参加者登録・席順生成を扱う
- 保存目的が違う
- 保存期間が違う
- 参加者名や席順はイベント運営用の一時データであり、検証フォームとは混ぜない

方針:

- `icebreak_centered_validation_feedback` の既存仕様は変更しない
- `/api/icebreak/centered-validation` とは分ける
- organizer用APIは別責任として設計する
- 匿名統計に接続する場合も、個人が特定されない集計に限定する

## 今回まだやらないこと

- SQL実行
- Supabaseテーブル作成
- RLS適用
- policy作成
- trigger作成
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

次は以下の順番がよい。

1. SQL案レビュー
2. 必要ならカラム修正
3. Supabase SQL Editorで手動実行するための最終SQL作成
4. その後、server-only API移行へ進む

SQL案レビューでは、特に以下を確認する。

- `host_key_hash` の作り方
- `event_code` の一意性
- `data_delete_at` の算出基準
- 個別データ削除と匿名統計作成の順番
- RLS有効化後にpublic policyを作らない運用で問題ないか
