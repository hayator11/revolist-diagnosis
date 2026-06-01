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
  const main = revo111Roles[mainKey];
  const sub = revo111Roles[subKey];
  const support = revo111Roles[supportKey];

  return `${main.catchCopy} ${sub.name}の力がその動きを支え、${support.name}の育つ可能性が未来をさらに広げます。`;
}

export function getRevo111ResultDetails(result: Revo111Result) {
  const mainRole = revo111Roles[result.main.key];
  const subRole = revo111Roles[result.sub.key];
  const supportRole = revo111Roles[result.support.key];
  const growthRoute = growthRoutes[result.main.key];
  const futurePartners = matchRules[result.main.key];
  const thirdPerson = findThirdPersonEffect(result.main.key, result.sub.key);

  return {
    mainRole,
    subRole,
    supportRole,
    roleCopy: createRoleCopy(result.main.key, result.sub.key, result.support.key),
    currentText: `あなたは現在、${mainRole.name}の役割が強く出ています。${mainRole.mission}`,
    subText: `サブ役割として${subRole.name}が出ています。これは、${mainRole.name}の動きを支え、活動をより豊かにする力です。`,
    supportText: `補助役割として${supportRole.name}が出ています。これは、活動や出会いを通してさらに育つ可能性を示しています。`,
    gives: mainRole.gives,
    receives: mainRole.receives,
    comfortableEnvironment: mainRole.comfortableEnvironment,
    growthRoute: {
      roles: growthRoute.route.map((key) => revo111Roles[key]),
      theme: growthRoute.theme,
      description: growthRoute.description,
    },
    futurePartners: futurePartners.map((rule) => ({
      role: revo111Roles[rule.partner],
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
    fundingRole: {
      title: mainRole.fundingRole,
      strengths: mainRole.fundingStrengths,
      ways: mainRole.fundingWays,
    },
    quest: mainRole.quest,
    linkRole: mainRole.linkRole,
    songRole: mainRole.songRole,
  };
}
