import { NextRequest, NextResponse } from "next/server";
import { addIcebreakParticipant } from "@/lib/icebreakEventStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const answers = Array.isArray(body?.answers) ? body.answers.map(Number) : [];
    const joined = addIcebreakParticipant({
      eventCode: String(body?.eventCode ?? "").toUpperCase(),
      nickname: String(body?.nickname ?? ""),
      answers,
    });

    if (!joined) {
      return NextResponse.json({ result: "not_found" }, { status: 404 });
    }

    return NextResponse.json({
      result: "success",
      participant: joined.participant,
      event: joined.event,
    });
  } catch {
    return NextResponse.json({ result: "error" }, { status: 500 });
  }
}
