# Icebreak 33 SNSシェアコピー設計方針

## 目的

Icebreak 33 の結果画面にあるSNSシェア機能を、外部検証前に「思わずシェアしたくなる」体験へ改善するため、現在の実装状況、課題、改善案、初回実装方針を整理する。

今回は設計ドキュメント作成のみ。実装変更、UI変更、既存シェア文言変更、結果表示変更、11役割コピー変更、検証フォーム変更、Supabase、API、GAS、設問データ、アルゴリズム、scripts の変更は行わない。

## 調査したファイル

- `src/app/research/icebreak-11-v1/_components/IcebreakResultClient.tsx`
- `src/data/icebreakRoleResultCopy.ts`
- `docs/icebreak/icebreak-roles-result-copy-plan.md`
- `docs/icebreak/icebreak-role-result-copy-display-plan.md`
- `docs/icebreak/icebreak-all-role-copy-display-review.md`

## 現在のシェア文言

現在のシェア文言は `IcebreakResultClient.tsx` 内の `shareText` で組み立てている。

構成:

```text
私は今日、{mainRole.name}っぽく場に入れそう。
話してみたいのは{partnerRole.name}タイプ。
{resultUrl}
```

使っている情報:

- `resultState.details.mainRole.name`
- `resultState.details.partnerRole.name`
- `resultUrl`

`resultUrl` は現在のオリジンと回答IDから生成している。

```text
{origin}/research/{ICEBREAK_11_META.slug}/result/{encoded}
```

シェア導線:

- `共有 / コピー`
  - `navigator.share` が使える場合はネイティブ共有
  - 使えない場合は `navigator.clipboard.writeText(shareText)`
- `X`
  - `https://twitter.com/intent/tweet?text=...`
- `LINE`
  - `https://social-plugins.line.me/lineit/share?url=...&text=...`

現時点では、コピー用、X用、LINE用の文言は分かれていない。すべて同じ `shareText` を使っている。

## 現在の課題

現在の文言は、結果共有としては機能しているが、外部テスターに自然に広げてもらうには引きが弱い可能性がある。

課題:

- 役割名が中心で、「どんな働きが出たか」が伝わりにくい
- `mainRole.name` を知らない初見の人には、意味が少し伝わりにくい
- 「っぽく場に入れそう」は柔らかいが、投稿したくなる自己紹介としては少し弱い
- URL共有に近く、他の人が「自分もやってみたい」と思う誘いが薄い
- `partnerRole.name` は会話のきっかけにはなるが、文脈なしだと突然感がある
- 結果画面に追加された役割コピーカードの言葉と、シェア文言がまだ連動していない

維持したい点:

- 決めつけすぎない
- 結果URLを変えない
- シェア導線の構造を変えない
- 既存の `legacyResult.mainTypeKey` を使い、`centeredResult` は表示タイプ決定に使わない

## 改善の方向性

シェア文言では、役割名そのものよりも「今回の回答で見えた働き」を先に出す。

目指す体験:

- 自分ごと化しやすい
- 役割名だけでなく「働き」が伝わる
- 名前のこじつけ感が少ない
- XやLINEで自然に送れる
- 他の人も診断したくなる
- オフ会や自己紹介の入口になる

## 使う候補データ

`src/data/icebreakRoleResultCopy.ts` には、11役割ごとに以下がある。

- `displayName`
- `workingCopy`
- `catchCopy`
- `selfCheckItems`
- `essence`
- `cautionHabit`
- `meetupUse`
- `goodPartners`
- `shareCopy`
- `mismatchNote`

初回実装で優先して使う候補:

- `shareCopy`
- `workingCopy`
- `resultUrl`

理由:

- `shareCopy` はシェア用に短く整えてある
- `workingCopy` は役割名より先に働きを伝えられる
- `resultUrl` は既存の復元・共有導線を維持できる

補助候補:

- `catchCopy`
- `displayName`

ただし、初回は文量を増やしすぎないため、必須にはしない。

## 初回は入れない項目

初回のSNSシェア文言には、以下は入れない。

- `cautionHabit`
- `mismatchNote`
- `essence` の長文
- `goodPartners` の全量
- スコア
- `centeredResult`
- 内部判定情報
- `answerDetails`
- Supabase保存情報
- `/api/feedback` payload情報

理由:

- シェア文言が重くなる
- 自己認識とズレた人が投稿しにくくなる
- 内部分析情報をSNSへ出す必要がない
- 初回は「働き」と「誘い」だけで十分

## 新しいシェア文言案

### 案A: 短く自己紹介型

```text
{roleCopy.shareCopy}

Icebreak 33で診断してみました。
あなたはどんな役割が出る？

{resultUrl}
```

例:

```text
私は、人や役割を配置して流れを生む人でした。

Icebreak 33で診断してみました。
あなたはどんな役割が出る？

{resultUrl}
```

特徴:

- 一番短く、XにもLINEにも使いやすい
- `shareCopy` をそのまま活かせる
- 初見の人にも「診断結果の共有」だと分かる

### 案B: 余白のある共感型

```text
{roleCopy.workingCopy}

ちょっと意外だけど、たしかにあるかも。
Icebreak 33、やってみて。

{resultUrl}
```

例:

```text
あなたは、人・情報・役割を配置して流れを生む人。

ちょっと意外だけど、たしかにあるかも。
Icebreak 33、やってみて。

{resultUrl}
```

特徴:

- 自己認識と少しズレた人でも投稿しやすい
- 「正解だった」よりも、会話の余白が残る
- LINEや身近な相手への共有に向いている

### 案C: 会話のきっかけ型

```text
私に出た役割は「{roleCopy.workingCopyWithoutPrefix}」でした。

あなたと組んだら、どんな場が動くんだろう。
Icebreak 33で見てみて。

{resultUrl}
```

例:

```text
私に出た役割は「人・情報・役割を配置して流れを生む人」でした。

あなたと組んだら、どんな場が動くんだろう。
Icebreak 33で見てみて。

{resultUrl}
```

特徴:

- オフ会や自己紹介につながりやすい
- 相手を誘う文脈が自然
- ただし `workingCopy` から「あなたは、」を取り除く処理が必要になるため、初回実装では少しだけ扱いが増える

### 案D: X向け短文型

```text
{roleCopy.shareCopy}

Icebreak 33で診断してみた。
あなたはどんな役割が出る？

{resultUrl}
```

例:

```text
私は、人や役割を配置して流れを生む人でした。

Icebreak 33で診断してみた。
あなたはどんな役割が出る？

{resultUrl}
```

特徴:

- Xで読みやすい
- 改行が多く、詰まって見えにくい
- 初回実装の第一候補にしやすい

## 11役割共通テンプレート

初回実装の推奨テンプレート:

```text
{roleCopy.shareCopy}

{roleCopy.workingCopy}

Icebreak 33で診断してみました。
あなたはどんな役割が出る？

{resultUrl}
```

ただし、Xでは少し長くなる可能性があるため、X向けには `workingCopy` を省く案も残す。

短縮テンプレート:

```text
{roleCopy.shareCopy}

Icebreak 33で診断してみた。
あなたはどんな役割が出る？

{resultUrl}
```

fallback:

```text
私は今日、{mainRole.name}っぽく場に入れそう。
話してみたいのは{partnerRole.name}タイプ。
{resultUrl}
```

## X向け案

方針:

- 短くする
- 改行を多めにする
- `shareCopy` と誘いを中心にする
- `workingCopy` は長い役割では省く余地を残す

推奨案:

```text
{roleCopy.shareCopy}

Icebreak 33で診断してみた。
あなたはどんな役割が出る？

{resultUrl}
```

検討案:

```text
{roleCopy.shareCopy}
{roleCopy.workingCopy}

あなたはどんな役割が出る？

{resultUrl}
```

注意:

- Xの文字数上限に収まるか、11役割すべてで確認する
- `workingCopy` を入れると長くなる役割がある
- URLはX側で短縮扱いになるが、実装前に実際の文字数を確認する

## LINE向け案

方針:

- 少し会話っぽくする
- 「これやってみた」感を出す
- 押しつけず、相手にも試してもらいやすくする

推奨案:

```text
Icebreak 33やってみたら、
{roleCopy.shareCopy}

{roleCopy.workingCopy}

よかったらあなたもやってみて。
{resultUrl}
```

検討案:

```text
これやってみた。
私は「{roleCopy.displayName}」で、
{roleCopy.shareCopy}

あなたはどんな役割が出るか見てみたい。
{resultUrl}
```

注意:

- 役割名を入れる場合は、名前だけが一人歩きしないように `shareCopy` を必ず添える
- `crazist` など名称の印象が強い役割では、働きコピーを優先する

## コピー用案

方針:

- XにもLINEにも貼れる中間文
- ネイティブ共有やクリップボード用として使いやすい
- 初回はここを `shareText` として置き換えるのが最小

推奨案:

```text
{roleCopy.shareCopy}

{roleCopy.workingCopy}

Icebreak 33で診断してみました。
あなたはどんな役割が出る？

{resultUrl}
```

短縮案:

```text
{roleCopy.shareCopy}

Icebreak 33で診断してみました。
あなたはどんな役割が出る？

{resultUrl}
```

## 初回実装する場合の最小方針

初回実装では、シェアボタン構造は変えず、`shareText` の組み立てだけを変更する。

最小変更候補:

1. `IcebreakResultClient.tsx` で既に取得している `roleCopy` をシェア文言にも使う
2. `roleCopy` がある場合は新テンプレートを使う
3. `roleCopy` がない場合は既存文言へfallbackする
4. X / LINE / コピーで同じ `shareText` を使う
5. URL形式は変えない
6. `/api/feedback` payload は変えない
7. Supabase保存には関係させない
8. `centeredResult` は使わない

実装イメージ:

```ts
const shareText = useMemo(() => {
  if (!resultState) return "";
  const roleCopy = getIcebreakRoleResultCopy(resultState.result.mainTypeKey);

  if (roleCopy) {
    return [
      roleCopy.shareCopy,
      "",
      "Icebreak 33で診断してみました。",
      "あなたはどんな役割が出る？",
      "",
      resultUrl,
    ].join("\n");
  }

  return [
    `私は今日、${resultState.details.mainRole.name}っぽく場に入れそう。`,
    `話してみたいのは${resultState.details.partnerRole.name}タイプ。`,
    resultUrl,
  ].join("\n");
}, [resultState, resultUrl]);
```

第一候補は短縮テンプレート。

理由:

- 文量が軽い
- 11役割すべてで成立しやすい
- XでもLINEでも使いやすい
- 既存のシェア導線を壊さない

## 実装前の確認事項

実装前に確認すること:

- 11役割すべてで文が長すぎないか
- Xで文字数が長すぎないか
- LINEで不自然でないか
- 結果が自己認識と違う人でも投稿しやすいか
- 役割名だけが一人歩きしないか
- `crazist` が変人扱いに見えないか
- `logicalmaister` が理屈っぽい人に見えないか
- `arranger` が単なる調整役に見えないか
- `communicator` が話し上手だけに見えないか
- `shareCopy` 単体で意味が伝わるか

実装後に確認すること:

- `共有 / コピー` で新しい文言がコピーされる
- Xリンクで新しい文言が入る
- LINEリンクで新しい文言が入る
- `resultUrl` が維持される
- シェア文言以外の結果表示が変わらない
- `/api/feedback` payload が変わらない
- Supabase保存に影響しない

## 今回変更しないもの

- `IcebreakResultClient.tsx`
- `src/data/icebreakRoleResultCopy.ts`
- 結果ページ関連ファイル
- API関連
- Supabase関連
- GAS関連
- 設問データ
- アルゴリズム
- scripts
- `.env.local`
- 既存シェア文言
