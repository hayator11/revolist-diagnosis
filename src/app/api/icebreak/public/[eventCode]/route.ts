import { NextResponse } from "next/server";
import {
  getPublicEventByEventCode,
  mapEventRowToApiEvent,
} from "@/lib/icebreakSupabaseRepository";
import { normalizeIcebreakEventCode } from "@/lib/icebreakEventCode";

interface RouteContext {
  params: Promise<{ eventCode: string }>;
}

export async function GET(_req: Request, context: RouteContext) {
  const { eventCode } = await context.params;
  try {
    const row = await getPublicEventByEventCode(normalizeIcebreakEventCode(eventCode));
    if (!row) {
      return NextResponse.json({ result: "not_found" }, { status: 404 });
    }

    const event = mapEventRowToApiEvent(row);

    return NextResponse.json({
      result: "success",
      event: {
        eventCode: event.eventCode,
        eventName: event.eventName,
        eventDate: event.eventDate,
        layoutType: event.layoutType,
        tableCapacity: event.tableCapacity,
        status: event.status,
      },
    });
  } catch {
    return NextResponse.json({ result: "error" }, { status: 500 });
  }
}
