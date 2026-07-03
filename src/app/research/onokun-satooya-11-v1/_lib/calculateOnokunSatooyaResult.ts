import {
  getOnokunSatooyaType,
  onokunSatooyaClusters,
  onokunSatooyaTypes,
  type OnokunSatooyaType,
  type OnokunSatooyaTypeKey,
} from "../_data/onokunSatooyaTypes";
import {
  onokunSatooyaQuestions,
  type OnokunAnswerValue,
} from "../_data/onokunSatooyaQuestions";
import type { RevoTypeKey } from "@/data/revotypes";

export interface OnokunSatooyaResult {
  mainType: OnokunSatooyaType;
  subType: OnokunSatooyaType;
  supportType: OnokunSatooyaType;
  partnerType: OnokunSatooyaType;
  cluster: (typeof onokunSatooyaClusters)[OnokunSatooyaType["clusterKey"]];
  scores: Record<OnokunSatooyaTypeKey, number>;
  revoScores: Record<RevoTypeKey, number>;
  topTypes: OnokunSatooyaType[];
  topRevoTypeKeys: RevoTypeKey[];
  evidenceText: string;
  readingPoints: string[];
  questBridge: string;
  evidenceHighlights: OnokunEvidenceHighlight[];
  maxScore: number;
}

export interface OnokunEvidenceHighlight {
  questionId: string;
  chapterTitle: string;
  scene: string;
  choiceLabel: string;
  typeName: string;
  weight: number;
}

export function encodeOnokunSatooyaAnswers(answers: number[]) {
  return answers.join("");
}

export function decodeOnokunSatooyaAnswers(encoded: string) {
  return encoded.split("").map((value) => Number(value));
}

export function isValidOnokunSatooyaAnswers(answers: number[]) {
  return (
    answers.length === onokunSatooyaQuestions.length &&
    answers.every((answer) => Number.isInteger(answer) && answer >= 1 && answer <= 5)
  );
}

export function calculateOnokunSatooyaResult(answers: number[]): OnokunSatooyaResult {
  const scores = Object.fromEntries(
    onokunSatooyaTypes.map((type) => [type.key, 0]),
  ) as Record<OnokunSatooyaTypeKey, number>;

  onokunSatooyaQuestions.forEach((question, index) => {
    const answer = answers[index] as OnokunAnswerValue | undefined;
    if (!answer) return;

    question.evidenceByAnswer[answer].forEach((evidence) => {
      scores[evidence.type] += evidence.weight;
    });
  });

  const rankedTypes = [...onokunSatooyaTypes].sort((a, b) => scores[b.key] - scores[a.key]);
  const mainType = rankedTypes[0];
  const subType = rankedTypes[1];
  const supportType = rankedTypes[2];
  const revoScores = createRevoScores(scores);

  return {
    mainType,
    subType,
    supportType,
    partnerType: getOnokunSatooyaType(mainType.partnerTypeKey),
    cluster: onokunSatooyaClusters[mainType.clusterKey],
    scores,
    revoScores,
    topTypes: rankedTypes.slice(0, 3),
    topRevoTypeKeys: rankedTypes.slice(0, 3).map((type) => type.revoTypeKey),
    evidenceText: createEvidenceText(mainType, subType, supportType),
    readingPoints: createReadingPoints(mainType, subType, supportType),
    questBridge: createQuestBridge(mainType.clusterKey),
    evidenceHighlights: createEvidenceHighlights(answers, [mainType, subType, supportType]),
    maxScore: scores[mainType.key],
  };
}

function createRevoScores(scores: Record<OnokunSatooyaTypeKey, number>) {
  return Object.fromEntries(
    onokunSatooyaTypes.map((type) => [type.revoTypeKey, scores[type.key] ?? 0]),
  ) as Record<RevoTypeKey, number>;
}

function createEvidenceHighlights(answers: number[], targetTypes: OnokunSatooyaType[]) {
  const targetTypeMap = new Map(targetTypes.map((type) => [type.key, type.name]));

  return onokunSatooyaQuestions
    .flatMap((question, index) => {
      const answer = answers[index] as OnokunAnswerValue | undefined;
      if (!answer) return [];

      const choiceLabel =
        question.choices.find((choice) => choice.value === answer)?.label ?? "";

      return question.evidenceByAnswer[answer]
        .filter((evidence) => targetTypeMap.has(evidence.type))
        .map((evidence) => ({
          questionId: question.id,
          chapterTitle: question.chapterTitle,
          scene: question.scene,
          choiceLabel,
          typeName: targetTypeMap.get(evidence.type) ?? "",
          weight: evidence.weight,
        }));
    })
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 6);
}

function createEvidenceText(
  mainType: OnokunSatooyaType,
  subType: OnokunSatooyaType,
  supportType: OnokunSatooyaType,
) {
  return [
    `今回の回答では「${mainType.name}」のご縁の育て方がいちばん強く見えました。`,
    `同時に「${subType.name}」や「${supportType.name}」の気配も出ています。`,
    `ひとつの答えだけで決めるのではなく、選んだ場面の積み重ねから見えてきた小さな名札です。`,
  ].join("");
}

function createReadingPoints(
  mainType: OnokunSatooyaType,
  subType: OnokunSatooyaType,
  supportType: OnokunSatooyaType,
) {
  return [
    `中心には「${mainType.oneLine}」という動きが見えています。`,
    `サブには「${subType.oneLine}」があり、うちの子との楽しみ方に別の色を足しています。`,
    `補助の「${supportType.oneLine}」は、場面によってふっと出てくるご縁の育て方です。`,
  ];
}

function createQuestBridge(clusterKey: OnokunSatooyaType["clusterKey"]) {
  if (clusterKey === "create") {
    return "楽しいきっかけをつくるほど、人が集まり、ご縁が次の場所へ広がっていきます。";
  }

  if (clusterKey === "tell") {
    return "見つけたことや感じたことを伝えるほど、おのくんの背景や東松島への入口がやさしく開きます。";
  }

  if (clusterKey === "move") {
    return "小さく動きやすい形をつくるほど、集まりが生まれ、つながりが備えにもなっていきます。";
  }

  return "安心して話せる空気を育てるほど、ご縁は長く続き、帰ってこられる場所になっていきます。";
}
