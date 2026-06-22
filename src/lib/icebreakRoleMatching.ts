import { revo111Roles } from "@/data/revo111Roles";
import {
  getCompatibility,
  type CompatibilityTier,
  type PairCompatibility,
} from "@/data/teamCompatibility";
import type { RevoTypeKey } from "@/data/revotypes";
import type { ForceKey } from "@/lib/diagnosisCore/forces";

export interface RoleMatchingParticipant {
  id?: string;
  mainTypeKey: RevoTypeKey;
  partnerTypeKey?: RevoTypeKey | null;
  centerForce: ForceKey;
}

export interface RolePairScore {
  score: number;
  reasons: string[];
  compatibility: PairCompatibility | null;
  signals: {
    partnerTypeMatch: boolean;
    futurePartnerMatch: boolean;
    compatibilityTier: CompatibilityTier | null;
    sameMainType: boolean;
    sameCenterForce: boolean;
  };
}

export interface RoleTableScore {
  score: number;
  pairScores: RolePairScore[];
  reasons: string[];
  metrics: {
    centerForceDiversity: number;
    mainTypeDiversity: number;
    participantCount: number;
  };
}

const COMPATIBILITY_SCORE: Record<CompatibilityTier, number> = {
  best: 25,
  good: 15,
  bridge: 8,
};

const PARTNER_TYPE_MATCH_SCORE = 20;
const FUTURE_PARTNER_MATCH_SCORE = 15;
const SAME_MAIN_TYPE_PENALTY = -8;
const SAME_CENTER_FORCE_PENALTY = -6;
const CENTER_FORCE_DIVERSITY_SCORE = 6;
const MAIN_TYPE_DIVERSITY_SCORE = 5;

function includesType(values: RevoTypeKey[] | undefined, typeKey: RevoTypeKey) {
  return values?.includes(typeKey) ?? false;
}

function hasPartnerTypeMatch(a: RoleMatchingParticipant, b: RoleMatchingParticipant) {
  return a.partnerTypeKey === b.mainTypeKey || b.partnerTypeKey === a.mainTypeKey;
}

function hasFuturePartnerMatch(a: RoleMatchingParticipant, b: RoleMatchingParticipant) {
  return (
    includesType(revo111Roles[a.mainTypeKey]?.futurePartners, b.mainTypeKey) ||
    includesType(revo111Roles[b.mainTypeKey]?.futurePartners, a.mainTypeKey)
  );
}

export function getRolePairScore(
  a: RoleMatchingParticipant,
  b: RoleMatchingParticipant,
): RolePairScore {
  const reasons: string[] = [];
  let score = 0;
  const compatibility = getCompatibility(a.mainTypeKey, b.mainTypeKey);
  const partnerTypeMatch = hasPartnerTypeMatch(a, b);
  const futurePartnerMatch = hasFuturePartnerMatch(a, b);
  const sameMainType = a.mainTypeKey === b.mainTypeKey;
  const sameCenterForce = a.centerForce === b.centerForce;

  if (partnerTypeMatch) {
    score += PARTNER_TYPE_MATCH_SCORE;
    reasons.push("近くにいることで会話が広がりやすい役割の組み合わせです。");
  }

  if (futurePartnerMatch) {
    score += FUTURE_PARTNER_MATCH_SCORE;
    reasons.push("これからの動き方を見つけやすい補完関係です。");
  }

  if (compatibility) {
    score += COMPATIBILITY_SCORE[compatibility.tier];
    reasons.push(compatibility.teamNote);
  }

  if (sameMainType) {
    score += SAME_MAIN_TYPE_PENALTY;
    reasons.push("近い役割同士なので、別の視点も同じ卓に入ると会話が広がります。");
  }

  if (sameCenterForce) {
    score += SAME_CENTER_FORCE_PENALTY;
    reasons.push("入口の力が近いので、違う力を持つ人も近くにいると動き方が見えやすくなります。");
  }

  if (reasons.length === 0) {
    reasons.push("違う視点が入り、会話のきっかけを作りやすい組み合わせです。");
  }

  return {
    score,
    reasons,
    compatibility,
    signals: {
      partnerTypeMatch,
      futurePartnerMatch,
      compatibilityTier: compatibility?.tier ?? null,
      sameMainType,
      sameCenterForce,
    },
  };
}

export function getRoleTableScore(participants: RoleMatchingParticipant[]): RoleTableScore {
  const pairScores: RolePairScore[] = [];
  const centerForceDiversity = new Set(participants.map((participant) => participant.centerForce)).size;
  const mainTypeDiversity = new Set(participants.map((participant) => participant.mainTypeKey)).size;

  for (let i = 0; i < participants.length; i += 1) {
    for (let j = i + 1; j < participants.length; j += 1) {
      pairScores.push(getRolePairScore(participants[i], participants[j]));
    }
  }

  const pairTotal = pairScores.reduce((total, pairScore) => total + pairScore.score, 0);
  const diversityScore =
    centerForceDiversity * CENTER_FORCE_DIVERSITY_SCORE + mainTypeDiversity * MAIN_TYPE_DIVERSITY_SCORE;
  const reasons = Array.from(new Set(pairScores.flatMap((pairScore) => pairScore.reasons))).slice(0, 4);

  if (centerForceDiversity >= Math.min(3, participants.length)) {
    reasons.unshift("違う入口の力が混ざり、初対面でも話が始まりやすい卓です。");
  }

  if (mainTypeDiversity >= Math.min(3, participants.length)) {
    reasons.unshift("同じ役割に偏らず、違う視点が会話に入りやすい卓です。");
  }

  return {
    score: pairTotal + diversityScore,
    pairScores,
    reasons,
    metrics: {
      centerForceDiversity,
      mainTypeDiversity,
      participantCount: participants.length,
    },
  };
}

export function getRoleMatchReason(a: RoleMatchingParticipant, b: RoleMatchingParticipant) {
  return getRolePairScore(a, b).reasons[0];
}
