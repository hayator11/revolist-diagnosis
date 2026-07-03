import { activities, type Activity } from "@/data/activities";
import {
  entryDiagnosisQuestions,
  type EntryDiagnosisQuestion,
} from "@/data/entryDiagnosisQuestions";
import { revoTypes, type RevoTypeKey } from "@/data/revotypes";

export interface EntryTypeScore {
  key: RevoTypeKey;
  score: number;
  percentage: number;
}

export interface EntryDiagnosisResult {
  main: EntryTypeScore;
  sub: EntryTypeScore;
  auxiliary: EntryTypeScore;
  allScores: EntryTypeScore[];
  partnerTypes: RevoTypeKey[];
  suggestedActivities: Activity[];
}

const REVO_TYPE_KEYS = Object.keys(revoTypes) as RevoTypeKey[];

export function calculateEntryDiagnosisResult(answers: number[]): EntryDiagnosisResult {
  const raw = REVO_TYPE_KEYS.reduce(
    (scores, key) => ({ ...scores, [key]: 0 }),
    {} as Record<RevoTypeKey, number>
  );

  entryDiagnosisQuestions.forEach((question, index) => {
    const value = answers[index] ?? 3;
    const selectedChoice = question.choices.find((choice) => choice.value === value);
    const scores = selectedChoice?.scores ?? {};

    for (const [typeKey, weight] of Object.entries(scores)) {
      raw[typeKey as RevoTypeKey] += weight as number;
    }
  });

  const maxScore = Math.max(...Object.values(raw));
  const allScores = REVO_TYPE_KEYS
    .map((key) => ({
      key,
      score: raw[key],
      percentage: maxScore > 0 ? Math.round((raw[key] / maxScore) * 100) : 0,
    }))
    .sort((a, b) => b.score - a.score);

  const [main, sub, auxiliary] = allScores;
  const mainType = revoTypes[main.key];
  const partnerTypes = [
    mainType.teamDesign.bestPair,
    mainType.teamDesign.thirdPerson,
    ...mainType.goodWith,
  ].filter((key, index, array) => key !== main.key && array.indexOf(key) === index);

  const topKeys = [main.key, sub.key, auxiliary.key];
  const suggestedActivities = activities
    .filter((activity) => activity.suitableTypes.some((type) => topKeys.includes(type)))
    .slice(0, 3);

  return {
    main,
    sub,
    auxiliary,
    allScores,
    partnerTypes: partnerTypes.slice(0, 2),
    suggestedActivities,
  };
}

export function encodeEntryAnswers(answers: number[]): string {
  return answers.join("-");
}

export function decodeEntryAnswers(encoded: string): number[] {
  return encoded.split("-").map(Number);
}

export function isValidEntryAnswers(answers: number[]) {
  return (
    answers.length === entryDiagnosisQuestions.length &&
    answers.every((answer, index) =>
      entryDiagnosisQuestions[index].choices.some((choice) => choice.value === answer)
    )
  );
}

export function getEntryQuestionCount() {
  return entryDiagnosisQuestions.length;
}

export function getEntryResultNudge(mainKey: RevoTypeKey) {
  const mainType = revoTypes[mainKey];
  return `これは確定ラベルではなく、今のあなたに出やすい役割の入口です。${mainType.name}の力は、誰と組むか、どんな場にいるかでさらに育っていきます。`;
}

export function getEntryQuestionByIndex(index: number): EntryDiagnosisQuestion | undefined {
  return entryDiagnosisQuestions[index];
}
