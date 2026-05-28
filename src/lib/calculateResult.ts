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
  // answers[i] は questions[i] に対する回答値 (1〜5)
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
    for (const [typeKey, weight] of Object.entries(q.scores)) {
      raw[typeKey as RevoTypeKey] += (weight as number) * value;
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

  // 上位3タイプに関連する活動を抽出
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
  subKey: RevoTypeKey
): string {
  const main = revoTypes[mainKey];
  const sub = revoTypes[subKey];

  // タイプ組み合わせの説明文を動的生成
  return `あなたは、${main.catchcopy}ながら、${sub.gives[0]}をも自然に渡せる人です。${main.name}としての力と、${sub.name}としての視点が重なることで、あなただけの独自の可能性が生まれています。`;
}

// 将来拡張: 111問フル診断への対応
// export function calculateFullResult(answers: number[]): DiagnosisResult { ... }

// 将来拡張: チーム診断
// export function calculateTeamResult(memberResults: DiagnosisResult[]): TeamResult { ... }

// 将来拡張: 活動履歴によるタイプ変化
// export function applyActivityHistory(result: DiagnosisResult, history: ActivityHistory[]): DiagnosisResult { ... }
