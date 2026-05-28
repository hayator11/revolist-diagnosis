import type { RevoTypeKey } from "./revotypes";
import { revoTypes } from "./revotypes";

export interface Combination {
  title: string;  // カードのメインコピー（1〜2行）
  quote: string;  // カードのサブコピー
}

/**
 * メインタイプ × サブタイプ の組み合わせ説明
 * キー形式: "{mainType}-{subType}"
 */
const combinationMap: Record<string, Combination> = {
  // ── revolist as main ──
  "revolist-maxdesigner": {
    title: "火を灯しながら、世界観も作れる人",
    quote: "理想の炎で人を動かし、美しい形で未来を届ける。",
  },
  "revolist-imagemaister": {
    title: "熱量と感性で、場を動かす人",
    quote: "感性が届き、熱量が広がる。あなたがいると、場が変わる。",
  },
  "revolist-communicator": {
    title: "行動力と対話で、人と未来をつなぐ人",
    quote: "動き続けながら、誰も置いていかない。",
  },
  "revolist-inforader": {
    title: "確かな根拠と直感で、未来を切り拓く人",
    quote: "データに裏打ちされた挑戦は、より遠くへ届く。",
  },
  "revolist-movmentor": {
    title: "熱量が熱量を呼ぶ、循環の中心",
    quote: "あなたの動きが、周囲の動きを生み出す。",
  },
  "revolist-premiercrafter": {
    title: "理想を、細部まで美しく実現できる人",
    quote: "情熱は、丁寧さによって本物になる。",
  },
  "revolist-logicalmaister": {
    title: "理想を現実へ変えていく人",
    quote: "夢を語るだけでなく、設計図も描ける。それが強さ。",
  },
  "revolist-arranger": {
    title: "前へ進みながら、流れも整えられる人",
    quote: "熱量と調整力が合わさるとき、チームは加速する。",
  },
  "revolist-soulowner": {
    title: "人の心を動かしながら、未来へ進む人",
    quote: "感情に寄り添いながら、世界を動かしていく。",
  },
  "revolist-crazist": {
    title: "常識の外から、世界を動かす人",
    quote: "誰も思いつかなかった道を、真っ先に走り出す。",
  },

  // ── maxdesigner as main ──
  "maxdesigner-revolist": {
    title: "発想力に、熱量と推進力が加わる人",
    quote: "アイデアは、動く力と出会ったとき、世界へ届く。",
  },
  "maxdesigner-imagemaister": {
    title: "発想と感性で、誰も見たことのない世界を作る人",
    quote: "想像力と表現力が重なると、現実が塗り替わる。",
  },
  "maxdesigner-communicator": {
    title: "発想力と伝える力で、人を動かす人",
    quote: "アイデアは、届いて初めて価値になる。",
  },
  "maxdesigner-inforader": {
    title: "情報と発想で、新しい価値を生み出す人",
    quote: "データの中に、誰も見えていない可能性を見つける。",
  },
  "maxdesigner-movmentor": {
    title: "面白さで、人の行動を生み出す人",
    quote: "熱狂が広がる場には、いつも発想の種がある。",
  },
  "maxdesigner-premiercrafter": {
    title: "世界観と技術で、本物を作り上げる人",
    quote: "イメージを、手で触れられる現実に変えていく。",
  },
  "maxdesigner-logicalmaister": {
    title: "アイデアを、設計図に変えていく人",
    quote: "発想力と設計力が出会うとき、夢は形になる。",
  },
  "maxdesigner-arranger": {
    title: "世界観を持ちながら、着実に形にする人",
    quote: "想像力は、整える力によって現実へ届く。",
  },
  "maxdesigner-soulowner": {
    title: "創造と共感で、人の心に届けていく人",
    quote: "美しいものは、受け取る人の感情と出会って完成する。",
  },
  "maxdesigner-crazist": {
    title: "誰も思いつかない未来を、形にする人",
    quote: "常識の外でしか、本当の可能性は生まれない。",
  },

  // ── imagemaister as main ──
  "imagemaister-revolist": {
    title: "感性に熱量が加わり、世界を動かす表現者",
    quote: "美しさと行動力が重なると、感動が広がる。",
  },
  "imagemaister-maxdesigner": {
    title: "感性と発想で、無限の世界観を作る人",
    quote: "表現の可能性は、発想と感性が重なる場所にある。",
  },
  "imagemaister-communicator": {
    title: "感性を言葉に変え、人の心へ届ける人",
    quote: "伝わらなかった感性が、対話によって開花する。",
  },
  "imagemaister-inforader": {
    title: "感性と情報で、時代を先読みする表現者",
    quote: "何が届くかを知りながら、美しく表現できる。",
  },
  "imagemaister-movmentor": {
    title: "感動と行動力で、人の心を動かす人",
    quote: "あなたの表現は、誰かの一歩目を生み出す。",
  },
  "imagemaister-premiercrafter": {
    title: "美しさを、細部まで丁寧に形にする人",
    quote: "感性と技術が出会うとき、本物が生まれる。",
  },
  "imagemaister-logicalmaister": {
    title: "感性を、仕組みに変えていく人",
    quote: "届く表現には、見えない設計がある。",
  },
  "imagemaister-arranger": {
    title: "美しい世界観を、安定した形で届ける人",
    quote: "表現は、整える力によってより遠くへ届く。",
  },
  "imagemaister-soulowner": {
    title: "感性と共感で、人の心に深く届く人",
    quote: "美しさと優しさが重なる場所に、居場所が生まれる。",
  },
  "imagemaister-crazist": {
    title: "常識の外から、美しい驚きを持ち込む人",
    quote: "誰も見たことのない美しさが、未来を変える。",
  },

  // ── communicator as main ──
  "communicator-revolist": {
    title: "つながりに、前へ進む力が加わる人",
    quote: "橋渡しをしながら、未来の方向も示せる。",
  },
  "communicator-maxdesigner": {
    title: "対話力に、発想の広がりが加わる人",
    quote: "つなぐだけでなく、新しい可能性を引き出せる。",
  },
  "communicator-imagemaister": {
    title: "会話の中に、美しい世界観を宿す人",
    quote: "言葉が感性を纏うとき、人の心に届く。",
  },
  "communicator-inforader": {
    title: "情報と対話で、人の行動を変える人",
    quote: "正確さと温かさを持ち合わせた、信頼の存在。",
  },
  "communicator-movmentor": {
    title: "つながりに、行動の勢いが加わる人",
    quote: "あなたが橋渡しをするとき、流れが生まれる。",
  },
  "communicator-premiercrafter": {
    title: "丁寧な対話で、信頼を積み重ねる人",
    quote: "誠実さは、関係性を本物にしていく。",
  },
  "communicator-logicalmaister": {
    title: "対話力に、構造の明確さが加わる人",
    quote: "何を伝えるかと、どう伝えるかが揃っている。",
  },
  "communicator-arranger": {
    title: "安心感と調整力で、場を整えていく人",
    quote: "人と流れを、自然に整えていくことができる。",
  },
  "communicator-soulowner": {
    title: "安心して話せる場を、自然に作り出す人",
    quote: "あなたがいると、本音が出やすくなる。",
  },
  "communicator-crazist": {
    title: "対話から、常識を超えた可能性を引き出す人",
    quote: "会話の中に、革命の種が宿ることがある。",
  },

  // ── inforader as main ──
  "inforader-revolist": {
    title: "情報を武器に、未来を切り拓く人",
    quote: "確かな根拠と行動力が揃うとき、変化が始まる。",
  },
  "inforader-maxdesigner": {
    title: "情報と発想で、新しい視点を提供する人",
    quote: "データの中に、誰も見ていなかった美しさがある。",
  },
  "inforader-imagemaister": {
    title: "情報を、感性で届ける人",
    quote: "正確さと美しさが重なるとき、心に届く。",
  },
  "inforader-communicator": {
    title: "情報と対話で、人の行動を変える人",
    quote: "知識は、人へ届いて初めて力になる。",
  },
  "inforader-movmentor": {
    title: "根拠ある応援で、人の背中を押す人",
    quote: "情報に裏打ちされた応援は、より深く届く。",
  },
  "inforader-premiercrafter": {
    title: "精度の高い情報を、丁寧に届ける人",
    quote: "正確さと丁寧さは、信頼を作る最強の組み合わせ。",
  },
  "inforader-logicalmaister": {
    title: "情報を整理し、最適な解を導く人",
    quote: "情報と論理の力で、複雑な課題を解きほぐす。",
  },
  "inforader-arranger": {
    title: "情報収集と調整力で、チームを支える人",
    quote: "判断材料を整え、流れを作ることができる。",
  },
  "inforader-soulowner": {
    title: "情報を、人の感情に寄り添いながら届ける人",
    quote: "正確さと優しさを持ち合わせた、稀有な存在。",
  },
  "inforader-crazist": {
    title: "既存の情報から、常識外の発見をする人",
    quote: "知れば知るほど、常識の外が見えてくる。",
  },

  // ── movmentor as main ──
  "movmentor-revolist": {
    title: "応援と熱量で、未来を動かす人",
    quote: "ふたつの熱量が重なるとき、周囲に嵐が起きる。",
  },
  "movmentor-maxdesigner": {
    title: "場の力と発想で、人を新しい世界へ誘う人",
    quote: "盛り上げながら、新しい扉を開ける人。",
  },
  "movmentor-imagemaister": {
    title: "応援の言葉に、感動が宿る人",
    quote: "あなたが背中を押すとき、感情も動く。",
  },
  "movmentor-communicator": {
    title: "つながりを前進させる、場の牽引者",
    quote: "人をつなぎながら、全員を前へ動かす。",
  },
  "movmentor-inforader": {
    title: "根拠ある応援で、人の行動を確かに支える人",
    quote: "熱量だけでなく、根拠もある応援ができる。",
  },
  "movmentor-premiercrafter": {
    title: "丁寧な応援で、人の才能を引き出す人",
    quote: "磨かれた応援は、より深く人の可能性を開く。",
  },
  "movmentor-logicalmaister": {
    title: "熱量に、構造の力が加わる人",
    quote: "感情で動かしながら、理論でも支えられる。",
  },
  "movmentor-arranger": {
    title: "場の勢いと流れを整える推進力",
    quote: "前へ進む力と、整える力が共存している。",
  },
  "movmentor-soulowner": {
    title: "背中を押しながら、心にも寄り添う人",
    quote: "行動させるだけでなく、受け止めることもできる。",
  },
  "movmentor-crazist": {
    title: "常識の外から、行動の嵐を起こす人",
    quote: "誰も予測できない方向から、人を動かす。",
  },

  // ── premiercrafter as main ──
  "premiercrafter-revolist": {
    title: "技術に熱量が加わり、世界を動かす職人",
    quote: "こだわりが、誰かの未来を変えることがある。",
  },
  "premiercrafter-maxdesigner": {
    title: "技術と発想で、前例のないものを作る人",
    quote: "精度と創造力が出会うとき、本物が生まれる。",
  },
  "premiercrafter-imagemaister": {
    title: "技術と感性で、本物の美しさを作る人",
    quote: "手と感覚が一致するとき、作品は完成する。",
  },
  "premiercrafter-communicator": {
    title: "丁寧な仕事と対話で、信頼を築く人",
    quote: "技術は、伝わって初めて価値になる。",
  },
  "premiercrafter-inforader": {
    title: "情報に基づき、完成度の高いものを作る人",
    quote: "根拠ある丁寧さは、品質を次の段階へ上げる。",
  },
  "premiercrafter-movmentor": {
    title: "技術に、伝える熱量が加わる人",
    quote: "作るだけでなく、届けることもできる。",
  },
  "premiercrafter-logicalmaister": {
    title: "技術を仕組み化し、価値を広げていく人",
    quote: "個人の技術が、仕組みになるとき社会へ届く。",
  },
  "premiercrafter-arranger": {
    title: "技術を活かしながら、周囲も整えられる人",
    quote: "自分が輝きながら、周囲の流れも作れる。",
  },
  "premiercrafter-soulowner": {
    title: "丁寧に作り、丁寧に人に寄り添う人",
    quote: "技術と優しさを持ち合わせた、信頼の職人。",
  },
  "premiercrafter-crazist": {
    title: "技術で、常識の外の可能性を実現する人",
    quote: "革命的な発想を、手で形にできる人。",
  },

  // ── logicalmaister as main ──
  "logicalmaister-revolist": {
    title: "設計力に熱量が加わり、未来を実現する人",
    quote: "計画は、動く力と出会ったとき現実になる。",
  },
  "logicalmaister-maxdesigner": {
    title: "論理と発想で、新しい価値を設計する人",
    quote: "構造に美しさが加わると、人が動き始める。",
  },
  "logicalmaister-imagemaister": {
    title: "構造に感性が加わり、届く設計ができる人",
    quote: "機能するだけでなく、感動させる設計ができる。",
  },
  "logicalmaister-communicator": {
    title: "論理と対話で、人を動かす設計者",
    quote: "正確さと温かさが揃うと、人は動き始める。",
  },
  "logicalmaister-inforader": {
    title: "情報と論理で、最適解を見つける人",
    quote: "確かな情報と構造的思考が、最善の道を示す。",
  },
  "logicalmaister-movmentor": {
    title: "設計力に、動かす熱量が加わる人",
    quote: "完璧な計画を、情熱で動かすことができる。",
  },
  "logicalmaister-premiercrafter": {
    title: "設計と技術で、再現可能な価値を作る人",
    quote: "設計図が、職人の手で本物になるとき。",
  },
  "logicalmaister-arranger": {
    title: "全体設計と調整力で、確実に前へ進める人",
    quote: "計画と実行が自分の中で完結している。",
  },
  "logicalmaister-soulowner": {
    title: "論理に、人への深い共感が加わる人",
    quote: "正しさと優しさを、同時に持てる設計者。",
  },
  "logicalmaister-crazist": {
    title: "構造と突破発想で、誰も考えなかった答えを出す人",
    quote: "常識の外を、構造の力で現実へ着地させる。",
  },

  // ── arranger as main ──
  "arranger-revolist": {
    title: "整える力に、前へ進む熱量が加わる人",
    quote: "安定した流れを作りながら、未来へ向かう。",
  },
  "arranger-maxdesigner": {
    title: "調整力と発想で、場に新しい価値を生む人",
    quote: "整えながら、可能性も広げることができる。",
  },
  "arranger-imagemaister": {
    title: "整える力に、美しさの感性が加わる人",
    quote: "機能する美しさを、自然に作り出す存在。",
  },
  "arranger-communicator": {
    title: "安心できる場を、対話力で広げていく人",
    quote: "整えながら、つながりも生み出せる。",
  },
  "arranger-inforader": {
    title: "調整力と情報収集で、全体を最適化する人",
    quote: "情報と整理の力で、最善の流れを作る。",
  },
  "arranger-movmentor": {
    title: "整えながら、場のエネルギーも高められる人",
    quote: "安定と勢いを、同時に作り出すことができる。",
  },
  "arranger-premiercrafter": {
    title: "整える力と技術で、信頼できる結果を出す人",
    quote: "丁寧さが二重になるとき、信頼は本物になる。",
  },
  "arranger-logicalmaister": {
    title: "調整力と設計力で、組織を着実に前へ進める人",
    quote: "設計と実行が揃うとき、チームは動き出す。",
  },
  "arranger-soulowner": {
    title: "安心感で、流れを整える人",
    quote: "安心の場を作ることで、人が自然に動ける。",
  },
  "arranger-crazist": {
    title: "常識外のアイデアを、現実へ着地させる人",
    quote: "革命的な発想に、着地点を与えられる存在。",
  },

  // ── soulowner as main ──
  "soulowner-revolist": {
    title: "共感力に熱量が加わり、人の心と未来を動かす人",
    quote: "寄り添いながら、前へ進める道も示せる。",
  },
  "soulowner-maxdesigner": {
    title: "深い共感に、豊かな発想が加わる人",
    quote: "人の感情の中に、新しい可能性を見つける。",
  },
  "soulowner-imagemaister": {
    title: "心の深さと感性で、人に安らぎを届ける人",
    quote: "共感と表現が出会うとき、深い癒しが生まれる。",
  },
  "soulowner-communicator": {
    title: "安心感と対話で、人の心に居場所を作る人",
    quote: "あなたがいると、本音が語れる場が生まれる。",
  },
  "soulowner-inforader": {
    title: "感情と情報で、人の本質的なニーズを見抜く人",
    quote: "何が必要かを、心と頭で同時に読める存在。",
  },
  "soulowner-movmentor": {
    title: "寄り添いながら、人の背中を押せる人",
    quote: "安心してから進むとき、人はより遠くへ行ける。",
  },
  "soulowner-premiercrafter": {
    title: "深い共感と丁寧さで、人の心を支える人",
    quote: "細部まで気を配る優しさが、信頼になる。",
  },
  "soulowner-logicalmaister": {
    title: "共感力に、問題解決の力が加わる人",
    quote: "感情を受け止めながら、解決策も提示できる。",
  },
  "soulowner-arranger": {
    title: "心の安心と場の整えで、居場所を作る人",
    quote: "安心と安定が重なるとき、人は本来の力を出せる。",
  },
  "soulowner-crazist": {
    title: "常識の外から、新しい安心の形を作る人",
    quote: "誰も気づかなかった優しさを、形にできる人。",
  },

  // ── crazist as main ──
  "crazist-revolist": {
    title: "常識外の発想と熱量で、世界を動かす人",
    quote: "誰も予測できない方法で、世界を変えていく。",
  },
  "crazist-maxdesigner": {
    title: "突破発想に、世界観の広がりが加わる人",
    quote: "革命的な発想が、美しい形で届けられる。",
  },
  "crazist-imagemaister": {
    title: "常識外の発想を、美しく表現できる人",
    quote: "「えっ」と「きれい」が同時に来る、稀有な存在。",
  },
  "crazist-communicator": {
    title: "驚きと対話で、人の固定概念を溶かす人",
    quote: "常識の外を、やさしく届けることができる。",
  },
  "crazist-inforader": {
    title: "突破発想と情報で、時代の先を行く人",
    quote: "データを見ながら、誰も見ていない未来を読む。",
  },
  "crazist-movmentor": {
    title: "常識の外から、行動の嵐を起こす人",
    quote: "予測不能な熱量が、周囲を動かしていく。",
  },
  "crazist-premiercrafter": {
    title: "革命的な発想を、丁寧に形にできる人",
    quote: "前例のないものを、確実に作り上げる力がある。",
  },
  "crazist-logicalmaister": {
    title: "突破発想を、現実へ変換できる人",
    quote: "「できるわけない」を「できる」に変えていく。",
  },
  "crazist-arranger": {
    title: "常識外のアイデアを、現実へ着地させる人",
    quote: "革命も、整える力があれば世界へ届く。",
  },
  "crazist-soulowner": {
    title: "常識外の優しさで、人の心を解放する人",
    quote: "誰も考えなかった方法で、人を救うことがある。",
  },
};

/** メインタイプ × サブタイプ の組み合わせ説明を取得 */
export function getCombination(
  main: RevoTypeKey,
  sub: RevoTypeKey
): Combination {
  const key = `${main}-${sub}`;
  if (combinationMap[key]) return combinationMap[key];

  // フォールバック: タイプの特性から自動生成
  const mainType = revoTypes[main];
  const subType = revoTypes[sub];
  return {
    title: `${mainType.gives[0]}と${subType.gives[0]}を自然に届ける人`,
    quote: `${mainType.catchcopy}。そこに、${subType.gives[0]}の力が加わっています。`,
  };
}

/** Revoシェア用タグライン（メインタイプで決定論的に選択） */
const taglineByType: Record<RevoTypeKey, string> = {
  revolist: "役割が違うから、人は支え合える。",
  maxdesigner: "違いを持ち寄り、循環によって未来を育てる。",
  imagemaister: "違いを持ち寄り、循環によって未来を育てる。",
  communicator: "役割が違うから、人は支え合える。",
  inforader: "DAOの次は、Revo。",
  movmentor: "役割が違うから、人は支え合える。",
  premiercrafter: "DAOの次は、Revo。",
  logicalmaister: "DAOの次は、Revo。",
  arranger: "違いを持ち寄り、循環によって未来を育てる。",
  soulowner: "役割が違うから、人は支え合える。",
  crazist: "DAOの次は、Revo。",
};

export function getTagline(main: RevoTypeKey): string {
  return taglineByType[main];
}

/** Xシェア用テキスト生成 */
export function buildShareText(
  mainName: string,
  subName: string,
  auxName: string,
  comboTitle: string
): string {
  return `レボリスト診断やってみた。\n\n「${mainName} × ${subName} × ${auxName}」\n\n${comboTitle}\n\n役割が違うから、人は支え合えるらしい。\n\n#Revo #レボリスト診断`;
}
