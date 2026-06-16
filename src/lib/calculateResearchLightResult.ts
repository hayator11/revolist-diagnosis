import type { RevoTypeKey } from "@/data/revotypes";
import { revo111Navigation } from "@/data/revo111Navigation";
import { matchRules, revo111Roles } from "@/data/revo111Roles";
import {
  RESEARCH_LIGHT_TOTAL_QUESTIONS,
  researchForceDescriptions,
  researchForceLabels,
  researchLightQuestions,
  type ResearchForceKey,
} from "@/data/researchLightQuestions";

export type JudgmentMode = "focused" | "dual" | "broad";
export type ForceScores<T = number> = Record<ResearchForceKey, T>;

export interface ResearchLightScore {
  key: RevoTypeKey;
  score: number;
  maxScore: number;
  percentage: number;
}

export interface ResearchForceScore {
  key: ResearchForceKey;
  label: string;
  description: string;
  score: number;
  maxScore: number;
  percentage: number;
  dev: number;
}

export interface FamilyCandidate {
  roleKey: RevoTypeKey;
  score: number;
  maxScore: number;
  percentage: number;
}

export interface FamilyDetail {
  force: ResearchForceKey;
  candidates: FamilyCandidate[];
  selected: FamilyCandidate;
}

export interface PartnerHint {
  slotForce: ResearchForceKey;
  roleKey: RevoTypeKey;
  roleName: string;
  publicLabel: string;
  creates: string[];
  description: string;
  isSlotPartner: boolean;
}

export interface ResearchLightResult {
  forcePct: ForceScores;
  personalMean: number;
  dev: ForceScores;
  centerForce: ResearchForceKey;
  subForce: ResearchForceKey;
  slotForce: ResearchForceKey;
  mode: JudgmentMode;
  mainType: ResearchLightScore;
  dualType: ResearchLightScore | null;
  familyDetail: Record<ResearchForceKey, FamilyDetail>;
  forceScores: ResearchForceScore[];
  allScores: ResearchLightScore[];
  partnerHints: PartnerHint[];
  partnerSlotTypeKey: RevoTypeKey;
}

export const RESEARCH_LIGHT_SCORING_CONFIG = {
  flatThreshold: 8,
  closeThreshold: 4,
} as const;

export const FORCE_ORDER: ResearchForceKey[] = [
  "ignite",
  "design",
  "connect",
  "structure",
  "care",
];

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

const INITIAL_FORCE_SCORES: ForceScores = {
  ignite: 0,
  design: 0,
  connect: 0,
  structure: 0,
  care: 0,
};

const FAMILY_ROLES: Record<ResearchForceKey, RevoTypeKey[]> = {
  ignite: ["revolist", "crazist"],
  design: ["maxdesigner", "imagemaister"],
  connect: ["communicator", "arranger"],
  structure: ["inforader", "logicalmaister", "arranger"],
  care: ["movmentor", "premiercrafter", "soulowner"],
};

const SLOT_PARTNER_CANDIDATES: Record<ResearchForceKey, RevoTypeKey[]> = {
  ignite: ["revolist", "crazist"],
  design: ["maxdesigner", "imagemaister"],
  connect: ["communicator", "arranger"],
  structure: ["logicalmaister", "inforader", "arranger"],
  care: ["soulowner", "movmentor", "premiercrafter"],
};

const SLOT_PAIR_COPY: Record<ResearchForceKey, { creates: string[]; description: string }> = {
  ignite: {
    creates: ["停滞", "始動"],
    description: "まだ動き出していないものに、最初の火を入れてくれる相手です。",
  },
  design: {
    creates: ["素材", "構想"],
    description: "散らばった可能性を、見える形や魅力ある企画に変えてくれる相手です。",
  },
  connect: {
    creates: ["個の力", "つながり"],
    description: "あなたの力を人や場につなぎ、ひとりでは届かない流れを作ってくれる相手です。",
  },
  structure: {
    creates: ["理想", "設計図"],
    description: "思いや勢いを、続けられる仕組みや順番に変えてくれる相手です。",
  },
  care: {
    creates: ["挑戦", "安心"],
    description: "前に進む力を、安心して続けられる居場所や信頼に変えてくれる相手です。",
  },
};

function percentage(score: number, maxScore: number) {
  if (maxScore <= 0) return 0;
  return (score / maxScore) * 100;
}

function rankForces(forcePct: ForceScores, dev: ForceScores, direction: "desc" | "asc") {
  const multiplier = direction === "desc" ? -1 : 1;

  return [...FORCE_ORDER].sort((a, b) => {
    const devDiff = dev[a] - dev[b];
    if (devDiff !== 0) return devDiff * multiplier;

    const pctDiff = forcePct[a] - forcePct[b];
    if (pctDiff !== 0) return pctDiff * multiplier;

    return FORCE_ORDER.indexOf(a) - FORCE_ORDER.indexOf(b);
  });
}

function getFamilyTop(
  force: ResearchForceKey,
  roleScores: Record<RevoTypeKey, number>,
  roleMaxScores: Record<RevoTypeKey, number>,
): FamilyDetail {
  const candidates = FAMILY_ROLES[force].map((roleKey) => ({
    roleKey,
    score: roleScores[roleKey],
    maxScore: roleMaxScores[roleKey],
    percentage: percentage(roleScores[roleKey], roleMaxScores[roleKey]),
  }));
  const sorted = [...candidates].sort((a, b) => {
    const pctDiff = b.percentage - a.percentage;
    if (pctDiff !== 0) return pctDiff;

    const scoreDiff = b.score - a.score;
    if (scoreDiff !== 0) return scoreDiff;

    return FAMILY_ROLES[force].indexOf(a.roleKey) - FAMILY_ROLES[force].indexOf(b.roleKey);
  });

  return {
    force,
    candidates,
    selected: sorted[0],
  };
}

function createSlotPartner(slotForce: ResearchForceKey, mainTypeKey: RevoTypeKey): PartnerHint {
  const roleKey =
    SLOT_PARTNER_CANDIDATES[slotForce].find((candidate) => candidate !== mainTypeKey) ??
    SLOT_PARTNER_CANDIDATES[slotForce][0];
  const role = revo111Roles[roleKey];
  const navigation = revo111Navigation[roleKey];
  const copy = SLOT_PAIR_COPY[slotForce];

  return {
    slotForce,
    roleKey,
    roleName: role.name,
    publicLabel: navigation.publicLabel,
    creates: copy.creates,
    description: copy.description,
    isSlotPartner: true,
  };
}

function createPartnerHints(slotForce: ResearchForceKey, mainTypeKey: RevoTypeKey): PartnerHint[] {
  const slotPartner = createSlotPartner(slotForce, mainTypeKey);
  const matchPartners = (matchRules[mainTypeKey] ?? [])
    .filter((rule) => rule.partner !== slotPartner.roleKey)
    .slice(0, 2)
    .map((rule) => ({
      slotForce,
      roleKey: rule.partner,
      roleName: revo111Roles[rule.partner].name,
      publicLabel: revo111Navigation[rule.partner].publicLabel,
      creates: rule.creates,
      description: rule.description,
      isSlotPartner: false,
    }));

  return [slotPartner, ...matchPartners];
}

export function calculateResearchLightResult(answers: number[]): ResearchLightResult {
  const roleScores = { ...INITIAL_ROLE_SCORES };
  const roleMaxScores = { ...INITIAL_ROLE_SCORES };
  const rawForceScores = { ...INITIAL_FORCE_SCORES };
  const forceMaxScores: ForceScores = {
    ignite: 0,
    design: 0,
    connect: 0,
    structure: 0,
    care: 0,
  };

  researchLightQuestions.forEach((question, index) => {
    const value = answers[index] ?? 3;
    roleScores[question.role] += value;
    roleMaxScores[question.role] += 5;
    rawForceScores[question.force] += value;
    forceMaxScores[question.force] += 5;
  });

  const forcePct = Object.fromEntries(
    FORCE_ORDER.map((force) => [force, percentage(rawForceScores[force], forceMaxScores[force])]),
  ) as ForceScores;
  const personalMean =
    FORCE_ORDER.reduce((sum, force) => sum + forcePct[force], 0) / FORCE_ORDER.length;
  const dev = Object.fromEntries(
    FORCE_ORDER.map((force) => [force, forcePct[force] - personalMean]),
  ) as ForceScores;

  const descForces = rankForces(forcePct, dev, "desc");
  const ascForces = rankForces(forcePct, dev, "asc");
  const centerForce = descForces[0];
  const subForce = descForces[1];
  const slotForce = ascForces[0];
  const mode: JudgmentMode =
    dev[centerForce] < RESEARCH_LIGHT_SCORING_CONFIG.flatThreshold
      ? "broad"
      : dev[centerForce] - dev[subForce] < RESEARCH_LIGHT_SCORING_CONFIG.closeThreshold
        ? "dual"
        : "focused";

  const familyDetail = Object.fromEntries(
    FORCE_ORDER.map((force) => [force, getFamilyTop(force, roleScores, roleMaxScores)]),
  ) as Record<ResearchForceKey, FamilyDetail>;
  const mainSelected = familyDetail[centerForce].selected;
  const dualSelected = familyDetail[subForce].selected;
  const mainType = {
    key: mainSelected.roleKey,
    score: mainSelected.score,
    maxScore: mainSelected.maxScore,
    percentage: mainSelected.percentage,
  };
  const dualType =
    mode === "dual"
      ? {
          key: dualSelected.roleKey,
          score: dualSelected.score,
          maxScore: dualSelected.maxScore,
          percentage: dualSelected.percentage,
        }
      : null;

  const allScores = (Object.keys(roleScores) as RevoTypeKey[])
    .map((key) => ({
      key,
      score: roleScores[key],
      maxScore: roleMaxScores[key],
      percentage: percentage(roleScores[key], roleMaxScores[key]),
    }))
    .sort((a, b) => b.percentage - a.percentage || b.score - a.score);
  const forceScores = FORCE_ORDER.map((force) => ({
    key: force,
    label: researchForceLabels[force],
    description: researchForceDescriptions[force],
    score: rawForceScores[force],
    maxScore: forceMaxScores[force],
    percentage: forcePct[force],
    dev: dev[force],
  }));
  const partnerHints = createPartnerHints(slotForce, mainType.key);

  return {
    forcePct,
    personalMean,
    dev,
    centerForce,
    subForce,
    slotForce,
    mode,
    mainType,
    dualType,
    familyDetail,
    forceScores,
    allScores,
    partnerHints,
    partnerSlotTypeKey: partnerHints[0].roleKey,
  };
}

export function encodeResearchLightAnswers(answers: number[]): string {
  return answers.join("-");
}

export function createResearchLightDiagnosisId(answers: number[]): string {
  const answerCode = encodeResearchLightAnswers(answers);
  const randomPart =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);

  return `${answerCode}__${Date.now().toString(36)}${randomPart}`;
}

export function decodeResearchLightAnswers(encoded: string): number[] {
  const [answerCode] = encoded.split("__");
  return answerCode.split("-").map(Number);
}

export function isValidResearchLightAnswers(answers: number[]): boolean {
  return (
    answers.length === RESEARCH_LIGHT_TOTAL_QUESTIONS &&
    answers.every((answer) => Number.isInteger(answer) && answer >= 1 && answer <= 5)
  );
}

export function getResearchLightResultDetails(result: ResearchLightResult) {
  const mainRole = revo111Roles[result.mainType.key];
  const dualRole = result.dualType ? revo111Roles[result.dualType.key] : null;
  const mainNavigation = revo111Navigation[result.mainType.key];
  const centerForceLabel = researchForceLabels[result.centerForce];
  const subForceLabel = researchForceLabels[result.subForce];
  const slotForceLabel = researchForceLabels[result.slotForce];
  const modeLabel =
    result.mode === "broad" ? "ひろがり型" : result.mode === "dual" ? "拮抗型" : "中心明確";
  const lead =
    result.mode === "broad"
      ? `あなたは5つの力を幅広く使ってきた、ひろがり型。いま一番手前にあるのは「${centerForceLabel}」です。`
      : result.mode === "dual" && dualRole
        ? `「${centerForceLabel}」と「${subForceLabel}」が拮抗しています。使い方は${mainRole.name}型、もうひとつの顔は${dualRole.name}型です。`
        : `あなたの中心の力は「${centerForceLabel}」。その使い方は、${mainRole.name}型です。`;
  const experienceText =
    result.mode === "broad"
      ? "いろいろな役割や経験を重ねてきた人ほど、複数の力が高く出ることがあります。これは「どれでもある」というより、今まで使ってきた力の幅が広いという見方ができます。"
      : "今は特に使いやすい力がはっきり出ています。これから新しい役割や場を経験していくほど、別の力も少しずつ育っていきます。";

  return {
    mainRole,
    dualRole,
    mainNavigation,
    allRoles: revo111Roles,
    title:
      result.mode === "broad"
        ? `ひろがり型 / ${mainRole.name}型`
        : result.mode === "dual" && dualRole
          ? `${mainRole.name}型 + ${dualRole.name}型`
          : `${mainRole.name}型`,
    lead,
    modeLabel,
    centerForceLabel,
    subForceLabel,
    slotForceLabel,
    experienceText,
    body: [
      mainNavigation.publicSummary,
      "この結果は、あなたをひとつに固定するものではありません。今よく使っている力と、これから伸びやすい関わり方を見るための研究版です。",
    ],
    workSuggestion: `${mainRole.fundingRole}として、${mainRole.fundingStrengths.join("・")}を活かしやすいタイプです。`,
    communitySuggestion: `${mainRole.gives.join("・")}を場に届けながら、${mainRole.receives.join("・")}を受け取ると動きやすくなります。`,
    nextAction: mainRole.quest.beginner,
    feedbackHint: `${mainRole.name}という結果がしっくりくるか、もう少し調整したい表現があるかを教えてください。`,
  };
}

export function createResearchLightAnswerColumns(answers: number[]) {
  return Object.fromEntries(
    answers.map((answer, index) => [`q${String(index + 1).padStart(2, "0")}`, answer]),
  ) as Record<string, number>;
}

export function createResearchLightForceColumns(result: ResearchLightResult) {
  return Object.fromEntries(
    FORCE_ORDER.flatMap((force) => [
      [`force_${force}_score`, result.forceScores.find((score) => score.key === force)?.score ?? 0],
      [`force_${force}_percentage`, result.forcePct[force]],
      [`dev_${force}`, result.dev[force]],
    ]),
  ) as Record<string, number>;
}

export function createResearchLightRoleColumns(result: ResearchLightResult) {
  return Object.fromEntries(
    result.allScores.flatMap((role) => [
      [`role_${role.key}_score`, role.score],
      [`role_${role.key}_maxScore`, role.maxScore],
      [`role_${role.key}_percentage`, role.percentage],
    ]),
  ) as Record<string, number>;
}
