import type { RevoTypeKey } from "@/data/revotypes";
import {
  growthRoutes,
  matchRules,
  revo111Roles,
  thirdPersonEffects,
} from "@/data/revo111Roles";
import {
  REVO111_TOTAL_QUESTIONS,
  revo111Questions,
} from "@/data/revo111Questions";
import { revo111Navigation } from "@/data/revo111Navigation";

export interface Revo111TypeScore {
  key: RevoTypeKey;
  score: number;
  percentage: number;
}

export interface Revo111Result {
  main: Revo111TypeScore;
  sub: Revo111TypeScore;
  support: Revo111TypeScore;
  allScores: Revo111TypeScore[];
}

const INITIAL_SCORES: Record<RevoTypeKey, number> = {
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

export function calculateRevo111Result(answers: number[]): Revo111Result {
  const raw = { ...INITIAL_SCORES };

  revo111Questions.forEach((question, index) => {
    const value = answers[index] ?? 3;
    raw[question.role] += value;
  });

  const maxScore = 20;
  const allScores = (Object.keys(raw) as RevoTypeKey[])
    .map((key) => ({
      key,
      score: raw[key],
      percentage: Math.round((raw[key] / maxScore) * 100),
    }))
    .sort((a, b) => b.score - a.score);

  const [main, sub, support] = allScores;

  return {
    main,
    sub,
    support,
    allScores,
  };
}

export function encodeRevo111Answers(answers: number[]): string {
  return answers.join("-");
}

export function decodeRevo111Answers(encoded: string): number[] {
  return encoded.split("-").map(Number);
}

export function isValidRevo111Answers(answers: number[]): boolean {
  return (
    answers.length === REVO111_TOTAL_QUESTIONS &&
    answers.every((answer) => Number.isInteger(answer) && answer >= 1 && answer <= 5)
  );
}

function includesPair(pair: [RevoTypeKey, RevoTypeKey], a: RevoTypeKey, b: RevoTypeKey) {
  return pair.includes(a) && pair.includes(b);
}

function findThirdPersonEffect(mainKey: RevoTypeKey, subKey: RevoTypeKey) {
  return (
    thirdPersonEffects.find((effect) => includesPair(effect.pair, mainKey, subKey)) ??
    thirdPersonEffects.find((effect) => effect.pair.includes(mainKey)) ??
    thirdPersonEffects[0]
  );
}

function createRoleCopy(mainKey: RevoTypeKey, subKey: RevoTypeKey, supportKey: RevoTypeKey) {
  const main = revo111Navigation[mainKey];
  const sub = revo111Navigation[subKey];
  const support = revo111Navigation[supportKey];

  return `${main.publicLabel}として動きながら、${sub.publicLabel}の力が支えになり、${support.publicLabel}の可能性も育っています。`;
}

export function getRevo111ResultDetails(result: Revo111Result) {
  const mainRole = revo111Roles[result.main.key];
  const subRole = revo111Roles[result.sub.key];
  const supportRole = revo111Roles[result.support.key];
  const mainNavigation = revo111Navigation[result.main.key];
  const subNavigation = revo111Navigation[result.sub.key];
  const supportNavigation = revo111Navigation[result.support.key];
  const growthRoute = growthRoutes[result.main.key];
  const futurePartners = matchRules[result.main.key];
  const thirdPerson = findThirdPersonEffect(result.main.key, result.sub.key);

  return {
    allRoles: revo111Roles,
    mainRole,
    subRole,
    supportRole,
    mainNavigation,
    subNavigation,
    supportNavigation,
    roleCopy: createRoleCopy(result.main.key, result.sub.key, result.support.key),
    currentText: mainNavigation.publicSummary,
    subText: `${subNavigation.publicLabel}の力が、あなたの動きを支えています。`,
    supportText: `${supportNavigation.publicLabel}の力も、活動や出会いを通して育つ可能性があります。`,
    gives: mainRole.gives,
    receives: mainRole.receives,
    comfortableEnvironment: mainRole.comfortableEnvironment,
    growthRoute: {
      roles: growthRoute.route.map((key) => revo111Roles[key]),
      theme: growthRoute.theme,
      meanings: mainNavigation.growthMeanings,
      description: growthRoute.description,
    },
    futurePartners: futurePartners.map((rule) => ({
      role: revo111Roles[rule.partner],
      navigation: revo111Navigation[rule.partner],
      creates: rule.creates,
      description: rule.description,
    })),
    thirdPerson: {
      pair: thirdPerson.pair.map((key) => revo111Roles[key]),
      third: revo111Roles[thirdPerson.third],
      flow: thirdPerson.flow,
      result: thirdPerson.result,
    },
    activities: mainRole.recommendedActivities,
    workExamples: mainNavigation.workExamples,
    activityScores: mainNavigation.activityScores,
    partnerLabels: mainNavigation.partnerLabels,
    fundingRole: {
      title: mainRole.fundingRole,
      strengths: mainRole.fundingStrengths,
      ways: mainRole.fundingWays,
    },
    quest: mainRole.quest,
    todayMission: mainNavigation.todayMission,
    linkRole: mainRole.linkRole,
    songRole: mainRole.songRole,
  };
}
