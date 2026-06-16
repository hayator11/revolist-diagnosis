import { NextResponse } from "next/server";
import { getIcebreakEventByCode } from "@/lib/icebreakEventStore";

interface RouteContext {
  params: Promise<{ eventCode: string }>;
}

export async function GET(_req: Request, context: RouteContext) {
  const { eventCode } = await context.params;
  const event = getIcebreakEventByCode(eventCode.toUpperCase());
  if (!event || event.status !== "open") {
    return NextResponse.json({ result: "not_found" }, { status: 404 });
  }

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
}
