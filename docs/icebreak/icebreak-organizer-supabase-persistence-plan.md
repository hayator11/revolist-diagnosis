# Icebreak 33 organizer Supabase persistence plan

## 目的

Icebreak 33 organizer を本番イベント運用へ進めるために、現在のメモリストアをSupabase永続化へ移す設計方針を整理する。

このドキュメントは設計メモであり、Supabaseテーブル作成、SQL実行、RLS、cron、自動削除、API改修は行わない。

## 参照したdocs

- `docs/icebreak/icebreak-organizer-phase2-production-check.md`
- `docs/icebreak/icebreak-organizer-phase2-event-url-plan.md`
- `docs/icebreak/icebreak-organizer-event-data-lifecycle-plan.md`
- `docs/icebreak/icebreak-organizer-implementation-roadmap.md`

## Supabase永続化が必要な理由

`44a1321 add organizer event url generation` により、`/organizer` から既存 `POST /api/icebreak/event` を呼び、参加URLと主催者確認URLを発行できるようになった。

本番確認では、以下は動いている。

- `/organizer` の参加URL発行UI
- `eventCode` 表示
- 参加者用URL表示
- 主催者確認URL表示
- URLコピー導線

一方で、発行された参加者URLと主催者確認URLを開くと、公開環境では「イベントが見つかりませんでした」と表示された。

原因候補は、現在のイベント保存が `globalThis` 上のメモリストアであること。

本番でメモリストアが不安定になる理由:

- Vercel本番では、POSTでイベントを作成した実行環境と、GETでイベントを読む実行環境が同じになる保証がない
- サーバーレス環境では複数インスタンス間でメモリが共有されない
- デプロイやプロセス再起動でメモリが消える
- 参加URL配布型では、イベント作成後に別リクエストから確実に参照できる必要がある

したがって、本番イベント運用にはSupabaseなどの永続ストアが必要である。

## 既存メモリストアから移す対象

現在 `src/lib/icebreakEventStore.ts` が持っている主な要素:

- `events`
  - イベント本体
  - `eventCode`
  - `hostKey`
  - イベント名
  - 開催日
  - layout
  - 1卓人数
  - status
  - expiresAt
- `eventCodeIndex`
  - 参加者URLの `eventCode` から event を引くためのindex
- `hostKeyIndex`
  - 主催者URLの `hostKey` から event を引くためのindex
- `participants`
  - ニックネーム
  - answers
  - forceScores
  - centerForce
  - subForce
  - mainTypeKey
  - tableNo / seatNo / seatReason
  - joinedAt
- seating
  - 現在はparticipantsに `tableNo`, `seatNo`, `seatReason` を書き戻す形
  - 独立した席順履歴テーブルはまだない
- reset時の匿名統計化に近い処理
  - `createIcebreakAnonymousSummary` でイベント単位の匿名サマリを作る
  - ただし現在は永続保存せずレスポンスとして返している

Supabase化では、これらを「イベント運営用の一時データ」と「長期保存してよい匿名統計」に分ける。

## Supabaseテーブル案

初期案として、以下の4テーブルに分ける。

- `icebreak_events`
- `icebreak_event_participants`
- `icebreak_event_seatings`
- `icebreak_event_aggregate_stats`

### テーブル全体の役割

| テーブル | 目的 | 保存期間 | 削除対象 | 匿名統計に残すか |
| --- | --- | --- | --- | --- |
| `icebreak_events` | イベント本体、参加URL、主催者確認URLの根 | イベント終了後3日まで | 原則削除またはdeleted化 | event_hashや月次情報だけ残す |
| `icebreak_event_participants` | 参加者の診断結果と席順生成材料 | イベント終了後3日まで | 削除対象 | 集計後は個別行を残さない |
| `icebreak_event_seatings` | 生成済み席順と理由 | イベント終了後3日まで | 削除対象 | 個別席順は残さない |
| `icebreak_event_aggregate_stats` | 匿名化された統計 | 長期保存可 | 原則残す | このテーブルが残す対象 |

## `icebreak_events` のカラム案

目的:

- イベント作成情報を保持する
- 参加者URLの `eventCode` と主催者確認URLの `hostKey` を永続的に解決できるようにする
- 登録可能期間、削除予定日、ステータスを管理する

主なカラム案:

| カラム | 型のイメージ | 内容 |
| --- | --- | --- |
| `id` | uuid | イベントID |
| `created_at` | timestamptz | 作成日時 |
| `updated_at` | timestamptz | 更新日時 |
| `event_code` | text unique | 参加者URL用コード |
| `host_key_hash` | text unique | 主催者確認用hostKeyのハッシュ |
| `title` | text | オフ会タイトル |
| `event_date` | date | 開催日 |
| `event_start_at` | timestamptz nullable | 開始日時 |
| `event_end_at` | timestamptz nullable | 終了日時 |
| `registration_open_at` | timestamptz | 登録開始日時 |
| `registration_close_at` | timestamptz | 登録終了日時 |
| `data_delete_at` | timestamptz | 個別データ削除予定日時 |
| `expected_seats` | integer | 予定席数 |
| `table_count` | integer | テーブル数 |
| `seats_per_table` | integer | 1卓人数 |
| `status` | text | `draft` / `open` / `closed` / `deleted` など |
| `copy_variant` | text | 参加案内コピーのvariant |

注意:

- `hostKey` は平文保存しない方針を検討する
- DBには `host_key_hash` を保存し、API側で受け取った `hostKey` をハッシュ化して照合する
- `event_code` は参加者用URLに含まれるため保存してよい
- `data_delete_at` はイベント終了後3日を基準にする
- `registration_open_at` はオフ会開始1週間前を基本にする

保存期間:

- イベント運営用データとしてはイベント終了後3日まで
- 期限後はdeleted化または削除
- 匿名統計側には `event_hash` や月次情報だけ残す

## `icebreak_event_participants` のカラム案

目的:

- イベントに紐づく参加者の診断結果を保存する
- 席順生成に必要な `mainTypeKey`, `partnerTypeKey`, `centerForce` を保持する
- 参加者名や個別回答は一時データとして扱う

主なカラム案:

| カラム | 型のイメージ | 内容 |
| --- | --- | --- |
| `id` | uuid | 参加者ID |
| `event_id` | uuid | `icebreak_events.id` |
| `created_at` | timestamptz | 作成日時 |
| `display_name` | text | ニックネーム |
| `answers` | jsonb | 33問の回答 |
| `main_type_key` | text | メイン11タイプ |
| `partner_type_key` | text | 話してみたい相手タイプ |
| `center_force` | text | 中心force |
| `result_summary` | jsonb nullable | 表示用の最小結果サマリ |
| `joined_at` | timestamptz | 参加日時 |
| `deleted_at` | timestamptz nullable | 個別削除日時 |

注意:

- `display_name` はニックネームでよい
- 本名必須にしない
- 個別回答や参加者名はイベント終了後3日で削除対象
- 長期保存しない
- 匿名統計作成後は個別参加者IDを残さない

保存期間:

- イベント終了後3日まで
- 期限後に削除、または個人に紐づく列をnull化してdeleted扱いにする

## `icebreak_event_seatings` のカラム案

目的:

- 生成した席順とテーブルごとの理由を保存する
- 運営者がイベント当日から終了後3日まで席順を見返せるようにする

主なカラム案:

| カラム | 型のイメージ | 内容 |
| --- | --- | --- |
| `id` | uuid | 席順生成ID |
| `event_id` | uuid | `icebreak_events.id` |
| `created_at` | timestamptz | 作成日時 |
| `generated_at` | timestamptz | 席順生成日時 |
| `algorithm_version` | text | 席順ロジックのversion |
| `tables` | jsonb | テーブル、席、参加者ID、配置理由 |
| `table_reasons` | jsonb | テーブルごとの理由 |
| `notes` | text nullable | 運営者メモ |
| `deleted_at` | timestamptz nullable | 削除日時 |

注意:

- 席順はイベント終了後3日で削除対象
- 長期保存する場合は、個人が特定されない集計だけにする
- `tables` には参加者IDが含まれる可能性があるため、一時データ扱いにする

保存期間:

- イベント終了後3日まで
- 匿名統計化後に削除

## `icebreak_event_aggregate_stats` のカラム案

目的:

- イベント運営用の個別データを削除する前に、匿名統計だけを残す
- 診断改善、席順ロジック改善、11タイプ分布の検証に使う

主なカラム案:

| カラム | 型のイメージ | 内容 |
| --- | --- | --- |
| `id` | uuid | 統計ID |
| `created_at` | timestamptz | 作成日時 |
| `event_hash` | text nullable | イベントを特定しすぎないハッシュ |
| `event_month` | text | `YYYY-MM` など |
| `participant_count` | integer | 参加人数 |
| `main_type_distribution` | jsonb | mainTypeKey分布 |
| `partner_type_distribution` | jsonb | partnerTypeKey分布 |
| `center_force_distribution` | jsonb | centerForce分布 |
| `answer_summary` | jsonb nullable | 回答傾向の集計 |
| `table_force_patterns` | jsonb nullable | テーブルごとのforce構成集計 |
| `table_role_patterns` | jsonb nullable | テーブルごとのrole構成集計 |
| `validation_fit_summary` | jsonb nullable | 検証フォームと接続できる場合の匿名集計 |

注意:

- 個人名を含めない
- 個別参加者IDを含めない
- 個別席順を含めない
- 個別回答そのものを長期保存しない
- 長期保存してよいのは匿名統計だけ

保存期間:

- 長期保存可
- ただし個人を再識別できる粒度にしない

## API移行方針

既存APIは維持しつつ、内部の保存先をメモリストアからSupabaseへ段階的に移す。

| 既存API | 現在の役割 | Supabase化後に読むテーブル | Supabase化後に書くテーブル | service role |
| --- | --- | --- | --- | --- |
| `POST /api/icebreak/event` | イベント作成、参加URL/host URL発行 | `icebreak_events` の重複確認 | `icebreak_events` | 必要 |
| `GET /api/icebreak/event/[hostKey]` | hostKeyで主催者snapshot取得 | `icebreak_events`, `icebreak_event_participants`, `icebreak_event_seatings` | なし | 必要 |
| `GET /api/icebreak/public/[eventCode]` | 参加者向けイベント情報取得 | `icebreak_events` | なし | 必要 |
| `POST /api/icebreak/join` | 参加者登録、診断結果保存 | `icebreak_events` | `icebreak_event_participants` | 必要 |
| `POST /api/icebreak/seating` | 席順生成 | `icebreak_events`, `icebreak_event_participants` | `icebreak_event_seatings`、必要ならparticipantsのseat fields | 必要 |
| `POST /api/icebreak/reset` | 匿名統計化と削除 | 全イベント系テーブル | `icebreak_event_aggregate_stats`、一時データ削除/更新 | 必要 |

方針:

- クライアントからSupabaseへ直接insertしない
- 参加者・運営者の操作はserver-only API経由にする
- 既存 `/api/icebreak/*` のURLはできるだけ維持する
- `SUPABASE_SERVICE_ROLE_KEY` はサーバー側だけで使う
- 秘密キーをクライアントに出さない
- 既存の検証フォーム用Supabase保存とは責任範囲を分ける

## RLS / service role 方針

今回は実装しないが、将来の方針は以下。

- RLSは有効化前提
- public insert policyは原則作らない
- 参加者・運営者の書き込みはserver-only API経由にする
- クライアントからSupabaseへ直接insertしない
- `SUPABASE_SERVICE_ROLE_KEY` はサーバーだけで使う
- `SUPABASE_SERVICE_ROLE_KEY` は `.env.local` やVercel Environment Variablesに保存し、Gitにコミットしない
- `.env.local` はコミットしない
- hostKeyは平文保存せず、DBではハッシュ照合を検討する

## 保存期間と削除方針

保存期間の基本方針:

- オフ会開始1週間前から登録可能
- イベント終了後3日まで個別データを保持
- その後、参加者名・個別回答・席順・hostKey紐づきは削除
- 削除前に匿名統計を作成
- 匿名統計だけ長期保存
- データ蓄積量を抑える

削除対象:

- `display_name`
- `answers`
- `result_summary` の個人に紐づく部分
- `icebreak_event_seatings.tables`
- `host_key_hash`
- 個別参加者IDと席順の紐づき

残してよいもの:

- 月単位やイベント単位をぼかした統計
- 参加人数
- 11タイプ分布
- partnerTypeKey分布
- centerForce分布
- 回答傾向の集計
- テーブル構成の匿名パターン

## 自動削除 / cron 方針

今回は実装しないが、将来は期限切れイベントを定期処理で削除する。

対象:

```text
data_delete_at < now()
```

処理案:

1. 対象イベントを取得する
2. まだaggregateがなければ `icebreak_event_aggregate_stats` を作成する
3. `icebreak_event_participants` の個別データを削除する
4. `icebreak_event_seatings` を削除する
5. `icebreak_events` を削除、または `status = deleted` にする
6. 処理結果をログに残す

実装上の注意:

- 二重実行に耐える
- aggregate作成済みなら再作成しない
- 途中失敗しても再試行できる
- 先に個別データを消してaggregateが作れなくなる事故を避ける
- 手動resetでも同じ責任範囲を使えるようにする

## 段階的な実装順

いきなり全実装しない。以下の順番で分ける。

### Step 1: Supabase schema案docs

- テーブル定義を確定する
- hostKeyの扱いを決める
- 削除対象と匿名統計対象を分ける

### Step 2: SQL作成docs

- `CREATE TABLE` 案を作る
- index案を作る
- RLS有効化方針を書く
- ただしSQL実行は別作業にする

### Step 3: server-only event create / get

- `POST /api/icebreak/event` をSupabase保存に移す
- `GET /api/icebreak/public/[eventCode]` をSupabase参照に移す
- `GET /api/icebreak/event/[hostKey]` をSupabase参照に移す
- 既存API URLは維持する

### Step 4: participant join

- `POST /api/icebreak/join` をSupabase保存に移す
- 診断結果から `mainTypeKey`, `partnerTypeKey`, `centerForce` を保存する
- 個別回答は一時データとして扱う

### Step 5: seating保存

- `POST /api/icebreak/seating` で生成した席順を `icebreak_event_seatings` に保存する
- host画面で最新席順を読めるようにする
- 個別席順は期限後削除対象にする

### Step 6: reset / aggregate

- `POST /api/icebreak/reset` で匿名統計を作成する
- 個別データを削除する
- `icebreak_event_aggregate_stats` に長期保存する

### Step 7: cron / 自動削除

- `data_delete_at < now()` を対象に自動処理する
- aggregate作成後に個別データを削除する
- 失敗時に再試行できるようにする

## 今回まだやらないこと

- Supabaseテーブル作成
- SQL実行
- RLS実装
- cron実装
- 自動削除
- API改修
- 既存 `/host` 改修
- 既存 `/organizer` 改修
- 診断本体変更
- 設問変更
- 重み変更
- centeredResult利用
- 本番DB接続

## 今回変更しないもの

- 既存 `/host`
- 既存 `/organizer`
- 既存API
- 新しいAPI
- `icebreakEventStore.ts`
- `icebreakSeating.ts`
- Supabaseテーブル
- RLS
- cron
- 自動削除
- 診断本体
- 結果ページ
- 検証フォーム
- `/api/feedback`
- GAS
- payload
- URL形式
- 診断ロジック
- 設問
- 重み
- centeredResult
- scripts
- `.env.local`

## 推奨結論

メモリストアでは本番イベント運用は不可と判断する。

organizerを本番イベント運用に進めるにはSupabase永続化が必要である。  
ただし、まずはschemaと責任範囲のdocs化から始める。

既存の検証フォーム用Supabase保存とは分けて設計する。  
実装はクライアント直結ではなく、server-only APIから段階的に進める。

参加者名・個別回答・席順はイベント終了後3日までの一時データとして扱い、匿名統計だけを長期保存する。
