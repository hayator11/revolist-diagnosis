export const FORCE_KEYS = ["ignite", "design", "connect", "structure", "care"] as const;

export const FORCE_DEFINITIONS = {
  ignite: {
    key: "ignite",
    label: "はじめる力",
    shortLabel: "始動",
    color: "#E2543E",
    bgColor: "#FEF2F2",
    description: "まだ形になっていないものに、最初の一歩を置く力です。",
  },
  design: {
    key: "design",
    label: "描く力",
    shortLabel: "構想",
    color: "#7C3AED",
    bgColor: "#F5F3FF",
    description: "可能性や世界観を、伝わる形へ組み立てる力です。",
  },
  connect: {
    key: "connect",
    label: "つなぐ力",
    shortLabel: "接続",
    color: "#F97316",
    bgColor: "#FFF7ED",
    description: "人・想い・場の間に流れを生み出す力です。",
  },
  structure: {
    key: "structure",
    label: "整える力",
    shortLabel: "設計",
    color: "#2563EB",
    bgColor: "#EFF6FF",
    description: "情報や役割を整理し、前に進める土台を作る力です。",
  },
  care: {
    key: "care",
    label: "支える力",
    shortLabel: "安心",
    color: "#16A34A",
    bgColor: "#F0FDF4",
    description: "安心感や完成度を守り、人やものごとを育てる力です。",
  },
} as const;

export type ForceKey = (typeof FORCE_KEYS)[number];

export const FORCE_LABELS: Record<ForceKey, string> = {
  ignite: FORCE_DEFINITIONS.ignite.label,
  design: FORCE_DEFINITIONS.design.label,
  connect: FORCE_DEFINITIONS.connect.label,
  structure: FORCE_DEFINITIONS.structure.label,
  care: FORCE_DEFINITIONS.care.label,
};

export const FORCE_COLORS: Record<ForceKey, string> = {
  ignite: FORCE_DEFINITIONS.ignite.color,
  design: FORCE_DEFINITIONS.design.color,
  connect: FORCE_DEFINITIONS.connect.color,
  structure: FORCE_DEFINITIONS.structure.color,
  care: FORCE_DEFINITIONS.care.color,
};
