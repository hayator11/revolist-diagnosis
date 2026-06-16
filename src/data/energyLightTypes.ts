import type { EnergyKey } from "./energyLightQuestions";

export type EnergyTypeId =
  | "01"
  | "02"
  | "03"
  | "04"
  | "05"
  | "06"
  | "07"
  | "08"
  | "09"
  | "10"
  | "11";

export interface EnergyTypeContent {
  typeId: EnergyTypeId;
  name: string;
  catchcopy: string;
  energy: { primary: EnergyKey; secondary: EnergyKey | null; label: string };
  rarityBand: "minority" | "middle" | "majority";
  rarityText: string;
  essence: string;
  strengths: string[];
  giving: string[];
  receiving: string[];
  salvationLine: string;
  relations: {
    protectors: Array<{ typeIds: EnergyTypeId[]; text: string }>;
  };
  place: { activities: string[]; projects: string[] };
  ctaText: string;
}

export const energyTypeContents: Record<EnergyTypeId, EnergyTypeContent> = {
  "01": {
    typeId: "01",
    name: "レボリスト",
    catchcopy: "世界を動かす火種になる人",
    energy: { primary: "wood", secondary: "fire", label: "ひらく力 × ともす力" },
    rarityBand: "minority",
    rarityText: "少数派",
    essence: "未来の可能性を見つけ、人が動き出すきっかけを作る人です。",
    strengths: ["未来を描く", "始まりを作る", "人を巻き込む"],
    giving: ["希望", "熱量", "挑戦のきっかけ"],
    receiving: ["応援", "自由に試せる場", "共感"],
    salvationLine: "あなたは、まだ見えていない未来に最初の灯りを置ける人です。",
    relations: { protectors: [{ typeIds: ["08"], text: "設計する人がいると、火種が続く形になります。" }] },
    place: { activities: ["新規企画", "イベント企画", "プロジェクト立ち上げ"], projects: ["Revo Funding"] },
    ctaText: "あなたの火種を一緒に形にする仲間が、ここにいます。",
  },
  "02": {
    typeId: "02",
    name: "マックスデザイナー",
    catchcopy: "可能性を最大化する創造者",
    energy: { primary: "wood", secondary: "water", label: "ひらく力 × よみとく力" },
    rarityBand: "minority",
    rarityText: "少数派",
    essence: "複数の可能性を見渡し、新しい選択肢として組み立てる人です。",
    strengths: ["発想", "構想", "選択肢づくり"],
    giving: ["可能性", "企画の種", "新しい視点"],
    receiving: ["刺激", "情報", "実現を支える仲間"],
    salvationLine: "あなたの広げる力は、誰かの未来の選択肢になります。",
    relations: { protectors: [{ typeIds: ["08"], text: "仕組みにする人がいると、構想が現実へ近づきます。" }] },
    place: { activities: ["商品企画", "事業開発", "コンセプト設計"], projects: ["Revo Funding"] },
    ctaText: "あなたの構想を面白がる仲間が、ここにいます。",
  },
  "03": {
    typeId: "03",
    name: "イメージマイスター",
    catchcopy: "感性で空気を変える表現者",
    energy: { primary: "fire", secondary: "water", label: "ともす力 × よみとく力" },
    rarityBand: "middle",
    rarityText: "中間",
    essence: "感じ取った空気や物語を、人に伝わる表現へ変える人です。",
    strengths: ["表現", "世界観づくり", "魅力化"],
    giving: ["憧れ", "感動", "物語"],
    receiving: ["共感", "反応", "創作できる余白"],
    salvationLine: "あなたの感性は、場の温度を変える大切な入口です。",
    relations: { protectors: [{ typeIds: ["07"], text: "磨き上げる人がいると、表現の信頼感が増します。" }] },
    place: { activities: ["デザイン", "発信", "ブランディング"], projects: ["Revo Song"] },
    ctaText: "あなたの世界観を受け取る仲間が、ここにいます。",
  },
  "04": {
    typeId: "04",
    name: "コミュニケーター",
    catchcopy: "人と人を自然につなぐ人",
    energy: { primary: "fire", secondary: "earth", label: "ともす力 × ささえる力" },
    rarityBand: "majority",
    rarityText: "多数派",
    essence: "人の間に会話と安心を生み、場を動きやすくする人です。",
    strengths: ["紹介", "会話", "場づくり"],
    giving: ["つながり", "笑顔", "会話のきっかけ"],
    receiving: ["交流", "感謝", "あたたかい関係"],
    salvationLine: "あなたが自然につくる会話が、誰かの一歩になります。",
    relations: { protectors: [{ typeIds: ["10"], text: "安心を育てる人がいると、つながりが深まります。" }] },
    place: { activities: ["コミュニティ運営", "広報", "交流会"], projects: ["Revo Link"] },
    ctaText: "あなたのつながりから始まる場が、ここにあります。",
  },
  "05": {
    typeId: "05",
    name: "インフォレイダー",
    catchcopy: "情報を武器に未来を読む人",
    energy: { primary: "water", secondary: null, label: "よみとく力の純型" },
    rarityBand: "minority",
    rarityText: "少数派",
    essence: "情報と流れを読み、判断しやすい形へ変える人です。",
    strengths: ["情報収集", "洞察", "比較"],
    giving: ["判断材料", "知識", "見通し"],
    receiving: ["信頼できる情報", "深い対話", "学び"],
    salvationLine: "あなたの読み解く力は、周りが進むための地図になります。",
    relations: { protectors: [{ typeIds: ["08"], text: "構造化する人がいると、知恵が使いやすい形になります。" }] },
    place: { activities: ["リサーチ", "分析", "編集"], projects: ["Revo Research"] },
    ctaText: "あなたの見通しを活かせる仲間が、ここにいます。",
  },
  "06": {
    typeId: "06",
    name: "ムーブメンター",
    catchcopy: "空気を動かし人を前へ進める人",
    energy: { primary: "fire", secondary: null, label: "ともす力の純型" },
    rarityBand: "majority",
    rarityText: "多数派",
    essence: "人の背中を押し、場に前向きな熱を灯す人です。",
    strengths: ["応援", "盛り上げ", "行動促進"],
    giving: ["勇気", "前向きさ", "行動力"],
    receiving: ["感謝", "成長実感", "一緒に動く仲間"],
    salvationLine: "あなたの熱量は、誰かが動き出す合図になります。",
    relations: { protectors: [{ typeIds: ["10"], text: "受け止める人がいると、熱量が安心して続きます。" }] },
    place: { activities: ["教育", "イベント", "応援企画"], projects: ["Revo Link"] },
    ctaText: "あなたの応援が力になる場所が、ここにあります。",
  },
  "07": {
    typeId: "07",
    name: "プルミエルクラフター",
    catchcopy: "細部に魂を宿す職人",
    energy: { primary: "metal", secondary: "earth", label: "かためる力 × ささえる力" },
    rarityBand: "middle",
    rarityText: "中間",
    essence: "価値あるものを丁寧に磨き、信頼される形へ育てる人です。",
    strengths: ["品質向上", "丁寧さ", "改善"],
    giving: ["信頼", "完成度", "安心感"],
    receiving: ["評価", "良い素材", "集中できる環境"],
    salvationLine: "あなたの丁寧さは、価値を長く残す力です。",
    relations: { protectors: [{ typeIds: ["03"], text: "表現する人がいると、磨いた価値が届きやすくなります。" }] },
    place: { activities: ["制作", "品質管理", "編集"], projects: ["Revo Song"] },
    ctaText: "あなたの丁寧さを必要とする場が、ここにあります。",
  },
  "08": {
    typeId: "08",
    name: "ロジカルマイスター",
    catchcopy: "無茶を現実に変える設計者",
    energy: { primary: "metal", secondary: null, label: "かためる力の純型" },
    rarityBand: "middle",
    rarityText: "中間",
    essence: "複雑なものを整理し、誰でも動ける仕組みへ変える人です。",
    strengths: ["設計", "構造化", "再現性"],
    giving: ["設計図", "判断基準", "安定"],
    receiving: ["明確な目的", "データ", "信頼"],
    salvationLine: "あなたの構造化は、想いが続くための土台です。",
    relations: { protectors: [{ typeIds: ["01"], text: "未来を語る人がいると、仕組みに熱が入ります。" }] },
    place: { activities: ["業務設計", "システム設計", "PM"], projects: ["Revo Funding"] },
    ctaText: "あなたの設計を待っている企画が、ここにあります。",
  },
  "09": {
    typeId: "09",
    name: "アレンジャー",
    catchcopy: "人と流れを整える調律者",
    energy: { primary: "earth", secondary: "metal", label: "ささえる力 × かためる力" },
    rarityBand: "majority",
    rarityText: "多数派",
    essence: "人・情報・役割の流れを見て、活動が進みやすい形に整える人です。",
    strengths: ["調整", "段取り", "運営"],
    giving: ["流れ", "調和", "継続性"],
    receiving: ["信頼", "協力", "役割の明確さ"],
    salvationLine: "あなたが整える流れは、チームが動き続ける力になります。",
    relations: { protectors: [{ typeIds: ["01"], text: "始める人がいると、整えた流れに未来が乗ります。" }] },
    place: { activities: ["運営", "PM", "コミュニティ設計"], projects: ["Revo Link"] },
    ctaText: "あなたの調整力が活きるチームが、ここにあります。",
  },
  "10": {
    typeId: "10",
    name: "ソウルオーナー",
    catchcopy: "人の心に灯りをともす人",
    energy: { primary: "earth", secondary: null, label: "ささえる力の純型" },
    rarityBand: "majority",
    rarityText: "多数派",
    essence: "人が本音でいられる土台を作り、挑戦を支える人です。",
    strengths: ["受容", "居場所づくり", "信頼形成"],
    giving: ["安心感", "優しさ", "信頼"],
    receiving: ["本音", "感謝", "深い関係"],
    salvationLine: "あなたの安心感は、誰かが自分を取り戻す場所になります。",
    relations: { protectors: [{ typeIds: ["06"], text: "背中を押す人がいると、安心が行動につながります。" }] },
    place: { activities: ["福祉", "教育", "コミュニティ運営"], projects: ["Revo Link"] },
    ctaText: "あなたの安心感を必要とする仲間が、ここにいます。",
  },
  "11": {
    typeId: "11",
    name: "クレイジスト",
    catchcopy: "常識の外から未来を持ってくる人",
    energy: { primary: "wood", secondary: null, label: "ひらく力の純型" },
    rarityBand: "minority",
    rarityText: "少数派",
    essence: "まだ見えていない切り口から、未来の種を持ってくる人です。",
    strengths: ["独創性", "突破発想", "実験"],
    giving: ["驚き", "新しい発想", "未来の種"],
    receiving: ["自由な実験場", "面白がってくれる仲間", "否定されない余白"],
    salvationLine: "あなたは直すべき存在ではなく、守られるべき火種です。",
    relations: { protectors: [{ typeIds: ["06"], text: "熱量を広げる人がいると、発想が場に届きます。" }] },
    place: { activities: ["新規企画", "実験企画", "アート"], projects: ["Revo Funding"] },
    ctaText: "あなたの発想を面白いと言う仲間が、ここにいます。",
  },
};
