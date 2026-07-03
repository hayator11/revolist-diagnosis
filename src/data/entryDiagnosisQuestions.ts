import type { RevoTypeKey } from "./revotypes";

export interface EntryDiagnosisQuestion {
  id: number;
  text: string;
  choices: Array<{
    value: number;
    label: string;
    scores: Partial<Record<RevoTypeKey, number>>;
  }>;
}

export const entryDiagnosisQuestions: EntryDiagnosisQuestion[] = [
  {
    id: 1,
    text: "友だちと『何かおもしろいことやろう』となりました。最初にあなたがしそうなのは？",
    choices: [
      { value: 1, label: "まだ誰も言ってない案をぽんっと出す", scores: { crazist: 3, maxdesigner: 1, revolist: 1 } },
      { value: 2, label: "その案がどんな未来につながるか広げる", scores: { maxdesigner: 3, revolist: 2 } },
      { value: 3, label: "みんなの案を整理して、進め方を見える化する", scores: { logicalmaister: 3, arranger: 2 } },
      { value: 4, label: "誰が何をやると楽しそうかを見つける", scores: { arranger: 3, communicator: 2 } },
      { value: 5, label: "まず全員が話しやすい空気をつくる", scores: { soulowner: 3, communicator: 2 } },
    ],
  },
  {
    id: 2,
    text: "イベント前日。準備がちょっとカオスです。あなたの手が伸びるのは？",
    choices: [
      { value: 1, label: "足りないものを見つけて、黙々と形にする", scores: { premiercrafter: 3, inforader: 1 } },
      { value: 2, label: "必要な人や物をつないで、流れを整える", scores: { arranger: 3, communicator: 1 } },
      { value: 3, label: "今できる一歩を決めて、とにかく動かす", scores: { revolist: 3, movmentor: 2 } },
      { value: 4, label: "見た目や伝わり方を整えて、わくわくを足す", scores: { imagemaister: 3, maxdesigner: 1 } },
      { value: 5, label: "みんなが疲れすぎていないかを気にする", scores: { soulowner: 3, premiercrafter: 1 } },
    ],
  },
  {
    id: 3,
    text: "誰かが『うまく言えないけど、これやりたい』と話しています。あなたは？",
    choices: [
      { value: 1, label: "その人の中にある熱を見つけて背中を押す", scores: { movmentor: 3, soulowner: 1 } },
      { value: 2, label: "言葉にして、他の人にも伝わる形にする", scores: { logicalmaister: 3, imagemaister: 1 } },
      { value: 3, label: "そこから広がる未来の絵を一緒に描く", scores: { maxdesigner: 3, revolist: 1 } },
      { value: 4, label: "必要そうな人や場所につなげる", scores: { communicator: 3, arranger: 2 } },
      { value: 5, label: "急かさず、安心して話せる時間をつくる", scores: { soulowner: 3, communicator: 1 } },
    ],
  },
  {
    id: 4,
    text: "いつものやり方で進みそうな場面。心の中で起きやすいのは？",
    choices: [
      { value: 1, label: "え、別ルートも見てみたくない？と思う", scores: { crazist: 3, maxdesigner: 1 } },
      { value: 2, label: "そのやり方の意味と条件を整理したくなる", scores: { logicalmaister: 3, inforader: 2 } },
      { value: 3, label: "進めるなら役割と段取りを整えたくなる", scores: { arranger: 3, premiercrafter: 1 } },
      { value: 4, label: "みんなが納得して動けるかを見たくなる", scores: { communicator: 2, soulowner: 2 } },
      { value: 5, label: "今の形を守りつつ、少しだけ未来へ伸ばしたい", scores: { premiercrafter: 2, maxdesigner: 2 } },
    ],
  },
  {
    id: 5,
    text: "初対面の場で、少し静かな時間が流れました。自然に見ているのは？",
    choices: [
      { value: 1, label: "誰と誰が話すと面白そうか", scores: { communicator: 3, arranger: 1 } },
      { value: 2, label: "場に新しい風が入る問いは何か", scores: { crazist: 2, imagemaister: 2 } },
      { value: 3, label: "話せていない人が安心していられるか", scores: { soulowner: 3, communicator: 1 } },
      { value: 4, label: "最初の一歩を誰が置くと動き出すか", scores: { movmentor: 3, revolist: 1 } },
      { value: 5, label: "この場の流れをどう整えると自然か", scores: { arranger: 3, logicalmaister: 1 } },
    ],
  },
  {
    id: 6,
    text: "みんなで出したアイデアが散らかってきました。あなたの出番は？",
    choices: [
      { value: 1, label: "似ている案をまとめて、道筋をつくる", scores: { logicalmaister: 3, arranger: 1 } },
      { value: 2, label: "もっと面白くなる方向へ広げる", scores: { maxdesigner: 3, crazist: 1 } },
      { value: 3, label: "使える情報や材料を集めて判断しやすくする", scores: { inforader: 3, logicalmaister: 1 } },
      { value: 4, label: "まず小さく試せる形に落とす", scores: { revolist: 2, premiercrafter: 2 } },
      { value: 5, label: "誰の持ち味がどこで活きるかを見る", scores: { arranger: 2, communicator: 2 } },
    ],
  },
  {
    id: 7,
    text: "誰かが挑戦の前で少し止まっています。あなたが渡したくなるものは？",
    choices: [
      { value: 1, label: "その人の良さを、本人に返す言葉", scores: { movmentor: 3, soulowner: 1 } },
      { value: 2, label: "最初の一歩にできる小さな行動", scores: { revolist: 2, movmentor: 2 } },
      { value: 3, label: "不安の正体を一緒にほどく時間", scores: { soulowner: 3, logicalmaister: 1 } },
      { value: 4, label: "挑戦が楽しく見える別の角度", scores: { maxdesigner: 2, crazist: 2 } },
      { value: 5, label: "必要な情報や先に試した人の話", scores: { inforader: 3, communicator: 1 } },
    ],
  },
  {
    id: 8,
    text: "完成間近のものを外に出す直前。あなたが最後に見たいのは？",
    choices: [
      { value: 1, label: "受け取る人にちゃんと届く品質か", scores: { premiercrafter: 3, inforader: 1 } },
      { value: 2, label: "魅力が一瞬で伝わる見え方か", scores: { imagemaister: 3, maxdesigner: 1 } },
      { value: 3, label: "出した後も続く仕組みがあるか", scores: { premiercrafter: 2, logicalmaister: 2 } },
      { value: 4, label: "今すぐ出して反応を見られるか", scores: { revolist: 3, crazist: 1 } },
      { value: 5, label: "関わった人が誇れる形になっているか", scores: { soulowner: 2, movmentor: 2 } },
    ],
  },
  {
    id: 9,
    text: "旅行の計画を立てるなら、あなたが楽しくなりやすい担当は？",
    choices: [
      { value: 1, label: "まだ誰も知らない面白スポットを掘る", scores: { crazist: 2, inforader: 2 } },
      { value: 2, label: "全体のルートを無理なく組む", scores: { arranger: 3, logicalmaister: 1 } },
      { value: 3, label: "写真を撮りたくなる世界観を考える", scores: { imagemaister: 3, maxdesigner: 1 } },
      { value: 4, label: "みんなが楽しめる余白を残す", scores: { communicator: 2, soulowner: 2 } },
      { value: 5, label: "当日テンションが上がる一発目を決める", scores: { revolist: 2, movmentor: 2 } },
    ],
  },
  {
    id: 10,
    text: "あなたが『このチーム、いいな』と感じる瞬間に近いのは？",
    choices: [
      { value: 1, label: "変な案も笑って出せるとき", scores: { crazist: 3, communicator: 1 } },
      { value: 2, label: "誰かの想いが形になっていくとき", scores: { revolist: 2, premiercrafter: 2 } },
      { value: 3, label: "違う強みが自然にかみ合うとき", scores: { arranger: 2, maxdesigner: 1, communicator: 1 } },
      { value: 4, label: "安心して戻れる空気があるとき", scores: { soulowner: 3, premiercrafter: 1 } },
      { value: 5, label: "考えが整理され、次の一手が見えるとき", scores: { logicalmaister: 3, inforader: 1 } },
    ],
  },
  {
    id: 11,
    text: "最後に直感で。あなたが人に渡していることが多いのは？",
    choices: [
      { value: 1, label: "未来が見える感じ", scores: { maxdesigner: 3, revolist: 1 } },
      { value: 2, label: "やってみようと思える勢い", scores: { revolist: 3, movmentor: 2 } },
      { value: 3, label: "ごちゃっとしたものが整う感じ", scores: { logicalmaister: 2, arranger: 2 } },
      { value: 4, label: "人と人がつながるきっかけ", scores: { communicator: 3, arranger: 1 } },
      { value: 5, label: "安心して本音を出せる空気", scores: { soulowner: 3, imagemaister: 1 } },
    ],
  },
];
