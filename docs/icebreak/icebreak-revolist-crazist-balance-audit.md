# Icebreak 33 revolist / crazist 出現バランス監査

## 目的

Icebreak 33で `revolist` と `crazist` が意図せず出にくくなっていないかを、既存設計・設問・ローカル代表パターンで確認する。

今回の監査は調査のみであり、以下は変更しない。

- 重み
- アルゴリズム
- 設問文
- 結果表示
- 11役割コピー
- Supabase / API / GAS / payload / URL形式
- scripts の既存挙動

## 調査したファイル

- `src/data/icebreakQuestions.ts`
- `src/lib/calculateIcebreakResult.ts`
- `src/lib/calculateMultiAxisRoleResult.ts`
- `src/lib/diagnosisCore/multiAxis.ts`
- `src/lib/diagnosisCore/icebreakCenteredWeights.ts`
- `docs/icebreak/icebreak-roles-design-inventory.md`
- `scripts/test-icebreak.mjs`
- `scripts/audit-icebreak-distribution.mjs`

## 既存設計上の位置づけ

| roleKey | 表示名 | 主force | required axis | supportive axis | caution axis | 関連設問 |
| --- | --- | --- | --- | --- | --- | --- |
| `revolist` | レボリスト | ignite | `noveltyDrive`, `uncertaintyTolerance`, `executionDrive`, `publicVisibility` | `socialBridge`, `encouragement` | `maintenanceDrive`, `evidenceSeeking` | `ice33_q03`, `ice33_q14`, `ice33_q25` |
| `crazist` | クレイジスト | ignite | `nonconformity`, `noveltyDrive`, `uncertaintyTolerance` | `possibilityDesign`, `expressionDrive` | `maintenanceDrive`, `coordination` | `ice33_q10`, `ice33_q21`, `ice33_q32` |

`revolist` は、単なる行動力ではなく、未来に火を灯し、人が動ける起点を作る役割。  
`crazist` は、変人扱いする役割ではなく、違和感から社会に必要な可能性を見つける役割。

どちらも `rarity: "rare"` であり、legacyResultでは最低信頼度の条件が他の common / balanced 役割より厳しい。

## 関連設問

### revolist

| questionId | 設問 | 主なaxis |
| --- | --- | --- |
| `ice33_q03` | 面白そうだと思ったら、整いきる前でも小さく試してみたくなる | `executionDrive`, `uncertaintyTolerance`, `noveltyDrive` |
| `ice33_q14` | 今ないものでも、必要だと思えば自分から始める選択肢が浮かぶ | `executionDrive`, `noveltyDrive`, `publicVisibility` |
| `ice33_q25` | 誰かを待つより、自分が先に動いて空気を変えたい時がある | `executionDrive`, `publicVisibility`, `uncertaintyTolerance` |

### crazist

| questionId | 設問 | 主なaxis |
| --- | --- | --- |
| `ice33_q10` | 普通のやり方だけでは届かないなら、別の前提から考えたくなる | `nonconformity`, `noveltyDrive`, `uncertaintyTolerance` |
| `ice33_q21` | 常識の外に見える案でも、社会に必要なら試す価値があると思う | `nonconformity`, `uncertaintyTolerance`, `possibilityDesign` |
| `ice33_q32` | 人と違う見方をしていると言われても、自分の感覚を確かめたい | `nonconformity`, `expressionDrive`, `uncertaintyTolerance` |

## 確認したパターン

ローカルで一時的に代表パターンを作り、`calculateIcebreakParallelResult(answers)` で確認した。  
恒久スクリプトは追加していない。

| パターン | legacy mainTypeKey | mode | centerForce | revolist rank / confidence | crazist rank / confidence | centeredTopRole |
| --- | --- | --- | --- | --- | --- | --- |
| 全回答3 | `maxdesigner` | `low_confidence` | care | 10位 / 59.374 | 11位 / 59.204 | `arranger:0` |
| 全回答5 | `maxdesigner` | `low_confidence` | care | 10位 / 96.872 | 11位 / 96.021 | `soulowner:6.3` |
| 全回答1 | `crazist` | `low_confidence` | care | 2位 / 21.877 | 1位 / 22.387 | `premiercrafter:-4.5` |
| revolist設問だけ5、他3 | `revolist` | `focused` | ignite | 1位 / 78.195 | 3位 / 65.423 | `revolist:6.7` |
| crazist設問だけ5、他3 | `crazist` | `focused` | ignite | 3位 / 64.261 | 1位 / 76.037 | `crazist:6.7` |
| revolist設問5、crazist設問1、他3 | `movmentor` | `broad` | connect | 1位 / 66.763 | 11位 / 39.101 | `revolist:6.7` |
| crazist設問5、revolist設問1、他3 | `premiercrafter` | `dual` | design | 11位 / 41.180 | 1位 / 63.679 | `crazist:6.7` |
| ignite系6問だけ5、他3 | `crazist` | `dual` | ignite | 2位 / 85.263 | 1位 / 88.395 | `crazist:6.7` |
| connect系6問だけ5、他3 | `arranger` | `dual` | connect | 9位 / 61.401 | 11位 / 58.777 | `arranger:6` |
| structure系6問だけ5、他3 | `inforader` | `dual` | structure | 11位 / 58.822 | 10位 / 59.666 | `inforader:6` |
| care系9問だけ5、他3 | `soulowner` | `focused` | care | 8位 / 62.969 | 11位 / 58.501 | `soulowner:6.7` |
| revolist設問だけ5、他1 | `revolist` | `low_confidence` | ignite | 1位 / 59.518 | 2位 / 34.824 | `revolist:8.1` |
| crazist設問だけ5、他1 | `crazist` | `low_confidence` | ignite | 3位 / 31.649 | 1位 / 56.053 | `crazist:8` |

補足: `*だけ5、他1` の2ケースは、role ranking上は対象役割が1位だが、legacyのmodeは `low_confidence` になる。結果の `mainTypeKey` はrole rankingの先頭にfallbackするため対象役割名は出るが、判定としては強いfocusedではない。

## revolist の出現確認

`revolist` 関連3問だけを5、他を3にした場合、legacyResultは以下になった。

- `mainTypeKey`: `revolist`
- `centerForce`: `ignite`
- `mode`: `focused`
- `revolist`: 1位 / confidence 78.195
- centeredResultSummary: `centeredTopRole` は `revolist`

このため、`revolist` は関連設問に素直に肯定した場合、意図どおり出る。

### revolist が自然に出る条件

- `ice33_q03`, `ice33_q14`, `ice33_q25` が高い
- `executionDrive`, `uncertaintyTolerance`, `noveltyDrive`, `publicVisibility` が揃って上がる
- care / structure 側だけが強く上がりすぎない
- `crazist` 側を強く否定しすぎず、ignite全体の文脈が残っている

### revolist が吸われやすい条件

`revolist` 設問を5にしていても、`crazist` 設問を1にした混合パターンでは、roleScores上は `revolist` が1位だが、`passesMinimumConfidence` を満たさず、legacyResultの `mainTypeKey` は `movmentor` になった。

このケースでは、`uncertaintyTolerance` が56.364まで落ち、rare役割としてのrequired floorが不足する。  
つまり、`revolist` は単なる実行力だけではなく、不確実性に踏み出す力も必要という設計が効いている。

吸われ先として見えたのは以下。

- `movmentor`: revolist設問5 + crazist設問1 + 他3
- `maxdesigner`: 全回答5 / 全回答3のような平坦パターン
- `soulowner` / care側: care系高めパターン

## crazist の出現確認

`crazist` 関連3問だけを5、他を3にした場合、legacyResultは以下になった。

- `mainTypeKey`: `crazist`
- `centerForce`: `ignite`
- `mode`: `focused`
- `crazist`: 1位 / confidence 76.037
- centeredResultSummary: `centeredTopRole` は `crazist`

このため、`crazist` は関連設問に素直に肯定した場合、意図どおり出る。

### crazist が自然に出る条件

- `ice33_q10`, `ice33_q21`, `ice33_q32` が高い
- `nonconformity`, `noveltyDrive`, `uncertaintyTolerance` が揃う
- `possibilityDesign`, `expressionDrive` が多少補助する
- coordination / maintenanceDrive が主役になりすぎない

### crazist が吸われやすい条件

`crazist` 設問を5にしていても、`revolist` 設問を1にした混合パターンでは、roleScores上は `crazist` が1位だが、legacyResultの `mainTypeKey` は `premiercrafter` になった。

このケースでは、`noveltyDrive` が47.907まで落ち、rare役割としてのrequired floorが不足する。  
つまり、`crazist` は非同調性だけではなく、可能性を新しく開く方向の `noveltyDrive` も必要という設計が効いている。

吸われ先として見えたのは以下。

- `premiercrafter`: crazist設問5 + revolist設問1 + 他3
- `maxdesigner`: 全回答5 / 全回答3のような平坦パターン
- `arranger` / `inforader`: connect / structureが強い比較パターン

## centeredResult とのズレ

centeredResultは表示判定には使わない前提のため、ここでは比較用に見る。

- `revolist` 3問だけ5、他3では `centeredTopRole` が `revolist`
- `crazist` 3問だけ5、他3では `centeredTopRole` が `crazist`
- revolist/crazistを互いに5/1にした混合パターンでも、centeredTopRoleは肯定した側に出る
- legacyResultで別役割に見えるケースは、centeredResult上では対象役割が相対的に高く出ている

このズレは、centeredResultが「回答平均との差分」を見るのに対し、legacyResultが「rare役割のrequired axisが基準を満たすか」を見るために起きている。

## 既存監査スクリプトでの分布確認

`RUNS=200 node scripts/audit-icebreak-distribution.mjs` を実行し、生成物は `/private/tmp/icebreak-centered-audit.json` にのみ出した。

主な分布:

| 分布 | revolist | crazist | 備考 |
| --- | ---: | ---: | --- |
| `icebreak33Uniform` | 5% | 10.5% | 完全ランダム寄り。どちらも出現あり |
| `icebreak33MostlyNeutral` | 2% | 5% | 中立寄りではrare役割が出にくい |
| `icebreak33LowNoveltyTendency` | 0% | 1.5% | novelty低めでは意図どおり出にくい |

ランダム分布だけで診断品質は判断しないが、`revolist` / `crazist` が完全に潰れている状態ではない。  
一方、中立寄り・novelty低めではかなり控えめに出る。

## 出にくい原因候補

### 1. rarity が rare

`revolist` / `crazist` はどちらも `rarity: "rare"`。  
最低信頼度のハードルが高く、roleScores上で1位でも `passesMinimumConfidence` を満たさないケースがある。

### 2. required axis の組み合わせが厳しい

`revolist` は `executionDrive` だけでは足りず、`uncertaintyTolerance`, `noveltyDrive`, `publicVisibility` も必要。  
`crazist` は `nonconformity` だけでは足りず、`noveltyDrive`, `uncertaintyTolerance` も必要。

この設計は思想上は自然だが、回答者が「始める力」と「常識の外を見る力」の片方だけを強く肯定した場合、rare役割としての確定力が落ちる。

### 3. caution axis は過剰ではない

legacyの `scoreProfile` では caution は `(100 - axisPct) * weight * 0.4` として加点される。  
つまり caution axisが高いほど減点されるのではなく、低いほど少し加点される構造。  
今回の監査では、cautionが強すぎて直接潰しているというより、required floorとrarity基準の影響が大きい。

### 4. supportive axis不足で負けるケースがある

`revolist` は `socialBridge`, `encouragement` がsupportive。  
`crazist` は `possibilityDesign`, `expressionDrive` がsupportive。  
これらが伸びない場合、required axisが一部高くても、common / balanced役割に見え方を取られることがある。

## 調整が必要かどうか

現時点では、すぐに重みやアルゴリズムを変更する必要はない。

理由:

- 関連3問だけ5、他3では `revolist` / `crazist` ともにfocusedで出る
- ignite系6問だけ5では `crazist` 1位、`revolist` 2位でdualに近い形になる
- centeredResultでも対象役割は素直にtopへ出る
- 出にくいケースは、rare役割として必要なrequired axisが欠けた場合として説明できる

ただし、外部テスターの実回答で以下が続く場合は調整検討が必要。

- `revolist` らしい自由記述・自己認識があるのに、legacyResultで一貫して `movmentor` / `maxdesigner` / `soulowner` に寄る
- `crazist` らしい違和感・非同調・未来視点があるのに、legacyResultで一貫して `premiercrafter` / `maxdesigner` / `arranger` に寄る
- ignite設問の肯定が多いのに、centerForceがigniteにならないケースが多い

## 調整する場合の候補

まだ実装しない。必要になった場合の候補だけ整理する。

1. rare役割の最低信頼度を下げる
   - 影響が大きいため慎重に扱う。
   - `revolist` / `crazist` 以外のrare役割が増えた場合にも影響する。

2. `revolist` の required floor を少し緩める
   - 例: `publicVisibility` のrequired weightを少し下げる。
   - ただし、単なる行動力として出すぎるリスクがある。

3. `crazist` の required floor を少し緩める
   - 例: `noveltyDrive` または `uncertaintyTolerance` のrequired weightを微調整する。
   - ただし、単なる非同調として出すぎるリスクがある。

4. supportive axisを少し効かせる
   - `revolist`: `socialBridge`, `encouragement`
   - `crazist`: `possibilityDesign`, `expressionDrive`
   - 役割の本質を壊しにくいが、出現条件の意味が変わるため実回答を見てから判断する。

5. 結果表示側で「rare役割の気配」を補助的に扱う
   - legacyResultのmainTypeは変えず、centeredResultやroleScoresを解釈レイヤーで使う案。
   - 現時点では centeredResult を表示判定に使わない方針なので、すぐには実装しない。

## まだ変更しないもの

- `src/data/icebreakQuestions.ts`
- `src/lib/calculateIcebreakResult.ts`
- `src/lib/calculateMultiAxisRoleResult.ts`
- `src/lib/diagnosisCore/multiAxis.ts`
- `src/lib/diagnosisCore/icebreakCenteredWeights.ts`
- 結果表示
- 11役割コピー
- Supabase / API / GAS / payload
- URL形式
- scripts

## 結論

`revolist` と `crazist` は、関連設問を素直に肯定した場合には意図どおり出る。  
現時点で「意図せず出にくくなりすぎている」とまでは判断しない。

ただし、どちらも rare 役割であり、required axisが一部欠けるとroleScores上では上位でもlegacyResultのmainTypeとしては別役割に見えることがある。  
外部検証では、実回答の自由記述・自己認識・centeredSummaryとのズレを見てから、重みや表示解釈の調整を検討するのがよい。
