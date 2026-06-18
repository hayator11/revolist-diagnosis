# Icebreak 33 オフ会運営者向け 席順・マッチング管理ツール設計

## 目的

Icebreak 33 を、個人診断だけでなく、オフ会や交流会で使える運営者向けツールとして別展開する。

個人向けの診断本体は、自分の役割を知り、結果をシェアし、感想を送る体験を中心にする。  
運営者向けツールは、参加者の診断結果を集め、役割タイプやforceのバランスを見ながら席順・会話の起点を作るための管理画面として扱う。

今回のドキュメントは設計メモであり、実装変更は行わない。

## 調査したファイル

- `src/app/research/icebreak-11-v1`
- `src/app/research/icebreak-11-v1/_components/IcebreakResultClient.tsx`
- `src/app/research/icebreak-11-v1/validation/IcebreakValidationClient.tsx`
- `src/app/research/icebreak-11-v1/host/IcebreakHostClient.tsx`
- `src/app/research/icebreak-11-v1/host/page.tsx`
- `src/app/api/icebreak/event/route.ts`
- `src/app/api/icebreak/event/[hostKey]/route.ts`
- `src/app/api/icebreak/public/[eventCode]/route.ts`
- `src/app/api/icebreak/join/route.ts`
- `src/app/api/icebreak/seating/route.ts`
- `src/app/api/icebreak/reset/route.ts`
- `src/lib/calculateIcebreakResult.ts`
- `src/lib/icebreakEventStore.ts`
- `src/lib/icebreakSeating.ts`
- `src/data/icebreakRoleResultCopy.ts`
- `docs/icebreak/icebreak-roles-design-inventory.md`
- `docs/icebreak/icebreak-result-action-flow-plan.md`
- `docs/icebreak/icebreak-revolist-crazist-balance-audit.md`

## 現在すでにある関連機能

Icebreak 33には、すでに簡易的な主催者向け機能がある。

- `/research/icebreak-11-v1/host`
  - イベント名入力
  - 開催日入力
  - 1卓の人数入力
  - 参加URL発行
  - 主催者URL発行
  - 参加者一覧
  - force分布
  - 席順生成
  - 座席マップ表示
- `/api/icebreak/event`
  - イベント作成
- `/api/icebreak/public/[eventCode]`
  - 参加者向けイベント情報取得
- `/api/icebreak/join`
  - 診断完了時にイベント参加者として登録
- `/api/icebreak/seating`
  - forceを分散する席順生成
- `/api/icebreak/reset`
  - 匿名統計を作成し、運営用データを閉じる
- `src/lib/icebreakEventStore.ts`
  - 現在はメモリ上の一時ストア
- `src/lib/icebreakSeating.ts`
  - forceごとの分散を中心にした席順生成

このため、完全な新規構想ではなく、既存の `/host` 機能をどう整理・発展させるかが次の論点になる。

## 診断本体とは別展開にする理由

診断本体とオフ会運営者ツールは、目的・導線・保存データ・UIが違う。

| 観点 | 診断本体 | オフ会運営者ツール |
| --- | --- | --- |
| 主な利用者 | 個人の回答者 | 主催者・運営者 |
| 目的 | 自分の役割を知る、結果をシェアする、感想を送る | 参加者の組み合わせを見て、会話が起きやすい席順を作る |
| 導線 | 診断開始 → 結果 → シェア / 検証フォーム | イベント作成 → 参加URL共有 → 参加者確認 → 席順生成 |
| 保存データ | 回答、結果、検証フィードバック | イベント、参加者、席順、マッチング理由 |
| UI | 回答者が迷わず進める画面 | 運営者が一覧・配置・理由を見られる画面 |

診断ページに運営機能を混ぜると、個人の診断体験が重くなる。  
そのため、運営者ツールは診断本体から分け、必要なときだけ主催者が使う別導線にする。

## 推奨URL案

候補:

- `/research/icebreak-11-v1/organizer`
- `/research/icebreak-11-v1/meetup`
- `/research/icebreak-11-v1/seating`
- 既存: `/research/icebreak-11-v1/host`

推奨は `/research/icebreak-11-v1/organizer`。

理由:

- 診断本体とは別の「運営者向け」だと分かりやすい
- meetupより用途が広く、オフ会・交流会・イベントに使える
- seatingよりも、イベント作成・参加URL・参加者管理まで含めやすい
- 既存 `/host` は実験的な主催者画面として残しつつ、次フェーズでは `/organizer` に整理できる

短期的には、既存 `/host` をそのまま磨く案もある。  
ただし外部に案内する正式URLとしては `/organizer` の方が意味が伝わりやすい。

## 最小機能案

初期版では、以下を想定する。

- オフ会タイトル登録
- 開催日メモ
- 席数登録
- テーブル数登録
- 1テーブルあたりの人数登録
- 参加者名またはニックネーム登録
- 参加者の診断結果URL登録
- 診断結果URLから `result id` を読み取る
- `decodeIcebreakAnswers(encoded)` で回答を復元する
- `calculateIcebreakResult(answers)` で `mainTypeKey`, `partnerTypeKey`, `centerForce` を復元する
- 参加者ごとの役割表示
- 自動席順配置
- 席順表表示
- テーブルごとのマッチング理由表示

既存 `/host` は「イベントコード付き診断を参加者に回答してもらう」方式。  
ここで設計する初期版は、診断済みの結果URLを運営者が登録する方式も扱えるようにする。

## 初期版ではやらないこと

- ユーザーログイン
- 決済
- QR受付
- 参加者本人による登録フォーム
- Supabase保存
- 複数イベントの永続管理
- 管理者権限
- CSV出力
- LINE連携
- 本番DB設計
- 複雑なドラッグアンドドロップ席替え
- centeredResultを使った高度なマッチング

まずはローカルまたはフロント完結の試作でよい。  
保存はブラウザの状態または一時的な画面状態で扱い、本番DB接続は次フェーズに分ける。

## 席順配置ロジック案

### 基本方針

- 同じ役割ばかりを固めない
- `ignite`, `design`, `connect`, `structure`, `care` をテーブルごとに分散する
- 会話が起きやすい組み合わせを優先する
- `partnerTypeKey` を参考にする
- `centerForce` が同じ参加者は、可能なら別テーブルへ分ける
- 1テーブル内に、起点・広げる・つなぐ・整える・支える力がなるべく入るようにする

### 役割ごとの配置観点

- `revolist` / `crazist`
  - 強い起点役として扱う
  - 孤立させず、受け止め役や整理役の近くに置く
  - 同じテーブルに起点役ばかりを固めすぎない
- `soulowner` / `movmentor`
  - 挑戦や違和感を受け止める土台として配置する
  - `revolist` / `crazist` の近くにいると、会話が続きやすい
- `arranger` / `communicator`
  - 場の橋渡し役として扱う
  - テーブル内の会話の入口や流れを作る位置に置ける
- `logicalmaister` / `inforader`
  - 整理・判断材料の役割として分散する
  - 1テーブルに偏りすぎないようにする
- `maxdesigner`
  - 全体調整・可能性設計の役割として中心寄りに置ける
  - 発想型と整理型の間に置くと会話が広がりやすい
- `imagemaister` / `premiercrafter`
  - 伝わる形・品質・完成度を育てる役割として配置する
  - 企画やアイデアがあるテーブルに加わると、形にする会話が起きやすい

### 既存ロジックとの関係

既存 `generateIcebreakSeating` は、`centerForce` の同一forceが同じテーブルに固まりすぎないように分散する。  
初期版ではこの方針を土台にし、次に `mainTypeKey` / `partnerTypeKey` / role相性を理由表示へ足す。

## マッチング理由の表示案

席順を出すだけでは、運営者が納得しづらい。  
テーブルごと、または参加者ごとに理由を短く表示する。

理由文の例:

- 「起点を作る人」と「受け止める人」を近くにしました
- 「発想型」と「整理型」が会話しやすい組み合わせです
- 同じタイプが固まりすぎないように分散しました
- このテーブルは初対面でも話が起きやすい構成です
- `revolist` / `crazist` の起点に、`soulowner` / `movmentor` の土台が近くなるようにしました
- `arranger` / `communicator` が会話の橋渡しになりやすい配置です
- `logicalmaister` / `inforader` が、話を次の一歩に整理しやすい位置にいます

理由は、診断結果の優劣ではなく「会話が始まりやすい組み合わせ」として書く。

## 画面構成案

運営者向けの最小画面:

1. イベント情報
   - タイトル入力
   - 開催日入力
   - 席数入力
   - テーブル数入力
   - 1テーブルあたりの人数入力
2. 参加者登録
   - 参加者名 / ニックネーム
   - 診断結果URL入力欄
   - 追加ボタン
3. 参加者一覧
   - 名前
   - `mainTypeKey`
   - `partnerTypeKey`
   - `centerForce`
   - 診断結果URL
4. 席順生成
   - 「席順を作る」ボタン
5. 席順結果
   - テーブルごとの参加者
   - 席番号
   - force / roleの分布
   - テーブルごとのマッチング理由
6. 手動調整
   - 初期版では未実装でもよい
   - 次フェーズで入れ替えUIを検討する

## データ構造案

初期版のフロント状態として、以下を想定する。

```ts
type OrganizerState = {
  meetupTitle: string;
  eventDate: string;
  tableCount: number;
  seatsPerTable: number;
  participants: OrganizerParticipant[];
  seatingResult: OrganizerSeatingResult | null;
};

type OrganizerParticipant = {
  id: string;
  name: string;
  resultUrl: string;
  encodedResultId: string;
  mainTypeKey: string;
  partnerTypeKey: string;
  centerForce: string;
};

type OrganizerSeatingResult = {
  tables: OrganizerTable[];
};

type OrganizerTable = {
  tableNo: number;
  participants: OrganizerParticipant[];
  reason: string;
};
```

既存 `/host` のAPI方式を使う場合は、`IcebreakParticipantRecord` に近いデータ構造を使う。  
フロント完結の試作では、診断結果URLから復元した値だけを一時状態に持てばよい。

## 既存診断結果URLとの連携案

既存の結果URLは、以下の形式を使っている。

```text
/research/icebreak-11-v1/result/{encoded}
```

また、旧来のquery形式が残る場合は以下もあり得る。

```text
/research/icebreak-11-v1/result?id={encoded}
```

連携手順:

1. 入力されたURLを `new URL()` で読む
2. pathから `/result/{encoded}` の `{encoded}` を取り出す
3. queryの `id` がある場合はそれもfallbackとして読む
4. `decodeIcebreakAnswers(encoded)` で回答配列を復元する
5. `isValidIcebreakAnswers(answers)` で33問・1〜5を確認する
6. `calculateIcebreakResult(answers)` で `mainTypeKey`, `partnerTypeKey`, `centerForce` を復元する
7. URL形式自体は変更しない

既存の診断結果URLは壊さず、運営者ツール側で読み取るだけにする。

## 既存 `/host` との整理案

現状の `/host` は、イベントコードを発行し、参加者がそのURLから診断する前提になっている。  
これは当日の運用には向いているが、外部検証や事前診断済みの参加者を登録する用途には少し足りない。

整理案:

### A案: 既存 `/host` を拡張する

- 既存のイベント作成・参加URL・席順生成を活かせる
- ただし、診断結果URLの手動登録を足すと画面の責任が増える

### B案: `/organizer` を新設する

- 診断結果URL入力型の試作として作りやすい
- 既存 `/host` と比較しながら改善できる
- 将来、成熟したら `/host` と統合またはリダイレクトできる

### C案: `/seating` を新設する

- 席順生成に特化できる
- ただしイベント作成や参加者管理まで広げると名前が狭くなる

現時点の推奨は B案。  
`/organizer` でフロント完結の試作を作り、よければ既存 `/host` の正式版へ統合する。

## 今後の拡張案

- Supabase保存
- イベントごとのURL発行
- 参加者が自分で診断URLを登録
- QRコードで受付
- CSV出力
- 印刷用席順表
- LINE共有
- オフ会後アンケート
- マッチング精度の検証
- テーブルごとの会話テーマ提案
- 手動入れ替え
- 参加者の遅刻・途中参加への追加配置
- 席替え2回目・3回目の提案

## 最初に実装するなら何をするか

初回実装の最小方針:

- `/research/icebreak-11-v1/organizer` ページを追加
- フロント完結
- タイトル、席数、テーブル数、参加者名、結果URLを入力
- 結果URLから `encodedResultId` を取り出す
- `decodeIcebreakAnswers` と `calculateIcebreakResult` でタイプ復元
- `mainTypeKey`, `partnerTypeKey`, `centerForce` を参加者一覧に表示
- 単純なforce分散ロジックで席順生成
- テーブルごとの理由表示
- 保存なし
- 既存 `/host` / API / Supabase には接続しない

初期版で確認したいこと:

- 運営者が結果URLを貼るだけで参加者タイプを復元できるか
- force分散だけでも席順として納得できるか
- マッチング理由があることで、運営者が説明しやすくなるか
- 既存 `/host` へ統合すべきか、別ツールとして伸ばすべきか

## まだ変更しないもの

- 既存の診断ページ
- 結果ページ
- シェア文言
- 検証フォーム
- Supabase保存処理
- `/api/feedback`
- GAS
- payload
- URL形式
- 診断ロジック
- 設問
- 重み
- centeredResult
- 既存 `/host` の挙動
- 既存 seating API

## 結論

オフ会運営者向けツールは、診断本体とは別展開にするのが自然。  
既存の `/host` にはイベント作成・参加者収集・席順生成の土台があるため、次に作るなら `/organizer` でフロント完結の結果URL入力型プロトタイプを作り、既存 `/host` との統合方針を比較するのがよい。

初期版では保存やログインを持たず、席順生成と理由表示の体験だけを小さく検証する。
