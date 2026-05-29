import type { RevoTypeKey } from "./revotypes";

export type MonitorDiagnosisKey = "role" | "team" | "match" | "growth";

export interface MonitorQuestion {
  id: number;
  text: string;
  scores: Partial<Record<RevoTypeKey, number>>;
}

// ── Revo Role: 今、強く使っている役割を測る ──────────────────────────
export const roleQuestions: MonitorQuestion[] = [
  {
    id: 1,
    text: "まだ誰も動いていないとき、最初に一歩を踏み出したくなる",
    scores: { revolist: 3, crazist: 2, movmentor: 1 },
  },
  {
    id: 2,
    text: "人の話を聞いていると、自然に相談役になることが多い",
    scores: { communicator: 3, soulowner: 2, movmentor: 1 },
  },
  {
    id: 3,
    text: "アイデアを聞くと、もっと面白くできないか考える",
    scores: { maxdesigner: 3, crazist: 2, revolist: 1 },
  },
  {
    id: 4,
    text: "全体の流れを整えたくなる",
    scores: { arranger: 3, logicalmaister: 2, premiercrafter: 1 },
  },
  {
    id: 5,
    text: "完成度や品質が気になる",
    scores: { premiercrafter: 3, logicalmaister: 2, inforader: 1 },
  },
  {
    id: 6,
    text: "人と人をつなぐのが好き",
    scores: { communicator: 3, arranger: 2, movmentor: 1 },
  },
  {
    id: 7,
    text: "情報を調べることが好き",
    scores: { inforader: 3, logicalmaister: 2, premiercrafter: 1 },
  },
  {
    id: 8,
    text: "困っている人を見ると放っておけない",
    scores: { movmentor: 3, soulowner: 2, communicator: 1 },
  },
  {
    id: 9,
    text: "普通とは違う方法を試したくなる",
    scores: { crazist: 3, maxdesigner: 2, revolist: 1 },
  },
  {
    id: 10,
    text: "人前に立つことに抵抗が少ない",
    scores: { revolist: 3, communicator: 2, movmentor: 1 },
  },
  {
    id: 11,
    text: "裏方の方が落ち着く",
    scores: { arranger: 3, premiercrafter: 2, inforader: 1 },
  },
  {
    id: 12,
    text: "感覚や世界観を大切にする",
    scores: { imagemaister: 3, soulowner: 2, crazist: 1 },
  },
  {
    id: 13,
    text: "理想や未来を語るのが好き",
    scores: { revolist: 3, maxdesigner: 2, crazist: 1 },
  },
  {
    id: 14,
    text: "みんなが楽しめる空気を作りたい",
    scores: { communicator: 3, movmentor: 2, soulowner: 1 },
  },
  {
    id: 15,
    text: "複雑なものを整理するのが好き",
    scores: { logicalmaister: 3, arranger: 2, inforader: 1 },
  },
  {
    id: 16,
    text: "ひとつのことを深く追求する",
    scores: { premiercrafter: 3, inforader: 2, logicalmaister: 1 },
  },
  {
    id: 17,
    text: "新しい挑戦を見るとワクワクする",
    scores: { crazist: 3, revolist: 2, maxdesigner: 1 },
  },
  {
    id: 18,
    text: "人の成長を見るのが嬉しい",
    scores: { movmentor: 3, soulowner: 2, communicator: 1 },
  },
];

// ── Revo Team: チーム内での立ち位置を測る ────────────────────────────
export const teamQuestions: MonitorQuestion[] = [
  {
    id: 1,
    text: "会議では最初に発言する方だ",
    scores: { revolist: 3, communicator: 2, crazist: 1 },
  },
  {
    id: 2,
    text: "意見をまとめることが多い",
    scores: { arranger: 3, logicalmaister: 2, communicator: 1 },
  },
  {
    id: 3,
    text: "縁の下の力持ちが好き",
    scores: { arranger: 3, premiercrafter: 2, soulowner: 1 },
  },
  {
    id: 4,
    text: "困っている人をサポートしたくなる",
    scores: { movmentor: 3, soulowner: 2, communicator: 1 },
  },
  {
    id: 5,
    text: "全体像を考える",
    scores: { logicalmaister: 3, arranger: 2, revolist: 1 },
  },
  {
    id: 6,
    text: "役割分担を考える",
    scores: { arranger: 3, logicalmaister: 2, premiercrafter: 1 },
  },
  {
    id: 7,
    text: "仲間を応援するのが好き",
    scores: { movmentor: 3, soulowner: 2, communicator: 1 },
  },
  {
    id: 8,
    text: "場の雰囲気を明るくしたい",
    scores: { communicator: 3, movmentor: 2, soulowner: 1 },
  },
  {
    id: 9,
    text: "問題点を見つけやすい",
    scores: { logicalmaister: 3, inforader: 2, premiercrafter: 1 },
  },
  {
    id: 10,
    text: "新しいアイデアを提案したい",
    scores: { maxdesigner: 3, crazist: 2, revolist: 1 },
  },
  {
    id: 11,
    text: "最後までやり切りたい",
    scores: { premiercrafter: 3, arranger: 2, logicalmaister: 1 },
  },
  {
    id: 12,
    text: "衝突が起きると仲裁したくなる",
    scores: { communicator: 3, arranger: 2, soulowner: 1 },
  },
  {
    id: 13,
    text: "人の才能を見つけるのが好き",
    scores: { movmentor: 3, soulowner: 2, communicator: 1 },
  },
  {
    id: 14,
    text: "目標を決めるのが好き",
    scores: { revolist: 3, logicalmaister: 2, arranger: 1 },
  },
  {
    id: 15,
    text: "仕組み化したくなる",
    scores: { logicalmaister: 3, arranger: 2, premiercrafter: 1 },
  },
  {
    id: 16,
    text: "誰かの背中を押したくなる",
    scores: { movmentor: 3, revolist: 2, soulowner: 1 },
  },
  {
    id: 17,
    text: "チーム全体の成長を考える",
    scores: { movmentor: 3, arranger: 2, logicalmaister: 1 },
  },
  {
    id: 18,
    text: "成果だけでなく関係性も大切だと思う",
    scores: { soulowner: 3, communicator: 2, movmentor: 1 },
  },
];

// ── Revo Match: 誰と組むと可能性が広がるかを測る ─────────────────────
export const matchQuestions: MonitorQuestion[] = [
  {
    id: 1,
    text: "自分を信じてくれる人がいると頑張れる",
    scores: { movmentor: 3, soulowner: 2, communicator: 1 },
  },
  {
    id: 2,
    text: "自由に任せてもらう方が力が出る",
    scores: { revolist: 3, crazist: 2, maxdesigner: 1 },
  },
  {
    id: 3,
    text: "背中を押してくれる人が必要だ",
    scores: { movmentor: 3, revolist: 2, soulowner: 1 },
  },
  {
    id: 4,
    text: "相談できる人がいると安心する",
    scores: { communicator: 3, soulowner: 2, movmentor: 1 },
  },
  {
    id: 5,
    text: "具体化してくれる人がいると進めやすい",
    scores: { premiercrafter: 3, arranger: 2, logicalmaister: 1 },
  },
  {
    id: 6,
    text: "アイデアを面白がってくれる人が好き",
    scores: { crazist: 3, maxdesigner: 2, revolist: 1 },
  },
  {
    id: 7,
    text: "本音を話せる人が必要だ",
    scores: { soulowner: 3, communicator: 2, movmentor: 1 },
  },
  {
    id: 8,
    text: "冷静な視点をくれる人がありがたい",
    scores: { logicalmaister: 3, inforader: 2, arranger: 1 },
  },
  {
    id: 9,
    text: "一緒に挑戦する仲間が欲しい",
    scores: { revolist: 3, crazist: 2, movmentor: 1 },
  },
  {
    id: 10,
    text: "優しく見守ってくれる人がいると頑張れる",
    scores: { soulowner: 3, movmentor: 2, communicator: 1 },
  },
  {
    id: 11,
    text: "客観的な意見を聞きたい",
    scores: { logicalmaister: 3, inforader: 2, arranger: 1 },
  },
  {
    id: 12,
    text: "行動力のある人に刺激を受ける",
    scores: { revolist: 3, crazist: 2, maxdesigner: 1 },
  },
  {
    id: 13,
    text: "感性の豊かな人に惹かれる",
    scores: { imagemaister: 3, soulowner: 2, crazist: 1 },
  },
  {
    id: 14,
    text: "整理上手な人と一緒に進めたい",
    scores: { arranger: 3, logicalmaister: 2, premiercrafter: 1 },
  },
  {
    id: 15,
    text: "違う価値観の人と話したい",
    scores: { crazist: 3, maxdesigner: 2, imagemaister: 1 },
  },
  {
    id: 16,
    text: "長く付き合える仲間が欲しい",
    scores: { communicator: 3, soulowner: 2, movmentor: 1 },
  },
  {
    id: 17,
    text: "チームで成果を出したい",
    scores: { arranger: 3, premiercrafter: 2, logicalmaister: 1 },
  },
  {
    id: 18,
    text: "自分にはない才能に興味がある",
    scores: { maxdesigner: 3, crazist: 2, imagemaister: 1 },
  },
];

// ── Revo Growth: 次に育てると良い役割・成長ルートを測る ──────────────
export const growthQuestions: MonitorQuestion[] = [
  {
    id: 1,
    text: "最近、新しい挑戦をした",
    scores: { crazist: 3, revolist: 2, maxdesigner: 1 },
  },
  {
    id: 2,
    text: "失敗から学ぶ方だ",
    scores: { revolist: 3, logicalmaister: 2, premiercrafter: 1 },
  },
  {
    id: 3,
    text: "苦手なことにも挑戦したい",
    scores: { crazist: 3, movmentor: 2, revolist: 1 },
  },
  {
    id: 4,
    text: "役割を変えてみたい",
    scores: { crazist: 3, maxdesigner: 2, revolist: 1 },
  },
  {
    id: 5,
    text: "今の自分を超えたい",
    scores: { revolist: 3, crazist: 2, maxdesigner: 1 },
  },
  {
    id: 6,
    text: "新しい人と出会いたい",
    scores: { communicator: 3, revolist: 2, crazist: 1 },
  },
  {
    id: 7,
    text: "活動の幅を広げたい",
    scores: { maxdesigner: 3, revolist: 2, communicator: 1 },
  },
  {
    id: 8,
    text: "誰かを応援したい",
    scores: { movmentor: 3, soulowner: 2, communicator: 1 },
  },
  {
    id: 9,
    text: "リーダー経験を増やしたい",
    scores: { revolist: 3, movmentor: 2, arranger: 1 },
  },
  {
    id: 10,
    text: "裏方経験もしてみたい",
    scores: { arranger: 3, premiercrafter: 2, inforader: 1 },
  },
  {
    id: 11,
    text: "表現力を伸ばしたい",
    scores: { imagemaister: 3, communicator: 2, soulowner: 1 },
  },
  {
    id: 12,
    text: "伝える力を伸ばしたい",
    scores: { communicator: 3, imagemaister: 2, revolist: 1 },
  },
  {
    id: 13,
    text: "人との関わりを増やしたい",
    scores: { communicator: 3, movmentor: 2, soulowner: 1 },
  },
  {
    id: 14,
    text: "専門性を深めたい",
    scores: { premiercrafter: 3, inforader: 2, logicalmaister: 1 },
  },
  {
    id: 15,
    text: "社会課題にも関わりたい",
    scores: { revolist: 3, movmentor: 2, soulowner: 1 },
  },
  {
    id: 16,
    text: "自分の可能性を試したい",
    scores: { crazist: 3, revolist: 2, maxdesigner: 1 },
  },
  {
    id: 17,
    text: "未来を変える挑戦がしたい",
    scores: { revolist: 3, crazist: 2, maxdesigner: 1 },
  },
  {
    id: 18,
    text: "誰かの人生のきっかけになりたい",
    scores: { movmentor: 3, soulowner: 2, communicator: 1 },
  },
];

export const monitorQuestionsMap: Record<MonitorDiagnosisKey, MonitorQuestion[]> = {
  role: roleQuestions,
  team: teamQuestions,
  match: matchQuestions,
  growth: growthQuestions,
};
