# Revo111 Codex Implementation Master

## 目的

この指示書は、CodexにRevo111の44問版モニター診断を実装させるための総合実装指示書である。

Revo111は性格診断ではない。

人の役割、成長、仲間、活動、循環を可視化するための成長OSである。

---

# 最初に読むファイル

Codexは最初に以下を読むこと。

1. docs/revo111/Revo111_Master.md
2. docs/revo111/core/Revo111_Core_Philosophy.md
3. docs/revo111/core/Revo11_Role_Dictionary_Part1.md
4. docs/revo111/core/Revo11_Role_Dictionary_Part2.md
5. docs/revo111/core/Revo11_Role_Dictionary_Part3.md
6. docs/revo111/core/Revo11_Growth_Routes.md
7. docs/revo111/core/Revo11_Match_Rules.md
8. docs/revo111/core/Revo11_ThirdPerson_Effects.md
9. docs/revo111/core/Revo111_Question_Master.md
10. docs/revo111/scoring/Revo111_Scoring_Master.md
11. docs/revo111/results/Revo111_Result_Generator.md
12. data/quests/Revo_Quest_DB.md
13. data/projects/Revo_Funding_Role_DB.md
14. data/projects/Revo_Project_DB.md

---

# 実装ゴール

## Phase 1

Revo111 44問版診断ページを実装する。

---

## Phase 2

診断結果ページを実装する。

表示項目：

- メイン役割
- サブ役割
- 補助役割
- 役割コピー
- 自然に渡しているもの
- 受け取ると潤うもの
- 成長ルート
- 未来を広げる存在
- 第三者効果
- 向いている活動
- Fundingでの役割
- 今週のクエスト

---

## Phase 3

モニター感想フォームを実装する。

最初はGoogleフォームリンクでもよい。

可能ならSupabaseへ保存する。

---

## Phase 4

Monitor A / B / C / D のページを実装する。

- Monitor A：役割検証
- Monitor B：チーム循環検証
- Monitor C：活動適性検証
- Monitor D：東洋思想検証

---

# 推奨URL

## 診断トップ

/revo111

## 44問版診断

/revo111/diagnosis

## 結果ページ

/revo111/result

## モニター

/revo111/monitor

## Monitor A

/revo111/monitor/a

## Monitor B

/revo111/monitor/b

## Monitor C

/revo111/monitor/c

## Monitor D

/revo111/monitor/d

---

# 実装ルール

## 1. 否定表現禁止

以下は使わない。

- 弱点
- 欠点
- 不足
- 向いていない
- 合わない
- 相性が悪い
- ダメ

---

## 2. 推奨表現

以下を使う。

- 眠っている力
- 育つ可能性
- まだ使っていない才能
- 未来を広げる存在
- 心地よく整えてくれる存在
- 開花させてくれる存在

---

## 3. 結果は固定診断にしない

「あなたは〇〇タイプです」で終わらせない。

必ず以下を表示する。

- 今の役割
- 次に育つ可能性
- 未来を広げる仲間
- 小さな行動

---

# 技術実装方針

## 優先

既存のRevo111ライト診断サイトがある場合は、そのコードを活かす。

## UI

- スマホ最優先
- 1問ずつ表示
- 進捗バー
- 戻るボタン
- 回答完了後に結果ページへ遷移

---

# データ構造案

## Question

```ts
type Question = {
  id: number;
  text: string;
  role: RevoRoleKey;
};
type Answer = {
  questionId: number;
  value: 1 | 2 | 3 | 4 | 5;
};
type RoleScore = {
  role: RevoRoleKey;
  score: number;
};
type DiagnosisResult = {
  mainRole: RevoRoleKey;
  subRole: RevoRoleKey;
  supportRole: RevoRoleKey;
  scores: RoleScore[];
};

保存後。

```bash
git add .
git commit -m "Add Revo111 Codex implementation master"
