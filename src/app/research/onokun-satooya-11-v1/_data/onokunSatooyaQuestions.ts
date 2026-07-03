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
    scene: "親バカ一枚目",
    text: "うちの子を親バカサロンに初投稿するとしたら、どんな一枚にしたい？",
    primaryType: "uchinoko-world",
    primaryCluster: "create",
    choices: [
      { value: 1, label: "思わず二度見する、ちょっと笑える一枚" },
      { value: 2, label: "おでかけ先で「ここ来たよ」と伝わる一枚" },
      { value: 3, label: "うちの子らしさが一発で伝わる一枚" },
      { value: 4, label: "見た人がコメントしたくなる一枚" },
      { value: 5, label: "見ているだけでほっとする一枚" },
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
    scene: "それ、だれ？",
    text: "うちの子を見た人に「その子かわいい、だれ？」と聞かれました。最初に言いたいのは？",
    primaryType: "goen-talk",
    primaryCluster: "grow",
    choices: [
      { value: 1, label: "「おのくんっていうんです」と紹介する" },
      { value: 2, label: "迎えたときのエピソードを話したくなる" },
      { value: 3, label: "東松島から来た子なんだよ、と伝える" },
      { value: 4, label: "一体一体違う手づくり感を語りたい" },
      { value: 5, label: "相手が気になっていそうなところから話す" },
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
    scene: "里帰り妄想",
    text: "うちの子と里帰りする日を想像したら、まず何からワクワクする？",
    primaryType: "tadaima-starter",
    primaryCluster: "create",
    choices: [
      { value: 1, label: "「いつか行きたい！」と誰かに言いたくなる" },
      { value: 2, label: "場所や行き方を調べるだけで楽しい" },
      { value: 3, label: "一緒に行く里親さんを探したくなる" },
      { value: 4, label: "旅の予定や持ち物を考えたくなる" },
      { value: 5, label: "行ける日をゆっくり楽しみに待ちたい" },
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
    scene: "サロン初日",
    text: "親バカサロンに入った初日。まずやってみたいことは？",
    primaryType: "goen-talk",
    primaryCluster: "grow",
    choices: [
      { value: 1, label: "まずはみんなの子を眺めてにやにやする" },
      { value: 2, label: "うちの子の写真を一枚だけ投稿してみる" },
      { value: 3, label: "気になる投稿に「かわいい！」と反応する" },
      { value: 4, label: "里帰りやおでかけ情報を聞いてみる" },
      { value: 5, label: "今日のおの活ミッションを試してみる" },
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
    text: "もしサロン内に「うちの子ギャラリー」があったら、どんなカードで飾りたい？",
    primaryType: "uchinoko-world",
    primaryCluster: "create",
    choices: [
      { value: 1, label: "うちの子自慢が伝わるカード" },
      { value: 2, label: "見た人が里帰りしたくなるカード" },
      { value: 3, label: "ちょっと笑えて覚えてもらえるカード" },
      { value: 4, label: "ぬくもりや大切さが伝わるカード" },
      { value: 5, label: "おでかけ記録として見返したいカード" },
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
    scene: "ほかの子発見",
    text: "ギャラリーで、気になるおのくんを見つけました。思わずしたくなるのは？",
    primaryType: "goen-talk",
    primaryCluster: "grow",
    choices: [
      { value: 1, label: "「かわいい！」とコメントしたくなる" },
      { value: 2, label: "背景や飾り方を聞いてみたくなる" },
      { value: 3, label: "どこで撮ったのか知りたくなる" },
      { value: 4, label: "自分も真似して投稿したくなる" },
      { value: 5, label: "そっと保存して、また見に来たくなる" },
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
    scene: "小さなオフ会",
    text: "里親さん同士で小さく集まる話が出ました。あなたが楽しそうと思う関わり方は？",
    primaryType: "outing-arranger",
    primaryCluster: "move",
    choices: [
      { value: 1, label: "面白い持ち寄り企画を思いつく" },
      { value: 2, label: "「行ってみない？」と声をかける" },
      { value: 3, label: "写真を撮りたくなる場所を考える" },
      { value: 4, label: "案内文や投稿文をわかりやすくする" },
      { value: 5, label: "時間や場所を見て動きやすく整える" },
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
    scene: "はじめまして",
    text: "サロンに初参加の里親さんがいます。うちの子と一緒にできそうなのは？",
    primaryType: "back-pat",
    primaryCluster: "move",
    choices: [
      { value: 1, label: "まず安心して見られる空気をつくる" },
      { value: 2, label: "「うちの子も見てね」とやさしく声をかける" },
      { value: 3, label: "どこから参加すると楽しいか伝える" },
      { value: 4, label: "一緒にできる小さなおの活を提案する" },
      { value: 5, label: "その人のペースで楽しめるよう見守る" },
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
    text: "おのくんと一緒に「楽しいから備えになる」企画をするなら、どれが近い？",
    primaryType: "tadaima-starter",
    primaryCluster: "create",
    choices: [
      { value: 1, label: "ゲーム感覚で集まれる企画を考える" },
      { value: 2, label: "はじめての人も混ざりやすくする" },
      { value: 3, label: "役立つ情報を見つけて共有する" },
      { value: 4, label: "当日の流れを動きやすく整える" },
      { value: 5, label: "あたたかく続く場として見守る" },
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
    text: "今日すぐできる「おの活ミッション」を選ぶなら？",
    primaryType: "wakuwaku-future",
    primaryCluster: "create",
    choices: [
      { value: 1, label: "いつもと違う場所で写真を撮ってみる" },
      { value: 2, label: "行ってみたい場所をひとつ投稿してみる" },
      { value: 3, label: "うちの子の好きなところを一言で書く" },
      { value: 4, label: "誰かの投稿にひとことコメントする" },
      { value: 5, label: "うちの子の居場所を少し整える" },
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
    text: "診断が終わったあと、親バカサロンで最初に話すならどれがいい？",
    primaryType: "warm-watch",
    primaryCluster: "grow",
    choices: [
      { value: 1, label: "うちの子のちょっと変わった一面" },
      { value: 2, label: "おのくんと行ってみたい場所" },
      { value: 3, label: "これからやってみたいおの活" },
      { value: 4, label: "うちの子の好きなところ自慢" },
      { value: 5, label: "迎えてよかったなと思う瞬間" },
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
