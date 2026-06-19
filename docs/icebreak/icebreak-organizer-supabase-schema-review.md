# Icebreak 33 organizer Supabase schema review

## 目的

Icebreak 33 organizer のSupabase schema SQL案を、SQL実行前にレビューする。

対象は `docs/icebreak/icebreak-organizer-supabase-schema-sql-plan.md` の4テーブル案である。  
今回はレビューdocs作成のみで、SQL実行、Supabaseテーブル作成、RLS適用、policy作成、trigger作成、cron、自動削除、API改修は行わない。

## 参照したdocs / ファイル

- `docs/icebreak/icebreak-organizer-supabase-persistence-plan.md`
- `docs/icebreak/icebreak-organizer-supabase-schema-sql-plan.md`
- `docs/icebreak/icebreak-organizer-phase2-production-check.md`
- `docs/icebreak/icebreak-organizer-event-data-lifecycle-plan.md`
- `src/lib/icebreakEventStore.ts`

## レビュー対象の前提

SQL案は以下の4テーブル構成。

- `icebreak_events`
- `icebreak_event_participants`
- `icebreak_event_seatings`
- `icebreak_event_aggregate_stats`

大きな方向性として、4テーブル構成は妥当。  
イベント運営用の一時データと、長期保存してよい匿名統計を分けられている。

## 1. `host_key_hash` の作り方

### 既存の `hostKey`

既存 `src/lib/icebreakEventStore.ts` では、`hostKey` は以下のように生成されている。

```ts
const hostKey = randomId().replaceAll("-", "") + randomId().replaceAll("-", "");
```

`randomId()` は `crypto.randomUUID()` を使う。  
つまり、UUID由来のランダム文字列を2つ連結した長い値であり、主催者確認URLに含める秘密性の高いトークンとして扱われている。

### レビュー結果

- DBに `hostKey` を平文保存しない方針でよい
- `host_key_hash unique` でよい
- server-only API側で受け取った `hostKey` をハッシュ化し、DBの `host_key_hash` と照合する方針でよい
- 主催者確認URLには平文の `hostKey` が入るが、DB保存時はhash化する
- `hostKey` は漏れた場合に主催者画面へ入れてしまうため、ログやdocsに値を残さない

### ハッシュ化方式

候補:

- HMAC-SHA-256
- SHA-256 + server-only pepper

推奨:

- HMAC-SHA-256を使う
- secretはserver-onlyの環境変数として扱う
- `SUPABASE_SERVICE_ROLE_KEY` とは別の用途なので、可能なら別名のpepperを用意する

理由:

- hostKey自体は高エントロピーだが、単純hashよりHMACの方がサーバー側秘密を足せる
- DBが見えてもhostKeyを復元しにくい
- pepperをローテーションする場合は運用設計が必要になる

### salt / pepper

- saltは行ごとに持たせる案もあるが、照合時にsalt取得が必要になる
- hostKey検索では、入力hostKeyから一発で `host_key_hash` を作って検索したい
- そのため初期案では、server-only pepperによるHMACを優先する
- pepperの変更は既存hostKeyを無効化し得るため、運用前に決める

### hostKey再発行

- 初期版ではhostKey再発行は不要
- 将来的に主催者URL漏えい時のため、hostKey再発行機能を検討してよい
- 再発行する場合は `host_key_hash` を更新し、旧hostKeyを無効化する

## 2. `event_code` の一意性と衝突時の扱い

### 既存の `eventCode`

既存実装では、`CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"` から6文字のコードを生成している。  
メモリストアでは `eventCodeIndex` を見て、衝突したら再生成している。

### レビュー結果

- `event_code` は参加者URLに入るため平文保存でよい
- `event_code unique` は必要
- DB側のunique制約で衝突検知する方針でよい
- API側でも生成後にinsertし、unique違反時は再生成する設計が必要
- 6文字コードは初期検証にはよいが、本番イベント数が増える場合は長さ拡張を検討する

### 削除後の再利用

推奨:

- 削除後も同じ `event_code` の再利用は避ける

理由:

- 古い参加URLを持っている人が、別イベントに入る誤解を避けるため
- `events` を物理削除すると再利用リスクが上がる
- `status = deleted` でevent_codeを残す方が安全

SQL最終化前に、`events` をdeleted状態で残すか、別の使用済みコードテーブルを持つか決める。

## 3. `data_delete_at` の算出基準

正式方針:

- オフ会開始1週間前から登録可能
- イベント終了後3日で個別データ削除

### レビュー結果

推奨:

- `event_end_at` がある場合: `event_end_at + interval '3 days'`
- `event_end_at` がない場合: `event_date + interval '3 days'` の日末相当
- `registration_open_at`: `event_start_at - interval '7 days'`
- `event_start_at` がない場合: `event_date - interval '7 days'`
- `registration_close_at`: 初期版では `event_end_at`、なければ `event_date` の日末相当

### time zone

- DBは `timestamptz` で保存する
- 画面上は日本時間として表示する
- 入力が日付だけの場合は、Asia/Tokyoのイベント日として扱う前提をdocsとUIで明示する
- `event_date` だけのイベントでは、終了時刻を持てないため、削除基準は「イベント日の終了後3日」とみなす

### SQL最終化前に決めること

- 日付だけ入力されたイベントの `data_delete_at` を「JST日末+3日」にするか
- `event_end_at` を必須にするか任意にするか
- registration_close_at をイベント開始時刻にするか終了時刻にするか

## 4. `status` の扱い

候補:

- `draft`
- `open`
- `closed`
- `deleted`

### レビュー結果

- 4状態の案は妥当
- `draft`: イベント作成途中、参加URL未配布
- `open`: 参加者登録可能
- `closed`: 参加者登録終了、主催者は席順確認可能
- `deleted`: 個別データ削除済み、運営用としては終了

### `open` と `closed` の境界

推奨:

- `registration_close_at` を過ぎたら参加者登録は受け付けない
- ただし、初期実装では明示的に主催者がclosedにする操作でもよい

### `deleted` の扱い

推奨:

- eventsはすぐ物理削除せず、`status = deleted` で残す案を優先
- participants / seatings は個別データを削除
- event_code再利用防止と監査用に、eventsの最小情報だけ残す

ただし、eventsにtitleなどイベント固有情報が残る場合は、deleted化時にタイトルもぼかすか削除するか検討が必要。

## 5. 参加者データ削除方針

### 選択肢

1. `icebreak_event_participants` を行ごと削除する
2. `display_name`, `answers`, `result_summary` をnull化し、`deleted_at` を入れる

### レビュー結果

推奨:

- 初期本番では行ごと削除を優先する

理由:

- 個別参加者IDを長期保存しない方針と整合する
- 個別回答・参加者名が残る事故を避けやすい
- 匿名統計は削除前に `icebreak_event_aggregate_stats` へ保存すれば足りる

補足:

- 運用監査上、削除済み件数だけ必要ならaggregate側に `participant_count` を残す
- `deleted_at` は「論理削除運用にする場合」の保険として残しているが、行削除方針なら不要になる可能性がある

## 6. 席順データ削除方針

### レビュー結果

- `icebreak_event_seatings.tables` は個別席順を含むため削除対象
- 初期本番では行ごと削除を優先する
- `algorithm_version` だけを長期保存する意味は薄い
- 長期保存したい場合は、aggregate側に席順パターンとして残す

匿名統計に残す席順パターンの粒度:

- tableごとのcenterForce構成
- tableごとのmainTypeKey構成
- 同force偏りの有無
- 参加人数とテーブル人数

残さないもの:

- 参加者名
- 参加者ID
- 個別席番号
- 個別の「誰と誰が同席したか」

## 7. 匿名統計に残す粒度

候補:

- `main_type_distribution`
- `partner_type_distribution`
- `center_force_distribution`
- `answer_summary`
- `table_force_patterns`
- `table_role_patterns`
- `validation_fit_summary`

### レビュー結果

方針自体は妥当。  
ただし、少人数イベントでは粒度が細かすぎると再識別リスクが上がる。

### 少人数イベントの注意

推奨:

- 参加者数が一定未満の場合、`answer_summary` は保存しない
- 参加者数が一定未満の場合、`table_role_patterns` は粗くする
- 1人しかいないタイプが分かる粒度の公開や分析出力は避ける

閾値案:

- 3人未満: aggregate自体を作らない、またはparticipant_countのみ
- 5人未満: force分布程度に留める
- 5人以上: 11タイプ分布やtable patternを保存候補にする

### `event_hash`

判断:

- event単位の追跡が必要なら `event_hash` を残してよい
- 診断全体の傾向だけでよいなら `event_month` だけでも足りる

推奨:

- 初期は `event_hash` をnullableにする
- イベント横断分析が必要になるまで、必須にはしない

## 8. `answers jsonb` の扱い

### レビュー結果

- 席順生成だけなら `answers` は必須ではない
- `main_type_key`, `partner_type_key`, `center_force` があれば、初期の席順生成には足りる
- ただし匿名統計の `answer_summary` を作る場合、削除前の一時保持として `answers` があると集計しやすい

推奨:

- `answers` は一時保存として保持してよい
- イベント終了後3日で削除対象にする
- SQL最終化前に、`answers` を保存しない設計も比較する

保存しない設計の利点:

- 個別回答の取り扱いリスクを減らせる
- DBに残る一時データを少なくできる

保存する設計の利点:

- 匿名統計を後から作りやすい
- 回答傾向と席順の検証がしやすい

## 9. 既存検証フォームSupabaseとの分離

レビュー結果:

- `icebreak_centered_validation_feedback` とは混ぜない方針で問題ない
- organizerイベント系テーブルと検証フォームは責任範囲が違う
- 既存検証フォームは診断改善の自由記述・しっくり度を扱う
- organizerはイベント作成・参加者登録・席順生成を扱う

将来的に接続する場合:

- 個別参加者IDで直接つながない
- イベント単位や月次の匿名集計として扱う
- `validation_fit_summary` に入れる場合も、個人が特定されない粒度にする

## 10. index案の妥当性

### 妥当なindex

- `event_code`
- `host_key_hash`
- `status`
- `data_delete_at`
- `event_id`
- `main_type_key`
- `center_force`
- `deleted_at`
- `event_month`
- `event_hash`

### 追加候補

- `icebreak_events (status, data_delete_at)`
  - 自動削除対象を探すときに使う
- `icebreak_event_participants (event_id, deleted_at)`
  - イベント単位で未削除参加者を読むときに使う
- `icebreak_event_seatings (event_id, generated_at desc)`
  - 最新席順を読むときに使う

### 不要になる可能性があるindex

- `main_type_key`
  - イベント単位でしか集計しないなら単独indexは不要かもしれない
- `center_force`
  - 同じく全体検索をしないなら不要かもしれない
- `deleted_at`
  - 行ごと物理削除を採用するなら重要度は下がる

SQL最終化では、実際の読み方に合わせてindexを絞る。

## 11. RLS / service role 方針

レビュー結果:

- RLS有効化前提でよい
- public insert policyなしでよい
- server-only API経由でよい
- service role利用でよい
- クライアント直Supabaseは禁止でよい

理由:

- 参加者名、回答、席順など一時的な個別データを扱うため
- hostKeyやeventCodeの照合をAPI側で制御したいため
- 削除・匿名化の順序をサーバー側で保証したいため

注意:

- service roleはRLSをバイパスできるため、API側の入力検証と権限チェックが重要
- `SUPABASE_SERVICE_ROLE_KEY` はクライアントに出さない
- `.env.local` やVercel Environment Variablesでserver-only secretとして扱う

## 12. SQL案の修正候補

### このままでよいもの

- 4テーブル構成
- UUID主キー
- `created_at default now()`
- `event_code unique`
- `host_key_hash unique`
- `seats_per_table` 2〜8制約
- RLS有効化前提
- public insert policyなし
- 既存検証フォームSupabaseとの分離

### 修正した方がよいもの

- `event_hash` はnullableのままにし、必須化しない
- `events` をdeleted状態で残すなら、titleや日付をどこまで残すか決める
- 行削除を採用するなら、participants / seatings の `deleted_at` は必須ではない可能性がある
- 少人数イベントのaggregate粒度制御をSQL案または運用docsに追加する

### 次のSQL最終化前に決めるべきもの

- `host_key_hash` の生成方式
- HMAC用pepperの環境変数名と管理方針
- `data_delete_at` のJST基準
- `registration_close_at` の基準
- eventsを `status = deleted` で残すか物理削除するか
- `answers` を一時保存するか保存しないか
- aggregateを保存する最小参加人数

### 実装フェーズまで保留してよいもの

- hostKey再発行
- 詳細なRLS policy
- cronの実行基盤
- aggregate作成の細かいアルゴリズム
- validation feedbackとの匿名集計連携

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

## 推奨結論

- 4テーブル構成は妥当
- hostKeyは平文保存せずhash化する
- hash化はHMAC-SHA-256 + server-only pepperを優先候補にする
- `event_code` は参加者URL用なので平文保存でよい
- eventCodeはunique制約で衝突検知し、衝突時はAPI側で再生成する
- individual participants / seatings は削除対象にする
- eventsは `status = deleted` で残す案を優先するが、titleや日付をどこまで残すかは要判断
- 少人数イベントの匿名統計粒度には注意が必要
- SQL最終版を作る前に、`data_delete_at` と匿名統計粒度を決める
