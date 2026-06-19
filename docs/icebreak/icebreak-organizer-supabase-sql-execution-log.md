# Icebreak 33 organizer Supabase SQL execution log

## 目的

Icebreak 33 organizer 用Supabase final SQLを実行した場合に、実行内容、確認結果、エラー有無、次の作業を記録するためのログ。

このdocsは実行ログの雛形であり、今回はSQLを実行しない。Supabaseテーブル作成、RLS適用、policy作成、trigger実行、cron、自動削除、API改修は行わない。

## 参照docs

- `docs/icebreak/icebreak-organizer-supabase-final-sql.md`
- `docs/icebreak/icebreak-organizer-supabase-sql-execution-checklist.md`

## 実行前状態

| 項目 | 記入欄 |
| --- | --- |
| 実行日時 | 未記入 |
| 実行者 | 未記入 |
| 実行環境 | 未記入 |
| 対象Supabaseプロジェクト名 | 未記入。必要に応じて伏せ字可 |
| 既存テーブル確認結果 | 未記入 |
| 同名テーブル有無 | 未記入 |
| 実行前チェックリスト確認済みか | 未記入 |
| 参照したfinal SQL docs | `docs/icebreak/icebreak-organizer-supabase-final-sql.md` |

注意:

- 実際のSupabase URLは書かない
- 秘密キーは書かない
- `.env.local` の内容は書かない
- service role keyは書かない

## 実行対象SQL

| 項目 | 実行有無 / メモ |
| --- | --- |
| 実行したSQL範囲 | 未記入 |
| `create table` 4本 | 未記入 |
| index作成 | 未記入 |
| RLS enable | 未記入 |
| comment | 未記入 |
| `updated_at` triggerを実行したか | 未記入 |

対象テーブル:

- `icebreak_events`
- `icebreak_event_participants`
- `icebreak_event_seatings`
- `icebreak_event_aggregate_stats`

## 作成確認

- [ ] `icebreak_events`
- [ ] `icebreak_event_participants`
- [ ] `icebreak_event_seatings`
- [ ] `icebreak_event_aggregate_stats`

## index確認

- [ ] `icebreak_events(event_code)` index
- [ ] `icebreak_events(host_key_hash)` index
- [ ] `icebreak_events(status)` / `icebreak_events(data_delete_at)` index
- [ ] `icebreak_events(status, data_delete_at)` index
- [ ] `icebreak_event_participants(event_id)` index
- [ ] `icebreak_event_participants(event_id, deleted_at)` index
- [ ] `icebreak_event_participants(main_type_key)` index
- [ ] `icebreak_event_participants(center_force)` index
- [ ] `icebreak_event_seatings(event_id)` index
- [ ] `icebreak_event_seatings(event_id, generated_at desc)` index
- [ ] `icebreak_event_seatings(deleted_at)` index
- [ ] `icebreak_event_aggregate_stats(event_month)` index
- [ ] `icebreak_event_aggregate_stats(event_hash)` index

## RLS確認

- [ ] 4テーブルでRLS有効
- [ ] public insert policyなし
- [ ] policyなし確認
- [ ] service role前提であることを確認

メモ:

- 操作はserver-only API + service role経由にする
- クライアントからSupabaseへ直接insertしない
- public insert policyは作らない

## 既存テーブル影響確認

- [ ] `icebreak_centered_validation_feedback` が残っている
- [ ] `/api/icebreak/centered-validation` への影響なし
- [ ] 検証フォーム送信が成功する
- [ ] `/api/feedback` / GAS への影響なし

メモ:

- organizerイベント運営データと既存検証フォームデータは別系統として扱う
- 既存検証フォームのSupabase保存とは混ぜない

## エラー記録欄

| 項目 | 記入欄 |
| --- | --- |
| エラー有無 | 未記入 |
| エラー発生箇所 | 未記入 |
| エラー文 | 未記入 |
| その場で追加SQLを流したか | 未記入 |
| 追加SQLを流していないこと | 未記入 |
| dropしていないこと | 未記入 |

エラー時の注意:

- エラーが出た場合は、その場で追加SQLを流さず停止する
- どのSQLで止まったか記録する
- 既に作成されたテーブルがある場合は、削除するか残すかを判断してから対応する
- 勝手にdropしない
- エラー全文を共有して方針確認する

## 実行後判断

| 項目 | 記入欄 |
| --- | --- |
| 成功 / 要確認 / 中断 | 未記入 |
| 次の作業 | 未記入 |
| server-only API移行へ進めるか | 未記入 |
| 追加レビューが必要か | 未記入 |

## 今回まだやらないこと

- API改修
- `/host` 接続
- `/organizer` 接続
- cron
- 自動削除
- RLS policy追加
- Supabase function
- Vercel環境変数変更
- `.env.local`変更
- 既存検証フォーム変更
- `/api/feedback` 変更
- GAS変更
- payload変更
- URL形式変更
- 診断ロジック変更
- 設問変更
- 重み変更
- centeredResult変更
- scripts変更

## 注意

- 秘密キーや実際のSupabase URLは書かない
- `.env.local` の内容を書かない
- service role keyを書かない
- エラーが出た場合は勝手にdropしない
- 実行後ログにも秘密情報を残さない

## 次の作業メモ

- 未記入
