import type { RevoTypeKey } from "./revotypes";
import type { ForceKey } from "@/lib/diagnosisCore/forces";
import type {
  AxisQuestionWeight,
  MultiAxisQuestion,
  MultiAxisQuestionChoice,
  RawAnswerValue,
} from "@/lib/diagnosisCore/multiAxis";

export interface IcebreakQuestion extends MultiAxisQuestion {
  id: string;
  text: string;
  role: RevoTypeKey;
  force: ForceKey;
  weights: AxisQuestionWeight[];
  choices: MultiAxisQuestionChoice[];
}

type ChoiceInput = [
  label: string,
  weights: AxisQuestionWeight[],
  roleWeights?: MultiAxisQuestionChoice["roleWeights"],
  forceWeights?: MultiAxisQuestionChoice["forceWeights"],
];

function choices(items: ChoiceInput[]): MultiAxisQuestionChoice[] {
  return items.map(([label, weights, roleWeights, forceWeights], index) => ({
    value: (index + 1) as RawAnswerValue,
    label,
    weights,
    roleWeights,
    forceWeights,
  }));
}

export const icebreakQuestions: IcebreakQuestion[] = [
  {
    id: "ice33_q01",
    role: "revolist",
    force: "ignite",
    text: "新しい企画の話が出たとき、最初に気になるのは？",
    weights: [],
    choices: choices([
      ["それがどんな未来につながるか", [
        { axis: "noveltyDrive", weight: 1 },
        { axis: "executionDrive", weight: 0.75 },
        { axis: "publicVisibility", weight: 0.35 },
      ]],
      ["誰が一緒に動けそうか", [
        { axis: "socialBridge", weight: 0.9 },
        { axis: "encouragement", weight: 0.55 },
      ]],
      ["どんな順番なら進めやすいか", [
        { axis: "coordination", weight: 0.85 },
        { axis: "systemizing", weight: 0.55 },
      ]],
      ["今ある情報で何が分かるか", [
        { axis: "evidenceSeeking", weight: 0.9 },
        { axis: "systemizing", weight: 0.35 },
      ]],
      ["みんなが話しやすい空気かどうか", [
        { axis: "psychologicalSafety", weight: 0.9 },
        { axis: "socialBridge", weight: 0.45 },
      ]],
    ]),
  },
  {
    id: "ice33_q02",
    role: "maxdesigner",
    force: "design",
    text: "誰かが「まだうまく言えないけど、こういうことをやりたい」と話しています。自然にしたくなるのは？",
    weights: [],
    choices: choices([
      ["その中にある未来の種を一緒に広げる", [
        { axis: "possibilityDesign", weight: 1 },
        { axis: "noveltyDrive", weight: 0.55 },
      ]],
      ["言葉にして、他の人にも伝わる形にする", [
        { axis: "systemizing", weight: 0.8 },
        { axis: "expressionDrive", weight: 0.75 },
      ]],
      ["まず小さく試せる一歩を考える", [
        { axis: "executionDrive", weight: 0.75 },
        { axis: "encouragement", weight: 0.6 },
      ]],
      ["その人が安心して話せるように聞く", [
        { axis: "psychologicalSafety", weight: 1 },
        { axis: "encouragement", weight: 0.45 },
      ]],
      ["必要な人や情報をつなぐ", [
        { axis: "coordination", weight: 0.8 },
        { axis: "socialBridge", weight: 0.7 },
      ]],
    ]),
  },
  {
    id: "ice33_q03",
    role: "arranger",
    force: "connect",
    text: "アイデアがたくさん出て、少し散らかってきました。あなたがやりたくなるのは？",
    weights: [],
    choices: choices([
      ["もっと面白い可能性がないか広げる", [
        { axis: "possibilityDesign", weight: 0.85 },
        { axis: "noveltyDrive", weight: 0.55 },
      ]],
      ["似ている案をまとめて、伝わりやすくする", [
        { axis: "systemizing", weight: 0.85 },
        { axis: "expressionDrive", weight: 0.55 },
      ]],
      ["実際に試せる順番へ並べる", [
        { axis: "coordination", weight: 0.9 },
        { axis: "executionDrive", weight: 0.45 },
      ]],
      ["誰の持ち味がどこで活きるかを見る", [
        { axis: "coordination", weight: 0.75 },
        { axis: "socialBridge", weight: 0.65 },
      ]],
      ["置いていかれている人がいないかを見る", [
        { axis: "psychologicalSafety", weight: 0.85 },
        { axis: "socialBridge", weight: 0.45 },
      ]],
    ]),
  },
  {
    id: "ice33_q04",
    role: "soulowner",
    force: "care",
    text: "イベント準備で、予定よりやることが増えてきました。近い動きは？",
    weights: [],
    choices: choices([
      ["まず自分で巻き取って、なんとか形にする", [
        { axis: "executionDrive", weight: 0.8 },
        { axis: "maintenanceDrive", weight: 0.45 },
      ]],
      ["できることと頼めることを分ける", [
        { axis: "systemizing", weight: 0.75 },
        { axis: "coordination", weight: 0.55 },
      ]],
      ["得意そうな人に声をかけて、持ち寄れる形にする", [
        { axis: "coordination", weight: 0.85 },
        { axis: "socialBridge", weight: 0.7 },
      ]],
      ["一度立ち止まって、無理なく続く形を考える", [
        { axis: "maintenanceDrive", weight: 0.8 },
        { axis: "psychologicalSafety", weight: 0.55 },
      ]],
      ["みんなが疲れていないか様子を見る", [
        { axis: "psychologicalSafety", weight: 0.95 },
        { axis: "encouragement", weight: 0.45 },
      ]],
    ]),
  },
  {
    id: "ice33_q05",
    role: "crazist",
    force: "ignite",
    text: "会議で「いつものやり方でいこう」となりました。あなたの中で起きやすいことは？",
    weights: [],
    choices: choices([
      ["別の前提から考える余地がないか見たくなる", [
        { axis: "nonconformity", weight: 1 },
        { axis: "noveltyDrive", weight: 0.75 },
      ]],
      ["今の案を、もっと未来につながる形に広げたくなる", [
        { axis: "possibilityDesign", weight: 0.9 },
        { axis: "noveltyDrive", weight: 0.45 },
      ]],
      ["まず理由と条件を整理したくなる", [
        { axis: "evidenceSeeking", weight: 0.85 },
        { axis: "systemizing", weight: 0.55 },
      ]],
      ["進めるなら、役割と段取りを整えたくなる", [
        { axis: "coordination", weight: 0.85 },
        { axis: "maintenanceDrive", weight: 0.35 },
      ]],
      ["みんなが納得して動ける空気かを見たくなる", [
        { axis: "psychologicalSafety", weight: 0.75 },
        { axis: "socialBridge", weight: 0.55 },
      ]],
    ]),
  },
  {
    id: "ice33_q06",
    role: "logicalmaister",
    force: "structure",
    text: "話が盛り上がったあと、次に必要だと感じるのは？",
    weights: [],
    choices: choices([
      ["熱が冷めないうちに、まず動いてみること", [
        { axis: "executionDrive", weight: 0.85 },
        { axis: "uncertaintyTolerance", weight: 0.5 },
      ]],
      ["人に伝わる言葉へ整理すること", [
        { axis: "systemizing", weight: 0.85 },
        { axis: "expressionDrive", weight: 0.75 },
      ]],
      ["どんな見せ方なら魅力が届くか考えること", [
        { axis: "expressionDrive", weight: 0.9 },
        { axis: "possibilityDesign", weight: 0.45 },
      ]],
      ["続けられる品質や約束に整えること", [
        { axis: "craftQuality", weight: 0.85 },
        { axis: "maintenanceDrive", weight: 0.55 },
      ]],
      ["話した人同士がまたつながれる入口を残すこと", [
        { axis: "socialBridge", weight: 0.75 },
        { axis: "psychologicalSafety", weight: 0.45 },
      ]],
    ]),
  },
  {
    id: "ice33_q07",
    role: "communicator",
    force: "connect",
    text: "初対面の場で、少し静かな時間が流れました。自然に目がいくのは？",
    weights: [],
    choices: choices([
      ["誰と誰が話すと面白そうか", [
        { axis: "socialBridge", weight: 0.95 },
        { axis: "possibilityDesign", weight: 0.35 },
      ]],
      ["最初の一言を置くタイミング", [
        { axis: "socialBridge", weight: 0.75 },
        { axis: "publicVisibility", weight: 0.45 },
      ]],
      ["安心して話せていない人がいないか", [
        { axis: "psychologicalSafety", weight: 0.9 },
        { axis: "encouragement", weight: 0.35 },
      ]],
      ["話題が散らからないようにする流れ", [
        { axis: "coordination", weight: 0.75 },
        { axis: "systemizing", weight: 0.35 },
      ]],
      ["場に新しい風が入る問い", [
        { axis: "noveltyDrive", weight: 0.65 },
        { axis: "expressionDrive", weight: 0.45 },
      ]],
    ]),
  },
  {
    id: "ice33_q08",
    role: "inforader",
    force: "structure",
    text: "何かを決める前に、あなたがあると助かるものは？",
    weights: [],
    choices: choices([
      ["判断材料になる事実や背景", [
        { axis: "evidenceSeeking", weight: 1 },
        { axis: "systemizing", weight: 0.45 },
      ]],
      ["それぞれの人の本音や温度感", [
        { axis: "psychologicalSafety", weight: 0.7 },
        { axis: "socialBridge", weight: 0.55 },
      ]],
      ["まず試せる小さな一歩", [
        { axis: "executionDrive", weight: 0.8 },
        { axis: "uncertaintyTolerance", weight: 0.45 },
      ]],
      ["未来の選択肢が増える見立て", [
        { axis: "possibilityDesign", weight: 0.9 },
        { axis: "noveltyDrive", weight: 0.4 },
      ]],
      ["続けるための段取りや役割", [
        { axis: "coordination", weight: 0.8 },
        { axis: "maintenanceDrive", weight: 0.5 },
      ]],
    ]),
  },
  {
    id: "ice33_q09",
    role: "movmentor",
    force: "care",
    text: "誰かが挑戦の前で少し止まっています。あなたが渡したくなるのは？",
    weights: [],
    choices: choices([
      ["その人がすでに持っている良さを伝える", [
        { axis: "encouragement", weight: 0.95 },
        { axis: "psychologicalSafety", weight: 0.45 },
      ]],
      ["最初の一歩にできる小さな行動", [
        { axis: "executionDrive", weight: 0.75 },
        { axis: "encouragement", weight: 0.65 },
      ]],
      ["なぜ不安なのかを一緒にほどく時間", [
        { axis: "psychologicalSafety", weight: 0.85 },
        { axis: "systemizing", weight: 0.3 },
      ]],
      ["必要な人や場所につながる入口", [
        { axis: "socialBridge", weight: 0.8 },
        { axis: "coordination", weight: 0.45 },
      ]],
      ["挑戦がもっと面白くなる別の見方", [
        { axis: "possibilityDesign", weight: 0.75 },
        { axis: "noveltyDrive", weight: 0.45 },
      ]],
    ]),
  },
  {
    id: "ice33_q10",
    role: "premiercrafter",
    force: "care",
    text: "みんなで作ったものを外に出す直前です。あなたが気になるのは？",
    weights: [],
    choices: choices([
      ["受け取る人にちゃんと届く品質になっているか", [
        { axis: "craftQuality", weight: 1 },
        { axis: "maintenanceDrive", weight: 0.5 },
      ]],
      ["魅力が伝わる見え方になっているか", [
        { axis: "expressionDrive", weight: 0.85 },
        { axis: "craftQuality", weight: 0.45 },
      ]],
      ["今すぐ出して反応を見られるか", [
        { axis: "executionDrive", weight: 0.8 },
        { axis: "uncertaintyTolerance", weight: 0.45 },
      ]],
      ["出した後も続けられる仕組みがあるか", [
        { axis: "maintenanceDrive", weight: 0.9 },
        { axis: "systemizing", weight: 0.45 },
      ]],
      ["関わった人が誇れる形になっているか", [
        { axis: "psychologicalSafety", weight: 0.65 },
        { axis: "encouragement", weight: 0.45 },
      ]],
    ]),
  },
  {
    id: "ice33_q11",
    role: "imagemaister",
    force: "design",
    text: "良い内容なのに、まだ魅力が伝わっていないと感じます。最初に触りたくなるのは？",
    weights: [],
    choices: choices([
      ["世界観や見え方を整える", [
        { axis: "expressionDrive", weight: 1 },
        { axis: "craftQuality", weight: 0.45 },
      ]],
      ["一言で伝わる言葉へ磨く", [
        { axis: "expressionDrive", weight: 0.8 },
        { axis: "systemizing", weight: 0.55 },
      ]],
      ["誰に届くと動き出すかを考える", [
        { axis: "socialBridge", weight: 0.65 },
        { axis: "possibilityDesign", weight: 0.55 },
      ]],
      ["まず試して、反応から見せ方を変える", [
        { axis: "executionDrive", weight: 0.65 },
        { axis: "uncertaintyTolerance", weight: 0.45 },
      ]],
      ["なぜ伝わりにくいのか材料を集める", [
        { axis: "evidenceSeeking", weight: 0.75 },
        { axis: "systemizing", weight: 0.4 },
      ]],
    ]),
  },
  {
    id: "ice33_q12",
    role: "revolist",
    force: "ignite",
    text: "場が止まっているとき、あなたが置きたくなるものは？",
    weights: [],
    choices: choices([
      ["最初の小さな火種になる行動", [
        { axis: "executionDrive", weight: 1 },
        { axis: "publicVisibility", weight: 0.45 },
      ]],
      ["みんなが話し始められる問い", [
        { axis: "socialBridge", weight: 0.7 },
        { axis: "expressionDrive", weight: 0.45 },
      ]],
      ["状況を整理するための仮の地図", [
        { axis: "systemizing", weight: 0.85 },
        { axis: "coordination", weight: 0.45 },
      ]],
      ["まだ試していない別の可能性", [
        { axis: "noveltyDrive", weight: 0.8 },
        { axis: "possibilityDesign", weight: 0.65 },
      ]],
      ["無理なく続けるための安心感", [
        { axis: "psychologicalSafety", weight: 0.85 },
        { axis: "maintenanceDrive", weight: 0.45 },
      ]],
    ]),
  },
  {
    id: "ice33_q13",
    role: "logicalmaister",
    force: "structure",
    text: "感覚的な話がたくさん出ています。あなたが自然にしていることは？",
    weights: [],
    choices: choices([
      ["大事な言葉を拾って、見出しにする", [
        { axis: "expressionDrive", weight: 0.75 },
        { axis: "systemizing", weight: 0.65 },
      ]],
      ["話の順番や構造を頭の中で並べる", [
        { axis: "systemizing", weight: 1 },
        { axis: "evidenceSeeking", weight: 0.35 },
      ]],
      ["まだ言葉になっていない気配を受け止める", [
        { axis: "psychologicalSafety", weight: 0.8 },
        { axis: "expressionDrive", weight: 0.35 },
      ]],
      ["そこから広がる未来の絵を考える", [
        { axis: "possibilityDesign", weight: 0.85 },
        { axis: "noveltyDrive", weight: 0.45 },
      ]],
      ["誰がどこを担うと進むかを見る", [
        { axis: "coordination", weight: 0.8 },
        { axis: "socialBridge", weight: 0.45 },
      ]],
    ]),
  },
  {
    id: "ice33_q14",
    role: "maxdesigner",
    force: "design",
    text: "ひとつの案を見たとき、あなたの頭に浮かびやすいのは？",
    weights: [],
    choices: choices([
      ["別の見せ方や展開", [
        { axis: "possibilityDesign", weight: 1 },
        { axis: "expressionDrive", weight: 0.45 },
      ]],
      ["実現するための順番", [
        { axis: "coordination", weight: 0.75 },
        { axis: "executionDrive", weight: 0.45 },
      ]],
      ["なぜその案が必要なのか", [
        { axis: "evidenceSeeking", weight: 0.75 },
        { axis: "systemizing", weight: 0.45 },
      ]],
      ["誰に届くと意味が生まれるか", [
        { axis: "socialBridge", weight: 0.65 },
        { axis: "psychologicalSafety", weight: 0.35 },
      ]],
      ["もっと尖らせた別案", [
        { axis: "nonconformity", weight: 0.85 },
        { axis: "noveltyDrive", weight: 0.55 },
      ]],
    ]),
  },
  {
    id: "ice33_q15",
    role: "soulowner",
    force: "care",
    text: "誰かが普段より少し元気がなさそうです。あなたがしやすいことは？",
    weights: [],
    choices: choices([
      ["無理に聞き出さず、話せる空気を置く", [
        { axis: "psychologicalSafety", weight: 1 },
        { axis: "maintenanceDrive", weight: 0.35 },
      ]],
      ["その人が動きやすくなる一言を渡す", [
        { axis: "encouragement", weight: 0.85 },
        { axis: "socialBridge", weight: 0.35 },
      ]],
      ["必要なら話せる相手につなぐ", [
        { axis: "socialBridge", weight: 0.75 },
        { axis: "coordination", weight: 0.5 },
      ]],
      ["何が起きているのか静かに観察する", [
        { axis: "evidenceSeeking", weight: 0.7 },
        { axis: "psychologicalSafety", weight: 0.35 },
      ]],
      ["場の流れを少し変えて空気を軽くする", [
        { axis: "coordination", weight: 0.65 },
        { axis: "expressionDrive", weight: 0.45 },
      ]],
    ]),
  },
  {
    id: "ice33_q16",
    role: "inforader",
    force: "structure",
    text: "小さな違和感や情報を見つけたとき、近い動きは？",
    weights: [],
    choices: choices([
      ["後で判断材料になりそうなので拾っておく", [
        { axis: "evidenceSeeking", weight: 1 },
        { axis: "maintenanceDrive", weight: 0.35 },
      ]],
      ["そこから新しい可能性がないか考える", [
        { axis: "noveltyDrive", weight: 0.75 },
        { axis: "possibilityDesign", weight: 0.55 },
      ]],
      ["誰に共有すると役に立つか考える", [
        { axis: "socialBridge", weight: 0.75 },
        { axis: "coordination", weight: 0.45 },
      ]],
      ["分かりやすく整理してから出す", [
        { axis: "systemizing", weight: 0.85 },
        { axis: "expressionDrive", weight: 0.45 },
      ]],
      ["場が不安にならない伝え方を考える", [
        { axis: "psychologicalSafety", weight: 0.75 },
        { axis: "expressionDrive", weight: 0.35 },
      ]],
    ]),
  },
  {
    id: "ice33_q17",
    role: "communicator",
    force: "connect",
    text: "イベント会場で、まだ話せていない人がいます。あなたが選びやすい動きは？",
    weights: [],
    choices: choices([
      ["話しやすい人との入口を作る", [
        { axis: "socialBridge", weight: 1 },
        { axis: "psychologicalSafety", weight: 0.45 },
      ]],
      ["その人の興味に合いそうな話題を探す", [
        { axis: "evidenceSeeking", weight: 0.55 },
        { axis: "socialBridge", weight: 0.55 },
      ]],
      ["少人数で自然に混ざれる流れを作る", [
        { axis: "coordination", weight: 0.8 },
        { axis: "psychologicalSafety", weight: 0.45 },
      ]],
      ["その人の良さが出る問いを置く", [
        { axis: "encouragement", weight: 0.75 },
        { axis: "expressionDrive", weight: 0.45 },
      ]],
      ["無理に入れず、安心していられる距離を保つ", [
        { axis: "psychologicalSafety", weight: 0.85 },
        { axis: "maintenanceDrive", weight: 0.35 },
      ]],
    ]),
  },
  {
    id: "ice33_q18",
    role: "premiercrafter",
    force: "care",
    text: "続けていきたい活動があります。あなたが大切にしたいのは？",
    weights: [],
    choices: choices([
      ["小さくても信頼が積み上がること", [
        { axis: "maintenanceDrive", weight: 1 },
        { axis: "craftQuality", weight: 0.55 },
      ]],
      ["参加する人が安心して戻れること", [
        { axis: "psychologicalSafety", weight: 0.85 },
        { axis: "maintenanceDrive", weight: 0.4 },
      ]],
      ["新しい人にも魅力が伝わること", [
        { axis: "expressionDrive", weight: 0.75 },
        { axis: "socialBridge", weight: 0.45 },
      ]],
      ["次の一歩が自然に生まれること", [
        { axis: "executionDrive", weight: 0.65 },
        { axis: "encouragement", weight: 0.55 },
      ]],
      ["活動の意味が未来につながること", [
        { axis: "possibilityDesign", weight: 0.75 },
        { axis: "noveltyDrive", weight: 0.35 },
      ]],
    ]),
  },
  {
    id: "ice33_q19",
    role: "imagemaister",
    force: "design",
    text: "同じ内容を伝えるなら、あなたが工夫したくなるのは？",
    weights: [],
    choices: choices([
      ["空気感や世界観が伝わる見せ方", [
        { axis: "expressionDrive", weight: 1 },
        { axis: "possibilityDesign", weight: 0.35 },
      ]],
      ["誰でも分かる順番と言葉", [
        { axis: "systemizing", weight: 0.8 },
        { axis: "expressionDrive", weight: 0.55 },
      ]],
      ["相手が話したくなる入口", [
        { axis: "socialBridge", weight: 0.75 },
        { axis: "psychologicalSafety", weight: 0.35 },
      ]],
      ["まず触れてもらえる小さな形", [
        { axis: "executionDrive", weight: 0.65 },
        { axis: "craftQuality", weight: 0.45 },
      ]],
      ["新しい解釈が生まれる余白", [
        { axis: "noveltyDrive", weight: 0.75 },
        { axis: "possibilityDesign", weight: 0.55 },
      ]],
    ]),
  },
  {
    id: "ice33_q20",
    role: "arranger",
    force: "structure",
    text: "人・予定・役割が少しズレています。あなたが気になるのは？",
    weights: [],
    choices: choices([
      ["誰が何を持っているか", [
        { axis: "coordination", weight: 0.9 },
        { axis: "socialBridge", weight: 0.45 },
      ]],
      ["どこで流れが止まっているか", [
        { axis: "coordination", weight: 0.85 },
        { axis: "systemizing", weight: 0.45 },
      ]],
      ["必要な情報が足りているか", [
        { axis: "evidenceSeeking", weight: 0.8 },
        { axis: "systemizing", weight: 0.35 },
      ]],
      ["誰かが無理していないか", [
        { axis: "psychologicalSafety", weight: 0.8 },
        { axis: "maintenanceDrive", weight: 0.35 },
      ]],
      ["思い切って流れを変えられないか", [
        { axis: "nonconformity", weight: 0.75 },
        { axis: "executionDrive", weight: 0.45 },
      ]],
    ]),
  },
  {
    id: "ice33_q21",
    role: "crazist",
    force: "ignite",
    text: "みんなが見落としているかもしれない角度を感じたとき、近いのは？",
    weights: [],
    choices: choices([
      ["まず自分の違和感を確かめる", [
        { axis: "nonconformity", weight: 0.95 },
        { axis: "evidenceSeeking", weight: 0.35 },
      ]],
      ["未来の突破口になるか広げてみる", [
        { axis: "noveltyDrive", weight: 0.85 },
        { axis: "possibilityDesign", weight: 0.65 },
      ]],
      ["伝わる言葉になるまで整理する", [
        { axis: "systemizing", weight: 0.8 },
        { axis: "expressionDrive", weight: 0.45 },
      ]],
      ["場が受け取れるタイミングを待つ", [
        { axis: "psychologicalSafety", weight: 0.7 },
        { axis: "maintenanceDrive", weight: 0.45 },
      ]],
      ["試せる人や場所を探す", [
        { axis: "socialBridge", weight: 0.65 },
        { axis: "executionDrive", weight: 0.55 },
      ]],
    ]),
  },
  {
    id: "ice33_q22",
    role: "movmentor",
    force: "care",
    text: "誰かの中にある良さが、まだ本人に届いていないように見えます。自然にしたいのは？",
    weights: [],
    choices: choices([
      ["その良さを本人に言葉で返す", [
        { axis: "encouragement", weight: 1 },
        { axis: "expressionDrive", weight: 0.35 },
      ]],
      ["その良さが活きる場につなぐ", [
        { axis: "socialBridge", weight: 0.75 },
        { axis: "coordination", weight: 0.55 },
      ]],
      ["まず安心して受け取れる空気を作る", [
        { axis: "psychologicalSafety", weight: 0.85 },
        { axis: "encouragement", weight: 0.35 },
      ]],
      ["実際に使える小さな機会を作る", [
        { axis: "executionDrive", weight: 0.75 },
        { axis: "encouragement", weight: 0.45 },
      ]],
      ["何が良さなのか整理して伝える", [
        { axis: "systemizing", weight: 0.7 },
        { axis: "evidenceSeeking", weight: 0.45 },
      ]],
    ]),
  },
  {
    id: "ice33_q23",
    role: "revolist",
    force: "ignite",
    text: "まだ誰も始めていないけれど、必要そうなことがあります。近い感覚は？",
    weights: [],
    choices: choices([
      ["小さく始めれば空気が変わりそう", [
        { axis: "executionDrive", weight: 1 },
        { axis: "noveltyDrive", weight: 0.65 },
      ]],
      ["誰かと一緒なら始められそう", [
        { axis: "socialBridge", weight: 0.75 },
        { axis: "encouragement", weight: 0.45 },
      ]],
      ["必要な理由を先に整理したい", [
        { axis: "systemizing", weight: 0.75 },
        { axis: "evidenceSeeking", weight: 0.55 },
      ]],
      ["もっと面白い形にしてから始めたい", [
        { axis: "possibilityDesign", weight: 0.85 },
        { axis: "expressionDrive", weight: 0.35 },
      ]],
      ["続けられる体制が見えてから動きたい", [
        { axis: "maintenanceDrive", weight: 0.85 },
        { axis: "coordination", weight: 0.45 },
      ]],
    ]),
  },
  {
    id: "ice33_q24",
    role: "logicalmaister",
    force: "structure",
    text: "複雑な話を短く共有することになりました。あなたがまず考えるのは？",
    weights: [],
    choices: choices([
      ["何を一番伝えると動きやすいか", [
        { axis: "systemizing", weight: 0.85 },
        { axis: "expressionDrive", weight: 0.55 },
      ]],
      ["どんな順番なら誤解が少ないか", [
        { axis: "systemizing", weight: 0.95 },
        { axis: "psychologicalSafety", weight: 0.35 },
      ]],
      ["どの事実が判断材料になるか", [
        { axis: "evidenceSeeking", weight: 0.95 },
        { axis: "systemizing", weight: 0.35 },
      ]],
      ["誰に渡すと次へ進むか", [
        { axis: "coordination", weight: 0.65 },
        { axis: "socialBridge", weight: 0.55 },
      ]],
      ["どう見せると受け取りやすいか", [
        { axis: "expressionDrive", weight: 0.85 },
        { axis: "craftQuality", weight: 0.35 },
      ]],
    ]),
  },
  {
    id: "ice33_q25",
    role: "soulowner",
    force: "care",
    text: "場の空気が少し急ぎすぎていると感じます。あなたが置きたいものは？",
    weights: [],
    choices: choices([
      ["一度呼吸できる余白", [
        { axis: "psychologicalSafety", weight: 0.95 },
        { axis: "maintenanceDrive", weight: 0.45 },
      ]],
      ["今決めることと後でよいことの整理", [
        { axis: "systemizing", weight: 0.75 },
        { axis: "coordination", weight: 0.45 },
      ]],
      ["みんなが参加しやすい会話の入口", [
        { axis: "socialBridge", weight: 0.8 },
        { axis: "psychologicalSafety", weight: 0.45 },
      ]],
      ["まず進めるための一歩", [
        { axis: "executionDrive", weight: 0.8 },
        { axis: "encouragement", weight: 0.35 },
      ]],
      ["この流れの先にある可能性", [
        { axis: "possibilityDesign", weight: 0.8 },
        { axis: "noveltyDrive", weight: 0.35 },
      ]],
    ]),
  },
  {
    id: "ice33_q26",
    role: "maxdesigner",
    force: "design",
    text: "素材がいくつか集まっています。あなたがしたくなるのは？",
    weights: [],
    choices: choices([
      ["組み合わせて新しい体験にする", [
        { axis: "possibilityDesign", weight: 1 },
        { axis: "noveltyDrive", weight: 0.45 },
      ]],
      ["伝わる見た目や言葉に整える", [
        { axis: "expressionDrive", weight: 0.85 },
        { axis: "craftQuality", weight: 0.35 },
      ]],
      ["使える情報と足りない情報を分ける", [
        { axis: "evidenceSeeking", weight: 0.8 },
        { axis: "systemizing", weight: 0.45 },
      ]],
      ["誰がどこを担うと進むか配置する", [
        { axis: "coordination", weight: 0.85 },
        { axis: "socialBridge", weight: 0.35 },
      ]],
      ["まず小さく動かして反応を見る", [
        { axis: "executionDrive", weight: 0.8 },
        { axis: "uncertaintyTolerance", weight: 0.45 },
      ]],
    ]),
  },
  {
    id: "ice33_q27",
    role: "inforader",
    force: "structure",
    text: "会話の中で、あとで効きそうな小さなヒントが出ました。近い動きは？",
    weights: [],
    choices: choices([
      ["忘れないように拾っておく", [
        { axis: "evidenceSeeking", weight: 0.95 },
        { axis: "maintenanceDrive", weight: 0.35 },
      ]],
      ["他の情報とつなげて見立てる", [
        { axis: "evidenceSeeking", weight: 0.75 },
        { axis: "systemizing", weight: 0.55 },
      ]],
      ["誰かの行動につながる形で渡す", [
        { axis: "encouragement", weight: 0.65 },
        { axis: "expressionDrive", weight: 0.45 },
      ]],
      ["場の流れを変えるきっかけにする", [
        { axis: "executionDrive", weight: 0.65 },
        { axis: "coordination", weight: 0.45 },
      ]],
      ["新しい可能性の種として広げる", [
        { axis: "noveltyDrive", weight: 0.75 },
        { axis: "possibilityDesign", weight: 0.55 },
      ]],
    ]),
  },
  {
    id: "ice33_q28",
    role: "imagemaister",
    force: "design",
    text: "まだ形のない想いを、誰かに届けるとしたら何から始めますか？",
    weights: [],
    choices: choices([
      ["その想いの空気感を表す言葉を探す", [
        { axis: "expressionDrive", weight: 0.95 },
        { axis: "psychologicalSafety", weight: 0.3 },
      ]],
      ["見える形やイメージにしてみる", [
        { axis: "expressionDrive", weight: 0.9 },
        { axis: "possibilityDesign", weight: 0.45 },
      ]],
      ["誰に届くと意味が生まれるか考える", [
        { axis: "socialBridge", weight: 0.75 },
        { axis: "possibilityDesign", weight: 0.45 },
      ]],
      ["まず伝える順番を整える", [
        { axis: "systemizing", weight: 0.75 },
        { axis: "expressionDrive", weight: 0.45 },
      ]],
      ["小さく出して反応を受け取る", [
        { axis: "executionDrive", weight: 0.7 },
        { axis: "uncertaintyTolerance", weight: 0.45 },
      ]],
    ]),
  },
  {
    id: "ice33_q29",
    role: "arranger",
    force: "connect",
    text: "複数人で動く話になったとき、あなたが自然に見ているのは？",
    weights: [],
    choices: choices([
      ["誰がどの役割を持つと動きやすいか", [
        { axis: "coordination", weight: 1 },
        { axis: "socialBridge", weight: 0.45 },
      ]],
      ["抜けている役割や情報がないか", [
        { axis: "coordination", weight: 0.8 },
        { axis: "evidenceSeeking", weight: 0.55 },
      ]],
      ["まず動き出す人がいるか", [
        { axis: "executionDrive", weight: 0.75 },
        { axis: "publicVisibility", weight: 0.35 },
      ]],
      ["安心して参加できる状態か", [
        { axis: "psychologicalSafety", weight: 0.8 },
        { axis: "socialBridge", weight: 0.35 },
      ]],
      ["もっと面白い組み合わせがないか", [
        { axis: "possibilityDesign", weight: 0.85 },
        { axis: "noveltyDrive", weight: 0.35 },
      ]],
    ]),
  },
  {
    id: "ice33_q30",
    role: "premiercrafter",
    force: "care",
    text: "いい流れが生まれ始めました。あなたが守りたいものは？",
    weights: [],
    choices: choices([
      ["その場限りで終わらない続き方", [
        { axis: "maintenanceDrive", weight: 0.95 },
        { axis: "craftQuality", weight: 0.4 },
      ]],
      ["関わった人がまた来たくなる安心感", [
        { axis: "psychologicalSafety", weight: 0.85 },
        { axis: "maintenanceDrive", weight: 0.35 },
      ]],
      ["外に出しても信頼される仕上がり", [
        { axis: "craftQuality", weight: 1 },
        { axis: "evidenceSeeking", weight: 0.35 },
      ]],
      ["次の挑戦につながる勢い", [
        { axis: "executionDrive", weight: 0.7 },
        { axis: "encouragement", weight: 0.45 },
      ]],
      ["新しい人が入りやすい入口", [
        { axis: "socialBridge", weight: 0.75 },
        { axis: "expressionDrive", weight: 0.35 },
      ]],
    ]),
  },
  {
    id: "ice33_q31",
    role: "crazist",
    force: "ignite",
    text: "みんなが同じ方向を見ているとき、ふと別の可能性が浮かびました。近いのは？",
    weights: [],
    choices: choices([
      ["今は言わずに、もう少し自分の中で確かめる", [
        { axis: "nonconformity", weight: 0.65 },
        { axis: "evidenceSeeking", weight: 0.45 },
      ]],
      ["場に投げて、反応を見てみる", [
        { axis: "nonconformity", weight: 0.9 },
        { axis: "publicVisibility", weight: 0.45 },
      ]],
      ["未来の選択肢として広げてみる", [
        { axis: "noveltyDrive", weight: 0.8 },
        { axis: "possibilityDesign", weight: 0.75 },
      ]],
      ["伝わる形にしてから共有する", [
        { axis: "expressionDrive", weight: 0.7 },
        { axis: "systemizing", weight: 0.55 },
      ]],
      ["必要な人にだけ先に話してみる", [
        { axis: "socialBridge", weight: 0.65 },
        { axis: "psychologicalSafety", weight: 0.35 },
      ]],
    ]),
  },
  {
    id: "ice33_q32",
    role: "movmentor",
    force: "care",
    text: "誰かが一歩進んだあと、あなたが自然にしたくなるのは？",
    weights: [],
    choices: choices([
      ["その一歩をちゃんと見ていたと伝える", [
        { axis: "encouragement", weight: 1 },
        { axis: "psychologicalSafety", weight: 0.35 },
      ]],
      ["次に進みやすい小さな道を一緒に探す", [
        { axis: "encouragement", weight: 0.8 },
        { axis: "executionDrive", weight: 0.55 },
      ]],
      ["続けやすい環境を整える", [
        { axis: "maintenanceDrive", weight: 0.75 },
        { axis: "coordination", weight: 0.45 },
      ]],
      ["その人の動きが誰につながるか考える", [
        { axis: "socialBridge", weight: 0.75 },
        { axis: "possibilityDesign", weight: 0.35 },
      ]],
      ["経験を言葉にして残す", [
        { axis: "systemizing", weight: 0.7 },
        { axis: "expressionDrive", weight: 0.45 },
      ]],
    ]),
  },
  {
    id: "ice33_q33",
    role: "communicator",
    force: "connect",
    text: "今日の会話を次につなげるなら、あなたが残したいものは？",
    weights: [],
    choices: choices([
      ["また話したくなる相手との入口", [
        { axis: "socialBridge", weight: 0.95 },
        { axis: "psychologicalSafety", weight: 0.35 },
      ]],
      ["小さく始められる約束", [
        { axis: "executionDrive", weight: 0.75 },
        { axis: "encouragement", weight: 0.45 },
      ]],
      ["話したことの見取り図", [
        { axis: "systemizing", weight: 0.8 },
        { axis: "evidenceSeeking", weight: 0.35 },
      ]],
      ["誰かに見せたくなる表現", [
        { axis: "expressionDrive", weight: 0.8 },
        { axis: "possibilityDesign", weight: 0.35 },
      ]],
      ["続けても大丈夫と思える余韻", [
        { axis: "psychologicalSafety", weight: 0.85 },
        { axis: "maintenanceDrive", weight: 0.35 },
      ]],
    ]),
  },
];

export const ICEBREAK_TOTAL_QUESTIONS = icebreakQuestions.length;
