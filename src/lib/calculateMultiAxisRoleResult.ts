import type { RevoTypeKey } from "@/data/revotypes";
import { FORCE_KEYS, type ForceKey } from "@/lib/diagnosisCore/forces";
import {
  EMPTY_AXIS_SCORES,
  MULTI_AXIS_KEYS,
  RARITY_MIN_CONFIDENCE,
  ROLE_AXIS_PROFILES,
  answerToCentered,
  type AxisScores,
  type CenteredAnswerValue,
  type CenteredMultiAxisQuestion,
  type MultiAxisQuestion,
  type RawAnswerValue,
} from "@/lib/diagnosisCore/multiAxis";

export type MultiAxisJudgmentMode = "focused" | "dual" | "broad" | "low_confidence";

export interface MultiAxisRoleScore {
  role: RevoTypeKey;
  score: number;
  confidence: number;
  rarity: "common" | "balanced" | "rare";
  passesMinimumConfidence: boolean;
}

export interface MultiAxisRoleResult {
  axisScores: AxisScores;
  axisMaxScores: AxisScores;
  axisPct: AxisScores;
  roleScores: MultiAxisRoleScore[];
  mainRole: MultiAxisRoleScore | null;
  dualRole: MultiAxisRoleScore | null;
  mode: MultiAxisJudgmentMode;
  flatness: number;
}

export interface CenteredMultiAxisRoleResult {
  rawAnswers: number[];
  centeredAnswers: CenteredAnswerValue[];
  axisScores: AxisScores;
  roleScores: Record<RevoTypeKey, number>;
  forceScores: Record<ForceKey, number>;
  zeroAnswerIndexes: number[];
  zeroAnswerCount: number;
  rawAnswerMean: number;
  centeredAnswerMean: number;
  centeredAnswerSpread: number;
  minAxisScore: number;
  minRoleScore: number;
  minForceScore: number;
  hasNegativeScore: boolean;
  invalidAnswerCount: number;
}

function normalizeAnswer(value: number, reverse?: boolean) {
  const safeValue = Math.max(1, Math.min(5, value || 3));
  return reverse ? 6 - safeValue : safeValue;
}

function scoreProfile(axisPct: AxisScores, role: RevoTypeKey) {
  const profile = ROLE_AXIS_PROFILES[role];
  let weightedScore = 0;
  let totalWeight = 0;

  for (const [axis, weight] of Object.entries(profile.required)) {
    weightedScore += axisPct[axis as keyof AxisScores] * weight;
    totalWeight += weight;
  }

  for (const [axis, weight] of Object.entries(profile.supportive)) {
    weightedScore += axisPct[axis as keyof AxisScores] * weight * 0.65;
    totalWeight += weight * 0.65;
  }

  for (const [axis, weight] of Object.entries(profile.caution ?? {})) {
    weightedScore += (100 - axisPct[axis as keyof AxisScores]) * weight * 0.4;
    totalWeight += weight * 0.4;
  }

  const score = totalWeight ? weightedScore / totalWeight : 0;
  const requiredScores = Object.keys(profile.required).map((axis) => axisPct[axis as keyof AxisScores]);
  const requiredFloor = requiredScores.length ? Math.min(...requiredScores) : score;
  const confidence = score * 0.7 + requiredFloor * 0.3;
  const minimum = RARITY_MIN_CONFIDENCE[profile.rarity] * 100;

  return {
    role,
    score,
    confidence,
    rarity: profile.rarity,
    passesMinimumConfidence: confidence >= minimum,
  };
}

function calculateFlatness(axisPct: AxisScores) {
  const values = MULTI_AXIS_KEYS.map((axis) => axisPct[axis]);
  const max = Math.max(...values);
  const min = Math.min(...values);
  return max - min;
}

export function calculateMultiAxisRoleResult(
  questions: MultiAxisQuestion[],
  answers: number[],
): MultiAxisRoleResult {
  const axisScores = { ...EMPTY_AXIS_SCORES };
  const axisMaxScores = { ...EMPTY_AXIS_SCORES };

  questions.forEach((question, index) => {
    const value = normalizeAnswer(answers[index] ?? 3, question.reverse);
    const selectedChoice = question.choices?.find((choice) => choice.value === value);

    if (selectedChoice) {
      for (const axis of MULTI_AXIS_KEYS) {
        const maxWeight = Math.max(
          0,
          ...question.choices!.map((choice) => (
            choice.weights.find((item) => item.axis === axis)?.weight ?? 0
          )),
        );
        axisMaxScores[axis] += maxWeight;
      }

      for (const item of selectedChoice.weights) {
        axisScores[item.axis] += item.weight;
      }
      return;
    }

    for (const item of question.weights) {
      axisScores[item.axis] += value * item.weight;
      axisMaxScores[item.axis] += 5 * item.weight;
    }
  });

  const axisPct = Object.fromEntries(
    MULTI_AXIS_KEYS.map((axis) => [
      axis,
      axisMaxScores[axis] > 0 ? (axisScores[axis] / axisMaxScores[axis]) * 100 : 50,
    ]),
  ) as AxisScores;

  const flatness = calculateFlatness(axisPct);
  const roleScores = (Object.keys(ROLE_AXIS_PROFILES) as RevoTypeKey[])
    .map((role) => scoreProfile(axisPct, role))
    .sort((a, b) => b.confidence - a.confidence || b.score - a.score);
  const qualified = roleScores.filter((role) => role.passesMinimumConfidence);
  const mainRole = qualified[0] ?? null;
  const dualRole =
    mainRole && qualified[1] && Math.abs(mainRole.confidence - qualified[1].confidence) < 4
      ? qualified[1]
      : null;
  const mode: MultiAxisJudgmentMode =
    flatness < 12
      ? "low_confidence"
      : !mainRole
        ? "low_confidence"
        : dualRole
          ? "dual"
          : mainRole.confidence - (roleScores[1]?.confidence ?? 0) < 5
            ? "broad"
            : "focused";

  return {
    axisScores,
    axisMaxScores,
    axisPct,
    roleScores,
    mainRole: mode === "low_confidence" ? null : mainRole,
    dualRole: mode === "low_confidence" ? null : dualRole,
    mode,
    flatness,
  };
}

function createRoleScoreRecord(): Record<RevoTypeKey, number> {
  return Object.fromEntries(
    (Object.keys(ROLE_AXIS_PROFILES) as RevoTypeKey[]).map((role) => [role, 0]),
  ) as Record<RevoTypeKey, number>;
}

function createForceScoreRecord(): Record<ForceKey, number> {
  return Object.fromEntries(FORCE_KEYS.map((force) => [force, 0])) as Record<ForceKey, number>;
}

function isRawAnswerValue(value: number): value is RawAnswerValue {
  return Number.isInteger(value) && value >= 1 && value <= 5;
}

function calculateMean(values: number[]) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function calculateSpread(values: number[]) {
  const mean = calculateMean(values);
  return values.length
    ? Math.sqrt(values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length)
    : 0;
}

export function calculateMultiAxisRoleResultCentered(
  questions: CenteredMultiAxisQuestion[],
  answers: number[],
): CenteredMultiAxisRoleResult {
  const axisScores = { ...EMPTY_AXIS_SCORES };
  const roleScores = createRoleScoreRecord();
  const forceScores = createForceScoreRecord();
  const rawAnswers = answers.slice(0, questions.length);
  const centeredAnswers = questions.map((question, index) => {
    const rawAnswer = answers[index] ?? 3;
    const centered = answerToCentered(rawAnswer);
    return question.reverse ? ((centered * -1) as CenteredAnswerValue) : centered;
  });
  const zeroAnswerIndexes = centeredAnswers
    .map((answer, index) => (answer === 0 ? index : -1))
    .filter((index) => index >= 0);
  const invalidAnswerCount = rawAnswers.filter((answer) => !isRawAnswerValue(answer)).length;

  questions.forEach((question, index) => {
    const centered = centeredAnswers[index];
    const selectedChoice = question.choices?.find((choice) => choice.value === rawAnswers[index]);

    if (selectedChoice) {
      for (const item of selectedChoice.weights) {
        axisScores[item.axis] += item.weight;
      }

      for (const item of selectedChoice.roleWeights ?? []) {
        roleScores[item.role] += item.weight;
      }

      for (const item of selectedChoice.forceWeights ?? []) {
        forceScores[item.force] += item.weight;
      }

      return;
    }

    for (const item of question.weights) {
      axisScores[item.axis] += centered * item.weight;
    }

    if (question.role) {
      roleScores[question.role] += centered;
    }

    for (const item of question.roleWeights ?? []) {
      roleScores[item.role] += centered * item.weight;
    }

    if (question.force) {
      forceScores[question.force] += centered;
    }

    for (const item of question.forceWeights ?? []) {
      forceScores[item.force] += centered * item.weight;
    }
  });

  const minAxisScore = Math.min(...MULTI_AXIS_KEYS.map((axis) => axisScores[axis]));
  const minRoleScore = Math.min(...Object.values(roleScores));
  const minForceScore = Math.min(...Object.values(forceScores));

  return {
    rawAnswers,
    centeredAnswers,
    axisScores,
    roleScores,
    forceScores,
    zeroAnswerIndexes,
    zeroAnswerCount: zeroAnswerIndexes.length,
    rawAnswerMean: calculateMean(rawAnswers),
    centeredAnswerMean: calculateMean(centeredAnswers),
    centeredAnswerSpread: calculateSpread(centeredAnswers),
    minAxisScore,
    minRoleScore,
    minForceScore,
    hasNegativeScore: minAxisScore < 0 || minRoleScore < 0 || minForceScore < 0,
    invalidAnswerCount,
  };
}
