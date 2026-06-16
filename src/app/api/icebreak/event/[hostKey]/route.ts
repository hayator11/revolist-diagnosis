import { NextResponse } from "next/server";
import { getIcebreakEventSnapshot } from "@/lib/icebreakEventStore";

interface RouteContext {
  params: Promise<{ hostKey: string }>;
}

export async function GET(_req: Request, context: RouteContext) {
  const { hostKey } = await context.params;
  const snapshot = getIcebreakEventSnapshot(hostKey);
  if (!snapshot) {
    return NextResponse.json({ result: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ result: "success", ...snapshot });
}
