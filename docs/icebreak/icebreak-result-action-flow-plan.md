# Icebreak 33 結果ページ下部アクション導線整理

## 目的

Icebreak 33 の結果ページ下部にある共有・アンケート・検証フォーム導線を、外部テスターに渡す前に整理する。

今回は現状調査と構成案の整理のみ。実装変更、UI変更、結果表示、11役割コピー、シェア文言、`/api/feedback` payload、Supabase保存処理、GAS連携、診断ロジック、設問データ、アルゴリズム、重み、`centeredResult`、scripts、`.env.local` は変更しない。

## 調査したファイル

- `src/app/research/icebreak-11-v1/_components/IcebreakResultClient.tsx`
- `src/app/research/icebreak-11-v1/_components/IcebreakFeedbackClient.tsx`
- `src/app/research/icebreak-11-v1/feedback/page.tsx`
- `src/app/research/icebreak-11-v1/validation/IcebreakValidationClient.tsx`
- `src/app/research/icebreak-11-v1/validation/page.tsx`
- `docs/icebreak/icebreak-share-copy-design-plan.md`
- `docs/icebreak/icebreak-external-test-guide.md`
- `docs/icebreak/icebreak-external-test-launch-checklist.md`

## 現在の結果ページ下部導線

`IcebreakResultClient.tsx` の下部は、現在次の順番で表示されている。

1. `この体験を育てる`
   - 説明文:
     - 今日の結果が話しかけるきっかけになったか、短いアンケートで教えてください。
   - ボタン:
     - `アンケートに答える`
   - リンク先:
     - `/research/icebreak-11-v1/feedback?id={encoded}`

2. 共有導線
   - `共有 / コピー`
     - `navigator.share` が使える場合はネイティブ共有
     - 使えない場合は `navigator.clipboard.writeText(shareText)`
   - `X`
     - `https://twitter.com/intent/tweet?text={shareText}`
   - `LINE`
     - `https://social-plugins.line.me/lineit/share?url={shareResultUrl}&text={shareText}`

現状では、アンケート導線が共有導線より先に出ている。

## 既存 `/feedback` 導線の位置づけ

`/research/icebreak-11-v1/feedback` は、結果ページから `id` を受け取り、回答と結果を復元して送信する体験アンケートである。

主な特徴:

- `IcebreakFeedbackClient.tsx` で実装されている
- `id` query を必須にしている
- `decodeIcebreakAnswers(encoded)` で回答を復元する
- `calculateIcebreakResult(answers)` で結果を再計算する
- `mainTypeKey`, `partnerTypeKey`, `answerDetails`, force列などを含む
- 送信先は既存の `/api/feedback`
- `formType` は `icebreak_feedback`
- 送信後は `/research/icebreak-11-v1/thanks` へ遷移する

つまり、`/feedback` は既存ログ基盤へ送る「体験後アンケート」であり、Supabase検証フォームとは別物である。

外部検証で中心に使いたいフォームは、現在は `/validation` である。

## Supabase検証フォーム `/validation` の位置づけ

`/research/icebreak-11-v1/validation` は、Icebreak 33 の外部検証用フォームとして追加済み。

主な特徴:

- `IcebreakValidationClient.tsx` で実装されている
- `POST /api/icebreak/centered-validation` に送信する
- 保存先は Supabase の `icebreak_centered_validation_feedback`
- 本名や個人情報を求めない
- 診断IDまたは結果URLを手入力する
- `fit_score`, `conversation_use_score`, `matching_use_score` を集める
- 自分らしい点、違和感、任意コメントを集める
- `centeredResultSummary`、スコア全量、回答配列は保存しない

現状では、結果ページから `/validation` への直接リンクはない。

また、`result_url` query を受け取って入力欄に初期入力する処理もまだない。

## 現在の課題

- 外部検証で使いたい `/validation` への導線が結果ページにない
- 結果を読んだ直後にアンケートが先に出るため、評価される印象が少し強い
- 共有導線が下にあるため、結果を誰かに見せる体験が後回しになる
- 既存 `/feedback` と新しい `/validation` の目的が分かれているが、結果ページ上では整理されていない
- `/validation` 側は結果URLの初期入力に未対応なので、外部テスターは結果URLを手動で貼る必要がある

## 外部検証向けの理想順

外部検証では、結果ページ下部の行動順は次の流れが自然。

1. 結果を読む
2. 結果をシェアする
3. LINEで友だちに送る
4. 結果をコピーする
5. 最後に検証フォームで感想を送る

理由:

- 最初にアンケートを出しすぎると、評価される印象が強くなる
- まず結果を楽しみ、誰かに見せる余地を作る方が自然
- X / LINE / コピーは「自分の結果を持ち帰る」導線として先に置きたい
- その後に「よければ感想をください」と置くと、検証依頼として受け取りやすい
- 外部検証では違和感の回収も必要なので、検証フォーム導線は必ず置く

## 結果ページ下部の構成案

### セクション1: 結果を誰かに見せる

目的:

- 結果を自己紹介や会話のきっかけにする
- X / LINE / コピーを自然に使ってもらう
- 診断が「読んで終わり」ではなく、誰かとの会話へ広がる体験にする

表示候補:

- 見出し:
  - `結果を誰かに見せる`
- 補足文:
  - `気になった人に送ったり、自己紹介のきっかけとして使ってみてください。`
- ボタン:
  - `Xでシェア`
  - `LINEで送る`
  - `結果をコピー`

現状の共有処理は維持する。

- `shareText` は変更しない
- `shareResultUrl` は維持する
- X / LINE / コピーの構造は大きく変えない

### セクション2: この診断をよくするために感想を送る

目的:

- 外部検証として、しっくり度や違和感を回収する
- 結果を楽しんだ後に、任意で協力してもらう流れにする
- `/validation` への導線を明確にする

表示候補:

- 見出し:
  - `この診断をよくするために感想を送る`
- 補足文:
  - `結果のしっくり感や違和感を教えてください。本名や個人情報は不要です。`
- ボタン:
  - `検証フォームに回答する`
- リンク先:
  - `/research/icebreak-11-v1/validation`

## 検証フォームへのリンク仕様案

基本リンク:

```text
/research/icebreak-11-v1/validation
```

可能なら、現在の結果URLを query で渡す。

```text
/research/icebreak-11-v1/validation?result_url=<encoded current result url>
```

注意:

- `result_url` は `encodeURIComponent` する
- 自動遷移はしない
- 結果ページから検証フォームへ移動するだけにする
- `/api/feedback` payload は変更しない
- Supabase保存処理は変更しない

現状の `/validation` は `result_url` query の初期入力に未対応。

そのため初回実装で `result_url` を渡す場合は、`IcebreakValidationClient.tsx` 側に以下の最小対応が必要になる。

- `useSearchParams` で `result_url` を読む
- `reference` の初期値に入れる
- 手入力欄は引き続き編集可能にする

ただし、この対応は次回以降の実装候補であり、今回は行わない。

## 既存 `/feedback` の扱い案

外部検証フェーズでは、結果ページから直接出す主導線は `/validation` に寄せる方が分かりやすい。

選択肢:

### A案: `/feedback` を一旦下げ、`/validation` を主導線にする

- 外部テスター向けには分かりやすい
- Supabase検証データに集約できる
- 既存 `/api/feedback` への送信を増やさずに済む

### B案: `/feedback` と `/validation` を両方出す

- 情報量が増える
- どちらに答えればよいか迷いやすい
- 外部検証初期にはあまり向かない

### C案: `/feedback` は残すが、文言を「体験アンケート」、`/validation` を「検証フォーム」と分ける

- 目的は明確になる
- ただし、結果ページ下部が説明だらけになりやすい

推奨は A案。

外部検証フェーズでは、結果ページ下部の感想導線は `/validation` に寄せる。

## 初回実装する場合の最小方針

初回実装では、次の範囲に留める。

- 結果ページ下部に検証フォームへのボタンを追加する
- 既存のX / LINE / コピー導線は維持する
- 表示順を「共有導線 → 検証フォーム導線」にする
- 既存の `shareText` は変更しない
- 既存の結果URL形式は変更しない
- `result_url` を渡せるなら query で渡す
- `/validation` が query 初期入力に未対応なら、同時に最小対応を検討する
- `/api/feedback` payload は変更しない
- Supabase保存処理は変更しない
- GAS連携は変更しない
- 診断ロジック、重み、設問、`centeredResult` は変更しない

最小変更候補:

- `src/app/research/icebreak-11-v1/_components/IcebreakResultClient.tsx`
  - 下部セクションの順番整理
  - `/validation` へのリンク追加
  - 可能なら `result_url` query を付与
- `src/app/research/icebreak-11-v1/validation/IcebreakValidationClient.tsx`
  - `result_url` query を初期入力する場合のみ変更

## まだ実装しないこと

- 自動アンケート遷移
- シェア文言の再変更
- 11役割コピー文言の変更
- スコア表示
- `centeredResult` 表示
- `centeredResultSummary` 表示
- `/api/feedback` payload変更
- Supabase保存処理変更
- GAS連携変更
- 診断ロジック変更
- 設問データ変更
- scripts変更
- `.env.local` 変更

## 次に決めること

- 結果ページでは `/feedback` を残すか、外部検証中は `/validation` を主導線にするか
- `/validation?result_url=...` を先に実装するか
- 共有ボタンの並びを `X / LINE / コピー` にするか、現状の `共有 / コピー / X / LINE` を維持するか
- ボタン文言をどこまで変えるか
- 外部検証が終わった後、`/feedback` と `/validation` の役割をどう整理するか

## 現時点の推奨

外部テスターへ渡す前の最小改善としては、次がよい。

1. 結果ページ下部の共有導線を先に出す
2. その下に `/validation` への検証フォーム導線を置く
3. `/feedback` は外部検証フェーズでは主導線から外す、または下げる
4. 可能なら `result_url` query を渡し、検証フォームの入力負荷を下げる
5. ただし、シェア文言、判定ロジック、payload、Supabase保存処理は触らない

この順番なら、まず結果を楽しみ、誰かに見せ、その後に感想を送る流れになる。
