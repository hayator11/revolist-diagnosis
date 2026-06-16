import { NextRequest, NextResponse } from "next/server";

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
