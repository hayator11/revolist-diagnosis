import type { RevoTypeKey } from "@/data/revotypes";
import { revo111Navigation } from "@/data/revo111Navigation";
import { revo111Roles } from "@/data/revo111Roles";
import { icebreakQuestions, ICEBREAK_TOTAL_QUESTIONS } from "@/data/icebreakQuestions";
import { calculateMovementStyleResult, type MovementStyleResult } from "@/lib/calculateMovementStyleResult";
import { calculateMultiAxisRoleResult, type MultiAxisRoleResult } from "@/lib/calculateMultiAxisRoleResult";
import {
  FORCE_DEFINITIONS,
  FORCE_KEYS,
  type ForceKey,
} from "@/lib/diagnosisCore/forces";
import type { AxisScores } from "@/lib/diagnosisCore/multiAxis";
import type { ForceScores } from "@/lib/diagnosisCore/types";

export interface IcebreakResult {
  roleScores: Record<RevoTypeKey, number>;
  forceScores: ForceScores;
  forcePct: ForceScores;
  personalMean: number;
  dev: ForceScores;
  centerForce: ForceKey;
  subForce: ForceKey;
  slotForce: ForceKey;
  axisPct: AxisScores;
  roleJudgment: MultiAxisRoleResult;
  movementStyle: MovementStyleResult;
  mainTypeKey: RevoTypeKey;
  partnerTypeKey: RevoTypeKey;
  thirdTypeKey: RevoTypeKey;
}

const INITIAL_ROLE_SCORES: Record<RevoTypeKey, number> = {
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

const PARTNER_BY_SLOT: Record<ForceKey, RevoTypeKey[]> = {
  ignite: ["revolist", "crazist"],
  design: ["maxdesigner", "imagemaister"],
  connect: ["communicator", "arranger"],
  structure: ["logicalmaister", "inforader"],
  care: ["soulowner", "movmentor", "premiercrafter"],
};

const AXIS_FORCE_WEIGHTS: Record<keyof AxisScores, Partial<ForceScores>> = {
  noveltyDrive: { ignite: 0.8, design: 0.25 },
  possibilityDesign: { design: 0.8, ignite: 0.2 },
  expressionDrive: { design: 0.55, connect: 0.25 },
  socialBridge: { connect: 0.85, care: 0.15 },
  evidenceSeeking: { structure: 0.75, care: 0.15 },
  encouragement: { care: 0.6, connect: 0.25 },
  craftQuality: { care: 0.65, structure: 0.25 },
  systemizing: { structure: 0.85, design: 0.15 },
  coordination: { structure: 0.45, connect: 0.45 },
  psychologicalSafety: { care: 0.8, connect: 0.15 },
  nonconformity: { ignite: 0.7, design: 0.25 },
  uncertaintyTolerance: { ignite: 0.65, design: 0.15 },
  executionDrive: { ignite: 0.75, structure: 0.15 },
  maintenanceDrive: { care: 0.5, structure: 0.35 },
  publicVisibility: { connect: 0.45, ignite: 0.35 },
};

const FORCE_CONNECTION_TEXT: Record<
  ForceKey,
  {
    need: string;
    scene: string;
    opener: string;
  }
> = {
  ignite: {
    need: "最初の一歩を置いてくれる人",
    scene: "話が動き出すきっかけを一緒に作れます。",
    opener: "最近、ちょっと始めてみたいことはありますか？",
  },
  design: {
    need: "アイデアを広げてくれる人",
    scene: "まだぼんやりしている考えに、見える形が生まれます。",
    opener: "これ、もっと面白くするとしたらどんな形がありそうですか？",
  },
  connect: {
    need: "人や想いをつないでくれる人",
    scene: "会話が広がり、次に話したい相手が見つかりやすくなります。",
    opener: "今日、誰かに紹介したくなった人はいましたか？",
  },
  structure: {
    need: "流れや役割を整えてくれる人",
    scene: "話したことが、次の動きに移しやすい形になります。",
    opener: "この話を一歩進めるなら、最初に何を決めると良さそうですか？",
  },
  care: {
    need: "安心して話せる土台を作ってくれる人",
    scene: "自然体で話せる空気ができ、深い本音が出やすくなります。",
    opener: "最近、続けていてよかったことはありますか？",
  },
};

function initialForceScores(): ForceScores {
  return {
    ignite: 0,
    design: 0,
    connect: 0,
    structure: 0,
    care: 0,
  };
}

function rankForces(values: ForceScores, direction: "asc" | "desc") {
  const multiplier = direction === "desc" ? -1 : 1;
  return [...FORCE_KEYS].sort((a, b) => {
    const diff = values[a] - values[b];
    if (diff !== 0) return diff * multiplier;
    return FORCE_KEYS.indexOf(a) - FORCE_KEYS.indexOf(b);
  });
}

function rankRoleKeys(roleScores: Record<RevoTypeKey, number>) {
  return (Object.keys(roleScores) as RevoTypeKey[]).sort((a, b) => {
    const diff = roleScores[b] - roleScores[a];
    if (diff !== 0) return diff;
    return Object.keys(INITIAL_ROLE_SCORES).indexOf(a) - Object.keys(INITIAL_ROLE_SCORES).indexOf(b);
  });
}

function calculateForcePctFromAxis(axisPct: AxisScores): ForceScores {
  const totals = initialForceScores();
  const weights = initialForceScores();

  for (const [axis, forceWeights] of Object.entries(AXIS_FORCE_WEIGHTS)) {
    for (const [force, weight] of Object.entries(forceWeights)) {
      totals[force as ForceKey] += axisPct[axis as keyof AxisScores] * weight;
      weights[force as ForceKey] += weight;
    }
  }

  return Object.fromEntries(
    FORCE_KEYS.map((force) => [force, weights[force] ? totals[force] / weights[force] : 50]),
  ) as ForceScores;
}

function choosePartner(slotForce: ForceKey, excluded: RevoTypeKey[]) {
  return PARTNER_BY_SLOT[slotForce].find((key) => !excluded.includes(key)) ?? PARTNER_BY_SLOT[slotForce][0];
}

export function calculateIcebreakResult(answers: number[]): IcebreakResult {
  const roleJudgment = calculateMultiAxisRoleResult(icebreakQuestions, answers);
  const movementStyle = calculateMovementStyleResult(roleJudgment.axisPct);
  const forcePct = calculateForcePctFromAxis(roleJudgment.axisPct);
  const forceScores = forcePct;
  const personalMean = FORCE_KEYS.reduce((sum, force) => sum + forcePct[force], 0) / FORCE_KEYS.length;
  const dev = Object.fromEntries(
    FORCE_KEYS.map((force) => [force, forcePct[force] - personalMean]),
  ) as ForceScores;
  const forceRanking = rankForces(dev, "desc");
  const centerForce = forceRanking[0];
  const subForce = forceRanking[1] ?? centerForce;
  const slotForce = rankForces(dev, "asc")[0];
  const roleScores = Object.fromEntries(
    roleJudgment.roleScores.map((role) => [role.role, role.confidence]),
  ) as Record<RevoTypeKey, number>;
  const roleRanking = rankRoleKeys(roleScores);
  const mainTypeKey = roleJudgment.mainRole?.role ?? roleRanking[0];
  const partnerTypeKey = choosePartner(slotForce, [mainTypeKey]);
  const thirdTypeKey =
    revo111Roles[mainTypeKey].futurePartners.find((key) => key !== partnerTypeKey) ??
    choosePartner(subForce, [mainTypeKey, partnerTypeKey]);

  return {
    roleScores,
    forceScores,
    forcePct,
    personalMean,
    dev,
    centerForce,
    subForce,
    slotForce,
    axisPct: roleJudgment.axisPct,
    roleJudgment,
    movementStyle,
    mainTypeKey,
    partnerTypeKey,
    thirdTypeKey,
  };
}

export function getIcebreakResultDetails(result: IcebreakResult) {
  const mainRole = revo111Roles[result.mainTypeKey];
  const mainNavigation = revo111Navigation[result.mainTypeKey];
  const partnerRole = revo111Roles[result.partnerTypeKey];
  const partnerNavigation = revo111Navigation[result.partnerTypeKey];
  const thirdRole = revo111Roles[result.thirdTypeKey];
  const thirdNavigation = revo111Navigation[result.thirdTypeKey];
  const centerForce = FORCE_DEFINITIONS[result.centerForce];
  const slotForce = FORCE_DEFINITIONS[result.slotForce];
  const slotConnection = FORCE_CONNECTION_TEXT[result.slotForce];
  const subForce = FORCE_DEFINITIONS[result.subForce];
  const primaryMovement = result.movementStyle.primaryStyle;
  const secondaryMovement = result.movementStyle.secondaryStyle;
  const isLowConfidence = result.roleJudgment.mode === "low_confidence";
  const isMovementBalanced = result.movementStyle.balanceGap < 3;

  return {
    mainRole,
    mainNavigation,
    partnerRole,
    partnerNavigation,
    thirdRole,
    thirdNavigation,
    title: isLowConfidence
      ? "まだ役割をひとつに絞らない入口です"
      : `${mainNavigation.publicLabel}の入口が出ています`,
    lead: isLowConfidence
      ? `今日の回答は複数の力が近く出ています。まずは「${centerForce.label}」を入口に、${slotForce.label}を持つ人と話すと、自分の動き方が見えやすくなります。`
      : `役割名で言うと${mainRole.name}寄りですが、今日の入り方は「${centerForce.label}」と「${primaryMovement.label}」が中心です。${slotForce.label}を持つ人と出会うと、会話が動きやすくなります。`,
    movementHeadline: isMovementBalanced
      ? "複数の動き方を使い分けやすい状態です"
      : `${primaryMovement.label}で動きやすい状態です`,
    movementReason: isMovementBalanced
      ? `4つの動き方が近く出ています。場の相手やテーマによって、創発・共鳴・現場・構造の出方が変わる可能性があります。`
      : `${primaryMovement.description} ${secondaryMovement.label}も少し重なっているため、ひとつの役割名だけではなく、場に合わせて動き方が変わる可能性があります。`,
    partnerHeadline: `いま必要なのは、${slotConnection.need}`,
    partnerReason: `${partnerRole.name}のような${partnerNavigation.publicLabel}と話すと、${slotConnection.scene}`,
    nextAction: `まずは「${slotConnection.opener}」から話してみてください。`,
    connectionCards: [
      {
        title: "あなたが場に渡せるもの",
        forceLabel: centerForce.label,
        roleName: mainRole.name,
        body: `${mainRole.gives.slice(0, 2).join("・")}を自然に渡しやすい入口です。`,
      },
      {
        title: "最初に探したい相手",
        forceLabel: slotForce.label,
        roleName: partnerRole.name,
        body: `${partnerNavigation.publicLabel}が近くにいると、会話が次の一歩へつながりやすくなります。`,
      },
      {
        title: "3人目にいると広がる人",
        forceLabel: subForce.label,
        roleName: thirdRole.name,
        body: `${thirdNavigation.publicLabel}が加わると、話したことを小さな動きへ育てやすくなります。`,
      },
    ],
    conversationOpeners: [
      slotConnection.opener,
      `${partnerRole.name}っぽい人に会ったら、最近動かしたいことを1つ聞いてみる。`,
      `${thirdRole.name}っぽい人がいたら、この話を3人で進めるなら何が必要か聞いてみる。`,
    ],
  };
}

export function createIcebreakDiagnosisId(answers: number[]) {
  const randomPart =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);

  return `${answers.join("-")}__${Date.now().toString(36)}${randomPart}`;
}

export function decodeIcebreakAnswers(encoded: string) {
  const [answerCode] = encoded.split("__");
  return answerCode.split("-").map(Number);
}

export function isValidIcebreakAnswers(answers: number[]) {
  return (
    answers.length === ICEBREAK_TOTAL_QUESTIONS &&
    answers.every((answer) => Number.isInteger(answer) && answer >= 1 && answer <= 5)
  );
}

export function createIcebreakAnswerColumns(answers: number[]) {
  return Object.fromEntries(
    answers.map((answer, index) => [`ice_q${String(index + 1).padStart(2, "0")}`, answer]),
  ) as Record<string, number>;
}

export function createIcebreakForceColumns(result: IcebreakResult) {
  return Object.fromEntries(
    FORCE_KEYS.flatMap((force) => [
      [`ice_force_${force}_score`, result.forceScores[force]],
      [`ice_force_${force}_percentage`, result.forcePct[force]],
      [`ice_dev_${force}`, result.dev[force]],
    ]),
  ) as Record<string, number>;
}
