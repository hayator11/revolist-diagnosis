import type { OnokunSatooyaTypeKey } from "../../onokun-satooya-11-v1/_data/onokunSatooyaTypes";

export type OnokunSatooyaMatchChapterKey = "self" | "connect" | "partner";
export type OnokunSatooyaMatchAnswerValue = 1 | 2 | 3 | 4 | 5;

export interface OnokunSatooyaMatchEvidence {
  type: OnokunSatooyaTypeKey;
  weight: number;
}

export interface OnokunSatooyaMatchChoice {
  value: OnokunSatooyaMatchAnswerValue;
  label: string;
  selfEvidence?: OnokunSatooyaMatchEvidence[];
  partnerEvidence?: OnokunSatooyaMatchEvidence[];
}

export interface OnokunSatooyaMatchQuestion {
  id: string;
  chapter: OnokunSatooyaMatchChapterKey;
  chapterTitle: string;
  scene: string;
  text: string;
  choices: OnokunSatooyaMatchChoice[];
}

export const onokunSatooyaMatchQuestions: OnokunSatooyaMatchQuestion[] = [
  {
    id: "m01",
    chapter: "self",
    chapterTitle: "第1章 自分のおの活",
    scene: "投稿したくなる瞬間",
    text: "うちの子の写真を投稿したくなるのは、どんな時？",
    choices: [
      { value: 1, label: "ちょっと変で笑える瞬間", selfEvidence: [{ type: "mendokushe-breakthrough", weight: 3 }] },
      { value: 2, label: "おでかけや里帰りの気分が高まった時", selfEvidence: [{ type: "tadaima-starter", weight: 2 }, { type: "outing-arranger", weight: 1 }] },
      { value: 3, label: "背景や飾り方がいい感じに決まった時", selfEvidence: [{ type: "uchinoko-world", weight: 3 }] },
      { value: 4, label: "誰かと話すきっかけにしたい時", selfEvidence: [{ type: "goen-talk", weight: 3 }] },
      { value: 5, label: "ただ、今日もかわいいなと思った時", selfEvidence: [{ type: "warm-watch", weight: 3 }] },
    ],
  },
  {
    id: "m02",
    chapter: "self",
    chapterTitle: "第1章 自分のおの活",
    scene: "親バカスイッチ",
    text: "うちの子を見ていると、つい出てくる動きは？",
    choices: [
      { value: 1, label: "新しい遊び方を思いつく", selfEvidence: [{ type: "wakuwaku-future", weight: 2 }, { type: "mendokushe-breakthrough", weight: 1 }] },
      { value: 2, label: "どこかへ連れて行きたくなる", selfEvidence: [{ type: "tadaima-starter", weight: 2 }, { type: "outing-arranger", weight: 1 }] },
      { value: 3, label: "似合う場所や小物を探す", selfEvidence: [{ type: "uchinoko-world", weight: 2 }, { type: "chikuchiku-care", weight: 1 }] },
      { value: 4, label: "この良さを言葉にしたくなる", selfEvidence: [{ type: "word-tuner", weight: 3 }] },
      { value: 5, label: "そばに置いて見守りたくなる", selfEvidence: [{ type: "warm-watch", weight: 2 }, { type: "chikuchiku-care", weight: 1 }] },
    ],
  },
  {
    id: "m03",
    chapter: "self",
    chapterTitle: "第1章 自分のおの活",
    scene: "うちの子の見せ方",
    text: "うちの子の魅力を出すなら、どの方向が近い？",
    choices: [
      { value: 1, label: "くすっと笑える意外性", selfEvidence: [{ type: "mendokushe-breakthrough", weight: 3 }] },
      { value: 2, label: "一緒に行きたくなる物語", selfEvidence: [{ type: "tadaima-starter", weight: 2 }, { type: "town-finder", weight: 1 }] },
      { value: 3, label: "写真としてのかわいさ", selfEvidence: [{ type: "uchinoko-world", weight: 3 }] },
      { value: 4, label: "手づくりのぬくもり", selfEvidence: [{ type: "chikuchiku-care", weight: 3 }] },
      { value: 5, label: "紹介しやすい一言", selfEvidence: [{ type: "word-tuner", weight: 2 }, { type: "goen-talk", weight: 1 }] },
    ],
  },
  {
    id: "m04",
    chapter: "self",
    chapterTitle: "第1章 自分のおの活",
    scene: "里帰り妄想",
    text: "里帰りやおでかけを考える時、楽しいのは？",
    choices: [
      { value: 1, label: "まず行きたい気持ちで盛り上がる", selfEvidence: [{ type: "tadaima-starter", weight: 3 }] },
      { value: 2, label: "行き先や背景を調べる", selfEvidence: [{ type: "town-finder", weight: 3 }] },
      { value: 3, label: "一緒に行く人を思い浮かべる", selfEvidence: [{ type: "goen-talk", weight: 2 }, { type: "back-pat", weight: 1 }] },
      { value: 4, label: "時間や持ち物を整える", selfEvidence: [{ type: "outing-arranger", weight: 3 }] },
      { value: 5, label: "無理なく行ける日を待つ", selfEvidence: [{ type: "warm-watch", weight: 2 }, { type: "back-pat", weight: 1 }] },
    ],
  },
  {
    id: "m05",
    chapter: "self",
    chapterTitle: "第1章 自分のおの活",
    scene: "好きの残し方",
    text: "うちの子への好きは、どう残したくなる？",
    choices: [
      { value: 1, label: "写真で残す", selfEvidence: [{ type: "uchinoko-world", weight: 3 }] },
      { value: 2, label: "短い言葉で残す", selfEvidence: [{ type: "word-tuner", weight: 3 }] },
      { value: 3, label: "誰かとの会話で残す", selfEvidence: [{ type: "goen-talk", weight: 3 }] },
      { value: 4, label: "ものや居場所を整えて残す", selfEvidence: [{ type: "chikuchiku-care", weight: 3 }] },
      { value: 5, label: "次にやりたいこととして残す", selfEvidence: [{ type: "wakuwaku-future", weight: 3 }] },
    ],
  },
  {
    id: "m06",
    chapter: "self",
    chapterTitle: "第1章 自分のおの活",
    scene: "つい見てしまう投稿",
    text: "親バカサロンで、つい見てしまいそうな投稿は？",
    choices: [
      { value: 1, label: "変わったおの活の投稿", selfEvidence: [{ type: "mendokushe-breakthrough", weight: 2 }, { type: "wakuwaku-future", weight: 1 }] },
      { value: 2, label: "里帰りや東松島の投稿", selfEvidence: [{ type: "town-finder", weight: 2 }, { type: "tadaima-starter", weight: 1 }] },
      { value: 3, label: "写真がかわいい投稿", selfEvidence: [{ type: "uchinoko-world", weight: 2 }, { type: "goen-talk", weight: 1 }] },
      { value: 4, label: "丁寧に大切にしている投稿", selfEvidence: [{ type: "chikuchiku-care", weight: 2 }, { type: "warm-watch", weight: 1 }] },
      { value: 5, label: "誰かを誘っている投稿", selfEvidence: [{ type: "back-pat", weight: 2 }, { type: "outing-arranger", weight: 1 }] },
    ],
  },
  {
    id: "m07",
    chapter: "connect",
    chapterTitle: "第2章 人とのつながり方",
    scene: "コメントするとしたら",
    text: "気になる投稿にコメントするなら、どんな一言が近い？",
    choices: [
      { value: 1, label: "それ最高、ちょっと笑った", selfEvidence: [{ type: "mendokushe-breakthrough", weight: 2 }, { type: "goen-talk", weight: 1 }] },
      { value: 2, label: "そこ行ってみたいです", selfEvidence: [{ type: "tadaima-starter", weight: 2 }, { type: "town-finder", weight: 1 }] },
      { value: 3, label: "写真の雰囲気がすごく好き", selfEvidence: [{ type: "uchinoko-world", weight: 2 }, { type: "word-tuner", weight: 1 }] },
      { value: 4, label: "やさしい気持ちになります", selfEvidence: [{ type: "warm-watch", weight: 2 }, { type: "chikuchiku-care", weight: 1 }] },
      { value: 5, label: "初めてでも参加できそう", selfEvidence: [{ type: "back-pat", weight: 2 }, { type: "outing-arranger", weight: 1 }] },
    ],
  },
  {
    id: "m08",
    chapter: "connect",
    chapterTitle: "第2章 人とのつながり方",
    scene: "初対面の里親さん",
    text: "初対面の里親さんと話すなら、入口にしたいのは？",
    choices: [
      { value: 1, label: "うちの子の名前や性格", selfEvidence: [{ type: "goen-talk", weight: 3 }] },
      { value: 2, label: "迎えたきっかけ", selfEvidence: [{ type: "warm-watch", weight: 2 }, { type: "word-tuner", weight: 1 }] },
      { value: 3, label: "写真の撮り方", selfEvidence: [{ type: "uchinoko-world", weight: 3 }] },
      { value: 4, label: "行ってみたい場所", selfEvidence: [{ type: "tadaima-starter", weight: 2 }, { type: "town-finder", weight: 1 }] },
      { value: 5, label: "次に一緒にできそうなこと", selfEvidence: [{ type: "wakuwaku-future", weight: 2 }, { type: "back-pat", weight: 1 }] },
    ],
  },
  {
    id: "m09",
    chapter: "connect",
    chapterTitle: "第2章 人とのつながり方",
    scene: "集まりに混ざるなら",
    text: "小さな集まりで、自分が自然にできそうなのは？",
    choices: [
      { value: 1, label: "場をちょっと楽しくする", selfEvidence: [{ type: "mendokushe-breakthrough", weight: 2 }, { type: "goen-talk", weight: 1 }] },
      { value: 2, label: "行きたい気持ちに火をつける", selfEvidence: [{ type: "tadaima-starter", weight: 3 }] },
      { value: 3, label: "情報や背景を共有する", selfEvidence: [{ type: "town-finder", weight: 2 }, { type: "word-tuner", weight: 1 }] },
      { value: 4, label: "迷っている人をそっと誘う", selfEvidence: [{ type: "back-pat", weight: 3 }] },
      { value: 5, label: "当日の流れを整える", selfEvidence: [{ type: "outing-arranger", weight: 3 }] },
    ],
  },
  {
    id: "m10",
    chapter: "connect",
    chapterTitle: "第2章 人とのつながり方",
    scene: "投稿が広がる時",
    text: "自分の投稿が広がるなら、どんな広がり方がうれしい？",
    choices: [
      { value: 1, label: "真似してくれる人が出る", selfEvidence: [{ type: "wakuwaku-future", weight: 2 }, { type: "mendokushe-breakthrough", weight: 1 }] },
      { value: 2, label: "一緒に行きたい人が出る", selfEvidence: [{ type: "tadaima-starter", weight: 2 }, { type: "outing-arranger", weight: 1 }] },
      { value: 3, label: "コメント欄があたたまる", selfEvidence: [{ type: "goen-talk", weight: 3 }] },
      { value: 4, label: "おのくんの背景に興味を持つ人が出る", selfEvidence: [{ type: "town-finder", weight: 2 }, { type: "word-tuner", weight: 1 }] },
      { value: 5, label: "誰かが安心して投稿できる", selfEvidence: [{ type: "warm-watch", weight: 2 }, { type: "back-pat", weight: 1 }] },
    ],
  },
  {
    id: "m11",
    chapter: "connect",
    chapterTitle: "第2章 人とのつながり方",
    scene: "誘い方",
    text: "誰かを誘うなら、どんな誘い方が自分らしい？",
    choices: [
      { value: 1, label: "面白そうだからやってみよう", selfEvidence: [{ type: "mendokushe-breakthrough", weight: 2 }, { type: "wakuwaku-future", weight: 1 }] },
      { value: 2, label: "一緒に行けたら楽しそう", selfEvidence: [{ type: "tadaima-starter", weight: 2 }, { type: "goen-talk", weight: 1 }] },
      { value: 3, label: "これ、好きそうだと思って", selfEvidence: [{ type: "goen-talk", weight: 2 }, { type: "word-tuner", weight: 1 }] },
      { value: 4, label: "無理なくできる範囲でどう？", selfEvidence: [{ type: "back-pat", weight: 2 }, { type: "warm-watch", weight: 1 }] },
      { value: 5, label: "この日なら動きやすそう", selfEvidence: [{ type: "outing-arranger", weight: 3 }] },
    ],
  },
  {
    id: "m12",
    chapter: "connect",
    chapterTitle: "第2章 人とのつながり方",
    scene: "続く関係",
    text: "里親さん同士の関係で、大事にしたいのは？",
    choices: [
      { value: 1, label: "気軽に笑えること", selfEvidence: [{ type: "mendokushe-breakthrough", weight: 2 }, { type: "goen-talk", weight: 1 }] },
      { value: 2, label: "また会いたくなること", selfEvidence: [{ type: "tadaima-starter", weight: 2 }, { type: "warm-watch", weight: 1 }] },
      { value: 3, label: "情報や想いが残ること", selfEvidence: [{ type: "town-finder", weight: 2 }, { type: "word-tuner", weight: 1 }] },
      { value: 4, label: "誰かの一歩につながること", selfEvidence: [{ type: "back-pat", weight: 2 }, { type: "wakuwaku-future", weight: 1 }] },
      { value: 5, label: "安心して戻ってこられること", selfEvidence: [{ type: "warm-watch", weight: 3 }] },
    ],
  },
  {
    id: "m13",
    chapter: "partner",
    chapterTitle: "第3章 相棒に求めるもの",
    scene: "一緒に投稿するなら",
    text: "相棒里親さんがいるなら、どんな人だとうれしい？",
    choices: [
      { value: 1, label: "自分にない面白い発想を出す人", partnerEvidence: [{ type: "mendokushe-breakthrough", weight: 3 }] },
      { value: 2, label: "一緒に行こうと火をつける人", partnerEvidence: [{ type: "tadaima-starter", weight: 3 }] },
      { value: 3, label: "写真や見せ方を楽しくする人", partnerEvidence: [{ type: "uchinoko-world", weight: 3 }] },
      { value: 4, label: "会話を広げてくれる人", partnerEvidence: [{ type: "goen-talk", weight: 3 }] },
      { value: 5, label: "安心して一緒にいられる人", partnerEvidence: [{ type: "warm-watch", weight: 3 }] },
    ],
  },
  {
    id: "m14",
    chapter: "partner",
    chapterTitle: "第3章 相棒に求めるもの",
    scene: "弱いところを補うなら",
    text: "自分だけだと止まりやすい時、相棒にいてほしい力は？",
    choices: [
      { value: 1, label: "新しい案を出してくれる力", partnerEvidence: [{ type: "wakuwaku-future", weight: 3 }] },
      { value: 2, label: "情報を見つけてくれる力", partnerEvidence: [{ type: "town-finder", weight: 3 }] },
      { value: 3, label: "言葉を整えてくれる力", partnerEvidence: [{ type: "word-tuner", weight: 3 }] },
      { value: 4, label: "背中を押してくれる力", partnerEvidence: [{ type: "back-pat", weight: 3 }] },
      { value: 5, label: "段取りを整えてくれる力", partnerEvidence: [{ type: "outing-arranger", weight: 3 }] },
    ],
  },
  {
    id: "m15",
    chapter: "partner",
    chapterTitle: "第3章 相棒に求めるもの",
    scene: "オフ会で隣にいるなら",
    text: "小さな集まりで、隣にいてくれるとうれしいのは？",
    choices: [
      { value: 1, label: "場を明るくしてくれる人", partnerEvidence: [{ type: "goen-talk", weight: 2 }, { type: "mendokushe-breakthrough", weight: 1 }] },
      { value: 2, label: "初参加の人を気にかける人", partnerEvidence: [{ type: "back-pat", weight: 2 }, { type: "warm-watch", weight: 1 }] },
      { value: 3, label: "写真を撮りたくなる空気を作る人", partnerEvidence: [{ type: "uchinoko-world", weight: 3 }] },
      { value: 4, label: "準備や流れを見てくれる人", partnerEvidence: [{ type: "outing-arranger", weight: 3 }] },
      { value: 5, label: "静かに安心感を作ってくれる人", partnerEvidence: [{ type: "warm-watch", weight: 3 }] },
    ],
  },
  {
    id: "m16",
    chapter: "partner",
    chapterTitle: "第3章 相棒に求めるもの",
    scene: "続けるために",
    text: "親バカサロンで長く楽しむなら、どんな相棒が合いそう？",
    choices: [
      { value: 1, label: "一緒に新しい遊びを試す人", partnerEvidence: [{ type: "mendokushe-breakthrough", weight: 2 }, { type: "wakuwaku-future", weight: 1 }] },
      { value: 2, label: "次の楽しみを広げる人", partnerEvidence: [{ type: "wakuwaku-future", weight: 3 }] },
      { value: 3, label: "小さな反応をくれる人", partnerEvidence: [{ type: "goen-talk", weight: 3 }] },
      { value: 4, label: "大切に育てる人", partnerEvidence: [{ type: "chikuchiku-care", weight: 3 }] },
      { value: 5, label: "安心して戻れる空気を作る人", partnerEvidence: [{ type: "warm-watch", weight: 3 }] },
    ],
  },
  {
    id: "m17",
    chapter: "partner",
    chapterTitle: "第3章 相棒に求めるもの",
    scene: "一緒に広げるなら",
    text: "自分の投稿や活動を広げてくれるなら、どんな相棒？",
    choices: [
      { value: 1, label: "人を誘ってくれる人", partnerEvidence: [{ type: "tadaima-starter", weight: 2 }, { type: "goen-talk", weight: 1 }] },
      { value: 2, label: "魅力を見える形にする人", partnerEvidence: [{ type: "uchinoko-world", weight: 2 }, { type: "word-tuner", weight: 1 }] },
      { value: 3, label: "背景や情報を添えてくれる人", partnerEvidence: [{ type: "town-finder", weight: 3 }] },
      { value: 4, label: "参加しやすく整える人", partnerEvidence: [{ type: "outing-arranger", weight: 3 }] },
      { value: 5, label: "ゆっくり続ける空気を作る人", partnerEvidence: [{ type: "warm-watch", weight: 2 }, { type: "chikuchiku-care", weight: 1 }] },
    ],
  },
  {
    id: "m18",
    chapter: "partner",
    chapterTitle: "第3章 相棒に求めるもの",
    scene: "最後の一押し",
    text: "相棒に言われたら、一番うれしい言葉は？",
    choices: [
      { value: 1, label: "それ面白い、やってみよう", partnerEvidence: [{ type: "mendokushe-breakthrough", weight: 2 }, { type: "wakuwaku-future", weight: 1 }] },
      { value: 2, label: "一緒に行こう", partnerEvidence: [{ type: "tadaima-starter", weight: 3 }] },
      { value: 3, label: "その写真、すごくいい", partnerEvidence: [{ type: "uchinoko-world", weight: 3 }] },
      { value: 4, label: "わかりやすく伝わってるよ", partnerEvidence: [{ type: "word-tuner", weight: 2 }, { type: "goen-talk", weight: 1 }] },
      { value: 5, label: "ゆっくりで大丈夫", partnerEvidence: [{ type: "warm-watch", weight: 2 }, { type: "back-pat", weight: 1 }] },
    ],
  },
];

export const ONOKUN_SATOOYA_MATCH_TOTAL_QUESTIONS = onokunSatooyaMatchQuestions.length;
