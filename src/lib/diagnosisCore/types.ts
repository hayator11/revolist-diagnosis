import type { ForceKey } from "./forces";

export type ForceScores<T = number> = Record<ForceKey, T>;

export type DiagnosisProjectSlug =
  | "icebreak-11-v1"
  | "revolist-11-light-v1"
  | "interview-v1";

export type DiagnosisEventType =
  | "diagnosis_start"
  | "question_answer"
  | "diagnosis_complete"
  | "result_view"
  | "share_click"
  | "feedback_submit"
  | "cta_click";

export type JudgmentMode = "focused" | "dual" | "broad";

export interface DiagnosisCoreResult {
  diagnosisId: string;
  projectSlug: DiagnosisProjectSlug;
  resultVersion: string;
  forcePct: ForceScores;
  personalMean: number;
  dev: ForceScores;
  centerForce: ForceKey;
  subForce: ForceKey;
  slotForce: ForceKey;
  judgmentMode: JudgmentMode;
  mainTypeKey: string;
  mainTypeName: string;
  dualTypeKey: string | null;
  dualTypeName: string | null;
}

export interface DiagnosisAnswerLogItem {
  questionId: string;
  questionVersion: string;
  order: number;
  questionText: string;
  answerValue: number | string;
  answerLabel?: string;
  forceKey?: ForceKey;
  roleKey?: string;
}

export interface DiagnosisBaseLogPayload {
  payloadSchemaVersion: string;
  shellId: string;
  projectSlug: DiagnosisProjectSlug;
  eventType: DiagnosisEventType;
  eventId: string;
  clientSessionId: string;
  diagnosisId?: string;
  createdAt: string;
  timestamp: string;
  diagnosisVersion: string;
  questionVersion: string;
  logicVersion: string;
  resultVersion: string;
  referrerSlug?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  pagePath?: string;
  device?: string;
}

export type DiagnosisResultLogPayload = Omit<
  DiagnosisBaseLogPayload,
  "diagnosisId" | "projectSlug" | "resultVersion"
> &
  DiagnosisCoreResult & {
  answerCount: number;
  answerDetails: DiagnosisAnswerLogItem[];
  resultUrl?: string;
  partnerSlotTypeKey?: string;
  communityInterest?: string;
  shareClicked?: boolean;
  shareMethod?: string;
};
