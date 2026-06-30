import { NextRequest, NextResponse } from "next/server";
import {
  getCountableDiagnosisKeyFromMonitorType,
  incrementDiagnosisRunCounter,
} from "@/lib/diagnosisRunCounter";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const diagnosisKey =
      typeof body?.diagnosisKey === "string"
        ? body.diagnosisKey
        : getCountableDiagnosisKeyFromMonitorType(body?.monitorType);

    if (!diagnosisKey) {
      return NextResponse.json(
        { result: "error", message: "diagnosisKey is required." },
        { status: 400 },
      );
    }

    await incrementDiagnosisRunCounter({
      diagnosisKey,
      eventType: typeof body?.eventType === "string" ? body.eventType : "diagnosis_complete",
      source: typeof body?.source === "string" ? body.source : "diagnosis-run-counter-api",
      payload: {
        diagnosisId: typeof body?.diagnosisId === "string" ? body.diagnosisId : null,
        monitorType: typeof body?.monitorType === "string" ? body.monitorType : null,
      },
    });

    return NextResponse.json({ result: "success" });
  } catch {
    return NextResponse.json({ result: "error" }, { status: 500 });
  }
}
