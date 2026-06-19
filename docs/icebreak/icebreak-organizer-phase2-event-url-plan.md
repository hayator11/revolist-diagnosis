# Icebreak 33 organizer Phase 2 event URL plan

## 目的

Icebreak 33 organizer roadmap の Phase 2 に向けて、既存 `/host` のイベント作成APIを `/organizer` から再利用できるかを調査し、参加URL発行の最小実装方針を整理する。

今回のドキュメントは調査・設計メモであり、実装変更は行わない。

## 調査したファイル

- `src/app/research/icebreak-11-v1/host/IcebreakHostClient.tsx`
- `src/app/research/icebreak-11-v1/organizer/IcebreakOrganizerClient.tsx`
- `src/app/research/icebreak-11-v1/_components/IcebreakDiagnosisClient.tsx`
- `src/app/api/icebreak/event/route.ts`
- `src/app/api/icebreak/event/[hostKey]/route.ts`
- `src/app/api/icebreak/public/[eventCode]/route.ts`
- `src/app/api/icebreak/join/route.ts`
- `src/app/api/icebreak/seating/route.ts`
- `src/app/api/icebreak/reset/route.ts`
- `src/lib/icebreakEventStore.ts`
- `src/lib/icebreakEventSchema.ts`
- `src/lib/icebreakSeating.ts`
- `docs/icebreak/icebreak-organizer-implementation-roadmap.md`
- `docs/icebreak/icebreak-organizer-event-data-lifecycle-plan.md`

## 既存イベント作成APIの仕様

### `POST /api/icebreak/event`

既存のイベント作成APIは、`src/app/api/icebreak/event/route.ts` にある。

受け取る項目:

- `eventName`
  - 文字列化して `createIcebreakEvent` に渡す
  - 空の場合はストア側で `Icebreak 11 イベント` になる
- `eventDate`
  - string の場合のみ渡す
  - 未指定の場合はストア側で今日の日付になる
- `layoutType`
  - そのまま渡す
  - 未指定の場合はストア側で `island`
- `tableCapacity`
  - 数値化して渡す
  - 未指定の場合は `4`
  - ストア側で `2`〜`8` に丸められる
- `copyVariant`
  - string の場合のみ渡す
  - 未指定の場合は `default`

返す項目:

- `result: "success"`
- `event`
  - `id`
  - `eventCode`
  - `hostKey`
  - `eventName`
  - `layoutType`
  - `tableCapacity`
  - `copyVariant`
  - `createdAt`
  - `eventDate`
  - `status`
  - `expiresAt`
- `participantUrl`
  - `/research/icebreak-11-v1?event={eventCode}`
- `hostUrl`
  - `/research/icebreak-11-v1/host?key={hostKey}`

エラー時:

- `{ result: "error" }`
- HTTP 500

## eventCode / hostKey / URLの扱い

### `eventCode`

`eventCode` は `src/lib/icebreakEventStore.ts` で6文字のコードとして生成される。  
使用文字は `ABCDEFGHJKLMNPQRSTUVWXYZ23456789`。  
`eventCodeIndex` でイベントIDに紐づく。

参加者URLでは以下の形で使われる。

```text
/research/icebreak-11-v1?event={eventCode}
```

公開URLでは以下になる。

```text
https://revo.onokun.com/research/icebreak-11-v1?event={eventCode}
```

### `hostKey`

`hostKey` はUUIDを2つ連結した長い文字列として生成される。  
`hostKeyIndex` でイベントIDに紐づく。

既存 `/host` では以下の主催者URLとして返る。

```text
/research/icebreak-11-v1/host?key={hostKey}
```

Phase 2では、まず既存の `hostUrl` をそのまま表示してよい。  
将来的には正式運営者URLとして、以下に寄せる案もある。

```text
/research/icebreak-11-v1/organizer?key={hostKey}
```

ただし、この寄せ方はPhase 2ではまだ実装しない。  
まずは参加URL発行の流れを検証し、既存 `/host?key=` を壊さない。

## 現在の保存先と保存期間

現在の保存先は `src/lib/icebreakEventStore.ts` の `globalThis` 上の `Map`。

保持しているMap:

- `events`
- `eventCodeIndex`
- `hostKeyIndex`
- `participants`

イベント作成時の `expiresAt` は、現在以下の挙動。

- `eventDate` の `23:59:59.000Z` を基準にする
- そこから7日後を `expiresAt` にする

注意:

- 現在はメモリストアであり、永続保存ではない
- Vercel本番のサーバーレス環境では、プロセス再起動やインスタンス差でイベントが消える可能性がある
- `expiresAt` は保持されるが、自動削除処理はまだない
- 正式方針の「イベント終了後3日で削除」とはまだ一致していない

## `/organizer` の入力項目との差分

現在 `/organizer` にある項目:

- オフ会タイトル
- 開催日時
- 予定席数
- テーブル数
- 1卓人数

既存 `POST /api/icebreak/event` との対応:

| `/organizer` の項目 | 既存API項目 | 現状 |
| --- | --- | --- |
| オフ会タイトル | `eventName` | そのまま渡せる |
| 開催日時 | `eventDate` | 日付文字列なら渡せる。ただし時刻は保存できない |
| 予定席数 | なし | 保存できない。Phase 2では画面状態に留める案が安全 |
| テーブル数 | なし | 保存できない。既存seatingは `tableCapacity` からテーブル数を自動算出する |
| 1卓人数 | `tableCapacity` | 渡せる。ただし2〜8に丸められる |

既存APIにない項目:

- `expectedSeats`
- `tableCount`
- `eventStartAt`
- `eventEndAt`
- `dataDeleteAt`
- `registrationOpenAt`
- `registrationCloseAt`

## 参加者診断導線の既存実装

`src/app/research/icebreak-11-v1/_components/IcebreakDiagnosisClient.tsx` には、参加URLを受ける土台がある。

現在の流れ:

1. URLの `event` query を読む
2. `eventCode` として大文字化する
3. `/api/icebreak/public/{eventCode}` からイベント情報を取得する
4. イベント名を表示する
5. ニックネーム入力欄を表示する
6. ニックネームが未入力の場合は診断開始ボタンを無効にする
7. 33問回答後、`/api/icebreak/join` に `eventCode`, `nickname`, `answers` を送る
8. personal result page への遷移は止めない
9. 結果URLには `?event={eventCode}` を引き継ぐ

つまり、参加URLを発行できれば、参加者診断導線はすでに一定動く状態にある。

## Phase 2で既存APIをそのまま使えるか

選択肢:

- A. 既存 `POST /api/icebreak/event` をそのまま使う
- B. 既存APIに最小項目だけ追加する必要がある
- C. Phase 2ではURL発行の見た目だけに留める
- D. `/organizer` 専用APIを作る必要がある

現時点の判断は、A寄り。

理由:

- `/organizer` のオフ会タイトルは `eventName` として渡せる
- `/organizer` の1卓人数は `tableCapacity` として渡せる
- 既存APIは `participantUrl` と `hostUrl` を返せる
- 参加者側はすでに `?event={eventCode}` を読んで診断に入れる
- `/api/icebreak/join` でイベント紐づけもできる
- `/api/icebreak/seating` で既存席順生成もできる

ただし、Phase 2で完全に正式仕様へ寄せるには不足がある。

不足:

- 予定席数を保存できない
- テーブル数を保存できない
- 開催時刻を保存できない
- データ削除予定日を保存できない
- 正式方針のイベント終了後3日削除には未対応
- メモリストアなので本番永続性が弱い

Phase 2では、まずAの「既存APIをそのまま使う」を推奨する。  
予定席数・テーブル数は画面上の入力として残し、実際のイベント作成APIには送らない、または送っても保存しない前提にする。

Bの「既存APIに最小項目追加」は、Phase 2.5 または Phase 3以降で検討する。  
Dの `/organizer` 専用APIは避けたい。既存 `/host` と二重管理になりやすいため。

## 参加URLの形式

Phase 2では、既存形式をそのまま使う。

相対URL:

```text
/research/icebreak-11-v1?event={eventCode}
```

公開URL:

```text
https://revo.onokun.com/research/icebreak-11-v1?event={eventCode}
```

実装時は、APIが返す `participantUrl` に `window.location.origin` を付けて表示する。

例:

```ts
const fullParticipantUrl = `${window.location.origin}${participantUrl}`;
```

## 運営者URLの扱い

既存APIは、主催者URLとして以下を返す。

```text
/research/icebreak-11-v1/host?key={hostKey}
```

Phase 2では、これをそのまま表示するのが安全。

理由:

- 既存 `/host?key=` はイベント取得、参加者一覧、席順生成、resetに対応している
- `/organizer?key=` はまだ実装されていない
- いきなり `/organizer` にkey管理を寄せると、既存 `/host` との責任範囲が大きく変わる

Phase 2の扱い:

- `/organizer` で参加URLを発行する
- 返ってきた `hostUrl` も表示する
- 「主催者確認URL」としてコピーできるようにする
- ただし、主催者URLの遷移先は既存 `/host?key=` のまま

将来案:

- `/organizer?key={hostKey}` で参加者一覧・席順生成まで扱う
- `/host` は内部検証用または互換導線にする
- この移行はPhase 3以降に切る

## Phase 2の最小実装案

次に実装するなら、以下の最小案がよい。

1. `/organizer` の参加URL発行エリアに「参加URLを発行する」ボタンを追加する
2. ボタン押下で既存 `POST /api/icebreak/event` を呼ぶ
3. request body は最小にする
   - `eventName`: `/organizer` のオフ会タイトル
   - `eventDate`: `/organizer` の開催日時から日付として扱える値
   - `layoutType`: `"island"`
   - `tableCapacity`: `/organizer` の1卓人数
4. 返ってきた `participantUrl` を表示する
5. 返ってきた `hostUrl` を表示する
6. 参加URLコピー用ボタンを置く
7. 主催者確認URLコピー用ボタンを置く
8. 予定席数・テーブル数はPhase 2では画面状態として残す
9. 保存は既存メモリストアのまま
10. Supabaseには接続しない
11. 自動削除はまだ実装しない

表示文言案:

```text
参加URLを発行する
参加者に配布する診断URLを作成します。
現在はメモリ上の試作保存です。本番イベント運用前には永続化が必要です。
```

発行後の表示案:

```text
参加者用URL
https://revo.onokun.com/research/icebreak-11-v1?event=XXXXXX

主催者確認URL
https://revo.onokun.com/research/icebreak-11-v1/host?key=...
```

## Phase 2でまだやらないこと

- Supabase保存
- 本番DB接続
- RLS
- cron
- 自動削除
- データ削除実装
- ログイン
- 決済
- QR受付
- CSV出力
- LINE連携
- 11タイプ理由の高度化
- `centeredResult` を使ったマッチング
- 既存診断ロジック変更
- 設問変更
- 重み変更
- `/organizer` 専用API作成
- `/host` の削除
- `/organizer?key=` への本格移行

## リスク

### メモリストアの永続性

現在のイベント保存は `globalThis` の `Map`。  
Vercel本番では、以下の理由でイベントが消える可能性がある。

- サーバーレス関数のインスタンスが変わる
- プロセスが再起動する
- デプロイでメモリが消える
- 複数インスタンス間でMapが共有されない

Phase 2では、このリスクを受け入れて「流れの検証」と割り切る。  
本番イベント運用前にはSupabase化が必要。

### 保存期間仕様との差分

正式方針では、イベント終了後3日まで一時データを保持し、その後削除する。  
現在のメモリストアでは `expiresAt` はイベント日から7日後であり、自動削除処理もまだない。

Phase 2では、保存期間の本実装まではしない。  
画面上で「試作保存」「正式運用前に永続化が必要」と明示する。

### `/organizer` と `/host` の責任分離

Phase 2で `/organizer` からイベントを作り、管理URLは `/host?key=` に出す場合、運営者体験としては2画面に分かれる。  
ただし、既存機能を壊さず参加URL発行だけを検証するにはこの形が安全。

将来的には `/organizer?key=` へ寄せるが、Phase 2ではまだやらない。

## 推奨結論

Phase 2では、既存 `POST /api/icebreak/event` をできるだけそのまま再利用する。

次の最小実装:

- `/organizer` の参加URL発行エリアに「参加URLを発行する」ボタンを追加する
- 既存 `POST /api/icebreak/event` を呼ぶ
- 返ってきた参加URLを表示する
- 返ってきた主催者URLも表示する
- コピーできるボタンを置く
- 予定席数・テーブル数はPhase 2では画面上の入力に留める
- 1卓人数は `tableCapacity` として渡す
- Supabase永続化はまだ行わない
- 自動削除はまだ行わない
- 既存 `/host` を壊さない

判断としては、A「既存 `POST /api/icebreak/event` をそのまま使う」を採用するのがよい。  
B「最小項目追加」は、予定席数やテーブル数を本当に保存したくなった時点で別チケットに切る。
