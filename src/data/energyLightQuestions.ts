export type EnergyKey = "wood" | "fire" | "earth" | "metal" | "water";
export type EnergyQuestionId =
  | "wood1"
  | "wood2"
  | "wood3"
  | "wood4"
  | "fire1"
  | "fire2"
  | "fire3"
  | "fire4"
  | "earth1"
  | "earth2"
  | "earth3"
  | "earth4"
  | "metal1"
  | "metal2"
  | "metal3"
  | "metal4"
  | "water1"
  | "water2"
  | "water3"
  | "water4";

export interface EnergyLightQuestion {
  id: EnergyQuestionId;
  text: string;
  energy: EnergyKey;
}

export interface EnergyLightSceneChoice {
  key: EnergyKey;
  label: string;
  text: string;
}

export const ENERGY_ORDER: EnergyKey[] = ["wood", "fire", "earth", "metal", "water"];

export const energyLabels: Record<EnergyKey, string> = {
  wood: "ひらく力",
  fire: "ともす力",
  earth: "ささえる力",
  metal: "かためる力",
  water: "よみとく力",
};

export const energyThemeColors: Record<EnergyKey, string> = {
  wood: "#2E8B57",
  fire: "#E2543E",
  earth: "#C8893A",
  metal: "#8C9BA5",
  water: "#3B7DD8",
};

export const energyLightQuestions: EnergyLightQuestion[] = [
  { id: "wood1", energy: "wood", text: "「もっとこうしたら面白いのに」と思いつくことが、日常的にある" },
  { id: "fire1", energy: "fire", text: "自分が声をかけると、場の空気が動くのを感じることがある" },
  { id: "earth1", energy: "earth", text: "困っている人がいると、頼まれる前に手を貸していることが多い" },
  { id: "metal1", energy: "metal", text: "物事を始める前に、段取りや計画を立てたくなる" },
  { id: "water1", energy: "water", text: "動き出す前に、まず情報を集めて全体像をつかみたい" },
  { id: "fire2", energy: "fire", text: "迷っている人を見ると、背中を押したくなる" },
  { id: "wood2", energy: "wood", text: "前例がないことに、不安よりワクワクを感じる" },
  { id: "metal2", energy: "metal", text: "曖昧な指示より、基準やルールがはっきりしているほうが動きやすい" },
  { id: "earth2", energy: "earth", text: "人から悩みや相談を打ち明けられることが多い" },
  { id: "water2", energy: "water", text: "盛り上がっている場でも、一歩引いて全体を眺めていることがある" },
  { id: "earth3", energy: "earth", text: "輪から外れている人が、自然と目に入る" },
  { id: "water3", energy: "water", text: "人の言葉の裏にある意図や、物事の流れを自然と読んでいる" },
  { id: "fire3", energy: "fire", text: "人前で話したり、場を盛り上げたりするのは苦ではない" },
  { id: "wood3", energy: "wood", text: "会議や集まりで、話を予定になかった方向に広げてしまうことがある" },
  { id: "metal3", energy: "metal", text: "一度決めたやり方は、最後までやり切るほうだ" },
  { id: "water4", energy: "water", text: "「この先こうなりそう」という予測が、当たることが多い" },
  { id: "metal4", energy: "metal", text: "物事が「なんとなく」で決まっていくと、モヤモヤする" },
  { id: "fire4", energy: "fire", text: "自分の「楽しい！」は、まわりに伝わりやすいと思う" },
  { id: "earth4", energy: "earth", text: "自分が前に出るより、誰かを支えるほうが落ち着く" },
  { id: "wood4", energy: "wood", text: "「普通はこうするものだ」という言葉に、調整したい余白を感じやすい" },
];

export const energyLightSceneChoices: EnergyLightSceneChoice[] = [
  { key: "wood", label: "A", text: "「次はこんなことやりたい」と、新しい話を始めている" },
  { key: "fire", label: "B", text: "乾杯の音頭をとったり、場を盛り上げる側に回っている" },
  { key: "earth", label: "C", text: "料理を取り分けたり、端の席の人に話しかけたりしている" },
  { key: "metal", label: "D", text: "会計や帰りの段取りを、頼まれる前に考えている" },
  { key: "water", label: "E", text: "少し引いた席から、場全体を眺めて楽しんでいる" },
];

export const ENERGY_LIGHT_TOTAL_QUESTIONS = energyLightQuestions.length + 1;
