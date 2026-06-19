# Icebreak 33 organizer Phase 2 production check

## 目的

Icebreak 33 organizer Phase 2 として追加した参加URL発行機能について、本番公開URLで確認できたことと、メモリストア制約によりイベント参照が失敗したことを記録する。

このドキュメントは本番確認ログであり、実装変更は行わない。

## 確認したコミット

- `44a1321 add organizer event url generation`

## 確認した公開URL

- `https://revo.onokun.com/research/icebreak-11-v1/organizer`
- `https://revo.onokun.com/research/icebreak-11-v1`
- `https://revo.onokun.com/research/icebreak-11-v1/validation`
- `https://revo.onokun.com/research/icebreak-11-v1/host`

## 本番で確認できたこと

- `/organizer` が表示される
- 「参加URLを発行する」ボタンが表示される
- `eventCode` が表示される
- 参加者用URLが表示される
- 参加者用URLが `/research/icebreak-11-v1?event={eventCode}` 形式である
- 主催者確認URLが表示される
- 主催者確認URLが `/research/icebreak-11-v1/host?key={hostKey}` 形式である
- 参加者用URLをコピーできる
- 主催者確認URLをコピーできる
- スマホ幅390pxで横はみ出しがない
- 既存診断ページ、validation、host は表示できる

## 本番で確認された問題

発行された参加者用URLを開くと、診断ページ自体は表示される。

参加者URLで確認できたこと:

- `/research/icebreak-11-v1?event={eventCode}` が開ける
- Icebreak 33 の診断ページが表示される
- ニックネーム入力欄が表示される
- ニックネーム未入力では診断開始できない状態になる

ただし、同じ画面に以下の趣旨のメッセージが表示された。

```text
イベントが見つかりませんでした。主催者に参加用URLを確認してください。
```

主催者確認URL `/research/icebreak-11-v1/host?key={hostKey}` でも、host画面自体は表示されるが、以下の趣旨のメッセージが表示された。

```text
イベントが見つかりませんでした。主催者URLを確認してください。
```

つまり、Phase 2で追加したURL発行UIとAPI呼び出しは動いているが、本番環境では発行直後のイベントを参加者画面・主催者画面から参照できない場合がある。

## 原因候補

現在のイベント保存は `src/lib/icebreakEventStore.ts` の `globalThis` 上のメモリストアである。

保持している主な情報:

- event
- eventCode index
- hostKey index
- participants

本番環境で参照失敗が起きる原因候補:

- Vercel本番のサーバーレス環境では、POSTでイベントを作成した実行環境と、GETでイベントを読む実行環境が異なる可能性がある
- 複数インスタンス間で `globalThis` 上のメモリが共有されない
- デプロイやプロセス再起動でメモリが消える
- メモリストアはプロセス内の一時状態なので、イベントURL配布型の本番運用には向かない

このため、本番ではイベント作成直後でも、別リクエストから同じイベントを読めないケースが起きる。

## 判断

- Phase 2のUI実装は通っている
- 参加URL発行UIと既存 `POST /api/icebreak/event` の呼び出しは機能している
- `eventCode`、参加者用URL、主催者確認URL、コピー導線は本番でも確認できた
- ただし、現在のメモリストア方式は本番イベント運用には不十分
- 本番でイベントURL配布型を成立させるには、Supabaseなどの永続ストアが必要
- これ以上メモリストアを調整して本番運用しようとしない

Phase 2は「UIと流れの試作」としては完了扱いにする。  
本番の外部イベント運用へ進める場合は、永続化設計を先に扱う。

## 次の推奨方針

- organizer Phase 2 は「UIと流れの試作」として完了扱いにする
- 本番で参加URL配布型を成立させるには、Supabase永続化フェーズを前倒しで検討する
- まずはDB設計docsとschema案を作る
- その後、server-only APIでイベント作成・取得・参加者登録・席順保存をSupabaseに移す
- RLS、service role、削除期限、自動削除、匿名統計化は段階的に扱う
- いきなり全実装しない

## 次に作るべきdocs候補

- `docs/icebreak/icebreak-organizer-supabase-persistence-plan.md`

このdocsでは、以下を整理する。

- `icebreak_events`
- `icebreak_event_participants`
- `icebreak_event_seatings`
- `icebreak_event_aggregate_stats`
- eventCode / hostKey の扱い
- server-only APIの責任範囲
- 参加者名・席順・個別紐づきデータの保存期限
- イベント終了後3日で削除する流れ
- 匿名統計として長期保存する項目
- 既存 centered validation feedback とは分けること

## 次に実装する場合の注意

- 既存 `/host` と `/organizer` を壊さない
- 既存診断本体を壊さない
- 既存 `/api/feedback` や検証フォームのSupabase保存とは分ける
- `SUPABASE_SERVICE_ROLE_KEY` はserver-onlyで扱う
- 秘密キーをクライアントに出さない
- `.env.local` はコミットしない
- 参加者名や席順はイベント終了後3日までの一時データとして扱う
- 匿名統計だけ長期保存する

## 今回変更しないもの

- 既存 `/host`
- 既存 `/organizer`
- 既存API
- Supabase接続
- RLS
- cron
- 自動削除
- 診断本体
- 結果ページ
- 検証フォーム
- `/api/feedback`
- GAS
- payload
- URL形式
- 診断ロジック
- 設問
- 重み
- centeredResult
- `.env.local`

## 結論

Phase 2で追加した参加URL発行UIは、本番公開URLでも表示・発行・コピーまで確認できた。

一方で、イベント参照はメモリストア制約により本番では成立しない場合がある。  
参加URL配布型の正式運用に進むには、メモリストアの延命ではなく、Supabaseなどの永続ストアへ移す設計が必要である。
