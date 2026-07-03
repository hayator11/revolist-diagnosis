import type { OnokunSatooyaClusterKey, OnokunSatooyaTypeKey } from "./onokunSatooyaTypes";

export type OnokunSatooyaChapterKey = "start" | "salon" | "quest";
export type OnokunAnswerValue = 1 | 2 | 3 | 4 | 5;

export interface OnokunEvidence {
  type: OnokunSatooyaTypeKey;
  weight: number;
}

export interface OnokunChoice {
  value: OnokunAnswerValue;
  label: string;
}

export interface OnokunSatooyaQuestion {
  id: string;
  chapter: OnokunSatooyaChapterKey;
  chapterTitle: string;
  scene: string;
  text: string;
  primaryType: OnokunSatooyaTypeKey;
  primaryCluster: OnokunSatooyaClusterKey;
  choices: OnokunChoice[];
  evidenceByAnswer: Record<OnokunAnswerValue, OnokunEvidence[]>;
}

function mapEvidence(
  answer1: OnokunEvidence[],
  answer2: OnokunEvidence[],
  answer3: OnokunEvidence[],
  answer4: OnokunEvidence[],
  answer5: OnokunEvidence[],
): Record<OnokunAnswerValue, OnokunEvidence[]> {
  return {
    1: answer1,
    2: answer2,
    3: answer3,
    4: answer4,
    5: answer5,
  };
}

export const onokunSatooyaQuestions: OnokunSatooyaQuestion[] = [
  {
    id: "q01",
    chapter: "start",
    chapterTitle: "第1章 うちの子と出発",
    scene: "今日の一枚",
    text: "うちの子が、ちょこんとこちらを見ています。今日はどんな一枚を撮りたい？",
    primaryType: "uchinoko-world",
    primaryCluster: "create",
    choices: [
      { value: 1, label: "ちょっと笑える、いつもと違う一枚" },
      { value: 2, label: "おでかけ先で、また見返したくなる一枚" },
      { value: 3, label: "うちの子らしさが伝わる一枚" },
      { value: 4, label: "誰かに見せて話したくなる一枚" },
      { value: 5, label: "そばにいるだけでほっとする一枚" },
    ],
    evidenceByAnswer: mapEvidence(
      [
        { type: "mendokushe-breakthrough", weight: 3 },
        { type: "uchinoko-world", weight: 1 },
      ],
      [
        { type: "outing-arranger", weight: 2 },
        { type: "tadaima-starter", weight: 2 },
      ],
      [
        { type: "uchinoko-world", weight: 3 },
        { type: "chikuchiku-care", weight: 1 },
      ],
      [
        { type: "goen-talk", weight: 2 },
        { type: "word-tuner", weight: 2 },
      ],
      [
        { type: "warm-watch", weight: 3 },
        { type: "chikuchiku-care", weight: 1 },
      ],
    ),
  },
  {
    id: "q02",
    chapter: "start",
    chapterTitle: "第1章 うちの子と出発",
    scene: "声をかけられたら",
    text: "うちの子を見た人に「それ、なんですか？」と声をかけられました。あなたなら？",
    primaryType: "goen-talk",
    primaryCluster: "grow",
    choices: [
      { value: 1, label: "「おのくんっていうんです」とまず名前を伝える" },
      { value: 2, label: "うちの子との出会いを少し話す" },
      { value: 3, label: "東松島や里帰りのことを少し伝える" },
      { value: 4, label: "手づくりで一体一体違うことを話す" },
      { value: 5, label: "相手の反応を見ながら、ゆっくり話す" },
    ],
    evidenceByAnswer: mapEvidence(
      [
        { type: "goen-talk", weight: 3 },
        { type: "word-tuner", weight: 1 },
      ],
      [
        { type: "warm-watch", weight: 2 },
        { type: "goen-talk", weight: 2 },
      ],
      [
        { type: "town-finder", weight: 3 },
        { type: "tadaima-starter", weight: 1 },
      ],
      [
        { type: "chikuchiku-care", weight: 3 },
        { type: "uchinoko-world", weight: 1 },
      ],
      [
        { type: "back-pat", weight: 2 },
        { type: "warm-watch", weight: 2 },
      ],
    ),
  },
  {
    id: "q03",
    chapter: "start",
    chapterTitle: "第1章 うちの子と出発",
    scene: "里帰りの地図",
    text: "うちの子といつか里帰りするなら、最初にしたいことは？",
    primaryType: "tadaima-starter",
    primaryCluster: "create",
    choices: [
      { value: 1, label: "行きたい気持ちを誰かに話してみる" },
      { value: 2, label: "場所や行き方を調べておく" },
      { value: 3, label: "一緒に行けそうな人を誘う" },
      { value: 4, label: "当日の流れや持ち物を考える" },
      { value: 5, label: "無理なく行けるタイミングを見守る" },
    ],
    evidenceByAnswer: mapEvidence(
      [
        { type: "goen-talk", weight: 2 },
        { type: "tadaima-starter", weight: 2 },
      ],
      [
        { type: "town-finder", weight: 3 },
        { type: "word-tuner", weight: 1 },
      ],
      [
        { type: "tadaima-starter", weight: 3 },
        { type: "back-pat", weight: 1 },
      ],
      [
        { type: "outing-arranger", weight: 3 },
        { type: "town-finder", weight: 1 },
      ],
      [
        { type: "warm-watch", weight: 3 },
        { type: "back-pat", weight: 1 },
      ],
    ),
  },
  {
    id: "q04",
    chapter: "salon",
    chapterTitle: "第2章 親バカサロンの入口",
    scene: "最初の投稿",
    text: "親バカサロンをのぞいたら、最初に近い動きは？",
    primaryType: "goen-talk",
    primaryCluster: "grow",
    choices: [
      { value: 1, label: "まずはみんなの投稿を見て雰囲気を知る" },
      { value: 2, label: "うちの子の写真をそっと投稿する" },
      { value: 3, label: "気になる投稿にひとこと反応する" },
      { value: 4, label: "行ってみたい場所や情報を聞いてみる" },
      { value: 5, label: "今日の里親ミッションをやってみる" },
    ],
    evidenceByAnswer: mapEvidence(
      [
        { type: "warm-watch", weight: 3 },
        { type: "back-pat", weight: 1 },
      ],
      [
        { type: "uchinoko-world", weight: 3 },
        { type: "chikuchiku-care", weight: 1 },
      ],
      [
        { type: "goen-talk", weight: 3 },
        { type: "back-pat", weight: 1 },
      ],
      [
        { type: "town-finder", weight: 2 },
        { type: "tadaima-starter", weight: 2 },
      ],
      [
        { type: "mendokushe-breakthrough", weight: 2 },
        { type: "wakuwaku-future", weight: 2 },
      ],
    ),
  },
  {
    id: "q05",
    chapter: "salon",
    chapterTitle: "第2章 親バカサロンの入口",
    scene: "うちの子カード",
    text: "ギャラリーにうちの子カードを飾れるなら、どんなテーマが近い？",
    primaryType: "uchinoko-world",
    primaryCluster: "create",
    choices: [
      { value: 1, label: "うちの子自慢の一枚" },
      { value: 2, label: "里帰りしたくなる一枚" },
      { value: 3, label: "ちょっと笑える一枚" },
      { value: 4, label: "ぬくもりを感じる一枚" },
      { value: 5, label: "おでかけの一枚" },
    ],
    evidenceByAnswer: mapEvidence(
      [
        { type: "uchinoko-world", weight: 3 },
        { type: "goen-talk", weight: 1 },
      ],
      [
        { type: "tadaima-starter", weight: 3 },
        { type: "town-finder", weight: 1 },
      ],
      [
        { type: "mendokushe-breakthrough", weight: 3 },
        { type: "wakuwaku-future", weight: 1 },
      ],
      [
        { type: "warm-watch", weight: 3 },
        { type: "chikuchiku-care", weight: 1 },
      ],
      [
        { type: "outing-arranger", weight: 3 },
        { type: "uchinoko-world", weight: 1 },
      ],
    ),
  },
  {
    id: "q06",
    chapter: "salon",
    chapterTitle: "第2章 親バカサロンの入口",
    scene: "ほかの子を見たら",
    text: "ほかの里親さんのうちの子カードを見つけました。思わずしたくなることは？",
    primaryType: "goen-talk",
    primaryCluster: "grow",
    choices: [
      { value: 1, label: "「かわいい！」と声をかける" },
      { value: 2, label: "写真の背景や飾り方を聞く" },
      { value: 3, label: "場所や東松島の話を聞く" },
      { value: 4, label: "自分もやってみたいと真似する" },
      { value: 5, label: "そっと楽しんで、あとでまた見に来る" },
    ],
    evidenceByAnswer: mapEvidence(
      [
        { type: "goen-talk", weight: 3 },
        { type: "back-pat", weight: 1 },
      ],
      [
        { type: "uchinoko-world", weight: 2 },
        { type: "chikuchiku-care", weight: 2 },
      ],
      [
        { type: "town-finder", weight: 3 },
        { type: "tadaima-starter", weight: 1 },
      ],
      [
        { type: "wakuwaku-future", weight: 2 },
        { type: "mendokushe-breakthrough", weight: 2 },
      ],
      [
        { type: "warm-watch", weight: 3 },
        { type: "word-tuner", weight: 1 },
      ],
    ),
  },
  {
    id: "q07",
    chapter: "quest",
    chapterTitle: "第3章 ご縁クエスト",
    scene: "小さな集まり",
    text: "小さな集まりの準備が始まりました。あなたが自然に持っていく力は？",
    primaryType: "outing-arranger",
    primaryCluster: "move",
    choices: [
      { value: 1, label: "面白いアイデアを出す" },
      { value: 2, label: "誘うきっかけを作る" },
      { value: 3, label: "写真や見せ方を整える" },
      { value: 4, label: "案内文や説明をわかりやすくする" },
      { value: 5, label: "当日の段取りや準備を整える" },
    ],
    evidenceByAnswer: mapEvidence(
      [
        { type: "mendokushe-breakthrough", weight: 3 },
        { type: "wakuwaku-future", weight: 1 },
      ],
      [
        { type: "tadaima-starter", weight: 3 },
        { type: "goen-talk", weight: 1 },
      ],
      [
        { type: "uchinoko-world", weight: 3 },
        { type: "chikuchiku-care", weight: 1 },
      ],
      [
        { type: "word-tuner", weight: 3 },
        { type: "town-finder", weight: 1 },
      ],
      [
        { type: "outing-arranger", weight: 3 },
        { type: "back-pat", weight: 1 },
      ],
    ),
  },
  {
    id: "q08",
    chapter: "quest",
    chapterTitle: "第3章 ご縁クエスト",
    scene: "初参加の人",
    text: "初めて来た里親さんが、少し迷っています。うちの子と一緒にどうする？",
    primaryType: "back-pat",
    primaryCluster: "move",
    choices: [
      { value: 1, label: "まず近くで安心できる空気を作る" },
      { value: 2, label: "「大丈夫だよ」とそっと声をかける" },
      { value: 3, label: "わかりやすく流れを教える" },
      { value: 4, label: "一緒に楽しめることを提案する" },
      { value: 5, label: "その人のペースを大事に見守る" },
    ],
    evidenceByAnswer: mapEvidence(
      [
        { type: "warm-watch", weight: 3 },
        { type: "goen-talk", weight: 1 },
      ],
      [
        { type: "back-pat", weight: 3 },
        { type: "warm-watch", weight: 1 },
      ],
      [
        { type: "word-tuner", weight: 2 },
        { type: "outing-arranger", weight: 2 },
      ],
      [
        { type: "wakuwaku-future", weight: 2 },
        { type: "tadaima-starter", weight: 2 },
      ],
      [
        { type: "warm-watch", weight: 2 },
        { type: "chikuchiku-care", weight: 2 },
      ],
    ),
  },
  {
    id: "q09",
    chapter: "quest",
    chapterTitle: "第3章 ご縁クエスト",
    scene: "楽しい備え",
    text: "防災につながる場に、うちの子も参加することに。あなたが関わるなら？",
    primaryType: "tadaima-starter",
    primaryCluster: "create",
    choices: [
      { value: 1, label: "楽しく集まれる企画を考える" },
      { value: 2, label: "はじめての人が入りやすい空気を作る" },
      { value: 3, label: "必要な情報を見つけてまとめる" },
      { value: 4, label: "当日の動きやすさを整える" },
      { value: 5, label: "あたたかい場として見守る" },
    ],
    evidenceByAnswer: mapEvidence(
      [
        { type: "wakuwaku-future", weight: 2 },
        { type: "mendokushe-breakthrough", weight: 2 },
      ],
      [
        { type: "goen-talk", weight: 2 },
        { type: "back-pat", weight: 2 },
      ],
      [
        { type: "town-finder", weight: 3 },
        { type: "word-tuner", weight: 1 },
      ],
      [
        { type: "outing-arranger", weight: 3 },
        { type: "tadaima-starter", weight: 1 },
      ],
      [
        { type: "warm-watch", weight: 3 },
        { type: "chikuchiku-care", weight: 1 },
      ],
    ),
  },
  {
    id: "q10",
    chapter: "quest",
    chapterTitle: "第3章 ご縁クエスト",
    scene: "今日のおの活",
    text: "うちの子が今日の里親ミッションを持ってきました。どれを選ぶ？",
    primaryType: "wakuwaku-future",
    primaryCluster: "create",
    choices: [
      { value: 1, label: "いつもと違う場所で写真を撮る" },
      { value: 2, label: "行きたい場所をひとつメモする" },
      { value: 3, label: "うちの子の好きなところを書く" },
      { value: 4, label: "誰かの投稿にひとこと反応する" },
      { value: 5, label: "身の回りを少し整える" },
    ],
    evidenceByAnswer: mapEvidence(
      [
        { type: "mendokushe-breakthrough", weight: 2 },
        { type: "uchinoko-world", weight: 2 },
      ],
      [
        { type: "tadaima-starter", weight: 2 },
        { type: "outing-arranger", weight: 2 },
      ],
      [
        { type: "word-tuner", weight: 2 },
        { type: "warm-watch", weight: 2 },
      ],
      [
        { type: "goen-talk", weight: 3 },
        { type: "back-pat", weight: 1 },
      ],
      [
        { type: "chikuchiku-care", weight: 3 },
        { type: "warm-watch", weight: 1 },
      ],
    ),
  },
  {
    id: "q11",
    chapter: "quest",
    chapterTitle: "第3章 ご縁クエスト",
    scene: "ご縁の扉",
    text: "今日のクエストの最後に、うちの子と何をして終わりたい？",
    primaryType: "warm-watch",
    primaryCluster: "grow",
    choices: [
      { value: 1, label: "ちょっと変わった一枚を撮る" },
      { value: 2, label: "また行きたい場所をひとつ決める" },
      { value: 3, label: "これからやってみたいことを考える" },
      { value: 4, label: "うちの子の好きなところを誰かに話す" },
      { value: 5, label: "そばに置いて、今日もありがとうと思う" },
    ],
    evidenceByAnswer: mapEvidence(
      [
        { type: "mendokushe-breakthrough", weight: 2 },
        { type: "uchinoko-world", weight: 2 },
      ],
      [
        { type: "tadaima-starter", weight: 2 },
        { type: "outing-arranger", weight: 2 },
      ],
      [
        { type: "wakuwaku-future", weight: 3 },
        { type: "word-tuner", weight: 1 },
      ],
      [
        { type: "goen-talk", weight: 2 },
        { type: "uchinoko-world", weight: 2 },
      ],
      [
        { type: "warm-watch", weight: 3 },
        { type: "chikuchiku-care", weight: 1 },
      ],
    ),
  },
];

export const ONOKUN_SATOOYA_TOTAL_QUESTIONS = onokunSatooyaQuestions.length;
