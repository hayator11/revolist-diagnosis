import type { RevoTypeKey } from "./revotypes";

export type ResearchForceKey =
  | "ignite"
  | "design"
  | "connect"
  | "structure"
  | "care";

export interface ResearchLightQuestion {
  id: number;
  text: string;
  role: RevoTypeKey;
  force: ResearchForceKey;
}

export const researchForceLabels: Record<ResearchForceKey, string> = {
  ignite: "はじめる力",
  design: "描く力",
  connect: "つなぐ力",
  structure: "整える力",
  care: "支える力",
};

export const researchForceDescriptions: Record<ResearchForceKey, string> = {
  ignite: "まだ形になっていないものへ、最初の一歩を置く力です。",
  design: "可能性や世界観を、伝わる形へ組み立てる力です。",
  connect: "人・想い・場の間に流れを生み出す力です。",
  structure: "情報や役割を整理し、前に進める土台を作る力です。",
  care: "安心感や完成度を守り、人やものごとを育てる力です。",
};

export const researchLightQuestions: ResearchLightQuestion[] = [
  { id: 1, text: "まだ誰も始めていないことを見ると、自分が一歩目を出したくなる", role: "revolist", force: "ignite" },
  { id: 2, text: "うまくいく形がまだ見えていなくても、未来が面白そうなら動いてみたい", role: "revolist", force: "ignite" },
  { id: 3, text: "複数のアイデアを組み合わせて、新しい企画にするのが好きだ", role: "maxdesigner", force: "design" },
  { id: 4, text: "ひとつの答えに決める前に、いくつかの可能性を広げて考える", role: "maxdesigner", force: "design" },
  { id: 5, text: "頭の中のイメージや世界観を、言葉や見た目で表現したくなる", role: "imagemaister", force: "design" },
  { id: 6, text: "雰囲気・物語・見え方が整うと、人に伝わりやすくなると思う", role: "imagemaister", force: "design" },
  { id: 7, text: "人と人を紹介したり、会話のきっかけを作ることが多い", role: "communicator", force: "connect" },
  { id: 8, text: "場の空気を見ながら、初対面の人にも話しかけられる", role: "communicator", force: "connect" },
  { id: 9, text: "何かを決める前に、情報を集めて比べると安心する", role: "inforader", force: "structure" },
  { id: 10, text: "根拠や事例を見つけると、周りにも共有したくなる", role: "inforader", force: "structure" },
  { id: 11, text: "挑戦している人を見ると、自然と応援したくなる", role: "movmentor", force: "care" },
  { id: 12, text: "落ち込んでいる人に、次の一歩を見つけてもらう関わりが多い", role: "movmentor", force: "care" },
  { id: 13, text: "細部まで丁寧に仕上げることで、価値が上がると思う", role: "premiercrafter", force: "care" },
  { id: 14, text: "完成度や品質に納得できるまで、もう一手間かけたくなる", role: "premiercrafter", force: "care" },
  { id: 15, text: "複雑な話を整理して、構造や順番を見えるようにするのが得意だ", role: "logicalmaister", force: "structure" },
  { id: 16, text: "感覚だけでなく、理由や仕組みを考えて動きたい", role: "logicalmaister", force: "structure" },
  { id: 17, text: "全体の流れを見ながら、役割分担や段取りを整えることが多い", role: "arranger", force: "structure" },
  { id: 18, text: "人・情報・予定のズレを調整して、進みやすくするのが好きだ", role: "arranger", force: "connect" },
  { id: 19, text: "人の気持ちや本音に気づき、安心して話せる空気を作りたい", role: "soulowner", force: "care" },
  { id: 20, text: "相談されることが多く、相手のペースを大切にして聞ける", role: "soulowner", force: "care" },
  { id: 21, text: "普通とは違う見方や、常識を外したアイデアを試したくなる", role: "crazist", force: "ignite" },
];

export const RESEARCH_LIGHT_TOTAL_QUESTIONS = researchLightQuestions.length;
