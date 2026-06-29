import type { RevoTypeKey } from "@/data/revotypes";
import type { ForceKey } from "@/lib/diagnosisCore/forces";

export const MULTI_AXIS_KEYS = [
  "noveltyDrive",
  "possibilityDesign",
  "expressionDrive",
  "socialBridge",
  "evidenceSeeking",
  "encouragement",
  "craftQuality",
  "systemizing",
  "coordination",
  "psychologicalSafety",
  "nonconformity",
  "uncertaintyTolerance",
  "executionDrive",
  "maintenanceDrive",
  "publicVisibility",
] as const;

export type MultiAxisKey = (typeof MULTI_AXIS_KEYS)[number];

export type AxisScores<T = number> = Record<MultiAxisKey, T>;

export interface AxisQuestionWeight {
  axis: MultiAxisKey;
  weight: number;
}

export interface MultiAxisQuestionChoice {
  value: RawAnswerValue;
  label: string;
  weights: AxisQuestionWeight[];
  roleWeights?: CenteredRoleQuestionWeight[];
  forceWeights?: CenteredForceQuestionWeight[];
}

export interface MultiAxisQuestion {
  id: string;
  text: string;
  weights: AxisQuestionWeight[];
  choices?: MultiAxisQuestionChoice[];
  reverse?: boolean;
}

export type RawAnswerValue = 1 | 2 | 3 | 4 | 5;
export type CenteredAnswerValue = -2 | -1 | 0 | 1 | 2;

export interface CenteredAxisQuestionWeight {
  axis: MultiAxisKey;
  weight: number;
}

export interface CenteredRoleQuestionWeight {
  role: RevoTypeKey;
  weight: number;
}

export interface CenteredForceQuestionWeight {
  force: ForceKey;
  weight: number;
}

export interface CenteredMultiAxisQuestion {
  id: string;
  text: string;
  weights: CenteredAxisQuestionWeight[];
  choices?: MultiAxisQuestionChoice[];
  role?: RevoTypeKey;
  force?: ForceKey;
  roleWeights?: CenteredRoleQuestionWeight[];
  forceWeights?: CenteredForceQuestionWeight[];
  reverse?: boolean;
}

export interface RoleAxisProfile {
  role: RevoTypeKey;
  label: string;
  required: Partial<AxisScores>;
  supportive: Partial<AxisScores>;
  caution?: Partial<AxisScores>;
  rarity: "common" | "balanced" | "rare";
}

export const EMPTY_AXIS_SCORES: AxisScores = {
  noveltyDrive: 0,
  possibilityDesign: 0,
  expressionDrive: 0,
  socialBridge: 0,
  evidenceSeeking: 0,
  encouragement: 0,
  craftQuality: 0,
  systemizing: 0,
  coordination: 0,
  psychologicalSafety: 0,
  nonconformity: 0,
  uncertaintyTolerance: 0,
  executionDrive: 0,
  maintenanceDrive: 0,
  publicVisibility: 0,
};

export const ROLE_AXIS_PROFILES: Record<RevoTypeKey, RoleAxisProfile> = {
  revolist: {
    role: "revolist",
    label: "レボリスト",
    rarity: "rare",
    required: {
      noveltyDrive: 0.9,
      uncertaintyTolerance: 0.8,
      executionDrive: 0.7,
      publicVisibility: 0.5,
    },
    supportive: {
      socialBridge: 0.4,
      encouragement: 0.4,
    },
    caution: {
      maintenanceDrive: 0.2,
      evidenceSeeking: 0.2,
    },
  },
  maxdesigner: {
    role: "maxdesigner",
    label: "マックスデザイナー",
    rarity: "balanced",
    required: {
      possibilityDesign: 0.9,
      noveltyDrive: 0.5,
      uncertaintyTolerance: 0.4,
    },
    supportive: {
      expressionDrive: 0.4,
      systemizing: 0.3,
    },
  },
  imagemaister: {
    role: "imagemaister",
    label: "イメージマイスター",
    rarity: "balanced",
    required: {
      expressionDrive: 0.9,
      possibilityDesign: 0.5,
      publicVisibility: 0.4,
    },
    supportive: {
      craftQuality: 0.4,
      psychologicalSafety: 0.3,
    },
  },
  communicator: {
    role: "communicator",
    label: "コミュニケーター",
    rarity: "balanced",
    required: {
      socialBridge: 0.85,
      psychologicalSafety: 0.55,
      coordination: 0.45,
      publicVisibility: 0.3,
    },
    supportive: {
      encouragement: 0.3,
      expressionDrive: 0.25,
    },
  },
  inforader: {
    role: "inforader",
    label: "インフォレイダー",
    rarity: "common",
    required: {
      evidenceSeeking: 0.9,
      systemizing: 0.4,
      maintenanceDrive: 0.3,
    },
    supportive: {
      psychologicalSafety: 0.3,
    },
  },
  movmentor: {
    role: "movmentor",
    label: "ムーブメンター",
    rarity: "common",
    required: {
      encouragement: 0.9,
      socialBridge: 0.4,
      executionDrive: 0.4,
    },
    supportive: {
      psychologicalSafety: 0.4,
    },
  },
  premiercrafter: {
    role: "premiercrafter",
    label: "プルミエルクラフター",
    rarity: "common",
    required: {
      craftQuality: 0.9,
      maintenanceDrive: 0.5,
      evidenceSeeking: 0.3,
    },
    supportive: {
      expressionDrive: 0.3,
    },
  },
  logicalmaister: {
    role: "logicalmaister",
    label: "ロジカルマイスター",
    rarity: "balanced",
    required: {
      systemizing: 0.85,
      evidenceSeeking: 0.55,
      expressionDrive: 0.45,
    },
    supportive: {
      coordination: 0.3,
      psychologicalSafety: 0.2,
    },
    caution: {
      maintenanceDrive: 0.15,
      craftQuality: 0.1,
    },
  },
  arranger: {
    role: "arranger",
    label: "アレンジャー",
    rarity: "common",
    required: {
      coordination: 0.9,
      socialBridge: 0.4,
      maintenanceDrive: 0.4,
    },
    supportive: {
      systemizing: 0.3,
      psychologicalSafety: 0.3,
    },
  },
  soulowner: {
    role: "soulowner",
    label: "ソウルオーナー",
    rarity: "common",
    required: {
      psychologicalSafety: 0.9,
      encouragement: 0.4,
      maintenanceDrive: 0.3,
    },
    supportive: {
      socialBridge: 0.3,
    },
  },
  crazist: {
    role: "crazist",
    label: "クレイジスト",
    rarity: "rare",
    required: {
      nonconformity: 0.9,
      noveltyDrive: 0.6,
      uncertaintyTolerance: 0.7,
    },
    supportive: {
      possibilityDesign: 0.4,
      expressionDrive: 0.3,
    },
    caution: {
      maintenanceDrive: 0.2,
      coordination: 0.2,
    },
  },
};

export const RARITY_MIN_CONFIDENCE: Record<RoleAxisProfile["rarity"], number> = {
  common: 0.58,
  balanced: 0.64,
  rare: 0.72,
};

// 回答(1-5)を中心0(-2〜+2)に変換。測定モデル設計メモに基づく準備。現時点では未使用
export function answerToCentered(answer: number): CenteredAnswerValue {
  if (!Number.isInteger(answer) || answer < 1 || answer > 5) return 0;
  return (answer - 3) as CenteredAnswerValue;
}
