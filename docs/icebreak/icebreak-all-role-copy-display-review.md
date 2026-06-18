# Icebreak 33 全役割結果コピー表示レビュー

## 目的

このドキュメントは、Icebreak 33の結果画面に11役割すべてで表示されるようになった役割結果コピーカードについて、表示崩れ・文量・納得感・既存表示との衝突を確認し、外部検証へ進む前の判断材料を残すものです。

今回はレビューdocsの作成のみです。実装変更、UI変更、コピー文言変更、`IcebreakResultClient.tsx`、`src/data/icebreakRoleResultCopy.ts`、結果表示、シェア文言、URL、payload、判定ロジック、`/api/feedback`、GAS、Supabase、設問データ、scripts は変更しません。

## 前提

- 11役割すべてへの表示コミット: `fcac9fa show role result copy for all icebreak roles`
- arranger試験表示レビュー: `ca4411f document arranger copy preview review`
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
- 表示タイプ決定には引き続き `legacyResult.mainTypeKey` を使う
- `centeredResult` は結果表示タイプの決定に使わない

## 確認方法

ローカル開発環境で、各役割が `mainTypeKey` になる回答URLを生成し、スマホ幅390pxで結果ページを確認した。

確認した役割:

- `revolist`
- `crazist`
- `arranger`
- `communicator`
- `logicalmaister`
- `imagemaister`
- `inforader`
- `premiercrafter`
- `soulowner`
- `movmentor`
- `maxdesigner`

ブラウザ確認で見た共通項目:

- 追加カードが表示されるか
- `details.lead` の直後、Center Force の前に表示されるか
- `workingCopy`, `catchCopy`, `selfCheckItems` 3つだけが表示されるか
- `essence`, `cautionHabit`, `meetupUse`, `goodPartners`, `shareCopy`, `mismatchNote` がカード内に出ていないか
- 横はみ出しがないか
- 冒頭で役割名より先に「働き」が伝わるか
- 既存の Center Force / Movement / Partner と意味が衝突しないか

## ブラウザ確認結果の要約

390px幅で確認した結果、11役割すべてで以下を確認できた。

- 追加カードは表示される
- 追加カードは Center Force より前に表示される
- 表示項目は `workingCopy`, `catchCopy`, `selfCheckItems` 3つのみ
- 非表示対象の長文項目はカード内に出ていない
- 横はみ出しはない
- カード幅はスマホ表示内に収まっている
- カード高さはおおむね自然な範囲

文量としては、`arranger`, `inforader`, `maxdesigner` がやや長めに見える可能性がある。ただし、いずれも1カード内に収まり、結果冒頭として重すぎるほどではない。

## 役割別レビュー

| roleKey | 表示確認 | 文量 | 働きの伝わり方 | 自分ごと感 | 気になる点 | 修正候補 |
|---|---|---|---|---|---|---|
| `revolist` | OK | OK | OK | OK | 「火を灯す」が詩的なので、行動の具体感は selfCheckItems で補っている | 現時点では修正不要 |
| `crazist` | OK | OK | OK | OK | 役割名の印象は強いが、カード内では「違和感」「可能性」として扱えている | 現時点では修正不要 |
| `arranger` | OK | 少し長い | OK | OK | 3項目目がやや長いが、配置する働きは伝わる | 外部検証で重く感じる声があれば短縮 |
| `communicator` | OK | OK | OK | OK | 話し上手ではなく「会話の入口」として見える | 現時点では修正不要 |
| `logicalmaister` | OK | OK | OK | OK | 「構造」という語が固く感じる人はいるかもしれない | 外部検証で硬さが出れば言い換え検討 |
| `imagemaister` | OK | OK | OK | OK | selfCheckItems の3項目目が少し長いが、表現設計の広がりは伝わる | 現時点では修正不要 |
| `inforader` | OK | 少し長い | OK | OK | `catchCopy` が少し長めで、スマホでは読み応えが出る | 必要なら catchCopy を少し短くする余地あり |
| `premiercrafter` | OK | OK | OK | OK | 品質・継続の働きは伝わる。重さはない | 現時点では修正不要 |
| `soulowner` | OK | OK | OK | OK | 「安心の土台」が強く出るため、優しい人だけに見えないかは実回答で確認したい | 外部検証で受け止め方を確認 |
| `movmentor` | OK | OK | OK | OK | 応援係ではなく「一歩へ変える人」として見える | 現時点では修正不要 |
| `maxdesigner` | OK | 少し長い | OK | OK | 「可能性」「設計」の語が続くため、やや抽象度が高く見える可能性がある | 外部検証で抽象的に感じる声があれば短縮・具体化 |

## 役割別メモ

### revolist

「まだ動いていない未来に最初の火を灯す人」という働きコピーで、単なる行動力ではなく、未来の起点を作る役割として見える。selfCheckItems が「整う前でも小さく試す」「先に動く」「未来を言葉にして渡す」と具体化しているため、名前だけのこじつけには見えにくい。

文量は自然。Center Force / Movement / Partner とも衝突していない。

### crazist

「違和感の中から新しい可能性を見つける人」として出るため、変人扱いには寄っていない。常識の外を扱うが、社会に必要な可能性として見える。

文量は自然。役割名の印象が強いため、外部検証では「クレイジスト」という名称への反応は別途見たい。

### arranger

試験表示時と同じく、「人・情報・役割を配置して流れを生む人」として表示される。単なる調整役ではなく、流れを設計する役割として見える。

文量は少し長め。とはいえ、3項目で「ズレに気づく」「組み合わせる」「配置する」が見えるため、納得の入口としては機能している。

### communicator

「会話の入口を作る人」として表示されるため、話し上手というより、ご縁や場の入口を作る働きとして読める。

文量は軽く、結果冒頭に置いても重くない。Center Force の `connect` と近い場合も、補強として自然に読める。

### logicalmaister

「感覚や発想を理解される構造へ変える人」として、理屈っぽさではなく、理解される形へ変換する働きが出ている。

文量は自然。ただし「構造」「理由」「順番」という語が並ぶため、外部検証で硬さが出るかは見たい。

### imagemaister

「想いや空気を伝わる形にする人」として、見た目担当ではなく、世界観や魅力を受け取れる形にする働きとして見える。

selfCheckItems はやや情報量があるが、表現設計の幅を出せている。文量は許容範囲。

### inforader

「情報を判断材料と知恵に変える人」として、情報収集係ではなく、判断に使える知恵へ変える役割として見える。

`catchCopy` と selfCheckItems の情報量が少し多いため、スマホではやや読み応えがある。とはいえ横はみ出しはなく、最初の検証には十分耐える。

### premiercrafter

「価値を信頼される品質へ育てる人」として、職人気質だけでなく、価値を信頼に変える働きとして見える。

文量は自然。Center Force が care に寄る場合でも、品質・継続の観点として補完関係に見える。

### soulowner

「本音と挑戦が続く安心の土台を作る人」として、優しい人だけでなく、心理的な土台を作る役割として見える。

文量は自然。ただし、全体思想に近い言葉なので、実回答で `care / soulowner` が出た人に強く響きすぎないかは確認したい。

### movmentor

「人の挑戦を具体的な一歩へ変える人」として、応援係ではなく、伴走して行動に変える働きとして見える。

文量は自然。selfCheckItems も実際の場面が浮かびやすく、オフ会や会話導線につながりやすい。

### maxdesigner

「選択肢を広げて未来の可能性を設計する人」として、企画屋ではなく、可能性を設計する役割として見える。

文量は少し長めで、抽象語もやや多い。とはいえ、selfCheckItems が「案」「素材」「体験や流れ」に落としているため、外部検証前に必ず直すほどではない。

## 全体で自然に見える点

- 役割名より先に働きが伝わる
- 「あなたはこのタイプです」と強く決めつけすぎていない
- 既存の `details.title` / `details.lead` を置き換えず、補助カードとして自然に入っている
- Center Force の前に置くことで、Force説明に入る前に「今回の自分の働き」が見える
- `selfCheckItems` 3つが、納得の入口としてちょうどよい
- 長文項目を出していないため、説明だらけになっていない
- シェア文言は変更していないが、画面上で言葉を持ち帰りやすい

## 気になる点

大きな表示崩れはない。

小さな注意点:

- `arranger`, `inforader`, `maxdesigner` はカード高さが少し出る
- `maxdesigner` は抽象語が続くため、人によっては少し遠く感じる可能性がある
- `soulowner` は思想に近い言葉が強いため、実回答で出すぎた時の納得感を見る必要がある
- `crazist` はカード文面では変人扱いしていないが、役割名そのものへの反応は確認したい
- `logicalmaister` は「構造」という語の硬さを感じる人がいるかもしれない

## 既存表示との衝突

現時点では、既存の Center Force / Movement / Partner と大きな衝突は見られない。

役割コピーカードの役割:

- 今回の回答で見えている「働き」を短く伝える

既存セクションの役割:

- Center Force: 背景にある中心の力
- Movement: 今日の動き方
- Partner: つながると動き出す相手
- Connection Cards: 場で起きやすい組み合わせ
- Conversation Openers: 会話の入口

この分担は維持できている。

## 全体判断

判断は **A: このまま外部検証に進んでよい**。

理由:

- 11役割すべてでカードが表示される
- スマホ幅390pxで横はみ出しがない
- 表示位置が自然
- 表示項目が絞られている
- 役割名だけのこじつけには見えにくい
- 既存表示を置き換えていないため、リスクが小さい
- 説明が長くなりすぎていない

ただし、外部検証では次を重点的に見る。

- `soulowner` が強く出た人の納得感
- `maxdesigner` が抽象的に感じられないか
- `inforader` が情報収集係だけに見えないか
- `crazist` の名称への反応
- `logicalmaister` の言葉が硬すぎないか
- 既存の `details.lead` と役割コピーが矛盾して見えないか

## 修正候補

現時点では、実装やコピー変更はしない。

外部検証後に検討する候補:

1. `maxdesigner` の `workingCopy` または selfCheckItems を少し具体化する
2. `inforader` の `catchCopy` を短くする
3. 低確信時だけ「今回の回答では、この働きが見えています」を添える
4. 自己認識とのズレが大きい人向けに、下部または折りたたみで `mismatchNote` を出す
5. シェア文言へ `shareCopy` を使うかどうかを別途検討する

## まだやらないこと

- コピー文言の修正
- カード構成の変更
- 表示位置の変更
- `essence` の表示
- `cautionHabit` の表示
- `meetupUse` の表示
- `goodPartners` の表示
- `shareCopy` のシェア文言反映
- `mismatchNote` の表示
- 既存結果表示の置き換え
- centeredResult による表示タイプ決定
- `/api/feedback` payload 変更
- GAS連携変更
- Supabase連携変更
- URL形式変更
- 設問データ変更
- scripts変更

## 次に進む場合

次は、実回答または身近なテスターで以下を確認する。

- 結果冒頭のカードを読んで「自分の働き」として受け取れるか
- `selfCheckItems` のうち、どれか1つでも当てはまる感覚があるか
- 結果が自己認識と違う場合でも受け止めやすいか
- オフ会や自己紹介の入口として使えそうか
- シェアしたくなる一文として残るか

この段階では、まだ大きなUI改修や文言修正には入らず、実際の反応を見てから小さく調整する。
