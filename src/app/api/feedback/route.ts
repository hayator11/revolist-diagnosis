import { NextRequest, NextResponse } from "next/server";

const DEFAULT_GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxTRMnBqTzZINQVIzx9RCWrXR5t5n90NJ8sj_0XE-zIgUM2wDTDWDsQlPCVOD-GVN8x/exec";

const REVO111_GOOGLE_SCRIPT_URL =
  process.env.REVO111_GOOGLE_SCRIPT_URL ??
  "https://script.google.com/macros/s/AKfycbxLzHXLhiySPhLEatJjTIdMfrXaR3UVvP7Gx9thLNaKHWSn0tyFpI9C9ZIKUjOOxm-j/exec";

const REVO111_TYPES = new Set([
  "revo111_result_log",
  "revo111_monitor_feedback",
]);

function getGoogleScriptUrl(type: unknown) {
  return typeof type === "string" && REVO111_TYPES.has(type)
    ? REVO111_GOOGLE_SCRIPT_URL
    : DEFAULT_GOOGLE_SCRIPT_URL;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const googleScriptUrl = getGoogleScriptUrl(body?.type);

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
  } catch (err) {
    return NextResponse.json({ result: "error" }, { status: 500 });
  }
}
