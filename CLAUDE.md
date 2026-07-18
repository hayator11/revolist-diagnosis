# レボリスト診断 CLAUDE.md
> 最終更新：2026年5月30日（夜）

---

## このサービスが目指すもの

「性格診断」ではなく、**人と人の組み合わせを設計するOS**。  
「あなたは何者か」で終わらず、「あなたはどう動くか、誰と組むか、どんなチームを作るか」まで答える。

---

## ユーザー体験の流れ（設計の核心）

```
STEP 1  自分の特性を知る
        診断 → 11タイプのうち自分の特性が見える
        ※「こんな人になりたい」という入口でもOK

STEP 2  特性の活かし方を知る
        このタイプはこう動くと力が出る（行動指針）

STEP 3  相性を知る
        こんな特性の人と組むと動きやすい（1人目）
        2人でも詰まるときは、この特性を足す（3人目）

STEP 4  チーム設計に広げる
        3人・4人・5人と人数が増えるほどの組み合わせ提案
        奇数（3人・5人）の方がまとまりやすい

STEP 5  今いる環境で試してみる
        職場・学校・部活・家族など、今ある場所で活かす提案

STEP 6  環境がない・試したい人へ
        「こんな活動があるよ」→ Revoプロジェクトを自然な選択肢として紹介
```

---

## Revoの位置づけ（重要）

**Revoは入口ではなく出口。**  
自分の特性を活かしたいと思った人が、自然に辿り着く場所として設計する。  
押しつけない。紹介するだけ。

---

## 設計の大原則

- ネガティブな表現は絶対に使わない
  - ❌ 相性が悪い / 向いていない / 欠点 / 弱点
  - ✅ 違う強みを持つ / 伸びしろ / 眠っている力 / 力を引き出す存在
- タイプは優劣ではなく、それぞれ独自の力を持つ存在
- まずは今いる環境で使えるが大前提
- Revoは押しつけず、自然に辿り着く場所として設計する

---

## チーム人数の考え方

| 人数 | 特徴 |
|------|------|
| 2人 | 相性が良ければ強い。詰まりやすい |
| 3人 | 奇数でまとまりやすい。推奨 |
| 4人 | 対立しやすい。3+1の構造にすると動きやすい |
| 5人 | 役割が分散して動きやすくなる |

---

## 技術スタック

- Next.js 16.2.6 / React 19 / TypeScript 5
- Tailwind CSS 4 / App Router / `src/` ディレクトリ構成
- `html-to-image` でクライアントサイドPNG生成
- `next/og`（Edge Runtime）でサーバーサイドOG画像生成
- Vercel 自動デプロイ（GitHub main ブランチ連携）

---

## ファイル構成

```
src/
├── app/
│   ├── page.tsx               # トップページ
│   ├── diagnosis/page.tsx     # ライト診断（21問）
│   ├── result/                # 診断結果ページ
│   ├── full-diagnosis/        # 111問予告ページ
│   ├── revo/                  # Revoコミュニティ紹介
│   ├── types/                 # 11タイプ一覧
│   ├── monitor/               # Revo OS β版 モニター専用ページ群
│   │   ├── page.tsx           # モニタートップ
│   │   ├── role/              # Revo Role診断（18問）
│   │   ├── team/              # Revo Team診断（18問）
│   │   ├── match/             # Revo Match診断（18問）
│   │   ├── growth/            # Revo Growth診断（18問）
│   │   ├── feedback/          # フィードバックフォーム
│   │   └── _components/       # 診断・結果の共通クライアントコンポーネント
│   └── api/og/                # OG画像生成（Edge Runtime）
├── components/
│   ├── ResultCard.tsx         # 診断結果カード（7ステップフロー）
│   ├── ShareButtons.tsx       # SNSシェア + 画像保存
│   ├── ShareCard.tsx          # シェア用1200×630カード
│   ├── DiagnosisQuestion.tsx  # 質問UI（ライト診断用）
│   ├── MonitorQuestion.tsx    # 質問UI（モニター診断用）
│   ├── MonitorResultCard.tsx  # モニター結果カード
│   ├── MonitorNav.tsx         # 診断切り替えナビ
│   ├── FadeInSection.tsx      # スクロールフェードイン
│   └── ActivitySuggestion.tsx # 活動提案（現在未使用）
├── data/
│   ├── revotypes.ts           # 11タイプ定義（全データ）
│   ├── questions.ts           # ライト診断21問
│   ├── combinations.ts        # 110通りの組み合わせ説明
│   ├── activities.ts          # REVO活動データ
│   ├── monitorQuestions.ts    # モニター診断4×18問
│   └── monitorResults.ts      # モニター結果テキスト・メタ情報
└── lib/
    ├── calculateResult.ts          # ライト診断スコア計算
    └── calculateMonitorResult.ts   # モニター診断スコア計算（4種）
```

---

## RevoType インターフェース（revotypes.ts）

```ts
interface RevoType {
  key, name, catchcopy, description
  strengths, potential
  gives, givesDetail          // 渡しているもの
  receives, receivesDetail    // 受け取ると潤うもの
  goodWith, goodWithDetail    // 相性タイプ（3つ）
  activities                  // REVO活動タグ
  generalActivities           // 一般的な向いている活動
  actionPrinciples            // 行動指針（4つ）← 追加済み
  currentEnvTips              // 今いる環境での活かし方（3つ）← 追加済み
  teamDesign {                // チーム設計データ ← 追加済み
    bestPair                  // 1対1ベストパートナー
    thirdPerson               // 3人目に足すといいタイプ
    teamNote                  // 3人チームの説明
  }
  color, openingText, environment, creates, howToCheer, growthQuest
}
```

---

## 結果ページのフロー（ResultCard.tsx）

```
① わかる…（オープニング）
② タイプカード（メイン/サブ/補助）
③ コンビネーション説明
④ このタイプの動き方（行動指針4つ）     ← STEP 2
⑤ 自然に渡しているもの
⑥ 受け取ると潤うもの
⑦ 1対1ベストパートナー                  ← STEP 3
⑧ 3人目に足すといいタイプ＋人数別設計   ← STEP 4
⑨ 今いる環境で試してみよう             ← STEP 5
⑩ 眠っている可能性
⑪ 成長クエスト
⑫ 応援され方
⑬ 試せる環境を探している人へ（Revo紹介）← STEP 6
⑭ 締め（あなたの役割はまだ完成していません）
   SNSシェア + 画像保存
⑮ CTA（111問 / Revo / もう一度）
```

---

## モニター専用ページ（Revo OS β版）

### 目的
111問フル診断の実装前に4つの診断軸を検証する実験ページ。  
「どの診断軸が刺さるか」「どの言葉が残るか」「どの結果を人に見せたくなるか」を検証する。

### 各診断の概要

| 診断 | URL | 目的 | 結果で表示するもの |
|------|-----|------|-------------------|
| Revo Role | `/monitor/role` | 今強く使っている役割を測る | メイン/サブ/補助役割・渡しているもの・Revo Funding役割 |
| Revo Team | `/monitor/team` | チーム内の立ち位置を測る | チーム内役割・向いている立ち位置・Revo Funding役割 |
| Revo Match | `/monitor/match` | 誰と組むと可能性が広がるかを測る | 開花させてくれる存在・あなたが開花させる存在・第三者効果 |
| Revo Growth | `/monitor/growth` | 次に育てると良い役割を測る | 次の役割・眠っている力・成長クエスト・活動・未来 |

### 各ページ
- `/monitor` — モニタートップ（4診断カード + 説明）
- `/monitor/role|team|match|growth` — 各18問診断
- `/monitor/*/result` — 各診断結果（次の診断 + フィードバック導線）
- `/monitor/feedback` — フィードバックフォーム（13問）

---

## 実装済み一覧（完了）

### ✅ 結果ページの再設計（設計思想①）
`src/components/ResultCard.tsx` — 7ステップフローに完全対応済み。
- 行動指針4つ / 1対1ベストパートナー / 3人目候補＋人数別設計 / 今いる環境Tips / Revoは出口として自然に紹介

### ✅ revotypes.ts に3フィールド追加（全11タイプ）
- `actionPrinciples` — 行動指針4つ
- `currentEnvTips` — 今いる環境での活かし方3つ
- `teamDesign { bestPair, thirdPerson, teamNote }` — チーム設計データ

### ✅ Revo OS β版 モニター専用ページ群
`/monitor` — 全ページ本番稼働中
- Revo Role / Team / Match / Growth（各18問）
- フィードバックフォーム（13問、UI実装済み）
- 各結果ページに「次の診断」「感想を送る」導線

---

## 今後の実装優先順（次のClaude Codeへの引き継ぎ）

### 🔴 最優先
1. **フィードバック送信先の実装**  
   `src/app/monitor/feedback/page.tsx` はフォームUIのみ。送信データが保存されない。  
   → Formspree（最速）/ Supabase / Vercel Server Action のいずれかで実装する。

2. **11タイプ × 相性 × チーム設計表**（設計思想②）  
   どのタイプとどのタイプが相性いいか、3人目・4人目に足すといいタイプは何か、の完全設計表。  
   → `src/data/teamCompatibility.ts` として実装予定。  
   → これが結果ページ・チーム向け機能・組織向け機能すべての土台になる。

### 🟡 次フェーズ
3. **Revoプロジェクト紹介セクションの強化**（設計思想③）  
   各Revoの活動がどのタイプに向いているかをマッピング。  
   現在は activities タグのみ。もっと具体的な活動内容と導線を追加する。

4. **モニターフィードバック結果の集計・可視化**  
   モニター期間終了後、集まった回答を集計して次の設計に活かす。

### 🟢 将来
5. **111問フル診断**  
   Role/Team/Match/Growth の4診断を統合した完全版。  
   `src/lib/calculateMonitorResult.ts` の最下部にコメントあり（Future: integrate...）。

6. **チーム診断**（複数人が同時に診断してチーム設計図を出す）

7. **Revoコミュニティ登録・ログイン**

8. **仲間マッチング / Revoマップ**（結果ページCTAに準備中として表示済み）

---

## 将来コメント（コード内に記載済み）

```ts
// Future: integrate Role / Team / Match / Growth into Revo111 full diagnosis
// Future: connect results to Revo Funding team formation
// Future: connect results to Revo Link matching
// Future: connect results to Revo Song collaboration
// Future: add user accounts and store diagnosis history
```

---

## 開発時の注意事項

- **プロジェクトをまたいだファイル編集は絶対しない**
- ネガティブ表現（相性が悪い・向いていない・弱点・欠点・失敗）は使わない
- `generateMetadata` を export するページは Server Component にする（`"use client"` 不可）
- `useSearchParams` は必ず `<Suspense>` でラップする
- OG画像ルート（`/api/og`）は Edge Runtime（`export const runtime = "edge"`）
- html-to-image は SSR で動かないので動的インポートを使う

## Obsidian連携（会話ログの保存ルール）

Obsidian側に「Claude会話ログ」フォルダ（Conversations / MOC / Templates 構成）がある前提。

### ルール

1. 会話が一区切りついたとき・終わりそうなときに、**「この会話をObsidianに保存しますか？」と一度だけ確認する**
2. 保存OKなら、下のフォーマットで会話ノートを**1つのMarkdownコードブロック**として出力する
   （ユーザーがコピペして `Conversations/YYYY-MM-DD タイトル.md` として保存する）
3. 内容は「3行まとめ / 決めたこと / 次にやること」中心に短く。会話全文は転写しない
4. genre は次の5つから1つ: `開発` / `設計アイデア` / `マーケSEO` / `診断コンテンツ` / `運用タスク`
5. リンク切れを防ぐため、リンクは必ず次の表記のまま使う:
   - ジャンル: `[[MOC-開発]]` `[[MOC-設計アイデア]]` `[[MOC-マーケSEO]]` `[[MOC-診断コンテンツ]]` `[[MOC-運用タスク]]`
   - プロジェクト: `[[レボリスト診断]]`（このリポジトリ）。他プロジェクトに触れたら `[[RevoSong]]` `[[レボリスト診断]]` `[[RevoFunding]]` `[[Okurimono]]` も追加
   - 過去の会話の続きなら `[[YYYY-MM-DD タイトル]]` 形式で関連ノートにもリンクする

### ノートのフォーマット

```markdown
---
date: YYYY-MM-DD
genre: 診断コンテンツ
project: レボリスト診断
tags:
  - 会話ログ
  - 診断コンテンツ
---

# タイトル（15文字前後で内容がわかるもの）

> [!summary] 3行まとめ
> -

## 決めたこと

-

## 次にやること

- [ ]

## 🔗 リンク

- ジャンル: [[MOC-診断コンテンツ]]
- プロジェクト: [[レボリスト診断]]
- 関連する過去ノート:
```
