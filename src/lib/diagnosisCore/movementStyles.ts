import type { MultiAxisKey } from "@/lib/diagnosisCore/multiAxis";

export const MOVEMENT_STYLE_KEYS = ["emergent", "resonant", "grounded", "structural"] as const;

export type MovementStyleKey = (typeof MOVEMENT_STYLE_KEYS)[number];

export type MovementScores<T = number> = Record<MovementStyleKey, T>;

export const MOVEMENT_STYLE_DEFINITIONS: Record<
  MovementStyleKey,
  {
    label: string;
    sourceLabel: string;
    description: string;
    partnerHint: string;
    color: string;
  }
> = {
  emergent: {
    label: "創発型",
    sourceLabel: "ダイナモ的",
    description: "まだないものを生み、未来や可能性から動き出す力の出し方です。",
    partnerHint: "整えてくれる人、現場感を足してくれる人がいると動きやすくなります。",
    color: "#E2543E",
  },
  resonant: {
    label: "共鳴型",
    sourceLabel: "ブレイズ的",
    description: "人の熱量や関係性から動き、人を巻き込みながら広げる力の出し方です。",
    partnerHint: "整理してくれる人、具体化してくれる人がいると広がりが形になります。",
    color: "#F97316",
  },
  grounded: {
    label: "現場型",
    sourceLabel: "テンポ的",
    description: "状況やタイミングを見ながら、安心して続けられる形を作る力の出し方です。",
    partnerHint: "発想を出す人、外へ動かす人がいると守っている価値が広がります。",
    color: "#16A34A",
  },
  structural: {
    label: "構造型",
    sourceLabel: "スチール的",
    description: "情報や仕組みを整理し、再現できる形へ整える力の出し方です。",
    partnerHint: "人へ届ける人、未来を語る人がいると仕組みが生きた価値になります。",
    color: "#2563EB",
  },
};

export const MOVEMENT_AXIS_WEIGHTS: Record<MovementStyleKey, Partial<Record<MultiAxisKey, number>>> = {
  emergent: {
    noveltyDrive: 0.9,
    possibilityDesign: 0.75,
    uncertaintyTolerance: 0.7,
    executionDrive: 0.55,
    nonconformity: 0.45,
  },
  resonant: {
    socialBridge: 0.9,
    encouragement: 0.7,
    publicVisibility: 0.55,
    expressionDrive: 0.45,
    psychologicalSafety: 0.35,
  },
  grounded: {
    psychologicalSafety: 0.85,
    coordination: 0.65,
    maintenanceDrive: 0.6,
    evidenceSeeking: 0.45,
    encouragement: 0.35,
  },
  structural: {
    systemizing: 0.9,
    evidenceSeeking: 0.7,
    craftQuality: 0.6,
    maintenanceDrive: 0.45,
    coordination: 0.35,
  },
};

export const MOVEMENT_COMPLEMENT_HINTS: Record<MovementStyleKey, MovementStyleKey[]> = {
  emergent: ["structural", "grounded"],
  resonant: ["structural", "grounded"],
  grounded: ["emergent", "resonant"],
  structural: ["resonant", "emergent"],
};
