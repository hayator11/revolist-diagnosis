# Revo111 Google Sheets Analysis Design

## 方針

Revo111のGoogle Sheetsは、保存先ではなく検証基盤として扱う。

- ライト診断21問は入口なので、流入元だけを軽く保存する。
- 44問版モニターは、参加動機・紹介・関心プロジェクト・関わり方まで保存する。
- Revo Linkerは紹介歓迎型として扱い、外部画面に紹介人数・順位・紹介先一覧は表示しない。
- `ref` URLパラメータは `referrerSlug` として保存し、内部集計にのみ使う。

## Raw Data

Apps Scriptから送信された生データをそのまま残す。

- `Raw_Responses`
- `Raw_LightDiagnosis`
- `Raw_Monitor44`
- `Raw_CommunitySurvey`

ルール:

- 生データは加工しない
- 並び替えしない
- 削除しない
- 未入力は空欄で保存
- 複数選択はカンマ区切りで保存

## Analysis

集計・分類・検証用。

- `Analysis_Summary`
- `Analysis_Channel`
- `Analysis_Type`
- `Analysis_Referral`
- `Analysis_Motivation`
- `Analysis_FreeText`

主な分析軸:

- `formType`
- `diagnosisType`
- `discoveryChannel`
- `discoveryDetail`
- `joinMotivation`
- `isReferred`
- `communityInterest`
- `interestedProjects`
- `possibleContribution`

## Dashboard

運営確認用。

KPI:

- 総回答数
- 今週の回答数
- ライト診断回答数
- 44問版モニター回答数
- コミュニティ関心あり
- 紹介経由の回答数
- ホームページ経由の回答数
- SNS経由の回答数

グラフ:

- 日別回答数
- 流入元別回答数
- 最初に見た場所
- 参加動機
- 紹介経由割合
- コミュニティ参加意欲
- 興味のあるプロジェクト
- 診断タイプ別の関心傾向

## 推奨列

新規列は既存列の末尾に追加する。

```text
timestamp
formType
userId
name
email
snsUrl
diagnosisType
resultTitle
resultSummary
discoveryChannel
discoveryDetail
joinMotivation
impressivePhrase
isReferred
referrerName
referrerUrl
referrerSlug
referralContext
referrerPublishConsent
currentInterest
interestedProjects
communityInterest
monitorInterest
possibleContribution
expectationText
utmSource
utmMedium
utmCampaign
pagePath
device
ctaClicked
memo
```

## 自由記述の活用テーマ

- このままでいいのか
- 成功はひとつじゃない
- 人生の次の関わり方
- 仕事
- 副業
- 転職
- 自分の役割
- 応援
- コミュニティ
- お金以外の価値
- 人とのつながり
- レボリストLab

活用先:

- TOPコピー改善
- 診断結果ページ改善
- SNS投稿テーマ作成
- 44問版の設問改善
- コミュニティ導線改善
- Revo Linker導線改善
