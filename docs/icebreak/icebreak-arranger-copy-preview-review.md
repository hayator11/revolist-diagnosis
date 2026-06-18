# Icebreak 33 arranger 結果コピー試験表示レビュー

## 目的

このドキュメントは、`arranger` だけに試験表示した役割結果コピーカードの表示体験を確認し、11役割全体へ広げる前の判断材料を残すものです。

今回は確認メモの作成のみです。実装変更、UI変更、11役割全体への展開、`IcebreakResultClient.tsx`、`src/data/icebreakRoleResultCopy.ts`、結果表示ロジック、シェア文言、URL、payload、判定ロジック、`/api/feedback`、GAS、Supabase、設問データ、scripts は変更しません。

## 前提

- 試験表示コミット: `e438ca5 show arranger result copy preview`
- 対象: `result.mainTypeKey === "arranger"` の場合のみ
- 表示位置: `details.lead` の直後、Center Force の前
- 表示項目:
  - `workingCopy`
  - `catchCopy`
  - `selfCheckItems` 3つ
- 非表示項目:
  - `essence`
  - `cautionHabit`
  - `meetupUse`
  - `goodPartners`
  - `shareCopy`
  - `mismatchNote`
- 他タイプでは表示しない

## 確認方法

ローカル開発サーバーで `arranger` になる回答URLを開き、表示されるHTMLと表示順を確認した。

確認したURL形式:

```text
/research/icebreak-11-v1/result?id=1-1-1-1-1-1-1-5-1-1-1-1-1-1-1-1-1-1-5-1-1-1-1-1-1-1-1-1-1-5-1-1-1__preview
```

比較用に、`revolist` になる回答URLも確認した。

## 表示内容の確認結果

`arranger` 結果では、以下のカードが `details.lead` の直後に表示されている。

```text
あなたは、人・情報・役割を配置して流れを生む人。

バラバラな持ち寄りを、動ける流れへ整える人。

こんなところありませんか？
- 人・予定・役割のズレに気づくと、流れを整えたくなる
- 誰が何を持っているかを見ながら、組み合わせを考える
- 全体の進み方を見て、必要な人や情報を配置したくなる
```

`revolist` 結果では、上記の `arranger` コピーカードは表示されていない。

表示していないことを確認した項目:

- `essence`
- `cautionHabit`
- `meetupUse`
- `goodPartners`
- `shareCopy`
- `mismatchNote`

## 観点別レビュー

### 冒頭で何のタイプかわかるか

現在のカードは、役割名そのものより先に「人・情報・役割を配置して流れを生む人」と働きを伝えている。

`arranger` という名前だけでは「調整役」「段取り係」に見えやすいが、この表示では最初に「配置して流れを生む」という働きが出るため、役割の入口としてはわかりやすい。

### 役割名より先に働きが伝わるか

伝わる。

`workingCopy` が先頭に出ることで、「アレンジャーです」ではなく「こういう働きが出ています」という体験になる。

これは `docs/icebreak/icebreak-roles-result-copy-plan.md` の「役割名より先にどんな働きをする人かを伝える」方針に合っている。

### 説明だらけに感じないか

現時点では、説明過多には感じにくい構成。

理由:

- 1カードに収まっている
- 見出し、短いキャッチ、3つの箇条書きだけで終わる
- `essence` や `cautionHabit` を出していない
- Center Force / Movement / Partner の既存セクションへすぐ流れる

ただし、全11役割へ広げる場合も同じ分量に固定することが前提。

### selfCheckItems 3つは多すぎないか

3つは妥当。

1つだと納得の入口が弱く、5つ以上だと診断結果の冒頭として重くなる。3つなら「当てはまるものを探す」体験になりやすい。

今後も `selfCheckItems` は3つ固定がよい。

### Center Force 前に置いて自然か

自然。

現在の結果画面では、`details.title` と `details.lead` のあとに Center Force が来る。そこへ役割コピーカードを挟むことで、Force の説明に入る前に「今回の自分の働き」が見える。

表示順としては以下が自然。

1. 今日はこういう入口です
2. あなたの働きはこう見えています
3. その背景にある力はこれです

この順番の方が、いきなり Force 名を読むより受け取りやすい。

### details.lead と意味が重複しすぎないか

強い重複はない。

`details.lead` は「今日の回答は複数の力が近い」「つなぐ力を入口にする」といった、判定状態と Force の入口を説明している。

一方、`arranger` コピーカードは「人・情報・役割を配置して流れを生む」という役割の働きを説明している。

役割とForceで近い意味はあるが、体験上は補完関係に見える。

### Center Force / Movement / Partner と衝突しないか

衝突は大きくない。

- Center Force: `つなぐ力`
- Movement: 動き方のスタイル
- Partner: 今回つながると動き出す相手
- arrangerカード: 自分が場に出しやすい働き

それぞれ役割が分かれている。

ただし、`arranger` は `connect / structure` の両方にまたがるため、Center Force が `つなぐ力` と出る場合は近く見える。これは重複というより、「なぜそのForceなのか」の補強として読める。

### 「アレンジャー＝単なる調整役」ではなく見えるか

見える。

特に以下の表現が効いている。

- 人・情報・役割を配置して流れを生む
- バラバラな持ち寄りを、動ける流れへ整える
- 誰が何を持っているかを見ながら、組み合わせを考える

「雑務をする人」ではなく、「場が動けるように配置する人」として見える。

### シェアしたくなる要素があるか

少しある。

`workingCopy` と `catchCopy` は短く、自己紹介に使いやすい。ただし、現在のシェア文言は変更していないため、カード内容がSNS文面へ直接反映されるわけではない。

現時点では、画面上で「この言葉いいな」と思える入口として十分。シェア文言へ反映するかは別ターンで検討する。

### 自己認識と違う人でも受け止めやすいか

比較的受け止めやすい。

「あなたはアレンジャーです」と強く断定せず、カード内では「こういう働きが出ています」に近い表現になっている。

ただし、自己認識とのズレが大きい人には、将来的に `mismatchNote` を下部または折りたたみで出す余地がある。

初回展開では、`mismatchNote` を常時表示しなくてよい。

## 気になった点

大きな問題はない。

小さな注意点:

- `details.lead` が「まだ役割をひとつに絞らない入口です」の場合でも、`arranger` カードが出るため、受け手によっては「絞らないと言いつつアレンジャーなの？」と少し感じる可能性がある
- ただし、カードが「アレンジャー型です」と言い切っていないため、現時点では許容範囲
- 全11役割へ広げた時、各役割の `workingCopy` の長さに差があると、冒頭の読みやすさに差が出る可能性がある

## 修正案

今回の実装やコピーは変更しない。

将来の調整候補:

1. 低確信時だけ、カード上部に「今回の回答では、この働きが見えています」を添える
2. 全11役割へ広げる前に、各 `workingCopy` の長さを揃える
3. 自己認識とのズレが強そうな役割だけ、下部に `mismatchNote` を折りたたみ表示する
4. シェア文言へ `shareCopy` を使うかは、表示接続後の別検討にする

## 11役割全体へ広げる判断

判断は **A: このまま11役割すべてに広げてよい**。

ただし、条件付き。

- 表示項目は引き続き `workingCopy`, `catchCopy`, `selfCheckItems` のみにする
- 既存表示は置き換えず、追加表示にする
- 表示位置は `details.lead` の直後、Center Force の前を維持する
- `centeredResult` は表示タイプ決定に使わない
- シェア文言、payload、URL、判定ロジックは変更しない
- `mismatchNote` や `meetupUse` はまだ常時表示しない

この条件なら、まず11役割全体へ広げても大きなリスクは低い。

## 次に実装する場合の最小方針

次の最小実装は以下。

1. `IcebreakResultClient.tsx` の `arranger` 限定条件を外す
2. `result.mainTypeKey` から `getIcebreakRoleResultCopy(result.mainTypeKey)` を取得する
3. `roleCopy` がある場合だけ、同じカードを表示する
4. 表示項目は引き続き以下のみ
   - `workingCopy`
   - `catchCopy`
   - `selfCheckItems`
5. 以下は変更しない
   - シェア文言
   - `/api/feedback` payload
   - URL形式
   - 判定ロジック
   - `legacyResult`
   - `centeredResult`
   - GAS
   - Supabase
   - 設問データ
   - scripts

## まだやらないこと

- 11役割全体への実装展開
- コピー文言の修正
- `shareCopy` のシェア文言反映
- `essence` の表示
- `cautionHabit` の表示
- `meetupUse` の表示
- `goodPartners` の表示
- `mismatchNote` の表示
- 結果表示の置き換え
- `/api/feedback` payload 変更
- centeredResult による表示タイプ決定

