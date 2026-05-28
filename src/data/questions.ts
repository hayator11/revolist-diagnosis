import type { RevoTypeKey } from "./revotypes";

export interface Question {
  id: number;
  text: string;
  scores: Partial<Record<RevoTypeKey, number>>;
}

export const questions: Question[] = [
  {
    id: 1,
    text: "まだ誰も動いていない時、自分から一歩目を踏み出すことが多い",
    scores: { revolist: 3, movmentor: 1, crazist: 1 },
  },
  {
    id: 2,
    text: "アイデアを聞くと、もっと面白くできる方法を考えてしまう",
    scores: { maxdesigner: 3, crazist: 2, revolist: 1 },
  },
  {
    id: 3,
    text: "言葉よりも、雰囲気や見た目で伝わるものを大切にしたい",
    scores: { imagemaister: 3, soulowner: 1 },
  },
  {
    id: 4,
    text: "初対面の人とも、自然に会話を始められる",
    scores: { communicator: 3, movmentor: 1 },
  },
  {
    id: 5,
    text: "気になることがあると、まず調べたくなる",
    scores: { inforader: 3, logicalmaister: 1 },
  },
  {
    id: 6,
    text: "落ち込んでいる人を見ると、背中を押したくなる",
    scores: { movmentor: 3, soulowner: 2, communicator: 1 },
  },
  {
    id: 7,
    text: "細かい部分の完成度が気になる",
    scores: { premiercrafter: 3, logicalmaister: 1 },
  },
  {
    id: 8,
    text: "物事を進める前に、構造や流れを整理したくなる",
    scores: { logicalmaister: 3, arranger: 2 },
  },
  {
    id: 9,
    text: "人と人の間に入って、流れを整えることが多い",
    scores: { arranger: 3, communicator: 2 },
  },
  {
    id: 10,
    text: "誰かの本音や痛みに気づきやすい",
    scores: { soulowner: 3, communicator: 1 },
  },
  {
    id: 11,
    text: "普通のやり方ではなく、新しい方法を試したくなる",
    scores: { crazist: 3, revolist: 2, maxdesigner: 1 },
  },
  {
    id: 12,
    text: "夢や理想を語ると、自然と熱が入る",
    scores: { revolist: 3, movmentor: 2 },
  },
  {
    id: 13,
    text: "企画や活動の世界観を考えるのが好き",
    scores: { maxdesigner: 3, imagemaister: 1 },
  },
  {
    id: 14,
    text: "写真、映像、デザイン、表現に心が動きやすい",
    scores: { imagemaister: 3, maxdesigner: 1 },
  },
  {
    id: 15,
    text: "人が安心して話せる場を作りたい",
    scores: { soulowner: 3, communicator: 2, arranger: 1 },
  },
  {
    id: 16,
    text: "情報を集めて、人にわかりやすく伝えるのが好き",
    scores: { inforader: 3, logicalmaister: 1 },
  },
  {
    id: 17,
    text: "場の空気を明るくするのが得意",
    scores: { movmentor: 3, communicator: 2 },
  },
  {
    id: 18,
    text: "ひとつのものを丁寧に作り込む時間が好き",
    scores: { premiercrafter: 3, logicalmaister: 1 },
  },
  {
    id: 19,
    text: "混乱している状況を見ると、整理したくなる",
    scores: { arranger: 3, logicalmaister: 2 },
  },
  {
    id: 20,
    text: "表に立つ人よりも、裏側で支える役割にやりがいを感じる",
    scores: { arranger: 3, premiercrafter: 2, soulowner: 1 },
  },
  {
    id: 21,
    text: "常識から外れたアイデアにワクワクする",
    scores: { crazist: 3, maxdesigner: 2, revolist: 1 },
  },
];
