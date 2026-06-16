import {
  ENERGY_LIGHT_TOTAL_QUESTIONS,
  ENERGY_ORDER,
  energyLabels,
  energyLightQuestions,
  type EnergyKey,
} from "@/data/energyLightQuestions";
import { energyTypeContents, type EnergyTypeId } from "@/data/energyLightTypes";

export type EnergyScores<T = number> = Record<EnergyKey, T>;

export interface EnergyLightAnswerPayload {
  values: number[];
  sceneChoice: EnergyKey;
}

export interface EnergyLightResult {
  typeId: EnergyTypeId;
  primaryEnergy: EnergyKey;
  secondaryEnergy: EnergyKey;
  isPure: boolean;
  gap: number;
  scores: EnergyScores;
  chartPercentages: EnergyScores;
  secondEnergyNote: string | null;
  type: (typeof energyTypeContents)[EnergyTypeId];
}

const PURE_TYPE_BY_ENERGY: Record<EnergyKey, EnergyTypeId> = {
  wood: "11",
  fire: "06",
  earth: "10",
  metal: "08",
  water: "05",
};

const MIXED_TYPE_BY_PAIR: Partial<Record<string, EnergyTypeId>> = {
  "fire|wood": "01",
  "water|wood": "02",
  "fire|water": "03",
  "earth|fire": "04",
};

function initialScores(): EnergyScores {
  return {
    wood: 0,
    fire: 0,
    earth: 0,
    metal: 0,
    water: 0,
  };
}

function pairKey(a: EnergyKey, b: EnergyKey) {
  return [a, b].sort().join("|");
}

function chooseTopEnergies(scores: EnergyScores, sceneChoice: EnergyKey): [EnergyKey, EnergyKey] {
  const sorted = [...ENERGY_ORDER].sort((a, b) => {
    const scoreDiff = scores[b] - scores[a];
    if (scoreDiff !== 0) return scoreDiff;

    if (a === sceneChoice && b !== sceneChoice) return -1;
    if (b === sceneChoice && a !== sceneChoice) return 1;

    return ENERGY_ORDER.indexOf(a) - ENERGY_ORDER.indexOf(b);
  });

  return [sorted[0], sorted[1]];
}

function judgeType(primary: EnergyKey, secondary: EnergyKey, gap: number): {
  typeId: EnergyTypeId;
  isPure: boolean;
  secondEnergyNote: string | null;
} {
  if (gap >= 3) {
    return {
      typeId: PURE_TYPE_BY_ENERGY[primary],
      isPure: true,
      secondEnergyNote: `あなたには「${energyLabels[secondary]}」も強く流れています。`,
    };
  }

  if ((primary === "metal" && secondary === "earth") || (primary === "earth" && secondary === "metal")) {
    return {
      typeId: primary === "metal" ? "07" : "09",
      isPure: false,
      secondEnergyNote: null,
    };
  }

  const mixedType = MIXED_TYPE_BY_PAIR[pairKey(primary, secondary)];
  if (mixedType) {
    return {
      typeId: mixedType,
      isPure: false,
      secondEnergyNote: null,
    };
  }

  return {
    typeId: PURE_TYPE_BY_ENERGY[primary],
    isPure: true,
    secondEnergyNote: `あなたには「${energyLabels[secondary]}」も強く流れています。`,
  };
}

export function calculateEnergyScores(payload: EnergyLightAnswerPayload): EnergyScores {
  const scores = initialScores();

  energyLightQuestions.forEach((question, index) => {
    scores[question.energy] += payload.values[index] ?? 1;
  });
  scores[payload.sceneChoice] += 2;

  return scores;
}

export function calculateEnergyLightResult(payload: EnergyLightAnswerPayload): EnergyLightResult {
  const scores = calculateEnergyScores(payload);
  const [primaryEnergy, secondaryEnergy] = chooseTopEnergies(scores, payload.sceneChoice);
  const gap = scores[primaryEnergy] - scores[secondaryEnergy];
  const judgment = judgeType(primaryEnergy, secondaryEnergy, gap);
  const chartPercentages = Object.fromEntries(
    ENERGY_ORDER.map((energy) => [energy, ((scores[energy] - 4) / 18) * 100]),
  ) as EnergyScores;

  return {
    typeId: judgment.typeId,
    primaryEnergy,
    secondaryEnergy,
    isPure: judgment.isPure,
    gap,
    scores,
    chartPercentages,
    secondEnergyNote: judgment.secondEnergyNote,
    type: energyTypeContents[judgment.typeId],
  };
}

export function encodeEnergyLightResult(payload: EnergyLightAnswerPayload) {
  return `${payload.values.join("-")}__${payload.sceneChoice}`;
}

export function createEnergyLightDiagnosisId(payload: EnergyLightAnswerPayload) {
  const resultCode = encodeEnergyLightResult(payload);
  const randomPart =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);

  return `${resultCode}__${Date.now().toString(36)}${randomPart}`;
}

function isEnergyKey(value: string | undefined): value is EnergyKey {
  return !!value && ENERGY_ORDER.includes(value as EnergyKey);
}

export function decodeEnergyLightDiagnosisId(encoded: string): EnergyLightAnswerPayload {
  const [answerCode, sceneCode] = encoded.split("__");

  return {
    values: answerCode.split("-").map(Number),
    sceneChoice: isEnergyKey(sceneCode) ? sceneCode : "wood",
  };
}

export function isValidEnergyLightPayload(payload: EnergyLightAnswerPayload) {
  return (
    payload.values.length === ENERGY_LIGHT_TOTAL_QUESTIONS - 1 &&
    payload.values.every((answer) => Number.isInteger(answer) && answer >= 1 && answer <= 5) &&
    ENERGY_ORDER.includes(payload.sceneChoice)
  );
}

export function createEnergyLightAnswerColumns(payload: EnergyLightAnswerPayload) {
  return Object.fromEntries([
    ...payload.values.map((answer, index) => [`el_q${String(index + 1).padStart(2, "0")}`, answer]),
    ["el_q21", payload.sceneChoice],
  ]) as Record<string, number | string>;
}

export function createEnergyLightScoreColumns(result: EnergyLightResult) {
  return Object.fromEntries(
    ENERGY_ORDER.flatMap((energy) => [
      [`energy_${energy}_score`, result.scores[energy]],
      [`energy_${energy}_percentage`, result.chartPercentages[energy]],
    ]),
  ) as Record<string, number>;
}
