export type RevoTypeKey =
  | "revolist"
  | "maxdesigner"
  | "imagemaister"
  | "communicator"
  | "inforader"
  | "movmentor"
  | "premiercrafter"
  | "logicalmaister"
  | "arranger"
  | "soulowner"
  | "crazist";

export interface RevoType {
  key: RevoTypeKey;
  name: string;
  catchcopy: string;
  description: string;
  strengths: string[];
  potential: string[];
  gives: string[];
  receives: string[];
  goodWith: RevoTypeKey[];
  activities: string[];
  color: string;
}

export const revoTypes: Record<RevoTypeKey, RevoType> = {
  revolist: {
    key: "revolist",
    name: "レボリスト",
    catchcopy: "世界を動かす火種になる人",
    description:
      "最初に動き、理想を語り、熱量で人を巻き込む。未来をいち早く見据え、挑戦のきっかけを生み出す存在。",
    strengths: ["突破力", "行動力", "影響力", "挑戦力"],
    potential: [
      "想いが先に進みすぎることがある",
      "細部を整える仲間がいると力がさらに広がる",
      "ひとりで抱え込みやすい",
    ],
    gives: ["熱量", "希望", "挑戦のきっかけ"],
    receives: ["信頼", "応援", "自由に挑戦できる環境"],
    goodWith: ["arranger", "logicalmaister", "movmentor"],
    activities: ["企画立ち上げ", "プロジェクトの旗振り", "挑戦系イベント", "防災×帽祭の先導役"],
    color: "#dc2626",
  },
  maxdesigner: {
    key: "maxdesigner",
    name: "マックスデザイナー",
    catchcopy: "可能性を最大化する創造者",
    description:
      "アイデアを広げ、世界観を膨らませ、新しい見せ方を考える。発想力と企画力で未来を形にしていく存在。",
    strengths: ["発想力", "企画力", "演出力", "未来想像力"],
    potential: [
      "アイデアが広がりすぎることがある",
      "現実化を支える仲間がいると力が形になりやすい",
    ],
    gives: ["新しい視点", "面白さ", "可能性"],
    receives: ["余白", "自由な発想を歓迎する空気", "実現を支えてくれる仲間"],
    goodWith: ["logicalmaister", "arranger", "crazist"],
    activities: ["企画設計", "ブランディング", "レボアート", "レボハットの世界観づくり"],
    color: "#7c3aed",
  },
  imagemaister: {
    key: "imagemaister",
    name: "イメージマイスター",
    catchcopy: "感性で空気を変える表現者",
    description:
      "見せ方に敏感で、雰囲気づくりが得意。感情を動かし、美しさと感動を通して世界観を伝える存在。",
    strengths: ["デザイン感覚", "感性", "演出力", "魅せる力"],
    potential: [
      "感情に左右されやすいことがある",
      "想いを整理してくれる仲間がいると表現がさらに届きやすい",
    ],
    gives: ["美しさ", "感動", "世界観"],
    receives: ["感性を認めてもらえる場", "安心して表現できる環境", "丁寧なフィードバック"],
    goodWith: ["soulowner", "revolist", "communicator"],
    activities: ["デザイン", "映像", "アート制作", "レボアート", "レボハット演出"],
    color: "#db2777",
  },
  communicator: {
    key: "communicator",
    name: "コミュニケーター",
    catchcopy: "人と人を自然につなぐ人",
    description:
      "会話が得意で、空気を柔らかくする。誰とでも関われる対話力と安心感で、人と人の橋渡しをする存在。",
    strengths: ["対話力", "調和力", "安心感", "巻き込み力"],
    potential: [
      "気を使いすぎることがある",
      "自分の本音を受け止めてくれる仲間がいるとさらに自然体で動ける",
    ],
    gives: ["会話", "安心", "つながり"],
    receives: ["感謝", "あたたかい関係性", "無理をしなくてもいい空気"],
    goodWith: ["soulowner", "movmentor", "arranger"],
    activities: ["コミュニティ運営", "受付", "司会", "仲介", "レボリンク"],
    color: "#0891b2",
  },
  inforader: {
    key: "inforader",
    name: "インフォレイダー",
    catchcopy: "情報を武器に未来を読む人",
    description:
      "情報収集と分析が得意で、流れを読む。リサーチと観察力で、チームに確かな判断材料を提供する存在。",
    strengths: ["情報整理", "観察力", "リサーチ力", "時流把握"],
    potential: [
      "考え込みすぎることがある",
      "行動を後押ししてくれる仲間がいると情報が力に変わりやすい",
    ],
    gives: ["情報", "洞察", "判断材料"],
    receives: ["探究時間", "正確な情報", "信頼されて任される環境"],
    goodWith: ["revolist", "logicalmaister", "arranger"],
    activities: ["リサーチ", "SNS分析", "記事設計", "戦略立案"],
    color: "#059669",
  },
  movmentor: {
    key: "movmentor",
    name: "ムーブメンター",
    catchcopy: "空気を動かし人を前へ進める人",
    description:
      "場を盛り上げ、背中を押し、行動を促す。熱量と応援力で、周囲に勇気と前向きな空気をもたらす存在。",
    strengths: ["熱量", "応援力", "空気づくり", "行動促進"],
    potential: [
      "勢いが強く出ることがある",
      "受け止めて整えてくれる仲間がいると、より大きな流れを作れる",
    ],
    gives: ["勇気", "前向きな空気", "行動のきっかけ"],
    receives: ["一緒に動く仲間", "盛り上がれる場", "挑戦を歓迎する空気"],
    goodWith: ["revolist", "communicator", "soulowner"],
    activities: ["イベント運営", "応援団", "司会", "防災×帽祭の現場づくり"],
    color: "#d97706",
  },
  premiercrafter: {
    key: "premiercrafter",
    name: "プルミエルクラフター",
    catchcopy: "細部に魂を宿す職人",
    description:
      "丁寧で完成度にこだわり、積み重ね型。品質管理と制作力で、信頼できるものを着実に生み出す存在。",
    strengths: ["品質管理", "制作力", "継続力", "技術力"],
    potential: [
      "完璧を求めすぎることがある",
      "背中を押してくれる仲間がいると作品を世に出しやすくなる",
    ],
    gives: ["品質", "丁寧さ", "信頼"],
    receives: ["じっくり作れる時間", "技術を認めてもらえる場", "作品を届けてくれる仲間"],
    goodWith: ["revolist", "arranger", "logicalmaister"],
    activities: ["制作", "編集", "品質管理", "レボハット", "レボアート"],
    color: "#92400e",
  },
  logicalmaister: {
    key: "logicalmaister",
    name: "ロジカルマイスター",
    catchcopy: "無茶を現実に変える設計者",
    description:
      "構造で考え、再現性を重視し、整理整頓が得意。設計力と仕組み化で、夢を現実へと変換する存在。",
    strengths: ["設計力", "分析力", "仕組み化", "計画性"],
    potential: [
      "慎重になりすぎることがある",
      "熱量を持つ仲間と組むと、設計が現実へ進みやすくなる",
    ],
    gives: ["構造", "安定", "実現性"],
    receives: ["整理された相談", "信頼して任される役割", "落ち着いて考えられる環境"],
    goodWith: ["revolist", "crazist", "maxdesigner"],
    activities: ["サイト設計", "企画書作成", "仕組み化", "運営設計", "レボリンク"],
    color: "#1d4ed8",
  },
  arranger: {
    key: "arranger",
    name: "アレンジャー",
    catchcopy: "人と流れを整える調律者",
    description:
      "裏側が得意で全体を見る調整力の高い存在。管理力とサポート力で、チームを安定した流れへ導く。",
    strengths: ["管理力", "調整力", "サポート力", "全体最適"],
    potential: [
      "自分を後回しにしやすい",
      "感謝や役割の見える化があると、さらに力を発揮しやすい",
    ],
    gives: ["安定", "流れ", "安心できる進行"],
    receives: ["感謝", "相談しやすい仲間", "整った環境"],
    goodWith: ["revolist", "communicator", "logicalmaister"],
    activities: ["事務局", "進行管理", "調整役", "プロジェクト運営"],
    color: "#4f46e5",
  },
  soulowner: {
    key: "soulowner",
    name: "ソウルオーナー",
    catchcopy: "人の心に灯りをともす人",
    description:
      "寄り添い型で感情理解が深く、安心感を与える。共感力と受容力で、人の心に居場所をつくる存在。",
    strengths: ["共感力", "受容力", "癒し", "安心感"],
    potential: [
      "感情を抱え込みやすいことがある",
      "自分も安心を受け取れる場があると、さらに深く人を支えられる",
    ],
    gives: ["安心", "優しさ", "居場所"],
    receives: ["静かな時間", "否定されない関係性", "心を休められる場"],
    goodWith: ["communicator", "imagemaister", "movmentor"],
    activities: ["相談役", "ケア", "コミュニティ支援", "レボリンク", "レボソング"],
    color: "#7c3aed",
  },
  crazist: {
    key: "crazist",
    name: "クレイジスト",
    catchcopy: "常識の外から未来を持ってくる人",
    description:
      "常識に縛られず発想が飛び、未知を恐れない。独創性と革命性で、誰も見たことない未来を持ち込む存在。",
    strengths: ["独創性", "突破発想", "挑戦力", "革命性"],
    potential: [
      "理解されるまでに時間がかかることがある",
      "形に整えてくれる仲間がいると、唯一無二の価値になりやすい",
    ],
    gives: ["驚き", "新しい発想", "未来の違和感"],
    receives: ["否定されない余白", "自由な実験場", "面白がってくれる仲間"],
    goodWith: ["logicalmaister", "revolist", "maxdesigner"],
    activities: ["新規企画", "実験企画", "アート", "レボアート", "レボファンディング"],
    color: "#be185d",
  },
};

export const revoTypeList = Object.values(revoTypes);
