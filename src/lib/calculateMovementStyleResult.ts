import {
  MOVEMENT_AXIS_WEIGHTS,
  MOVEMENT_COMPLEMENT_HINTS,
  MOVEMENT_STYLE_DEFINITIONS,
  MOVEMENT_STYLE_KEYS,
  type MovementScores,
  type MovementStyleKey,
} from "@/lib/diagnosisCore/movementStyles";
import type { AxisScores } from "@/lib/diagnosisCore/multiAxis";

export interface MovementStyleScore {
  key: MovementStyleKey;
  label: string;
  sourceLabel: string;
  description: string;
  partnerHint: string;
  color: string;
  score: number;
}

export interface MovementStyleResult {
  movementPct: MovementScores;
  scores: MovementStyleScore[];
  primaryStyle: MovementStyleScore;
  secondaryStyle: MovementStyleScore;
  complementStyles: MovementStyleKey[];
  balanceGap: number;
}

function calculateWeightedStyleScore(axisPct: AxisScores, style: MovementStyleKey) {
  const weights = MOVEMENT_AXIS_WEIGHTS[style];
  let total = 0;
  let totalWeight = 0;

  for (const [axis, weight] of Object.entries(weights)) {
    total += axisPct[axis as keyof AxisScores] * weight;
    totalWeight += weight;
  }

  return totalWeight ? total / totalWeight : 50;
}

export function calculateMovementStyleResult(axisPct: AxisScores): MovementStyleResult {
  const movementPct = Object.fromEntries(
    MOVEMENT_STYLE_KEYS.map((style) => [style, calculateWeightedStyleScore(axisPct, style)]),
  ) as MovementScores;

  const scores = MOVEMENT_STYLE_KEYS.map((style) => {
    const definition = MOVEMENT_STYLE_DEFINITIONS[style];
    return {
      key: style,
      label: definition.label,
      sourceLabel: definition.sourceLabel,
      description: definition.description,
      partnerHint: definition.partnerHint,
      color: definition.color,
      score: movementPct[style],
    };
  }).sort((a, b) => b.score - a.score);

  const primaryStyle = scores[0];
  const secondaryStyle = scores[1];

  return {
    movementPct,
    scores,
    primaryStyle,
    secondaryStyle,
    complementStyles: MOVEMENT_COMPLEMENT_HINTS[primaryStyle.key],
    balanceGap: primaryStyle.score - secondaryStyle.score,
  };
}
