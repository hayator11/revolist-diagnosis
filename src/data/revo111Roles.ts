import type { RevoTypeKey } from "./revotypes";

export interface Revo111Role {
  key: RevoTypeKey;
  name: string;
  catchCopy: string;
  mission: string;
  naturalActions: string[];
  gives: string[];
  receives: string[];
  comfortableEnvironment: string;
  fundingRole: string;
  fundingStrengths: string[];
  fundingWays: string[];
  linkRole: string;
  songRole: string;
  futurePartners: RevoTypeKey[];
  quest: {
    beginner: string;
    intermediate: string;
    advanced: string;
  };
  recommendedActivities: string[];
}

export interface GrowthRoute {
  route: RevoTypeKey[];
  theme: string[];
  description: string;
}

export interface MatchRule {
  partner: RevoTypeKey;
  creates: string[];
  description: string;
}

export interface ThirdPersonEffect {
  pair: [RevoTypeKey, RevoTypeKey];
  third: RevoTypeKey;
  flow: string[];
  result: string;
}

export const revo111Roles: Record<RevoTypeKey, Revo111Role> = {
  revolist: {
    key: "revolist",
    name: "レボリスト",
    catchCopy: "未来に火を灯す人。",
    mission: "まだ誰も動いていない場所で、最初の一歩を生み出す。",
    naturalActions: ["未来を語る", "挑戦を始める", "人を巻き込む", "旗を立てる"],
    gives: ["希望", "熱量", "勇気", "挑戦のきっかけ"],
    receives: ["信頼", "応援", "共感", "自由に挑戦できる環境"],
    comfortableEnvironment:
      "挑戦を歓迎してくれる場所。否定から入らず、未来の可能性を一緒に見てくれる仲間がいる環境。",
    fundingRole: "起案者・旗振り役",
    fundingStrengths: ["ビジョン提示", "旗振り", "新規プロジェクト"],
    fundingWays: ["プロジェクト立ち上げ", "新企画", "挑戦テーマ作り"],
    linkRole: "挑戦の起点を作る人",
    songRole: "想いや世界観を発信する人",
    futurePartners: ["logicalmaister", "arranger", "communicator", "soulowner"],
    quest: {
      beginner: "やってみたいことを1つ言葉にする。",
      intermediate: "その想いを1人に話す。",
      advanced: "小さな企画として仲間を1人誘う。",
    },
    recommendedActivities: ["防災", "地域活性", "応援経済"],
  },
  maxdesigner: {
    key: "maxdesigner",
    name: "マックスデザイナー",
    catchCopy: "可能性を設計する人。",
    mission: "まだ形になっていない未来の選択肢を広げる。",
    naturalActions: ["アイデアを広げる", "複数案を考える", "企画を組み立てる", "新しい見せ方を考える"],
    gives: ["可能性", "選択肢", "企画の種", "新しい視点"],
    receives: ["自由", "刺激", "発見", "実現を支えてくれる仲間"],
    comfortableEnvironment: "自由に発想できる場所。新しいアイデアを面白がってくれる環境。",
    fundingRole: "企画設計",
    fundingStrengths: ["コンセプト", "アイデア創出", "商品企画"],
    fundingWays: ["プロジェクト設計", "商品企画", "イベント企画"],
    linkRole: "新しい価値を生み出す人",
    songRole: "コンセプトメーカー",
    futurePartners: ["crazist", "imagemaister", "logicalmaister", "revolist"],
    quest: {
      beginner: "思いついたアイデアを3つ書き出す。",
      intermediate: "その中から一番面白いものを1つ選ぶ。",
      advanced: "企画タイトルと目的を作る。",
    },
    recommendedActivities: ["企画設計", "商品企画", "イベント企画"],
  },
  imagemaister: {
    key: "imagemaister",
    name: "イメージマイスター",
    catchCopy: "未来を見える形にする人。",
    mission: "感性や世界観を通して、見えない想いを人に伝わる形へ変える。",
    naturalActions: ["世界観を作る", "雰囲気を整える", "表現する", "魅力を見える形にする"],
    gives: ["憧れ", "感動", "物語", "美しさ", "世界観"],
    receives: ["共感", "反応", "表現を認められる場", "安心して創作できる環境"],
    comfortableEnvironment: "感性を尊重される場所。世界観や表現を大切にしてくれるチーム。",
    fundingRole: "ブランド担当",
    fundingStrengths: ["世界観構築", "デザイン", "魅力表現"],
    fundingWays: ["ビジュアル", "PR素材", "ブランディング"],
    linkRole: "魅力を伝える人",
    songRole: "世界観制作",
    futurePartners: ["premiercrafter", "communicator", "soulowner", "revolist"],
    quest: {
      beginner: "頭の中のイメージを1枚の画像や言葉にする。",
      intermediate: "その世界観を誰かに見せる。",
      advanced: "見せた反応をもとに表現を磨く。",
    },
    recommendedActivities: ["キャラクター", "エンタメ", "ブランド"],
  },
  communicator: {
    key: "communicator",
    name: "コミュニケーター",
    catchCopy: "人と人の間に橋をかける人。",
    mission: "ご縁を循環させ、人と人の可能性を結びつける。",
    naturalActions: ["人を紹介する", "会話を生む", "場をやわらげる", "人の魅力を伝える"],
    gives: ["ご縁", "会話のきっかけ", "笑顔", "つながり"],
    receives: ["交流", "感謝", "仲間", "あたたかい関係性"],
    comfortableEnvironment: "人が集まる場所。紹介や会話が歓迎される環境。",
    fundingRole: "広報担当",
    fundingStrengths: ["人をつなぐ", "紹介", "発信"],
    fundingWays: ["SNS", "広報", "コミュニティ形成"],
    linkRole: "接続役・紹介役",
    songRole: "ファン形成",
    futurePartners: ["soulowner", "movmentor", "inforader", "arranger"],
    quest: {
      beginner: "最近気になっている人に声をかける。",
      intermediate: "合いそうな2人を紹介する。",
      advanced: "小さな交流の場を作る。",
    },
    recommendedActivities: ["防災", "地域活性", "応援経済", "コミュニティ形成"],
  },
  inforader: {
    key: "inforader",
    name: "インフォレイダー",
    catchCopy: "情報を価値に変える人。",
    mission: "散らばった情報を集め、判断できる知恵へ変換する。",
    naturalActions: ["調べる", "比較する", "情報収集する", "根拠を探す"],
    gives: ["知識", "判断材料", "安心感", "客観性"],
    receives: ["信頼できる情報源", "学び", "新しい知識", "深い対話"],
    comfortableEnvironment: "学びが歓迎される環境。",
    fundingRole: "調査担当",
    fundingStrengths: ["情報収集", "市場調査", "比較分析"],
    fundingWays: ["リサーチ", "競合分析", "情報整理"],
    linkRole: "知識共有",
    songRole: "背景整理",
    futurePartners: ["logicalmaister", "communicator", "arranger"],
    quest: {
      beginner: "気になるテーマを1つ調べる。",
      intermediate: "調べた内容を3行にまとめる。",
      advanced: "その情報を誰かの行動に役立つ形で共有する。",
    },
    recommendedActivities: ["教育", "テクノロジー", "リサーチ"],
  },
  movmentor: {
    key: "movmentor",
    name: "ムーブメンター",
    catchCopy: "人の一歩を応援する人。",
    mission: "挑戦する人の背中を押す。",
    naturalActions: ["応援する", "勇気づける", "励ます", "行動を促す"],
    gives: ["勇気", "前向きさ", "行動力", "希望"],
    receives: ["感謝", "成長実感", "仲間の成功"],
    comfortableEnvironment: "挑戦がある環境。",
    fundingRole: "伴走担当",
    fundingStrengths: ["応援", "モチベート", "継続支援"],
    fundingWays: ["サポート", "応援企画", "メンター"],
    linkRole: "応援役",
    songRole: "共感拡散",
    futurePartners: ["soulowner", "communicator", "revolist"],
    quest: {
      beginner: "挑戦している人に応援の言葉を届ける。",
      intermediate: "その人の次の一歩を一緒に考える。",
      advanced: "応援の輪をもう1人に広げる。",
    },
    recommendedActivities: ["教育", "福祉", "応援経済"],
  },
  premiercrafter: {
    key: "premiercrafter",
    name: "プルミエルクラフター",
    catchCopy: "品質を育てる人。",
    mission: "良いものを本物へ育てる。",
    naturalActions: ["細部を見る", "磨き込む", "品質を上げる", "改善する"],
    gives: ["信頼", "品質", "安心感", "完成度"],
    receives: ["評価", "認知", "良い作品との出会い"],
    comfortableEnvironment: "丁寧な仕事が評価される場所。",
    fundingRole: "品質担当",
    fundingStrengths: ["改善", "完成度向上", "品質管理"],
    fundingWays: ["制作", "校正", "品質向上"],
    linkRole: "価値向上",
    songRole: "作品磨き",
    futurePartners: ["imagemaister", "logicalmaister"],
    quest: {
      beginner: "今ある作品や成果物を1つ磨く。",
      intermediate: "改善した部分を誰かに見てもらう。",
      advanced: "作品の制作過程を発信する。",
    },
    recommendedActivities: ["キャラクター", "制作", "品質向上"],
  },
  logicalmaister: {
    key: "logicalmaister",
    name: "ロジカルマイスター",
    catchCopy: "仕組みを作る人。",
    mission: "感覚を再現可能な形へ変える。",
    naturalActions: ["整理する", "構造化する", "設計する", "仕組み化する"],
    gives: ["安定", "再現性", "設計図", "判断基準"],
    receives: ["明確な目的", "データ", "信頼"],
    comfortableEnvironment: "論理的に考えられる場所。",
    fundingRole: "設計担当",
    fundingStrengths: ["仕組み化", "数値設計", "システム構築"],
    fundingWays: ["業務設計", "システム設計", "KPI設計"],
    linkRole: "構造設計",
    songRole: "企画設計",
    futurePartners: ["revolist", "arranger", "communicator"],
    quest: {
      beginner: "考えていることを箇条書きにする。",
      intermediate: "流れや構造を図にする。",
      advanced: "人が使える手順やテンプレートにする。",
    },
    recommendedActivities: ["テクノロジー", "システム構築", "AI活用"],
  },
  arranger: {
    key: "arranger",
    name: "アレンジャー",
    catchCopy: "人・情報・役割をつなぐ人。",
    mission: "バラバラなものをつなぎ、流れを生み出す。",
    naturalActions: ["調整する", "段取りを組む", "人をつなぐ", "全体を見る"],
    gives: ["安心感", "流れ", "調和", "継続性"],
    receives: ["信頼", "感謝", "仲間意識", "協力"],
    comfortableEnvironment: "チームで動く環境。役割分担がある環境。",
    fundingRole: "運営担当",
    fundingStrengths: ["調整", "進行管理", "チーム構築"],
    fundingWays: ["PM", "事務局", "運営管理"],
    linkRole: "接続管理・コミュニティ設計",
    songRole: "制作進行",
    futurePartners: ["revolist", "logicalmaister", "communicator"],
    quest: {
      beginner: "今関わっている活動の役割を書き出す。",
      intermediate: "誰が何を担っているか整理する。",
      advanced: "次に必要な役割を1つ提案する。",
    },
    recommendedActivities: ["防災", "地域活性", "応援経済", "運営管理"],
  },
  soulowner: {
    key: "soulowner",
    name: "ソウルオーナー",
    catchCopy: "安心できる居場所を作る人。",
    mission: "人が挑戦を続けられる土台を育てる。",
    naturalActions: ["話を聞く", "気持ちを受け止める", "寄り添う", "支える"],
    gives: ["安心感", "信頼", "優しさ", "受容"],
    receives: ["本音", "感謝", "信頼関係", "深い対話"],
    comfortableEnvironment: "人との関係を大切にできる場所。",
    fundingRole: "関係性担当",
    fundingStrengths: ["信頼構築", "ケア", "居場所づくり"],
    fundingWays: ["コミュニティ運営", "人材定着", "フォロー"],
    linkRole: "居場所づくり・関係性づくり",
    songRole: "物語の共感者",
    futurePartners: ["movmentor", "communicator", "arranger"],
    quest: {
      beginner: "誰かの話を最後まで聞く。",
      intermediate: "相手が安心できる言葉を1つ返す。",
      advanced: "安心して話せる小さな場を作る。",
    },
    recommendedActivities: ["教育", "福祉", "コミュニティ"],
  },
  crazist: {
    key: "crazist",
    name: "クレイジスト",
    catchCopy: "常識を揺らす人。",
    mission: "違和感から新しい未来を生み出す。",
    naturalActions: ["疑問を持つ", "常識を疑う", "新しい視点を出す", "枠を超える"],
    gives: ["発見", "革新", "違和感", "創造性"],
    receives: ["自由", "理解者", "挑戦機会"],
    comfortableEnvironment: "新しいことを歓迎する場所。",
    fundingRole: "変革担当",
    fundingStrengths: ["常識を揺らす視点", "新規事業", "イノベーション"],
    fundingWays: ["実験プロジェクト", "新市場開拓", "新商品開発"],
    linkRole: "異分野接続・未来創造",
    songRole: "新ジャンル創造",
    futurePartners: ["maxdesigner", "logicalmaister", "revolist"],
    quest: {
      beginner: "普通なら言わないアイデアを1つ書く。",
      intermediate: "そのアイデアを安全に試せる形に変える。",
      advanced: "小さな実験として実行する。",
    },
    recommendedActivities: ["新規事業", "AI", "実験プロジェクト"],
  },
};

export const growthRoutes: Record<RevoTypeKey, GrowthRoute> = {
  revolist: {
    route: ["revolist", "movmentor", "communicator", "arranger"],
    theme: ["挑戦", "応援", "接続", "循環"],
    description: "あなたの次の成長ルートは、熱量を人の行動へ広げていく方向です。",
  },
  maxdesigner: {
    route: ["maxdesigner", "imagemaister", "logicalmaister", "revolist"],
    theme: ["発想", "表現", "設計", "実現"],
    description: "あなたの次の成長ルートは、発想を表現し、設計を通して実現へ進める方向です。",
  },
  imagemaister: {
    route: ["imagemaister", "premiercrafter", "communicator", "revolist"],
    theme: ["世界観", "品質", "伝達", "文化"],
    description: "あなたの次の成長ルートは、世界観を磨き、人へ届く文化へ育てる方向です。",
  },
  communicator: {
    route: ["communicator", "soulowner", "movmentor", "revolist"],
    theme: ["接続", "信頼", "行動", "挑戦"],
    description: "あなたの次の成長ルートは、つながりを信頼に変え、人の行動を生む方向です。",
  },
  inforader: {
    route: ["inforader", "logicalmaister", "communicator", "arranger"],
    theme: ["情報", "設計", "共有", "運用"],
    description: "あなたの次の成長ルートは、情報を設計し、共有される価値へ変える方向です。",
  },
  movmentor: {
    route: ["movmentor", "communicator", "soulowner", "arranger"],
    theme: ["応援", "接続", "安心", "循環"],
    description: "あなたの次の成長ルートは、応援をつながりに変え、続く循環へ育てる方向です。",
  },
  premiercrafter: {
    route: ["premiercrafter", "imagemaister", "communicator", "revolist"],
    theme: ["品質", "魅力", "発信", "文化"],
    description: "あなたの次の成長ルートは、品質を魅力として届け、文化へ育てる方向です。",
  },
  logicalmaister: {
    route: ["logicalmaister", "arranger", "communicator", "revolist"],
    theme: ["設計", "運営", "接続", "未来"],
    description: "あなたの次の成長ルートは、設計を運営へつなげ、人が動ける未来を作る方向です。",
  },
  arranger: {
    route: ["arranger", "communicator", "soulowner", "revolist"],
    theme: ["調整", "接続", "信頼", "文化"],
    description: "あなたの次の成長ルートは、調整を信頼へ変え、文化として続く流れを作る方向です。",
  },
  soulowner: {
    route: ["soulowner", "communicator", "movmentor", "revolist"],
    theme: ["安心", "接続", "行動", "挑戦"],
    description: "あなたの次の成長ルートは、安心をつながりに変え、挑戦を支える方向です。",
  },
  crazist: {
    route: ["crazist", "maxdesigner", "imagemaister", "revolist"],
    theme: ["違和感", "発想", "表現", "実現"],
    description: "あなたの次の成長ルートは、違和感を発想へ変え、実現へ進める方向です。",
  },
};

export const matchRules: Record<RevoTypeKey, MatchRule[]> = {
  revolist: [
    { partner: "logicalmaister", creates: ["理想", "設計"], description: "レボリストが未来を描き、ロジカルマイスターが実現方法を作ります。" },
    { partner: "arranger", creates: ["挑戦", "継続"], description: "レボリストが火を灯し、アレンジャーが流れを整えます。" },
    { partner: "soulowner", creates: ["挑戦", "安心"], description: "レボリストが未来を語り、ソウルオーナーが居場所を作ります。" },
    { partner: "movmentor", creates: ["挑戦", "行動"], description: "理想が人の一歩になる組み合わせです。" },
  ],
  maxdesigner: [
    { partner: "imagemaister", creates: ["発想", "世界観"], description: "アイデアが見える形になります。" },
    { partner: "logicalmaister", creates: ["発想", "設計"], description: "面白い企画が実現可能な形へ育ちます。" },
    { partner: "crazist", creates: ["可能性", "革命"], description: "常識の外側にある企画が生まれます。" },
  ],
  imagemaister: [
    { partner: "premiercrafter", creates: ["世界観", "品質"], description: "魅力が本物へ育ちます。" },
    { partner: "communicator", creates: ["作品", "共感"], description: "良い作品が人へ届きます。" },
  ],
  communicator: [
    { partner: "soulowner", creates: ["関係", "信頼"], description: "交流が居場所へ育ちます。" },
    { partner: "movmentor", creates: ["会話", "行動"], description: "人が動き始めるきっかけが生まれます。" },
  ],
  inforader: [
    { partner: "logicalmaister", creates: ["情報", "戦略"], description: "調査が活動の武器になります。" },
    { partner: "communicator", creates: ["知識", "共有"], description: "価値が広く伝わります。" },
  ],
  movmentor: [
    { partner: "soulowner", creates: ["応援", "安心"], description: "人が挑戦を続けやすくなります。" },
    { partner: "arranger", creates: ["熱量", "継続"], description: "盛り上がりが文化へ育ちます。" },
  ],
  premiercrafter: [
    { partner: "imagemaister", creates: ["品質", "ブランド"], description: "作品が資産へ育ちます。" },
  ],
  logicalmaister: [
    { partner: "arranger", creates: ["設計", "運営"], description: "仕組みが動き出します。" },
    { partner: "communicator", creates: ["論理", "理解"], description: "難しいことが伝わる形になります。" },
  ],
  arranger: [
    { partner: "soulowner", creates: ["運営", "居場所"], description: "人が戻ってくるコミュニティへ育ちます。" },
  ],
  soulowner: [
    { partner: "movmentor", creates: ["安心", "行動"], description: "安心できる土台から一歩が生まれます。" },
    { partner: "communicator", creates: ["本音", "つながり"], description: "本音を話せる関係が広がります。" },
  ],
  crazist: [
    { partner: "logicalmaister", creates: ["違和感", "革新"], description: "変わったアイデアが事業の種へ育ちます。" },
    { partner: "imagemaister", creates: ["発想", "魅力"], description: "未来の種が人を惹きつけます。" },
  ],
};

export const thirdPersonEffects: ThirdPersonEffect[] = [
  {
    pair: ["revolist", "logicalmaister"],
    third: "arranger",
    flow: ["理想", "設計", "運営"],
    result: "プロジェクトになります。",
  },
  {
    pair: ["communicator", "inforader"],
    third: "logicalmaister",
    flow: ["情報", "整理", "共有"],
    result: "価値になります。",
  },
  {
    pair: ["imagemaister", "premiercrafter"],
    third: "communicator",
    flow: ["作品", "共感", "拡散"],
    result: "ファンが生まれます。",
  },
  {
    pair: ["movmentor", "revolist"],
    third: "soulowner",
    flow: ["挑戦", "安心", "継続"],
    result: "文化になります。",
  },
  {
    pair: ["crazist", "maxdesigner"],
    third: "logicalmaister",
    flow: ["発想", "設計", "実装"],
    result: "事業になります。",
  },
];
