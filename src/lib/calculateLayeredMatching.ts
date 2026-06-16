import type { RevoTypeKey } from "@/data/revotypes";
import { FORCE_DEFINITIONS, FORCE_KEYS, type ForceKey } from "@/lib/diagnosisCore/forces";
import type { ForceScores } from "@/lib/diagnosisCore/types";
import {
  MOVEMENT_COMPLEMENT_HINTS,
  MOVEMENT_STYLE_DEFINITIONS,
  MOVEMENT_STYLE_KEYS,
  type MovementScores,
  type MovementStyleKey,
} from "@/lib/diagnosisCore/movementStyles";

export type LayeredMatchingPurpose =
  | "icebreak"
  | "workshop"
  | "project"
  | "community"
  | "social_matching"
  | "creative";

export interface LayeredProfile {
  id?: string;
  displayName?: string;
  forcePct: ForceScores;
  movementPct: MovementScores;
  roleKey?: RevoTypeKey | null;
}

export interface LayeredMatchingScore {
  total: number;
  forceComplement: number;
  forceResonance: number;
  movementComplement: number;
  movementResonance: number;
  purposeFit: number;
}

export interface LayeredMatchingResult {
  purpose: LayeredMatchingPurpose;
  score: LayeredMatchingScore;
  primaryReason: string;
  reasons: string[];
  sharedForces: ForceKey[];
  complementForces: ForceKey[];
  thirdForceHints: ForceKey[];
  sharedMovementStyles: MovementStyleKey[];
  complementMovementStyles: MovementStyleKey[];
  thirdMovementHints: MovementStyleKey[];
}

const PURPOSE_FORCE_WEIGHTS: Record<LayeredMatchingPurpose, ForceScores> = {
  icebreak: {
    ignite: 0.7,
    design: 0.8,
    connect: 1,
    structure: 0.7,
    care: 1,
  },
  workshop: {
    ignite: 0.75,
    design: 1,
    connect: 0.85,
    structure: 1,
    care: 0.8,
  },
  project: {
    ignite: 1,
    design: 0.9,
    connect: 0.85,
    structure: 1,
    care: 0.75,
  },
  community: {
    ignite: 0.75,
    design: 0.75,
    connect: 1,
    structure: 0.85,
    care: 1,
  },
  social_matching: {
    ignite: 0.65,
    design: 0.85,
    connect: 1,
    structure: 0.65,
    care: 1,
  },
  creative: {
    ignite: 1,
    design: 1,
    connect: 0.8,
    structure: 0.75,
    care: 0.75,
  },
};

const PURPOSE_MOVEMENT_WEIGHTS: Record<LayeredMatchingPurpose, MovementScores> = {
  icebreak: {
    emergent: 0.7,
    resonant: 1,
    grounded: 1,
    structural: 0.65,
  },
  workshop: {
    emergent: 0.85,
    resonant: 0.85,
    grounded: 0.85,
    structural: 1,
  },
  project: {
    emergent: 0.95,
    resonant: 0.85,
    grounded: 0.8,
    structural: 1,
  },
  community: {
    emergent: 0.7,
    resonant: 1,
    grounded: 1,
    structural: 0.75,
  },
  social_matching: {
    emergent: 0.75,
    resonant: 1,
    grounded: 1,
    structural: 0.65,
  },
  creative: {
    emergent: 1,
    resonant: 0.8,
    grounded: 0.7,
    structural: 0.85,
  },
};

function clampScore(value: number) {
  return Math.max(0, Math.min(100, value));
}

function weightedAverage(values: number[], weights: number[]) {
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  return totalWeight ? values.reduce((sum, value, index) => sum + value * weights[index], 0) / totalWeight : 0;
}

function topKeys<Key extends string>(record: Record<Key, number>, count: number) {
  return (Object.keys(record) as Key[]).sort((a, b) => record[b] - record[a]).slice(0, count);
}

function calculateForceComplement(a: ForceScores, b: ForceScores, purpose: LayeredMatchingPurpose) {
  const purposeWeights = PURPOSE_FORCE_WEIGHTS[purpose];
  const values = FORCE_KEYS.map((force) => {
    const aNeed = Math.max(0, 72 - a[force]);
    const bNeed = Math.max(0, 72 - b[force]);
    const aReceives = (aNeed / 72) * b[force];
    const bReceives = (bNeed / 72) * a[force];
    return (aReceives + bReceives) / 2;
  });
  const weights = FORCE_KEYS.map((force) => purposeWeights[force]);
  return clampScore(weightedAverage(values, weights));
}

function calculateForceResonance(a: ForceScores, b: ForceScores, purpose: LayeredMatchingPurpose) {
  const purposeWeights = PURPOSE_FORCE_WEIGHTS[purpose];
  const values = FORCE_KEYS.map((force) => Math.min(a[force], b[force]));
  const weights = FORCE_KEYS.map((force) => purposeWeights[force]);
  return clampScore(weightedAverage(values, weights));
}

function calculateMovementComplement(a: MovementScores, b: MovementScores, purpose: LayeredMatchingPurpose) {
  const purposeWeights = PURPOSE_MOVEMENT_WEIGHTS[purpose];
  const values = MOVEMENT_STYLE_KEYS.map((style) => {
    const aComplement = MOVEMENT_COMPLEMENT_HINTS[style].reduce((sum, partnerStyle) => sum + b[partnerStyle], 0) / 2;
    const bComplement = MOVEMENT_COMPLEMENT_HINTS[style].reduce((sum, partnerStyle) => sum + a[partnerStyle], 0) / 2;
    const stylePresence = (a[style] + b[style]) / 2;
    return stylePresence * 0.35 + ((aComplement + bComplement) / 2) * 0.65;
  });
  const weights = MOVEMENT_STYLE_KEYS.map((style) => purposeWeights[style]);
  return clampScore(weightedAverage(values, weights));
}

function calculateMovementResonance(a: MovementScores, b: MovementScores, purpose: LayeredMatchingPurpose) {
  const purposeWeights = PURPOSE_MOVEMENT_WEIGHTS[purpose];
  const values = MOVEMENT_STYLE_KEYS.map((style) => Math.min(a[style], b[style]));
  const weights = MOVEMENT_STYLE_KEYS.map((style) => purposeWeights[style]);
  return clampScore(weightedAverage(values, weights));
}

function calculatePurposeFit(profile: LayeredProfile, purpose: LayeredMatchingPurpose) {
  const forceWeights = PURPOSE_FORCE_WEIGHTS[purpose];
  const movementWeights = PURPOSE_MOVEMENT_WEIGHTS[purpose];
  const forceFit = weightedAverage(
    FORCE_KEYS.map((force) => profile.forcePct[force]),
    FORCE_KEYS.map((force) => forceWeights[force]),
  );
  const movementFit = weightedAverage(
    MOVEMENT_STYLE_KEYS.map((style) => profile.movementPct[style]),
    MOVEMENT_STYLE_KEYS.map((style) => movementWeights[style]),
  );
  return forceFit * 0.55 + movementFit * 0.45;
}

function buildSharedForces(a: ForceScores, b: ForceScores) {
  const shared = Object.fromEntries(FORCE_KEYS.map((force) => [force, Math.min(a[force], b[force])])) as ForceScores;
  return topKeys(shared, 2).filter((force) => shared[force] >= 58);
}

function buildComplementForces(a: ForceScores, b: ForceScores) {
  const complement = Object.fromEntries(
    FORCE_KEYS.map((force) => [force, Math.abs(a[force] - b[force]) * Math.max(a[force], b[force])]),
  ) as ForceScores;
  return topKeys(complement, 2).filter((force) => Math.abs(a[force] - b[force]) >= 18);
}

function buildThirdForceHints(a: ForceScores, b: ForceScores, purpose: LayeredMatchingPurpose) {
  const purposeWeights = PURPOSE_FORCE_WEIGHTS[purpose];
  const openSlots = Object.fromEntries(
    FORCE_KEYS.map((force) => [force, Math.max(0, 68 - Math.max(a[force], b[force])) * purposeWeights[force]]),
  ) as ForceScores;
  return topKeys(openSlots, 2).filter((force) => openSlots[force] > 0);
}

function buildSharedMovementStyles(a: MovementScores, b: MovementScores) {
  const shared = Object.fromEntries(MOVEMENT_STYLE_KEYS.map((style) => [style, Math.min(a[style], b[style])])) as MovementScores;
  return topKeys(shared, 2).filter((style) => shared[style] >= 58);
}

function buildComplementMovementStyles(a: MovementScores, b: MovementScores) {
  const complement = Object.fromEntries(
    MOVEMENT_STYLE_KEYS.map((style) => {
      const aComplement = MOVEMENT_COMPLEMENT_HINTS[style].some((partnerStyle) => b[partnerStyle] >= 58);
      const bComplement = MOVEMENT_COMPLEMENT_HINTS[style].some((partnerStyle) => a[partnerStyle] >= 58);
      return [style, (a[style] + b[style]) * (aComplement || bComplement ? 1 : 0)];
    }),
  ) as MovementScores;
  return topKeys(complement, 2).filter((style) => complement[style] > 0);
}

function buildThirdMovementHints(a: MovementScores, b: MovementScores, purpose: LayeredMatchingPurpose) {
  const purposeWeights = PURPOSE_MOVEMENT_WEIGHTS[purpose];
  const openSlots = Object.fromEntries(
    MOVEMENT_STYLE_KEYS.map((style) => [style, Math.max(0, 66 - Math.max(a[style], b[style])) * purposeWeights[style]]),
  ) as MovementScores;
  return topKeys(openSlots, 2).filter((style) => openSlots[style] > 0);
}

function forceLabel(force: ForceKey) {
  return FORCE_DEFINITIONS[force].label;
}

function movementLabel(style: MovementStyleKey) {
  return MOVEMENT_STYLE_DEFINITIONS[style].label;
}

function buildReasons(
  sharedForces: ForceKey[],
  complementForces: ForceKey[],
  thirdForceHints: ForceKey[],
  sharedMovementStyles: MovementStyleKey[],
  complementMovementStyles: MovementStyleKey[],
) {
  const reasons: string[] = [];

  if (sharedForces[0]) {
    reasons.push(`${forceLabel(sharedForces[0])}が重なり、最初の会話や共同作業の土台を作りやすい組み合わせです。`);
  }

  if (complementForces[0]) {
    reasons.push(`${forceLabel(complementForces[0])}の出方に違いがあり、お互いの見え方を広げやすい組み合わせです。`);
  }

  if (sharedMovementStyles[0]) {
    reasons.push(`${movementLabel(sharedMovementStyles[0])}の動き方が近く、場の温度や進め方を合わせやすいです。`);
  }

  if (complementMovementStyles[0]) {
    reasons.push(`${movementLabel(complementMovementStyles[0])}の動き方が加わることで、発想・関係性・現場感・整理のどこかが自然に補われます。`);
  }

  if (thirdForceHints[0]) {
    reasons.push(`3人目を足すなら、${forceLabel(thirdForceHints[0])}を持つ人が入ると場がさらに動きやすくなります。`);
  }

  return reasons;
}

export function calculateLayeredMatching(
  a: LayeredProfile,
  b: LayeredProfile,
  purpose: LayeredMatchingPurpose = "icebreak",
): LayeredMatchingResult {
  const forceComplement = calculateForceComplement(a.forcePct, b.forcePct, purpose);
  const forceResonance = calculateForceResonance(a.forcePct, b.forcePct, purpose);
  const movementComplement = calculateMovementComplement(a.movementPct, b.movementPct, purpose);
  const movementResonance = calculateMovementResonance(a.movementPct, b.movementPct, purpose);
  const purposeFit = (calculatePurposeFit(a, purpose) + calculatePurposeFit(b, purpose)) / 2;
  const total = clampScore(
    forceComplement * 0.28 +
      forceResonance * 0.18 +
      movementComplement * 0.24 +
      movementResonance * 0.12 +
      purposeFit * 0.18,
  );

  const sharedForces = buildSharedForces(a.forcePct, b.forcePct);
  const complementForces = buildComplementForces(a.forcePct, b.forcePct);
  const thirdForceHints = buildThirdForceHints(a.forcePct, b.forcePct, purpose);
  const sharedMovementStyles = buildSharedMovementStyles(a.movementPct, b.movementPct);
  const complementMovementStyles = buildComplementMovementStyles(a.movementPct, b.movementPct);
  const thirdMovementHints = buildThirdMovementHints(a.movementPct, b.movementPct, purpose);
  const reasons = buildReasons(
    sharedForces,
    complementForces,
    thirdForceHints,
    sharedMovementStyles,
    complementMovementStyles,
  );

  return {
    purpose,
    score: {
      total,
      forceComplement,
      forceResonance,
      movementComplement,
      movementResonance,
      purposeFit,
    },
    primaryReason:
      reasons[0] ??
      "5つの力と4つの動き方を重ねて見ることで、固定のタイプ名だけでは見えない噛み合い方を確認できます。",
    reasons,
    sharedForces,
    complementForces,
    thirdForceHints,
    sharedMovementStyles,
    complementMovementStyles,
    thirdMovementHints,
  };
}
