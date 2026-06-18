# Icebreak 33 役割結果コピー 表示接続方針

## 目的

このドキュメントは、`src/data/icebreakRoleResultCopy.ts` を Icebreak 33 の結果画面へ接続する前に、表示位置・表示順・表示量・最小接続範囲を整理するものです。

今回は調査・設計のみです。実装接続、UI変更、結果表示変更、URL変更、アルゴリズム変更、重み変更、`legacyResult` / `centeredResult` 変更、API、GAS、Supabase、payload、設問データ、scripts の変更は行いません。

## 調査したファイル

- `src/app/research/icebreak-11-v1/_components/IcebreakResultClient.tsx`
- `src/app/research/icebreak-11-v1/result/page.tsx`
- `src/app/research/icebreak-11-v1/result/[id]/page.tsx`
- `src/lib/calculateIcebreakResult.ts`
- `src/data/icebreakRoleResultCopy.ts`
- `docs/icebreak/icebreak-roles-result-copy-plan.md`
- `docs/icebreak/icebreak-centered-model.md`

## 現在の結果画面構造

Icebreak 33 の結果表示は、`IcebreakResultClient` に集約されている。

入口は2系統ある。

- `/research/icebreak-11-v1/result?id=...`
- `/research/icebreak-11-v1/result/[id]`

どちらも最終的には `IcebreakResultClient` を使う。`resultId` が渡された場合はそれを使い、なければ `useSearchParams()` で `id` を読む。

現在の表示順は以下。

1. `Icebreak 33 Result` のラベル
2. `details.title`
3. `details.lead`
4. Center Force
   - `FORCE_LABELS[result.centerForce]`
   - `FORCE_DEFINITIONS[result.centerForce].description`
5. 今日の動き方
   - `details.movementHeadline`
   - `details.movementReason`
6. 今日、つながると動き出す人
   - `slotForce.label`
   - `details.partnerHeadline`
   - `details.partnerReason`
   - `details.partnerRole.name`
   - `details.partnerNavigation.publicLabel`
   - `details.nextAction`
7. この場で起きやすい組み合わせ
   - `details.connectionCards`
8. 最初の会話メモ
   - `details.conversationOpeners`
9. この体験を育てる
   - 既存の Icebreak feedback へのリンク
10. 共有 / コピー、X、LINE

## 現在使っている結果データ

結果画面では、`decodeIcebreakAnswers()` でURL上の回答を復元し、`calculateIcebreakResult()` で `legacyResult` 相当の結果を出している。

表示用の文章は `getIcebreakResultDetails(result)` で組み立てている。

主に使っているキー:

- `result.centerForce`
- `result.subForce`
- `result.slotForce`
- `result.movementStyle`
- `result.mainTypeKey`
- `result.partnerTypeKey`
- `result.thirdTypeKey`
- `details.mainRole`
- `details.partnerRole`
- `details.thirdRole`
- `details.mainNavigation`
- `details.partnerNavigation`
- `details.thirdNavigation`

`centeredResult` は結果画面では使っていない。現時点では表示タイプ決定にも使わない方針を維持する。

## 現在のログ・共有・導線

### 結果ログ

結果画面表示時に、`/api/feedback` へ `icebreak_result` を送っている。

送信内容には以下が含まれる。

- `answers`
- `answerCount`
- `centerForce`
- `slotForce`
- `mainTypeKey`
- `mainTypeName`
- `partnerTypeKey`
- `partnerTypeName`
- `answerDetails`
- force系のスコアカラム

今回のコピー接続方針では、この payload は変更しない。

### シェア文言

現在の `shareText` は以下の構成。

```text
私は今日、{mainRole.name}っぽく場に入れそう。
話してみたいのは{partnerRole.name}タイプ。
{resultUrl}
```

`icebreakRoleResultCopy.shareCopy` は将来の候補だが、初回接続では既存のシェア文言を置き換えない方が安全。

理由:

- 表示コピーの受け取り方を先に確認したい
- SNS文言変更は体験への影響が大きい
- 既存ログや結果URLとは独立して検証したい

### CTA / フィードバック導線

現在は `この体験を育てる` セクションで、`/research/icebreak-11-v1/feedback?id=...` へ案内している。

検証フォーム `/research/icebreak-11-v1/validation` とは別物なので、初回の結果コピー接続では既存導線を変更しない。

## 新コピーの表示順案

`icebreakRoleResultCopy` には以下がある。

- `workingCopy`
- `catchCopy`
- `selfCheckItems`
- `essence`
- `cautionHabit`
- `meetupUse`
- `goodPartners`
- `shareCopy`
- `mismatchNote`

スマホで読みやすく、説明だらけにしないため、初期表示と下部表示を分ける。

## 初期表示に出す項目

初回接続で最初に出す候補:

1. `workingCopy`
2. `catchCopy`
3. `selfCheckItems` 3つ

理由:

- `workingCopy` は役割名より先に「どんな働きか」を伝えられる
- `catchCopy` は短く記憶に残る
- `selfCheckItems` は自己認識との接点を作りやすい
- 3項目ならスマホでも読み切りやすい

表示位置の候補:

- `details.lead` の直後
- Center Force の前

この位置が自然な理由:

- いまの結果画面は、最初に `details.title` と `details.lead` で全体説明を出している
- その直後に役割コピーを置くと、Force や Movement より前に「自分の働き」が伝わる
- 既存の Center Force / Movement / Partner セクションは残せる

初回接続時の推奨表示:

```text
あなたは、人・情報・役割を配置して流れを生む人。
バラバラな持ち寄りを、動ける流れへ整える人。

こんなところありませんか？
- ...
- ...
- ...
```

## 下部または折りたたみに回す項目

下部表示または折りたたみ候補:

- `essence`
- `cautionHabit`
- `meetupUse`
- `goodPartners`
- `mismatchNote`

理由:

- すべてを冒頭に出すと結果画面が説明過多になる
- `essence` は納得感を深める補足として下部向き
- `cautionHabit` は見せ方を慎重にしたい
- `meetupUse` と `goodPartners` は会話・オフ会導線に近いので、既存の「今日、つながると動き出す人」や「最初の会話メモ」と役割が重なる
- `mismatchNote` は全員に常時表示するより、「しっくりこない時」の補足として扱う方が自然

将来の構成案:

```text
冒頭:
- workingCopy
- catchCopy
- selfCheckItems

中盤:
- 既存 Center Force
- 既存 Movement
- 既存 Partner

下部:
- meetupUse
- goodPartners
- mismatchNote
```

## 説明だらけにしないための方針

- 冒頭は1カードに収める
- `selfCheckItems` は3つの箇条書きまで
- `essence` と `cautionHabit` は初回接続では出さない、または折りたたむ
- 既存の `details.lead` と意味が重なる場合は置き換えではなく、まず追加表示で検証する
- `shareCopy` は画面内の短い一文として出す余地はあるが、既存シェア文言の置き換えは別ターンにする
- `mismatchNote` は常時表示ではなく、「結果がしっくりこない時」枠にする

## 1役割だけ試験接続する場合の候補

初回の試験接続候補は `arranger`。

理由:

- 実際に自己認識とのズレが起きやすい役割として検証価値がある
- 「単なる調整役ではない」ことを表示コピーで表現できるか確認しやすい
- `workingCopy` が「人・情報・役割を配置して流れを生む人」で、既存の短いタイプ名より働きが伝わりやすい
- `selfCheckItems` が Icebreak 33 の設問群と結びつきやすい
- `meetupUse` が既存の会話メモと自然につながる

ただし、今回の作業では試験接続はしない。

## 実装する場合の最小変更候補

### import する候補

最小接続なら、`IcebreakResultClient` に以下を import する。

```ts
import { getIcebreakRoleResultCopy } from "@/data/icebreakRoleResultCopy";
```

### 取得方法

`result.mainTypeKey` を使う。

```ts
const roleCopy = getIcebreakRoleResultCopy(result.mainTypeKey);
```

理由:

- 既存表示用の主タイプは `legacyResult` の `mainTypeKey`
- `centeredResult` は表示タイプ決定に使わない方針
- URL復元・ログ送信・既存の結果判定を変えずに済む

### null の場合

`roleCopy` が `null` の場合は何も追加表示しない。

```ts
if (!roleCopy) {
  // 既存表示だけを維持する
}
```

理由:

- 既存結果画面を壊さない
- roleKey の表記揺れや未定義があっても安全
- 追加コピーは補助表示として扱える

### 既存表示を置き換えるか、追加するか

初回は置き換えず、追加表示が安全。

置き換えないもの:

- `details.title`
- `details.lead`
- Center Force
- Movement
- Partner
- Connection Cards
- Conversation Openers
- Share Text
- Feedback CTA

理由:

- 既存体験を壊さずに比較できる
- コピーの表示量だけを検証できる
- ログやURLの意味を変えない

### 1役割だけ表示する場合

初回に `arranger` だけ試すなら、条件分岐は表示側に閉じる。

```ts
const roleCopy =
  result.mainTypeKey === "arranger"
    ? getIcebreakRoleResultCopy(result.mainTypeKey)
    : null;
```

注意:

- データファイルは11役割分のままにする
- 判定ロジックは変えない
- `arranger` 以外は既存表示だけにする
- 検証後に11役割へ広げる

### 11役割全体に広げるタイミング

以下を確認してから広げる。

- `arranger` の表示がスマホで長すぎない
- 既存の Center Force / Partner 表示と意味が衝突しない
- 自己認識とズレた時の受け止めがきつくない
- シェアしたくなる一文として自然
- 既存の `/api/feedback` payload を変えずに検証できる

## 表示接続時に触らないもの

将来の接続時も、以下は変更しない。

- アルゴリズム
- 重み
- `legacyResult`
- `centeredResult`
- `/api/feedback`
- GAS
- Supabase
- 既存payload
- 設問データ本体
- scripts
- URL形式

## 今回変更していないもの

今回の作業では、以下は変更しない。

- `src/data/icebreakRoleResultCopy.ts`
- 結果ページ関連ファイル
- 診断ロジック関連ファイル
- API関連ファイル
- Supabase関連ファイル
- GAS関連ファイル
- 設問データ
- scripts

## 次に進む場合の候補

1. `arranger` だけ、`IcebreakResultClient` に追加表示する
2. 表示位置は `details.lead` の直後、Center Force の前にする
3. 表示項目は `workingCopy` / `catchCopy` / `selfCheckItems` のみにする
4. 既存シェア文言、ログ送信、URL、判定ロジックは変更しない
5. スマホ表示と文章量を確認する
6. 問題なければ11役割全体へ広げる

