import type { RevoTypeKey } from "./revotypes";
import type { MonitorDiagnosisKey } from "./monitorQuestions";

// 各診断タイプ × RevoTypeKey のテキスト定義

// ── Revo Role ────────────────────────────────────────────────────────
export const roleResultText: Record<RevoTypeKey, {
  position: string;        // チームでの立ち位置
  revoFunding: string;     // Revo Fundingで活きる役割
}> = {
  revolist:       { position: "動き出しの火種", revoFunding: "プロジェクトを起動させる先導役" },
  maxdesigner:    { position: "可能性を広げる設計者", revoFunding: "企画の可能性を最大化するデザイナー" },
  imagemaister:   { position: "世界観をつくる表現者", revoFunding: "プロジェクトのビジュアルと空気感を担う存在" },
  communicator:   { position: "人をつなぐ橋渡し役", revoFunding: "メンバーと支援者の関係をつなぐ存在" },
  inforader:      { position: "知識を集める探求者", revoFunding: "情報収集と調査で意思決定を支える存在" },
  movmentor:      { position: "仲間を動かす推進者", revoFunding: "チームのモチベーションを高める存在" },
  premiercrafter:  { position: "完成度を磨く職人", revoFunding: "成果物のクオリティを引き上げる存在" },
  logicalmaister: { position: "構造を整える分析者", revoFunding: "プロセスを設計し課題を整理する存在" },
  arranger:       { position: "全体を整える調整役", revoFunding: "メンバーの力を最大化する調整の要" },
  soulowner:      { position: "深みと共感を生む存在", revoFunding: "プロジェクトに魂と共感を加える存在" },
  crazist:        { position: "常識を超えるアイデアマン", revoFunding: "誰も想像しなかった切り口をもたらす存在" },
};

// ── Revo Team ────────────────────────────────────────────────────────
export const teamResultText: Record<RevoTypeKey, {
  teamLabel: string;       // チーム内の役割名
  bestWith: string;        // 周りにいると良い存在（テキスト）
  revoFunding: string;     // Revo Fundingで活きる役割
}> = {
  revolist:       { teamLabel: "先導タイプ",    bestWith: "整理してくれるアレンジャーや、分析してくれるロジカルマイスター", revoFunding: "プロジェクトの起動と意思決定" },
  maxdesigner:    { teamLabel: "発展タイプ",    bestWith: "実現してくれるプレミアクラフターや、整えてくれるアレンジャー", revoFunding: "プロジェクトの価値設計と成長戦略" },
  imagemaister:   { teamLabel: "表現タイプ",    bestWith: "言語化してくれるコミュニケーターや、背中を押してくれるムーブメンター", revoFunding: "ブランドと世界観づくり" },
  communicator:   { teamLabel: "繋ぎタイプ",    bestWith: "深みをもたらすソウルオーナーや、先導してくれるレボリスト", revoFunding: "支援者・メンバーとの関係構築" },
  inforader:      { teamLabel: "調査タイプ",    bestWith: "行動力のあるレボリストや、整理力のあるロジカルマイスター", revoFunding: "市場調査・情報収集・企画立案" },
  movmentor:      { teamLabel: "推進タイプ",    bestWith: "コミュニケーターや、整理してくれるアレンジャー", revoFunding: "チームのモチベーション管理と育成" },
  premiercrafter:  { teamLabel: "実現タイプ",    bestWith: "アイデアを出すマックスデザイナーや、流れを整えるアレンジャー", revoFunding: "成果物の完成度と品質管理" },
  logicalmaister: { teamLabel: "設計タイプ",    bestWith: "行動力のあるレボリストや、場をつくるコミュニケーター", revoFunding: "プロセス設計・課題分析・構造化" },
  arranger:       { teamLabel: "調整タイプ",    bestWith: "先導するレボリストや、創造するクラジストとのペア", revoFunding: "チーム調整・役割分担・全体最適化" },
  soulowner:      { teamLabel: "共感タイプ",    bestWith: "論理のロジカルマイスターや、行動のレボリスト", revoFunding: "チームの心理安全性と共感づくり" },
  crazist:        { teamLabel: "革新タイプ",    bestWith: "整理してくれるロジカルマイスターや、形にするプレミアクラフター", revoFunding: "非常識な発想でプロジェクトに突破口" },
};

// ── Revo Match ───────────────────────────────────────────────────────
export const matchResultText: Record<RevoTypeKey, {
  openedBy: string;        // あなたを開花させる存在（説明）
  youOpen: string;         // あなたが開花させる存在（説明）
  thirdParty: string;      // 第三者の効果
}> = {
  revolist:       { openedBy: "信頼して背中を任せてくれる人", youOpen: "まだ動けていない、でも動きたい人", thirdParty: "整理力のある第三者が加わると、チームが回り始める" },
  maxdesigner:    { openedBy: "可能性を面白がってくれる人", youOpen: "アイデアを形にしたい人", thirdParty: "実行力のある第三者が加わると、構想が現実になる" },
  imagemaister:   { openedBy: "感性を肯定してくれる人", youOpen: "言葉にできない想いを持つ人", thirdParty: "言語化できる第三者が加わると、世界観が広く届く" },
  communicator:   { openedBy: "本音で話せる関係を築ける人", youOpen: "孤立しがちな、でも人とつながりたい人", thirdParty: "深みのある第三者が加わると、関係が長続きする" },
  inforader:      { openedBy: "知識の価値を認めてくれる人", youOpen: "情報を活かしたいが整理できていない人", thirdParty: "行動力のある第三者が加わると、分析が活動につながる" },
  movmentor:      { openedBy: "一緒に誰かの役に立ちたいと思える人", youOpen: "前に進みたいが踏み出せていない人", thirdParty: "構造を作る第三者が加わると、支援が継続的になる" },
  premiercrafter:  { openedBy: "仕上げの丁寧さを尊重してくれる人", youOpen: "完成に向けて一緒に歩める人", thirdParty: "発想力のある第三者が加わると、完成の方向が広がる" },
  logicalmaister: { openedBy: "論理を活かしてくれる人", youOpen: "想いはあるが整理できていない人", thirdParty: "行動力のある第三者が加わると、設計が動き始める" },
  arranger:       { openedBy: "安心して任せてくれる人", youOpen: "バラバラになりがちなチーム", thirdParty: "ビジョンを語れる第三者が加わると、方向性が揃う" },
  soulowner:      { openedBy: "心の深さを大切にしてくれる人", youOpen: "本音を話せる場を求めている人", thirdParty: "行動力のある第三者が加わると、想いが活動になる" },
  crazist:        { openedBy: "自由に挑戦させてくれる人", youOpen: "刺激と変化を求めている人", thirdParty: "整理力のある第三者が加わると、クレイジーな発想が実現する" },
};

// ── Revo Growth ──────────────────────────────────────────────────────
export const growthResultText: Record<RevoTypeKey, {
  growthLabel: string;     // 次に育つ可能性の役割名
  sleepingDesc: string;    // 眠っている力の説明
  quest: string;           // 成長クエスト
  activities: string[];    // 向いている活動
  future: string;          // 未来の可能性
}> = {
  revolist: {
    growthLabel: "先導者としての力",
    sleepingDesc: "まだ使っていない「火を灯す力」が、あなたの中に眠っています。",
    quest: "今まで迷っていた挑戦を、ひとつ実際に動かしてみる",
    activities: ["プロジェクト起動", "挑戦系イベント参加", "リーダー経験"],
    future: "あなたが動き出すとき、周囲も動き出す。その連鎖がRevoの原動力になります。",
  },
  maxdesigner: {
    growthLabel: "発展設計者としての力",
    sleepingDesc: "あなたの中には「可能性をさらに広げる設計力」がまだ眠っています。",
    quest: "誰かのアイデアを、具体的な形に変えるサポートを一度やってみる",
    activities: ["企画開発", "価値設計", "アイデアソン参加"],
    future: "あなたが広げた可能性の地図が、チームの未来を変えていきます。",
  },
  imagemaister: {
    growthLabel: "表現者としての力",
    sleepingDesc: "言葉にならない感覚を「形にする力」が、あなたの中で育とうとしています。",
    quest: "感じていることを何かひとつの形（文章・絵・写真など）にしてみる",
    activities: ["ビジュアル表現", "世界観設計", "ブランディング"],
    future: "あなたの表現が、伝わらなかった想いを届ける橋になっていきます。",
  },
  communicator: {
    growthLabel: "繋ぎ役としての力",
    sleepingDesc: "あなたの中には「人と人の化学反応を生む力」がまだ眠っています。",
    quest: "普段会わないタイプの人と、意図的に話す機会をひとつ作ってみる",
    activities: ["コミュニティ活動", "交流会", "人と人のマッチング"],
    future: "あなたがつないだ縁が、誰かの人生を動かしていきます。",
  },
  inforader: {
    growthLabel: "探求者としての力",
    sleepingDesc: "あなたが集めた情報が「チームの知的基盤」になる力が眠っています。",
    quest: "気になっているテーマを深掘りして、誰かに共有してみる",
    activities: ["リサーチ", "情報整理", "調査レポート作成"],
    future: "あなたの探求が、チームの判断を確かなものにしていきます。",
  },
  movmentor: {
    growthLabel: "推進者としての力",
    sleepingDesc: "「誰かの挑戦に火を灯す力」が、あなたの中で育とうとしています。",
    quest: "まわりの誰かに「応援しているよ」と具体的な言葉で伝えてみる",
    activities: ["メンタリング", "コーチング", "応援団活動"],
    future: "あなたの応援を受けた人が、次の挑戦者になっていきます。",
  },
  premiercrafter: {
    growthLabel: "実現者としての力",
    sleepingDesc: "「仕上げる力」と「完成させる力」が、あなたの中に眠っています。",
    quest: "途中で止まっているものを、ひとつ完成させてみる",
    activities: ["制作活動", "品質管理", "プロジェクト完遂"],
    future: "あなたが「仕上げた」ものが、チームの信頼を積み重ねていきます。",
  },
  logicalmaister: {
    growthLabel: "構造設計者としての力",
    sleepingDesc: "「複雑なものを整理して、誰でも動ける地図にする力」が眠っています。",
    quest: "頭の中のモヤモヤを、図や箇条書きで整理してみる",
    activities: ["設計・構造化", "問題分析", "ロードマップ作成"],
    future: "あなたが整理した道筋が、チーム全員の行動を加速させます。",
  },
  arranger: {
    growthLabel: "調整者としての力",
    sleepingDesc: "「みんなが動きやすくなる環境を作る力」が、あなたの中で育とうとしています。",
    quest: "チームの中で気になっていた「役割のズレ」をひとつ調整してみる",
    activities: ["進行管理", "チーム調整", "ファシリテーション"],
    future: "あなたが整えた場が、チームの可能性を引き出し続けます。",
  },
  soulowner: {
    growthLabel: "共感の核としての力",
    sleepingDesc: "「場に深みと安心をもたらす力」が、あなたの中にまだ眠っています。",
    quest: "誰かの気持ちに、もう一歩だけ近づいて話してみる",
    activities: ["ケア活動", "対話の場づくり", "心理的安全性の醸成"],
    future: "あなたがいることで、チームが本音で動ける場所になっていきます。",
  },
  crazist: {
    growthLabel: "革新者としての力",
    sleepingDesc: "「誰も考えなかった突破口を開く力」が、あなたの中で眠っています。",
    quest: "「こんなの無理かも」と思っていたアイデアを、声に出してみる",
    activities: ["ハッカソン参加", "実験的な企画", "ゼロイチ挑戦"],
    future: "あなたのクレイジーな発想が、チームの常識を書き換えていきます。",
  },
};

// 診断タイプごとのメタ情報
export const monitorDiagnosisMeta: Record<MonitorDiagnosisKey, {
  title: string;
  subtitle: string;
  tagline: string;
  color: string;
  accentColor: string;
  nextKey: MonitorDiagnosisKey | null;
  nextLabel: string;
}> = {
  role: {
    title: "Revo Role",
    subtitle: "今、強く使っている役割を見つける",
    tagline: "役割は、個性ではなく状況で変化する。",
    color: "#111111",
    accentColor: "#dc2626",
    nextKey: "team",
    nextLabel: "次は、どんなチームで輝くかを見てみる",
  },
  team: {
    title: "Revo Team",
    subtitle: "チーム内での立ち位置を見つける",
    tagline: "チームは、違いが集まることで強くなる。",
    color: "#111111",
    accentColor: "#2563eb",
    nextKey: "match",
    nextLabel: "次は、誰と組むと力が出るかを見てみる",
  },
  match: {
    title: "Revo Match",
    subtitle: "可能性を広げる組み合わせを見つける",
    tagline: "出会いは、役割の可能性を育てる。",
    color: "#111111",
    accentColor: "#16a34a",
    nextKey: "growth",
    nextLabel: "次は、これからどう成長するかを見てみる",
  },
  growth: {
    title: "Revo Growth",
    subtitle: "次の成長ルートを見つける",
    tagline: "成長は、まだ使っていない力に宿っている。",
    color: "#111111",
    accentColor: "#9333ea",
    nextKey: null,
    nextLabel: "",
  },
};
