export const discoveryChannelOptions = [
  "X",
  "Instagram",
  "Facebook",
  "TikTok",
  "YouTube",
  "note",
  "ホームページ",
  "Google検索",
  "Yahoo検索",
  "知人・友人の紹介",
  "イベント・講演",
  "LINE",
  "Discord",
  "その他",
];

export const monitorDiscoveryChannelOptions = [
  ...discoveryChannelOptions.slice(0, 11),
  "コミュニティ内の案内",
  ...discoveryChannelOptions.slice(11),
];

export const referredOptions = ["はい", "いいえ", "わからない"];

export const discoveryDetailOptions = [
  "Xの投稿",
  "Xのプロフィール",
  "Xの固定ポスト",
  "Instagram投稿",
  "Instagramストーリーズ",
  "Instagramプロフィール",
  "Facebook投稿",
  "Facebookグループ",
  "note記事",
  "YouTube概要欄",
  "ホームページTOP",
  "診断ページ",
  "Revo111紹介ページ",
  "レボリストLabページ",
  "おのくん関連ページ",
  "防災×帽祭関連ページ",
  "Revo Funding関連ページ",
  "Revo Link関連ページ",
  "Revo Song関連ページ",
  "知人から送られたURL",
  "イベントで聞いた",
  "その他",
];

export const joinMotivationOptions = [
  "「このままでいいのか」という言葉が気になった",
  "人生の次の関わり方という言葉が気になった",
  "成功はひとつじゃないという考え方に共感した",
  "自分の強みや役割を知りたかった",
  "仕事や副業に活かせそうだと思った",
  "転職や今後の働き方を考えていた",
  "コミュニティに興味があった",
  "応援活動に興味があった",
  "レボリストLabに興味があった",
  "おのくん関連で知った",
  "防災×帽祭関連で知った",
  "Revo Fundingに興味があった",
  "Revo Linkに興味があった",
  "Revo Songに興味があった",
  "知人・友人にすすめられた",
  "なんとなく面白そうだった",
  "その他",
];

export const referralContextOptions = [
  "直接すすめられた",
  "Xで紹介されていた",
  "Instagramで紹介されていた",
  "Facebookで紹介されていた",
  "LINEで送られてきた",
  "Discordで案内された",
  "イベントで紹介された",
  "コミュニティ内で紹介された",
  "その他",
];

export const currentInterestOptions = [
  "このままでいいのかという不安",
  "仕事のこれから",
  "副業",
  "転職",
  "自分の強み",
  "自分の役割",
  "人とのつながり",
  "コミュニティ",
  "応援活動",
  "社会貢献",
  "地域活動",
  "お金以外の成功",
  "人生の次の関わり方",
  "仲間づくり",
  "プロジェクト参加",
  "その他",
];

export const interestedProjectsOptions = [
  "ライト診断21問",
  "44問版モニター診断",
  "レボリストLab",
  "Revo Funding",
  "Revo Link",
  "Revo Song",
  "防災×帽祭",
  "おのくん",
  "里親コミュニティMAP",
  "地域プロジェクト",
  "まだわからない",
  "その他",
];

export const communityInterestOptions = [
  "参加してみたい",
  "まずは見てみたい",
  "説明を聞いてみたい",
  "まだ迷っている",
  "今は参加しない",
];

export const possibleContributionOptions = [
  "SNSで紹介する",
  "感想やフィードバックを送る",
  "人を紹介する",
  "企画を一緒に考える",
  "デザイン・制作で関わる",
  "文章を書く",
  "イベントを手伝う",
  "現場で動く",
  "スポンサー・支援で関わる",
  "コミュニティ運営を手伝う",
  "まだわからない",
  "その他",
];

export const publishConsentOptions = ["はい", "いいえ"];

export interface RevoResearchPayload {
  formType?: string;
  discoveryChannel?: string;
  discoveryDetail?: string;
  joinMotivation?: string[];
  impressivePhrase?: string;
  isReferred?: string;
  referrerName?: string;
  referrerUrl?: string;
  referrerSlug?: string;
  referralContext?: string;
  referrerPublishConsent?: string;
  currentInterest?: string[];
  interestedProjects?: string[];
  communityInterest?: string;
  monitorInterest?: string;
  possibleContribution?: string[];
  expectationText?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  pagePath?: string;
  device?: string;
  ctaClicked?: string;
  memo?: string;
}

export function getDeviceLabel() {
  if (typeof window === "undefined") return "";
  return window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop";
}

export function getTrackingParams(searchParams: URLSearchParams): RevoResearchPayload {
  return {
    referrerSlug: searchParams.get("ref") ?? "",
    utmSource: searchParams.get("utm_source") ?? "",
    utmMedium: searchParams.get("utm_medium") ?? "",
    utmCampaign: searchParams.get("utm_campaign") ?? "",
  };
}

export function joinMultiSelect(values?: string[]) {
  return values?.filter(Boolean).join(", ") ?? "";
}
