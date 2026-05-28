import type { RevoTypeKey } from "./revotypes";

export interface Activity {
  id: string;
  name: string;
  description: string;
  suitableTypes: RevoTypeKey[];
  tags: string[];
}

export const activities: Activity[] = [
  {
    id: "bosal-mosai",
    name: "防災×帽祭",
    description:
      "帽子を通じて防災意識を広げる体験型プロジェクト。人が集まり、体験を通して空気が変わる活動です。",
    suitableTypes: ["revolist", "movmentor", "communicator", "arranger"],
    tags: ["体験型", "地域", "防災"],
  },
  {
    id: "revo-hat",
    name: "レボハット",
    description:
      "世界観を持った帽子づくりのプロジェクト。細部へのこだわりと表現力が光る制作活動です。",
    suitableTypes: ["premiercrafter", "imagemaister", "maxdesigner"],
    tags: ["制作", "ものづくり", "表現"],
  },
  {
    id: "revo-art",
    name: "レボアート",
    description:
      "アートを通じて社会にメッセージを届ける活動。感性と独創性で新しい価値を生み出します。",
    suitableTypes: ["imagemaister", "crazist", "maxdesigner", "premiercrafter"],
    tags: ["アート", "表現", "創造"],
  },
  {
    id: "revo-link",
    name: "レボリンク",
    description:
      "人と活動をつなぐコミュニティ支援の役割。調整力とコミュニケーション力で循環をつくります。",
    suitableTypes: ["communicator", "arranger", "soulowner", "logicalmaister"],
    tags: ["コミュニティ", "連携", "サポート"],
  },
  {
    id: "revo-song",
    name: "レボソング",
    description:
      "音楽で人の心を動かすプロジェクト。感情に寄り添いながら、誰かの背中を押す歌を生み出します。",
    suitableTypes: ["soulowner", "imagemaister", "movmentor"],
    tags: ["音楽", "感性", "応援"],
  },
  {
    id: "revo-funding",
    name: "レボファンディング",
    description:
      "挑戦を支援するクラウドファンディング型活動。アイデアを資金と仲間に変える仕組みです。",
    suitableTypes: ["crazist", "revolist", "inforader", "logicalmaister"],
    tags: ["資金調達", "挑戦", "仕組み"],
  },
  {
    id: "onokun",
    name: "おのくん関連活動",
    description:
      "石巻市東日本大震災の被災地から生まれたソックスモンキー「おのくん」との関連活動。地域と人をつなぐ取り組みです。",
    suitableTypes: ["communicator", "soulowner", "arranger", "movmentor"],
    tags: ["地域", "復興", "つながり"],
  },
  {
    id: "revolist-lab",
    name: "レボリストLab運営",
    description:
      "レボリストたちが集まる実験場。新しいアイデアを試し、仲間と一緒に未来をつくる場です。",
    suitableTypes: ["revolist", "logicalmaister", "inforader", "maxdesigner"],
    tags: ["運営", "企画", "実験"],
  },
];
