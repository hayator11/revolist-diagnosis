import { NextRequest, NextResponse } from "next/server";
import { resetIcebreakEvent } from "@/lib/icebreakEventStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = resetIcebreakEvent(String(body?.hostKey ?? ""));

    if (!result) {
      return NextResponse.json({ result: "not_found" }, { status: 404 });
    }

    return NextResponse.json({ result: "success", ...result });
  } catch {
    return NextResponse.json({ result: "error" }, { status: 500 });
  }
}
