import type { RevoTypeKey } from "./revotypes";

export interface Revo111Question {
  id: number;
  text: string;
  role: RevoTypeKey;
  scores: Partial<Record<RevoTypeKey, number>>;
}

const questionRows: Array<[string, RevoTypeKey]> = [
  ["まだ誰もやっていないことを見ると挑戦したくなる", "revolist"],
  ["失敗する可能性があってもまず動いてみる", "revolist"],
  ["未来の可能性を考えるのが好きだ", "revolist"],
  ["誰かが最初にやるのを待つより自分が動きたい", "revolist"],
  ["複数のアイデアを組み合わせるのが好きだ", "maxdesigner"],
  ["一つの答えより複数の可能性を考える", "maxdesigner"],
  ["企画やコンセプトを考えるのが好きだ", "maxdesigner"],
  ["新しい選択肢を思いつくことが多い", "maxdesigner"],
  ["頭の中で完成イメージを描くことが多い", "imagemaister"],
  ["世界観や雰囲気を大切にする", "imagemaister"],
  ["言葉やデザインで魅力を伝えるのが好きだ", "imagemaister"],
  ["感性を活かす場面が多い", "imagemaister"],
  ["人と人をつなぐことが好きだ", "communicator"],
  ["初対面でも会話を始めやすい", "communicator"],
  ["人の魅力を紹介したくなる", "communicator"],
  ["交流の場にいると元気になる", "communicator"],
  ["何かを決める前に調べることが多い", "inforader"],
  ["新しい情報を集めるのが好きだ", "inforader"],
  ["比較検討するのが得意だ", "inforader"],
  ["根拠があると安心できる", "inforader"],
  ["誰かを応援するのが好きだ", "movmentor"],
  ["人の背中を押すことが多い", "movmentor"],
  ["挑戦している人を見ると応援したくなる", "movmentor"],
  ["前向きな空気を作ることが好きだ", "movmentor"],
  ["細部まで丁寧に仕上げたい", "premiercrafter"],
  ["品質にはこだわりたい", "premiercrafter"],
  ["妥協するくらいなら時間をかけたい", "premiercrafter"],
  ["完成度を高めるのが好きだ", "premiercrafter"],
  ["物事を整理するのが得意だ", "logicalmaister"],
  ["複雑なものを構造化するのが好きだ", "logicalmaister"],
  ["感覚より理由を重視する", "logicalmaister"],
  ["仕組み化を考えることが多い", "logicalmaister"],
  ["全体を見ながら動くことが多い", "arranger"],
  ["役割分担を考えるのが得意だ", "arranger"],
  ["人や情報を調整することが多い", "arranger"],
  ["流れを整えるのが好きだ", "arranger"],
  ["人の話を聞くことが多い", "soulowner"],
  ["相談されることが多い", "soulowner"],
  ["安心できる空気を作りたい", "soulowner"],
  ["人の気持ちに気づきやすい", "soulowner"],
  ["普通と違う考え方をすることが多い", "crazist"],
  ["常識を疑うことがある", "crazist"],
  ["変わったアイデアを思いつく", "crazist"],
  ["面白そうならまず試したくなる", "crazist"],
];

export const revo111Questions: Revo111Question[] = questionRows.map(
  ([text, role], index) => ({
    id: index + 1,
    text,
    role,
    scores: { [role]: 1 },
  })
);

export const REVO111_TOTAL_QUESTIONS = revo111Questions.length;
