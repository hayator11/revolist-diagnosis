# Icebreak 33 公開環境確認メモ

## 目的

Icebreak 33 を外部テスターへ渡す前に、公開環境の有無、公開URL、必要な環境変数、公開URL上での検証手順を整理する。

このドキュメントは調査・確認メモであり、実装変更は行わない。

## 調査結果

### 公開環境の有無

`docs/PIPELINE_GUIDE.md` では、`revolist-diagnosis` は Vercel を使った運用フローとして整理されている。

確認できた内容:

- PR作成時に Vercel プレビューURLが発行される想定
- `main` ブランチにマージすると Vercel 本番へ自動デプロイされる想定
- 初回確認事項として、Vercel側の環境変数確認が挙げられている

一方で、リポジトリ内では以下は確認できなかった。

- `vercel.json`
- `.vercel/`
- `netlify.toml`
- Render用設定ファイル
- GitHub Actions workflow
- Icebreak 33 の確定した公開URL

そのため、現時点では「Vercel運用前提の資料はあるが、この作業環境だけでは公開URLと本番環境変数の設定状況は未確認」と扱う。

### GitHub remote

Git remote は `revolist-diagnosis` のGitHubリポジトリを指している。

ただし、remote URLだけでは Vercel プロジェクト接続や公開URLまでは判断できない。

## 公開URLの確認状況

Icebreak 33 の公開URLは、リポジトリ内の設定ファイルやdocsからは確定できなかった。

確認候補URL:

```text
https://<public-host>/research/icebreak-11-v1
https://<public-host>/research/icebreak-11-v1/validation
```

`<public-host>` は、VercelのProject Settings、Deployments、Domains、またはPR Preview URLから手動で確認する必要がある。

## 本番環境に必要な環境変数

公開環境で検証フォームから Supabase に保存するには、Vercel等の本番環境に以下を設定する必要がある。

```text
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

`SUPABASE_URL` は次の形式にする。

```text
https://<project-ref>.supabase.co
```

次のように `/rest/v1` を含めるのは誤り。

```text
https://<project-ref>.supabase.co/rest/v1
```

`/rest/v1` を含めると、`PGRST125 Invalid path specified in request URL` になる可能性がある。

## 秘密情報の扱い

- `SUPABASE_SERVICE_ROLE_KEY` は server-only secret として扱う
- `SUPABASE_SERVICE_ROLE_KEY` をブラウザに出さない
- `SUPABASE_SERVICE_ROLE_KEY` を `NEXT_PUBLIC_` 付きで公開しない
- `SUPABASE_SERVICE_ROLE_KEY` をdocs、ログ、チャット、Gitに書かない
- 実際の `SUPABASE_URL` もdocs、ログ、チャットには書かない
- Vercel CLIなど、環境変数の値が表示される可能性がある操作は避ける

## Vercelで手動確認すること

1. Vercel Dashboardで `revolist-diagnosis` のProjectを開く
2. GitHub repository が対象リポジトリに接続されているか確認する
3. Deployments または Domains で公開URLを確認する
4. Project Settings の Environment Variables を開く
5. `SUPABASE_URL` が設定されているか確認する
6. `SUPABASE_SERVICE_ROLE_KEY` が設定されているか確認する
7. 適用範囲を確認する
   - Production
   - Preview
   - Development
8. 環境変数を追加・修正した場合は再デプロイする

値は管理画面上で確認し、チャットやdocsには貼らない。

## 公開URLでの検証手順

### 1. 診断ページ

確認対象:

```text
https://<public-host>/research/icebreak-11-v1
```

確認すること:

- 33問に回答できる
- スマホで表示が崩れない
- 回答後に結果画面へ進める
- URL形式が変わっていない

### 2. 結果画面

確認すること:

- 結果画面が表示される
- 11役割コピーカードが表示される
- カードは `details.lead` の直後、Center Force の前に表示される
- 表示項目は `workingCopy`, `catchCopy`, `selfCheckItems` 3つのみ
- シェア文言や既存導線が壊れていない

### 3. 検証フォーム

確認対象:

```text
https://<public-host>/research/icebreak-11-v1/validation
```

確認すること:

- 検証フォームが開ける
- 本名や個人情報を求めていない
- 診断IDまたは結果URLを入力できる
- 必須項目を入力できる
- 送信中・成功・失敗の表示が自然に出る

### 4. Supabase保存

公開URLから1件だけ送信テストを行う。

確認すること:

- 送信が成功する
- APIが `{"ok":true}` 相当の結果を返す
- Supabase Table Editorで `icebreak_centered_validation_feedback` に保存されている
- `diagnosis_id` または `result_url` が入っている
- 個人情報が保存されていない

## 失敗時に見ること

### `server_error`

本番環境に必要な環境変数が設定されていない可能性がある。

確認すること:

- `SUPABASE_URL` が設定されているか
- `SUPABASE_SERVICE_ROLE_KEY` が設定されているか
- 環境変数を設定後に再デプロイしたか

### `save_failed`

Supabase insert までは進んでいる可能性がある。

確認すること:

- `SUPABASE_URL` に `/rest/v1` が含まれていないか
- `SUPABASE_URL` が正しいSupabaseプロジェクトを向いているか
- `icebreak_centered_validation_feedback` テーブルが作成済みか
- カラム名とschemaが一致しているか
- check制約に違反していないか

### `validation_error`

フォームから送る値を確認する。

確認すること:

- `diagnosis_id` または `result_url` のどちらかが入っているか
- `fit_score` が1〜5の整数か
- `conversation_use_score` が1〜5の整数か
- `matching_use_score` が1〜5の整数か
- `self_like_text` が空ではないか
- `discomfort_text` が空ではないか

## 未確認事項

- Icebreak 33 の正式な公開URL
- Vercel Project が現在どのGitHubリポジトリと接続されているか
- Production環境に `SUPABASE_URL` が設定済みか
- Production環境に `SUPABASE_SERVICE_ROLE_KEY` が設定済みか
- Preview環境にも同じ環境変数を設定するか
- 公開URLから実際に Supabase 保存が通るか

## 次にやること

1. Vercel Dashboardで公開URLを確認する
2. Vercel Project Settingsで環境変数を確認する
3. 未設定であれば `SUPABASE_URL` と `SUPABASE_SERVICE_ROLE_KEY` を追加する
4. 環境変数追加後に再デプロイする
5. 公開URLで Icebreak 33 を1回通しで回答する
6. 結果画面の11役割コピーカードを確認する
7. 公開URLの検証フォームから1件送信する
8. Supabase Table Editorで保存確認する
9. 問題なければ外部テスター向け案内文に公開URLを入れる

## 今回変更しないもの

- 実装ファイル
- UI
- 結果表示
- 11役割コピー
- 検証フォーム
- Supabase client
- API route
- Google Apps Script連携
- 設問データ
- アルゴリズム
- scripts
- `.env.local`
