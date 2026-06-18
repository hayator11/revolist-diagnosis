# Icebreak 33 外部検証 公開URLチェックリスト

## 目的

外部テスターに Icebreak 33 を渡す前に、localhost ではなく公開URL上で、診断・結果表示・検証フォーム・Supabase保存が一通り動くことを確認する。

このドキュメントは確認手順の整理であり、実装変更は行わない。

## 前提

- 外部検証案内文docs: `396d2db document icebreak external test guide`
- ローカルでは Supabase 保存成功済み
- `POST /api/icebreak/centered-validation` で `{"ok":true}` を確認済み
- Supabase Table Editorで保存確認済み
- 外部テスターに送るURLは localhost ではなく公開URLを使う

## 外部テスターに送る前のチェックリスト

### 1. 公開中の診断URL

- [ ] 公開中の診断URLがある
- [ ] URLが localhost ではない
- [ ] スマホから開ける
- [ ] シークレットウィンドウ、またはログインしていないブラウザでも開ける

確認対象:

```text
https://<public-host>/research/icebreak-11-v1
```

### 2. 診断回答

- [ ] 公開URLで Icebreak 33 の33問に回答できる
- [ ] 途中で画面が崩れない
- [ ] 回答後に結果画面へ遷移する
- [ ] URL形式が想定どおり維持されている

### 3. 結果画面

- [ ] 公開URLで結果画面が表示される
- [ ] 結果URLを別タブで開き直しても表示される
- [ ] 結果画面に11役割コピーカードが表示される
- [ ] 役割コピーカードは結果冒頭の `details.lead` 直後、Center Force 前に表示される
- [ ] 表示項目は `workingCopy`, `catchCopy`, `selfCheckItems` 3つのみ
- [ ] スマホ幅で横はみ出しがない
- [ ] シェア導線が表示される

### 4. 検証フォーム

- [ ] 公開URLで検証フォームが開ける
- [ ] 本名や個人情報を求めていない
- [ ] 診断IDまたは結果URLを入力できる
- [ ] しっくり度、会話に使えそうか、オフ会で使えそうかを入力できる
- [ ] 自分らしい点、違和感を入力できる
- [ ] 任意コメントを入力できる

確認対象:

```text
https://<public-host>/research/icebreak-11-v1/validation
```

### 5. 公開環境からの送信

- [ ] 公開URLの検証フォームから送信できる
- [ ] 送信後に成功メッセージが表示される
- [ ] ブラウザの画面上にSupabaseの秘密情報が出ていない
- [ ] 既存 `/api/feedback` ではなく、専用API routeへ送信される

送信先:

```text
POST /api/icebreak/centered-validation
```

### 6. Supabase保存

- [ ] Supabase Table Editorで `icebreak_centered_validation_feedback` を開く
- [ ] 公開環境から送信したテストレコードが保存されている
- [ ] `diagnosis_id` または `result_url` が入っている
- [ ] `fit_score` が入っている
- [ ] `conversation_use_score` が入っている
- [ ] `matching_use_score` が入っている
- [ ] 個人情報が保存されていない

## 本番環境に必要な環境変数

Vercel等の本番環境には、以下を server-only secret として設定する。

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

`@supabase/supabase-js` がREST APIのパスを組み立てるため、環境変数にはプロジェクトURLのrootだけを設定する。

## 秘密情報の扱い

- `SUPABASE_SERVICE_ROLE_KEY` は server-only secret として扱う
- `SUPABASE_SERVICE_ROLE_KEY` を `NEXT_PUBLIC_` 付きで公開しない
- `SUPABASE_SERVICE_ROLE_KEY` をブラウザに出さない
- `SUPABASE_SERVICE_ROLE_KEY` をdocsに書かない
- `SUPABASE_SERVICE_ROLE_KEY` をチャットに貼らない
- `SUPABASE_SERVICE_ROLE_KEY` をログに出さない
- `SUPABASE_SERVICE_ROLE_KEY` をGitにコミットしない
- 実際の `SUPABASE_URL` もdocs・チャット・ログには書かない

## 公開環境での1件送信テスト

外部テスターに渡す前に、運営側で1件だけ送信テストを行う。

推奨テスト内容:

- `diagnosis_id`: `public-test-001` など、テストだと分かる値
- `fit_score`: 4
- 自分らしい点: テスト用の短文
- 違和感: テスト用の短文
- 会話に使えそうか: 5
- オフ会で使えそうか: 4

確認すること:

- [ ] フォーム送信が成功する
- [ ] APIが `{"ok":true}` 相当の成功結果を返す
- [ ] Supabase Table Editorで保存を確認する
- [ ] テストレコードが不要なら、確認後に管理画面から削除する

## 失敗時に見ること

### `server_error`

まず本番環境の環境変数を確認する。

- `SUPABASE_URL` が設定されているか
- `SUPABASE_SERVICE_ROLE_KEY` が設定されているか
- デプロイ後に環境変数が反映されているか

### `save_failed`

Supabase insert までは進んでいる可能性がある。

確認すること:

- `SUPABASE_URL` に `/rest/v1` が含まれていないか
- URLが正しいSupabaseプロジェクトを向いているか
- `SUPABASE_SERVICE_ROLE_KEY` が server-only secret として設定されているか
- `icebreak_centered_validation_feedback` テーブルが作成済みか
- カラム名がschemaと一致しているか
- check制約に違反していないか

### `validation_error`

フォームから送っている値を確認する。

- `diagnosis_id` または `result_url` のどちらかが入っているか
- `fit_score` が1〜5の整数か
- `conversation_use_score` が1〜5の整数か
- `matching_use_score` が1〜5の整数か
- `self_like_text` が空ではないか
- `discomfort_text` が空ではないか

## 外部テスターへ送る直前の最終確認

- [ ] 診断URLをスマホで開ける
- [ ] 33問に回答できる
- [ ] 結果画面が表示される
- [ ] 11役割コピーカードが表示される
- [ ] 検証フォームが開ける
- [ ] 検証フォームから送信できる
- [ ] Supabaseに保存される
- [ ] 秘密キーが画面・docs・ログに出ていない
- [ ] 外部テスター向け案内文に公開URLを入れられる状態になっている

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
