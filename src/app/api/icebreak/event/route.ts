import { NextRequest, NextResponse } from "next/server";
import {
  createIcebreakEventCode,
  ICEBREAK_EVENT_CODE_RETRY_LIMIT,
} from "@/lib/icebreakEventCode";
import { createIcebreakHostKey, createIcebreakHostKeyHash } from "@/lib/icebreakHostKey";
import { createOrganizerEvent, mapEventRowToApiEvent } from "@/lib/icebreakSupabaseRepository";

const DEFAULT_EVENT_NAME = "Icebreak 11 イベント";
const DEFAULT_TABLE_CAPACITY = 4;
const JST_OFFSET_MS = 9 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

function readEventDate(value: unknown) {
  if (typeof value !== "string") {
    return new Date().toISOString().slice(0, 10);
  }

  const matchedDate = value.match(/\d{4}-\d{2}-\d{2}/)?.[0];
  return matchedDate ?? new Date().toISOString().slice(0, 10);
}

function readTableCapacity(value: unknown) {
  const capacity = Number(value ?? DEFAULT_TABLE_CAPACITY);

  if (!Number.isFinite(capacity)) {
    return DEFAULT_TABLE_CAPACITY;
  }

  return Math.max(2, Math.min(8, capacity));
}

function createJstDateTimeIso(eventDate: string, hour: number, minute: number, second: number) {
  const utcTime = Date.UTC(
    Number(eventDate.slice(0, 4)),
    Number(eventDate.slice(5, 7)) - 1,
    Number(eventDate.slice(8, 10)),
    hour,
    minute,
    second,
  ) - JST_OFFSET_MS;

  return new Date(utcTime).toISOString();
}

function createEventDateFields(eventDate: string) {
  const registrationCloseAt = createJstDateTimeIso(eventDate, 23, 59, 59);
  const registrationOpenAt = new Date(createJstDateTimeIso(eventDate, 0, 0, 0));

  return {
    registrationOpenAt: new Date(registrationOpenAt.getTime() - 7 * DAY_MS).toISOString(),
    registrationCloseAt,
    dataDeleteAt: new Date(new Date(registrationCloseAt).getTime() + 3 * DAY_MS).toISOString(),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isEventCodeUniqueViolation(error: unknown) {
  if (!isRecord(error)) {
    return false;
  }

  const code = typeof error.code === "string" ? error.code : "";
  const message = typeof error.message === "string" ? error.message : "";
  const details = typeof error.details === "string" ? error.details : "";

  return code === "23505" && `${message} ${details}`.includes("event_code");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const eventName = String(body?.eventName ?? "").trim() || DEFAULT_EVENT_NAME;
    const eventDate = readEventDate(body?.eventDate);
    const tableCapacity = readTableCapacity(body?.tableCapacity);
    const copyVariant = typeof body?.copyVariant === "string" ? body.copyVariant : "default";
    const hostKey = createIcebreakHostKey();
    const hostKeyHash = createIcebreakHostKeyHash(hostKey);
    const eventDateFields = createEventDateFields(eventDate);

    let event = null;

    for (let attempt = 0; attempt < ICEBREAK_EVENT_CODE_RETRY_LIMIT; attempt += 1) {
      try {
        const row = await createOrganizerEvent({
          eventCode: createIcebreakEventCode(),
          hostKeyHash,
          title: eventName,
          eventDate,
          registrationOpenAt: eventDateFields.registrationOpenAt,
          registrationCloseAt: eventDateFields.registrationCloseAt,
          dataDeleteAt: eventDateFields.dataDeleteAt,
          seatsPerTable: tableCapacity,
          status: "open",
          copyVariant,
        });

        event = mapEventRowToApiEvent(row, { hostKey });
        break;
      } catch (error) {
        if (!isEventCodeUniqueViolation(error) || attempt === ICEBREAK_EVENT_CODE_RETRY_LIMIT - 1) {
          throw error;
        }
      }
    }

    if (!event) {
      throw new Error("Icebreak event creation failed.");
    }

    return NextResponse.json({
      result: "success",
      event,
      participantUrl: `/research/icebreak-11-v1?event=${event.eventCode}`,
      hostUrl: `/research/icebreak-11-v1/host?key=${event.hostKey}`,
    });
  } catch {
    return NextResponse.json({ result: "error" }, { status: 500 });
  }
}
