import { NextRequest, NextResponse } from "next/server";
import { createIcebreakEvent } from "@/lib/icebreakEventStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const event = createIcebreakEvent({
      eventName: String(body?.eventName ?? ""),
      eventDate: typeof body?.eventDate === "string" ? body.eventDate : undefined,
      layoutType: body?.layoutType,
      tableCapacity: Number(body?.tableCapacity ?? 4),
      copyVariant: typeof body?.copyVariant === "string" ? body.copyVariant : undefined,
    });

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
