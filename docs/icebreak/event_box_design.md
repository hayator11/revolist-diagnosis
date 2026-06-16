# Icebreak 11 オフ会用データ箱 v1

## 目的

Icebreak 11 をオフ会で使うために、イベント作成、参加者登録、回答、席順、終了後の匿名集計を同じ形で扱う。

この段階では Supabase 接続はまだ行わず、先に保存する項目を固定する。

## テーブル

| テーブル | 役割 |
|---|---|
| `icebreak_events` | オフ会ごとのイベント情報。参加コードと主催者キーを持つ |
| `icebreak_participants` | 参加者の登録情報、回答、診断結果、席番号 |
| `icebreak_seating_runs` | 席順を生成した履歴。後から見直せるように残す |
| `icebreak_anonymous_summaries` | イベント終了後に残す匿名集計 |

## オフ会当日の流れ

1. 主催者が `/research/icebreak-11-v1/host` でイベントを作る
2. 参加URLを共有する
3. 参加者がニックネームを入れて診断する
4. 回答と結果が `icebreak_participants` に保存される
5. 主催者が席順を生成する
6. テーブル番号と席番号が参加者に保存される
7. イベント終了時に匿名集計を作る
8. 個人が特定される運営用データは削除または期限切れで扱う

## 登録項目

現時点の必須項目は `nickname` と `data_use_consent`。

将来、必要に応じて以下を使えるようにしている。

- `contact`: 連絡先。任意
- `registration_memo`: 参加枠、紹介者、受付メモなど。任意

## Supabase 実装時の環境変数

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` はサーバー側だけで使う。ブラウザには出さない。

## 実装の切り替え方

現在は `src/lib/icebreakEventStore.ts` が一時保存の箱。

Supabase実装時は、同じ関数名のまま保存先だけを差し替える。

- `createIcebreakEvent`
- `getIcebreakEventByCode`
- `getIcebreakEventByHostKey`
- `getIcebreakParticipants`
- `addIcebreakParticipant`
- `generateIcebreakEventSeating`
- `getIcebreakEventSnapshot`
- `resetIcebreakEvent`

## 関連ファイル

- `src/lib/icebreakEventSchema.ts`
- `docs/icebreak/supabase_schema.sql`
