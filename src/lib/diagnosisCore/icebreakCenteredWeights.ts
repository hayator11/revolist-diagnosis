import type {
  CenteredAxisQuestionWeight,
  CenteredForceQuestionWeight,
  CenteredRoleQuestionWeight,
} from "@/lib/diagnosisCore/multiAxis";

export interface IcebreakCenteredWeightOverride {
  reason: string;
  axisWeights?: CenteredAxisQuestionWeight[];
  roleWeights?: CenteredRoleQuestionWeight[];
  forceWeights?: CenteredForceQuestionWeight[];
}

export const ICEBREAK_CENTERED_WEIGHT_OVERRIDES: Record<string, IcebreakCenteredWeightOverride> = {
  ice33_q01: {
    reason:
      "初対面で会話の入口を作る力を見る設問。肯定は場を開く力を活かし、否定は観察・整理・情報確認を優先する特色として小さく読む。",
    axisWeights: [
      { axis: "evidenceSeeking", weight: -0.2 },
      { axis: "systemizing", weight: -0.15 },
    ],
    roleWeights: [
      { role: "logicalmaister", weight: -0.2 },
      { role: "inforader", weight: -0.15 },
    ],
    forceWeights: [
      { force: "structure", weight: -0.15 },
    ],
  },
  ice33_q03: {
    reason:
      "整いきる前でも試す始動性を見る設問。肯定は始動・不確実性耐性を補強し、慎重な継続・安心維持とは小さく逆方向に置く。",
    axisWeights: [
      { axis: "executionDrive", weight: 0.3 },
      { axis: "uncertaintyTolerance", weight: 0.25 },
      { axis: "maintenanceDrive", weight: -0.25 },
      { axis: "psychologicalSafety", weight: -0.2 },
    ],
    roleWeights: [
      { role: "revolist", weight: 0.35 },
      { role: "premiercrafter", weight: -0.25 },
      { role: "soulowner", weight: -0.2 },
    ],
    forceWeights: [
      { force: "ignite", weight: 0.35 },
      { force: "care", weight: -0.25 },
    ],
  },
  ice33_q04: {
    reason:
      "相手が安心して話せるように受け止める力を見る設問。肯定は安心形成を直接測り、否定は無理に反対タイプへ押し込まない。",
    axisWeights: [],
    roleWeights: [],
    forceWeights: [],
  },
  ice33_q05: {
    reason:
      "ひとつの案から別の見せ方や展開を描く可能性設計の力を見る設問。肯定は可能性を広げる力を補強し、否定は維持・確認・品質を優先する特色として小さく読む。",
    axisWeights: [
      { axis: "maintenanceDrive", weight: -0.15 },
      { axis: "evidenceSeeking", weight: -0.15 },
    ],
    roleWeights: [
      { role: "premiercrafter", weight: -0.15 },
      { role: "inforader", weight: -0.15 },
    ],
    forceWeights: [
      { force: "care", weight: -0.1 },
      { force: "structure", weight: -0.1 },
    ],
  },
  ice33_q06: {
    reason:
      "散らかった話を構造化して伝える力を見る設問。肯定は構造化・言語化を補強し、否定は場でつなぐ・直感で広げる特色として小さく読む。",
    axisWeights: [
      { axis: "socialBridge", weight: -0.2 },
      { axis: "noveltyDrive", weight: -0.2 },
      { axis: "publicVisibility", weight: -0.15 },
    ],
    roleWeights: [
      { role: "communicator", weight: -0.2 },
      { role: "crazist", weight: -0.2 },
    ],
    forceWeights: [
      { force: "connect", weight: -0.15 },
      { force: "ignite", weight: -0.15 },
    ],
  },
  ice33_q07: {
    reason:
      "挑戦している人の次の一歩を一緒に探す応援・伴走の力を見る設問。肯定は応援と次の一歩を補強し、否定は情報確認・構造整理を重視する特色として小さく読む。",
    axisWeights: [
      { axis: "systemizing", weight: -0.15 },
      { axis: "evidenceSeeking", weight: -0.15 },
    ],
    roleWeights: [
      { role: "logicalmaister", weight: -0.1 },
      { role: "inforader", weight: -0.15 },
    ],
    forceWeights: [
      { force: "structure", weight: -0.1 },
    ],
  },
  ice33_q08: {
    reason:
      "人・予定・役割のズレに気づいて流れを整える力を見る設問。肯定は配置・調整を直接測り、否定は無理に反対タイプへ押し込まない。",
    axisWeights: [],
    roleWeights: [],
    forceWeights: [],
  },
  ice33_q10: {
    reason:
      "普通のやり方以外から考える非同調性を見る設問。肯定は常識外の発想を補強し、既存の段取り・調整とは小さく逆方向に置く。",
    axisWeights: [
      { axis: "nonconformity", weight: 0.3 },
      { axis: "noveltyDrive", weight: 0.2 },
      { axis: "coordination", weight: -0.25 },
      { axis: "maintenanceDrive", weight: -0.2 },
    ],
    roleWeights: [
      { role: "crazist", weight: 0.35 },
      { role: "arranger", weight: -0.25 },
      { role: "premiercrafter", weight: -0.2 },
    ],
    forceWeights: [
      { force: "ignite", weight: 0.25 },
      { force: "structure", weight: -0.2 },
      { force: "care", weight: -0.15 },
    ],
  },
  ice33_q11: {
    reason:
      "言葉・雰囲気・見た目を整えて伝わり方を設計する力を見る設問。肯定は表現設計を補強し、否定は事実・構造・継続を重視する特色として小さく読む。",
    axisWeights: [
      { axis: "evidenceSeeking", weight: -0.25 },
      { axis: "systemizing", weight: -0.2 },
      { axis: "maintenanceDrive", weight: -0.15 },
    ],
    roleWeights: [
      { role: "inforader", weight: -0.25 },
      { role: "logicalmaister", weight: -0.2 },
    ],
    forceWeights: [
      { force: "structure", weight: -0.2 },
    ],
  },
  ice33_q12: {
    reason:
      "人と人をつなぎ、組み合わせる力を見る設問。肯定は場の接続と可能性を補強し、否定は自分の表現・見せ方に集中する特色として薄く読む。",
    axisWeights: [
      { axis: "expressionDrive", weight: -0.1 },
    ],
    roleWeights: [
      { role: "imagemaister", weight: -0.1 },
    ],
    forceWeights: [
      { force: "design", weight: -0.1 },
    ],
  },
  ice33_q15: {
    reason:
      "場の中でまだ言葉になっていない気持ちに気づく力を見る設問。肯定は未言語の気配を拾う力を直接測り、否定はこの設問ではケア側が出にくいだけとして扱う。",
    axisWeights: [],
    roleWeights: [],
    forceWeights: [],
  },
  ice33_q16: {
    reason:
      "素材や構成を組み合わせて企画化する力を見る設問。肯定は可能性設計を補強し、人を直接つなぐ力とは薄く差分を見る。",
    axisWeights: [
      { axis: "socialBridge", weight: -0.1 },
    ],
    roleWeights: [
      { role: "communicator", weight: -0.1 },
    ],
    forceWeights: [
      { force: "connect", weight: -0.1 },
    ],
  },
  ice33_q17: {
    reason:
      "感覚的な話を伝わる言葉へ置き換える力を見る設問。肯定は感覚の言語化を直接測り、否定は無理に反対タイプへ押し込まない。",
    axisWeights: [],
    roleWeights: [],
    forceWeights: [],
  },
  ice33_q18: {
    reason:
      "人の良さを見つけて本人に伝える力を見る設問。肯定は良さを見つけて伝える力を補強し、否定は品質・構造・仕上げを優先する特色として小さく読む。",
    axisWeights: [
      { axis: "craftQuality", weight: -0.15 },
      { axis: "systemizing", weight: -0.15 },
    ],
    roleWeights: [
      { role: "premiercrafter", weight: -0.15 },
      { role: "logicalmaister", weight: -0.1 },
    ],
    forceWeights: [
      { force: "structure", weight: -0.1 },
    ],
  },
  ice33_q22: {
    reason:
      "話の魅力が伝わるように表現を工夫する力を見る設問。肯定は表現設計を補強し、否定は配置・流れ・つながりを整える特色として薄く読む。",
    axisWeights: [
      { axis: "coordination", weight: -0.1 },
    ],
    roleWeights: [
      { role: "arranger", weight: -0.1 },
    ],
    forceWeights: [
      { force: "connect", weight: -0.1 },
    ],
  },
  ice33_q23: {
    reason:
      "場の温度が下がった時に会話の入口を作る力を見る設問。肯定は場を開く力を補強し、否定は案や体験の設計に意識が向く特色として薄く読む。",
    axisWeights: [
      { axis: "possibilityDesign", weight: -0.1 },
    ],
    roleWeights: [
      { role: "maxdesigner", weight: -0.1 },
    ],
    forceWeights: [
      { force: "design", weight: -0.1 },
    ],
  },
  ice33_q24: {
    reason:
      "小さな情報に価値を見つける探究・観察の力を見る設問。肯定は情報を拾う力を補強し、否定は前に出る・動かす・新しく切り開く特色として小さく読む。",
    axisWeights: [
      { axis: "publicVisibility", weight: -0.2 },
      { axis: "executionDrive", weight: -0.2 },
      { axis: "nonconformity", weight: -0.15 },
    ],
    roleWeights: [
      { role: "revolist", weight: -0.15 },
      { role: "crazist", weight: -0.2 },
    ],
    forceWeights: [
      { force: "ignite", weight: -0.15 },
    ],
  },
  ice33_q26: {
    reason:
      "話す量より自然体を大切にする安心形成を見る設問。肯定は安心・継続を補強し、前に出る可視性とは小さく逆方向に置く。",
    axisWeights: [
      { axis: "psychologicalSafety", weight: 0.3 },
      { axis: "maintenanceDrive", weight: 0.2 },
      { axis: "publicVisibility", weight: -0.25 },
      { axis: "executionDrive", weight: -0.2 },
    ],
    roleWeights: [
      { role: "soulowner", weight: 0.35 },
      { role: "communicator", weight: -0.2 },
      { role: "revolist", weight: -0.25 },
    ],
    forceWeights: [
      { force: "care", weight: 0.35 },
      { force: "ignite", weight: -0.25 },
    ],
  },
  ice33_q27: {
    reason:
      "今あるものをもっと面白い体験や流れに設計し直す力を見る設問。肯定は体験設計を直接測り、否定は無理に反対タイプへ押し込まない。",
    axisWeights: [],
    roleWeights: [],
    forceWeights: [],
  },
  ice33_q29: {
    reason:
      "場の誰かが一歩踏み出せるように背中を押す言葉を選ぶ力を見る設問。肯定は応援の表現を直接測り、否定はこの表現スタイルではないだけとして扱う。",
    axisWeights: [],
    roleWeights: [],
    forceWeights: [],
  },
  ice33_q30: {
    reason:
      "誰が何を持っているかを見て配置する力を見る設問。肯定は配置・組み合わせを補強し、否定は突破力や即時実行で動く特色として小さく読む。",
    axisWeights: [
      { axis: "nonconformity", weight: -0.25 },
      { axis: "executionDrive", weight: -0.2 },
      { axis: "uncertaintyTolerance", weight: -0.15 },
    ],
    roleWeights: [
      { role: "crazist", weight: -0.25 },
      { role: "revolist", weight: -0.15 },
    ],
    forceWeights: [
      { force: "ignite", weight: -0.15 },
    ],
  },
  ice33_q31: {
    reason:
      "勢いだけでなく残る品質にしていく力を見る設問。肯定は品質・継続を補強し、否定はまず動く・前に出る・広げる特色として小さく読む。",
    axisWeights: [
      { axis: "executionDrive", weight: -0.2 },
      { axis: "publicVisibility", weight: -0.2 },
      { axis: "uncertaintyTolerance", weight: -0.15 },
    ],
    roleWeights: [
      { role: "revolist", weight: -0.15 },
    ],
    forceWeights: [
      { force: "ignite", weight: -0.15 },
    ],
  },
  ice33_q32: {
    reason:
      "人と違う見方でも自分の感覚を確かめる力を見る設問。肯定は独自の感覚確認を直接測り、否定は無理に反対タイプへ押し込まない。",
    axisWeights: [],
    roleWeights: [],
    forceWeights: [],
  },
  ice33_q33: {
    reason:
      "話すことで発想が広がる力を見る設問。肯定は表現と可能性の広がりを直接測り、否定は未発火・未自覚として扱う。",
    axisWeights: [],
    roleWeights: [],
    forceWeights: [],
  },
};
