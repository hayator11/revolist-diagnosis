# Icebreak 33 organizer Supabase final decisions

## 目的

Icebreak 33 organizer のSupabase SQL最終版を作る前に、未決定事項を整理し、SQL案へ反映する方針を決める。

今回はdocs作成のみで、SQL実行、Supabaseテーブル作成、RLS適用、policy作成、trigger作成、cron、自動削除、API改修は行わない。

## 参照したdocs

- `docs/icebreak/icebreak-organizer-supabase-persistence-plan.md`
- `docs/icebreak/icebreak-organizer-supabase-schema-sql-plan.md`
- `docs/icebreak/icebreak-organizer-supabase-schema-review.md`

## 1. `data_delete_at` の確定方針

### 採用方針

- `event_end_at` がある場合は、`event_end_at + interval '3 days'`
- `event_end_at` がない場合は、`event_date` のJST 23:59:59 + 3 days
- DBには `timestamptz` で保存する
- 画面表示は日本時間で扱う
- 初期UIでは日付だけでも運用できるようにする

### event_dateだけのイベント

`event_date` だけのイベントでは、終了時刻を以下として扱う。

```text
event_date の JST 23:59:59
```

理由:

- 初期UIでは開催日時が曖昧なイベントも扱う可能性がある
- 日付だけ入力された場合でも、イベント当日中は登録・確認できる方が自然
- イベント終了後3日という運用説明と整合しやすい

### SQL最終版への反映

SQL自体では `data_delete_at timestamptz` を持つ。  
算出はDB defaultではなく、server-only API側で行う方針にする。

理由:

- `event_end_at` の有無やJST日末の扱いをアプリ側で明示できる
- 将来UIで時刻入力が増えても調整しやすい

## 2. `registration_open_at` / `registration_close_at` の確定方針

### 採用方針

- `registration_open_at`: イベント日または開始日時の7日前
- `registration_close_at`: `event_end_at` があればそれ、なければ `event_date` のJST日末

### event_start_at がある場合

```text
registration_open_at = event_start_at - interval '7 days'
```

### event_start_at がない場合

```text
registration_open_at = event_date の JST 00:00 - interval '7 days'
```

### registration_close_at

- `event_end_at` がある場合は `event_end_at`
- `event_end_at` がない場合は `event_date` のJST 23:59:59

### 参加者登録をいつまで許可するか

初期方針:

- `registration_close_at` までは参加者登録を許可する
- `registration_close_at` 後は、新規参加者登録を止める
- 主催者の席順確認は `data_delete_at` までは許可する

## 3. `answers jsonb` を保存するか

### A案: answersを一時保存する

利点:

- 匿名統計を作りやすい
- 回答傾向分析に使える
- 11タイプ分布だけでは見えない設問単位の傾向を確認できる

注意:

- 個別回答を一時的に持つリスクがある
- 削除期限の運用を確実に守る必要がある

### B案: answersを保存しない

利点:

- 個別データが少なく安全
- 席順生成には `mainTypeKey` / `partnerTypeKey` / `centerForce` で足りる
- DB上の一時データを最小化できる

注意:

- 回答傾向集計ができない
- `answer_summary` を作るには診断完了時に即時集計する必要がある

### 推奨方針

初期本番では、`answers` を一時保存してもよい。  
ただし、イベント終了後3日で必ず削除対象にする。

より安全寄りの最小本番にするなら、`answers` 保存なしも選択肢に残す。

### SQL最終版への反映

SQL最終版では、いったん `answers jsonb` を残す。  
ただし、コメントまたはdocs上で「一時保存・削除対象」と明記する。

実装フェーズで、回答完了時に即時匿名集計できるなら `answers` 保存なしへ切り替えてよい。

## 4. 少人数イベントの匿名統計粒度

### 採用方針

参加者数によって、保存する匿名統計の粒度を変える。

| 参加者数 | 保存方針 |
| --- | --- |
| 3人未満 | aggregateを作らない、または `participant_count` のみ |
| 5人未満 | `center_force_distribution` 程度まで |
| 5人以上 | `main_type_distribution` / `partner_type_distribution` / table patterns を保存候補 |

### answer_summary

`answer_summary` はさらに慎重に扱う。

- 5人未満では保存しない
- 5人以上でも、個別回答が推測できない集計形式にする
- 設問ごとの平均や分布を出す場合、少人数では丸める

### table patterns

保存候補:

- tableごとのforce構成
- tableごとのrole構成
- 同force偏りの有無

保存しないもの:

- 誰と誰が同じ席だったか
- 個別席番号
- 個別参加者ID

### SQL最終版への反映

SQL構造は現案のままでよい。  
粒度制御はSQL制約ではなく、aggregate作成ロジックと運用docsで扱う。

## 5. `events` を `status = deleted` で残す場合の情報

### 採用方針

eventsは `status = deleted` で残す案を優先する。

理由:

- `event_code` の再利用防止に使える
- 削除処理済みかを判定しやすい
- 最小限の監査情報を残せる

### deleted化時に残すもの

- `id`
- `event_code`
- `status = deleted`
- `created_at`
- `updated_at`
- 必要なら `event_date` を月単位へ丸めた情報

### deleted化時に削除または無効化するもの

- `host_key_hash`
- `title`
- `event_start_at`
- `event_end_at`
- `registration_open_at`
- `registration_close_at`
- `data_delete_at`
- eventを特定しすぎるメモや詳細情報

### title / event_date

推奨:

- `title` は削除、または `deleted event` に置換
- `event_date` は必要なら月単位に丸める
- 詳細なイベント傾向は `icebreak_event_aggregate_stats` に寄せる

### SQL最終版への反映

SQL構造は現案のままでよい。  
deleted化時の更新内容はAPI / cron設計で扱う。

ただし `host_key_hash` をdeleted化時にnull化するなら、SQL上は `host_key_hash text unique not null` から見直しが必要。

候補:

- `host_key_hash text unique`
- active状態ではAPI側で必須チェックする

SQL最終版前に、`host_key_hash` をdeleted後にnull化するか決める。

## 6. `host_key_hash` の確定方針

### 採用方針

- HMAC-SHA-256 + server-only pepperを採用する
- `SUPABASE_SERVICE_ROLE_KEY` とは別のsecretにする
- hostKey再発行は初期実装では不要
- 将来、主催者URL漏えい時に再発行できる余地を残す

### pepper用の環境変数名候補

候補:

- `ICEBREAK_HOST_KEY_PEPPER`
- `ICEBREAK_EVENT_HOST_KEY_SECRET`

推奨:

- `ICEBREAK_HOST_KEY_PEPPER`

理由:

- 用途がhostKey hash用だと分かる
- `SUPABASE_SERVICE_ROLE_KEY` と役割が混ざらない

### pepper変更時の影響

- 既存の `host_key_hash` と照合できなくなる
- 既存主催者URLが無効になる可能性がある
- pepper変更は運用上の重大変更として扱う
- ローテーションするなら、旧pepperとの二重照合期間が必要

### SQL最終版への反映

SQL構造は `host_key_hash` カラムのままでよい。  
HMAC生成はserver-only API側で扱う。

## 7. `event_code` の確定方針

### 採用方針

- 初期運用は6文字コードで進める
- 既存生成方式を踏襲する
- `event_code` は参加者URL用なので平文保存でよい
- unique衝突時はAPI側で再生成する
- deleted後も再利用しない

### 将来拡張

イベント数が増えた場合:

- 7〜8文字化を検討する
- 既存6文字コードとの互換を維持する
- コード長をDB制約で固定しすぎない

### SQL最終版への反映

- `event_code text unique not null` のままでよい
- 文字数checkは初期SQLでは入れない
- API側で生成文字種と長さを管理する

## 8. SQL最終版への反映方針

### SQL案に反映すべき変更

- `host_key_hash` をdeleted後にnull化するなら `not null` を外す
- `answers` を保存しない最小本番にするなら `answers jsonb not null` を外す
- `events` をdeletedで残す場合、`status` indexは維持する
- 自動削除対象検索のため `icebreak_events (status, data_delete_at)` indexを追加候補にする
- 最新席順取得用に `icebreak_event_seatings (event_id, generated_at desc)` indexを追加候補にする

### SQL案には残すが実装フェーズで判断するもの

- `deleted_at`
- `event_hash`
- `validation_fit_summary`
- `algorithm_version`
- `notes`

### docs上の運用ルールとして残すもの

- `data_delete_at` の算出ロジック
- JSTでの表示・日付解釈
- 少人数イベントの匿名統計粒度
- hostKey pepperの管理
- eventCode再利用禁止

## 9. 今回まだやらないこと

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

## 推奨結論

SQL最終版へ進む前の推奨は以下。

- `data_delete_at` は `event_end_at + 3 days` を基本にする
- `event_end_at` がない場合は、`event_date` のJST 23:59:59 + 3 days とする
- `registration_open_at` はイベント日または開始日時の7日前にする
- `registration_close_at` は `event_end_at`、なければJST日末にする
- `answers` は初期本番では一時保存可。ただし削除対象にする
- 安全寄りの最小本番では `answers` 保存なしも検討する
- 匿名統計は参加者数に応じて粒度を変える
- eventsは `status = deleted` で残す案を優先する
- deleted化時は `host_key_hash` を削除または無効化し、titleも削除または置換する
- hostKey hashはHMAC-SHA-256 + `ICEBREAK_HOST_KEY_PEPPER` を優先する
- eventCodeは6文字で初期運用し、unique衝突時はAPI側で再生成する

SQL最終版では、特に `host_key_hash not null` と `answers jsonb not null` を維持するかを最後に確認する。
