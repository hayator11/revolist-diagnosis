import { NextRequest, NextResponse } from "next/server";
import {
  calculateIcebreakResult,
  isValidIcebreakAnswers,
} from "@/lib/calculateIcebreakResult";
import { normalizeIcebreakEventCode } from "@/lib/icebreakEventCode";
import {
  createOrganizerParticipant,
  getJoinableEventByEventCode,
  mapEventRowToApiEvent,
} from "@/lib/icebreakSupabaseRepository";

function isWithinNullableRange(now: Date, start: string | null, end: string | null) {
  if (start && now < new Date(start)) {
    return false;
  }

  if (end && now > new Date(end)) {
    return false;
  }

  return true;
}

function isBeforeNullableLimit(now: Date, limit: string | null) {
  return !limit || now <= new Date(limit);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const answers = Array.isArray(body?.answers) ? body.answers.map(Number) : [];

    if (!isValidIcebreakAnswers(answers)) {
      return NextResponse.json({ result: "validation_error" }, { status: 400 });
    }

    const event = await getJoinableEventByEventCode(
      normalizeIcebreakEventCode(String(body?.eventCode ?? "")),
    );

    if (!event) {
      return NextResponse.json({ result: "not_found" }, { status: 404 });
    }

    const now = new Date();
    if (
      !isWithinNullableRange(now, event.registration_open_at, event.registration_close_at) ||
      !isBeforeNullableLimit(now, event.data_delete_at)
    ) {
      return NextResponse.json({ result: "not_found" }, { status: 404 });
    }

    const nickname = String(body?.nickname ?? "").trim() || "匿名参加者";
    const result = calculateIcebreakResult(answers);
    const joinedAt = now.toISOString();
    const participant = await createOrganizerParticipant({
      eventId: event.id,
      displayName: nickname,
      answers,
      mainTypeKey: result.mainTypeKey,
      partnerTypeKey: result.partnerTypeKey,
      centerForce: result.centerForce,
      joinedAt,
      resultSummary: {
        forceScores: result.forceScores,
        forcePct: result.forcePct,
        centerForce: result.centerForce,
        subForce: result.subForce,
        slotForce: result.slotForce,
        mainTypeKey: result.mainTypeKey,
        partnerTypeKey: result.partnerTypeKey,
        thirdTypeKey: result.thirdTypeKey,
      },
    });

    const apiEvent = mapEventRowToApiEvent(event);

    return NextResponse.json({
      result: "success",
      participant: {
        id: participant.id,
        eventId: participant.event_id,
        nickname: participant.display_name,
        answers,
        forceScores: result.forceScores,
        centerForce: result.centerForce,
        subForce: result.subForce,
        judgmentMode: "focused",
        mainTypeKey: result.mainTypeKey,
        tableNo: null,
        seatNo: null,
        seatReason: null,
        joinedAt: participant.joined_at,
      },
      event: apiEvent,
    });
  } catch {
    return NextResponse.json({ result: "error" }, { status: 500 });
  }
}
