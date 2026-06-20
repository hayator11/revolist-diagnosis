# Icebreak 33 organizer API Supabase migration design

## 目的

Icebreak 33 / レボリスト診断のオフ会オーナー機能について、既存の `globalThis` メモリストアを本番運用から外し、Supabase永続化へ移行するためのAPI設計を整理する。

今回は設計docs作成のみであり、API改修、UI改修、Supabase操作、SQL実行、環境変数変更は行わない。

## 前提

Supabase側には、オフ会オーナー機能用の以下4テーブルが作成済み。

- `icebreak_events`
- `icebreak_event_participants`
- `icebreak_event_seatings`
- `icebreak_event_aggregate_stats`

現在のAPIはまだ `src/lib/icebreakEventStore.ts` の `globalThis` メモリストアを使っている。

本番Vercel環境では、POSTでイベントを作成した実行環境とGETでイベントを読む実行環境が一致する保証がない。そのため、イベントURL配布型の本番運用ではメモリストアを保存元にしない。

## 移行の基本方針

### `globalThis` メモリストアを本番運用から外す目的

- Vercel本番のサーバーレス環境でイベント参照を安定させる
- 参加URL配布後に、別リクエストや別インスタンスでもイベントを取得できるようにする
- イベント終了後3日までの一時データ保持と、その後の削除・匿名統計化に進める土台を作る
- 既存メモリストアの揮発性を前提にした運用をやめる

### 既存URL形式を維持する方針

既存URL形式は変更しない。

- 参加者用URL: `/research/icebreak-11-v1?event={eventCode}`
- 主催者確認URL: `/research/icebreak-11-v1/host?key={hostKey}`
- 個人結果URL: `/research/icebreak-11-v1/result/{encoded}`

Supabase移行は、URL形式を変えるのではなく、既存API内部の保存先を差し替える方針にする。

### 既存クライアント導線をできるだけ維持する方針

既存画面の呼び出し先はできるだけ維持する。

- `/organizer` は引き続き `POST /api/icebreak/event` を呼ぶ
- `/host?key={hostKey}` は引き続き `GET /api/icebreak/event/[hostKey]` を呼ぶ
- 参加者診断ページは引き続き `GET /api/icebreak/public/[eventCode]` と `POST /api/icebreak/join` を使う
- 席順生成は引き続き `POST /api/icebreak/seating` を使う
- リセットは引き続き `POST /api/icebreak/reset` を使う

UI変更を最小にし、まずはserver-only APIの内部実装をSupabaseへ寄せる。

## テーブルの使い分け

### `icebreak_events`

イベント本体を保持する。

主な用途:

- `eventCode` から参加者用公開イベントを取得する
- `hostKey` hashから主催者用イベントを取得する
- イベント名、開催日、席設定、登録期間、削除予定時刻、状態を管理する

主なカラム:

- `event_code`
- `host_key_hash`
- `title`
- `event_date`
- `event_start_at`
- `event_end_at`
- `registration_open_at`
- `registration_close_at`
- `data_delete_at`
- `expected_seats`
- `table_count`
- `seats_per_table`
- `status`
- `copy_variant`

### `icebreak_event_participants`

イベント参加者の一時データを保持する。

主な用途:

- ニックネーム
- 回答
- `main_type_key`
- `partner_type_key`
- `center_force`
- 結果サマリー
- 参加時刻

参加者名、個別回答、個別結果はイベント終了後3日で削除対象にする。

### `icebreak_event_seatings`

生成された席順を一時保存する。

主な用途:

- テーブルごとの席順
- テーブル理由
- アルゴリズムバージョン
- 生成時刻

個別席順を含むため、イベント終了後3日で削除対象にする。

### `icebreak_event_aggregate_stats`

匿名統計を長期保存する。

主な用途:

- 参加人数
- `mainTypeKey` 分布
- `partnerTypeKey` 分布
- `centerForce` 分布
- 回答傾向の集計
- テーブル構成パターン

個人名、個別参加者ID、個別席順は含めない。少人数イベントでは保存粒度を粗くする。

## hostKeyの扱い

### 平文保存しない方針

`hostKey` は主催者確認URLに含まれるアクセスキーであり、DBには平文保存しない。

DBには `host_key_hash` のみを保存する。

### hash方式

server-only API側で、以下の方針でhash化する。

```text
HMAC-SHA-256(hostKey, ICEBREAK_HOST_KEY_PEPPER)
```

`ICEBREAK_HOST_KEY_PEPPER` は `SUPABASE_SERVICE_ROLE_KEY` とは別のserver-only secretとして扱う。

### pepper未設定時の扱い

`ICEBREAK_HOST_KEY_PEPPER` が未設定の場合は、APIは500で停止する。

平文hostKey保存へフォールバックしない。

理由:

- セキュリティ方針が環境差で崩れるのを防ぐ
- 本番だけhash化、ローカルだけ平文保存のような分岐を避ける
- hostKeyを平文保存しない原則を守る

## eventCodeの扱い

### 6文字コードを維持する方針

既存と同じく、参加URL用の `eventCode` は6文字で初期運用する。

既存生成文字:

```text
ABCDEFGHJKLMNPQRSTUVWXYZ23456789
```

### unique制約と衝突時再生成

DBでは `icebreak_events.event_code` のunique制約で衝突を検知する。

API側では、insert時にunique衝突が起きたら再生成して再試行する。

初期実装では再試行回数を決める必要がある。候補は3〜5回。

### 削除後も再利用しない方針

`events` は `status = deleted` で残す案を優先するため、削除後も `event_code` は再利用しない。

## API移行設計

## `POST /api/icebreak/event`

### 現在

`createIcebreakEvent` でメモリストアにイベントを作成し、`participantUrl` と `hostUrl` を返す。

### Supabase移行後

1. request bodyを既存と同じ形式で受け取る
2. `eventName` をtrimし、空なら既存同様のデフォルト名を使うか、設計で必須に寄せる
3. `eventDate` を受け取る
4. `tableCapacity` を2〜8に丸める
5. `eventCode` を6文字で生成する
6. `hostKey` を生成する
7. `ICEBREAK_HOST_KEY_PEPPER` で `host_key_hash` を作る
8. `registration_open_at` / `registration_close_at` / `data_delete_at` を算出する
9. `icebreak_events` にinsertする
10. unique衝突時は `eventCode` を再生成して再試行する
11. 既存と同じ形で `event` / `participantUrl` / `hostUrl` を返す

### 書き込み先

- `icebreak_events`

### レスポンス互換

既存 `/organizer` と `/host` を壊さないため、最低限以下は維持する。

- `result: "success"`
- `event.eventCode`
- `event.hostKey`
- `event.eventName`
- `event.eventDate`
- `event.layoutType`
- `event.tableCapacity`
- `event.status`
- `participantUrl`
- `hostUrl`

内部DBではsnake_caseでも、APIレスポンスは既存camelCaseに揃える。

## `GET /api/icebreak/event/[hostKey]`

### 現在

`hostKey` でメモリストアのイベントを取得し、主催者画面用に `event` / `participants` / `tables` を返す。

### Supabase移行後

1. URL paramsの `hostKey` を受け取る
2. `ICEBREAK_HOST_KEY_PEPPER` で `host_key_hash` を作る
3. `icebreak_events.host_key_hash` でイベントを取得する
4. `status = deleted` のイベントはnot found扱いにする
5. `icebreak_event_participants` から未削除参加者を取得する
6. `icebreak_event_seatings` から最新の席順を取得する
7. 既存 `HostEvent` / `HostParticipant` / `HostTable` に近い形へ整形する
8. 取得できなければ `404` / `result: "not_found"` を返す

### 読み取り元

- `icebreak_events`
- `icebreak_event_participants`
- `icebreak_event_seatings`

### 注意

`hostKey` の平文はDB照合に使わず、API内でhash化して破棄する。

## `GET /api/icebreak/public/[eventCode]`

### 現在

`eventCode` でメモリストアのイベントを取得し、参加者に見せてよい公開情報だけ返す。

### Supabase移行後

1. URL paramsの `eventCode` を大文字化する
2. `icebreak_events.event_code` でイベントを取得する
3. `status = open` を確認する
4. 登録期間を確認する
5. 参加者に見せてよい情報だけ返す

### 読み取り元

- `icebreak_events`

### レスポンス互換

既存参加者診断ページの期待に合わせて、以下を返す。

- `result: "success"`
- `event.eventCode`
- `event.eventName`
- `event.eventDate`
- `event.layoutType`
- `event.tableCapacity`
- `event.status`

## `POST /api/icebreak/join`

### 現在

`eventCode` と `nickname` と `answers` を受け取り、`calculateIcebreakResult` で結果を計算してメモリストアに参加者を保存する。

### Supabase移行後

1. request bodyから `eventCode` / `nickname` / `answers` を読む
2. `eventCode` を大文字化する
3. `icebreak_events.event_code` でイベントを取得する
4. `status = open` を確認する
5. `registration_open_at` / `registration_close_at` を確認する
6. `answers` を検証する
7. `calculateIcebreakResult(answers)` を既存通り使う
8. `icebreak_event_participants` にinsertする
9. 既存に近い `participant` / `event` を返す

### 書き込み先

- `icebreak_event_participants`

### 保存する主な値

- `event_id`
- `display_name`
- `answers`
- `main_type_key`
- `partner_type_key`
- `center_force`
- `result_summary`
- `joined_at`

### 注意

`answers` は初期本番では一時保存可とするが、イベント終了後3日で削除対象にする。

## `POST /api/icebreak/seating`

### 現在

`hostKey` でイベントを取得し、参加者の `centerForce` と `joinedAt` から `generateIcebreakSeating` を実行する。生成結果は参加者レコードの `tableNo` / `seatNo` / `seatReason` に書き戻される。

### Supabase移行後

1. request bodyから `hostKey` を読む
2. `hostKey` をhash化してイベントを取得する
3. 未削除参加者を `icebreak_event_participants` から取得する
4. 既存 `generateIcebreakSeating` に渡せる形へ変換する
5. 席順を生成する
6. `icebreak_event_seatings` にinsertする
7. 必要なら最新席順として取得しやすいよう `generated_at` を使う
8. 既存に近い `event` / `participants` / `seating` を返す

### 書き込み先

- `icebreak_event_seatings`

### 未決定点

参加者行へ `tableNo` / `seatNo` / `seatReason` を戻すか、席順は `icebreak_event_seatings.tables` のみに持たせるかは実装前に決める。

初期移行では、既存host画面との互換性を重視するならレスポンス整形で `HostParticipant` に席情報を含めればよい。DB上はseatingsに寄せる方が削除・匿名化しやすい。

## `POST /api/icebreak/reset`

### 現在

`hostKey` でイベントを取得し、匿名サマリーを作ってから、メモリストア上のparticipants / event / indexesを削除する。

### Supabase移行後

1. request bodyから `hostKey` を読む
2. `hostKey` をhash化してイベントを取得する
3. participantsと最新seatingを取得する
4. 少人数匿名統計方針に従ってaggregateを作る
5. 保存可能な場合は `icebreak_event_aggregate_stats` にinsertする
6. `icebreak_event_participants` の個別データを削除する
7. `icebreak_event_seatings` の個別席順を削除する
8. `icebreak_events` は `status = deleted` にする
9. `host_key_hash` とtitleなど識別性の高い情報を削除または無効化する
10. 既存と同じく `anonymousSummary` 相当を返す

### 書き込み先

- `icebreak_event_aggregate_stats`
- `icebreak_event_participants`
- `icebreak_event_seatings`
- `icebreak_events`

### 注意

リセットは不可逆操作に近い。初期実装では、確認UIやログ方針を別途整理してから実装する。

## server-only API + service role 方針

Supabase操作はすべてNext.js API route側で行う。

- `SUPABASE_SERVICE_ROLE_KEY` はサーバー側だけで扱う
- `SUPABASE_SERVICE_ROLE_KEY` をブラウザに出さない
- clientからSupabaseへ直接insertしない
- public insert policyは作らない
- RLS有効化前提のまま、service role経由で必要操作を行う

既存の `src/lib/supabase/server.ts` はserver-only Supabase clientの土台として利用候補になる。

## clientからSupabaseへ直接insertしない方針

以下の画面からSupabaseへ直接接続しない。

- `/research/icebreak-11-v1/organizer`
- `/research/icebreak-11-v1/host`
- `/research/icebreak-11-v1?event={eventCode}`

クライアントは既存通り `/api/icebreak/*` を呼び、API routeがSupabaseに接続する。

## AI玉手箱診断系と混ぜない方針

Supabaseプロジェクトは `ai-fit-diagnosis` だが、無料版運用のため同じSupabaseプロジェクト内に以下が同居している。

- AI玉手箱診断
- レボリスト診断 / Icebreak 33

今回の移行対象は、Icebreak 33 / レボリスト診断の中でも、オフ会オーナー / オフ会運営者機能のみ。

以下には触れない。

- `ai_*` テーブル
- `diagnosis_*` テーブル
- `tamatebako_*` テーブル
- AI玉手箱診断本体

## `icebreak_centered_validation_feedback` と混ぜない方針

`icebreak_centered_validation_feedback` はIcebreak 33の検証フォーム用テーブル。

オフ会オーナー機能のイベント運営データとは、目的、保存期間、削除方針が異なる。

以下は変更しない。

- `icebreak_centered_validation_feedback`
- `/api/icebreak/centered-validation`
- 検証フォーム
- 既存 `/api/feedback`
- GAS連携
- payload形式

## 実装フェーズ案

### Phase 1: Supabase repository層を追加する

実装候補:

- `hostKey` hash helper
- eventCode生成helper
- Supabase event create / get
- DB rowと既存APIレスポンスのmapper

この段階ではUIを触らない。

### Phase 2: `POST /api/icebreak/event` をSupabase化する

最初にイベント作成を移す。

確認すること:

- `/organizer` から参加URLを発行できる
- `icebreak_events` に保存される
- `eventCode` / `hostKey` URL形式が維持される
- `hostKey` 平文がDBに保存されない

### Phase 3: public event取得とhost event取得をSupabase化する

対象:

- `GET /api/icebreak/public/[eventCode]`
- `GET /api/icebreak/event/[hostKey]`

これにより、本番で発行済みURLを再度開けるか確認できる。

### Phase 4: participant joinをSupabase化する

対象:

- `POST /api/icebreak/join`

確認すること:

- 参加者がニックネーム入力後に診断開始できる
- 診断完了後にイベント参加者として保存される
- 個人結果ページへの遷移は維持される
- `/api/feedback` は既存通り動く

### Phase 5: seating生成をSupabase化する

対象:

- `POST /api/icebreak/seating`

確認すること:

- 既存 `generateIcebreakSeating` を再利用できる
- 最新席順をhost画面に表示できる
- `icebreak_event_seatings` に保存できる

### Phase 6: reset / aggregateをSupabase化する

対象:

- `POST /api/icebreak/reset`

確認すること:

- 匿名統計を作成できる
- participants / seatings の個別データを削除できる
- eventsを `status = deleted` にできる
- `host_key_hash` と識別性の高い情報を無効化できる

### Phase 7: cron / 自動削除設計へ進む

API移行が安定した後で、自動削除や期限切れ処理を設計する。

このdocsではまだ実装しない。

## 実装後のテスト設計

### 単体・型確認

- `npm run test:icebreak`
- `npx tsc --noEmit --incremental false`

### API確認

- `POST /api/icebreak/event` でイベント作成できる
- `GET /api/icebreak/public/[eventCode]` で公開イベント取得できる
- `GET /api/icebreak/event/[hostKey]` で主催者用イベント取得できる
- `POST /api/icebreak/join` で参加者登録できる
- `POST /api/icebreak/seating` で席順生成できる
- `POST /api/icebreak/reset` で匿名統計化と個別データ削除ができる

### ブラウザ確認

- `/research/icebreak-11-v1/organizer`
- `/research/icebreak-11-v1/host?key={hostKey}`
- `/research/icebreak-11-v1?event={eventCode}`
- `/research/icebreak-11-v1/validation`

確認項目:

- 参加URL発行
- 参加者URLから診断開始
- ニックネーム入力
- 診断完了
- host画面で参加者確認
- 席順生成
- reset
- 既存検証フォーム送信

### DB確認

秘密値やURL実値をdocsに残さず、Table EditorまたはSQLで以下を確認する。

- `icebreak_events` にイベントが作成される
- `host_key_hash` に平文hostKeyが入っていない
- `icebreak_event_participants` に参加者が保存される
- `icebreak_event_seatings` に席順が保存される
- reset後に個別データが削除される
- `icebreak_event_aggregate_stats` に匿名統計が保存される
- `icebreak_centered_validation_feedback` には影響がない

### 既存機能影響確認

- 診断本体が表示される
- 結果ページが表示される
- シェア導線に影響がない
- 検証フォームに影響がない
- `/api/feedback` / GAS / payload形式に影響がない
- 診断ロジック、設問、重み、centeredResultに影響がない

## 未解決の設計課題

- `hostKey` hash helperの配置場所
- `ICEBREAK_HOST_KEY_PEPPER` 未設定時のエラー文言
- eventCode unique衝突時の再試行回数
- `expectedSeats` / `tableCount` をどのPhaseでAPI保存へ入れるか
- `expiresAt` から `data_delete_at` へのレスポンス互換
- seating情報をparticipantsにも反映するか、seatingsだけに持たせるか
- reset時の少人数匿名統計の具体的な集計粒度
- API移行時にメモリストアを完全撤去するか、一時fallbackとして残すか
- 既存イベントがメモリストアにしかない場合の移行互換を考慮するか

## まだ実装しないこと

- API改修
- UI改修
- Supabase追加SQL実行
- Supabase CLI実行
- Supabase Dashboard操作
- RLS変更
- policy作成
- trigger作成
- cron実装
- 自動削除実装
- `.env.local` 変更
- Vercel環境変数変更
- `/host` 接続変更
- `/organizer` 接続変更
- 診断本体変更
- 結果ページ変更
- 検証フォーム変更
- `/api/feedback` 変更
- GAS連携変更
- payload形式変更
- URL形式変更
- 診断ロジック変更
- 設問変更
- 重み変更
- centeredResult変更

## 結論

Supabase移行は、既存URL形式とクライアント導線を維持しながら、`/api/icebreak/*` の内部保存先を `globalThis` メモリストアからserver-only Supabase処理へ置き換える方針が妥当。

最初に `POST /api/icebreak/event` とイベント取得APIを移行し、参加URL配布型が本番で参照できる状態を作る。その後、join、seating、reset / aggregateへ段階的に進める。

AI玉手箱診断系、既存検証フォーム、診断本体、結果ページ、`/api/feedback` とは責任範囲を分けたまま進める。
