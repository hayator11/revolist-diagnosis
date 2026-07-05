import type { RevoTypeKey } from "./revotypes";

export type EntryShareVariant = "normal" | "lucky" | "funny";

export interface EntryShareIntroCopy {
  key: string;
  variant: EntryShareVariant;
  text: string;
}

export interface EntryShareCalloutCopy {
  key: string;
  text: string;
}

export interface EntryShareCopySelection {
  intro: EntryShareIntroCopy;
  callout: EntryShareCalloutCopy;
}

export const entryShareIntroCopies: Record<RevoTypeKey, EntryShareIntroCopy> = {
  revolist: {
    key: "intro_revolist_01",
    variant: "normal",
    text: "自分ではただ一歩踏み出しただけ。\nでも誰かには、それが突破口になる。",
  },
  maxdesigner: {
    key: "intro_maxdesigner_01",
    variant: "normal",
    text: "自分ではただ想像していただけ。\nでも誰かには、その未来図が突破口になる。",
  },
  imagemaister: {
    key: "intro_imagemaister_01",
    variant: "normal",
    text: "自分ではただ空気を整えただけ。\nでも誰かには、その心地よさが突破口になる。",
  },
  communicator: {
    key: "intro_communicator_01",
    variant: "normal",
    text: "自分ではただ人をつないだだけ。\nでも誰かには、その出会いが突破口になる。",
  },
  inforader: {
    key: "intro_inforader_01",
    variant: "normal",
    text: "自分ではただ気になっただけ。\nでも誰かには、その小さな発見が突破口になる。",
  },
  movmentor: {
    key: "intro_movmentor_01",
    variant: "normal",
    text: "自分ではただ背中を押しただけ。\nでも誰かには、その一言が突破口になる。",
  },
  premiercrafter: {
    key: "intro_premiercrafter_01",
    variant: "normal",
    text: "自分ではただ丁寧に仕上げただけ。\nでも誰かには、その安心感が突破口になる。",
  },
  logicalmaister: {
    key: "intro_logicalmaister_01",
    variant: "normal",
    text: "自分ではただ整理しただけ。\nでも誰かには、その地図が突破口になる。",
  },
  arranger: {
    key: "intro_arranger_01",
    variant: "normal",
    text: "自分ではただ配置を考えただけ。\nでも誰かには、その流れが突破口になる。",
  },
  soulowner: {
    key: "intro_soulowner_01",
    variant: "normal",
    text: "自分ではただ安心できる場をつくっただけ。\nでも誰かには、その場所が突破口になる。",
  },
  crazist: {
    key: "intro_crazist_01",
    variant: "normal",
    text: "自分ではただ別の扉が気になっただけ。\nでも誰かには、その視点が突破口になる。",
  },
};

export const entryShareCalloutCopies: EntryShareCalloutCopy[] = [
  {
    key: "callout_01",
    text: "それ、あなたかも。",
  },
  {
    key: "callout_02",
    text: "あなたと組んだら、何が動くんだろう。",
  },
  {
    key: "callout_03",
    text: "もしかして、あなたでは？",
  },
  {
    key: "callout_04",
    text: "あなたの役割も見てみて。",
  },
  {
    key: "callout_05",
    text: "次はあなたの番かもしれない。",
  },
  {
    key: "callout_06",
    text: "あなたは、誰の可能性を動かす人？",
  },
  {
    key: "callout_07",
    text: "この組み合わせ、ちょっと気になります。",
  },
  {
    key: "callout_08",
    text: "あなたの“普通”も、誰かの突破口かも。",
  },
  {
    key: "callout_09",
    text: "あなたの結果も知りたい。",
  },
  {
    key: "callout_10",
    text: "一緒に組んだら、可能性が動くかもしれない。",
  },
  {
    key: "callout_11",
    text: "あなたは何を持ち寄る人？",
  },
];

export const entryShareLuckyIntroCopy: EntryShareIntroCopy = {
  key: "intro_lucky_01",
  variant: "lucky",
  text: "当たりかもしれません。\nあなたの“当たり前”が、誰かの未来を動かす可能性があります。",
};

export const entryShareFunnyIntroCopy: EntryShareIntroCopy = {
  key: "intro_funny_01",
  variant: "funny",
  text: "速報です。\nあなたの通常運転、誰かにとってはかなりありがたいらしいです。",
};

function stableHash(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

export function selectEntryShareCopy(
  encodedAnswers: string,
  mainTypeKey: RevoTypeKey
): EntryShareCopySelection {
  const hash = stableHash(`${encodedAnswers}:${mainTypeKey}`);
  const variantRoll = hash % 100;
  const intro =
    variantRoll < 5
      ? entryShareLuckyIntroCopy
      : variantRoll < 10
        ? entryShareFunnyIntroCopy
        : entryShareIntroCopies[mainTypeKey];
  const callout = entryShareCalloutCopies[Math.floor(hash / 100) % entryShareCalloutCopies.length];

  return {
    intro,
    callout,
  };
}
