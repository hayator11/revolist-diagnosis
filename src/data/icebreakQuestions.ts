import type { RevoTypeKey } from "./revotypes";
import type { ForceKey } from "@/lib/diagnosisCore/forces";
import type { AxisQuestionWeight, MultiAxisQuestion } from "@/lib/diagnosisCore/multiAxis";

export interface IcebreakQuestion extends MultiAxisQuestion {
  id: string;
  text: string;
  role: RevoTypeKey;
  force: ForceKey;
  weights: AxisQuestionWeight[];
}

export const icebreakQuestions: IcebreakQuestion[] = [
  {
    id: "ice33_q01",
    role: "communicator",
    force: "connect",
    text: "初対面の場では、誰かが話しやすくなる一言を探している",
    weights: [
      { axis: "socialBridge", weight: 0.8 },
      { axis: "psychologicalSafety", weight: 0.55 },
      { axis: "coordination", weight: 0.25 },
      { axis: "publicVisibility", weight: 0.15 },
    ],
  },
  {
    id: "ice33_q02",
    role: "inforader",
    force: "structure",
    text: "何かを決める前に、背景や事実を少し確認したくなる",
    weights: [
      { axis: "evidenceSeeking", weight: 0.9 },
      { axis: "systemizing", weight: 0.35 },
      { axis: "psychologicalSafety", weight: 0.2 },
    ],
  },
  {
    id: "ice33_q03",
    role: "revolist",
    force: "ignite",
    text: "面白そうだと思ったら、整いきる前でも小さく試してみたくなる",
    weights: [
      { axis: "executionDrive", weight: 0.85 },
      { axis: "uncertaintyTolerance", weight: 0.65 },
      { axis: "noveltyDrive", weight: 0.45 },
    ],
  },
  {
    id: "ice33_q04",
    role: "soulowner",
    force: "care",
    text: "相手が安心して話せるように、まず受け止めることを大切にする",
    weights: [
      { axis: "psychologicalSafety", weight: 0.9 },
      { axis: "encouragement", weight: 0.35 },
      { axis: "socialBridge", weight: 0.25 },
    ],
  },
  {
    id: "ice33_q05",
    role: "maxdesigner",
    force: "design",
    text: "ひとつの案を見ると、別の見せ方や展開も思い浮かびやすい",
    weights: [
      { axis: "possibilityDesign", weight: 0.9 },
      { axis: "noveltyDrive", weight: 0.35 },
      { axis: "expressionDrive", weight: 0.3 },
    ],
  },
  {
    id: "ice33_q06",
    role: "logicalmaister",
    force: "structure",
    text: "散らかった話を、順番や構造にして説明するのが好きだ",
    weights: [
      { axis: "systemizing", weight: 0.75 },
      { axis: "expressionDrive", weight: 0.45 },
      { axis: "evidenceSeeking", weight: 0.35 },
      { axis: "coordination", weight: 0.25 },
    ],
  },
  {
    id: "ice33_q07",
    role: "movmentor",
    force: "care",
    text: "挑戦している人を見ると、その人の次の一歩を一緒に探したくなる",
    weights: [
      { axis: "encouragement", weight: 0.9 },
      { axis: "executionDrive", weight: 0.35 },
      { axis: "psychologicalSafety", weight: 0.3 },
    ],
  },
  {
    id: "ice33_q08",
    role: "arranger",
    force: "connect",
    text: "人・予定・役割のズレに気づくと、流れを整えたくなる",
    weights: [
      { axis: "coordination", weight: 0.9 },
      { axis: "socialBridge", weight: 0.35 },
      { axis: "systemizing", weight: 0.3 },
    ],
  },
  {
    id: "ice33_q09",
    role: "premiercrafter",
    force: "care",
    text: "人に出すものは、最後にもう一段だけ磨きたくなる",
    weights: [
      { axis: "craftQuality", weight: 0.9 },
      { axis: "maintenanceDrive", weight: 0.35 },
      { axis: "evidenceSeeking", weight: 0.25 },
    ],
  },
  {
    id: "ice33_q10",
    role: "crazist",
    force: "ignite",
    text: "普通のやり方だけでは届かないなら、別の前提から考えたくなる",
    weights: [
      { axis: "nonconformity", weight: 0.9 },
      { axis: "noveltyDrive", weight: 0.45 },
      { axis: "uncertaintyTolerance", weight: 0.35 },
    ],
  },
  {
    id: "ice33_q11",
    role: "imagemaister",
    force: "design",
    text: "言葉・雰囲気・見た目が整うと、人に伝わる力が増すと思う",
    weights: [
      { axis: "expressionDrive", weight: 0.9 },
      { axis: "craftQuality", weight: 0.35 },
      { axis: "possibilityDesign", weight: 0.3 },
    ],
  },
  {
    id: "ice33_q12",
    role: "communicator",
    force: "connect",
    text: "この人とこの人が話したら面白そう、と思うことがよくある",
    weights: [
      { axis: "socialBridge", weight: 0.75 },
      { axis: "coordination", weight: 0.45 },
      { axis: "possibilityDesign", weight: 0.3 },
      { axis: "psychologicalSafety", weight: 0.2 },
    ],
  },
  {
    id: "ice33_q13",
    role: "inforader",
    force: "structure",
    text: "会話の中で、判断材料になりそうな情報を拾うのが得意だ",
    weights: [
      { axis: "evidenceSeeking", weight: 0.85 },
      { axis: "socialBridge", weight: 0.25 },
      { axis: "systemizing", weight: 0.25 },
    ],
  },
  {
    id: "ice33_q14",
    role: "revolist",
    force: "ignite",
    text: "今ないものでも、必要だと思えば自分から始める選択肢が浮かぶ",
    weights: [
      { axis: "executionDrive", weight: 0.85 },
      { axis: "noveltyDrive", weight: 0.65 },
      { axis: "publicVisibility", weight: 0.25 },
    ],
  },
  {
    id: "ice33_q15",
    role: "soulowner",
    force: "care",
    text: "場の中で、まだ言葉になっていない気持ちに気づくことがある",
    weights: [
      { axis: "psychologicalSafety", weight: 0.85 },
      { axis: "socialBridge", weight: 0.25 },
      { axis: "encouragement", weight: 0.25 },
    ],
  },
  {
    id: "ice33_q16",
    role: "maxdesigner",
    force: "design",
    text: "素材がいくつかあると、それを組み合わせて企画にしたくなる",
    weights: [
      { axis: "possibilityDesign", weight: 0.9 },
      { axis: "systemizing", weight: 0.25 },
      { axis: "noveltyDrive", weight: 0.25 },
    ],
  },
  {
    id: "ice33_q17",
    role: "logicalmaister",
    force: "structure",
    text: "感覚的な話でも、相手に伝わる言葉へ置き換えたくなる",
    weights: [
      { axis: "systemizing", weight: 0.65 },
      { axis: "expressionDrive", weight: 0.65 },
      { axis: "evidenceSeeking", weight: 0.3 },
    ],
  },
  {
    id: "ice33_q18",
    role: "movmentor",
    force: "care",
    text: "誰かの良いところを見つけると、本人に伝えたくなる",
    weights: [
      { axis: "encouragement", weight: 0.9 },
      { axis: "socialBridge", weight: 0.35 },
      { axis: "psychologicalSafety", weight: 0.25 },
    ],
  },
  {
    id: "ice33_q19",
    role: "arranger",
    force: "structure",
    text: "全体の進み方を見て、必要な人や情報を配置したくなる",
    weights: [
      { axis: "coordination", weight: 0.85 },
      { axis: "systemizing", weight: 0.35 },
      { axis: "socialBridge", weight: 0.25 },
    ],
  },
  {
    id: "ice33_q20",
    role: "premiercrafter",
    force: "care",
    text: "続けることで信頼が積み上がるものを大切にしたい",
    weights: [
      { axis: "maintenanceDrive", weight: 0.85 },
      { axis: "craftQuality", weight: 0.45 },
      { axis: "psychologicalSafety", weight: 0.25 },
    ],
  },
  {
    id: "ice33_q21",
    role: "crazist",
    force: "ignite",
    text: "常識の外に見える案でも、社会に必要なら試す価値があると思う",
    weights: [
      { axis: "nonconformity", weight: 0.85 },
      { axis: "uncertaintyTolerance", weight: 0.55 },
      { axis: "possibilityDesign", weight: 0.35 },
    ],
  },
  {
    id: "ice33_q22",
    role: "imagemaister",
    force: "design",
    text: "話の魅力が伝わるように、たとえ話や表現を工夫することが多い",
    weights: [
      { axis: "expressionDrive", weight: 0.85 },
      { axis: "socialBridge", weight: 0.25 },
      { axis: "possibilityDesign", weight: 0.25 },
    ],
  },
  {
    id: "ice33_q23",
    role: "communicator",
    force: "connect",
    text: "場の温度が下がっている時、会話の入口を作りたくなる",
    weights: [
      { axis: "socialBridge", weight: 0.65 },
      { axis: "psychologicalSafety", weight: 0.45 },
      { axis: "coordination", weight: 0.3 },
      { axis: "encouragement", weight: 0.25 },
    ],
  },
  {
    id: "ice33_q24",
    role: "inforader",
    force: "structure",
    text: "人が見落としている小さな情報に、価値を感じることがある",
    weights: [
      { axis: "evidenceSeeking", weight: 0.8 },
      { axis: "craftQuality", weight: 0.3 },
      { axis: "maintenanceDrive", weight: 0.25 },
    ],
  },
  {
    id: "ice33_q25",
    role: "revolist",
    force: "ignite",
    text: "誰かを待つより、自分が先に動いて空気を変えたい時がある",
    weights: [
      { axis: "executionDrive", weight: 0.85 },
      { axis: "publicVisibility", weight: 0.45 },
      { axis: "uncertaintyTolerance", weight: 0.35 },
    ],
  },
  {
    id: "ice33_q26",
    role: "soulowner",
    force: "care",
    text: "話す量よりも、その人が自然体でいられるかを大切にする",
    weights: [
      { axis: "psychologicalSafety", weight: 0.9 },
      { axis: "maintenanceDrive", weight: 0.25 },
      { axis: "encouragement", weight: 0.2 },
    ],
  },
  {
    id: "ice33_q27",
    role: "maxdesigner",
    force: "design",
    text: "今あるものを、もっと面白い体験や流れに設計し直したくなる",
    weights: [
      { axis: "possibilityDesign", weight: 0.8 },
      { axis: "systemizing", weight: 0.35 },
      { axis: "expressionDrive", weight: 0.3 },
    ],
  },
  {
    id: "ice33_q28",
    role: "logicalmaister",
    force: "structure",
    text: "人が納得しやすいように、理由と順番を添えて話したい",
    weights: [
      { axis: "systemizing", weight: 0.7 },
      { axis: "evidenceSeeking", weight: 0.45 },
      { axis: "expressionDrive", weight: 0.4 },
      { axis: "psychologicalSafety", weight: 0.2 },
    ],
  },
  {
    id: "ice33_q29",
    role: "movmentor",
    force: "care",
    text: "場の誰かが一歩踏み出せるように、背中を押す言葉を選ぶ",
    weights: [
      { axis: "encouragement", weight: 0.85 },
      { axis: "publicVisibility", weight: 0.25 },
      { axis: "executionDrive", weight: 0.25 },
    ],
  },
  {
    id: "ice33_q30",
    role: "arranger",
    force: "connect",
    text: "話し合いでは、誰が何を持っているかを見ながら組み合わせたい",
    weights: [
      { axis: "coordination", weight: 0.8 },
      { axis: "socialBridge", weight: 0.4 },
      { axis: "possibilityDesign", weight: 0.25 },
    ],
  },
  {
    id: "ice33_q31",
    role: "premiercrafter",
    force: "care",
    text: "勢いだけで進めるより、ちゃんと残る品質にしていきたい",
    weights: [
      { axis: "craftQuality", weight: 0.85 },
      { axis: "maintenanceDrive", weight: 0.45 },
      { axis: "systemizing", weight: 0.25 },
    ],
  },
  {
    id: "ice33_q32",
    role: "crazist",
    force: "ignite",
    text: "人と違う見方をしていると言われても、自分の感覚を確かめたい",
    weights: [
      { axis: "nonconformity", weight: 0.85 },
      { axis: "expressionDrive", weight: 0.3 },
      { axis: "uncertaintyTolerance", weight: 0.3 },
    ],
  },
  {
    id: "ice33_q33",
    role: "imagemaister",
    force: "design",
    text: "自分では普通の発想でも、人に話すとアイデアとして広がることがある",
    weights: [
      { axis: "expressionDrive", weight: 0.65 },
      { axis: "possibilityDesign", weight: 0.45 },
      { axis: "socialBridge", weight: 0.25 },
    ],
  },
];

export const ICEBREAK_TOTAL_QUESTIONS = icebreakQuestions.length;
