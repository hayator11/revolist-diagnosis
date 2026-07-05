import type { OnokunSatooyaType } from "./onokunSatooyaTypes";

export type OnokunSatooyaShareVariantKind = "normal" | "lucky" | "funny";

export interface OnokunSatooyaShareCopyAssignment {
  shareVariantId: string;
  shareVariantKind: OnokunSatooyaShareVariantKind;
  openingCopyId: string;
  openingCopy: string;
  callToActionCopyId: string;
  callToActionCopy: string;
  specialCopyId: string | null;
  specialCopy: string | null;
}

const NORMAL_OPENING_COPIES = [
  "うちの子とのご縁、ちょっと見えました。",
  "おのくんとの楽しみ方、名前がつきました。",
  "私の親バカ、どうやらこのタイプらしいです。",
  "うちの子が連れてくるご縁を診断しました。",
  "里親さんとしてのクセ、出ました。",
  "おの活の方向性、ちょっとバレました。",
  "うちの子との関わり方に、タイプがありました。",
  "親バカサロンで名乗りたくなる結果が出ました。",
  "おのくんとのご縁、世界にひとつでした。",
  "うちの子目線だと、私はこう見えるらしいです。",
  "みんな違ってみんないい、私のご縁タイプはこれでした。",
] as const;

const NORMAL_CALL_TO_ACTION_COPIES = [
  "あなたはどんなご縁を育てる里親さん？",
  "うちの子タイプ、見てみませんか？",
  "あなたのおの活にも名前をつけてみませんか？",
  "親バカ仲間のタイプも気になります。",
  "結果を持って、親バカサロンで話したいです。",
  "同じタイプの里親さん、いるかな？",
  "相棒タイプの里親さんにも会ってみたいです。",
  "うちの子自慢のきっかけにどうぞ。",
  "おのくんとのご縁、ちょっと見える化してみませんか？",
  "あなたのうちの子は、どんなご縁を連れてきますか？",
  "親バカ診断、思ったより当たるかもしれません。",
] as const;

const LUCKY_COPY = {
  id: "lucky_001",
  text: "ちょっとレアなご縁カードが出ました。",
} as const;

const FUNNY_COPY = {
  id: "funny_001",
  text: "うちの子、診断中にちょっとドヤ顔してました。",
} as const;

function hashString(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function pickByHash<T>(items: readonly T[], seed: number, offset: number) {
  return items[(seed + offset) % items.length];
}

function getVariantKind(seed: number): OnokunSatooyaShareVariantKind {
  const bucket = seed % 100;
  if (bucket < 5) return "lucky";
  if (bucket < 10) return "funny";
  return "normal";
}

export function createOnokunSatooyaShareCopyAssignment({
  diagnosisId,
  clientSessionId,
  typeKey,
}: {
  diagnosisId: string;
  clientSessionId: string;
  typeKey: string;
}): OnokunSatooyaShareCopyAssignment {
  const seed = hashString(`${diagnosisId}:${clientSessionId}:${typeKey}`);
  const shareVariantKind = getVariantKind(seed);
  const openingIndex = seed % NORMAL_OPENING_COPIES.length;
  const callToActionIndex = (Math.floor(seed / 11) + openingIndex) % NORMAL_CALL_TO_ACTION_COPIES.length;
  const openingCopy = pickByHash(NORMAL_OPENING_COPIES, seed, 0);
  const callToActionCopy = pickByHash(NORMAL_CALL_TO_ACTION_COPIES, Math.floor(seed / 11), openingIndex);
  const specialCopy =
    shareVariantKind === "lucky" ? LUCKY_COPY : shareVariantKind === "funny" ? FUNNY_COPY : null;

  return {
    shareVariantId: `onokun_share_${shareVariantKind}_${String(openingIndex + 1).padStart(
      2,
      "0",
    )}_${String(callToActionIndex + 1).padStart(2, "0")}_${specialCopy?.id ?? "standard"}`,
    shareVariantKind,
    openingCopyId: `opening_${String(openingIndex + 1).padStart(2, "0")}`,
    openingCopy,
    callToActionCopyId: `cta_${String(callToActionIndex + 1).padStart(2, "0")}`,
    callToActionCopy,
    specialCopyId: specialCopy?.id ?? null,
    specialCopy: specialCopy?.text ?? null,
  };
}

export function createOnokunSatooyaShareText({
  childLabel,
  mainType,
  assignment,
  resultUrl,
}: {
  childLabel: string;
  mainType: OnokunSatooyaType;
  assignment: OnokunSatooyaShareCopyAssignment;
  resultUrl: string;
}) {
  return [
    assignment.specialCopy,
    assignment.openingCopy,
    `${childLabel}とのご縁タイプは「${mainType.name}」でした。`,
    mainType.shareCatch,
    `親バカあるある: ${mainType.parentBakaLine}`,
    "",
    assignment.callToActionCopy,
    "おのくん里親さん 11ご縁タイプ診断",
    resultUrl,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
}
