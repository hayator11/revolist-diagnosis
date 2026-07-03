export const RESEARCH_PROJECTS = {
  icebreak11: {
    project: "icebreak_11",
    type: "icebreak_beta",
    slug: "icebreak-11-v1",
    diagnosisVersion: "icebreak-11-v1",
    questionVersion: "icebreak-v3-scenario-q33",
    logicVersion: "icebreak-v3-scenario-mapped",
    resultVersion: "icebreak-v2-r1",
    title: "アイスブレイク33",
    shortTitle: "Icebreak 33",
    description: "33問で今の力・動き方・話してみたい相手を見つける先行版です。",
  },
  revolist11Light: {
    project: "revolist_11",
    type: "light_beta",
    slug: "revolist-11-light-v1",
    diagnosisVersion: "revolist-11-light-v1",
    questionVersion: "light-v1-q1",
    logicVersion: "light-v1-l1",
    resultVersion: "light-v1-r1",
    title: "レボリスト11 ライト版ベータ",
    shortTitle: "Revolist 11 Light",
    description: "21問で5つの力と11タイプを見つける研究版診断です。",
  },
  energyLight: {
    project: "revolist_energy_light",
    type: "light_beta",
    slug: "revolist-energy-light-v1",
    diagnosisVersion: "revolist-energy-light-v1",
    questionVersion: "energy-light-v1-q1",
    logicVersion: "energy-light-v1-l1",
    resultVersion: "energy-light-v1-r1",
    title: "レボリスト診断 ライト版",
    shortTitle: "Energy Light",
    description: "21問で5つのエネルギーと11タイプを見つける別構成の研究版です。",
  },
  onokunSatooya11: {
    project: "onokun_satooya_11",
    type: "onokun_beta",
    slug: "onokun-satooya-11-v1",
    diagnosisVersion: "onokun-satooya-11-v1",
    questionVersion: "onokun-satooya-v2-q11-quest",
    logicVersion: "onokun-satooya-v2-revo-linked-evidence-map",
    resultVersion: "onokun-satooya-v2-r1",
    title: "おのくん里親さん 11ご縁タイプ診断",
    shortTitle: "Onokun Satooya",
    description:
      "11問のクエスト型選択式で、おのくんとのご縁の育て方を見つける研究版診断です。",
  },
  onokunSatooyaMatch18: {
    project: "onokun_satooya_match_18",
    type: "onokun_matching_beta",
    slug: "onokun-satooya-match-18-v1",
    diagnosisVersion: "onokun-satooya-match-18-v1",
    questionVersion: "onokun-satooya-match-v1-q18",
    logicVersion: "onokun-satooya-match-v1-bidirectional",
    resultVersion: "onokun-satooya-match-v1-r1",
    title: "おのくん里親さん 相棒マッチ診断",
    shortTitle: "Onokun Match",
    description:
      "18問で自分のご縁タイプと、気になる相棒タイプを両方向から見る研究版診断です。",
  },
  birthRhythm: {
    project: "birth_rhythm",
    type: "beta",
    slug: "birth-rhythm-v1",
    diagnosisVersion: "birth-rhythm-v1",
    questionVersion: "birth-rhythm-v1-q1",
    logicVersion: "birth-rhythm-v1-l1",
    resultVersion: "birth-rhythm-v1-r1",
    title: "生年月日リズム診断",
    shortTitle: "Birth Rhythm",
    description: "今後追加予定の研究版診断です。",
    comingSoon: true,
  },
} as const;

export const REVOLIST_11_LIGHT_META = RESEARCH_PROJECTS.revolist11Light;
export const ENERGY_LIGHT_META = RESEARCH_PROJECTS.energyLight;
export const ICEBREAK_11_META = RESEARCH_PROJECTS.icebreak11;
export const ONOKUN_SATOOYA_11_META = RESEARCH_PROJECTS.onokunSatooya11;
export const ONOKUN_SATOOYA_MATCH_18_META = RESEARCH_PROJECTS.onokunSatooyaMatch18;

export function getResearchVersionFields() {
  return {
    researchProject: REVOLIST_11_LIGHT_META.project,
    researchType: REVOLIST_11_LIGHT_META.type,
    diagnosisVersion: REVOLIST_11_LIGHT_META.diagnosisVersion,
    questionVersion: REVOLIST_11_LIGHT_META.questionVersion,
    logicVersion: REVOLIST_11_LIGHT_META.logicVersion,
    resultVersion: REVOLIST_11_LIGHT_META.resultVersion,
  };
}

export function getEnergyLightVersionFields() {
  return {
    researchProject: ENERGY_LIGHT_META.project,
    researchType: ENERGY_LIGHT_META.type,
    diagnosisVersion: ENERGY_LIGHT_META.diagnosisVersion,
    questionVersion: ENERGY_LIGHT_META.questionVersion,
    logicVersion: ENERGY_LIGHT_META.logicVersion,
    resultVersion: ENERGY_LIGHT_META.resultVersion,
  };
}

export function getIcebreak11VersionFields() {
  return {
    researchProject: ICEBREAK_11_META.project,
    researchType: ICEBREAK_11_META.type,
    diagnosisVersion: ICEBREAK_11_META.diagnosisVersion,
    questionVersion: ICEBREAK_11_META.questionVersion,
    logicVersion: ICEBREAK_11_META.logicVersion,
    resultVersion: ICEBREAK_11_META.resultVersion,
  };
}

export function getOnokunSatooya11VersionFields() {
  return {
    researchProject: ONOKUN_SATOOYA_11_META.project,
    researchType: ONOKUN_SATOOYA_11_META.type,
    diagnosisVersion: ONOKUN_SATOOYA_11_META.diagnosisVersion,
    questionVersion: ONOKUN_SATOOYA_11_META.questionVersion,
    logicVersion: ONOKUN_SATOOYA_11_META.logicVersion,
    resultVersion: ONOKUN_SATOOYA_11_META.resultVersion,
  };
}
