# Icebreak 33 role-aware seating design

## 目的

Icebreak 33 / レボリスト診断のオフ会運営者機能で使う席順生成を、現在の `centerForce` 分散中心の最小ロジックから、11役割の相性・補完関係まで扱う `role-aware matching` へ改善するための設計メモ。

今回は設計docsのみを作成する。実装修正、API変更、UI変更、Supabase操作、SQL実行は行わない。

## 参照したファイル

- `src/lib/icebreakSeating.ts`
- `src/lib/icebreakSupabaseRepository.ts`
- `src/app/api/icebreak/seating/route.ts`
- `src/data/revo111Roles.ts`
- `src/data/teamCompatibility.ts`

## 現状整理

現在の席順生成は `src/lib/icebreakSeating.ts` の `generateIcebreakSeating` が担っている。

現在の決定基準:

- `tableCapacity` から必要なテーブル数を計算する。
- 参加者を `joinedAt` 昇順に並べる。
- 参加者を `centerForce` ごとにグループ化する。
- `FORCE_KEYS` の順に、各forceの参加者をテーブルへ割り振る。
- 割り振り先は、同じ `centerForce` が少ないテーブルを優先する。
- 同じ `centerForce` 数が同じ場合は、人数が少ないテーブルを優先する。
- それでも同じ場合は、テーブル番号の巡回順で安定させる。
- テーブル内の並び順は `centerForce` の順、同じ場合は `joinedAt` 順にする。

`centerForce` の使い方:

- 参加者の主な入口の力として使っている。
- 同じ `centerForce` が1つのテーブルに固まりにくくなるように使っている。
- テーブル名は、そのテーブルで一番多い `centerForce` から作っている。
- 理由文も、本人と隣席者の `centerForce` ラベルを使って作っている。

`joinedAt` の使い方:

- 初期並びの安定ソートとして使っている。
- 同じforce内での順番を安定させる用途で使っている。
- テーブル内の同force同士の並び順にも使っている。

テーブル内の並び順:

- `FORCE_KEYS` の順に並べる。
- 同じ `centerForce` の場合は `joinedAt` 順に並べる。
- その順番をもとに `seatNo` を付ける。

理由文の作り方:

- 1人だけの場合は、その人の `centerForce` を入口に会話を始める文言にする。
- 複数人の場合は、隣の人の `centerForce` と本人の `centerForce` を並べて、会話が流れやすいという文言にする。
- 11役割名、役割相性、補完関係は理由文に入っていない。

現在できていること:

- 同じ `centerForce` が一部のテーブルに寄りすぎることを抑えられる。
- テーブル人数の偏りをある程度抑えられる。
- 毎回ランダムではなく、同じ入力なら安定した席順を作れる。
- 初対面の会話導線として、5つの力をベースにした説明ができる。

現在できていないこと:

- `mainTypeKey` を使った11役割単位の配置。
- `partnerTypeKey` を使った近席候補の配置。
- `revo111Roles.futurePartners` を使った補完関係の配置。
- `teamCompatibility` を使ったペア相性の評価。
- 「この人と話すと次が動く」というレボリスト診断らしいマッチング。

## 現在の限界

現在のロジックは `force balancing` としては有効だが、レボリスト診断のマッチングとしては最小版に留まっている。

明確な限界:

- `mainTypeKey` を使っていない。
- `partnerTypeKey` を使っていない。
- 11役割の相性を使っていない。
- `futurePartners` を使っていない。
- `teamCompatibility` を使っていない。
- 隣席ペアの意味づけが `centerForce` 止まり。
- 同じ `centerForce` でも、役割が違う人の違いを扱えていない。
- 「この人と話すと次が動く」設計までは未到達。

## レボリスト診断らしい席順の定義

席順は、単なる均等分散ではなく、会話が起き、補完が起き、次の行動が生まれる配置にする。

目指す配置:

- 同じ力だけで固めない。
- 同じ役割だけで固めない。
- 起点役と受け止め役を組み合わせる。
- 広げる人と整える人を組み合わせる。
- 行動する人と意味づける人を組み合わせる。
- `partnerTypeKey` は近席候補として扱う。
- `futurePartners` は同卓候補として扱う。
- rare役割は孤立させず、活きる相手と配置する。
- テーブル全体で、動かす力、広げる力、整える力、届ける力、受け止める力が混ざるようにする。

この設計では、席順を「正解の断定」ではなく「会話のきっかけ」として扱う。理由文も、相性の良し悪しではなく、違う強みが近くにあることの意味を伝える。

## 優先順位案

席順生成は、以下の優先順位で評価する。

第1条件: `centerForce` の偏りを減らす

- 現在の良い点を維持する。
- 同じ力が1卓に固まりすぎる場合は減点する。
- 可能ならテーブル内に複数forceが混ざるようにする。

第2条件: `mainTypeKey` の偏りを減らす

- 同じ11役割が1卓に固まりすぎないようにする。
- 同じ役割が複数いる場合も、すべて離すのではなく、人数・会場規模に応じて偏りを抑える。

第3条件: `partnerTypeKey` / `futurePartners` が近席または同卓にいると加点

- `partnerTypeKey` は、その人にとって会話が広がりやすい近席候補として扱う。
- `futurePartners` は、同卓にいると補完が起きやすい候補として扱う。
- 近席の方が同卓より強く加点される設計にする。

第4条件: `teamCompatibility` が高い組み合わせを加点

- `best` ペアは強く加点する。
- `good` ペアは中程度に加点する。
- `bridge` ペアは、単独では弱めに加点し、第三者候補が同卓にいる場合に追加加点する。

第5条件: 同じ `mainTypeKey` / `centerForce` が固まりすぎる場合は減点

- 同タイプばかり、同forceばかりを避ける。
- ただし少人数イベントでは完全分散できないため、減点は過度に強くしない。

第6条件: `joinedAt` は最後の安定ソートとして使う

- マッチング評価の主条件にはしない。
- 同点時の安定化に使う。
- 参加順だけで席順が決まる状態に戻さない。

## スコアリング設計案

数値は初期案であり、実装時にテストしながら調整する。

### tableScore

候補:

- `centerForce diversity`: +0から+30
  - テーブル内のforce種類が増えるほど加点。
  - 同forceが多すぎる場合は減点。
- `mainType diversity`: +0から+20
  - 11役割が混ざるほど加点。
  - 同じ `mainTypeKey` が多い場合は減点。
- `partnerType match`: +0から+20
  - 参加者の `partnerTypeKey` が同卓にいる場合に加点。
  - 隣席候補ならさらに加点。
- `futurePartners match`: +0から+20
  - `revo111Roles[mainTypeKey].futurePartners` が同卓にいる場合に加点。
- `teamCompatibility score`: +0から+30
  - `best` は大きく加点、`good` は中程度、`bridge` は条件付き加点。
- `table size balance`: +0から+10
  - テーブル人数が均等に近いほど加点。

### pairScore

候補:

- `partnerTypeKey match`: +20
  - Aの `partnerTypeKey` がBの `mainTypeKey` と一致する場合。
  - 相互一致なら追加加点。
- `futurePartners match`: +15
  - Aの `futurePartners` にBが含まれる場合。
  - 相互に含まれる場合は追加加点。
- `teamCompatibility best`: +25
- `teamCompatibility good`: +15
- `teamCompatibility bridge`: +8
  - `bridge` は悪い相性ではなく、橋渡しで価値が出る組み合わせとして扱う。
- `complementary force`: +10
  - 起点役と受け止め役、広げる力と整える力など、会話が流れやすいforceの近接を加点。
- `same type penalty`: -15
  - 同じ `mainTypeKey` が隣席になる場合は軽く減点。
- `same force penalty`: -10
  - 同じ `centerForce` が隣席になる場合は軽く減点。

スコアは「良し悪しの判定」ではなく、席順候補の並び替えに使う。表示文言でも、低スコアをネガティブに説明しない。

## 既存ロジックを壊さない実装方針

既存 `generateIcebreakSeating` をいきなり壊さない。

次版として `generateIcebreakRoleAwareSeating` を作る。

候補ファイル:

- `src/lib/icebreakRoleMatching.ts`
- `src/lib/icebreakSeating.ts`

方針:

- `icebreakRoleMatching.ts` に役割相性スコアを分離する。
- `icebreakSeating.ts` から `icebreakRoleMatching.ts` を呼び出す。
- 既存 `generateIcebreakSeating` は残す。
- 新ロジックは `generateIcebreakRoleAwareSeating` として追加する。
- `algorithm_version` は `icebreak-seating-role-aware-v1` を候補にする。
- Phase切り替え時は `POST /api/icebreak/seating` 側で新関数を呼ぶ。

この方針なら、問題が出た場合も既存のforce balancing版へ戻しやすい。

## 使用候補データ

### `src/data/revo111Roles.ts`

確認結果:

- `revo111Roles` に11役割ごとの `futurePartners` がある。
- 役割ごとの自然な行動、渡しているもの、受け取るもの、活動内での役割説明がある。
- `matchRules` に、特定ペアが何を生むかの説明がある。
- `thirdPersonEffects` に、2人ペアへ3人目を足す効果がある。

席順スコアに使える要素:

- `futurePartners`: 同卓・近席加点。
- `matchRules`: ペア理由文の素材。
- `thirdPersonEffects`: 3人以上の卓での補完説明。
- `gives` / `receives`: テーブル理由文の素材。

### `src/data/teamCompatibility.ts`

確認結果:

- 11タイプ全55ペアの相性データがある。
- `tier` は `best` / `good` / `bridge`。
- `dynamic` は短い役割関係の説明。
- `teamNote` は2人合わせた総評。
- `thirdPerson` は3人目に足すといいタイプ。
- `getCompatibility` / `getPartnersByTier` / `getBestPartners` がある。

席順スコアに使える要素:

- `getCompatibility(a, b)` でペアスコアを作れる。
- `tier` を点数化できる。
- `thirdPerson` が同卓にいる場合に追加加点できる。
- `dynamic` / `teamNote` を理由文の素材にできる。

## API・DBへの影響

`SeatingParticipant` には、次版で以下を追加する必要がある。

- `mainTypeKey`
- `partnerTypeKey`
- `subForce`

Supabase participants row には、以下が保存済み。

- `main_type_key`
- `partner_type_key`
- `center_force`
- `result_summary`
- `joined_at`

そのため、DBスキーマを大きく変えなくても、role-aware seating に必要な情報は取得できる。

`icebreak_event_seatings.tables` の保存形は、初期段階では大きく変えなくてよい。

- 現在通り、生成後のテーブル配列を保存する。
- メンバーに `mainTypeKey` / `partnerTypeKey` / `reason` を含めるかは、host画面の表示要件に合わせて判断する。
- `algorithm_version` を `icebreak-seating-role-aware-v1` に変えることで、新旧ロジックの判別ができる。

既存host画面のレスポンス互換:

- `event`
- `participants`
- `seating`
- `seating.tables`

この形は維持できる。

## テーブル理由文の改善案

現在の理由文は `centerForce` の組み合わせ中心。role-aware版では、11役割と補完関係を「会話のきっかけ」として説明する。

文言候補:

- この卓は、行動する人と整える人が混ざる配置です。話したことが次の一歩に変わりやすいようにしています。
- この席は、発想を広げる人と形にする人が近くなるようにしています。アイデアを話すだけでなく、進め方まで見えやすい組み合わせです。
- この組み合わせは、お互いの眠っている力を引き出しやすい配置です。違う視点があることで、会話が広がりやすくなります。
- 同じ役割に偏らず、違う視点が会話に入るようにしています。
- この卓には、起点を作る人、受け止める人、整える人が入っています。初対面でも話が続きやすい構成です。
- この席は、近くの人の言葉を受けて、自分の動き方が見えやすくなるようにしています。

注意:

- 「相性が悪い」は使わない。
- 「弱点」は使わず、「眠っている力」「違う視点」「補いやすい」と表現する。
- 断定しすぎず、「会話のきっかけ」「話が広がりやすい」と表現する。

## 実装フェーズ案

Phase A: 設計docs作成

- このdocsを作成する。
- 現状の限界と改善方針を整理する。

Phase B: role matching helper 作成

- `src/lib/icebreakRoleMatching.ts` を作る。
- `getCompatibility` / `futurePartners` を使った `pairScore` を定義する。
- `centerForce` 補完スコアもここに寄せる。

Phase C: `generateIcebreakRoleAwareSeating` 作成

- `src/lib/icebreakSeating.ts` に新関数を追加する。
- 既存 `generateIcebreakSeating` は残す。
- テーブル候補ごとの `tableScore` と隣席候補の `pairScore` を使う。

Phase D: `POST /api/icebreak/seating` で新ロジック使用

- `main_type_key` / `partner_type_key` / `subForce` を席順用データに渡す。
- `algorithm_version` を `icebreak-seating-role-aware-v1` にする。
- レスポンス互換は維持する。

Phase E: host画面で理由文確認

- 既存host画面で席順・理由文が読みやすいか確認する。
- UI変更が必要な場合は別Phaseに分ける。

Phase F: 本番確認

- `/organizer` でイベント作成。
- participantUrlから複数人分を登録。
- hostUrlで席順生成。
- 再読み込み後も最新席順が残るか確認。
- 理由文がネガティブに見えないか確認。

## 未解決の設計課題

- `partnerTypeKey` を近席必須に近づけるか、同卓加点に留めるか。
- `teamCompatibility.bridge` をどのくらい加点するか。
- 3人目効果を、何人以上の卓から使うか。
- 少人数イベントでスコアが過剰に効きすぎないようにする方法。
- 同じ `centerForce` でも役割が補完する場合、減点をどこまで緩めるか。
- tableCapacityが2人、3人、4人以上のときで同じロジックにするか。
- 理由文に11役割名をどこまで出すか。
- `tables` JSONにスコア詳細を残すか、表示用理由だけ残すか。

## 今回まだやらないこと

- 実装修正
- API変更
- UI変更
- Supabase操作
- SQL実行
- 診断ロジック変更
- 設問変更
- 重み変更
- `centeredResult` 変更
- `generateIcebreakSeating` の置き換え
- `POST /api/icebreak/seating` の変更

## 推奨結論

現状の席順生成は、`centerForce` 分散としては十分に使える。ただし、レボリスト診断のマッチングとしては、11役割の相性・補完関係をまだ使えていない。

次の実装では、既存 `generateIcebreakSeating` を壊さず、`icebreakRoleMatching.ts` と `generateIcebreakRoleAwareSeating` を追加するのが安全。

最初のrole-aware版では、以下を優先する。

1. `centerForce` の偏りを抑える。
2. `mainTypeKey` の偏りを抑える。
3. `partnerTypeKey` / `futurePartners` を同卓・近席加点に使う。
4. `teamCompatibility` の `best` / `good` / `bridge` をスコア化する。
5. `joinedAt` は最後の安定ソートとして残す。

この順番なら、既存の安定性を保ちながら、レボリスト診断らしい「会話が起き、補完が起き、次の行動が生まれる配置」に近づけられる。
