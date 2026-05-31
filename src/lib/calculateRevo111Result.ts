import type { RevoTypeKey } from "@/data/revotypes";
import { revoTypes } from "@/data/revotypes";
import { roleResultText } from "@/data/monitorResults";
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
  auxiliary: Revo111TypeScore;
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
    for (const [key, weight] of Object.entries(question.scores)) {
      raw[key as RevoTypeKey] += (weight ?? 0) * value;
    }
  });

  const maxScore = Math.max(...Object.values(raw));
  const allScores = (Object.keys(raw) as RevoTypeKey[])
    .map((key) => ({
      key,
      score: raw[key],
      percentage: maxScore > 0 ? Math.round((raw[key] / maxScore) * 100) : 0,
    }))
    .sort((a, b) => b.score - a.score);

  const [main, sub, auxiliary] = allScores;

  return {
    main,
    sub,
    auxiliary,
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

export function getRevo111ResultDetails(result: Revo111Result) {
  const mainType = revoTypes[result.main.key];
  const subType = revoTypes[result.sub.key];
  const auxiliaryType = revoTypes[result.auxiliary.key];
  const growthType = revoTypes[mainType.growthQuest.targetType];
  const futureType = revoTypes[mainType.teamDesign.bestPair];
  const thirdType = revoTypes[mainType.teamDesign.thirdPerson];

  return {
    mainType,
    subType,
    auxiliaryType,
    roleCopy: mainType.catchcopy,
    gives: mainType.gives,
    givesDetail: mainType.givesDetail,
    receives: mainType.receives,
    receivesDetail: mainType.receivesDetail,
    growthRoute: {
      type: growthType,
      description: mainType.growthQuest.description,
    },
    futurePartner: {
      type: futureType,
      description:
        mainType.goodWithDetail[futureType.key] ??
        `${futureType.name}は、あなたの未来を広げる存在です。`,
    },
    thirdPerson: {
      type: thirdType,
      description: mainType.teamDesign.teamNote,
    },
    activities: mainType.generalActivities,
    fundingRole: roleResultText[mainType.key].revoFunding,
    weeklyQuest: mainType.growthQuest.tasks[0],
  };
}
