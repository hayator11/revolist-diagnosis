import { DIAGNOSIS_SHELL_IDS } from "@/lib/diagnosisCore/logSchema";
import type { ForceKey } from "@/lib/diagnosisCore/forces";

export const ICEBREAK_EVENT_SCHEMA_VERSION = "icebreak-event-v1";

export const ICEBREAK_EVENT_TABLES = {
  events: "icebreak_events",
  participants: "icebreak_participants",
  seatingRuns: "icebreak_seating_runs",
  anonymousSummaries: "icebreak_anonymous_summaries",
} as const;

export interface IcebreakRegistrationFields {
  nickname: string;
  contact?: string | null;
  registrationMemo?: string | null;
  dataUseConsent: boolean;
}

export interface IcebreakAnonymousSummary {
  schemaVersion: typeof ICEBREAK_EVENT_SCHEMA_VERSION;
  shellId: string;
  eventCode: string;
  eventName: string;
  eventDate: string;
  participantCount: number;
  forceCombination: ForceKey[];
  tableCombination: Array<{
    tableNo: number | null;
    centerForce: ForceKey;
  }>;
}

export function createIcebreakAnonymousSummary(input: {
  eventCode: string;
  eventName: string;
  eventDate: string;
  participants: Array<{
    centerForce: ForceKey;
    tableNo: number | null;
  }>;
}): IcebreakAnonymousSummary {
  return {
    schemaVersion: ICEBREAK_EVENT_SCHEMA_VERSION,
    shellId: DIAGNOSIS_SHELL_IDS["icebreak-11-v1"],
    eventCode: input.eventCode,
    eventName: input.eventName,
    eventDate: input.eventDate,
    participantCount: input.participants.length,
    forceCombination: input.participants.map((participant) => participant.centerForce),
    tableCombination: input.participants
      .filter((participant) => participant.tableNo)
      .map((participant) => ({
        tableNo: participant.tableNo,
        centerForce: participant.centerForce,
      })),
  };
}
