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
  oneLine: string;
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
    oneLine: "変わったおの活を思いつく人",
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
    oneLine: "里帰りや出会いのきっかけをつくる人",
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
    oneLine: "おのくんとの楽しみ方を広げる人",
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
    oneLine: "写真や飾り方で魅力を見せる人",
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
    oneLine: "里親さん同士の会話を生む人",
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
    oneLine: "東松島やおのくん情報を見つける人",
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
    oneLine: "誰かの一歩をやさしく後押しする人",
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
    oneLine: "ものと想いを丁寧に育てる人",
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
    oneLine: "おのくんの想いを伝わる言葉にする人",
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
    oneLine: "里帰りや集まりを動きやすく整える人",
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
    oneLine: "安心と家族感を育てる人",
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

