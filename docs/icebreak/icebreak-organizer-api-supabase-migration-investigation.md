# Icebreak 33 organizer API Supabase migration investigation

## 目的

Icebreak 33 / レボリスト診断のオフ会オーナー機能について、既存のイベントURL配布型フローをSupabase永続化へ移行する前に、現在のAPI、画面、保存方式、Supabase利用状況を整理する。

今回は調査docs作成のみであり、API改修、UI改修、Supabase操作、SQL実行、環境変数変更は行わない。

## 現在の問題

`/research/icebreak-11-v1/organizer` から参加URLと主催者確認URLを発行できるが、本番Vercel環境では発行後にイベントを参照できないことがある。

主な原因候補は、現在のイベント保存が `globalThis` 上のメモリストアであり、Vercel本番のサーバーレス環境ではPOSTでイベントを作成した実行環境と、GETでイベントを読む実行環境が一致する保証がないこと。

Supabase側では、オフ会オーナー機能用の以下4テーブルが作成済み。

- `icebreak_events`
- `icebreak_event_participants`
- `icebreak_event_seatings`
- `icebreak_event_aggregate_stats`

ただし、現時点のAPIはまだこれらのテーブルを参照していない。

## 調査したファイル

- `src/app/api/icebreak/event/route.ts`
- `src/app/api/icebreak/event/[hostKey]/route.ts`
- `src/app/api/icebreak/public/[eventCode]/route.ts`
- `src/app/api/icebreak/join/route.ts`
- `src/app/api/icebreak/seating/route.ts`
- `src/app/api/icebreak/reset/route.ts`
- `src/lib/icebreakEventStore.ts`
- `src/lib/icebreakEventSchema.ts`
- `src/lib/icebreakSeating.ts`
- `src/app/research/icebreak-11-v1/organizer/IcebreakOrganizerClient.tsx`
- `src/app/research/icebreak-11-v1/host/IcebreakHostClient.tsx`
- `src/app/research/icebreak-11-v1/_components/IcebreakDiagnosisClient.tsx`
- `src/lib/supabase/server.ts`
- `src/app/api/icebreak/centered-validation/route.ts`

## 対象API

Supabase永続化移行の直接対象になる既存APIは以下。

- `POST /api/icebreak/event`
- `GET /api/icebreak/event/[hostKey]`
- `GET /api/icebreak/public/[eventCode]`
- `POST /api/icebreak/join`
- `POST /api/icebreak/seating`
- `POST /api/icebreak/reset`

## 対象画面

- `/research/icebreak-11-v1/organizer`
- `/research/icebreak-11-v1/host`
- `/research/icebreak-11-v1?event={eventCode}`

## 既存の保存方式

現在のイベント保存は `src/lib/icebreakEventStore.ts` の `globalThis` メモリストア。

保持している主な構造は以下。

- `events: Map<string, IcebreakEventRecord>`
- `eventCodeIndex: Map<string, string>`
- `hostKeyIndex: Map<string, string>`
- `participants: Map<string, IcebreakParticipantRecord>`

このため、同一Node.js実行環境内では動くが、サーバーレス環境の複数インスタンス間では共有されない。デプロイ、プロセス再起動、別インスタンスへのルーティングでも消える可能性がある。

## 現在のPOST処理

### `POST /api/icebreak/event`

`src/app/api/icebreak/event/route.ts` は `createIcebreakEvent` を呼び出す。

受け取る主な入力:

- `eventName`
- `eventDate`
- `layoutType`
- `tableCapacity`
- `copyVariant`

返す主な値:

- `event`
- `participantUrl`
- `hostUrl`

現在のURL形式:

- 参加者用URL: `/research/icebreak-11-v1?event={eventCode}`
- 主催者確認URL: `/research/icebreak-11-v1/host?key={hostKey}`

### `POST /api/icebreak/join`

`src/app/api/icebreak/join/route.ts` は `addIcebreakParticipant` を呼び出す。

受け取る主な入力:

- `eventCode`
- `nickname`
- `answers`

処理内容:

- `eventCode` からメモリストア上のイベントを取得
- `calculateIcebreakResult(answers)` で結果を計算
- `forceScores`
- `centerForce`
- `subForce`
- `mainTypeKey`
- `answers`
- `nickname`
- `joinedAt`

を参加者レコードとしてメモリストアに保存する。

### `POST /api/icebreak/seating`

`src/app/api/icebreak/seating/route.ts` は `generateIcebreakEventSeating(hostKey)` を呼び出す。

処理内容:

- `hostKey` からイベントを取得
- 参加者の `centerForce` と `joinedAt` を使って `generateIcebreakSeating` を実行
- 参加者レコードに `tableNo`、`seatNo`、`seatReason` を書き戻す

### `POST /api/icebreak/reset`

`src/app/api/icebreak/reset/route.ts` は `resetIcebreakEvent(hostKey)` を呼び出す。

処理内容:

- `createIcebreakAnonymousSummary` で匿名サマリーを作る
- participantsを削除
- eventを削除
- `eventCodeIndex` と `hostKeyIndex` を削除

現時点では匿名サマリーはAPIレスポンスで返されるだけで、Supabaseには保存していない。

## 現在のGET処理

### `GET /api/icebreak/event/[hostKey]`

`getIcebreakEventSnapshot(hostKey)` を呼び出す。

主催者画面用に以下を返す。

- `event`
- `participants`
- `tables`

イベントが見つからない場合は `404` と `result: "not_found"` を返す。

### `GET /api/icebreak/public/[eventCode]`

`getIcebreakEventByCode(eventCode.toUpperCase())` を呼び出す。

参加者診断ページ用に、公開してよいイベント情報だけを返す。

- `eventCode`
- `eventName`
- `eventDate`
- `layoutType`
- `tableCapacity`
- `status`

`status !== "open"` または未存在の場合は `404`。

## 現在のeventCode / hostKeyの扱い

### eventCode

`eventCode` は `CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"` から6文字で生成される。

現在はメモリストアの `eventCodeIndex` に存在するかを確認し、衝突した場合は再生成する。

Supabase移行後は、DBの `event_code unique` 制約で衝突を検知し、API側で再生成する設計に寄せる必要がある。

### hostKey

`hostKey` は `crypto.randomUUID()` を2回使い、ハイフンを除いた文字列を連結して生成している。

現在は平文の `hostKey` をメモリストア上の `hostKeyIndex` に保持している。

Supabase移行後は、DBに平文hostKeyを保存せず、server-only API側でHMAC-SHA-256 + server-only pepperによる `host_key_hash` を作って照合する方針にする。

## 現在の `/organizer` 側のAPI呼び出し

`src/app/research/icebreak-11-v1/organizer/IcebreakOrganizerClient.tsx` は、参加URL発行時に `POST /api/icebreak/event` を呼び出している。

request body:

- `eventName: meetupTitle`
- `eventDate: normalizeEventDateForApi(eventDate)`
- `layoutType: "island"`
- `tableCapacity: seatsPerTable`
- `copyVariant: "default"`

response:

- `event.eventCode`
- `participantUrl`
- `hostUrl`

画面では `window.location.origin` を付けて完全URLとして表示する。

なお、`expectedSeats` と `tableCount` は現時点ではAPIへ送っておらず、画面状態に留まっている。

## `/organizer` の手動追加処理

`/organizer` には、診断済み参加者の結果URLを貼って仮登録するフロント完結の処理も残っている。

対応URL形式:

- `/research/icebreak-11-v1/result/{encoded}`
- `/research/icebreak-11-v1/result?id={encoded}`
- encoded id単体

処理内容:

- 結果URLから encoded result id を抽出
- `decodeIcebreakAnswers` で回答を復元
- `isValidIcebreakAnswers` で検証
- `calculateIcebreakResult` で `mainTypeKey`、`partnerTypeKey`、`centerForce` を復元
- 画面内状態に参加者を追加

この手動追加機能は、既存APIやSupabaseには保存していない。

## `/organizer` の席順生成処理

`/organizer` の手動追加参加者に対する席順生成は、画面内の最小ロジックで行っている。

主な方針:

- `centerForce` の偏りを減らす
- `tableCount` と `seatsPerTable` の範囲で配置
- 人数が席数を超えた場合はエラー表示
- テーブル理由を表示

これは既存 `POST /api/icebreak/seating` とは別の、フロント完結のプロトタイプ処理。

## `/host` 側のAPI呼び出し

`src/app/research/icebreak-11-v1/host/IcebreakHostClient.tsx` は、既存のメモリストアAPIを直接使っている。

主な呼び出し:

- `POST /api/icebreak/event`
- `GET /api/icebreak/event/{hostKey}`
- `POST /api/icebreak/seating`
- `POST /api/icebreak/reset`

`hostKey` がない場合はイベント作成画面として動き、`hostKey` がある場合は主催者確認画面として参加者一覧、force分布、座席マップ、リセットを扱う。

## 参加者診断導線

`src/app/research/icebreak-11-v1/_components/IcebreakDiagnosisClient.tsx` は、URLクエリ `event` を読む。

イベント参加時の流れ:

1. `eventCode` があれば `GET /api/icebreak/public/{eventCode}` を呼ぶ
2. イベント名を表示する
3. ニックネーム入力欄を表示する
4. ニックネーム未入力では診断開始できない
5. 33問回答後、`POST /api/icebreak/join` を `keepalive` 付きで呼ぶ
6. 個人結果ページへ遷移する
7. 既存 `/api/feedback` にも診断回答ログを送る

イベント参加の保存失敗は、個人結果ページへの遷移をブロックしない設計になっている。

## Supabase既存実装の有無

既存のSupabase利用は、主に検証フォーム保存で使われている。

- `src/lib/supabase/server.ts`
- `src/app/api/icebreak/centered-validation/route.ts`

`createSupabaseServerClient()` はserver-only用途で、`@supabase/supabase-js` の `createClient` を使う。

既存の検証フォームAPIは `icebreak_centered_validation_feedback` にinsertする。

オフ会オーナー機能用4テーブルは作成済みだが、現時点では既存APIからは未使用。

## 利用候補の環境変数名

既存Supabase server clientで参照している環境変数名:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

hostKey hash用にdocs上で候補として整理済みの環境変数名:

- `ICEBREAK_HOST_KEY_PEPPER`

実値は表示しない。`.env.local` は参照・表示・変更しない。

## service roleをserver-onlyで使う方針

Supabase永続化移行後も、イベント作成、イベント取得、参加者登録、席順生成、リセット、匿名統計作成はNext.js API route経由で行う。

`SUPABASE_SERVICE_ROLE_KEY` はサーバー側だけで扱い、ブラウザに出さない。

## clientからSupabaseへ直接insertしない方針

参加者画面、`/organizer`、`/host` からSupabaseへ直接insertしない。

クライアントは既存と同じく `/api/icebreak/*` を呼び、API routeがserver-onlyでSupabaseを読む・書く。

public insert policyは作らない方針を維持する。

## 既存AI玉手箱診断系と混ぜない方針

Supabaseプロジェクトは `ai-fit-diagnosis` だが、無料版運用のため同じSupabaseプロジェクト内に以下が同居している。

- AI玉手箱診断
- レボリスト診断 / Icebreak 33

今回の移行対象は、Icebreak 33 / レボリスト診断の中でも、オフ会オーナー / オフ会運営者機能のみ。

以下には触れない。

- `ai_*` テーブル
- `diagnosis_*` テーブル
- `tamatebako_*` テーブル
- AI玉手箱診断本体

## 既存 `icebreak_centered_validation_feedback` と混ぜない方針

`icebreak_centered_validation_feedback` はIcebreak 33の検証フォーム用テーブル。

オフ会オーナー機能のイベント運営データとは目的、保存期間、削除方針が異なるため、混ぜない。

以下は変更しない。

- `icebreak_centered_validation_feedback`
- `/api/icebreak/centered-validation`
- 検証フォーム
- 既存 `/api/feedback`
- GAS連携
- payload形式

## Supabase移行時の対応候補

### `POST /api/icebreak/event`

移行後の想定:

- eventCodeを生成
- hostKeyを生成
- server-only pepperで `host_key_hash` を作成
- `icebreak_events` にinsert
- `participantUrl` と `hostUrl` は既存形式を維持

既存URL形式を変えないことが重要。

### `GET /api/icebreak/event/[hostKey]`

移行後の想定:

- URLの `hostKey` をserver-onlyでhash化
- `icebreak_events.host_key_hash` でイベント取得
- `icebreak_event_participants` を取得
- 最新の `icebreak_event_seatings` があれば取得
- 既存レスポンス形状にできるだけ合わせる

### `GET /api/icebreak/public/[eventCode]`

移行後の想定:

- `icebreak_events.event_code` で公開イベント取得
- `status = open` を確認
- 参加者に見せてよい情報だけ返す

### `POST /api/icebreak/join`

移行後の想定:

- `eventCode` でイベント取得
- 登録期間、`status`、削除期限を確認
- `calculateIcebreakResult` は既存ロジックを使う
- `icebreak_event_participants` に参加者をinsert
- 個別回答 `answers` は一時保存・削除対象

### `POST /api/icebreak/seating`

移行後の想定:

- `hostKey` hashでイベント取得
- `icebreak_event_participants` から参加者一覧を取得
- 既存 `generateIcebreakSeating` をできるだけ再利用
- `icebreak_event_seatings` に結果を保存
- 必要なら参加者行へ `tableNo` 等を戻すか、seatings側に集約するかを設計で決める

### `POST /api/icebreak/reset`

移行後の想定:

- `hostKey` hashでイベント取得
- 匿名統計を `icebreak_event_aggregate_stats` に作成
- participants / seatings の個別データを削除
- eventsは `status = deleted` にする
- `host_key_hash` やtitleを削除・無効化する

## 次の設計課題

- 既存レスポンス形状をどこまで維持するか
- `hostKey` hash化関数をどこに置くか
- `ICEBREAK_HOST_KEY_PEPPER` 未設定時のエラー方針
- eventCode衝突時の再生成処理
- `eventDate` と将来の `event_start_at` / `event_end_at` の扱い
- `expiresAt` と新スキーマの `data_delete_at` の対応
- `expectedSeats` / `tableCount` をどのPhaseで保存対象にするか
- participantsに `tableNo` / `seatNo` / `seatReason` を持たせ続けるか、seatingsに寄せるか
- reset時に匿名統計をどの粒度で作るか
- 少人数イベントの匿名統計抑制をAPIでどう実装するか
- 既存メモリストアを段階的に残すか、一括でSupabaseへ切り替えるか
- 本番移行前の検証手順

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

現在のイベントURL配布型フローは、画面とAPIの導線としては成立しているが、保存先が `globalThis` メモリストアであるため、本番Vercel環境でのイベント参照には向かない。

Supabase移行では、既存URL形式と既存クライアント導線をできるだけ維持しつつ、`/api/icebreak/*` の内部保存先をserver-only Supabase処理へ置き換えるのが自然。

次は、`/api/icebreak/event` を中心に、既存レスポンス互換、hostKey hash化、eventCode衝突処理、既存検証フォームとの分離を明記したSupabase永続化移行設計docsを作るのがよい。
