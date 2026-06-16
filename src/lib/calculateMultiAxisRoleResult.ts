import type { RevoTypeKey } from "@/data/revotypes";
import {
  EMPTY_AXIS_SCORES,
  MULTI_AXIS_KEYS,
  RARITY_MIN_CONFIDENCE,
  ROLE_AXIS_PROFILES,
  type AxisScores,
  type MultiAxisQuestion,
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
