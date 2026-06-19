# Icebreak 33 organizer Supabase SQL execution checklist

## 目的

Icebreak 33 organizer 用のSupabaseテーブルを作成する前に、実行対象、影響範囲、確認手順、失敗時対応を明確にする。

このdocsはSQL実行前のチェックリストであり、今回はSQLを実行しない。Supabaseテーブル作成、RLS適用、policy作成、trigger実行、cron、自動削除、API改修は行わない。

## 参照docs

- `docs/icebreak/icebreak-organizer-supabase-persistence-plan.md`
- `docs/icebreak/icebreak-organizer-supabase-schema-sql-plan.md`
- `docs/icebreak/icebreak-organizer-supabase-schema-review.md`
- `docs/icebreak/icebreak-organizer-supabase-final-decisions.md`
- `docs/icebreak/icebreak-organizer-supabase-final-sql.md`

## 実行対象SQL

実行候補は、以下docs内のfinal SQLとする。

- `docs/icebreak/icebreak-organizer-supabase-final-sql.md`

対象テーブル:

- `icebreak_events`
- `icebreak_event_participants`
- `icebreak_event_seatings`
- `icebreak_event_aggregate_stats`

## 実行しないもの

今回のSQL実行判断では、以下は行わない。

- API改修
- server-only API移行
- `/host` 改修
- `/organizer` 改修
- cron
- 自動削除
- Supabase function
- Vercel環境変数追加
- `.env.local` 変更
- 既存検証フォームの変更

## 既存Supabaseテーブルへの影響確認

実行前に、既存の検証フォーム保存と分離されていることを確認する。

- 既存 `icebreak_centered_validation_feedback` とは別テーブルである
- 既存検証フォームAPI `/api/icebreak/centered-validation` は変更しない
- 既存検証フォーム保存に影響しない
- 既存 `/api/feedback` / GAS に影響しない
- organizerイベント運営データと検証フォームデータを混ぜない

## 実行前バックアップ方針

今回作成する4テーブルは新規想定のため、既存データのバックアップ対象は基本なし。

ただし、実行前に以下を確認する。

- 同名テーブルが既に存在しないか
- 同名テーブルが存在する場合は実行を止める
- Supabase SQL Editorで実行前に既存テーブル一覧を確認する
- 既存 `icebreak_centered_validation_feedback` は触らない
- 既存テーブルや既存データに対する変更SQLが含まれていないことを確認する

## 実行前確認チェックリスト

- [ ] `docs/icebreak/icebreak-organizer-supabase-final-sql.md` を確認した
- [ ] 実行対象が4テーブルのみである
- [ ] `create table if not exists` である
- [ ] RLS有効化文が含まれる
- [ ] public policy作成文が含まれていない
- [ ] trigger案は含まれているが、実行するかどうかを分けて確認した
- [ ] comment文が含まれる
- [ ] destructiveな `drop table` が含まれていない
- [ ] `delete from` が含まれていない
- [ ] 既存テーブル変更が含まれていない
- [ ] 秘密キーやSupabase URLがSQLに含まれていない
- [ ] `host_key_hash` は平文hostKeyではなくhash値を保存する方針になっている
- [ ] `answers` は一時保存データであり、イベント終了後3日で削除対象になっている
- [ ] `participants` / `seatings` は匿名統計作成後に削除対象になっている
- [ ] `aggregate_stats` は匿名統計の長期保存用になっている

## 実行順序案

SQLを実行する場合の推奨順序:

1. `create table` 4本
2. index作成
3. RLS enable
4. comment
5. `updated_at` trigger

補足:

- `updated_at` triggerを今回の手動実行に含めるかは、実行直前の最終確認事項として残す
- policy作成は今回のSQL実行には含めない
- public insert policyは作らない
- 操作は将来のserver-only API + service role経由にする

## 実行後確認項目

Supabase Table EditorまたはSQLで以下を確認する。

- [ ] `icebreak_events` が作成されている
- [ ] `icebreak_event_participants` が作成されている
- [ ] `icebreak_event_seatings` が作成されている
- [ ] `icebreak_event_aggregate_stats` が作成されている
- [ ] 各テーブルのカラムが想定どおり
- [ ] indexが作成されている
- [ ] RLSが有効になっている
- [ ] public policyが存在しない
- [ ] 既存 `icebreak_centered_validation_feedback` が残っている
- [ ] 既存検証フォーム送信が引き続き成功する
- [ ] `/api/icebreak/centered-validation` の保存挙動に影響がない
- [ ] `/api/feedback` / GAS に影響がない

## 実行ログdocs案

SQLを実行する場合は、実行後に以下のログdocsを作成する。

- `docs/icebreak/icebreak-organizer-supabase-sql-execution-log.md`

ログに残す内容:

- 実行日時
- 実行環境
- 実行したSQL範囲
- 作成されたテーブル
- RLS有効化確認
- policyなし確認
- 既存検証フォーム影響なし確認
- エラー有無
- 次の作業

ログに残さないもの:

- 秘密キー
- 実際のSupabase URL
- `.env.local` の中身
- service role key

## 失敗時対応

SQL実行中にエラーが出た場合は、以下の順で対応する。

1. その場で追加SQLを流さず停止する
2. エラー文を記録する
3. どのSQLで止まったか記録する
4. 既に作成されたテーブルがある場合は、削除するか残すかを判断してから対応する
5. 勝手にdropしない
6. ChatGPTにエラー全文を共有して方針確認する

注意:

- エラー対応で `drop table` を即実行しない
- エラー対応でpolicyやRLSを場当たり的に追加しない
- 既存検証フォーム用テーブルには触らない

## SQL実行後すぐにはやらないこと

- API改修
- `/organizer` 接続
- `/host` 接続
- 本番イベント運用
- 自動削除
- cron
- RLS policy追加
- service role API実装
- 既存検証フォームAPI変更
- 既存 `/api/feedback` / GAS 変更

## 今回まだやらないこと

- SQL実行
- Supabaseテーブル作成
- RLS適用
- policy作成
- trigger実行
- cron実装
- 自動削除実装
- API改修
- `.env.local`変更
- Vercel環境変数変更
- 既存 `/host` 改修
- 既存 `/organizer` 改修
- 診断本体変更
- 結果ページ変更
- 検証フォーム変更
- `/api/feedback` 変更
- GAS変更
- payload変更
- URL形式変更
- 診断ロジック変更
- 設問変更
- 重み変更
- centeredResult変更
- scripts変更

## 次の推奨ステップ

1. このチェックリストをレビューする
2. Supabase SQL Editorで手動実行するか最終判断する
3. 実行する場合は、実行ログdocsを準備する
4. SQLを実行する
5. 実行ログdocsを作成する
6. 既存検証フォームの動作確認を行う
7. その後、server-only API移行docsへ進む

## 結論

Icebreak 33 organizer のSupabase final SQLは、実行対象と影響範囲を切り分けたうえで手動実行判断に進める。

ただし、今回の作業ではSQL実行、Supabaseテーブル作成、RLS適用、trigger実行、API改修は行わない。まずは実行前チェックリストとして、対象SQL、確認項目、失敗時対応、実行ログ方針を確定する。
