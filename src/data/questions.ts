import type { RevoTypeKey } from "./revotypes";

export interface Question {
  id: number;
  text: string;
  scores: Partial<Record<RevoTypeKey, number>>;
  choices?: Array<{
    value: number;
    label: string;
    scores: Partial<Record<RevoTypeKey, number>>;
  }>;
}

export const questions: Question[] = [
  {
    id: 1,
    text: "新しい企画の話が出たとき、最初に気になるのは？",
    scores: {},
    choices: [
      { value: 1, label: "それがどんな未来につながるか", scores: { revolist: 3, maxdesigner: 2 } },
      { value: 2, label: "誰が一緒に動けそうか", scores: { communicator: 3, movmentor: 2 } },
      { value: 3, label: "どんな順番なら進めやすいか", scores: { arranger: 3, logicalmaister: 2 } },
      { value: 4, label: "今ある情報で何が分かるか", scores: { inforader: 3, logicalmaister: 1 } },
      { value: 5, label: "みんなが話しやすい空気かどうか", scores: { soulowner: 3, communicator: 1 } },
    ],
  },
  {
    id: 2,
    text: "誰かが「まだうまく言えないけど、こういうことをやりたい」と話しています。自然にしたくなるのは？",
    scores: {},
    choices: [
      { value: 1, label: "その中にある未来の種を一緒に広げる", scores: { maxdesigner: 3, revolist: 2 } },
      { value: 2, label: "言葉にして、他の人にも伝わる形にする", scores: { logicalmaister: 3, inforader: 1 } },
      { value: 3, label: "まず小さく試せる一歩を考える", scores: { movmentor: 3, revolist: 1 } },
      { value: 4, label: "その人が安心して話せるように聞く", scores: { soulowner: 3, communicator: 1 } },
      { value: 5, label: "必要な人や情報をつなぐ", scores: { arranger: 3, communicator: 2 } },
    ],
  },
  {
    id: 3,
    text: "アイデアがたくさん出て、少し散らかってきました。あなたがやりたくなるのは？",
    scores: {},
    choices: [
      { value: 1, label: "もっと面白い可能性がないか広げる", scores: { maxdesigner: 3, crazist: 1 } },
      { value: 2, label: "似ている案をまとめて、伝わりやすくする", scores: { logicalmaister: 3, imagemaister: 1 } },
      { value: 3, label: "実際に試せる順番へ並べる", scores: { arranger: 3, movmentor: 1 } },
      { value: 4, label: "誰の持ち味がどこで活きるかを見る", scores: { arranger: 3, communicator: 2 } },
      { value: 5, label: "置いていかれている人がいないかを見る", scores: { soulowner: 3, communicator: 1 } },
    ],
  },
  {
    id: 4,
    text: "準備することが予定より増えてきました。近い動きは？",
    scores: {},
    choices: [
      { value: 1, label: "まず自分で巻き取って、なんとか形にする", scores: { revolist: 2, premiercrafter: 2 } },
      { value: 2, label: "できることと頼めることを分ける", scores: { logicalmaister: 2, arranger: 3 } },
      { value: 3, label: "得意そうな人に声をかけて、持ち寄れる形にする", scores: { arranger: 3, communicator: 2 } },
      { value: 4, label: "一度立ち止まって、無理なく続く形を考える", scores: { premiercrafter: 3, soulowner: 2 } },
      { value: 5, label: "みんなが疲れていないか様子を見る", scores: { soulowner: 3, movmentor: 1 } },
    ],
  },
  {
    id: 5,
    text: "会議で「いつものやり方でいこう」となりました。あなたの中で起きやすいことは？",
    scores: {},
    choices: [
      { value: 1, label: "別の前提から考える余地がないか見たくなる", scores: { crazist: 3, revolist: 1 } },
      { value: 2, label: "今の案を、もっと未来につながる形に広げたくなる", scores: { maxdesigner: 3, revolist: 1 } },
      { value: 3, label: "まず理由と条件を整理したくなる", scores: { inforader: 2, logicalmaister: 3 } },
      { value: 4, label: "進めるなら、役割と段取りを整えたくなる", scores: { arranger: 3, premiercrafter: 1 } },
      { value: 5, label: "みんなが納得して動ける空気かを見たくなる", scores: { soulowner: 2, communicator: 2 } },
    ],
  },
  {
    id: 6,
    text: "話が盛り上がったあと、次に必要だと感じるのは？",
    scores: {},
    choices: [
      { value: 1, label: "熱が冷めないうちに、まず動いてみること", scores: { revolist: 3, movmentor: 1 } },
      { value: 2, label: "人に伝わる言葉へ整理すること", scores: { logicalmaister: 3, inforader: 1 } },
      { value: 3, label: "どんな見せ方なら魅力が届くか考えること", scores: { imagemaister: 3, maxdesigner: 1 } },
      { value: 4, label: "続けられる品質や約束に整えること", scores: { premiercrafter: 3, arranger: 1 } },
      { value: 5, label: "話した人同士がまたつながれる入口を残すこと", scores: { communicator: 3, soulowner: 1 } },
    ],
  },
  {
    id: 7,
    text: "初対面の場で、少し静かな時間が流れました。自然に目がいくのは？",
    scores: {},
    choices: [
      { value: 1, label: "誰と誰が話すと面白そうか", scores: { communicator: 3, maxdesigner: 1 } },
      { value: 2, label: "最初の一言を置くタイミング", scores: { communicator: 2, revolist: 2 } },
      { value: 3, label: "安心して話せていない人がいないか", scores: { soulowner: 3, movmentor: 1 } },
      { value: 4, label: "話題が散らからないようにする流れ", scores: { arranger: 3, logicalmaister: 1 } },
      { value: 5, label: "場に新しい風が入る問い", scores: { crazist: 2, imagemaister: 2 } },
    ],
  },
  {
    id: 8,
    text: "何かを決める前に、あなたがあると助かるものは？",
    scores: {},
    choices: [
      { value: 1, label: "判断材料になる事実や背景", scores: { inforader: 3, logicalmaister: 1 } },
      { value: 2, label: "それぞれの人の本音や温度感", scores: { soulowner: 2, communicator: 2 } },
      { value: 3, label: "まず試せる小さな一歩", scores: { revolist: 2, movmentor: 2 } },
      { value: 4, label: "未来の選択肢が増える見立て", scores: { maxdesigner: 3, crazist: 1 } },
      { value: 5, label: "続けるための段取りや役割", scores: { arranger: 3, premiercrafter: 1 } },
    ],
  },
  {
    id: 9,
    text: "誰かが挑戦の前で少し止まっています。あなたが渡したくなるのは？",
    scores: {},
    choices: [
      { value: 1, label: "その人がすでに持っている良さを伝える", scores: { movmentor: 3, soulowner: 1 } },
      { value: 2, label: "最初の一歩にできる小さな行動", scores: { movmentor: 2, revolist: 2 } },
      { value: 3, label: "なぜ不安なのかを一緒にほどく時間", scores: { soulowner: 3, logicalmaister: 1 } },
      { value: 4, label: "必要な人や場所につながる入口", scores: { communicator: 3, arranger: 1 } },
      { value: 5, label: "挑戦がもっと面白くなる別の見方", scores: { maxdesigner: 2, crazist: 2 } },
    ],
  },
  {
    id: 10,
    text: "みんなで作ったものを外に出す直前です。あなたが気になるのは？",
    scores: {},
    choices: [
      { value: 1, label: "受け取る人にちゃんと届く品質になっているか", scores: { premiercrafter: 3, inforader: 1 } },
      { value: 2, label: "魅力が伝わる見え方になっているか", scores: { imagemaister: 3, premiercrafter: 1 } },
      { value: 3, label: "今すぐ出して反応を見られるか", scores: { revolist: 3, crazist: 1 } },
      { value: 4, label: "出した後も続けられる仕組みがあるか", scores: { premiercrafter: 2, logicalmaister: 2 } },
      { value: 5, label: "関わった人が誇れる形になっているか", scores: { soulowner: 2, movmentor: 2 } },
    ],
  },
  {
    id: 11,
    text: "良い内容なのに、まだ魅力が伝わっていないと感じます。最初に触りたくなるのは？",
    scores: {},
    choices: [
      { value: 1, label: "世界観や見え方を整える", scores: { imagemaister: 3, maxdesigner: 1 } },
      { value: 2, label: "一言で伝わる言葉へ磨く", scores: { logicalmaister: 2, imagemaister: 2 } },
      { value: 3, label: "誰に届くと意味が生まれるかを考える", scores: { communicator: 2, maxdesigner: 2 } },
      { value: 4, label: "まず試して、反応から見せ方を変える", scores: { revolist: 2, premiercrafter: 1 } },
      { value: 5, label: "なぜ伝わりにくいのか材料を集める", scores: { inforader: 3, logicalmaister: 1 } },
    ],
  },
  {
    id: 12,
    text: "場が止まっているとき、あなたが置きたくなるものは？",
    scores: {},
    choices: [
      { value: 1, label: "最初の小さな火種になる行動", scores: { revolist: 3, crazist: 1 } },
      { value: 2, label: "みんなが話し始められる問い", scores: { communicator: 2, imagemaister: 1 } },
      { value: 3, label: "状況を整理するための仮の地図", scores: { logicalmaister: 2, arranger: 2 } },
      { value: 4, label: "まだ試していない別の可能性", scores: { crazist: 2, maxdesigner: 2 } },
      { value: 5, label: "無理なく続けるための安心感", scores: { soulowner: 3, premiercrafter: 1 } },
    ],
  },
  {
    id: 13,
    text: "感覚的な話がたくさん出ています。あなたが自然にしていることは？",
    scores: {},
    choices: [
      { value: 1, label: "大事な言葉を拾って、見出しにする", scores: { imagemaister: 2, logicalmaister: 2 } },
      { value: 2, label: "話の順番や構造を頭の中で並べる", scores: { logicalmaister: 3, inforader: 1 } },
      { value: 3, label: "まだ言葉になっていない気配を受け止める", scores: { soulowner: 3, imagemaister: 1 } },
      { value: 4, label: "そこから広がる未来の絵を考える", scores: { maxdesigner: 3, revolist: 1 } },
      { value: 5, label: "誰がどこを担うと進むかを見る", scores: { arranger: 3, communicator: 1 } },
    ],
  },
  {
    id: 14,
    text: "ひとつの案を見たとき、あなたの頭に浮かびやすいのは？",
    scores: {},
    choices: [
      { value: 1, label: "別の見せ方や展開", scores: { maxdesigner: 3, imagemaister: 1 } },
      { value: 2, label: "実現するための順番", scores: { arranger: 2, movmentor: 1 } },
      { value: 3, label: "なぜその案が必要なのか", scores: { logicalmaister: 2, inforader: 2 } },
      { value: 4, label: "誰に届くと意味が生まれるか", scores: { communicator: 2, soulowner: 1 } },
      { value: 5, label: "もっと尖らせた別案", scores: { crazist: 3, maxdesigner: 1 } },
    ],
  },
  {
    id: 15,
    text: "誰かが普段より少し元気がなさそうです。あなたがしやすいことは？",
    scores: {},
    choices: [
      { value: 1, label: "無理に聞き出さず、話せる空気を置く", scores: { soulowner: 3, premiercrafter: 1 } },
      { value: 2, label: "その人が動きやすくなる一言を渡す", scores: { movmentor: 3, communicator: 1 } },
      { value: 3, label: "必要なら話せる相手につなぐ", scores: { communicator: 3, arranger: 1 } },
      { value: 4, label: "何が起きているのか静かに観察する", scores: { inforader: 2, soulowner: 2 } },
      { value: 5, label: "場の流れを少し変えて空気を軽くする", scores: { arranger: 2, imagemaister: 1 } },
    ],
  },
  {
    id: 16,
    text: "小さな違和感や情報を見つけたとき、近い動きは？",
    scores: {},
    choices: [
      { value: 1, label: "後で判断材料になりそうなので拾っておく", scores: { inforader: 3, premiercrafter: 1 } },
      { value: 2, label: "そこから新しい可能性がないか考える", scores: { crazist: 2, maxdesigner: 2 } },
      { value: 3, label: "誰に共有すると役に立つか考える", scores: { communicator: 2, arranger: 2 } },
      { value: 4, label: "分かりやすく整理してから出す", scores: { logicalmaister: 3, inforader: 1 } },
      { value: 5, label: "場が不安にならない伝え方を考える", scores: { soulowner: 2, imagemaister: 2 } },
    ],
  },
  {
    id: 17,
    text: "会場で、まだ話せていない人がいます。あなたが選びやすい動きは？",
    scores: {},
    choices: [
      { value: 1, label: "話しやすい人との入口を作る", scores: { communicator: 3, soulowner: 1 } },
      { value: 2, label: "その人の興味に合いそうな話題を探す", scores: { inforader: 1, communicator: 2 } },
      { value: 3, label: "少人数で自然に混ざれる流れを作る", scores: { arranger: 3, soulowner: 1 } },
      { value: 4, label: "その人の良さが出る問いを置く", scores: { movmentor: 2, imagemaister: 1 } },
      { value: 5, label: "無理に入れず、安心していられる距離を保つ", scores: { soulowner: 3, premiercrafter: 1 } },
    ],
  },
  {
    id: 18,
    text: "続けていきたい活動があります。あなたが大切にしたいのは？",
    scores: {},
    choices: [
      { value: 1, label: "小さくても信頼が積み上がること", scores: { premiercrafter: 3 } },
      { value: 2, label: "参加する人が安心して戻れること", scores: { soulowner: 2, premiercrafter: 2 } },
      { value: 3, label: "新しい人にも魅力が伝わること", scores: { imagemaister: 2, communicator: 2 } },
      { value: 4, label: "次の一歩が自然に生まれること", scores: { movmentor: 2, revolist: 1 } },
      { value: 5, label: "活動の意味が未来につながること", scores: { maxdesigner: 2, revolist: 2 } },
    ],
  },
  {
    id: 19,
    text: "同じ内容を伝えるなら、あなたが工夫したくなるのは？",
    scores: {},
    choices: [
      { value: 1, label: "空気感や世界観が伝わる見せ方", scores: { imagemaister: 3, maxdesigner: 1 } },
      { value: 2, label: "誰でも分かる順番と言葉", scores: { logicalmaister: 3, inforader: 1 } },
      { value: 3, label: "相手が話したくなる入口", scores: { communicator: 3, soulowner: 1 } },
      { value: 4, label: "まず触れてもらえる小さな形", scores: { revolist: 1, premiercrafter: 2 } },
      { value: 5, label: "新しい解釈が生まれる余白", scores: { crazist: 2, maxdesigner: 2 } },
    ],
  },
  {
    id: 20,
    text: "人・予定・役割が少しズレています。あなたが気になるのは？",
    scores: {},
    choices: [
      { value: 1, label: "誰が何を持っているか", scores: { arranger: 3, communicator: 1 } },
      { value: 2, label: "どこで流れが止まっているか", scores: { arranger: 2, logicalmaister: 2 } },
      { value: 3, label: "必要な情報が足りているか", scores: { inforader: 3, logicalmaister: 1 } },
      { value: 4, label: "誰かが無理していないか", scores: { soulowner: 3, premiercrafter: 1 } },
      { value: 5, label: "思い切って流れを変えられないか", scores: { crazist: 2, revolist: 2 } },
    ],
  },
  {
    id: 21,
    text: "今日の会話を次につなげるなら、あなたが残したいものは？",
    scores: {},
    choices: [
      { value: 1, label: "また話したくなる相手との入口", scores: { communicator: 3, soulowner: 1 } },
      { value: 2, label: "小さく始められる約束", scores: { revolist: 2, movmentor: 2 } },
      { value: 3, label: "話したことの見取り図", scores: { logicalmaister: 2, inforader: 2 } },
      { value: 4, label: "誰かに見せたくなる表現", scores: { imagemaister: 3, maxdesigner: 1 } },
      { value: 5, label: "続けても大丈夫と思える余韻", scores: { soulowner: 3, premiercrafter: 1 } },
    ],
  },
];
