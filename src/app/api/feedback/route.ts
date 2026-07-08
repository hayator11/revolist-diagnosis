import { NextRequest, NextResponse } from "next/server";
import {
  getCountableDiagnosisKeyFromFeedback,
  incrementDiagnosisRunCounterSafely,
} from "@/lib/diagnosisRunCounter";

const DEFAULT_GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxTRMnBqTzZINQVIzx9RCWrXR5t5n90NJ8sj_0XE-zIgUM2wDTDWDsQlPCVOD-GVN8x/exec";

const REVO111_GOOGLE_SCRIPT_URL =
  process.env.REVO111_GOOGLE_SCRIPT_URL ??
  "https://script.google.com/macros/s/AKfycbxLzHXLhiySPhLEatJjTIdMfrXaR3UVvP7Gx9thLNaKHWSn0tyFpI9C9ZIKUjOOxm-j/exec";

const REVO111_TYPES = new Set([
  "revo111_result_log",
  "revo111_monitor_feedback",
  "research_light_answer",
  "research_light_result",
  "research_light_feedback",
  "energy_light_answer",
  "energy_light_result",
  "energy_light_feedback",
  "icebreak_answer",
  "icebreak_result",
  "icebreak_feedback",
  "icebreak_share",
  "light_diagnosis",
  "monitor_44",
  "community_survey",
]);

function readText(value: unknown) {
  return typeof value === "string" ? value : null;
}

function readStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function createCounterPayload(body: Record<string, unknown>) {
  return {
    type: readText(body.type),
    formType: readText(body.formType),
    diagnosisId: readText(body.diagnosisId),
    diagnosisType: readText(body.diagnosisType),
    mainRoleKey: readText(body.mainRoleKey),
    mainRoleName: readText(body.mainRoleName),
    subRoleKey: readText(body.subRoleKey),
    subRoleName: readText(body.subRoleName),
    supportRoleKey: readText(body.supportRoleKey),
    supportRoleName: readText(body.supportRoleName),
    fitAnswer: readText(body.fitAnswer),
    questionIssueAnswers: readStringArray(body.questionIssueAnswers),
    resultCopyAnswers: readStringArray(body.resultCopyAnswers),
    nextInterestAnswers: readStringArray(body.nextInterestAnswers),
    freeComment: readText(body.freeComment),
    impressionText: readText(body.impressionText),
    discomfortText: readText(body.discomfortText),
    improvementRequestText: readText(body.improvementRequestText),
    pagePath: readText(body.pagePath),
  };
}

function getGoogleScriptUrl(type: unknown, formType: unknown) {
  const key = typeof type === "string" ? type : formType;

  return typeof key === "string" && REVO111_TYPES.has(key)
    ? REVO111_GOOGLE_SCRIPT_URL
    : DEFAULT_GOOGLE_SCRIPT_URL;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const googleScriptUrl = getGoogleScriptUrl(body?.type, body?.formType);
    const diagnosisKey = getCountableDiagnosisKeyFromFeedback(body);

    if (diagnosisKey) {
      await incrementDiagnosisRunCounterSafely({
        diagnosisKey,
        eventType:
          diagnosisKey === "entry_diagnosis_feedback" ? "feedback_submit" : "diagnosis_complete",
        source: "feedback-api",
        payload: createCounterPayload(body),
      });
    }

    const response = await fetch(googleScriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { result: "error", status: response.status },
        { status: 502 },
      );
    }

    return NextResponse.json({ result: "success" });
  } catch {
    return NextResponse.json({ result: "error" }, { status: 500 });
  }
}
