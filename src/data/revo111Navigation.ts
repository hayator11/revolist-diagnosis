import type { RevoTypeKey } from "./revotypes";

export type ActivityScoreKey =
  | "仕事"
  | "副業"
  | "SNS発信"
  | "地域活動"
  | "ボランティア"
  | "コミュニティ運営"
  | "プロジェクト参加";

export interface Revo111Navigation {
  publicLabel: string;
  publicSummary: string;
  workExamples: string[];
  activityScores: Record<ActivityScoreKey, number>;
  partnerLabels: string[];
  growthMeanings: string[];
  todayMission: string;
}

export const activityScoreLabels: ActivityScoreKey[] = [
  "仕事",
  "副業",
  "SNS発信",
  "地域活動",
  "ボランティア",
  "コミュニティ運営",
  "プロジェクト参加",
];

export const revo111Navigation: Record<RevoTypeKey, Revo111Navigation> = {
  revolist: {
    publicLabel: "未来をつくる人",
    publicSummary: "まだ形になっていない可能性を見つけ、最初の一歩を生み出す人です。",
    workExamples: ["起業", "営業", "イベント企画", "プロデューサー", "新規事業"],
    activityScores: { 仕事: 5, 副業: 5, SNS発信: 4, 地域活動: 5, ボランティア: 4, コミュニティ運営: 4, プロジェクト参加: 5 },
    partnerLabels: ["数字に強い人", "段取りが得意な人", "人をつなぐ人", "安心感を作る人"],
    growthMeanings: ["未来を生み出す", "人を動かす", "人をつなぐ", "循環を作る"],
    todayMission: "スマホのメモに、やってみたいことを1つだけ書いてみてください。",
  },
  maxdesigner: {
    publicLabel: "可能性を広げる人",
    publicSummary: "ひとつの答えに閉じず、新しい選択肢や企画の形を見つける人です。",
    workExamples: ["企画職", "商品企画", "広告", "ブランディング", "事業開発"],
    activityScores: { 仕事: 5, 副業: 5, SNS発信: 4, 地域活動: 3, ボランティア: 3, コミュニティ運営: 3, プロジェクト参加: 5 },
    partnerLabels: ["感性で表現できる人", "仕組みにできる人", "常識を揺らす人", "最初に動く人"],
    growthMeanings: ["可能性を広げる", "見える形にする", "実現方法を作る", "社会へ動かす"],
    todayMission: "思いついたアイデアを3つ、評価せずにメモしてみてください。",
  },
  imagemaister: {
    publicLabel: "魅力を見える形にする人",
    publicSummary: "言葉になりにくい想いや空気を、デザインや世界観として伝える人です。",
    workExamples: ["デザイン", "広報", "映像制作", "SNS運用", "ブランドづくり"],
    activityScores: { 仕事: 5, 副業: 5, SNS発信: 5, 地域活動: 3, ボランティア: 3, コミュニティ運営: 3, プロジェクト参加: 4 },
    partnerLabels: ["丁寧に仕上げる人", "人に届ける人", "深く受け止める人", "未来を語る人"],
    growthMeanings: ["世界観を作る", "品質を高める", "人へ届ける", "文化にする"],
    todayMission: "頭の中にあるイメージを、写真・言葉・色のどれか1つで残してみてください。",
  },
  communicator: {
    publicLabel: "人をつなぐ人",
    publicSummary: "人と人の間に会話やご縁を生み、可能性が出会う場を作る人です。",
    workExamples: ["営業", "広報", "接客", "コミュニティ運営", "人材紹介"],
    activityScores: { 仕事: 5, 副業: 4, SNS発信: 5, 地域活動: 5, ボランティア: 4, コミュニティ運営: 5, プロジェクト参加: 5 },
    partnerLabels: ["安心感を作る人", "背中を押す人", "情報に強い人", "段取りが得意な人"],
    growthMeanings: ["人をつなぐ", "信頼を育てる", "行動を生む", "挑戦へ広げる"],
    todayMission: "最近気になっている人に、短いメッセージを1つ送ってみてください。",
  },
  inforader: {
    publicLabel: "判断材料を集める人",
    publicSummary: "情報を集め、比べ、周りが動きやすくなる知恵に変える人です。",
    workExamples: ["リサーチ", "マーケティング", "編集", "分析", "コンサル補佐"],
    activityScores: { 仕事: 5, 副業: 4, SNS発信: 3, 地域活動: 3, ボランティア: 3, コミュニティ運営: 3, プロジェクト参加: 4 },
    partnerLabels: ["仕組みにできる人", "人に伝える人", "流れを整える人"],
    growthMeanings: ["情報を集める", "構造にする", "共有する", "運用へつなぐ"],
    todayMission: "気になるテーマを1つ調べて、3行だけメモにまとめてみてください。",
  },
  movmentor: {
    publicLabel: "人の一歩を応援する人",
    publicSummary: "誰かの挑戦に気づき、前に進む勇気を渡せる人です。",
    workExamples: ["教育", "研修", "マネジメント", "コーチング", "イベント運営"],
    activityScores: { 仕事: 5, 副業: 4, SNS発信: 4, 地域活動: 5, ボランティア: 5, コミュニティ運営: 5, プロジェクト参加: 5 },
    partnerLabels: ["安心感を作る人", "人をつなぐ人", "未来を語る人"],
    growthMeanings: ["応援する", "人をつなぐ", "安心を育てる", "循環を作る"],
    todayMission: "挑戦している人に、応援していることを具体的な言葉で伝えてみてください。",
  },
  premiercrafter: {
    publicLabel: "価値を磨き上げる人",
    publicSummary: "細部を見つめ、良いものをさらに信頼される形へ育てる人です。",
    workExamples: ["制作", "品質管理", "編集", "職人仕事", "商品改善"],
    activityScores: { 仕事: 5, 副業: 5, SNS発信: 3, 地域活動: 3, ボランティア: 3, コミュニティ運営: 2, プロジェクト参加: 4 },
    partnerLabels: ["魅力を見える形にする人", "仕組みにできる人"],
    growthMeanings: ["品質を高める", "魅力にする", "人へ届ける", "文化にする"],
    todayMission: "今ある成果物を1つ選び、3分だけ整えてみてください。",
  },
  logicalmaister: {
    publicLabel: "仕組みを作る人",
    publicSummary: "複雑なものを整理し、誰でも動ける道筋へ変える人です。",
    workExamples: ["PM", "システム設計", "業務改善", "経営企画", "データ分析"],
    activityScores: { 仕事: 5, 副業: 4, SNS発信: 3, 地域活動: 3, ボランティア: 3, コミュニティ運営: 4, プロジェクト参加: 5 },
    partnerLabels: ["未来を語る人", "段取りが得意な人", "人に伝える人"],
    growthMeanings: ["仕組みを作る", "運営へ移す", "人へ伝える", "未来へ広げる"],
    todayMission: "頭の中にあることを、箇条書きで5つだけ書き出してみてください。",
  },
  arranger: {
    publicLabel: "流れを整える人",
    publicSummary: "人・情報・役割をつなぎ、活動が続きやすい流れを作る人です。",
    workExamples: ["人事", "総務", "運営", "PM", "店舗管理"],
    activityScores: { 仕事: 5, 副業: 4, SNS発信: 3, 地域活動: 5, ボランティア: 4, コミュニティ運営: 5, プロジェクト参加: 5 },
    partnerLabels: ["未来を語る人", "仕組みにできる人", "人をつなぐ人"],
    growthMeanings: ["流れを整える", "人をつなぐ", "信頼を育てる", "文化にする"],
    todayMission: "今関わっている活動で、誰が何を担っているか3つだけ書いてみてください。",
  },
  soulowner: {
    publicLabel: "安心を育てる人",
    publicSummary: "人が本音を話し、挑戦を続けられる土台を作る人です。",
    workExamples: ["教育", "福祉", "接客", "カウンセリング", "コミュニティ運営"],
    activityScores: { 仕事: 5, 副業: 4, SNS発信: 3, 地域活動: 5, ボランティア: 5, コミュニティ運営: 5, プロジェクト参加: 4 },
    partnerLabels: ["背中を押す人", "人をつなぐ人", "流れを整える人"],
    growthMeanings: ["安心を育てる", "人をつなぐ", "行動を支える", "挑戦へ広げる"],
    todayMission: "誰かの話を最後まで聞き、安心できる一言を返してみてください。",
  },
  crazist: {
    publicLabel: "新しい可能性を見つける人",
    publicSummary: "違和感や独自の視点から、まだ誰も見ていない未来の種を出す人です。",
    workExamples: ["新規事業", "商品開発", "研究職", "企画開発", "クリエイティブ"],
    activityScores: { 仕事: 5, 副業: 5, SNS発信: 5, 地域活動: 3, ボランティア: 3, コミュニティ運営: 3, プロジェクト参加: 5 },
    partnerLabels: ["可能性を広げる人", "仕組みにできる人", "未来を語る人"],
    growthMeanings: ["違和感を見つける", "発想へ変える", "魅力として見せる", "実現へ進める"],
    todayMission: "普通なら言わないアイデアを1つ、メモに書いてみてください。",
  },
};
