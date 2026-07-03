import {
  getOnokunSatooyaType,
  onokunSatooyaClusters,
  onokunSatooyaTypes,
  type OnokunSatooyaType,
  type OnokunSatooyaTypeKey,
} from "../../onokun-satooya-11-v1/_data/onokunSatooyaTypes";
import {
  ONOKUN_SATOOYA_MATCH_TOTAL_QUESTIONS,
  onokunSatooyaMatchQuestions,
  type OnokunSatooyaMatchAnswerValue,
} from "../_data/onokunSatooyaMatchQuestions";
import { revo111Roles, matchRules } from "@/data/revo111Roles";

export interface OnokunSatooyaMatchResult {
  baseType: OnokunSatooyaType | null;
  mainType: OnokunSatooyaType;
  subType: OnokunSatooyaType;
  desiredPartnerType: OnokunSatooyaType;
  naturalPartnerType: OnokunSatooyaType;
  recommendedPartnerType: OnokunSatooyaType;
  cluster: (typeof onokunSatooyaClusters)[OnokunSatooyaType["clusterKey"]];
  selfScores: Record<OnokunSatooyaTypeKey, number>;
  partnerScores: Record<OnokunSatooyaTypeKey, number>;
  matchMode: "natural" | "growth" | "discovery";
  matchTitle: string;
  matchDescription: string;
  baseComparisonTitle: string;
  baseComparisonDescription: string;
  postPrompt: string;
  talkTopics: string[];
}

export function encodeOnokunSatooyaMatchAnswers(answers: number[]) {
  return answers.join("");
}

export function decodeOnokunSatooyaMatchAnswers(encoded: string) {
  return encoded.split("").map((value) => Number(value));
}

export function isValidOnokunSatooyaMatchAnswers(answers: number[]) {
  return (
    answers.length === ONOKUN_SATOOYA_MATCH_TOTAL_QUESTIONS &&
    answers.every((answer) => Number.isInteger(answer) && answer >= 1 && answer <= 5)
  );
}

export function isValidOnokunSatooyaBaseTypeKey(
  value: string | null,
): value is OnokunSatooyaTypeKey {
  return onokunSatooyaTypes.some((type) => type.key === value);
}

export function calculateOnokunSatooyaMatchResult(
  answers: number[],
  baseTypeKey?: OnokunSatooyaTypeKey | null,
): OnokunSatooyaMatchResult {
  const selfScores = createEmptyScores();
  const partnerScores = createEmptyScores();
  const baseType = baseTypeKey ? getOnokunSatooyaType(baseTypeKey) : null;

  if (baseType) {
    selfScores[baseType.key] += 5;
    partnerScores[baseType.partnerTypeKey] += 2;
  }

  onokunSatooyaMatchQuestions.forEach((question, index) => {
    const answer = answers[index] as OnokunSatooyaMatchAnswerValue | undefined;
    if (!answer) return;

    const choice = question.choices.find((item) => item.value === answer);
    choice?.selfEvidence?.forEach((evidence) => {
      selfScores[evidence.type] += evidence.weight;
    });
    choice?.partnerEvidence?.forEach((evidence) => {
      partnerScores[evidence.type] += evidence.weight;
    });
  });

  const rankedSelfTypes = rankTypes(selfScores);
  const rankedPartnerTypes = rankTypes(partnerScores);
  const mainType = rankedSelfTypes[0];
  const subType = rankedSelfTypes[1];
  const desiredPartnerType = rankedPartnerTypes[0];
  const naturalPartnerType = getOnokunSatooyaType(mainType.partnerTypeKey);
  const recommendedPartnerType =
    partnerScores[desiredPartnerType.key] > 0 ? desiredPartnerType : naturalPartnerType;
  const matchMode = getMatchMode(mainType, naturalPartnerType, recommendedPartnerType);

  return {
    baseType,
    mainType,
    subType,
    desiredPartnerType,
    naturalPartnerType,
    recommendedPartnerType,
    cluster: onokunSatooyaClusters[mainType.clusterKey],
    selfScores,
    partnerScores,
    matchMode,
    matchTitle: createMatchTitle(matchMode),
    matchDescription: createMatchDescription(mainType, recommendedPartnerType, matchMode),
    baseComparisonTitle: createBaseComparisonTitle(baseType, mainType),
    baseComparisonDescription: createBaseComparisonDescription(baseType, mainType, subType),
    postPrompt: createPostPrompt(mainType, recommendedPartnerType),
    talkTopics: createTalkTopics(mainType, recommendedPartnerType),
  };
}

function createEmptyScores() {
  return Object.fromEntries(onokunSatooyaTypes.map((type) => [type.key, 0])) as Record<
    OnokunSatooyaTypeKey,
    number
  >;
}

function rankTypes(scores: Record<OnokunSatooyaTypeKey, number>) {
  return [...onokunSatooyaTypes].sort((a, b) => scores[b.key] - scores[a.key]);
}

function getMatchMode(
  mainType: OnokunSatooyaType,
  naturalPartnerType: OnokunSatooyaType,
  recommendedPartnerType: OnokunSatooyaType,
) {
  if (recommendedPartnerType.key === naturalPartnerType.key) return "natural";

  const futurePartners = revo111Roles[mainType.revoTypeKey].futurePartners;
  if (futurePartners.includes(recommendedPartnerType.revoTypeKey)) return "growth";

  return "discovery";
}

function createMatchTitle(matchMode: OnokunSatooyaMatchResult["matchMode"]) {
  if (matchMode === "natural") return "相棒ど真ん中タイプ";
  if (matchMode === "growth") return "伸びしろ相棒タイプ";
  return "意外と気になる相棒タイプ";
}

function createMatchDescription(
  mainType: OnokunSatooyaType,
  partnerType: OnokunSatooyaType,
  matchMode: OnokunSatooyaMatchResult["matchMode"],
) {
  const rule = matchRules[mainType.revoTypeKey]?.find(
    (item) => item.partner === partnerType.revoTypeKey,
  );

  if (rule) return rule.description;

  if (matchMode === "natural") {
    return "あなたが自然に動くほど、相棒が受け止めたり形にしたりして、ご縁が広がりやすい組み合わせです。";
  }

  if (matchMode === "growth") {
    return "今のあなたに足すと、投稿や会話が次の一歩へ広がりやすい組み合わせです。";
  }

  return "自分だけでは選ばない視点が入り、ご縁の広がり方が少し変わる組み合わせです。";
}

function createBaseComparisonTitle(
  baseType: OnokunSatooyaType | null,
  mainType: OnokunSatooyaType,
) {
  if (!baseType) return "18問だけで見た相棒マッチ";
  if (baseType.key === mainType.key) return "11問と18問で、中心タイプが一致";
  return "11問とは違う色も出ています";
}

function createBaseComparisonDescription(
  baseType: OnokunSatooyaType | null,
  mainType: OnokunSatooyaType,
  subType: OnokunSatooyaType,
) {
  if (!baseType) {
    return "今回は11問ライト診断の結果を使わず、18問の回答だけで自分の動き方と相棒タイプを見ています。";
  }

  if (baseType.key === mainType.key) {
    return `11問で出た「${baseType.name}」の気配が、相棒診断でも中心に出ています。自分らしさがわかりやすく出ている状態です。`;
  }

  if (baseType.key === subType.key) {
    return `11問で出た「${baseType.name}」は、今回は隠し味として残っています。中心には「${mainType.name}」が出ていて、人とつながる場面では少し違う動き方が出やすいかもしれません。`;
  }

  return `11問では「${baseType.name}」でしたが、相棒診断では「${mainType.name}」が強く出ています。タイプが外れたのではなく、ひとりで楽しむ時と、誰かと組む時で出てくるご縁の向きが変わっていると見ます。`;
}

function createPostPrompt(mainType: OnokunSatooyaType, partnerType: OnokunSatooyaType) {
  return `私は「${mainType.name}」でした。相棒は「${partnerType.name}」が気になるみたいです。`;
}

function createTalkTopics(mainType: OnokunSatooyaType, partnerType: OnokunSatooyaType) {
  return [
    mainType.salonPostLine,
    partnerType.conversationStarter,
    `${revo111Roles[mainType.revoTypeKey].name} × ${revo111Roles[partnerType.revoTypeKey].name} の組み合わせ、ちょっと気になります。`,
  ];
}
