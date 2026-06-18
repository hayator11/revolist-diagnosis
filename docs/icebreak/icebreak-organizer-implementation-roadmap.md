# Icebreak 33 organizer implementation roadmap

## 目的

Icebreak 33 の正式オフ会運営者フローを、今後実装しやすい小さなチケットに分解する。

正式方針は、結果URL手入力型だけではなく、運営者がイベントを作成し、参加者用URLを配布し、参加者が名前またはニックネームを入れて診断し、その結果をもとに席順を作る流れへ寄せること。

今回のドキュメントは実装ロードマップであり、実装変更は行わない。

## 参照したdocs

- `docs/icebreak/icebreak-meetup-organizer-tool-plan.md`
- `docs/icebreak/icebreak-host-organizer-comparison.md`
- `docs/icebreak/icebreak-organizer-event-data-lifecycle-plan.md`

## 実装ロードマップ全体像

正式運営者フローは、一度に作り切らず、以下のPhaseに分ける。

| Phase | 目的 | 実装の大きさ | 保存 |
| --- | --- | --- | --- |
| Phase 1 | `/organizer` を正式イベント作成UIに寄せる | 小 | なし |
| Phase 2 | 参加URL発行と参加者診断導線を整理する | 小〜中 | 既存メモリストア候補 |
| Phase 3 | ニックネーム入力とイベント紐づけを明確にする | 中 | 既存メモリストア候補 |
| Phase 4 | 11タイプベースの席順理由を強化する | 中 | 既存メモリストア候補 |
| Phase 5 | 保存期間・削除方針をUIに明示する | 小 | 仕様明示中心 |
| Phase 6 | Supabase永続化と自動削除を検討する | 大 | 将来DB |

現時点では、次に着手するなら Phase 1 だけに切るのがよい。

## Phase 1: `/organizer` を正式イベント作成UIに寄せる

### 目的

既存 `/research/icebreak-11-v1/organizer` を、結果URL手入力型プロトタイプから、正式運営者向けイベント作成画面の見た目・導線に寄せる。

このPhaseでは、保存やAPI接続は増やさない。  
運営者が「ここからイベントを作るんだ」と理解できる画面構成へ整える。

### 最小実装内容

- ページ見出しを正式運営者向けに整理する
  - 例: `Icebreak 33 オフ会運営ツール`
  - 例: `参加者の診断結果から、会話が始まりやすい席順を作ります`
- 画面冒頭に、このページの用途を短く説明する
- 入力項目を正式イベント作成UIに寄せる
  - オフ会タイトル
  - 開催日時
  - 予定席数
  - 1卓人数
- 参加URL発行エリアの見た目を用意する
  - 初期は未発行状態でもよい
  - 実際の参加URL発行は Phase 2 に回してよい
- 既存の結果URL手入力プロトタイプ部分は、必要なら「診断済み参加者を手動で追加」として下部に残す
- 保存なし
- Supabase接続なし
- 既存 `/host` やAPIは触らない

### このPhaseで見たいこと

- 外部運営者にとって、用途が伝わるか
- イベント作成に必要な入力項目が自然か
- 既存の結果URL入力型プロトタイプが、正式導線と衝突しないか
- 保存なしでも、次Phaseの画面骨格として使えるか

### このPhaseで触らないもの

- 既存 `/host`
- 既存API
- `src/lib/icebreakEventStore.ts`
- `src/lib/icebreakSeating.ts`
- Supabase
- 診断ロジック
- 結果ページ

## Phase 2: 参加URL発行と参加者診断導線を整理する

### 目的

参加者に配るURLの考え方を整理し、正式フローをイベントURL配布型へ寄せる。

基本URLは既存 `/host` のイベントコード方式を活かし、以下を候補にする。

```text
/research/icebreak-11-v1?event={eventCode}
```

### 最小実装内容

- 既存 `/host` の `eventCode` 方式を再利用できるか確認する
- `/organizer` から参加URLを発行する導線を設計する
- 参加URLをコピーできるUIを検討する
- 参加者URLにイベント名が紐づいて見える流れを確認する
- 既存 `POST /api/icebreak/event` をそのまま使えるか調査する
- 既存API改修はまだ最小に留める

### 判断ポイント

- `/organizer` から既存 `POST /api/icebreak/event` を呼ぶだけで足りるか
- 予定席数やテーブル数など、既存イベント作成APIにない項目をいつ追加するか
- Phase 2 では「参加URL発行」だけに留め、詳細な保存期間はPhase 5に回すか

### このPhaseでまだやらないこと

- Supabaseテーブル作成
- 本番DB接続
- 参加者データの永続化
- 既存APIの大改修
- cronや自動削除

## Phase 3: ニックネーム入力とイベント紐づけを明確にする

### 目的

参加者が名前またはニックネームを入力して診断に入り、診断結果がイベントに紐づく流れを明確にする。

既存の `POST /api/icebreak/join` は、`eventCode`, `nickname`, `answers` を受け取り、`calculateIcebreakResult` で結果を計算してイベントに紐づける土台がある。  
このPhaseでは、その参加者体験と説明を整える。

### 最小実装内容

- 参加者URLでイベント名を表示する
- 本名不要の説明を入れる
- ニックネーム入力を分かりやすくする
- 席順マッチングに使われることを明示する
- イベント終了後3日でイベント紐づきデータが削除されることを説明する
- 診断後、イベントに結果が登録される流れを確認する
- 参加者が結果ページも見られる状態を維持する

### 参加者向け説明に入れること

- 本名ではなくニックネームでよい
- 診断結果は、当日の席順や会話のきっかけづくりに使われる
- 個人の優劣を決めるものではない
- イベント終了後3日を過ぎたら、参加者名・席順・個別紐づきデータは削除される
- 匿名統計だけが診断改善のために残る

### このPhaseで気をつけること

- 回答者が「評価される」と感じすぎない文言にする
- 本名入力を必須にしない
- 診断本体の回答体験を重くしすぎない
- 既存URL形式を壊さない

## Phase 4: 11タイプベースの席順理由を強化する

### 目的

席順生成を「並べるだけ」ではなく、運営者が納得できる理由つきにする。  
既存の `centerForce` 分散に加えて、11タイプの役割特性を使って説明する。

### 使う情報

- `mainTypeKey`
- `partnerTypeKey`
- `centerForce`
- 11役割コピー
- role特性
- テーブル人数
- force分布
- 11タイプ分布

### 最小実装内容

- テーブル全体の理由を表示する
- 参加者ごとの配置理由を表示する
- 同じ11タイプが固まりすぎていないことを説明する
- 同じforceが固まりすぎていないことを説明する
- `partnerTypeKey` を参考にした理由を追加できるか確認する
- 起点役と受け止め役が近い配置を理由として出す
- 発想型と整理型が会話しやすい配置を理由として出す
- `arranger` / `communicator` の橋渡し役をテーブル理由に反映する

### 理由文の例

- 起点を作る人と、話を受け止める人が近くなるようにしました
- 発想を広げる力と、形に整える力が同じテーブルに入っています
- 同じforceが固まりすぎないように分散しました
- このテーブルは、初対面でも会話の入口が生まれやすい構成です
- 橋渡し役が入ることで、話が一人に偏りにくい構成です

### このPhaseでまだやらないこと

- `centeredResult` を使った高度な席順判定
- AIによる自由文生成
- ドラッグアンドドロップの手動席替え
- 複雑な最適化アルゴリズム
- 診断ロジックや重みの変更

## Phase 5: 保存期間・削除方針をUIに明示する

### 目的

参加者と運営者が、データの扱いを理解したうえで使えるようにする。

正式方針として、以下を画面上にも明示する。

- オフ会開始1週間前から登録可能
- イベント終了後3日まで保持
- その後、参加者名・席順・個別紐づきデータは削除
- 匿名統計だけ残す
- 本名不要

### 最小実装内容

- `/organizer` のイベント作成画面にデータ保持の説明を入れる
- 参加者URL側にも、本名不要と保存期間を説明する
- 席順生成画面に「イベント終了後3日まで確認可能」と表示する
- resetやイベント終了の導線がある場合、何が削除されるかを説明する

### 表示文の方向性

```text
参加者名・診断結果とイベント席順の紐づきは、イベント終了後3日まで運営確認のために保存されます。
その後、参加者名・席順・個別回答との紐づきは削除し、匿名化した集計だけを診断改善のために残します。
本名ではなく、ニックネームで参加できます。
```

### このPhaseでまだやらないこと

- 自動削除の実装
- cronの実装
- Supabase永続化
- RLS設計
- 管理者ログイン

## Phase 6: Supabase永続化と自動削除を検討する

### 目的

正式運用に必要な永続化、自動削除、匿名統計化を設計・実装する。  
ただし、現時点ではまだ実装しない。

### 将来テーブル候補

- `icebreak_events`
  - イベント本体
  - `event_code`, `host_key_hash`, `title`, `event_start_at`, `event_end_at`, `data_delete_at`, `expected_seats`, `table_count`, `seats_per_table`, `status`
- `icebreak_event_participants`
  - イベント参加者の一時データ
  - `event_id`, `display_name`, `answers`, `main_type_key`, `partner_type_key`, `center_force`, `result_summary`, `joined_at`, `deleted_at`
- `icebreak_event_seatings`
  - 席順生成結果の一時データ
  - `event_id`, `generated_at`, `algorithm_version`, `tables`, `table_reasons`, `deleted_at`
- `icebreak_event_aggregate_stats`
  - 匿名統計
  - `event_hash`, `event_month`, `participant_count`, `main_type_distribution`, `partner_type_distribution`, `center_force_distribution`, `answer_summary`, `table_force_patterns`, `table_role_patterns`

### 将来処理候補

- cronで期限切れイベントを確認する
- `data_delete_at < now()` のイベントを対象にする
- 削除前に匿名統計へ集計する
- 参加者名、席順、個別回答データを削除する
- `icebreak_event_aggregate_stats` だけ残す
- 手動resetで早期削除できるようにする
- reset時も匿名統計を作成してから一時データを削除する

### このPhaseの前に決めること

- Supabaseに保存する個別回答の粒度
- 参加者名の保存期間
- `hostKey` を平文保存しない方法
- aggregateに残す統計粒度
- RLS方針
- server-only insert / update 方針
- cron実行場所
- 削除失敗時の再試行

## 今すぐ実装しないもの

- Supabaseテーブル作成
- RLS設計
- cron
- 自動削除
- ログイン
- 決済
- QR受付
- CSV出力
- LINE連携
- 本番DB接続
- 既存APIの大改修
- 診断ロジック変更
- 設問変更
- 重み変更
- `centeredResult` を使った高度な席順判定
- 既存 `/host` の削除
- 既存 `/organizer` の保存接続
- `/api/feedback` 変更
- GAS連携変更
- payload変更
- URL形式変更

## 次に着手する推奨

次は Phase 1 だけを実装するのがよい。

理由:

- 変更範囲が `/organizer` の画面整理に閉じる
- 保存なしで進められる
- 既存APIに触らずに済む
- 既存 `/host` を壊さない
- 本番DBやSupabaseをまだ触らずに、正式運営者向けの見え方を検証できる
- 結果URL手入力型プロトタイプから、イベント作成UIへの方向転換をユーザー体験として確認できる

Phase 1 の実装チケット案:

```text
/research/icebreak-11-v1/organizer の見出し・説明・入力項目を、正式イベント作成UIに寄せる。
保存なし、既存API接続なし、参加URL発行は見た目だけ、または次Phaseに回す。
既存 /host、診断本体、結果ページ、検証フォーム、Supabase、APIは変更しない。
```

## 今回変更しないもの

- 既存 `/host`
- 既存 `/organizer`
- 既存API
- 新しいAPI
- Supabaseテーブル
- RLS
- cron
- 自動削除
- 診断本体
- 結果ページ
- 検証フォーム
- `/api/feedback`
- GAS連携
- payload
- URL形式
- 診断ロジック
- 設問
- 重み
- `centeredResult`
- `.env.local`

## 結論

正式運営者フローは、結果URL手入力型からイベントURL配布型へ段階的に寄せる。  
ただし、いきなりSupabase永続化や自動削除へ進まず、まずは `/organizer` の見た目と導線を正式イベント作成UIに寄せる。

現時点の推奨は、Phase 1 を最小実装として切り出すこと。  
その後、参加URL発行、参加者ニックネーム入力、11タイプ席順理由、保存期間表示、Supabase永続化の順に進める。
