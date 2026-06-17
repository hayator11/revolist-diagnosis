# Icebreak centeredResultSummary ログ設計方針

## 目的

Icebreak 33 の `centeredResultSummary` を、将来安全にログ保存するための方針を記録する。

現時点では `createCenteredResultSummary(centeredResult)` は実装済みだが、運用中のGoogle Apps Script本体コードがリポジトリ内にない。そのため、既存payloadへsummaryを追加する判断はまだしない。

## 現在の状態

`createCenteredResultSummary(centeredResult)` は実装済み。

summaryは生成できる。

まだ `/api/feedback` には接続していない。

まだGoogle Apps Script連携にも接続していない。

既存payloadには追加していない。

現在の `/api/feedback` は、受け取ったJSONを加工せず、Google Apps Scriptへ `application/json` で転送している。

Icebreak系の既存formType:

- `icebreak_answer`
- `icebreak_result`
- `icebreak_feedback`

運用中のGAS本体コードはリポジトリ内に見つかっていない。

`docs/revo111/special/Revo111_Special_Research_GoogleSheets_Setup.md` にあるApps Scriptは、受信処理ではなく、スプレッドシート初期セットアップ用である。

## なぜ既存payloadへ追加しないのか

GAS本体コードがリポジトリ内にない。

未知フィールドを安全に無視できるか不明。

固定列前提でappendしている場合、列崩れや保存失敗のリスクがある。

既存の `icebreak_result` / `icebreak_feedback` は壊してはいけない。

そのため、GAS側の受信仕様が確認できるまで、既存payloadへ `centeredResultSummary` を直接追加しない。

## 推奨するログ方針

当面はローカルaudit JSONで比較を継続する。

本格ログ化する場合は、既存payloadへ混ぜず、新しい `formType: icebreak_centered_summary` を検討する。

既存の `icebreak_result` や `icebreak_feedback` へ直接summaryを追加しない。

GAS側の受信仕様が確認できるまで本番送信しない。

既存結果ログを壊さないことを最優先にする。

## 新formType案

新しいログ種別:

```ts
type: "icebreak_centered_summary"
formType: "icebreak_centered_summary"
```

保存先は、既存ログとは別シート、または別処理にする。

既存の `icebreak_answer` / `icebreak_result` / `icebreak_feedback` とは混ぜない。

## 送る項目

送る項目は、最小summaryに限定する。

```text
diagnosisId
createdAt
payloadSchemaVersion
projectSlug
answerCount
centeredAnswerMean
centeredAnswerSpread
zeroAnswerCount
hasNegativeScore
centeredTopRoleKey
centeredTopRoleScore
centeredBottomRoleKey
centeredBottomRoleScore
centeredTopForceKey
centeredTopForceScore
centeredBottomForceKey
centeredBottomForceScore
```

`centeredTopRole` などのオブジェクトをそのまま送らず、Sheetsで扱いやすいように `Key` と `Score` へ分ける。

## 送らない項目

初期ログでは以下を送らない。

- `axisScores` 全量
- `roleScores` 全量
- `forceScores` 全量
- `rawAnswers`
- `centeredAnswers`
- `answerDetails`
- 自由記述
- 個人情報

回答配列やスコア全量は、ログ肥大化と列増加の原因になる。必要になった場合も、既存ログとは別の検証用保存先で扱う。

## GAS側で必要な確認

GAS本番コードを入手できたら、以下を確認する。

- 受信側に `doPost` があるか
- `formType` で分岐しているか
- 未知フィールドを無視できるか
- 固定列でappendしているか
- 新しいシートを追加できるか
- 新formTypeを追加して既存ログに影響しないか

未知フィールドを無視できる実装であっても、既存payloadへ混ぜるのではなく、まずは別formType・別シートで検証する。

## 実装する場合の最小手順

1. GAS側に `icebreak_centered_summary` 用の受け皿を作る
2. Sheets側に専用シートを作る
3. Next.js側で送信用payloadを作る関数を追加する
4. まずローカルまたは開発環境で1件だけ送信テストする
5. 既存 `icebreak_result` / `icebreak_feedback` の動作を再確認する
6. 問題なければ本番送信を検討する

Next.js側で最初に触る候補は、送信用payload作成関数と、送信元1箇所だけにする。

## まだ触ってはいけないもの

GAS側の受信仕様が確認できるまで、以下は変更しない。

- 既存 `icebreak_result` payload
- 既存 `icebreak_feedback` payload
- `/api/feedback` の転送仕様
- GAS本番受信処理
- Google Sheets本番列
- UI
- 結果表示
- URL形式
- `legacyResult`

## 関連ファイル

- `src/lib/calculateIcebreakResult.ts`
- `src/app/api/feedback/route.ts`
- `src/app/research/icebreak-11-v1/_components/IcebreakResultClient.tsx`
- `src/app/research/icebreak-11-v1/_components/IcebreakFeedbackClient.tsx`
- `scripts/audit-icebreak-distribution.mjs`
