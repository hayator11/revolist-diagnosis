# Icebreak centered validation feedback Supabase送信テストログ

## 追記: 公開環境でのSupabase実保存成功確認

確認日: 2026-06-18

Icebreak centered validation feedback が、公開環境からも Supabase に保存できることを確認しました。

確認結果:

- 公開URLの検証フォームが表示された
- 公開URLから `POST /api/icebreak/centered-validation` への送信が成功した
- レスポンス `{"ok":true}` を確認
- Supabase Table Editorで `icebreak_centered_validation_feedback` にレコード保存を確認
- `diagnosis_id: public-test-001` の保存を確認
- `fit_score: 4` の保存を確認
- Table Editor上で3 recordsを確認
- Vercel本番環境の `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` が反映されていることを確認
- 秘密キーの値は表示・記録していない
- 実際のSupabase URLは表示・記録していない
- 実装変更なし

この確認により、外部テスターに渡す前の技術条件として、公開環境からの検証フォーム表示、API送信、Supabase保存は揃った状態と扱う。

## 追記: Supabase実保存の成功確認

確認日: 2026-06-18

Icebreak centered validation feedback の Supabase 実保存が通ったことを確認しました。

確認結果:

- `POST /api/icebreak/centered-validation` に正常payloadを送信
- レスポンス `{"ok":true}` を確認
- Supabase Table Editorで `icebreak_centered_validation_feedback` にレコード保存を確認
- `diagnosis_id: test-001` の保存を確認
- `fit_score: 4` の保存を確認
- Table Editor上で2 recordsを確認
- 秘密キーの値は表示・記録していない
- `.env.local` はGit管理対象外
- 実装変更なし

成功時の `SUPABASE_URL` は、次の形式である必要があります。

```text
https://<project-ref>.supabase.co
```

次の形式は誤りです。

```text
https://<project-ref>.supabase.co/rest/v1
```

以前発生していた `PGRST125 Invalid path specified in request URL` は、`SUPABASE_URL` に `/rest/v1` が含まれていたことが原因でした。

`@supabase/supabase-js` は `SUPABASE_URL` からREST APIのパスを組み立てるため、環境変数にはプロジェクトURLのrootだけを設定します。

## 初回テスト時の結論

初回テスト時点では、Icebreak centered validation feedback の Supabase 実保存は未確認でした。

理由は、Supabase保存に必要な環境変数が未設定だったためです。

- `SUPABASE_URL`: なし
- `SUPABASE_SERVICE_ROLE_KEY`: なし

正常payloadを `POST /api/icebreak/centered-validation` に送信したところ、以下が返りました。

```json
{"ok":false,"error":"server_error"}
```

HTTP status は `500` でした。

これはAPI routeのバリデーション不具合ではなく、Supabase server client 作成時に必要な環境変数が見つからなかったことによる、環境設定未完了として扱います。

## 初回テスト時に確認できたこと

API route のバリデーションは動いています。

確認した不正payload:

- `diagnosis_id` / `result_url` が両方ない
- `fit_score` が 1〜5 の範囲外
- 必須テキストが空

結果:

```text
diagnosis_id / result_url 両方なし: 400 validation_error
fit_score 範囲外: 400 validation_error
必須テキスト空: 400 validation_error
```

また、以下も確認済みです。

- `git status` は clean
- `npm run test:icebreak` 成功
- `npx tsc --noEmit --incremental false` 成功
- 実装変更なし
- `.env.local` の作成・編集なし
- 秘密キーの値は出力していない

## 初回テスト時に未確認だったこと

以下は、今回の作業環境では未確認です。

- Supabase側に `icebreak_centered_validation_feedback` テーブルが作成済みか
- 正常payloadで `{"ok":true}` が返るか
- Supabaseテーブルに1件保存されるか

## 次に必要な手動作業

1. Supabase SQL Editorで `docs/icebreak/supabase_schema.sql` の `icebreak_centered_validation_feedback` テーブル定義を実行または確認する
2. `.env.local` または実行環境に以下を設定する
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. 環境変数の値はチャット・ログ・docsに貼らない
4. 開発サーバーを再起動する
5. 正常payloadで再送信する
6. Supabaseテーブルに1件保存されたことを確認する

## 再テスト用curl例

秘密キーはcurlに含めません。API routeが server-only client を使って Supabase に保存します。

```bash
curl -X POST http://localhost:3000/api/icebreak/centered-validation \
  -H "Content-Type: application/json" \
  -d '{"diagnosis_id":"test-001","fit_score":4,"self_like_text":"場を整えるところが近いです","discomfort_text":"少し強めに出た部分があります","conversation_use_score":5,"matching_use_score":4}'
```

期待する成功レスポンス:

```json
{"ok":true}
```

## 注意事項

- `SUPABASE_SERVICE_ROLE_KEY` は server-only
- `SUPABASE_SERVICE_ROLE_KEY` はブラウザに出さない
- `SUPABASE_SERVICE_ROLE_KEY` を `NEXT_PUBLIC_` 付きで公開しない
- `SUPABASE_SERVICE_ROLE_KEY` をGitにコミットしない
- `SUPABASE_SERVICE_ROLE_KEY` の値をdocsに書かない
- `.env.local` はGitにコミットしない
- 既存 `/api/feedback` には接続しない
- GAS連携には接続しない
- 既存payloadには追加しない

## 今回変更していないもの

- `.env.local`
- `src/app/api/icebreak/centered-validation/route.ts`
- `src/lib/supabase/server.ts`
- 検証フォームUI
- 結果表示
- 11役割コピー
- 診断ロジック
- `/api/feedback`
- GAS関連
- Supabase関連実装
- 設問データ
- scripts
