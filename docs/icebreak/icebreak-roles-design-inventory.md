# Icebreak 33 11役割設計棚卸し

## 目的

このメモは、Icebreak 33診断の結果コピーを改善する前に、11役割の既存設計をコードと資料から棚卸しするためのものです。

今回はコピー文の作成ではなく、事実整理を目的にします。役割名の印象だけで説明を作らず、既存マスター、5つの力、15軸、設問、結果表示で使われている言葉を根拠にします。

## 調査したファイル

- `src/data/revo111Roles.ts`
- `src/data/revotypes.ts`
- `src/data/revo111Navigation.ts`
- `src/data/icebreakQuestions.ts`
- `src/data/monitorResults.ts`
- `src/lib/diagnosisCore/forces.ts`
- `src/lib/diagnosisCore/movementStyles.ts`
- `src/lib/diagnosisCore/multiAxis.ts`
- `src/lib/diagnosisCore/icebreakCenteredWeights.ts`
- `src/lib/calculateIcebreakResult.ts`
- `src/lib/calculateMultiAxisRoleResult.ts`
- `docs/icebreak/revolist11_role_map.md`
- `docs/icebreak/revolist11_pentagon_chemistry.md`
- `docs/icebreak/revolist11_chemistry_triads.md`
- `docs/icebreak/wealth_dynamics_reference_mapping.md`
- `docs/revo111/core/Revo11_Role_Dictionary_Part1.md`
- `docs/revo111/core/Revo11_Role_Dictionary_Part2.md`
- `docs/revo111/core/Revo11_Role_Dictionary_Part3.md`
- `data/roles/Revo11_Role_Master.ts`

## 既存マスターの所在

| 種別 | 所在 | 内容 |
|---|---|---|
| 現行11役割マスター | `src/data/revo111Roles.ts` | `catchCopy`, `mission`, `naturalActions`, `gives`, `receives`, `comfortableEnvironment`, `fundingRole`, `linkRole`, `songRole`, `futurePartners`, `quest` |
| 旧表示マスター | `src/data/revotypes.ts` | `catchcopy`, `description`, `strengths`, `potential`, `givesDetail`, `receivesDetail`, `goodWith`, `environment`, `creates`, `howToCheer`, `growthQuest`, `teamDesign`, `color` |
| 公開向けナビ文言 | `src/data/revo111Navigation.ts` | `publicLabel`, `publicSummary`, `workExamples`, `partnerLabels`, `growthMeanings`, `todayMission` |
| Icebreak設問マスター | `src/data/icebreakQuestions.ts` | 33問。各役割3問ずつ、`role`, `force`, `axis weights` を持つ |
| 役割辞書docs | `docs/revo111/core/Revo11_Role_Dictionary_Part*.md` | 現行マスターに近い文章と、力が出にくい環境 |
| 空のマスター候補 | `data/roles/Revo11_Role_Master.ts` | ファイルは存在するが0行。現時点では使用できる定義なし |

`shortDescription`, `drainingEnvironment`, `growthPotential`, `awakens`, `awakenedBy`, `thirdPersonEffect`, `symbol` は、同名のフィールドとしては確認できませんでした。近い情報は以下で代替できます。

- `shortDescription`: `revo111Navigation.publicSummary` または Role Dictionary の「ひとことで」
- `drainingEnvironment`: Role Dictionary の「力が出にくい環境」
- `growthPotential`: `revotypes.potential`, `revo111Roles.quest`, `growthRoutes`
- `awakens` / `awakenedBy`: `futurePartners`, `matchRules`, `monitorResults.matchResultText`
- `thirdPersonEffect`: `thirdPersonEffects`
- `symbol`: 明示フィールドなし

### 旧マスター上の色定義

`src/data/revotypes.ts` には、11役割すべての `color` が定義されています。

| roleKey | color |
|---|---|
| `revolist` | `#dc2626` |
| `crazist` | `#be185d` |
| `maxdesigner` | `#7c3aed` |
| `imagemaister` | `#db2777` |
| `communicator` | `#0891b2` |
| `arranger` | `#4f46e5` |
| `inforader` | `#059669` |
| `logicalmaister` | `#1d4ed8` |
| `movmentor` | `#d97706` |
| `premiercrafter` | `#92400e` |
| `soulowner` | `#7c3aed` |

## 共通設計

### 5つの力

| force | 表示 | 意味 | 関連しやすい役割 |
|---|---|---|---|
| `ignite` | はじめる力 | まだ形になっていないものに最初の一歩を置く | revolist / crazist |
| `design` | 描く力 | 可能性や世界観を伝わる形へ組み立てる | maxdesigner / imagemaister |
| `connect` | つなぐ力 | 人・想い・場の間に流れを生み出す | communicator / arranger |
| `structure` | 整える力 | 情報や役割を整理し、前に進める土台を作る | inforader / logicalmaister / arranger |
| `care` | 支える力 | 安心感や完成度を守り、人やものごとを育てる | movmentor / premiercrafter / soulowner |

### 4つの動き方

| 動き方 | 意味 |
|---|---|
| 創発型 | まだないものを生み、未来や可能性から動き出す |
| 共鳴型 | 人の熱量や関係性から動き、人を巻き込みながら広げる |
| 現場型 | 状況やタイミングを見ながら、安心して続けられる形を作る |
| 構造型 | 情報や仕組みを整理し、再現できる形へ整える |

### 判定の考え方

Icebreak 33では、役割タグだけで結果を決めません。回答から15軸を計算し、`ROLE_AXIS_PROFILES` の required / supportive / caution と照合して役割候補を出します。全体が平坦なときは `low_confidence` になり、`legacyResult` は表示用の既存結果として維持されています。

中心0モデルでは、全33問に `1 -> -2`, `3 -> 0`, `5 -> +2` の変換が効きます。ただし `ICEBREAK_CENTERED_WEIGHT_OVERRIDES` は全問対象ではなく、24問だけに設定されています。これは結果表示ではなく、内部比較・監査用の情報です。

## role / force / axis / question 関係表

| roleKey | 表示名 | 主force | required axis | supportive / caution | 強く関係する設問ID |
|---|---|---|---|---|---|
| `revolist` | レボリスト | ignite | `noveltyDrive`, `uncertaintyTolerance`, `executionDrive`, `publicVisibility` | supportive: `socialBridge`, `encouragement`; caution: `maintenanceDrive`, `evidenceSeeking` | `ice33_q03`, `ice33_q14`, `ice33_q25` |
| `crazist` | クレイジスト | ignite | `nonconformity`, `noveltyDrive`, `uncertaintyTolerance` | supportive: `possibilityDesign`, `expressionDrive`; caution: `maintenanceDrive`, `coordination` | `ice33_q10`, `ice33_q21`, `ice33_q32` |
| `maxdesigner` | マックスデザイナー | design | `possibilityDesign`, `noveltyDrive`, `uncertaintyTolerance` | supportive: `expressionDrive`, `systemizing` | `ice33_q05`, `ice33_q16`, `ice33_q27` |
| `imagemaister` | イメージマイスター | design | `expressionDrive`, `possibilityDesign`, `publicVisibility` | supportive: `craftQuality`, `psychologicalSafety` | `ice33_q11`, `ice33_q22`, `ice33_q33` |
| `communicator` | コミュニケーター | connect | `socialBridge`, `psychologicalSafety`, `coordination`, `publicVisibility` | supportive: `encouragement`, `expressionDrive` | `ice33_q01`, `ice33_q12`, `ice33_q23` |
| `arranger` | アレンジャー | connect / structure | `coordination`, `socialBridge`, `maintenanceDrive` | supportive: `systemizing`, `psychologicalSafety` | `ice33_q08`, `ice33_q19`, `ice33_q30` |
| `inforader` | インフォレイダー | structure | `evidenceSeeking`, `systemizing`, `maintenanceDrive` | supportive: `psychologicalSafety` | `ice33_q02`, `ice33_q13`, `ice33_q24` |
| `logicalmaister` | ロジカルマイスター | structure | `systemizing`, `evidenceSeeking`, `expressionDrive` | supportive: `coordination`, `psychologicalSafety`; caution: `maintenanceDrive`, `craftQuality` | `ice33_q06`, `ice33_q17`, `ice33_q28` |
| `movmentor` | ムーブメンター | care | `encouragement`, `socialBridge`, `executionDrive` | supportive: `psychologicalSafety` | `ice33_q07`, `ice33_q18`, `ice33_q29` |
| `premiercrafter` | プルミエルクラフター | care | `craftQuality`, `maintenanceDrive`, `evidenceSeeking` | supportive: `expressionDrive` | `ice33_q09`, `ice33_q20`, `ice33_q31` |
| `soulowner` | ソウルオーナー | care | `psychologicalSafety`, `encouragement`, `maintenanceDrive` | supportive: `socialBridge` | `ice33_q04`, `ice33_q15`, `ice33_q26` |

## 11役割の既存定義と本質

### revolist

- 表示名: レボリスト
- 既存の短い定義: 未来に火を灯す人 / 未来をつくる人
- 使命: まだ誰も動いていない場所で、最初の一歩を生み出す
- 自然な行動: 未来を語る、挑戦を始める、人を巻き込む、旗を立てる
- 強み: 突破力、行動力、影響力、挑戦力
- 渡しているもの: 希望、熱量、勇気、挑戦のきっかけ
- 受け取ると潤うもの: 信頼、応援、共感、自由に挑戦できる環境
- 心地よい環境: 挑戦を歓迎し、未来の可能性を一緒に見てくれる場
- 力が出にくい環境: 前例だけを重視する場、細かく管理されすぎる場、挑戦よりリスクだけを見られる場
- Funding / Link / Song: 起案者・旗振り役 / 挑戦の起点を作る人 / 想いや世界観を発信する人
- 関連force / axis: ignite。`executionDrive`, `uncertaintyTolerance`, `noveltyDrive`, `publicVisibility`
- 関連設問: `ice33_q03`, `ice33_q14`, `ice33_q25`
- 高く出る回答傾向: 整う前に小さく試す、必要なら自分から始める、先に動いて空気を変える
- 低く出る回答傾向: 始動より確認・継続・安全な土台を優先する
- 本質語: 始動、旗、未来、挑戦の火、最初の一歩
- 誤解しやすい点: 単なる行動力ではない。未来の可能性を言葉にし、人が動ける起点を作る役割。

### crazist

- 表示名: クレイジスト
- 既存の短い定義: 常識を揺らす人 / 新しい可能性を見つける人
- 使命: 違和感から新しい未来を生み出す
- 自然な行動: 疑問を持つ、常識を疑う、新しい視点を出す、枠を超える
- 強み: 圧倒的独創性、突破発想、次元の違う挑戦力、革命性
- 渡しているもの: 発見、革新、違和感、創造性
- 受け取ると潤うもの: 自由、理解者、挑戦機会
- 心地よい環境: 新しいことを歓迎する場所
- 力が出にくい環境: 前例主義、同調圧力
- Funding / Link / Song: 変革担当 / 異分野接続・未来創造 / 新ジャンル創造
- 関連force / axis: ignite。`nonconformity`, `noveltyDrive`, `uncertaintyTolerance`
- 関連設問: `ice33_q10`, `ice33_q21`, `ice33_q32`
- 高く出る回答傾向: 別の前提で考える、常識の外でも社会に必要なら試す、人と違う見方を確かめる
- 低く出る回答傾向: 前提を揺らすより、既存の流れや整合性を優先する
- 本質語: 違和感、非同調、実験、突破口、常識の外
- 誤解しやすい点: 変わった人扱いしない。社会に必要な可能性を常識の外から拾い、未来の種にする役割。

### maxdesigner

- 表示名: マックスデザイナー
- 既存の短い定義: 可能性を設計する人 / 可能性を広げる人
- 使命: まだ形になっていない未来の選択肢を広げる
- 自然な行動: アイデアを広げる、複数案を考える、企画を組み立てる、新しい見せ方を考える
- 強み: 発想力、企画力、演出力、未来想像力
- 渡しているもの: 可能性、選択肢、企画の種、新しい視点
- 受け取ると潤うもの: 自由、刺激、発見、実現を支えてくれる仲間
- 心地よい環境: 自由に発想でき、新しいアイデアを面白がってくれる場
- 力が出にくい環境: 現状維持が強い場、可能性をすぐ否定される場、前例だけで判断される場
- Funding / Link / Song: 企画設計 / 新しい価値を生み出す人 / コンセプトメーカー
- 関連force / axis: design。`possibilityDesign`, `noveltyDrive`, `uncertaintyTolerance`
- 関連設問: `ice33_q05`, `ice33_q16`, `ice33_q27`
- 高く出る回答傾向: 別の見せ方や展開を思い浮かべる、素材を組み合わせて企画化する、体験や流れを設計し直す
- 低く出る回答傾向: 可能性を広げるより、維持・確認・品質を優先する
- 本質語: 可能性、選択肢、企画化、体験設計、展開
- 誤解しやすい点: 企画屋だけではない。まだ見えていない選択肢を増やし、未来の地図を広げる役割。

### imagemaister

- 表示名: イメージマイスター
- 既存の短い定義: 未来を見える形にする人 / 魅力を見える形にする人
- 使命: 感性や世界観を通して、見えない想いを人に伝わる形へ変える
- 自然な行動: 世界観を作る、雰囲気を整える、表現する、魅力を見える形にする
- 強み: デザイン感覚、感性、演出力、魅せる力
- 渡しているもの: 憧れ、感動、物語、美しさ、世界観
- 受け取ると潤うもの: 共感、反応、表現を認められる場、安心して創作できる環境
- 心地よい環境: 感性や世界観や表現を大切にしてくれる場
- 力が出にくい環境: 効率だけを求められる場、感性を軽く扱われる場、表現を制限されすぎる場
- Funding / Link / Song: ブランド担当 / 魅力を伝える人 / 世界観制作
- 関連force / axis: design。`expressionDrive`, `possibilityDesign`, `publicVisibility`
- 関連設問: `ice33_q11`, `ice33_q22`, `ice33_q33`
- 高く出る回答傾向: 言葉・雰囲気・見た目を整える、たとえ話や表現を工夫する、人に話すことでアイデアが広がる
- 低く出る回答傾向: 表現より事実・構造・配置を優先する
- 本質語: 世界観、表現設計、魅力の可視化、雰囲気、物語
- 誤解しやすい点: 見た目だけではない。言葉になりにくい想いや空気を、人が受け取れる形へ変える役割。

### communicator

- 表示名: コミュニケーター
- 既存の短い定義: 人と人の間に橋をかける人 / 人をつなぐ人
- 使命: ご縁を循環させ、人と人の可能性を結びつける
- 自然な行動: 人を紹介する、会話を生む、場をやわらげる、人の魅力を伝える
- 強み: 対話力、調和力、安心感、巻き込み力
- 渡しているもの: ご縁、会話のきっかけ、笑顔、つながり
- 受け取ると潤うもの: 交流、感謝、仲間、あたたかい関係性
- 心地よい環境: 人が集まり、紹介や会話が歓迎される場
- 力が出にくい環境: 閉鎖的な場、孤立しやすい場、人をつなぐことが軽く扱われる場
- Funding / Link / Song: 広報担当 / 接続役・紹介役 / ファン形成
- 関連force / axis: connect。`socialBridge`, `psychologicalSafety`, `coordination`, `publicVisibility`
- 関連設問: `ice33_q01`, `ice33_q12`, `ice33_q23`
- 高く出る回答傾向: 話しやすくなる一言を探す、人同士をつなぐ、会話の入口を作る
- 低く出る回答傾向: 会話の入口より、情報確認・表現設計・配置設計を優先する
- 本質語: ご縁、会話の入口、橋渡し、関係の循環、場の温度
- 誤解しやすい点: 話し上手だけではない。人の可能性同士が出会う入口を作る、かなり高度な場づくりの役割。

### arranger

- 表示名: アレンジャー
- 既存の短い定義: 人・情報・役割をつなぐ人 / 流れを整える人
- 使命: バラバラなものをつなぎ、流れを生み出す
- 自然な行動: 調整する、段取りを組む、人をつなぐ、全体を見る
- 強み: 管理力、調整力、サポート力、全体最適
- 渡しているもの: 安心感、流れ、調和、継続性
- 受け取ると潤うもの: 信頼、感謝、仲間意識、協力
- 心地よい環境: チームで動く場、役割分担がある場
- 力が出にくい環境: 全部を一人で抱える場、混乱が続く場
- Funding / Link / Song: 運営担当 / 接続管理・コミュニティ設計 / 制作進行
- 関連force / axis: connect / structure。`coordination`, `socialBridge`, `maintenanceDrive`
- 関連設問: `ice33_q08`, `ice33_q19`, `ice33_q30`
- 高く出る回答傾向: 人・予定・役割のズレを整える、全体を見て人や情報を配置する、持ち寄りを組み合わせる
- 低く出る回答傾向: 配置や組み合わせより、自分の突破力や表現を優先する
- 本質語: 配置、段取り、流れ、全体最適、持ち寄りの運用
- 誤解しやすい点: 単なる調整役ではない。人・情報・役割を組み合わせて、場が続く流れを作る役割。

### inforader

- 表示名: インフォレイダー
- 既存の短い定義: 情報を価値に変える人 / 判断材料を集める人
- 使命: 散らばった情報を集め、判断できる知恵へ変換する
- 自然な行動: 調べる、比較する、情報収集する、根拠を探す
- 強み: 情報整理、観察力、リサーチ力、時流把握
- 渡しているもの: 知識、判断材料、安心感、客観性
- 受け取ると潤うもの: 信頼できる情報源、学び、新しい知識、深い対話
- 心地よい環境: 学びが歓迎される場
- 力が出にくい環境: 感情だけで決まる場
- Funding / Link / Song: 調査担当 / 知識共有 / 背景整理
- 関連force / axis: structure。`evidenceSeeking`, `systemizing`, `maintenanceDrive`
- 関連設問: `ice33_q02`, `ice33_q13`, `ice33_q24`
- 高く出る回答傾向: 背景や事実を確認する、会話から判断材料を拾う、小さな情報に価値を感じる
- 低く出る回答傾向: 情報探索より、始動・発信・表現・会話の入口を優先する
- 本質語: 判断材料、観察、根拠、知恵化、背景整理
- 誤解しやすい点: 情報収集係だけではない。集めた情報を、誰かが判断できる知恵に変える役割。

### logicalmaister

- 表示名: ロジカルマイスター
- 既存の短い定義: 仕組みを作る人 / 複雑なものを誰でも動ける道筋へ変える人
- 使命: 感覚を再現可能な形へ変える
- 自然な行動: 整理する、構造化する、設計する、仕組み化する
- 強み: 設計力、分析力、仕組み化、計画性
- 渡しているもの: 安定、再現性、設計図、判断基準
- 受け取ると潤うもの: 明確な目的、データ、信頼
- 心地よい環境: 論理的に考えられる場
- 力が出にくい環境: 場当たり的な場
- Funding / Link / Song: 設計担当 / 構造設計 / 企画設計
- 関連force / axis: structure。`systemizing`, `evidenceSeeking`, `expressionDrive`
- 関連設問: `ice33_q06`, `ice33_q17`, `ice33_q28`
- 高く出る回答傾向: 散らかった話を構造化する、感覚を伝わる言葉へ置き換える、理由と順番を添える
- 低く出る回答傾向: 構造化より、会話の広がり・直感的な始動・表現の空気を優先する
- 本質語: 構造化、言語化、再現性、設計図、理解可能性
- 誤解しやすい点: 理屈っぽい人ではない。感覚や発想や実行を、人に理解され再現できる形へ翻訳する役割。

### movmentor

- 表示名: ムーブメンター
- 既存の短い定義: 人の一歩を応援する人
- 使命: 挑戦する人の背中を押す
- 自然な行動: 応援する、勇気づける、励ます、行動を促す
- 強み: 熱量、応援力、空気づくり、行動促進
- 渡しているもの: 勇気、前向きさ、行動力、希望
- 受け取ると潤うもの: 感謝、成長実感、仲間の成功
- 心地よい環境: 挑戦がある場
- 力が出にくい環境: 否定が多い場
- Funding / Link / Song: 伴走担当 / 応援役 / 共感拡散
- 関連force / axis: care。`encouragement`, `socialBridge`, `executionDrive`
- 関連設問: `ice33_q07`, `ice33_q18`, `ice33_q29`
- 高く出る回答傾向: 挑戦している人の次の一歩を探す、良いところを本人に伝える、背中を押す言葉を選ぶ
- 低く出る回答傾向: 応援や言葉かけより、情報・品質・構造・観察を優先する
- 本質語: 伴走、勇気づけ、次の一歩、行動促進、応援の循環
- 誤解しやすい点: 応援係だけではない。人の内側にある挑戦を、具体的な一歩へ変える役割。

### premiercrafter

- 表示名: プルミエルクラフター
- 既存の短い定義: 品質を育てる人 / 価値を磨き上げる人
- 使命: 良いものを本物へ育てる
- 自然な行動: 細部を見る、磨き込む、品質を上げる、改善する
- 強み: 品質管理、制作力、継続力、技術力
- 渡しているもの: 信頼、品質、安心感、完成度
- 受け取ると潤うもの: 評価、認知、良い作品との出会い
- 心地よい環境: 丁寧な仕事が評価される場
- 力が出にくい環境: 雑さが当たり前の場
- Funding / Link / Song: 品質担当 / 価値向上 / 作品磨き
- 関連force / axis: care。`craftQuality`, `maintenanceDrive`, `evidenceSeeking`
- 関連設問: `ice33_q09`, `ice33_q20`, `ice33_q31`
- 高く出る回答傾向: 最後にもう一段磨く、続けることで信頼を積む、残る品質にする
- 低く出る回答傾向: 品質・継続より、まず動く・広げる・前に出ることを優先する
- 本質語: 品質、磨き込み、信頼、完成度、資産化
- 誤解しやすい点: 職人気質だけではない。価値を信頼される水準まで育て、残る形にする役割。

### soulowner

- 表示名: ソウルオーナー
- 既存の短い定義: 安心できる居場所を作る人 / 安心を育てる人
- 使命: 人が挑戦を続けられる土台を育てる
- 自然な行動: 話を聞く、気持ちを受け止める、寄り添う、支える
- 強み: 共感力、受容力、深い癒し、絶対的安心感
- 渡しているもの: 安心感、信頼、優しさ、受容
- 受け取ると潤うもの: 本音、感謝、信頼関係、深い対話
- 心地よい環境: 人との関係を大切にできる場
- 力が出にくい環境: 成果だけを求められる場、競争が強すぎる場
- Funding / Link / Song: 関係性担当 / 居場所づくり・関係性づくり / 物語の共感者
- 関連force / axis: care。`psychologicalSafety`, `encouragement`, `maintenanceDrive`
- 関連設問: `ice33_q04`, `ice33_q15`, `ice33_q26`
- 高く出る回答傾向: まず受け止める、未言語の気持ちに気づく、自然体でいられるかを大切にする
- 低く出る回答傾向: 安心の土台より、始動・発信・配置・表現を優先する
- 本質語: 心理的安全性、本音、受容、居場所、挑戦を続ける土台
- 誤解しやすい点: 優しい人だけではない。人が挑戦を続けられる関係性と土台を育てる役割。

## 組み合わせ・開花の既存設計

| 起点 | 既存の補完・未来を広げる存在 |
|---|---|
| revolist | logicalmaister, arranger, communicator, soulowner |
| crazist | maxdesigner, logicalmaister, revolist |
| maxdesigner | crazist, imagemaister, logicalmaister, revolist |
| imagemaister | premiercrafter, communicator, soulowner, revolist |
| communicator | soulowner, movmentor, inforader, arranger |
| arranger | revolist, logicalmaister, communicator |
| inforader | logicalmaister, communicator, arranger |
| logicalmaister | revolist, arranger, communicator |
| movmentor | soulowner, communicator, revolist |
| premiercrafter | imagemaister, logicalmaister |
| soulowner | movmentor, communicator, arranger |

既存の3人目効果では、以下の代表例が定義されています。

- revolist + logicalmaister + arranger: 理想、設計、運営がつながりプロジェクトになる
- communicator + inforader + logicalmaister: 情報、整理、共有がつながり価値になる
- imagemaister + premiercrafter + communicator: 作品、共感、拡散がつながりファンが生まれる
- movmentor + revolist + soulowner: 挑戦、安心、継続がつながり文化になる
- crazist + maxdesigner + logicalmaister: 発想、設計、実装がつながり事業になる

## 名前だけで誤解しやすい点

| roleKey | 避ける説明 | 既存設計上の守るべき本質 |
|---|---|---|
| `revolist` | 行動力がある人だけ | 未来に火を灯し、人が動ける起点を作る |
| `crazist` | 変人、突飛な人 | 違和感から社会に必要な可能性を見つける |
| `arranger` | 雑務・調整役 | 人・情報・役割を配置し、流れを生む |
| `communicator` | 話し上手 | 会話の入口を作り、ご縁を循環させる |
| `logicalmaister` | 理屈っぽい人 | 感覚や発想を理解される構造へ変える |
| `imagemaister` | 見た目担当 | 想いや空気や世界観を伝わる形にする |
| `inforader` | 情報収集係 | 情報を判断材料と知恵に変える |
| `premiercrafter` | 職人気質 | 価値を信頼される品質へ育てる |
| `soulowner` | 優しい人 | 本音と挑戦が続く心理的土台を作る |
| `movmentor` | 応援係 | 人の挑戦を具体的な一歩へ変える |
| `maxdesigner` | 企画屋 | 選択肢を広げ、未来の可能性を設計する |

## 結果コピー作成時に守ること

- 役割名より先に「どんな働きをする人か」を伝える。
- ネガティブな言い方にしない。低く出る傾向も、別の力を優先している情報として扱う。
- `centeredTopRole` や `centeredTopForce` をそのまま結果タイプ名にしない。表示には別途、解釈レイヤーが必要。
- 5つの力、4つの動き方、15軸を混同しない。
- 役割単体で完結させず、誰と組むと何が起きるかまで残す。
- 固定ペアにしすぎない。五角形モデルでは、自分の形、相手の形、チームの形で組み合わせが変わる。
- Wealth Dynamics由来の固有名詞はUIやコピーに出さない。参照構造としてだけ使う。
- Revoは入口ではなく出口。結果コピーは「今いる環境で試せる」ことを先に置く。

## 既存設計が見つからなかった項目

- `shortDescription`: 同名フィールドなし。`publicSummary` と Role Dictionary の「ひとことで」で代替可能。
- `drainingEnvironment`: TypeScriptの現行マスターには同名フィールドなし。Role Dictionary docsに「力が出にくい環境」として存在。
- `growthPotential`: 同名フィールドなし。`revotypes.potential`, `growthRoutes`, `quest` に分散。
- `awakens` / `awakenedBy`: 同名フィールドなし。`futurePartners`, `matchRules`, `monitorResults.matchResultText` から逆引き可能。
- `symbol`: 同名フィールドなし。
- `data/roles/Revo11_Role_Master.ts`: ファイルはあるが空。

## 次にコピー化する場合の方針

1. 各役割の冒頭は「名称」ではなく「働き」から書く。
2. `catchCopy`, `mission`, `publicSummary`, Icebreak設問の3問を根拠に、1役割ずつ本文を作る。
3. 各役割に「自然に出る力」「周囲に渡しているもの」「組むと動きやすい人」「今いる環境で試せる一歩」を含める。
4. 名前で誤解されやすい役割ほど、最初に本質を説明してから名称を出す。
5. コピー化後も、アルゴリズムや重みとは別レイヤーとして扱う。
