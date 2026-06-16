import type { DiagnosisEventType, DiagnosisProjectSlug } from "./types";

export const DIAGNOSIS_CORE_PAYLOAD_SCHEMA_VERSION = "diagnosis-core-payload-v1";

export const DIAGNOSIS_SHELL_IDS: Record<DiagnosisProjectSlug, string> = {
  "icebreak-11-v1": "revo-research-icebreak-11-v1",
  "revolist-11-light-v1": "revo-research-revolist-11-light-v1",
  "interview-v1": "revo-research-interview-v1",
};

export const DIAGNOSIS_EVENT_TYPES: DiagnosisEventType[] = [
  "diagnosis_start",
  "question_answer",
  "diagnosis_complete",
  "result_view",
  "share_click",
  "feedback_submit",
  "cta_click",
];

export const DIAGNOSIS_LOG_REQUIRED_FIELDS = [
  "payloadSchemaVersion",
  "shellId",
  "projectSlug",
  "eventType",
  "eventId",
  "clientSessionId",
  "createdAt",
  "timestamp",
  "diagnosisVersion",
  "questionVersion",
  "logicVersion",
  "resultVersion",
] as const;

export const DIAGNOSIS_RESULT_REQUIRED_FIELDS = [
  ...DIAGNOSIS_LOG_REQUIRED_FIELDS,
  "diagnosisId",
  "forcePct",
  "personalMean",
  "dev",
  "centerForce",
  "subForce",
  "slotForce",
  "judgmentMode",
  "mainTypeKey",
  "mainTypeName",
] as const;
