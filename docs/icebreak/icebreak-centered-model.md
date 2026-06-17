# Icebreak 33 中心0モデル方針

## 目的

Icebreak 33 の新測定モデルでは、UI・保存・URLでは従来通り回答値 `1〜5` を扱い、計算内部で中心0の `-2〜+2` に変換する。

このメモは、現時点の方針を固定し、残り9問にも無理にoverrideを入れて設計を重くしすぎることを防ぐための記録である。

## 現在の構成

Icebreak 33 は、全33問に中心0変換が効いている。

`ICEBREAK_CENTERED_WEIGHT_OVERRIDES` は全問に入れる必要はない。現時点では、24問をoverride対象とし、残り9問はoverride不要として扱う。

| 区分 | 問数 |
|---|---:|
| 全設問 | 33 |
| override対象 | 24 |
| マイナスありoverride | 16 |
| 空override | 8 |
| override不要 | 9 |

空overrideのID:

- `ice33_q04`
- `ice33_q08`
- `ice33_q15`
- `ice33_q17`
- `ice33_q27`
- `ice33_q29`
- `ice33_q32`
- `ice33_q33`

## マイナスありoverrideとは

マイナスありoverrideは、肯定回答がある特色を強め、否定回答を別の特色の情報として薄く読める設問にだけ使う。

目的は、否定回答を罰することではない。相反しやすい見方や行動の傾向を、小さな補助情報として扱うためのもの。

強すぎるマイナスは、タイプの沈み込みや不自然な反転につながるため、必ず監査を挟んで扱う。

## 空overrideとは

空overrideは、診断上の分析対象には含めるが、追加で相反タイプを下げない設問である。

肯定回答では、その設問が本来持つ `axis / role / force` のプラス情報を直接見る。否定回答では、その特色がこの設問では出にくいだけとして扱い、無理に反対タイプへ押し込まない。

例:

- q08: 配置・調整の力を見るが、表現側を下げない
- q17: 感覚を言語化する力を見るが、構造化以外を下げない
- q32: 自分の感覚を確かめる力を見るが、`ignite / crazist` は既にマイナス上位なので追加で下げない

## override不要とは

override不要の設問も、中心0計算自体では意味を持つ。回答情報は失われない。

既存の正の重みと中心0変換だけで十分に読める設問、または追加overrideを入れると偏りが増えそうな設問は、override不要として扱う。

残り9問は現時点ではoverride不要とする。

## なぜ33問すべてをoverrideしないのか

全問にoverrideを入れると、設問ごとに反対タイプを作る圧力が強くなる。

しかし、すべての設問に明確な相反タイプがあるわけではない。特に、応援・可能性・場づくり・言語化の設問では、否定回答を別タイプへ強く振り分けるより、単にその特色が出にくい回答として扱う方が自然な場合がある。

33問すべてをoverride対象にすると、実データを見る前に設計者の仮説を入れすぎる危険がある。現時点では24問で止め、残り9問は中心0変換だけで扱う。

## 現在の監査結果

24問時点の監査では、以下を確認している。

- 全回答3は完全中立
- 第8セット追加後もマイナス合計は増えていない
- 空override8問だけ5では `hasNegativeScore=false`
- 空override8問だけ1でも、不自然な反対タイプの爆上がりは出ていない
- `legacyResult` には影響していない

24問時点でマイナス重みが比較的集まっている対象:

| 区分 | 上位 |
|---|---|
| axis | `executionDrive -0.8`, `publicVisibility -0.8`, `evidenceSeeking -0.75`, `maintenanceDrive -0.75`, `systemizing -0.65` |
| role | `premiercrafter -0.75`, `inforader -0.7`, `revolist -0.7`, `crazist -0.65`, `logicalmaister -0.6` |
| force | `structure -0.85`, `ignite -0.85`, `care -0.5`, `connect -0.35`, `design -0.2` |

第8セットは空overrideのみなので、21問時点からマイナス合計は増えていない。

## 今後の見直し条件

実回答データが30〜100件以上集まったら、分布を見る。

特定の `role / force` が出すぎる、または出なさすぎる場合は、重みを再調整する。

0回答が特定設問に集中する場合は、設問文の見直し候補にする。

空overrideをマイナスありoverrideへ変える場合は、必ず監査を挟む。

残り9問をoverride対象に追加する場合も、必ず理由と監査を残す。

## legacyResultとの関係

`legacyResult` は、既存表示・URL・体験を守るための従来結果である。

中心0モデルの `centeredResult` は、当面は内部比較・ログ確認・分布監査のために使う。画面表示やURL生成には、引き続き `legacyResult` を使う。

`centeredResult` の分布確認が終わるまで、`legacyResult` の挙動は変更しない。

## 触ってはいけないもの

`centeredResult` の分布確認が終わるまで、以下は変更しない。

- UI
- 結果表示
- URL形式
- API
- Google Apps Script連携
- 本番 `icebreakQuestions.ts`
- `legacyResult`

## 関連ファイル

- `src/lib/diagnosisCore/multiAxis.ts`
- `src/lib/diagnosisCore/icebreakCenteredWeights.ts`
- `src/lib/calculateMultiAxisRoleResult.ts`
- `src/lib/calculateIcebreakResult.ts`
- `scripts/test-icebreak.mjs`
- `scripts/audit-icebreak-distribution.mjs`
