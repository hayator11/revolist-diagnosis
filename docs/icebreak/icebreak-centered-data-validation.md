# Icebreak 33 中心0モデル 実回答データ検証方針

## 目的

Icebreak 33 の `centeredResultSummary` は、すぐにユーザー表示へ使わない。

まず実回答データを集め、`legacyResult` と `centeredResultSummary` の分布・ズレ・納得感を確認する。

`legacyResult` は引き続き表示用として維持する。`centeredResultSummary` は、分析用・比較用・将来の解釈レイヤー検討用として扱う。

## 集めたい件数

最低30件を目標にする。

可能なら100件まで集める。

最初は、身近なテスター、オフ会参加者、運営メンバーなど、結果への感想を聞きやすい人から集める。

30件未満では、個別の違和感を重み変更へ直結させない。

## 集めたい情報

検証では、最低限以下を見られる状態にする。

- `diagnosisId`
- 回答日時
- `answers` 1〜5
- `legacyResult` の主要結果
- `centeredResultSummary`
- 回答者のしっくり度
- 違和感があったタイプ
- 自分らしいと思った要素
- オフ会やマッチングに使えそうか

自由記述を集める場合も、個人情報やセンシティブな情報は不要とする。

## 比較したい観点

`legacyResult` と `centeredTopRole / centeredTopForce` が、説明可能にズレているかを見る。

`care / soulowner / movmentor` が出すぎないかを見る。

`connect / design / ignite` が沈みすぎないかを見る。

全体的に0回答が多い設問がないかを見る。

特定設問だけ0回答が集中していないかを見る。

結果に納得感があるかを見る。

オフ会での会話のきっかけになるかを見る。

## 注意点

`centeredTopRole` を、そのまま「あなたのタイプ」として表示しない。

全体マイナス時の `top` は、ユーザー向け結果ではなく、相対的に高い項目として扱う。

実データが集まるまで、重みを大きく変えない。

違和感が1〜2件出ても、すぐに重み変更しない。

30件以上で傾向を見る。

## 検証後の判断基準

30〜100件で、特定タイプが偏りすぎていないかを見る。

`legacyResult` とのズレが説明可能かを見る。

`centeredResultSummary` が、マッチングや会話導線に使えそうかを見る。

表示に使う場合は、`centeredResultSummary` を直接出すのではなく、解釈レイヤー・文章化レイヤーを別途設計する。

## まだやらないこと

実回答データの検証前に、以下は行わない。

- UI反映
- 結果表示変更
- URL変更
- `/api/feedback` 変更
- Google Apps Script連携変更
- 既存payload変更
- `centeredResultSummary` の本番送信
- 重みの大幅変更

## 関連ファイル

- `docs/icebreak/icebreak-centered-model.md`
- `docs/icebreak/icebreak-centered-summary-log.md`
- `src/lib/calculateIcebreakResult.ts`
- `scripts/audit-icebreak-distribution.mjs`
