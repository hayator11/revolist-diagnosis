import { calculateIcebreakResult } from "@/lib/calculateIcebreakResult";
import {
  createIcebreakTableName,
  generateIcebreakSeating,
  hasCompleteForceSet,
  type SeatingTable,
} from "@/lib/icebreakSeating";
import type { ForceScores } from "@/lib/diagnosisCore/types";
import type { ForceKey } from "@/lib/diagnosisCore/forces";
import { createIcebreakAnonymousSummary } from "@/lib/icebreakEventSchema";

export type IcebreakLayoutType = "island" | "uchi" | "round" | "pair";
export type IcebreakEventStatus = "open" | "closed";

export interface IcebreakEventRecord {
  id: string;
  eventCode: string;
  hostKey: string;
  eventName: string;
  layoutType: IcebreakLayoutType;
  tableCapacity: number;
  copyVariant: string;
  createdAt: string;
  eventDate: string;
  status: IcebreakEventStatus;
  expiresAt: string;
}

export interface IcebreakParticipantRecord {
  id: string;
  eventId: string;
  nickname: string;
  answers: number[];
  forceScores: ForceScores;
  centerForce: ForceKey;
  subForce: ForceKey;
  judgmentMode: "focused";
  mainTypeKey: string;
  tableNo: number | null;
  seatNo: number | null;
  seatReason: string | null;
  joinedAt: string;
}

interface IcebreakStore {
  events: Map<string, IcebreakEventRecord>;
  eventCodeIndex: Map<string, string>;
  hostKeyIndex: Map<string, string>;
  participants: Map<string, IcebreakParticipantRecord>;
}

const STORE_KEY = "__revolistIcebreakStore";
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function getStore(): IcebreakStore {
  const globalStore = globalThis as typeof globalThis & { [STORE_KEY]?: IcebreakStore };
  if (!globalStore[STORE_KEY]) {
    globalStore[STORE_KEY] = {
      events: new Map(),
      eventCodeIndex: new Map(),
      hostKeyIndex: new Map(),
      participants: new Map(),
    };
  }

  return globalStore[STORE_KEY];
}

function randomId() {
  return crypto.randomUUID();
}

function randomCode(length: number) {
  return Array.from({ length }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join("");
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function createIcebreakEvent(input: {
  eventName: string;
  eventDate?: string;
  layoutType?: IcebreakLayoutType;
  tableCapacity?: number;
  copyVariant?: string;
}) {
  const store = getStore();
  let eventCode = randomCode(6);
  while (store.eventCodeIndex.has(eventCode)) eventCode = randomCode(6);

  const id = randomId();
  const hostKey = randomId().replaceAll("-", "") + randomId().replaceAll("-", "");
  const now = new Date();
  const eventDate = input.eventDate || now.toISOString().slice(0, 10);
  const eventDateObj = new Date(`${eventDate}T23:59:59.000Z`);
  const record: IcebreakEventRecord = {
    id,
    eventCode,
    hostKey,
    eventName: input.eventName.trim() || "Icebreak 11 イベント",
    layoutType: input.layoutType ?? "island",
    tableCapacity: Math.max(2, Math.min(8, input.tableCapacity ?? 4)),
    copyVariant: input.copyVariant ?? "default",
    createdAt: now.toISOString(),
    eventDate,
    status: "open",
    expiresAt: addDays(eventDateObj, 7).toISOString(),
  };

  store.events.set(id, record);
  store.eventCodeIndex.set(eventCode, id);
  store.hostKeyIndex.set(hostKey, id);

  return record;
}

export function getIcebreakEventByCode(eventCode: string) {
  const store = getStore();
  const eventId = store.eventCodeIndex.get(eventCode.toUpperCase());
  return eventId ? store.events.get(eventId) ?? null : null;
}

export function getIcebreakEventByHostKey(hostKey: string) {
  const store = getStore();
  const eventId = store.hostKeyIndex.get(hostKey);
  return eventId ? store.events.get(eventId) ?? null : null;
}

export function getIcebreakParticipants(eventId: string) {
  return Array.from(getStore().participants.values()).filter((participant) => participant.eventId === eventId);
}

export function addIcebreakParticipant(input: {
  eventCode: string;
  nickname: string;
  answers: number[];
}) {
  const event = getIcebreakEventByCode(input.eventCode);
  if (!event || event.status !== "open") return null;

  const result = calculateIcebreakResult(input.answers);
  const participant: IcebreakParticipantRecord = {
    id: randomId(),
    eventId: event.id,
    nickname: input.nickname.trim() || "匿名参加者",
    answers: input.answers,
    forceScores: result.forcePct,
    centerForce: result.centerForce,
    subForce: result.subForce,
    judgmentMode: "focused",
    mainTypeKey: result.mainTypeKey,
    tableNo: null,
    seatNo: null,
    seatReason: null,
    joinedAt: new Date().toISOString(),
  };

  getStore().participants.set(participant.id, participant);
  return { participant, event, result };
}

export function generateIcebreakEventSeating(hostKey: string) {
  const event = getIcebreakEventByHostKey(hostKey);
  if (!event) return null;

  const participants = getIcebreakParticipants(event.id);
  const seating = generateIcebreakSeating(
    participants.map((participant) => ({
      id: participant.id,
      nickname: participant.nickname,
      centerForce: participant.centerForce,
      joinedAt: participant.joinedAt,
    })),
    event.tableCapacity,
  );

  for (const table of seating.tables) {
    for (const member of table.members) {
      const participant = getStore().participants.get(member.id);
      if (participant) {
        participant.tableNo = member.tableNo;
        participant.seatNo = member.seatNo;
        participant.seatReason = member.reason;
      }
    }
  }

  return { event, participants: getIcebreakParticipants(event.id), seating };
}

export function getIcebreakEventSnapshot(hostKey: string) {
  const event = getIcebreakEventByHostKey(hostKey);
  if (!event) return null;
  const participants = getIcebreakParticipants(event.id);
  const tables = participants.some((participant) => participant.tableNo)
    ? participants
        .reduce<SeatingTable[]>((acc, participant) => {
          if (!participant.tableNo || !participant.seatNo) return acc;
          let table = acc.find((candidate) => candidate.tableNo === participant.tableNo);
          if (!table) {
            table = {
              tableNo: participant.tableNo,
              tableName: `Table ${participant.tableNo}`,
              isCompleteForceSet: false,
              members: [],
            };
            acc.push(table);
          }
          table.members.push({
            id: participant.id,
            nickname: participant.nickname,
            centerForce: participant.centerForce,
            joinedAt: participant.joinedAt,
            tableNo: participant.tableNo,
            seatNo: participant.seatNo,
            reason: participant.seatReason ?? "",
          });
          return acc;
        }, [])
        .map((table) => ({
          ...table,
          tableName: createIcebreakTableName(table.members),
          isCompleteForceSet: hasCompleteForceSet(table.members),
          members: table.members.sort((a, b) => a.seatNo - b.seatNo),
        }))
    : [];

  return { event, participants, tables };
}

export function resetIcebreakEvent(hostKey: string) {
  const store = getStore();
  const event = getIcebreakEventByHostKey(hostKey);
  if (!event) return null;
  const participants = getIcebreakParticipants(event.id);
  const anonymousSummary = createIcebreakAnonymousSummary({
    eventCode: event.eventCode,
    eventName: event.eventName,
    eventDate: event.eventDate,
    participants,
  });

  for (const participant of participants) {
    store.participants.delete(participant.id);
  }
  store.events.delete(event.id);
  store.eventCodeIndex.delete(event.eventCode);
  store.hostKeyIndex.delete(event.hostKey);

  return { anonymousSummary };
}
