import type { RevoTypeKey } from "@/data/revotypes";

export type OnokunSatooyaTypeKey =
  | "mendokushe-breakthrough"
  | "tadaima-starter"
  | "wakuwaku-future"
  | "uchinoko-world"
  | "goen-talk"
  | "town-finder"
  | "back-pat"
  | "chikuchiku-care"
  | "word-tuner"
  | "outing-arranger"
  | "warm-watch";

export type OnokunSatooyaClusterKey = "create" | "tell" | "move" | "grow";

export interface OnokunSatooyaCluster {
  key: OnokunSatooyaClusterKey;
  name: string;
  description: string;
}

export interface OnokunSatooyaType {
  key: OnokunSatooyaTypeKey;
  name: string;
  originalRole: string;
  revoTypeKey: RevoTypeKey;
  oneLine: string;
  funnyTitle: string;
  shareCatch: string;
  parentBakaLine: string;
  nodLines: string[];
  salonPostLine: string;
  clusterKey: OnokunSatooyaClusterKey;
  shortDescription: string;
  broughtBond: string;
  partnerTypeKey: OnokunSatooyaTypeKey;
  mission: string;
  conversationStarter: string;
  colorClass: string;
}

export const onokunSatooyaClusters: Record<
  OnokunSatooyaClusterKey,
  OnokunSatooyaCluster
> = {
  create: {
    key: "create",
    name: "ご縁を生み出す里親さん",
    description: "新しい楽しみ方や、会いたくなるきっかけをふわっと生み出す人。",
  },
  tell: {
    key: "tell",
    name: "ご縁を伝える里親さん",
    description: "おのくんや東松島の魅力を、言葉や発見として届ける人。",
  },
  move: {
    key: "move",
    name: "ご縁を動かす里親さん",
    description: "手を動かしたり、背中を押したり、集まりを形にしていく人。",
  },
  grow: {
    key: "grow",
    name: "ご縁を育てる里親さん",
    description: "会話や安心感を通して、ご縁を長くあたためていく人。",
  },
};

export const onokunSatooyaTypes: OnokunSatooyaType[] = [
  {
    key: "mendokushe-breakthrough",
    name: "めんどくしぇ突破里親",
    originalRole: "クレイジスト",
    revoTypeKey: "crazist",
    oneLine: "変わったおの活を思いつく人",
    funnyTitle: "思いついた瞬間、うちの子が先に準備してるタイプ",
    shareCatch: "普通のおの活では終わらない、めんどくしぇ突破里親でした。",
    parentBakaLine: "気づいたら「これ、おのくんでやったら面白くない？」が口ぐせになりがち。",
    nodLines: [
      "ちゃんとしている写真より、ちょっと変な写真のほうが好き。",
      "誰かに説明する前に、自分で笑っていることがある。",
      "うちの子を見ると、なぜか小道具を足したくなる。",
    ],
    salonPostLine: "今日のうちの子、ちょっと変なことしてます。見て。",
    clusterKey: "create",
    shortDescription:
      "思いついたら、まず笑って試してみる。小さな遊び心から、おのくんとの新しいご縁を生み出す里親さんです。",
    broughtBond: "「そんな楽しみ方もあるんだ」と周りが笑顔になる、ご縁の入口。",
    partnerTypeKey: "outing-arranger",
    mission: "うちの子に、いつもと少し違う場所や小物を合わせて写真を1枚撮ってみる。",
    conversationStarter: "最近、うちの子でちょっと変わったことしてみた？",
    colorClass: "bg-[#F7D35B]",
  },
  {
    key: "tadaima-starter",
    name: "ただいま火つけ里親",
    originalRole: "レボリスト",
    revoTypeKey: "revolist",
    oneLine: "里帰りや出会いのきっかけをつくる人",
    funnyTitle: "「行きたいね」がいつの間にか予定になってるタイプ",
    shareCatch: "里帰り欲に火がつく、ただいま火つけ里親でした。",
    parentBakaLine: "うちの子を見ていると、なぜか誰かを誘いたくなる。",
    nodLines: [
      "「いつか行きたい」が、頭の中ではもう半分予定になっている。",
      "楽しそうな話を聞くと、すぐ誰かの顔が浮かぶ。",
      "うちの子をきっかけに、会いに行く理由が増える。",
    ],
    salonPostLine: "うちの子といつか里帰りしたい。誰か一緒に妄想して。",
    clusterKey: "create",
    shortDescription:
      "会いに行きたい気持ちや、誰かを誘いたい気持ちに火をともす里親さんです。",
    broughtBond: "「今度、一緒に行ってみようかな」と思える、里帰りのきっかけ。",
    partnerTypeKey: "warm-watch",
    mission: "行ってみたい場所や会ってみたい人を、ひとつメモしてみる。",
    conversationStarter: "おのくんと一緒に、また行きたい場所ってある？",
    colorClass: "bg-[#F06F8F]",
  },
  {
    key: "wakuwaku-future",
    name: "わくわく未来図里親",
    originalRole: "マックスデザイナー",
    revoTypeKey: "maxdesigner",
    oneLine: "おのくんとの楽しみ方を広げる人",
    funnyTitle: "うちの子の未来予定表だけ、やたら壮大なタイプ",
    shareCatch: "おの活の未来が勝手に広がる、わくわく未来図里親でした。",
    parentBakaLine: "まだやってないのに、もう楽しい。予定を考えるだけで親バカが加速します。",
    nodLines: [
      "ひとつ思いつくと、次の企画まで勝手に浮かぶ。",
      "できるかどうかより、まず楽しそうかで考える。",
      "うちの子の予定だけ、なぜか未来が明るい。",
    ],
    salonPostLine: "うちの子とこれやってみたいんだけど、どう思う？",
    clusterKey: "create",
    shortDescription:
      "これからやってみたいことを想像して、うちの子との未来を少しずつ広げる里親さんです。",
    broughtBond: "いつものおの活の先にある、新しい楽しみの予感。",
    partnerTypeKey: "word-tuner",
    mission: "うちの子と今年やってみたいことを、3つ書いてみる。",
    conversationStarter: "うちの子と、次にどんなことしてみたい？",
    colorClass: "bg-[#79B7E8]",
  },
  {
    key: "uchinoko-world",
    name: "うちの子世界観里親",
    originalRole: "イメージマイスター",
    revoTypeKey: "imagemaister",
    oneLine: "写真や飾り方で魅力を見せる人",
    funnyTitle: "うちの子の専属カメラマン兼世界観監督タイプ",
    shareCatch: "写真一枚に愛がにじむ、うちの子世界観里親でした。",
    parentBakaLine: "背景、角度、光。うちの子が一番かわいく見える場所をつい探してしまう。",
    nodLines: [
      "写真を撮る前に、背景をちょっと整えたくなる。",
      "同じおのくんなのに、今日の表情が違って見える。",
      "うちの子のかわいさは、角度でさらに増すと思っている。",
    ],
    salonPostLine: "今日のうちの子、世界観ちょっと仕上がりました。",
    clusterKey: "create",
    shortDescription:
      "写真、飾り方、背景づくりで、うちの子らしさをぱっと伝える里親さんです。",
    broughtBond: "見た人が思わず話しかけたくなる、うちの子の世界観。",
    partnerTypeKey: "goen-talk",
    mission: "うちの子の定位置を少し整えて、今日の1枚を撮ってみる。",
    conversationStarter: "うちの子の写真、どんな雰囲気で撮るのが好き？",
    colorClass: "bg-[#164F9E]",
  },
  {
    key: "goen-talk",
    name: "ご縁おしゃべり里親",
    originalRole: "コミュニケーター",
    revoTypeKey: "communicator",
    oneLine: "里親さん同士の会話を生む人",
    funnyTitle: "気づいたらコメント欄をあたためているタイプ",
    shareCatch: "うちの子から会話が広がる、ご縁おしゃべり里親でした。",
    parentBakaLine: "かわいいと思ったら黙っていられない。ひとことが誰かの投稿を明るくします。",
    nodLines: [
      "かわいい投稿を見ると、反応せずにはいられない。",
      "初めましてでも、うちの子の話なら少し話しやすい。",
      "誰かの親バカ話を聞くのがけっこう好き。",
    ],
    salonPostLine: "みんなのうちの子エピソード、聞かせてください。",
    clusterKey: "grow",
    shortDescription:
      "何気ないひとことから、里親さん同士の距離をやわらかく近づける里親さんです。",
    broughtBond: "初めましての人とも、うちの子の話から始まるあたたかい会話。",
    partnerTypeKey: "town-finder",
    mission: "おのくんの話をできる人に、最近のうちの子エピソードをひとつ送ってみる。",
    conversationStarter: "うちの子を迎えたときのこと、覚えてる？",
    colorClass: "bg-[#F6A04D]",
  },
  {
    key: "town-finder",
    name: "まちの発見里親",
    originalRole: "インフォレイダー",
    revoTypeKey: "inforader",
    oneLine: "東松島やおのくん情報を見つける人",
    funnyTitle: "気になると調べ始めて、気づけば案内係タイプ",
    shareCatch: "おのくん情報を見つけて広げる、まちの発見里親でした。",
    parentBakaLine: "小さな情報を見つけると、誰かの里帰りスイッチまで押したくなる。",
    nodLines: [
      "気になる場所や話題は、とりあえず保存しておく。",
      "あとで誰かの役に立ちそうな情報に弱い。",
      "おのくんの背景を知るほど、もっと伝えたくなる。",
    ],
    salonPostLine: "おのくん・東松島の気になる話題、見つけました。",
    clusterKey: "tell",
    shortDescription:
      "小さな情報や場所の魅力を見つけて、誰かの行きたい気持ちにつなげる里親さんです。",
    broughtBond: "東松島やおのくんの世界を、少し身近に感じられる発見。",
    partnerTypeKey: "tadaima-starter",
    mission: "東松島やおのくんにまつわる気になる情報を、ひとつ保存しておく。",
    conversationStarter: "最近見つけた、おのくんや東松島の話題ある？",
    colorClass: "bg-[#79B7E8]",
  },
  {
    key: "back-pat",
    name: "背中ぽんぽん里親",
    originalRole: "ムーブメンター",
    revoTypeKey: "movmentor",
    oneLine: "誰かの一歩をやさしく後押しする人",
    funnyTitle: "背中を押す力が、だいたい綿くらいやさしいタイプ",
    shareCatch: "そっと一歩を応援する、背中ぽんぽん里親でした。",
    parentBakaLine: "強く誘わない。でも「いいね、やってみよ」が自然に言える。",
    nodLines: [
      "誰かが迷っていると、つい安心する言葉を探す。",
      "誘うときは、強めよりゆるめが好き。",
      "一歩踏み出した人を見ると、自分まで嬉しくなる。",
    ],
    salonPostLine: "初めてでも大丈夫。うちの子と一緒にゆるく始めよう。",
    clusterKey: "move",
    shortDescription:
      "迷っている人に、そっと一歩を踏み出すきっかけを渡せる里親さんです。",
    broughtBond: "「それなら行ってみようかな」と思える、やさしい後押し。",
    partnerTypeKey: "mendokushe-breakthrough",
    mission: "おのくんを気にしている人に、まずは写真を1枚見せてみる。",
    conversationStarter: "もし里帰りするなら、最初はどんな感じがよさそう？",
    colorClass: "bg-[#F06F8F]",
  },
  {
    key: "chikuchiku-care",
    name: "ちくちく愛情里親",
    originalRole: "プルミエルクラフター",
    revoTypeKey: "premiercrafter",
    oneLine: "ものと想いを丁寧に育てる人",
    funnyTitle: "うちの子の居場所メンテが愛情表現タイプ",
    shareCatch: "ちくちく愛情を育てる、ちくちく愛情里親でした。",
    parentBakaLine: "ちょっと整える、ちょっと直す。その小さな手間に愛が出ます。",
    nodLines: [
      "うちの子の定位置がしっくりくると、ちょっと嬉しい。",
      "小さなほつれや汚れに、わりと早く気づく。",
      "大切にしている時間そのものが、もう楽しい。",
    ],
    salonPostLine: "うちの子のここ、密かにお気に入りです。",
    clusterKey: "move",
    shortDescription:
      "手をかける時間そのものを楽しみながら、うちの子への愛情を育てる里親さんです。",
    broughtBond: "ものを大切にする気持ちが伝わる、あたたかい手ざわりのご縁。",
    partnerTypeKey: "uchinoko-world",
    mission: "うちの子の身の回りをひとつ整えて、いつもの居場所をあたためる。",
    conversationStarter: "うちの子のここ、気に入ってるんだよねって場所ある？",
    colorClass: "bg-[#F7D35B]",
  },
  {
    key: "word-tuner",
    name: "ことば整え里親",
    originalRole: "ロジカルマイスター",
    revoTypeKey: "logicalmaister",
    oneLine: "おのくんの想いを伝わる言葉にする人",
    funnyTitle: "うちの子紹介文を、つい名文にしたくなるタイプ",
    shareCatch: "好きがちゃんと言葉になる、ことば整え里親でした。",
    parentBakaLine: "かわいいだけじゃ足りない。この良さをどう伝えるか考えてしまう。",
    nodLines: [
      "ただ『かわいい』だけでは、うちの子の良さを言い切れない。",
      "紹介文を考え始めると、ちょっと本気になる。",
      "気持ちがぴったり言葉になった瞬間が好き。",
    ],
    salonPostLine: "うちの子を一言で言うと、たぶんこれです。",
    clusterKey: "tell",
    shortDescription:
      "感じていることを言葉に整えて、誰かに届きやすくしてくれる里親さんです。",
    broughtBond: "大切な想いが、すっと伝わる言葉になって広がるご縁。",
    partnerTypeKey: "wakuwaku-future",
    mission: "うちの子の好きなところを、短い紹介文にしてみる。",
    conversationStarter: "うちの子をひとことで紹介するなら、なんて言う？",
    colorClass: "bg-[#164F9E]",
  },
  {
    key: "outing-arranger",
    name: "おでかけ段取り里親",
    originalRole: "アレンジャー",
    revoTypeKey: "arranger",
    oneLine: "里帰りや集まりを動きやすく整える人",
    funnyTitle: "集合時間と持ち物を見ると安心するタイプ",
    shareCatch: "おでかけをご縁に変える、おでかけ段取り里親でした。",
    parentBakaLine: "楽しい予定ほど、ちょっと整えておきたい。みんなが動きやすいと嬉しい。",
    nodLines: [
      "集合場所と時間が決まると、急に安心する。",
      "楽しいことほど、段取りがあるともっと楽しめる。",
      "誰かが迷わず動けると、内心かなり嬉しい。",
    ],
    salonPostLine: "行くならこの流れがよさそう。誰か一緒にどうですか？",
    clusterKey: "move",
    shortDescription:
      "行き先、時間、持ち物をほどよく整えて、みんなが動きやすい形をつくる里親さんです。",
    broughtBond: "集まりたい気持ちが、ちゃんと実現に近づいていく安心感。",
    partnerTypeKey: "back-pat",
    mission: "うちの子との小さなおでかけプランを、時間つきで考えてみる。",
    conversationStarter: "一緒に行くなら、どんな段取りだと動きやすい？",
    colorClass: "bg-[#F6A04D]",
  },
  {
    key: "warm-watch",
    name: "ぬくもり見守り里親",
    originalRole: "ソウルオーナー",
    revoTypeKey: "soulowner",
    oneLine: "安心と家族感を育てる人",
    funnyTitle: "うちの子がいるだけで、家の空気が丸くなるタイプ",
    shareCatch: "ぬくもりでご縁を育てる、ぬくもり見守り里親でした。",
    parentBakaLine: "派手なことはしなくても、そばにいるだけで十分しあわせ。",
    nodLines: [
      "うちの子が視界に入るだけで、ちょっと気持ちがゆるむ。",
      "にぎやかに話すより、そっと見守る時間も好き。",
      "迎えてよかったな、と思う瞬間がふいに来る。",
    ],
    salonPostLine: "うちの子がいてよかったな、と思う瞬間があります。",
    clusterKey: "grow",
    shortDescription:
      "そばにいるだけで安心できる空気をつくり、うちの子との家族感を育てる里親さんです。",
    broughtBond: "帰ってこられる場所があるような、ほっとするご縁。",
    partnerTypeKey: "chikuchiku-care",
    mission: "うちの子との今日の小さなぬくもりを、写真か言葉で残してみる。",
    conversationStarter: "うちの子が家に来てから、変わったことってある？",
    colorClass: "bg-[#F06F8F]",
  },
];

export function getOnokunSatooyaType(key: OnokunSatooyaTypeKey) {
  return onokunSatooyaTypes.find((type) => type.key === key) ?? onokunSatooyaTypes[0];
}
