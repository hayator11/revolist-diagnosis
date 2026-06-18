# Icebreak 33 host / organizer 比較メモ

## 目的

Icebreak 33 のオフ会運営者向け機能について、既存 `/host` を正式版として磨くべきか、別に `/organizer` を新設して試作するべきかを整理する。

今回のドキュメントは調査・設計メモであり、実装変更は行わない。

## 調査したファイル

- `src/app/research/icebreak-11-v1/host/page.tsx`
- `src/app/research/icebreak-11-v1/host/IcebreakHostClient.tsx`
- `src/app/api/icebreak/event/route.ts`
- `src/app/api/icebreak/event/[hostKey]/route.ts`
- `src/app/api/icebreak/public/[eventCode]/route.ts`
- `src/app/api/icebreak/join/route.ts`
- `src/app/api/icebreak/seating/route.ts`
- `src/app/api/icebreak/reset/route.ts`
- `src/lib/icebreakEventStore.ts`
- `src/lib/icebreakSeating.ts`
- `docs/icebreak/icebreak-meetup-organizer-tool-plan.md`

## 既存 `/host` の機能一覧

既存 `/research/icebreak-11-v1/host` には、すでに主催者向けの最小機能がある。

- イベント作成
- イベント名入力
- 開催日入力
- 1卓人数入力
- 参加URL発行
- 主催者URL発行
- 参加コード表示
- 主催者URLの `hostKey` 管理
- 参加者一覧表示
- force分布表示
- 席順生成
- 座席マップ表示
- テーブル名表示
- 「5つの力がそろいました」表示
- 参加者ごとの席順理由表示
- 5秒ごとの自動更新
- reset / イベントを閉じる機能

関連API:

- `POST /api/icebreak/event`
- `GET /api/icebreak/event/[hostKey]`
- `GET /api/icebreak/public/[eventCode]`
- `POST /api/icebreak/join`
- `POST /api/icebreak/seating`
- `POST /api/icebreak/reset`

関連ロジック:

- `createIcebreakEvent`
- `addIcebreakParticipant`
- `generateIcebreakEventSeating`
- `generateIcebreakSeating`
- `createIcebreakTableName`
- `hasCompleteForceSet`

## 既存 `/host` の強み

### すでに動く土台がある

イベント作成、参加URL発行、参加者登録、席順生成、座席マップ表示まで一通り存在する。  
ゼロから作るより、当日運用に近い流れをすぐ検証できる。

### イベントコード方式がある

参加者は `/research/icebreak-11-v1?event=XXXXXX` から診断に入れる。  
診断完了時に `POST /api/icebreak/join` でイベント参加者として登録される。

### 参加者が診断から直接参加できる

主催者が個別に結果URLを集めなくても、参加者がイベントURLから診断すれば一覧に入る。  
当日その場で診断して席順を作る用途に向いている。

### seating API がある

`POST /api/icebreak/seating` があり、既存 `generateIcebreakSeating` を使って席順を生成できる。  
すでに `centerForce` の偏りを避ける分散ロジックがある。

### 当日運用に近い

参加URLを共有し、参加者が回答し、主催者画面で更新し、席順を生成する流れがすでにある。  
イベント現場の動線に近い。

## 既存 `/host` の弱み

### URL名が外部向けに少し分かりにくい

`/host` は開発者・内部管理者には分かりやすいが、外部のオフ会運営者に案内する言葉としては少し抽象的。  
`/organizer` の方が「運営者向け」と伝わりやすい。

### 診断結果URLの手動登録に未対応

既存 `/host` は、イベントコード付き診断から参加者が入る設計。  
すでに診断済みの参加者の結果URLを主催者が貼って登録する導線はない。

このため、事前診断済み参加者を扱う場合は以下が不足している。

- 結果URL入力欄
- encoded id抽出
- `decodeIcebreakAnswers`
- `calculateIcebreakResult`
- 復元結果の参加者追加

### 保存がメモリストア前提

`src/lib/icebreakEventStore.ts` は `globalThis` 上の `Map` を使った一時ストア。  
プロセス再起動、サーバーレス環境、複数インスタンス、本番運用では永続性に課題がある。

### 本番運用時の永続性に課題がある

既存ストアはイベント作成から席順生成までの実験にはよいが、以下には向かない。

- 複数イベントの継続管理
- 後日参照
- 管理者履歴
- イベントごとの保存
- Supabaseでの集計
- 本番障害時の復旧

### マッチング理由表示がまだ薄い

既存の理由は、隣の人のforceとの組み合わせを中心にしている。

例:

- 「隣は〇〇さん。〇〇力と〇〇力が近くにあることで、会話が次の一歩へ流れやすくなります。」

これは良い土台だが、運営者が納得して説明するには、以下がさらに欲しい。

- テーブル全体の理由
- `mainTypeKey` / `partnerTypeKey` を使った理由
- `revolist` / `crazist` など起点役の配置意図
- 同タイプを分散した理由
- 受け止め役・橋渡し役・整理役のバランス

### オフ会運営者向けの説明やUIが足りない

既存画面は動くが、正式な運営者ツールとしては説明が薄い。

- このツールが何をするものか
- 参加者に何を渡せばいいか
- 何人集まったら席順生成すべきか
- 席順の見方
- 生成理由の読み方
- 当日運用の注意

これらは正式版では画面上に必要。

## `/organizer` を新設するメリット

### 正式な運営者向けURLとして分かりやすい

`/research/icebreak-11-v1/organizer` は、外部の主催者にも意味が伝わりやすい。  
将来、案内文や資料に載せるURLとして自然。

### 結果URL入力型の試作を作りやすい

既存 `/host` はイベントコード方式。  
`/organizer` は、診断済みの結果URLを貼って席順を作るフロント完結の試作にしやすい。

### 既存 `/host` を壊さず検証できる

既存の当日運用型 `/host` に手を入れず、別ページで試せる。  
外部検証中の安定性を保ちやすい。

### 将来的に `/host` と統合しやすい

`/organizer` で使い勝手を確認した後、良い部分だけ `/host` に統合できる。

- 結果URL入力
- テーブル理由表示
- 参加者一覧の見せ方
- 役割ベースの配置理由
- 印刷用表示

## `/organizer` を新設するデメリット

### 既存 `/host` と機能が重複する

イベント名、参加者一覧、席順生成など、既存 `/host` と重なる。  
責任範囲を決めないと、二重管理になる。

### 管理対象URLが増える

`/host` と `/organizer` の2つがあると、主催者にどちらを案内するか迷う。  
将来どちらかに統合する前提が必要。

### 将来統合が必要になる

試作としては安全だが、良ければ正式版に寄せる作業が必要。  
放置すると似た機能が並ぶ。

### 席順ロジックが重複しないよう注意が必要

`generateIcebreakSeating` は既存資産として再利用するべき。  
`/organizer` 用に別ロジックを作る場合も、共通化の方針を持つ必要がある。

## 比較表

| 観点 | 既存 `/host` を育てる | `/organizer` を新設する |
| --- | --- | --- |
| URLの分かりやすさ | 内部向けには分かるが、外部主催者には少し弱い | 運営者向けと伝わりやすい |
| 既存資産活用 | 最大限活かせる | seatingロジック等は流用できるが画面は新規 |
| 実装コスト | 既存改修なので小さめ | ページ新設分のコストがある |
| 当日運用向き | 強い。イベントコード方式がある | 結果URL入力型なら当日より事前準備向き |
| 事前診断済み参加者の登録向き | 現状は弱い | 強い。結果URL入力型にできる |
| 将来のSupabase保存向き | 既存イベントAPIをSupabase化しやすい | 試作後にDB設計へ進めやすい |
| 外部公開しやすさ | UI説明を足せば可能 | URL名と用途が自然で案内しやすい |
| 既存機能への影響リスク | 改修時に既存当日運用へ影響しやすい | 既存 `/host` を壊さず検証できる |
| 席順ロジックの再利用 | そのまま使える | `icebreakSeating.ts` をimportして使えば再利用可能 |
| 将来統合のしやすさ | 統合不要だが責任が増える | 良い要素だけ `/host` に戻せる |

## 推奨方針

現時点では、まず `/organizer` をフロント完結の結果URL入力型プロトタイプとして作るのがよい。

理由:

- 既存 `/host` は当日運用型としてすでに動く土台がある
- 今ほしい検証は「診断結果URLを集めて席順を作れるか」に近い
- `/host` を壊さず、新しい使い方を小さく検証できる
- 席順ロジックや型は既存 `icebreakSeating.ts` を再利用できる
- 試作後、良ければ `/host` と統合できる

短期:

- `/organizer` で結果URL入力型を検証
- 保存なし
- 既存APIに接続しない
- 既存 `/host` はそのまま残す

中期:

- `/organizer` でよかったUI・理由表示を `/host` に統合
- `icebreakSeating.ts` にrole/partnerTypeを使った理由生成を追加検討
- Supabase保存が必要になった段階でDB設計を行う

長期:

- 正式名称を `/organizer` に寄せるか、既存 `/host` を内部URLとして残すか決める
- 外部主催者向けには分かりやすいURLだけを案内する

## 次に実装する場合の最小方針

今回は実装しない。次に実装するなら、以下が最小。

- `/research/icebreak-11-v1/organizer` ページ追加
- フロント完結
- 診断結果URL入力
- encoded id抽出
- `decodeIcebreakAnswers`
- `calculateIcebreakResult`
- `mainTypeKey`, `partnerTypeKey`, `centerForce` 表示
- `icebreakSeating.ts` の型・関数を再利用できるか確認
- force分散で席順生成
- テーブルごとの理由表示
- 保存なし
- 既存 `/host` / API は触らない

初回UIで必要なもの:

- イベント名
- 開催日メモ
- テーブル数
- 1卓人数
- 参加者名
- 結果URL
- 参加者一覧
- 席順を作るボタン
- テーブル別席順
- テーブル理由

初回ではやらないもの:

- Supabase保存
- ログイン
- イベントURL発行
- 参加者本人登録
- 既存 `/host` 統合
- API追加
- 本番DB設計

## まだ変更しないもの

- 既存 `/host`
- 既存API
- `src/lib/icebreakEventStore.ts`
- `src/lib/icebreakSeating.ts`
- 診断本体
- 結果ページ
- シェア文言
- 検証フォーム
- Supabase保存処理
- `/api/feedback`
- GAS
- payload
- URL形式
- 診断ロジック
- 設問
- 重み
- centeredResult

## 結論

既存 `/host` は、当日運用に近い席順生成ツールとしてすでに価値がある。  
ただし、外部向け正式URL・事前診断済み参加者の結果URL登録・運営者向け説明UIには不足がある。

そのため、まず `/organizer` をフロント完結の結果URL入力型プロトタイプとして作り、既存 `/host` を壊さず検証する。  
その後、使いやすかった要素を `/host` に統合するか、`/organizer` を正式URLとして育てるかを判断する。
