# Icebreak 33 organizer event data lifecycle plan

## 目的

Icebreak 33 のオフ会運営者向け機能について、正式なイベント登録、参加者診断、席順マッチング、データ保存期間を整理する。

現在は以下の2系統がある。

- `/research/icebreak-11-v1/host`
  - イベントコード方式の実験的な主催者画面
  - メモリストアでイベント、参加者、席順を扱う
- `/research/icebreak-11-v1/organizer`
  - 診断結果URLを運営者が貼り付けるフロント完結プロトタイプ
  - 保存なし、API接続なし

正式運用では、結果URL手入力型だけではなく、運営者がイベントを作成し、参加者用URLを配布し、参加者が名前またはニックネームを入れて診断し、その結果をもとに席順を作る流れへ寄せる。

今回のドキュメントは設計メモであり、実装変更は行わない。

## 調査したファイル

- `src/app/research/icebreak-11-v1/host/page.tsx`
- `src/app/research/icebreak-11-v1/host/IcebreakHostClient.tsx`
- `src/app/research/icebreak-11-v1/organizer/page.tsx`
- `src/app/research/icebreak-11-v1/organizer/IcebreakOrganizerClient.tsx`
- `src/app/api/icebreak/event/route.ts`
- `src/app/api/icebreak/event/[hostKey]/route.ts`
- `src/app/api/icebreak/public/[eventCode]/route.ts`
- `src/app/api/icebreak/join/route.ts`
- `src/app/api/icebreak/seating/route.ts`
- `src/app/api/icebreak/reset/route.ts`
- `src/lib/icebreakEventStore.ts`
- `src/lib/icebreakSeating.ts`
- `src/lib/icebreakEventSchema.ts`
- `docs/icebreak/icebreak-meetup-organizer-tool-plan.md`
- `docs/icebreak/icebreak-host-organizer-comparison.md`

## 既存実装の現在地

既存 `/host` は、すでに正式運営者フローの土台に近い。

- `POST /api/icebreak/event`
  - イベントを作成する
  - `eventCode` と `hostKey` を発行する
  - 参加者URL `/research/icebreak-11-v1?event={eventCode}` を返す
  - 主催者URL `/research/icebreak-11-v1/host?key={hostKey}` を返す
- `GET /api/icebreak/public/[eventCode]`
  - 参加者向けにイベント情報を返す
- `POST /api/icebreak/join`
  - `eventCode`, `nickname`, `answers` を受け取る
  - `calculateIcebreakResult` で結果を計算する
  - イベントに参加者結果を紐づける
- `POST /api/icebreak/seating`
  - `hostKey` をもとに席順を生成する
  - `generateIcebreakSeating` で `centerForce` を分散する
- `POST /api/icebreak/reset`
  - 匿名統計を作成する
  - メモリ上のイベント・参加者データを削除する

一方で、現在の保存は `src/lib/icebreakEventStore.ts` の `globalThis` 上の `Map` であり、本番の永続管理には向かない。  
正式版では、保存期間、削除、匿名統計化を前提にしたDB設計が必要になる。

## 正式なオフ会運営者フロー

正式版では、以下の流れを基本にする。

1. 運営者が `/research/icebreak-11-v1/organizer` を開く
2. オフ会タイトルを登録する
3. 開催日時を登録する
4. 予定席数を登録する
5. 1卓あたりの人数を登録する
6. 参加者用URLを発行する
7. 参加者用URLを参加者に配布する
8. 参加者が名前またはニックネームを入力する
9. 参加者が Icebreak 33 に回答する
10. 診断結果がイベントに紐づいて登録される
11. 運営者画面に参加者一覧が表示される
12. 11タイプと `centerForce` を使って席順マッチングする
13. 運営者画面に席順とマッチング理由が表示される
14. イベント終了後3日までは席順確認のためデータを保存する
15. イベント終了後3日を過ぎたら、参加者名・席順・個別紐づきデータを削除する
16. 匿名化された診断統計だけをレボリスト診断側に蓄積する

この流れにすると、運営者が結果URLを手作業で集める必要がなくなり、参加者も自然に診断からイベント参加へ進める。

## `/host` と `/organizer` の役割再整理

### `/host`

既存 `/host` は、イベントコード方式の実験的主催者画面として価値がある。

強み:

- すでにイベント作成ができる
- `eventCode` と `hostKey` の仕組みがある
- 参加URLを発行できる
- 参加者が診断からイベントに入れる
- `join` APIで診断結果をイベントに紐づけられる
- `seating` APIで席順を生成できる
- `reset` APIで匿名統計化と削除の入口がある

弱み:

- URL名が外部向けに少し分かりにくい
- メモリストア前提で本番永続性に課題がある
- 予定席数の概念が薄く、主に1卓人数で席順を作る
- 11タイプベースのマッチング理由がまだ薄い
- 外部運営者向けの説明やデータ保存期間の同意導線が足りない

### `/organizer`

既存 `/organizer` は、正式な外部運営者向けURLとして育てる候補にする。

現在の役割:

- 診断済み参加者の結果URLを運営者が貼り付ける
- `decodeIcebreakAnswers` と `calculateIcebreakResult` で結果を復元する
- `mainTypeKey`, `partnerTypeKey`, `centerForce` を表示する
- フロント完結で席順を試作する

正式版での役割:

- 外部運営者に案内する正式URLにする
- イベント登録画面にする
- 参加URLを発行する
- 参加者一覧と席順生成を扱う
- 既存 `/host` のイベントコード方式や seating API を取り込む

### 推奨整理

現時点では、以下の整理が自然。

- `/host` は既存の実験的主催者画面として残す
- `/organizer` は正式な外部運営者向け画面候補として育てる
- 既存 `/host` のイベントコード方式、`join` API、`seating` API、reset思想は再利用候補にする
- 将来的には `/organizer` に正式導線を寄せ、`/host` は内部検証用または互換導線として扱う

## 参加者側の流れ

参加者URLの基本形:

```text
/research/icebreak-11-v1?event={eventCode}
```

参加者がやること:

1. 参加者URLを開く
2. イベント名を確認する
3. 名前またはニックネームを入力する
4. データ利用説明を読む
5. 席順マッチングに使われることを確認する
6. Icebreak 33 に回答する
7. 結果を見る
8. 診断結果がイベントに紐づいて登録される

参加者に明示すること:

- 本名は必須ではない
- ニックネームでよい
- 診断結果は席順マッチングに使われる
- 結果は個人の優劣を決めるものではない
- イベント終了後3日で、イベント紐づきの参加者名・席順・個別回答データは削除される
- 匿名統計だけが、診断改善やイベント設計のために残る

## 席順マッチングの考え方

正式版の席順は、既存のforce分散に加えて、11タイプの役割特性を使う。

使う要素:

- `mainTypeKey`
- `partnerTypeKey`
- `centerForce`
- 11タイプごとの役割特性
- 参加者数
- テーブル数
- 1卓あたりの人数

基本方針:

- 同じ11タイプを固めすぎない
- 同じforceを固めすぎない
- `partnerTypeKey` を参考にする
- 起点役と受け止め役を近くに置く
- 発想型と整理型を組ませる
- `revolist` / `crazist` は孤立させない
- `arranger` / `communicator` は橋渡しとして分散する
- `logicalmaister` / `inforader` は整理役として分散する
- `soulowner` / `movmentor` は受け止め役として配置する
- `maxdesigner` は全体調整役として使う

役割ごとの配置観点:

- `revolist`
  - 未来に火を灯す起点役
  - `soulowner`, `movmentor`, `logicalmaister`, `arranger` などと近いと話が動きやすい
- `crazist`
  - 違和感から可能性を見つける起点役
  - 受け止め役や構造化できる人の近くに置く
- `arranger`
  - 人・情報・役割を配置する橋渡し役
  - テーブル内の流れを作りやすい位置に分散する
- `communicator`
  - 会話の入口とご縁の循環を作る役割
  - 初対面のテーブルにいると話が始まりやすい
- `logicalmaister`
  - 感覚や発想を理解される構造へ変える役割
  - 起点役や発想型と組むと話が進みやすい
- `imagemaister`
  - 想いや空気を伝わる形にする役割
  - 企画や世界観の話があるテーブルで力を出しやすい
- `inforader`
  - 情報を判断材料と知恵に変える役割
  - 1テーブルに偏りすぎず、整理役として分散する
- `premiercrafter`
  - 価値を信頼される品質へ育てる役割
  - アイデアや企画を具体化する会話に近いと動きやすい
- `soulowner`
  - 本音と挑戦が続く心理的土台を作る役割
  - 起点役の近くにいると、挑戦の話が続きやすい
- `movmentor`
  - 人の挑戦を具体的な一歩へ変える役割
  - 迷っている人や起点役の近くに置くと動きが生まれやすい
- `maxdesigner`
  - 選択肢を広げ、未来の可能性を設計する役割
  - テーブル全体の会話を広げる中心寄りの役割として扱える

## 運営者に表示する席順情報

運営者画面では、席順だけでなく、なぜその配置なのかを短く表示する。

表示候補:

- テーブル番号
- 席番号
- 参加者名またはニックネーム
- `mainTypeKey`
- 役割表示名
- `partnerTypeKey`
- `centerForce`
- 参加者ごとのマッチング理由
- テーブル全体の理由
- 注意メモ

理由文の例:

- 「起点を作る人」と「受け止める人」が近くなるようにしました
- 「発想型」と「整理型」が会話しやすい構成です
- 同じforceが固まりすぎないように分散しました
- このテーブルは初対面でも話が始まりやすい組み合わせです
- `arranger` / `communicator` が会話の入口になりやすいテーブルです

注意メモの例:

- 参加者数が席数を超えている場合は、席数またはテーブル数の見直しを促す
- 同じタイプが多い場合は、そのタイプが多いことを事実として表示する
- 「相性が悪い」ではなく「違う強みを持つ」と表現する

## データを2種類に分ける設計

正式版では、データを以下の2種類に分ける。

### A. イベント運営用の一時データ

イベント当日運営のために必要なデータ。  
席順確認のため、イベント終了後3日まで保存し、その後削除する。

例:

- `eventId`
- `eventCode`
- `hostKey`
- `title`
- `eventDate`
- `eventStartAt`
- `eventEndAt`
- `registrationOpenAt`
- `registrationCloseAt`
- `dataDeleteAt`
- `expectedSeats`
- `tableCount`
- `seatsPerTable`
- `status`
- `participants`
  - `participantId`
  - `displayName`
  - `answers`
  - `mainTypeKey`
  - `partnerTypeKey`
  - `centerForce`
  - `resultSummary`
  - `joinedAt`
- `seatingResult`
- `seatingGeneratedAt`

保持する理由:

- 当日席順を作るため
- 運営者が参加者一覧を確認するため
- イベント終了直後に席順を見返せるようにするため

削除する理由:

- 参加者名を長期保存しない
- 個別回答とイベント参加者を長期に紐づけない
- データ蓄積量を抑える

### B. レボリスト診断側に蓄積する匿名統計データ

診断改善やイベント設計のために残すデータ。  
個人名、席順、個別参加者IDは保持しない。

例:

- `eventId` はハッシュ化または非保持
- `mainTypeKey`
- `partnerTypeKey`
- `centerForce`
- force分布
- 11タイプ分布
- 回答傾向の集計
- 参加者数
- テーブルごとのforce構成
- テーブルごとの11タイプ構成
- 検証フォームと接続できる場合の匿名 `fit_score` 集計

保持しないもの:

- 参加者名
- 連絡先
- 個別参加者ID
- 個別の席順
- イベント参加者と回答の直接紐づき
- 運営者URLの `hostKey`

## データ保存期間の仕様

正式版では、保存期間を明確にする。

- オフ会運営者は、オフ会開始1週間前からイベント登録・参加者登録を開始できる
- イベント終了後3日までは席順確認のためデータを保存する
- イベント終了後3日を過ぎたら、イベント運営用の参加者名・席順・個別紐づきデータは削除する
- 匿名統計だけを残す
- これによりデータ蓄積量を抑える
- 個人情報や参加者名を長期保存しない設計にする

期間例:

| タイミング | 状態 | データ |
| --- | --- | --- |
| イベント開始8日前以前 | 登録前 | イベント作成不可、または下書き扱い |
| イベント開始7日前 | 登録開始 | 参加者登録可能 |
| イベント当日 | 運営中 | 参加者一覧、席順、理由を表示 |
| イベント終了後3日以内 | 確認期間 | 運営者が席順を見返せる |
| イベント終了後3日超過 | 削除後 | 匿名統計のみ保持 |

参加者向け説明文には、以下の趣旨を入れる。

```text
入力した名前またはニックネーム、診断結果とイベント席順の紐づきは、イベント終了後3日まで運営確認のために保存されます。
その後、個別の参加者名・席順・回答との紐づきは削除し、匿名化した集計だけを診断改善のために残します。
```

## Supabaseを使う場合の将来DB設計案

今回はテーブル作成はしない。  
将来Supabaseへ進む場合の候補を整理する。

### `icebreak_events`

イベント本体。

カラム案:

- `id uuid primary key`
- `created_at timestamptz`
- `updated_at timestamptz`
- `event_code text unique`
- `host_key_hash text`
- `title text`
- `event_date date`
- `event_start_at timestamptz`
- `event_end_at timestamptz`
- `registration_open_at timestamptz`
- `registration_close_at timestamptz`
- `data_delete_at timestamptz`
- `expected_seats integer`
- `table_count integer`
- `seats_per_table integer`
- `status text`
- `copy_variant text`

方針:

- `hostKey` は平文保存を避け、可能ならハッシュ化する
- `data_delete_at` を自動削除判断に使う

### `icebreak_event_participants`

イベント参加者の一時データ。

カラム案:

- `id uuid primary key`
- `event_id uuid references icebreak_events(id)`
- `created_at timestamptz`
- `display_name text`
- `answers jsonb`
- `main_type_key text`
- `partner_type_key text`
- `center_force text`
- `sub_force text`
- `result_summary jsonb`
- `joined_at timestamptz`
- `deleted_at timestamptz`

方針:

- イベント終了後3日で削除対象
- 参加者名と個別回答は長期保持しない
- 削除前に匿名統計へ集計する

### `icebreak_event_seatings`

席順生成結果の一時データ。

カラム案:

- `id uuid primary key`
- `event_id uuid references icebreak_events(id)`
- `created_at timestamptz`
- `generated_at timestamptz`
- `algorithm_version text`
- `tables jsonb`
- `table_reasons jsonb`
- `notes text`
- `deleted_at timestamptz`

方針:

- 運営者がイベント後に見返せる期間だけ保持する
- 個別参加者IDや席順は匿名統計へは残さない

### `icebreak_event_aggregate_stats`

匿名統計。

カラム案:

- `id uuid primary key`
- `created_at timestamptz`
- `event_hash text`
- `event_month text`
- `participant_count integer`
- `main_type_distribution jsonb`
- `partner_type_distribution jsonb`
- `center_force_distribution jsonb`
- `answer_summary jsonb`
- `table_force_patterns jsonb`
- `table_role_patterns jsonb`
- `validation_fit_summary jsonb`

方針:

- 個人名を含めない
- 個別参加者IDを含めない
- 席順の個別対応を含めない
- イベントIDも必要ならハッシュ化し、運営者・参加者が特定されない粒度にする

## 自動削除または期限切れ処理案

将来の実装候補:

- cronで期限切れイベントを確認する
- `data_delete_at < now()` のイベントを対象にする
- 削除前に匿名統計へ集計する
- 参加者名、席順、回答個別データを削除する
- `icebreak_event_aggregate_stats` だけ残す
- 手動resetで早期削除できるようにする
- reset時も匿名統計を作成してから一時データを削除する

削除処理の流れ:

1. 対象イベントを取得する
2. 参加者分布と席順パターンを集計する
3. `icebreak_event_aggregate_stats` に保存する
4. `icebreak_event_seatings` を削除する
5. `icebreak_event_participants` を削除する
6. `icebreak_events` を終了済み・削除済みにする、または削除する

注意:

- 削除処理は二重実行されても壊れないようにする
- 匿名統計作成に失敗した場合は、再試行できるようにする
- 個人情報をログに出さない

## 初期実装方針

次に実装する場合の最小方針は以下。

1. 既存 `/host` のイベントコード方式をベースにする
2. `/organizer` を正式運営者URLとして扱う
3. まずはメモリストアのまま、UIと流れを検証する
4. `/organizer` でタイトル、開催日時、予定席数、1卓人数を登録する
5. 参加URLを発行する
6. 参加者が名前またはニックネームを入れて診断する
7. イベントに参加者結果が紐づく
8. 運営者画面で参加者一覧を見る
9. 11タイプを使った席順理由表示を追加する
10. 保存期間・削除方針を画面文言とdocsに明示する
11. Supabase永続化は次フェーズに分ける

初期実装では、既存APIを大きく作り替えない。  
まずは既存 `/host` の流れを `/organizer` の外部向けUIに寄せ、席順理由を11タイプベースに厚くする。

## まだ実装しないこと

- Supabaseテーブル作成
- RLS設計
- cron実装
- 自動削除実装
- ログイン
- 決済
- QR受付
- CSV出力
- LINE連携
- 本番DB接続
- 既存API改修
- 既存診断ロジック変更
- 既存 `/host` の削除
- 既存 `/organizer` の保存接続
- `centeredResult` を使った高度な席順判定

## 今回変更しないもの

- 既存 `/host`
- 既存 `/organizer`
- 既存API
- Supabaseテーブル
- 診断本体
- 結果ページ
- シェア文言
- 検証フォーム
- `/api/feedback`
- GAS連携
- payload
- URL形式
- 診断ロジック
- 設問
- 重み
- `centeredResult`
- `.env.local`

## 結論

現時点の推奨は以下。

- 正式運営者フローは、結果URL手入力型ではなく、イベントURL配布型に寄せる
- 既存 `/host` のイベントコード方式を土台として再利用する
- `/organizer` は正式外部URLとして育てる
- 席順は `centerForce` 分散に加えて、11タイプベースのマッチング理由を強化する
- データはイベント終了後3日で削除し、匿名統計だけ残す
- まずはdocs化し、次に最小実装を分ける
