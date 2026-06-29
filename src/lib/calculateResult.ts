import { questions } from "@/data/questions";
import { revoTypes, type RevoTypeKey } from "@/data/revotypes";
import { activities, type Activity } from "@/data/activities";

export interface TypeScore {
  key: RevoTypeKey;
  score: number;
  percentage: number;
}

export interface DiagnosisResult {
  main: TypeScore;
  sub: TypeScore;
  auxiliary: TypeScore;
  allScores: TypeScore[];
  suggestedActivities: Activity[];
}

export function calculateResult(answers: number[]): DiagnosisResult {
  const raw: Record<RevoTypeKey, number> = {
    revolist: 0,
    maxdesigner: 0,
    imagemaister: 0,
    communicator: 0,
    inforader: 0,
    movmentor: 0,
    premiercrafter: 0,
    logicalmaister: 0,
    arranger: 0,
    soulowner: 0,
    crazist: 0,
  };

  questions.forEach((q, i) => {
    const value = answers[i] ?? 3;
    const selectedChoice = q.choices?.find((choice) => choice.value === value);
    const scores = selectedChoice?.scores ?? q.scores;

    for (const [typeKey, weight] of Object.entries(scores)) {
      raw[typeKey as RevoTypeKey] += selectedChoice ? (weight as number) : (weight as number) * value;
    }
  });

  const maxScore = Math.max(...Object.values(raw));
  const allScores: TypeScore[] = (Object.keys(raw) as RevoTypeKey[])
    .map((key) => ({
      key,
      score: raw[key],
      percentage: maxScore > 0 ? Math.round((raw[key] / maxScore) * 100) : 0,
    }))
    .sort((a, b) => b.score - a.score);

  const [main, sub, auxiliary] = allScores;

  const topKeys = [main.key, sub.key, auxiliary.key];
  const suggestedActivities = activities
    .filter((a) => a.suitableTypes.some((t) => topKeys.includes(t)))
    .slice(0, 4);

  return { main, sub, auxiliary, allScores, suggestedActivities };
}

export function encodeAnswers(answers: number[]): string {
  return answers.join("-");
}

export function decodeAnswers(encoded: string): number[] {
  return encoded.split("-").map(Number);
}

export function getComboDescription(
  mainKey: RevoTypeKey,
  subKey: RevoTypeKey,
  auxKey: RevoTypeKey
): string {
  const main = revoTypes[mainKey];
  const sub = revoTypes[subKey];
  const aux = revoTypes[auxKey];

  return `あなたは、${main.gives[0]}を自然に届けながら、${sub.gives[0]}も持ち合わせている人です。そこに${aux.name}の視点が加わることで、「${main.name}でありながら、${sub.name}の魅力も持つ」という唯一無二の組み合わせが生まれています。`;
}

export function getAwakeningDescription(
  mainKey: RevoTypeKey,
  subKey: RevoTypeKey,
  auxKey: RevoTypeKey
): string {
  const main = revoTypes[mainKey];
  const sub = revoTypes[subKey];
  const aux = revoTypes[auxKey];

  return `あなた（${main.name}）と${sub.name}が向き合うとき、最初はテンポの違いを感じることがあるかもしれません。でも、そこに${aux.name}が加わることで、互いの魅力が引き出され、役割の循環が生まれ始めます。3つの視点が重なる場所に、あなただけの可能性が宿っています。`;
}

export function getSleepingPotentialDescription(
  auxKey: RevoTypeKey
): string {
  const aux = revoTypes[auxKey];
  return `あなたの中には、まだ眠っている「${aux.name}」の力があります。${aux.description} 活動や出会いを重ねることで、この力が少しずつ育っていくかもしれません。`;
}

// 将来拡張: 111問フル診断
// export function calculateFullResult(answers: number[]): DiagnosisResult { ... }

// 将来拡張: チーム診断
// export function calculateTeamResult(memberResults: DiagnosisResult[]): TeamResult { ... }

// 将来拡張: 活動履歴によるタイプ変化
// export function applyActivityHistory(result: DiagnosisResult, history: ActivityHistory[]): DiagnosisResult { ... }

// 将来拡張: 相性診断
// export function calculateCompatibility(a: DiagnosisResult, b: DiagnosisResult): CompatibilityResult { ... }
