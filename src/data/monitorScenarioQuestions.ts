import type { RevoTypeKey } from "./revotypes";

export const MONITOR_SCENARIO_VERSION = "revo-monitor-v1-scenario-q44";

export type MonitorScenarioChoiceValue = "A" | "B" | "C" | "D" | "E";

export type MonitorScenarioAxisKey =
  | "self"
  | "other"
  | "field"
  | "future"
  | "structure"
  | "expression"
  | "care"
  | "action";

export type MonitorScenarioRoleScores = Partial<Record<RevoTypeKey, number>>;
export type MonitorScenarioAxisScores = Partial<Record<MonitorScenarioAxisKey, number>>;

export interface MonitorScenarioChoice {
  value: MonitorScenarioChoiceValue;
  label: string;
  directRoles: MonitorScenarioRoleScores;
  secondaryRoles?: MonitorScenarioRoleScores;
  mirrorSignals?: MonitorScenarioRoleScores;
  axisSignals?: MonitorScenarioAxisScores;
}

export interface MonitorScenarioQuestion {
  id: number;
  focusRole: RevoTypeKey;
  lens: "field" | "start" | "team" | "decision";
  text: string;
  choices: MonitorScenarioChoice[];
}

function choice(
  value: MonitorScenarioChoiceValue,
  label: string,
  directRoles: MonitorScenarioRoleScores,
  mirrorSignals: MonitorScenarioRoleScores,
  axisSignals: MonitorScenarioAxisScores,
  secondaryRoles: MonitorScenarioRoleScores = {}
): MonitorScenarioChoice {
  return { value, label, directRoles, secondaryRoles, mirrorSignals, axisSignals };
}

export const monitorScenarioQuestions: MonitorScenarioQuestion[] = [
  {
    id: 1,
    focusRole: "revolist",
    lens: "field",
    text: "新しい企画の話が出ました。まだ誰も具体的には動いていません。あなたが最初に見ているものは？",
    choices: [
      choice("A", "それがどんな未来につながるか", { revolist: 3, maxdesigner: 2 }, { logicalmaister: 2, arranger: 1 }, { future: 3, action: 1 }),
      choice("B", "誰が一緒に動けそうか", { communicator: 3, movmentor: 2 }, { revolist: 1, arranger: 1 }, { other: 3, field: 1 }),
      choice("C", "どんな順番なら進めやすいか", { arranger: 3, logicalmaister: 2 }, { revolist: 2, maxdesigner: 1 }, { structure: 3, field: 1 }),
      choice("D", "今ある情報で何が分かるか", { inforader: 3, logicalmaister: 1 }, { revolist: 1, communicator: 1 }, { structure: 2, self: 1 }),
      choice("E", "みんなが話しやすい空気かどうか", { soulowner: 3, communicator: 1 }, { revolist: 2, movmentor: 1 }, { care: 3, field: 2 }),
    ],
  },
  {
    id: 2,
    focusRole: "revolist",
    lens: "start",
    text: "小さな違和感から、何か始まりそうな気配があります。あなたが置きたくなる一手は？",
    choices: [
      choice("A", "まず一度だけ試して、場の温度を見てみる", { revolist: 3, crazist: 1 }, { premiercrafter: 2, logicalmaister: 1 }, { action: 3, future: 1 }),
      choice("B", "なぜ必要なのかを短い言葉にする", { logicalmaister: 3, inforader: 1 }, { revolist: 2, communicator: 1 }, { structure: 3, expression: 1 }),
      choice("C", "面白がってくれそうな人に先に話す", { communicator: 3, maxdesigner: 1 }, { revolist: 2, soulowner: 1 }, { other: 3, future: 1 }),
      choice("D", "続けられる形になるか条件を見ておく", { premiercrafter: 2, arranger: 2 }, { revolist: 2, crazist: 1 }, { structure: 2, field: 2 }),
      choice("E", "誰かが安心して乗れる入口を作る", { soulowner: 2, movmentor: 2 }, { revolist: 2, communicator: 1 }, { care: 3, action: 1 }),
    ],
  },
  {
    id: 3,
    focusRole: "revolist",
    lens: "team",
    text: "まだ形になっていない想いを、チームで動かすことになりました。あなたが大事にしたいのは？",
    choices: [
      choice("A", "最初の熱が消えないうちに、小さく動くこと", { revolist: 3, movmentor: 1 }, { arranger: 2, premiercrafter: 1 }, { action: 3, future: 1 }),
      choice("B", "みんなが同じ方向を見られる言葉", { logicalmaister: 2, communicator: 2 }, { revolist: 1, maxdesigner: 1 }, { structure: 2, field: 2 }),
      choice("C", "関わる人が持ち寄れる役割の見える化", { arranger: 3, communicator: 1 }, { revolist: 1, soulowner: 1 }, { field: 3, other: 1 }),
      choice("D", "まだ見えていない展開の余白", { maxdesigner: 3, crazist: 1 }, { logicalmaister: 2, premiercrafter: 1 }, { future: 3, expression: 1 }),
      choice("E", "無理なく参加できる安心感", { soulowner: 3, premiercrafter: 1 }, { revolist: 2, movmentor: 1 }, { care: 3, field: 1 }),
    ],
  },
  {
    id: 4,
    focusRole: "revolist",
    lens: "decision",
    text: "この企画を進めるか迷っています。あなたの中で最後に背中を押すものは？",
    choices: [
      choice("A", "誰かの未来が少し動く予感", { revolist: 3, movmentor: 1 }, { logicalmaister: 1, arranger: 1 }, { future: 3, action: 1 }),
      choice("B", "必要な人にちゃんと届く見通し", { communicator: 2, imagemaister: 2 }, { revolist: 1, inforader: 1 }, { other: 2, expression: 2 }),
      choice("C", "根拠や条件がある程度そろった感覚", { inforader: 3, logicalmaister: 2 }, { revolist: 2, maxdesigner: 1 }, { structure: 3, self: 1 }),
      choice("D", "やる人たちが続けられる状態", { arranger: 2, premiercrafter: 2 }, { revolist: 1, soulowner: 1 }, { field: 2, structure: 2 }),
      choice("E", "今ここでやる意味を感じられること", { maxdesigner: 2, soulowner: 1 }, { revolist: 2, logicalmaister: 1 }, { future: 2, care: 1 }),
    ],
  },
  {
    id: 5,
    focusRole: "crazist",
    lens: "field",
    text: "みんなが同じ方向を見ているとき、ふと別の可能性が浮かびました。近いのは？",
    choices: [
      choice("A", "もう少し自分の中で確かめる", { crazist: 2, inforader: 1 }, { communicator: 2, logicalmaister: 1 }, { self: 2, future: 2 }),
      choice("B", "場に投げて、反応を見てみる", { crazist: 3, revolist: 1 }, { soulowner: 2, arranger: 1 }, { action: 2, future: 2 }),
      choice("C", "未来の選択肢として広げてみる", { maxdesigner: 3, revolist: 1 }, { logicalmaister: 2, premiercrafter: 1 }, { future: 3, expression: 1 }),
      choice("D", "伝わる形にしてから共有する", { logicalmaister: 2, imagemaister: 2 }, { crazist: 1, communicator: 1 }, { structure: 2, expression: 2 }),
      choice("E", "必要な人にだけ先に話してみる", { communicator: 2, soulowner: 1 }, { crazist: 2, maxdesigner: 1 }, { other: 3, care: 1 }),
    ],
  },
  {
    id: 6,
    focusRole: "crazist",
    lens: "start",
    text: "普通なら選ばない案が、なぜか気になります。あなたならどう扱いますか？",
    choices: [
      choice("A", "安全に試せる小さな実験にする", { crazist: 3, revolist: 1 }, { premiercrafter: 2, logicalmaister: 1 }, { action: 2, future: 2 }),
      choice("B", "どこが面白いのか言葉にしてみる", { logicalmaister: 2, imagemaister: 2 }, { crazist: 1, communicator: 1 }, { structure: 2, expression: 2 }),
      choice("C", "似た違和感を持つ人を探す", { communicator: 2, maxdesigner: 1 }, { crazist: 2, soulowner: 1 }, { other: 3, future: 1 }),
      choice("D", "まず材料を集めて可能性を見極める", { inforader: 3, logicalmaister: 1 }, { crazist: 2, revolist: 1 }, { structure: 2, self: 2 }),
      choice("E", "今の場に出してよい温度かを見る", { soulowner: 2, arranger: 2 }, { crazist: 2, communicator: 1 }, { care: 2, field: 2 }),
    ],
  },
  {
    id: 7,
    focusRole: "crazist",
    lens: "team",
    text: "チームに新しい視点を入れるなら、あなたが安心する形は？",
    choices: [
      choice("A", "まず自由に発想を出せる時間を作る", { crazist: 2, maxdesigner: 2 }, { logicalmaister: 1, arranger: 1 }, { future: 3, expression: 1 }),
      choice("B", "出た発想をあとで整理する役割も置く", { logicalmaister: 3, arranger: 1 }, { crazist: 2, maxdesigner: 1 }, { structure: 3, field: 1 }),
      choice("C", "反応を見ながら少しずつ混ぜる", { communicator: 2, soulowner: 2 }, { crazist: 1, revolist: 1 }, { other: 2, care: 2 }),
      choice("D", "すぐ形にできる人と組ませる", { premiercrafter: 2, revolist: 2 }, { crazist: 2, imagemaister: 1 }, { action: 2, structure: 1 }),
      choice("E", "世界観や見せ方から興味を持ってもらう", { imagemaister: 3, maxdesigner: 1 }, { communicator: 1, crazist: 1 }, { expression: 3, future: 1 }),
    ],
  },
  {
    id: 8,
    focusRole: "crazist",
    lens: "decision",
    text: "少し変わった案を残すかどうか迷っています。判断の決め手に近いのは？",
    choices: [
      choice("A", "小さく試したときに何か動きそうか", { revolist: 2, crazist: 2 }, { logicalmaister: 1, premiercrafter: 1 }, { action: 3, future: 1 }),
      choice("B", "今の常識を少し広げる意味があるか", { crazist: 3, maxdesigner: 1 }, { communicator: 1, logicalmaister: 1 }, { future: 3, self: 1 }),
      choice("C", "人に伝わる言葉へ置き換えられるか", { logicalmaister: 3, imagemaister: 1 }, { crazist: 2, communicator: 1 }, { structure: 3, expression: 1 }),
      choice("D", "関わる人が不安になりすぎないか", { soulowner: 3, arranger: 1 }, { crazist: 2, revolist: 1 }, { care: 3, field: 1 }),
      choice("E", "必要な材料や根拠を集められるか", { inforader: 3, premiercrafter: 1 }, { crazist: 1, logicalmaister: 1 }, { structure: 2, self: 2 }),
    ],
  },
  {
    id: 9,
    focusRole: "maxdesigner",
    lens: "field",
    text: "いくつかの素材が集まっています。あなたが見つけたくなるのは？",
    choices: [
      choice("A", "組み合わせた先にある新しい体験", { maxdesigner: 3, crazist: 1 }, { premiercrafter: 2, logicalmaister: 1 }, { future: 3, expression: 1 }),
      choice("B", "人に届く見せ方や名前", { imagemaister: 3, communicator: 1 }, { maxdesigner: 1, inforader: 1 }, { expression: 3, other: 1 }),
      choice("C", "実際に動かすための順番", { arranger: 3, logicalmaister: 1 }, { maxdesigner: 2, revolist: 1 }, { structure: 2, action: 1 }),
      choice("D", "足りていない情報や条件", { inforader: 3, premiercrafter: 1 }, { maxdesigner: 1, logicalmaister: 1 }, { structure: 2, self: 2 }),
      choice("E", "誰が加わるともっと広がるか", { communicator: 2, arranger: 1 }, { maxdesigner: 2, soulowner: 1 }, { other: 3, field: 1 }),
    ],
  },
  {
    id: 10,
    focusRole: "maxdesigner",
    lens: "start",
    text: "ひとつの案を見た瞬間、あなたの頭の中で動き出しやすいものは？",
    choices: [
      choice("A", "別の展開や見せ方", { maxdesigner: 3, imagemaister: 1 }, { logicalmaister: 2, premiercrafter: 1 }, { future: 3, expression: 1 }),
      choice("B", "今すぐ試せる最初の一歩", { revolist: 3, movmentor: 1 }, { arranger: 1, maxdesigner: 1 }, { action: 3, future: 1 }),
      choice("C", "その案の意味や構造", { logicalmaister: 3, inforader: 1 }, { maxdesigner: 2, communicator: 1 }, { structure: 3, self: 1 }),
      choice("D", "誰に届くと価値が生まれるか", { communicator: 2, soulowner: 1 }, { maxdesigner: 2, imagemaister: 1 }, { other: 3, expression: 1 }),
      choice("E", "もっと尖らせるならどこか", { crazist: 3, maxdesigner: 1 }, { logicalmaister: 1, soulowner: 1 }, { future: 3, self: 1 }),
    ],
  },
  {
    id: 11,
    focusRole: "maxdesigner",
    lens: "team",
    text: "チームで企画を育てるとき、あなたがあると嬉しい役割は？",
    choices: [
      choice("A", "可能性を一緒に面白がる人", { crazist: 2, maxdesigner: 2 }, { logicalmaister: 1, premiercrafter: 1 }, { future: 3, other: 1 }),
      choice("B", "広がった案を構造へ戻す人", { logicalmaister: 3, arranger: 1 }, { maxdesigner: 2, revolist: 1 }, { structure: 3, field: 1 }),
      choice("C", "魅力が伝わる形にする人", { imagemaister: 3, communicator: 1 }, { maxdesigner: 1, premiercrafter: 1 }, { expression: 3, other: 1 }),
      choice("D", "最後まで品質を育てる人", { premiercrafter: 3, inforader: 1 }, { maxdesigner: 2, imagemaister: 1 }, { structure: 2, care: 1 }),
      choice("E", "人が入りやすい場を作る人", { communicator: 2, soulowner: 2 }, { maxdesigner: 1, arranger: 1 }, { other: 2, care: 2 }),
    ],
  },
  {
    id: 12,
    focusRole: "maxdesigner",
    lens: "decision",
    text: "アイデアをひとつ選ぶ場面です。あなたが納得しやすい選び方は？",
    choices: [
      choice("A", "未来の選択肢が一番増えるものを選ぶ", { maxdesigner: 3, revolist: 1 }, { logicalmaister: 1, arranger: 1 }, { future: 3, action: 1 }),
      choice("B", "人に一番伝わりやすいものを選ぶ", { imagemaister: 2, communicator: 2 }, { maxdesigner: 1, inforader: 1 }, { expression: 2, other: 2 }),
      choice("C", "実現条件が見えているものを選ぶ", { logicalmaister: 2, premiercrafter: 2 }, { maxdesigner: 2, revolist: 1 }, { structure: 3, self: 1 }),
      choice("D", "みんなが持ち寄りやすいものを選ぶ", { arranger: 2, soulowner: 2 }, { maxdesigner: 1, communicator: 1 }, { field: 2, care: 2 }),
      choice("E", "まだ誰も見ていない余白があるものを選ぶ", { crazist: 3, maxdesigner: 2 }, { logicalmaister: 2, premiercrafter: 1 }, { future: 3, self: 1 }),
    ],
  },
  {
    id: 13,
    focusRole: "imagemaister",
    lens: "field",
    text: "良い内容なのに、まだ魅力が伝わっていないと感じます。最初に触りたくなるのは？",
    choices: [
      choice("A", "世界観や見え方を整える", { imagemaister: 3, maxdesigner: 1 }, { logicalmaister: 1, communicator: 1 }, { expression: 3, future: 1 }),
      choice("B", "一言で伝わる言葉へ磨く", { logicalmaister: 2, imagemaister: 2 }, { communicator: 1, inforader: 1 }, { structure: 2, expression: 2 }),
      choice("C", "誰に届くと意味が生まれるか考える", { communicator: 2, maxdesigner: 2 }, { imagemaister: 1, soulowner: 1 }, { other: 3, future: 1 }),
      choice("D", "まず試して、反応から見せ方を変える", { revolist: 2, premiercrafter: 1 }, { imagemaister: 2, inforader: 1 }, { action: 2, expression: 1 }),
      choice("E", "なぜ伝わりにくいのか材料を集める", { inforader: 3, logicalmaister: 1 }, { imagemaister: 1, communicator: 1 }, { structure: 2, self: 2 }),
    ],
  },
  {
    id: 14,
    focusRole: "imagemaister",
    lens: "start",
    text: "まだ形のない想いを、誰かに届けるとしたら何から始めますか？",
    choices: [
      choice("A", "その想いの空気感を表す言葉を探す", { imagemaister: 3, soulowner: 1 }, { logicalmaister: 1, communicator: 1 }, { expression: 3, care: 1 }),
      choice("B", "見える形やイメージにしてみる", { imagemaister: 3, maxdesigner: 1 }, { premiercrafter: 1, communicator: 1 }, { expression: 3, future: 1 }),
      choice("C", "誰に届くと意味が生まれるか考える", { communicator: 2, maxdesigner: 2 }, { imagemaister: 1, arranger: 1 }, { other: 3, future: 1 }),
      choice("D", "まず伝える順番を整える", { logicalmaister: 3, imagemaister: 1 }, { communicator: 1, revolist: 1 }, { structure: 3, expression: 1 }),
      choice("E", "小さく出して反応を受け取る", { revolist: 2, premiercrafter: 1 }, { imagemaister: 2, soulowner: 1 }, { action: 2, care: 1 }),
    ],
  },
  {
    id: 15,
    focusRole: "imagemaister",
    lens: "team",
    text: "チームの想いを外へ届けるとき、あなたが大切にしたいものは？",
    choices: [
      choice("A", "見た瞬間に伝わる雰囲気", { imagemaister: 3, maxdesigner: 1 }, { logicalmaister: 1, communicator: 1 }, { expression: 3, future: 1 }),
      choice("B", "誤解なく届く言葉の順番", { logicalmaister: 3, inforader: 1 }, { imagemaister: 1, communicator: 1 }, { structure: 3, expression: 1 }),
      choice("C", "受け取る人との距離感", { communicator: 3, soulowner: 1 }, { imagemaister: 1, maxdesigner: 1 }, { other: 3, care: 1 }),
      choice("D", "出した後も信頼される品質", { premiercrafter: 3, inforader: 1 }, { imagemaister: 2, arranger: 1 }, { structure: 2, care: 1 }),
      choice("E", "新しい人が興味を持てる入口", { maxdesigner: 2, revolist: 1 }, { imagemaister: 2, communicator: 1 }, { future: 2, action: 1 }),
    ],
  },
  {
    id: 16,
    focusRole: "imagemaister",
    lens: "decision",
    text: "表現を出す直前、最後に確認したくなるのは？",
    choices: [
      choice("A", "想いの温度がちゃんと残っているか", { imagemaister: 3, soulowner: 1 }, { logicalmaister: 1, premiercrafter: 1 }, { expression: 3, care: 1 }),
      choice("B", "見る人が迷わず受け取れるか", { communicator: 2, logicalmaister: 2 }, { imagemaister: 1, inforader: 1 }, { other: 2, structure: 2 }),
      choice("C", "細部が信頼できる仕上がりか", { premiercrafter: 3, inforader: 1 }, { imagemaister: 2, maxdesigner: 1 }, { structure: 2, self: 1 }),
      choice("D", "未来へ広がる余白があるか", { maxdesigner: 3, crazist: 1 }, { imagemaister: 1, logicalmaister: 1 }, { future: 3, expression: 1 }),
      choice("E", "今出すことで誰かの一歩になるか", { movmentor: 2, revolist: 2 }, { imagemaister: 1, soulowner: 1 }, { action: 2, other: 1 }),
    ],
  },
  {
    id: 17,
    focusRole: "logicalmaister",
    lens: "field",
    text: "感覚的な話がたくさん出ています。あなたが自然にしていることは？",
    choices: [
      choice("A", "大事な言葉を拾って、見出しにする", { imagemaister: 2, logicalmaister: 2 }, { communicator: 1, soulowner: 1 }, { expression: 2, structure: 2 }),
      choice("B", "話の順番や構造を頭の中で並べる", { logicalmaister: 3, inforader: 1 }, { revolist: 1, maxdesigner: 1 }, { structure: 3, self: 1 }),
      choice("C", "まだ言葉になっていない気配を受け止める", { soulowner: 3, imagemaister: 1 }, { logicalmaister: 1, communicator: 1 }, { care: 3, expression: 1 }),
      choice("D", "そこから広がる未来の絵を考える", { maxdesigner: 3, revolist: 1 }, { logicalmaister: 1, premiercrafter: 1 }, { future: 3, action: 1 }),
      choice("E", "誰がどこを担うと進むかを見る", { arranger: 3, communicator: 1 }, { logicalmaister: 1, revolist: 1 }, { field: 3, other: 1 }),
    ],
  },
  {
    id: 18,
    focusRole: "logicalmaister",
    lens: "start",
    text: "複雑な話を短く共有することになりました。あなたがまず考えるのは？",
    choices: [
      choice("A", "何を一番伝えると動きやすいか", { logicalmaister: 3, movmentor: 1 }, { communicator: 1, revolist: 1 }, { structure: 3, action: 1 }),
      choice("B", "どんな順番なら誤解が少ないか", { logicalmaister: 3, soulowner: 1 }, { imagemaister: 1, communicator: 1 }, { structure: 3, care: 1 }),
      choice("C", "どの事実が判断材料になるか", { inforader: 3, logicalmaister: 1 }, { revolist: 1, arranger: 1 }, { self: 2, structure: 2 }),
      choice("D", "誰に渡すと次へ進むか", { arranger: 2, communicator: 2 }, { logicalmaister: 1, movmentor: 1 }, { other: 3, field: 1 }),
      choice("E", "どう見せると受け取りやすいか", { imagemaister: 3, premiercrafter: 1 }, { logicalmaister: 1, communicator: 1 }, { expression: 3, care: 1 }),
    ],
  },
  {
    id: 19,
    focusRole: "logicalmaister",
    lens: "team",
    text: "チームの話がふわっと広がっています。あなたがあると助かるものは？",
    choices: [
      choice("A", "全員が見られる仮の地図", { logicalmaister: 3, arranger: 1 }, { maxdesigner: 1, revolist: 1 }, { structure: 3, field: 1 }),
      choice("B", "動き出すための最初の実験", { revolist: 2, movmentor: 2 }, { logicalmaister: 1, premiercrafter: 1 }, { action: 3, future: 1 }),
      choice("C", "誰が何を持ち寄れるかの確認", { arranger: 3, communicator: 1 }, { logicalmaister: 1, soulowner: 1 }, { field: 3, other: 1 }),
      choice("D", "魅力が伝わる見出し", { imagemaister: 2, maxdesigner: 2 }, { logicalmaister: 1, communicator: 1 }, { expression: 2, future: 2 }),
      choice("E", "話しきれていない人の声", { soulowner: 3, communicator: 1 }, { logicalmaister: 1, arranger: 1 }, { care: 3, other: 1 }),
    ],
  },
  {
    id: 20,
    focusRole: "logicalmaister",
    lens: "decision",
    text: "結論を出す前に、あなたが確認したいことは？",
    choices: [
      choice("A", "判断の理由をあとから説明できるか", { logicalmaister: 3, inforader: 1 }, { communicator: 1, revolist: 1 }, { structure: 3, self: 1 }),
      choice("B", "それで人が動きやすくなるか", { movmentor: 2, arranger: 2 }, { logicalmaister: 1, soulowner: 1 }, { action: 2, field: 2 }),
      choice("C", "未来の選択肢を狭めすぎていないか", { maxdesigner: 2, crazist: 2 }, { logicalmaister: 1, premiercrafter: 1 }, { future: 3, self: 1 }),
      choice("D", "受け取る人に無理が出ないか", { soulowner: 2, communicator: 1 }, { logicalmaister: 1, arranger: 1 }, { care: 3, other: 1 }),
      choice("E", "品質や継続性が保てるか", { premiercrafter: 3, arranger: 1 }, { logicalmaister: 1, revolist: 1 }, { structure: 2, field: 1 }),
    ],
  },
  {
    id: 21,
    focusRole: "inforader",
    lens: "field",
    text: "小さな情報や違和感を見つけました。あなたの中で起きやすい動きは？",
    choices: [
      choice("A", "後で判断材料になりそうなので拾っておく", { inforader: 3, premiercrafter: 1 }, { communicator: 1, revolist: 1 }, { self: 2, structure: 2 }),
      choice("B", "そこから新しい可能性がないか考える", { crazist: 2, maxdesigner: 2 }, { inforader: 1, logicalmaister: 1 }, { future: 3, self: 1 }),
      choice("C", "誰に共有すると役に立つか考える", { communicator: 2, arranger: 2 }, { inforader: 1, soulowner: 1 }, { other: 3, field: 1 }),
      choice("D", "分かりやすく整理してから出す", { logicalmaister: 3, inforader: 1 }, { communicator: 1, imagemaister: 1 }, { structure: 3, expression: 1 }),
      choice("E", "場が不安にならない伝え方を考える", { soulowner: 2, imagemaister: 2 }, { inforader: 1, communicator: 1 }, { care: 2, expression: 2 }),
    ],
  },
  {
    id: 22,
    focusRole: "inforader",
    lens: "start",
    text: "何かを決める前に、あなたがあると安心するものは？",
    choices: [
      choice("A", "判断材料になる事実や背景", { inforader: 3, logicalmaister: 1 }, { revolist: 1, maxdesigner: 1 }, { structure: 3, self: 1 }),
      choice("B", "それぞれの人の本音や温度感", { soulowner: 2, communicator: 2 }, { inforader: 1, arranger: 1 }, { care: 2, other: 2 }),
      choice("C", "まず試せる小さな一歩", { revolist: 2, movmentor: 2 }, { inforader: 1, premiercrafter: 1 }, { action: 3, future: 1 }),
      choice("D", "未来の選択肢が増える見立て", { maxdesigner: 3, crazist: 1 }, { logicalmaister: 1, inforader: 1 }, { future: 3, self: 1 }),
      choice("E", "続けるための段取りや役割", { arranger: 3, premiercrafter: 1 }, { inforader: 1, revolist: 1 }, { field: 2, structure: 2 }),
    ],
  },
  {
    id: 23,
    focusRole: "inforader",
    lens: "team",
    text: "情報がたくさん集まりました。チームで使える形にするなら？",
    choices: [
      choice("A", "比較できるように並べる", { inforader: 3, logicalmaister: 1 }, { communicator: 1, arranger: 1 }, { structure: 3, self: 1 }),
      choice("B", "大事な発見だけ短く共有する", { communicator: 2, imagemaister: 1 }, { inforader: 2, logicalmaister: 1 }, { other: 2, expression: 2 }),
      choice("C", "次の行動につながる材料にする", { movmentor: 2, revolist: 2 }, { inforader: 1, arranger: 1 }, { action: 3, future: 1 }),
      choice("D", "誰が何を判断するかに合わせて渡す", { arranger: 3, logicalmaister: 1 }, { inforader: 1, communicator: 1 }, { field: 3, structure: 1 }),
      choice("E", "情報を受け取る人の不安を減らす", { soulowner: 2, premiercrafter: 1 }, { inforader: 2, communicator: 1 }, { care: 3, other: 1 }),
    ],
  },
  {
    id: 24,
    focusRole: "inforader",
    lens: "decision",
    text: "情報は十分ではありませんが、前に進む必要があります。近い判断は？",
    choices: [
      choice("A", "分かっていることと不明点を分ける", { inforader: 3, logicalmaister: 2 }, { revolist: 1, arranger: 1 }, { structure: 3, self: 1 }),
      choice("B", "小さく試して追加情報を得る", { revolist: 2, premiercrafter: 1 }, { inforader: 2, movmentor: 1 }, { action: 3, structure: 1 }),
      choice("C", "誰の感覚を聞けば補えるか考える", { communicator: 2, soulowner: 1 }, { inforader: 2, maxdesigner: 1 }, { other: 3, care: 1 }),
      choice("D", "未来の仮説を置いて動く", { maxdesigner: 2, crazist: 1 }, { inforader: 2, logicalmaister: 1 }, { future: 3, self: 1 }),
      choice("E", "無理なく戻れる選択を取る", { arranger: 2, premiercrafter: 2 }, { inforader: 1, soulowner: 1 }, { field: 2, care: 2 }),
    ],
  },
  {
    id: 25,
    focusRole: "premiercrafter",
    lens: "field",
    text: "みんなで作ったものを外に出す直前です。あなたが気になるのは？",
    choices: [
      choice("A", "受け取る人にちゃんと届く品質になっているか", { premiercrafter: 3, inforader: 1 }, { imagemaister: 1, communicator: 1 }, { structure: 2, care: 1 }),
      choice("B", "魅力が伝わる見え方になっているか", { imagemaister: 3, premiercrafter: 1 }, { maxdesigner: 1, communicator: 1 }, { expression: 3, structure: 1 }),
      choice("C", "今すぐ出して反応を見られるか", { revolist: 3, crazist: 1 }, { premiercrafter: 2, logicalmaister: 1 }, { action: 3, future: 1 }),
      choice("D", "出した後も続けられる仕組みがあるか", { premiercrafter: 2, logicalmaister: 2 }, { arranger: 1, revolist: 1 }, { structure: 3, field: 1 }),
      choice("E", "関わった人が誇れる形になっているか", { soulowner: 2, movmentor: 2 }, { premiercrafter: 1, imagemaister: 1 }, { care: 2, other: 2 }),
    ],
  },
  {
    id: 26,
    focusRole: "premiercrafter",
    lens: "start",
    text: "良いものをもう一段育てるなら、あなたが最初に見たいものは？",
    choices: [
      choice("A", "細部を磨くと信頼が増す場所", { premiercrafter: 3, inforader: 1 }, { imagemaister: 1, logicalmaister: 1 }, { structure: 2, self: 1 }),
      choice("B", "使う人がつまずきそうな場所", { soulowner: 2, logicalmaister: 2 }, { premiercrafter: 1, communicator: 1 }, { care: 2, structure: 2 }),
      choice("C", "もっと魅力が出る見せ方", { imagemaister: 3, maxdesigner: 1 }, { premiercrafter: 1, communicator: 1 }, { expression: 3, future: 1 }),
      choice("D", "まず試して改善できる場所", { revolist: 2, movmentor: 1 }, { premiercrafter: 2, inforader: 1 }, { action: 2, structure: 1 }),
      choice("E", "続ける人が無理なく扱える形", { arranger: 2, premiercrafter: 2 }, { soulowner: 1, logicalmaister: 1 }, { field: 2, care: 1 }),
    ],
  },
  {
    id: 27,
    focusRole: "premiercrafter",
    lens: "team",
    text: "勢いのあるチームに、品質を足すならどう関わりますか？",
    choices: [
      choice("A", "止めずに、最後だけ整える役を担う", { premiercrafter: 3, arranger: 1 }, { revolist: 2, maxdesigner: 1 }, { structure: 2, field: 1 }),
      choice("B", "早めに基準を共有しておく", { logicalmaister: 3, premiercrafter: 1 }, { communicator: 1, revolist: 1 }, { structure: 3, other: 1 }),
      choice("C", "見た目や印象から品質を伝える", { imagemaister: 2, premiercrafter: 2 }, { communicator: 1, maxdesigner: 1 }, { expression: 3, structure: 1 }),
      choice("D", "使う人の安心感を確認する", { soulowner: 2, inforader: 1 }, { premiercrafter: 2, communicator: 1 }, { care: 3, self: 1 }),
      choice("E", "まず出して、反応から磨く", { revolist: 2, crazist: 1 }, { premiercrafter: 2, inforader: 1 }, { action: 2, future: 1 }),
    ],
  },
  {
    id: 28,
    focusRole: "premiercrafter",
    lens: "decision",
    text: "完成のタイミングを決めるとき、あなたが納得しやすいのは？",
    choices: [
      choice("A", "信頼を損なわない品質になったと感じる", { premiercrafter: 3, inforader: 1 }, { revolist: 1, communicator: 1 }, { structure: 2, care: 1 }),
      choice("B", "伝わる魅力が十分に出ている", { imagemaister: 2, maxdesigner: 1 }, { premiercrafter: 2, communicator: 1 }, { expression: 2, future: 1 }),
      choice("C", "関わる人が次も続けられる", { arranger: 2, soulowner: 2 }, { premiercrafter: 1, movmentor: 1 }, { field: 2, care: 2 }),
      choice("D", "まず世に出して学べる状態になった", { revolist: 3, movmentor: 1 }, { premiercrafter: 2, logicalmaister: 1 }, { action: 3, future: 1 }),
      choice("E", "判断材料がそろい、説明できる", { logicalmaister: 2, inforader: 2 }, { premiercrafter: 1, maxdesigner: 1 }, { structure: 3, self: 1 }),
    ],
  },
  {
    id: 29,
    focusRole: "arranger",
    lens: "field",
    text: "人・予定・役割が少しズレています。あなたが気になるのは？",
    choices: [
      choice("A", "誰が何を持っているか", { arranger: 3, communicator: 1 }, { revolist: 1, soulowner: 1 }, { field: 3, other: 1 }),
      choice("B", "どこで流れが止まっているか", { arranger: 2, logicalmaister: 2 }, { movmentor: 1, maxdesigner: 1 }, { field: 2, structure: 2 }),
      choice("C", "必要な情報が足りているか", { inforader: 3, logicalmaister: 1 }, { arranger: 1, communicator: 1 }, { self: 2, structure: 2 }),
      choice("D", "誰かが無理していないか", { soulowner: 3, premiercrafter: 1 }, { arranger: 1, movmentor: 1 }, { care: 3, field: 1 }),
      choice("E", "思い切って流れを変えられないか", { crazist: 2, revolist: 2 }, { arranger: 2, logicalmaister: 1 }, { future: 2, action: 2 }),
    ],
  },
  {
    id: 30,
    focusRole: "arranger",
    lens: "start",
    text: "バラバラだった話を動ける流れにするなら、最初に置きたいものは？",
    choices: [
      choice("A", "誰が何を担うかの仮置き", { arranger: 3, logicalmaister: 1 }, { communicator: 1, soulowner: 1 }, { field: 3, structure: 1 }),
      choice("B", "みんなが話し始められる入口", { communicator: 3, soulowner: 1 }, { arranger: 1, movmentor: 1 }, { other: 3, care: 1 }),
      choice("C", "まず動ける小さな一歩", { revolist: 2, movmentor: 2 }, { arranger: 1, premiercrafter: 1 }, { action: 3, future: 1 }),
      choice("D", "意味が伝わる全体像", { logicalmaister: 2, maxdesigner: 2 }, { arranger: 1, imagemaister: 1 }, { structure: 2, future: 2 }),
      choice("E", "続けられる約束やリズム", { premiercrafter: 2, arranger: 2 }, { soulowner: 1, revolist: 1 }, { field: 2, structure: 1 }),
    ],
  },
  {
    id: 31,
    focusRole: "arranger",
    lens: "team",
    text: "チームに新しい人が加わります。あなたが見ておきたいのは？",
    choices: [
      choice("A", "その人が自然に持ち寄れるもの", { arranger: 2, movmentor: 2 }, { communicator: 1, soulowner: 1 }, { other: 3, field: 1 }),
      choice("B", "誰と組むと動きやすそうか", { communicator: 2, arranger: 2 }, { maxdesigner: 1, logicalmaister: 1 }, { other: 3, field: 1 }),
      choice("C", "役割が重なりすぎていないか", { logicalmaister: 2, inforader: 1 }, { arranger: 2, revolist: 1 }, { structure: 2, field: 2 }),
      choice("D", "安心して入れる空気か", { soulowner: 3, communicator: 1 }, { arranger: 1, movmentor: 1 }, { care: 3, other: 1 }),
      choice("E", "新しい可能性が生まれる組み合わせか", { maxdesigner: 2, crazist: 1 }, { arranger: 2, revolist: 1 }, { future: 3, field: 1 }),
    ],
  },
  {
    id: 32,
    focusRole: "arranger",
    lens: "decision",
    text: "役割分担を決める場面です。あなたが避けたいのは？",
    choices: [
      choice("A", "誰かが一人で抱えすぎること", { arranger: 3, soulowner: 1 }, { communicator: 1, movmentor: 1 }, { field: 2, care: 2 }),
      choice("B", "面白い可能性が消えてしまうこと", { maxdesigner: 2, crazist: 2 }, { arranger: 1, logicalmaister: 1 }, { future: 3, self: 1 }),
      choice("C", "動く順番が見えなくなること", { logicalmaister: 3, arranger: 1 }, { revolist: 1, premiercrafter: 1 }, { structure: 3, field: 1 }),
      choice("D", "人に届く入口がなくなること", { communicator: 2, imagemaister: 2 }, { arranger: 1, soulowner: 1 }, { other: 2, expression: 2 }),
      choice("E", "品質や継続性が後回しになること", { premiercrafter: 3, inforader: 1 }, { arranger: 1, revolist: 1 }, { structure: 2, self: 1 }),
    ],
  },
  {
    id: 33,
    focusRole: "communicator",
    lens: "field",
    text: "初対面の場で、少し静かな時間が流れました。自然に目がいくのは？",
    choices: [
      choice("A", "誰と誰が話すと面白そうか", { communicator: 3, maxdesigner: 1 }, { arranger: 1, soulowner: 1 }, { other: 3, future: 1 }),
      choice("B", "最初の一言を置くタイミング", { communicator: 2, revolist: 2 }, { soulowner: 1, logicalmaister: 1 }, { action: 2, other: 2 }),
      choice("C", "安心して話せていない人がいないか", { soulowner: 3, movmentor: 1 }, { communicator: 1, arranger: 1 }, { care: 3, other: 1 }),
      choice("D", "話題が散らからないようにする流れ", { arranger: 3, logicalmaister: 1 }, { communicator: 1, imagemaister: 1 }, { field: 3, structure: 1 }),
      choice("E", "場に新しい風が入る問い", { crazist: 2, imagemaister: 2 }, { communicator: 1, maxdesigner: 1 }, { future: 2, expression: 2 }),
    ],
  },
  {
    id: 34,
    focusRole: "communicator",
    lens: "start",
    text: "誰かと誰かが出会うと、何か動きそうです。あなたがしたくなるのは？",
    choices: [
      choice("A", "二人が話しやすい入口を作る", { communicator: 3, soulowner: 1 }, { arranger: 1, movmentor: 1 }, { other: 3, care: 1 }),
      choice("B", "その組み合わせの面白さを言葉にする", { maxdesigner: 2, imagemaister: 1 }, { communicator: 2, logicalmaister: 1 }, { future: 2, expression: 2 }),
      choice("C", "まず一緒にできる小さなことを置く", { movmentor: 2, revolist: 2 }, { communicator: 1, premiercrafter: 1 }, { action: 3, other: 1 }),
      choice("D", "必要な情報を先に共有する", { inforader: 2, logicalmaister: 2 }, { communicator: 1, arranger: 1 }, { structure: 2, other: 1 }),
      choice("E", "無理につなげず、自然なタイミングを見る", { soulowner: 2, arranger: 2 }, { communicator: 1, revolist: 1 }, { care: 2, field: 2 }),
    ],
  },
  {
    id: 35,
    focusRole: "communicator",
    lens: "team",
    text: "チームの中で会話が一部に偏っています。あなたが置きたいものは？",
    choices: [
      choice("A", "まだ話していない人が入れる問い", { communicator: 3, soulowner: 1 }, { arranger: 1, logicalmaister: 1 }, { other: 3, care: 1 }),
      choice("B", "話題を整理する短いまとめ", { logicalmaister: 2, inforader: 1 }, { communicator: 2, imagemaister: 1 }, { structure: 2, expression: 1 }),
      choice("C", "場の空気を少し変えるきっかけ", { arranger: 2, revolist: 1 }, { communicator: 2, soulowner: 1 }, { field: 2, action: 1 }),
      choice("D", "面白い視点が混ざる余白", { crazist: 2, maxdesigner: 2 }, { communicator: 1, logicalmaister: 1 }, { future: 3, self: 1 }),
      choice("E", "次の一歩を言いやすくする応援", { movmentor: 3, communicator: 1 }, { soulowner: 1, revolist: 1 }, { action: 2, other: 2 }),
    ],
  },
  {
    id: 36,
    focusRole: "communicator",
    lens: "decision",
    text: "誰かに紹介するか迷っています。あなたが大切にする判断は？",
    choices: [
      choice("A", "お互いの持ち味が活きそうか", { communicator: 3, arranger: 1 }, { maxdesigner: 1, soulowner: 1 }, { other: 3, field: 1 }),
      choice("B", "今のタイミングで無理がないか", { soulowner: 2, premiercrafter: 1 }, { communicator: 2, revolist: 1 }, { care: 3, field: 1 }),
      choice("C", "話すと未来が広がりそうか", { maxdesigner: 2, revolist: 1 }, { communicator: 2, logicalmaister: 1 }, { future: 3, other: 1 }),
      choice("D", "必要な情報がちゃんと渡せるか", { inforader: 2, logicalmaister: 2 }, { communicator: 1, arranger: 1 }, { structure: 2, other: 1 }),
      choice("E", "まず小さな接点で試せるか", { movmentor: 2, revolist: 1 }, { communicator: 2, premiercrafter: 1 }, { action: 2, other: 2 }),
    ],
  },
  {
    id: 37,
    focusRole: "movmentor",
    lens: "field",
    text: "誰かが挑戦の前で少し止まっています。あなたが渡したくなるのは？",
    choices: [
      choice("A", "その人がすでに持っている良さ", { movmentor: 3, soulowner: 1 }, { imagemaister: 1, communicator: 1 }, { other: 3, care: 1 }),
      choice("B", "最初の一歩にできる小さな行動", { movmentor: 2, revolist: 2 }, { arranger: 1, premiercrafter: 1 }, { action: 3, other: 1 }),
      choice("C", "不安を一緒にほどく時間", { soulowner: 3, logicalmaister: 1 }, { movmentor: 1, communicator: 1 }, { care: 3, structure: 1 }),
      choice("D", "必要な人や場所につながる入口", { communicator: 3, arranger: 1 }, { movmentor: 1, revolist: 1 }, { other: 3, field: 1 }),
      choice("E", "挑戦がもっと面白くなる別の見方", { maxdesigner: 2, crazist: 2 }, { movmentor: 1, logicalmaister: 1 }, { future: 3, expression: 1 }),
    ],
  },
  {
    id: 38,
    focusRole: "movmentor",
    lens: "start",
    text: "誰かが一歩進んだあと、あなたが自然にしたくなるのは？",
    choices: [
      choice("A", "その一歩をちゃんと見ていたと伝える", { movmentor: 3, soulowner: 1 }, { communicator: 1, imagemaister: 1 }, { other: 3, care: 1 }),
      choice("B", "次に進みやすい小さな道を一緒に探す", { movmentor: 3, revolist: 1 }, { arranger: 1, logicalmaister: 1 }, { action: 3, other: 1 }),
      choice("C", "続けやすい環境を整える", { premiercrafter: 2, arranger: 2 }, { movmentor: 1, soulowner: 1 }, { field: 2, structure: 2 }),
      choice("D", "その人の動きが誰につながるか考える", { communicator: 2, maxdesigner: 1 }, { movmentor: 2, arranger: 1 }, { other: 3, future: 1 }),
      choice("E", "経験を言葉にして残す", { logicalmaister: 2, imagemaister: 1 }, { movmentor: 1, inforader: 1 }, { structure: 2, expression: 1 }),
    ],
  },
  {
    id: 39,
    focusRole: "movmentor",
    lens: "team",
    text: "チームの誰かの良さが、まだ本人に届いていないように見えます。自然にしたいのは？",
    choices: [
      choice("A", "その良さを本人に言葉で返す", { movmentor: 3, imagemaister: 1 }, { soulowner: 1, communicator: 1 }, { other: 3, expression: 1 }),
      choice("B", "その良さが活きる場につなぐ", { communicator: 2, arranger: 2 }, { movmentor: 1, revolist: 1 }, { field: 2, other: 2 }),
      choice("C", "安心して受け取れる空気を作る", { soulowner: 3, movmentor: 1 }, { communicator: 1, logicalmaister: 1 }, { care: 3, other: 1 }),
      choice("D", "実際に使える小さな機会を作る", { revolist: 2, movmentor: 2 }, { arranger: 1, premiercrafter: 1 }, { action: 3, other: 1 }),
      choice("E", "何が良さなのか整理して伝える", { logicalmaister: 3, inforader: 1 }, { movmentor: 1, imagemaister: 1 }, { structure: 3, expression: 1 }),
    ],
  },
  {
    id: 40,
    focusRole: "movmentor",
    lens: "decision",
    text: "誰かを応援するとき、あなたが大切にしたい距離感は？",
    choices: [
      choice("A", "本人が自分で選べる余白を残す", { soulowner: 2, movmentor: 2 }, { revolist: 1, communicator: 1 }, { care: 3, other: 1 }),
      choice("B", "動き出せる具体的な一歩を渡す", { movmentor: 3, logicalmaister: 1 }, { arranger: 1, premiercrafter: 1 }, { action: 3, structure: 1 }),
      choice("C", "可能性が広がる相手につなぐ", { communicator: 2, maxdesigner: 1 }, { movmentor: 2, soulowner: 1 }, { other: 3, future: 1 }),
      choice("D", "挑戦の意味を一緒に見つける", { revolist: 2, imagemaister: 1 }, { movmentor: 2, logicalmaister: 1 }, { future: 2, expression: 1 }),
      choice("E", "続けられるリズムを一緒に作る", { premiercrafter: 2, arranger: 2 }, { movmentor: 1, soulowner: 1 }, { field: 2, structure: 1 }),
    ],
  },
  {
    id: 41,
    focusRole: "soulowner",
    lens: "field",
    text: "場の空気が少し急ぎすぎていると感じます。あなたが置きたいものは？",
    choices: [
      choice("A", "一度呼吸できる余白", { soulowner: 3, premiercrafter: 1 }, { revolist: 1, movmentor: 1 }, { care: 3, field: 1 }),
      choice("B", "今決めることと後でよいことの整理", { logicalmaister: 2, arranger: 2 }, { soulowner: 1, inforader: 1 }, { structure: 2, field: 2 }),
      choice("C", "みんなが参加しやすい会話の入口", { communicator: 3, soulowner: 1 }, { arranger: 1, movmentor: 1 }, { other: 3, care: 1 }),
      choice("D", "まず進めるための一歩", { revolist: 2, movmentor: 2 }, { soulowner: 1, premiercrafter: 1 }, { action: 3, future: 1 }),
      choice("E", "この流れの先にある可能性", { maxdesigner: 3, crazist: 1 }, { soulowner: 1, logicalmaister: 1 }, { future: 3, self: 1 }),
    ],
  },
  {
    id: 42,
    focusRole: "soulowner",
    lens: "start",
    text: "誰かが普段より少し静かです。あなたが自然に選びやすい関わりは？",
    choices: [
      choice("A", "無理に聞き出さず、話せる空気を置く", { soulowner: 3, premiercrafter: 1 }, { communicator: 1, movmentor: 1 }, { care: 3, field: 1 }),
      choice("B", "その人が動きやすくなる一言を渡す", { movmentor: 3, communicator: 1 }, { soulowner: 1, revolist: 1 }, { action: 2, other: 2 }),
      choice("C", "必要なら話せる相手につなぐ", { communicator: 3, arranger: 1 }, { soulowner: 1, movmentor: 1 }, { other: 3, field: 1 }),
      choice("D", "何が起きているのか静かに観察する", { inforader: 2, soulowner: 2 }, { logicalmaister: 1, communicator: 1 }, { self: 2, care: 2 }),
      choice("E", "場の流れを少し変えて空気を軽くする", { arranger: 2, imagemaister: 1 }, { soulowner: 2, communicator: 1 }, { field: 2, expression: 1 }),
    ],
  },
  {
    id: 43,
    focusRole: "soulowner",
    lens: "team",
    text: "チームが前に進むほど、少し疲れも見えてきました。あなたが守りたいものは？",
    choices: [
      choice("A", "関わる人が自然体で戻れる場所", { soulowner: 3, communicator: 1 }, { revolist: 1, arranger: 1 }, { care: 3, field: 1 }),
      choice("B", "無理なく続けられる仕組み", { premiercrafter: 2, arranger: 2 }, { soulowner: 1, logicalmaister: 1 }, { structure: 2, field: 2 }),
      choice("C", "人の挑戦が消えない応援", { movmentor: 3, revolist: 1 }, { soulowner: 1, communicator: 1 }, { action: 2, other: 2 }),
      choice("D", "想いが伝わる表現", { imagemaister: 2, logicalmaister: 1 }, { soulowner: 2, communicator: 1 }, { expression: 2, care: 1 }),
      choice("E", "次の可能性が閉じない余白", { maxdesigner: 2, crazist: 1 }, { soulowner: 1, premiercrafter: 1 }, { future: 3, self: 1 }),
    ],
  },
  {
    id: 44,
    focusRole: "soulowner",
    lens: "decision",
    text: "最後に、誰かと未来を作るとしたら、あなたが一番大切にしたいことは？",
    choices: [
      choice("A", "ひとりで背負わず、持ち寄れること", { arranger: 2, soulowner: 2 }, { revolist: 1, communicator: 1 }, { field: 3, care: 1 }),
      choice("B", "まだない未来に火が灯ること", { revolist: 3, maxdesigner: 1 }, { logicalmaister: 1, soulowner: 1 }, { future: 3, action: 1 }),
      choice("C", "想いが人に届く形になること", { imagemaister: 2, communicator: 2 }, { soulowner: 1, premiercrafter: 1 }, { expression: 3, other: 1 }),
      choice("D", "続けられる信頼が積み上がること", { premiercrafter: 2, logicalmaister: 1 }, { soulowner: 2, arranger: 1 }, { structure: 2, care: 2 }),
      choice("E", "それぞれの可能性が引き出されること", { movmentor: 2, communicator: 1 }, { soulowner: 2, maxdesigner: 1 }, { other: 3, future: 1 }),
    ],
  },
];

export const MONITOR_SCENARIO_TOTAL_QUESTIONS = monitorScenarioQuestions.length;
