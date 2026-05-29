// Future: integrate Role / Team / Match / Growth into Revo111 full diagnosis
// Future: connect results to Revo Funding team formation
// Future: connect results to Revo Link matching
// Future: connect results to Revo Song collaboration
// Future: add user accounts and store diagnosis history

import type { RevoTypeKey } from "@/data/revotypes";
import { revoTypes } from "@/data/revotypes";
import type { MonitorDiagnosisKey } from "@/data/monitorQuestions";
import { monitorQuestionsMap } from "@/data/monitorQuestions";
import {
  roleResultText,
  teamResultText,
  matchResultText,
  growthResultText,
} from "@/data/monitorResults";

export interface MonitorTypeScore {
  key: RevoTypeKey;
  score: number;
  percentage: number;
}

// ── 共通スコア計算 ────────────────────────────────────────────────────
function calcScores(answers: number[], diagKey: MonitorDiagnosisKey): MonitorTypeScore[] {
  const questions = monitorQuestionsMap[diagKey];
  const raw: Record<RevoTypeKey, number> = {
    revolist: 0, maxdesigner: 0, imagemaister: 0, communicator: 0,
    inforader: 0, movmentor: 0, premiercrafter: 0, logicalmaister: 0,
    arranger: 0, soulowner: 0, crazist: 0,
  };

  questions.forEach((q, i) => {
    const value = answers[i] ?? 3;
    for (const [key, weight] of Object.entries(q.scores)) {
      raw[key as RevoTypeKey] += (weight as number) * value;
    }
  });

  const maxScore = Math.max(...Object.values(raw));
  return (Object.keys(raw) as RevoTypeKey[])
    .map((key) => ({
      key,
      score: raw[key],
      percentage: maxScore > 0 ? Math.round((raw[key] / maxScore) * 100) : 0,
    }))
    .sort((a, b) => b.score - a.score);
}

// ── Revo Role 結果 ────────────────────────────────────────────────────
export interface MonitorRoleResult {
  type: "role";
  main: MonitorTypeScore;
  sub: MonitorTypeScore;
  auxiliary: MonitorTypeScore;
  allScores: MonitorTypeScore[];
  // 渡しているもの（givesから）
  gives: string[];
  // 受け取ると潤うもの（receivesから）
  receives: string[];
  // 立ち位置テキスト
  positionLabel: string;
  revoFundingRole: string;
}

export function calculateRoleResult(answers: number[]): MonitorRoleResult {
  const allScores = calcScores(answers, "role");
  const [main, sub, auxiliary] = allScores;
  const mainType = revoTypes[main.key];
  return {
    type: "role",
    main, sub, auxiliary, allScores,
    gives: mainType.gives,
    receives: mainType.receives,
    positionLabel: roleResultText[main.key].position,
    revoFundingRole: roleResultText[main.key].revoFunding,
  };
}

// ── Revo Team 結果 ────────────────────────────────────────────────────
export interface MonitorTeamResult {
  type: "team";
  main: MonitorTypeScore;
  sub: MonitorTypeScore;
  auxiliary: MonitorTypeScore;
  allScores: MonitorTypeScore[];
  teamLabel: string;
  bestWith: string;
  revoFundingRole: string;
}

export function calculateTeamResult(answers: number[]): MonitorTeamResult {
  const allScores = calcScores(answers, "team");
  const [main, sub, auxiliary] = allScores;
  const text = teamResultText[main.key];
  return {
    type: "team",
    main, sub, auxiliary, allScores,
    teamLabel: text.teamLabel,
    bestWith: text.bestWith,
    revoFundingRole: text.revoFunding,
  };
}

// ── Revo Match 結果 ───────────────────────────────────────────────────
export interface MonitorMatchResult {
  type: "match";
  main: MonitorTypeScore;           // = openedByType (共通プロパティ)
  // 最もスコアが高い = 最も求めているタイプ = あなたを開花させる存在
  openedByType: MonitorTypeScore;
  // 2位 = あなたが開花させる存在（補完関係）
  youOpenType: MonitorTypeScore;
  // 3位 = 第三者効果
  thirdPartyType: MonitorTypeScore;
  allScores: MonitorTypeScore[];
  openedByDesc: string;
  youOpenDesc: string;
  thirdPartyDesc: string;
  idealCombo: string;
}

export function calculateMatchResult(answers: number[]): MonitorMatchResult {
  const allScores = calcScores(answers, "match");
  const [openedByType, youOpenType, thirdPartyType] = allScores;
  const text1 = matchResultText[openedByType.key];
  const text2 = matchResultText[youOpenType.key];
  const text3 = matchResultText[thirdPartyType.key];
  const t1 = revoTypes[openedByType.key];
  const t2 = revoTypes[youOpenType.key];
  return {
    type: "match",
    main: openedByType,
    openedByType, youOpenType, thirdPartyType, allScores,
    openedByDesc: text1.openedBy,
    youOpenDesc: text2.youOpen,
    thirdPartyDesc: text3.thirdParty,
    idealCombo: `${t1.name}と${t2.name}が組むとき、互いの役割が引き出し合い、循環が生まれます。`,
  };
}

// ── Revo Growth 結果 ──────────────────────────────────────────────────
export interface MonitorGrowthResult {
  type: "growth";
  main: MonitorTypeScore;           // = nextRole (共通プロパティ)
  // 最もスコアが高い = 次に育つ方向
  nextRole: MonitorTypeScore;
  // 2位 = 眠っている力
  sleepingRole: MonitorTypeScore;
  // 3位 = もうひとつの可能性
  thirdRole: MonitorTypeScore;
  allScores: MonitorTypeScore[];
  growthLabel: string;
  sleepingDesc: string;
  quest: string;
  activities: string[];
  future: string;
}

export function calculateGrowthResult(answers: number[]): MonitorGrowthResult {
  const allScores = calcScores(answers, "growth");
  const [nextRole, sleepingRole, thirdRole] = allScores;
  const text = growthResultText[nextRole.key];
  return {
    type: "growth",
    main: nextRole,
    nextRole, sleepingRole, thirdRole, allScores,
    growthLabel: text.growthLabel,
    sleepingDesc: text.sleepingDesc,
    quest: text.quest,
    activities: text.activities,
    future: text.future,
  };
}

export type MonitorResult =
  | MonitorRoleResult
  | MonitorTeamResult
  | MonitorMatchResult
  | MonitorGrowthResult;

// ── エンコード / デコード ─────────────────────────────────────────────
export function encodeMonitorAnswers(answers: number[]): string {
  return answers.join("-");
}

export function decodeMonitorAnswers(encoded: string): number[] {
  return encoded.split("-").map(Number);
}
