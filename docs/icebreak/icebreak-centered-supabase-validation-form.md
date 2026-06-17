# Icebreak 33 中心0モデル Supabase検証フォーム仕様

## 目的

Icebreak 33 の診断結果について、実回答者の納得感を集める。

`legacyResult` と `centeredResultSummary` のズレを、後から分析できる状態にする。

`centeredResultSummary` はフォーム上では表示しない。回答者には、現在の診断結果と、その結果への感想だけを聞く。

まず30件、可能なら100件を目標に集める。

## 設置方針

Googleフォームではなく、Supabaseに保存する自前フォームとする。

診断本体とは切り離した検証用フォームとして扱う。

本番の結果表示やURL形式は変えない。

既存 `/api/feedback` やGoogle Apps Script連携には、まだ接続しない。

Supabaseの無料枠で始める前提にする。

検証フォームの送信は、ブラウザからSupabaseへ直接insertしない。

送信は専用API routeを経由する。

既存 `/api/feedback` とは分ける。

推奨API route候補は `src/app/api/icebreak/centered-validation/route.ts`。

## フォームで集める項目

### 必須項目

- 診断IDまたは結果URL
- 診断結果のしっくり度 1〜5
- 自分らしいと感じた部分
- 違和感があった部分
- 自己紹介や会話のきっかけに使えそうか 1〜5
- オフ会で人とつながるきっかけになりそうか 1〜5

### 任意項目

- もう少し知りたい要素
- 自由コメント
- 自分ではどんなタイプだと思うか
- 人からよく言われる特徴
- 答えにくかった設問
- 「どちらでもない」を選んだ理由
- マッチングや席替えに使われることへの抵抗感

## 集めない情報

初期検証では、以下は集めない。

- 本名
- 住所
- 電話番号
- 健康情報
- 政治・宗教などセンシティブ情報
- 過度に個人的な情報

連絡先が必要になった場合も、診断検証データとは分けて管理する。

## Supabaseテーブル案

テーブル名候補:

```text
icebreak_centered_validation_feedback
```

カラム案:

| カラム | 型 | 用途 |
|---|---|---|
| `id` | uuid primary key | レコードID |
| `created_at` | timestamp | 送信日時 |
| `diagnosis_id` | text | 診断ID |
| `result_url` | text | 結果URL |
| `fit_score` | integer | 診断結果のしっくり度 1〜5 |
| `self_like_text` | text | 自分らしいと感じた部分 |
| `discomfort_text` | text | 違和感があった部分 |
| `conversation_use_score` | integer | 自己紹介や会話に使えそうか 1〜5 |
| `matching_use_score` | integer | オフ会やマッチングに使えそうか 1〜5 |
| `want_to_know_text` | text | もう少し知りたい要素 |
| `free_comment` | text | 自由コメント |
| `self_type_text` | text | 自分ではどんなタイプだと思うか |
| `others_say_text` | text | 人からよく言われる特徴 |
| `hard_question_text` | text | 答えにくかった設問 |
| `neutral_reason_text` | text | 「どちらでもない」を選んだ理由 |
| `matching_resistance` | text | マッチングや席替えへの抵抗感 |

## 保存しないもの

初期段階では以下は保存しない。

- `centeredResultSummary` 全量
- `axisScores` 全量
- `roleScores` 全量
- `forceScores` 全量
- `rawAnswers`
- `centeredAnswers`
- 個人情報

ただし、後から `diagnosis_id` または `result_url` をキーにして、分析側で `legacyResult` / `centeredResultSummary` と紐づける。

## RLS方針

RLSは有効にする。

public insert policy は作らない。

select / update / delete は公開しない。

insertは Next.js API route 経由で行う。

API route内で `SUPABASE_SERVICE_ROLE_KEY` を使う server-only insert を想定する。

`SUPABASE_SERVICE_ROLE_KEY` はブラウザに出さない。

`NEXT_PUBLIC_SUPABASE_*` は初期実装では使わない。

個人情報を集めない前提でも、読み取り公開はしない。

## 画面構成案

1. 冒頭説明
2. 診断ID / 結果URL入力
3. しっくり度
4. 自分らしい点
5. 違和感
6. 会話に使えそうか
7. オフ会で使えそうか
8. 任意コメント
9. 送信完了画面

## 回答者向け冒頭文案

このフォームは、Icebreak 33 の診断結果をよりよくするための検証アンケートです。

あなた個人を評価するものではありません。

本名や個人情報の入力は不要です。

診断結果を見て、しっくりきた部分や違和感のあった部分を教えてください。

所要時間は3〜5分ほどです。

## まだやらないこと

この仕様書の段階では、以下は行わない。

- `centeredResultSummary` の表示
- `/api/feedback` への追加
- Google Apps Script連携変更
- 既存payload変更
- 結果表示変更
- URL変更
- 重み変更
- Supabaseへの実装接続
- Supabase client 実装
- `@supabase/supabase-js` 追加
- API route実装
- フォームUI実装
- public insert policy作成

## 関連ファイル

- `docs/icebreak/icebreak-centered-data-validation.md`
- `docs/icebreak/icebreak-centered-validation-survey.md`
- `docs/icebreak/supabase_schema.sql`
- `docs/icebreak/event_box_design.md`
- `src/lib/supabase/server.ts`（将来候補）
- `src/app/api/icebreak/centered-validation/route.ts`（将来候補）
