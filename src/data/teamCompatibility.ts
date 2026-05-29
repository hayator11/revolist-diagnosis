/**
 * 11タイプ × 相性 × チーム設計表
 * 全55ペア（11C2）の相性データ
 *
 * Future: チーム診断機能（複数人が診断してチーム設計図を出す）の土台
 * Future: 組織向け機能（部署・プロジェクト設計）の土台
 */

import type { RevoTypeKey } from "./revotypes";

// ◎ best  = 力が最大化される最高の組み合わせ
// ○ good  = 自然に補い合えるペア
// △ bridge = 違いが大きいが、橋渡しで大きな価値が生まれる
export type CompatibilityTier = "best" | "good" | "bridge";

export interface PairCompatibility {
  tier: CompatibilityTier;
  dynamic: string;       // "先導×整理" など短い役割表現
  fromNote: string;      // typeA → typeB の関係性
  toNote: string;        // typeB → typeA の関係性
  teamNote: string;      // 2人合わせた総評
  thirdPerson: RevoTypeKey; // 3人目に足すといいタイプ
}

// キー形式: "typeA-typeB"（アルファベット昇順でソート済み）
const pairs: Record<string, PairCompatibility> = {

  // ── revolist ────────────────────────────────────────────────────────
  "maxdesigner-revolist": {
    tier: "good",
    dynamic: "先導×発展",
    fromNote: "レボリストの熱量が、マックスデザイナーの可能性をさらに広げる",
    toNote: "マックスデザイナーの発想が、レボリストの方向性を面白くする",
    teamNote: "行動力と創造力が合わさり、挑戦の幅が広がるペア",
    thirdPerson: "logicalmaister",
  },
  "imagemaister-revolist": {
    tier: "good",
    dynamic: "先導×表現",
    fromNote: "レボリストの熱量が、イメージマイスターの表現に力を与える",
    toNote: "イメージマイスターの世界観が、レボリストの言葉に深みを加える",
    teamNote: "「動く力」と「見せる力」が合わさり、伝わる行動を生む",
    thirdPerson: "communicator",
  },
  "communicator-revolist": {
    tier: "good",
    dynamic: "先導×繋ぎ",
    fromNote: "レボリストの動きを、コミュニケーターが周囲へ丁寧に届ける",
    toNote: "コミュニケーターの橋渡しが、レボリストの輪を広げる",
    teamNote: "熱量と対話力が合わさり、自然に巻き込む力が高まるペア",
    thirdPerson: "arranger",
  },
  "inforader-revolist": {
    tier: "good",
    dynamic: "先導×探求",
    fromNote: "インフォレイダーの情報が、レボリストの行動に根拠を与える",
    toNote: "レボリストの行動力が、インフォレイダーの情報を活かしてくれる",
    teamNote: "「動く力」と「知る力」が合わさり、根拠ある前進を生む",
    thirdPerson: "arranger",
  },
  "movmentor-revolist": {
    tier: "best",
    dynamic: "先導×推進",
    fromNote: "ムーブメンターの応援が、レボリストの熱量をさらに増幅させる",
    toNote: "レボリストの挑戦が、ムーブメンターの応援力を最大化する",
    teamNote: "熱量×熱量で前進し続ける、最も力強いスタートダッシュペア",
    thirdPerson: "arranger",
  },
  "premiercrafter-revolist": {
    tier: "good",
    dynamic: "先導×実現",
    fromNote: "プレミアクラフターの完成度が、レボリストの勢いを「信頼されるもの」にする",
    toNote: "レボリストの熱量が、プレミアクラフターの作品を世に届ける力になる",
    teamNote: "「動かす力」と「仕上げる力」が合わさり、信頼される成果を生む",
    thirdPerson: "arranger",
  },
  "logicalmaister-revolist": {
    tier: "best",
    dynamic: "先導×設計",
    fromNote: "ロジカルマイスターの設計が、レボリストの理想を現実の地図に変える",
    toNote: "レボリストの熱量が、ロジカルマイスターの計画を実際に動かす",
    teamNote: "理想を語る力と実現を設計する力が合わさる、最強の起動ペア",
    thirdPerson: "communicator",
  },
  "arranger-revolist": {
    tier: "best",
    dynamic: "先導×整理",
    fromNote: "アレンジャーが整えた流れに乗ることで、レボリストの熱量が最大限に活きる",
    toNote: "レボリストの方向性があることで、アレンジャーの調整力が活かせる",
    teamNote: "「動かす」と「整える」が揃う、チームの始動に最も効果的なペア",
    thirdPerson: "logicalmaister",
  },
  "revolist-soulowner": {
    tier: "good",
    dynamic: "先導×共感",
    fromNote: "ソウルオーナーの深みが、レボリストの熱量を人の心に届くものにする",
    toNote: "レボリストの行動力が、ソウルオーナーの想いを外へ動かしてくれる",
    teamNote: "熱量と共感が合わさり、人が自然についてくる雰囲気が生まれる",
    thirdPerson: "communicator",
  },
  "crazist-revolist": {
    tier: "good",
    dynamic: "先導×突破",
    fromNote: "クレイジストの突破発想が、レボリストの挑戦をさらに飛躍させる",
    toNote: "レボリストの熱量が、クレイジストの発想を実際の行動に変えてくれる",
    teamNote: "「前へ」と「常識の外へ」が合わさり、誰も予想しなかった動きが生まれる",
    thirdPerson: "logicalmaister",
  },

  // ── maxdesigner ─────────────────────────────────────────────────────
  "imagemaister-maxdesigner": {
    tier: "bridge",
    dynamic: "発展×表現",
    fromNote: "イメージマイスターの感性が、マックスデザイナーのアイデアに美しさを加える",
    toNote: "マックスデザイナーの発想が、イメージマイスターの表現を広げる",
    teamNote: "創造力が重なるため方向性の調整が鍵。整理役の第三者がいると動きやすい",
    thirdPerson: "logicalmaister",
  },
  "communicator-maxdesigner": {
    tier: "good",
    dynamic: "発展×繋ぎ",
    fromNote: "コミュニケーターが、マックスデザイナーのアイデアを人に届ける橋渡しをする",
    toNote: "マックスデザイナーの発想が、コミュニケーターの対話に面白さを加える",
    teamNote: "「広げる」と「届ける」が合わさり、アイデアが多くの人へ伝わる",
    thirdPerson: "premiercrafter",
  },
  "inforader-maxdesigner": {
    tier: "good",
    dynamic: "発展×探求",
    fromNote: "インフォレイダーの情報が、マックスデザイナーの発想に根拠を与える",
    toNote: "マックスデザイナーの発想が、インフォレイダーの情報を面白い形で活かす",
    teamNote: "「広げる発想」と「深める情報」が合わさり、説得力ある企画を生む",
    thirdPerson: "logicalmaister",
  },
  "maxdesigner-movmentor": {
    tier: "bridge",
    dynamic: "発展×推進",
    fromNote: "ムーブメンターの熱量が、マックスデザイナーの発想を前へ動かしてくれる",
    toNote: "マックスデザイナーの可能性が、ムーブメンターの応援に方向性を与える",
    teamNote: "創造と推進が組み合わさるが、実現させる役割が別途必要",
    thirdPerson: "premiercrafter",
  },
  "maxdesigner-premiercrafter": {
    tier: "best",
    dynamic: "発展×実現",
    fromNote: "プレミアクラフターが、マックスデザイナーのアイデアを確実に形にする",
    toNote: "マックスデザイナーの発展的な発想が、プレミアクラフターの制作に方向性を与える",
    teamNote: "「広げる」と「形にする」の完璧な補完。アイデアが必ず届く形になる",
    thirdPerson: "communicator",
  },
  "logicalmaister-maxdesigner": {
    tier: "best",
    dynamic: "発展×設計",
    fromNote: "ロジカルマイスターの構造が、マックスデザイナーの発想を実現可能にする",
    toNote: "マックスデザイナーの発展的な視点が、ロジカルマイスターの設計を面白くする",
    teamNote: "「可能性の地図」と「実現の設計図」が合わさる、最強の企画ペア",
    thirdPerson: "revolist",
  },
  "arranger-maxdesigner": {
    tier: "good",
    dynamic: "発展×整理",
    fromNote: "アレンジャーが、マックスデザイナーのアイデアを実行可能な流れに整える",
    toNote: "マックスデザイナーのアイデアが、アレンジャーの調整に方向性を与える",
    teamNote: "「広げる」と「整える」のバランスが取れ、実行が伴う企画になる",
    thirdPerson: "premiercrafter",
  },
  "maxdesigner-soulowner": {
    tier: "bridge",
    dynamic: "発展×共感",
    fromNote: "ソウルオーナーの深みが、マックスデザイナーの発想に人の心への視点を加える",
    toNote: "マックスデザイナーの可能性が、ソウルオーナーの想いを外へ引き出す",
    teamNote: "発想の広さと感情の深さが出会う。橋渡しの第三者がいると化学反応が起きやすい",
    thirdPerson: "communicator",
  },
  "crazist-maxdesigner": {
    tier: "best",
    dynamic: "発展×突破",
    fromNote: "クレイジストの突破発想が、マックスデザイナーの可能性をさらに遠くへ飛ばす",
    toNote: "マックスデザイナーの発展力が、クレイジストの突破発想を形にする助けになる",
    teamNote: "「広げる」と「壊す」が合わさり、誰も見たことない可能性が生まれる",
    thirdPerson: "logicalmaister",
  },

  // ── imagemaister ────────────────────────────────────────────────────
  "communicator-imagemaister": {
    tier: "best",
    dynamic: "表現×繋ぎ",
    fromNote: "コミュニケーターが、イメージマイスターの世界観を人に丁寧に届ける",
    toNote: "イメージマイスターの感性が、コミュニケーターの言葉に深みと美しさを加える",
    teamNote: "「感性」と「言語化」が揃い、伝わらなかった想いが多くの人へ届く",
    thirdPerson: "revolist",
  },
  "imagemaister-inforader": {
    tier: "bridge",
    dynamic: "表現×探求",
    fromNote: "インフォレイダーの情報が、イメージマイスターの表現に根拠を与える",
    toNote: "イメージマイスターの感性が、インフォレイダーの情報を美しい形で見せる",
    teamNote: "感性と論理が出会うペア。共通の方向性が見つかると独自の表現が生まれる",
    thirdPerson: "communicator",
  },
  "imagemaister-movmentor": {
    tier: "bridge",
    dynamic: "表現×推進",
    fromNote: "ムーブメンターの熱量が、イメージマイスターの表現を人の前へ押し出す",
    toNote: "イメージマイスターの世界観が、ムーブメンターの応援に感動を加える",
    teamNote: "表現と推進が出会うペア。伝える役割の第三者がいるとさらに届く",
    thirdPerson: "communicator",
  },
  "imagemaister-premiercrafter": {
    tier: "good",
    dynamic: "表現×実現",
    fromNote: "プレミアクラフターの制作力が、イメージマイスターの世界観を確実な形にする",
    toNote: "イメージマイスターの感性が、プレミアクラフターの制作に美しさの方向性を与える",
    teamNote: "「感じる」と「作る」が合わさり、完成度の高い表現が生まれる",
    thirdPerson: "communicator",
  },
  "imagemaister-logicalmaister": {
    tier: "bridge",
    dynamic: "表現×設計",
    fromNote: "ロジカルマイスターの構造が、イメージマイスターの感性を届けやすい形にする",
    toNote: "イメージマイスターの感性が、ロジカルマイスターの設計を人の心に触れるものにする",
    teamNote: "感性と論理の異なる言語を持つペア。翻訳役の第三者がいると力が発揮される",
    thirdPerson: "communicator",
  },
  "arranger-imagemaister": {
    tier: "good",
    dynamic: "表現×整理",
    fromNote: "アレンジャーが、イメージマイスターが表現に集中できる環境を整えてくれる",
    toNote: "イメージマイスターの世界観が、アレンジャーの調整に美しさの目標を与える",
    teamNote: "「表現する」と「整える」が揃い、美しく機能する場が生まれる",
    thirdPerson: "communicator",
  },
  "imagemaister-soulowner": {
    tier: "best",
    dynamic: "表現×共感",
    fromNote: "ソウルオーナーの共感が、イメージマイスターの世界観をさらに深く受け止める",
    toNote: "イメージマイスターの美しさが、ソウルオーナーの場に感動をもたらす",
    teamNote: "感性と共感が出会い、人の心の奥まで届く表現が生まれる",
    thirdPerson: "communicator",
  },
  "crazist-imagemaister": {
    tier: "bridge",
    dynamic: "表現×突破",
    fromNote: "クレイジストの突破発想が、イメージマイスターの表現に予想外の方向性を与える",
    toNote: "イメージマイスターの感性が、クレイジストの発想を美しく可視化する",
    teamNote: "感性と革新が出会うペア。方向性が共有できると唯一無二の表現が生まれる",
    thirdPerson: "communicator",
  },

  // ── communicator ────────────────────────────────────────────────────
  "communicator-inforader": {
    tier: "bridge",
    dynamic: "繋ぎ×探求",
    fromNote: "インフォレイダーの情報が、コミュニケーターの対話に深みを与える",
    toNote: "コミュニケーターの対話力が、インフォレイダーの情報を人に届ける助けになる",
    teamNote: "情報と対話が出会うペア。行動力の第三者がいると情報が活きてくる",
    thirdPerson: "revolist",
  },
  "communicator-movmentor": {
    tier: "good",
    dynamic: "繋ぎ×推進",
    fromNote: "ムーブメンターの熱量が、コミュニケーターのつながりを行動へ変える",
    toNote: "コミュニケーターの橋渡しが、ムーブメンターの応援を届ける幅を広げる",
    teamNote: "「つなぐ」と「動かす」が合わさり、チームが自然に前へ進む",
    thirdPerson: "arranger",
  },
  "communicator-premiercrafter": {
    tier: "bridge",
    dynamic: "繋ぎ×実現",
    fromNote: "プレミアクラフターの丁寧さが、コミュニケーターの関係性に信頼を加える",
    toNote: "コミュニケーターの橋渡しが、プレミアクラフターの作品を届ける場をつくる",
    teamNote: "対話と制作が出会うペア。役割の明確化が大切",
    thirdPerson: "arranger",
  },
  "communicator-logicalmaister": {
    tier: "bridge",
    dynamic: "繋ぎ×設計",
    fromNote: "ロジカルマイスターの設計が、コミュニケーターの対話に論理の骨格を与える",
    toNote: "コミュニケーターの対話力が、ロジカルマイスターの設計を人に伝える",
    teamNote: "論理と感情の翻訳が鍵。互いの強みが分担できれば大きな力になる",
    thirdPerson: "revolist",
  },
  "arranger-communicator": {
    tier: "good",
    dynamic: "繋ぎ×整理",
    fromNote: "アレンジャーの整理力が、コミュニケーターのつながりを機能させる",
    toNote: "コミュニケーターの橋渡しが、アレンジャーの調整をスムーズにする",
    teamNote: "「つなぐ」と「整える」が揃い、動きやすいチームの基盤が生まれる",
    thirdPerson: "revolist",
  },
  "communicator-soulowner": {
    tier: "best",
    dynamic: "繋ぎ×共感",
    fromNote: "ソウルオーナーの深みが、コミュニケーターのつながりに本音の場を作る",
    toNote: "コミュニケーターの橋渡しが、ソウルオーナーの共感を広い場所へ届ける",
    teamNote: "「広げる」と「深める」が合わさり、誰もが本音で動けるチームが生まれる",
    thirdPerson: "revolist",
  },
  "communicator-crazist": {
    tier: "bridge",
    dynamic: "繋ぎ×突破",
    fromNote: "クレイジストの突破発想が、コミュニケーターの対話に驚きを加える",
    toNote: "コミュニケーターの対話力が、クレイジストの発想を人に届ける橋になる",
    teamNote: "常識と革新の境界を超えるペア。整理役の第三者がいると動きやすい",
    thirdPerson: "logicalmaister",
  },

  // ── inforader ───────────────────────────────────────────────────────
  "inforader-movmentor": {
    tier: "bridge",
    dynamic: "探求×推進",
    fromNote: "ムーブメンターの熱量が、インフォレイダーの情報収集を行動へ変える",
    toNote: "インフォレイダーの情報が、ムーブメンターの応援に根拠を与える",
    teamNote: "情報と熱量が出会うペア。設計役の第三者がいると成果につながる",
    thirdPerson: "logicalmaister",
  },
  "inforader-premiercrafter": {
    tier: "good",
    dynamic: "探求×実現",
    fromNote: "プレミアクラフターの制作力が、インフォレイダーの情報を形にする",
    toNote: "インフォレイダーの情報が、プレミアクラフターの制作に方向性を与える",
    teamNote: "「調べる」と「作る」が合わさり、根拠のある成果が生まれる",
    thirdPerson: "revolist",
  },
  "inforader-logicalmaister": {
    tier: "best",
    dynamic: "探求×設計",
    fromNote: "ロジカルマイスターの設計力が、インフォレイダーの情報を活きる仕組みにする",
    toNote: "インフォレイダーの情報が、ロジカルマイスターの設計に根拠と精度を与える",
    teamNote: "「情報を集める」と「仕組みを作る」が揃う、確実に機能するペア",
    thirdPerson: "revolist",
  },
  "arranger-inforader": {
    tier: "good",
    dynamic: "探求×整理",
    fromNote: "アレンジャーの整理力が、インフォレイダーの情報を使いやすい形にまとめる",
    toNote: "インフォレイダーの情報が、アレンジャーの調整に判断材料を与える",
    teamNote: "「集める」と「整える」が合わさり、チームが使えるナレッジが生まれる",
    thirdPerson: "revolist",
  },
  "inforader-soulowner": {
    tier: "bridge",
    dynamic: "探求×共感",
    fromNote: "ソウルオーナーの共感が、インフォレイダーの探求に人の視点を加える",
    toNote: "インフォレイダーの情報が、ソウルオーナーの支援に根拠をもたらす",
    teamNote: "論理と感情が出会うペア。橋渡し役の第三者がいるとより機能する",
    thirdPerson: "communicator",
  },
  "crazist-inforader": {
    tier: "bridge",
    dynamic: "探求×突破",
    fromNote: "クレイジストの突破発想が、インフォレイダーの情報に予想外の解釈を与える",
    toNote: "インフォレイダーの情報が、クレイジストの発想に現実的な根拠を与える",
    teamNote: "「知る」と「壊す」が出会うペア。設計役の第三者がいると突破口が開く",
    thirdPerson: "logicalmaister",
  },

  // ── movmentor ───────────────────────────────────────────────────────
  "movmentor-premiercrafter": {
    tier: "bridge",
    dynamic: "推進×実現",
    fromNote: "プレミアクラフターの完成度が、ムーブメンターの応援に説得力を与える",
    toNote: "ムーブメンターの熱量が、プレミアクラフターの制作を世に送り出す力になる",
    teamNote: "推進と実現が出会うペア。方向性の設計役の第三者がいると力を発揮しやすい",
    thirdPerson: "arranger",
  },
  "logicalmaister-movmentor": {
    tier: "bridge",
    dynamic: "推進×設計",
    fromNote: "ロジカルマイスターの設計が、ムーブメンターの応援に道筋を与える",
    toNote: "ムーブメンターの熱量が、ロジカルマイスターの計画を動かす力になる",
    teamNote: "熱量と論理が出会うペア。方向性が揃うと確実な前進が生まれる",
    thirdPerson: "revolist",
  },
  "arranger-movmentor": {
    tier: "good",
    dynamic: "推進×整理",
    fromNote: "アレンジャーの調整が、ムーブメンターの応援が届く環境を整える",
    toNote: "ムーブメンターの熱量が、アレンジャーの整理した場に活力を与える",
    teamNote: "「応援する」と「整える」が合わさり、チームが動きやすい場が生まれる",
    thirdPerson: "revolist",
  },
  "movmentor-soulowner": {
    tier: "best",
    dynamic: "推進×共感",
    fromNote: "ソウルオーナーの共感が、ムーブメンターの応援をより人の心に届けるものにする",
    toNote: "ムーブメンターの前へ動かす力が、ソウルオーナーの安心の場をより生き生きとさせる",
    teamNote: "「前へ動かす」と「安心して戻れる」が揃い、誰もが力を出せるチームの核になる",
    thirdPerson: "revolist",
  },
  "crazist-movmentor": {
    tier: "bridge",
    dynamic: "推進×突破",
    fromNote: "クレイジストの突破発想が、ムーブメンターの応援に刺激を与える",
    toNote: "ムーブメンターの応援が、クレイジストの発想を実際に動かす力になる",
    teamNote: "熱量と革新が出会うペア。整理役の第三者がいると力が前進に変わる",
    thirdPerson: "logicalmaister",
  },

  // ── premiercrafter ──────────────────────────────────────────────────
  "logicalmaister-premiercrafter": {
    tier: "good",
    dynamic: "実現×設計",
    fromNote: "ロジカルマイスターの設計が、プレミアクラフターの制作に明確な方向性を与える",
    toNote: "プレミアクラフターの完成度が、ロジカルマイスターの設計を確実に形にする",
    teamNote: "「設計する」と「実現する」が揃い、机上の計画が確かな成果になる",
    thirdPerson: "revolist",
  },
  "arranger-premiercrafter": {
    tier: "best",
    dynamic: "実現×整理",
    fromNote: "アレンジャーの進行管理が、プレミアクラフターの制作に集中できる環境を作る",
    toNote: "プレミアクラフターの成果が、アレンジャーの調整に達成感の目標を与える",
    teamNote: "「仕上げる」と「整える」が揃い、高品質な成果が確実に届く",
    thirdPerson: "revolist",
  },
  "premiercrafter-soulowner": {
    tier: "bridge",
    dynamic: "実現×共感",
    fromNote: "ソウルオーナーの共感が、プレミアクラフターの制作に人への視点を加える",
    toNote: "プレミアクラフターの完成度が、ソウルオーナーの場に信頼をもたらす",
    teamNote: "制作と感情が出会うペア。届ける役割の第三者がいると力が発揮される",
    thirdPerson: "communicator",
  },
  "crazist-premiercrafter": {
    tier: "good",
    dynamic: "実現×突破",
    fromNote: "クレイジストの突破発想が、プレミアクラフターの制作に新しい可能性を与える",
    toNote: "プレミアクラフターの実現力が、クレイジストの発想を確実に形にする",
    teamNote: "「形にする」と「常識を超える」が合わさり、誰も見たことない成果が生まれる",
    thirdPerson: "logicalmaister",
  },

  // ── logicalmaister ──────────────────────────────────────────────────
  "arranger-logicalmaister": {
    tier: "best",
    dynamic: "設計×整理",
    fromNote: "アレンジャーの調整力が、ロジカルマイスターの設計を現場で機能させる",
    toNote: "ロジカルマイスターの設計が、アレンジャーの調整に論理的な根拠を与える",
    teamNote: "「仕組みを作る」と「流れを整える」が揃う、運営の核となるペア",
    thirdPerson: "revolist",
  },
  "logicalmaister-soulowner": {
    tier: "bridge",
    dynamic: "設計×共感",
    fromNote: "ソウルオーナーの共感が、ロジカルマイスターの設計に人への配慮を加える",
    toNote: "ロジカルマイスターの構造が、ソウルオーナーの共感を持続可能な形にする",
    teamNote: "論理と感情が出会うペア。橋渡し役の第三者がいると化学反応が起きる",
    thirdPerson: "communicator",
  },
  "crazist-logicalmaister": {
    tier: "best",
    dynamic: "設計×突破",
    fromNote: "クレイジストの突破発想に、ロジカルマイスターの設計が実現可能な形を与える",
    toNote: "ロジカルマイスターの構造が、クレイジストの発想を世界へ届けられる形にする",
    teamNote: "「革新を生む」と「形にする」の完璧な補完。不可能が可能になるペア",
    thirdPerson: "revolist",
  },

  // ── arranger ────────────────────────────────────────────────────────
  "arranger-soulowner": {
    tier: "good",
    dynamic: "整理×共感",
    fromNote: "ソウルオーナーの共感が、アレンジャーの整理した場に人の温度を加える",
    toNote: "アレンジャーの整理力が、ソウルオーナーの共感が広がりやすい環境を作る",
    teamNote: "「整える」と「支える」が合わさり、誰もが動きやすく安心できる場が生まれる",
    thirdPerson: "revolist",
  },
  "arranger-crazist": {
    tier: "bridge",
    dynamic: "整理×突破",
    fromNote: "クレイジストの突破発想が、アレンジャーの整理に新しい視点を与える",
    toNote: "アレンジャーの整理力が、クレイジストの発想を実行可能な形に落とし込む",
    teamNote: "「整える」と「壊す」という逆方向の力を持つペア。設計役の第三者がいると調和する",
    thirdPerson: "logicalmaister",
  },

  // ── soulowner ───────────────────────────────────────────────────────
  "crazist-soulowner": {
    tier: "bridge",
    dynamic: "共感×突破",
    fromNote: "クレイジストの突破発想が、ソウルオーナーの内側にある想いを外へ引き出す",
    toNote: "ソウルオーナーの共感が、クレイジストの発想に人への視点を加える",
    teamNote: "感情と革新が出会うペア。形にする力の第三者がいると可能性が広がる",
    thirdPerson: "premiercrafter",
  },
};

// ── ヘルパー関数 ─────────────────────────────────────────────────────

/** 2タイプの相性データを取得 */
export function getCompatibility(
  typeA: RevoTypeKey,
  typeB: RevoTypeKey
): PairCompatibility | null {
  if (typeA === typeB) return null;
  const key = [typeA, typeB].sort().join("-");
  return pairs[key] ?? null;
}

/** あるタイプのすべての相性を tier 順に取得 */
export function getPartnersByTier(typeKey: RevoTypeKey): Array<{
  partnerKey: RevoTypeKey;
  compat: PairCompatibility;
}> {
  const tierOrder: Record<CompatibilityTier, number> = { best: 0, good: 1, bridge: 2 };
  const results: Array<{ partnerKey: RevoTypeKey; compat: PairCompatibility }> = [];

  for (const [key, compat] of Object.entries(pairs)) {
    if (!key.includes(typeKey)) continue;
    const [a, b] = key.split("-") as RevoTypeKey[];
    const partner = a === typeKey ? b : a;
    results.push({ partnerKey: partner, compat });
  }

  return results.sort((x, y) => tierOrder[x.compat.tier] - tierOrder[y.compat.tier]);
}

/** ◎ペアだけ取得 */
export function getBestPartners(typeKey: RevoTypeKey): RevoTypeKey[] {
  return getPartnersByTier(typeKey)
    .filter((r) => r.compat.tier === "best")
    .map((r) => r.partnerKey);
}

/** ティアラベル（表示用） */
export const tierLabel: Record<CompatibilityTier, string> = {
  best: "◎ 力が最大化される",
  good: "○ 自然に補い合える",
  bridge: "△ 違いが大きく、橋渡しで輝く",
};

export const tierColor: Record<CompatibilityTier, string> = {
  best: "#000000",
  good: "#374151",
  bridge: "#9ca3af",
};
