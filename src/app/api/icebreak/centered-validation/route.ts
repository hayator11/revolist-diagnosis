import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const TEXT_MAX = 2000;
const DIAGNOSIS_ID_MAX = 200;
const RESULT_URL_MAX = 1000;

type ValidationRow = {
  diagnosis_id: string | null;
  result_url: string | null;
  fit_score: number;
  self_like_text: string;
  discomfort_text: string;
  conversation_use_score: number;
  matching_use_score: number;
  want_to_know_text: string | null;
  free_comment: string | null;
  self_type_text: string | null;
  others_say_text: string | null;
  hard_question_text: string | null;
  neutral_reason_text: string | null;
  matching_resistance: string | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readOptionalText(
  body: Record<string, unknown>,
  key: string,
  maxLength = TEXT_MAX,
): string | null {
  const value = body[key];

  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "string") {
    throw new Error("validation_error");
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return null;
  }

  if (trimmed.length > maxLength) {
    throw new Error("validation_error");
  }

  return trimmed;
}

function readRequiredText(body: Record<string, unknown>, key: string): string {
  const value = readOptionalText(body, key);

  if (!value) {
    throw new Error("validation_error");
  }

  return value;
}

function readScore(body: Record<string, unknown>, key: string): number {
  const value = body[key];

  if (typeof value !== "number" || !Number.isInteger(value) || value < 1 || value > 5) {
    throw new Error("validation_error");
  }

  return value;
}

function parseValidationRow(body: unknown): ValidationRow {
  if (!isRecord(body)) {
    throw new Error("validation_error");
  }

  const diagnosisId = readOptionalText(body, "diagnosis_id", DIAGNOSIS_ID_MAX);
  const resultUrl = readOptionalText(body, "result_url", RESULT_URL_MAX);

  if (!diagnosisId && !resultUrl) {
    throw new Error("validation_error");
  }

  return {
    diagnosis_id: diagnosisId,
    result_url: resultUrl,
    fit_score: readScore(body, "fit_score"),
    self_like_text: readRequiredText(body, "self_like_text"),
    discomfort_text: readRequiredText(body, "discomfort_text"),
    conversation_use_score: readScore(body, "conversation_use_score"),
    matching_use_score: readScore(body, "matching_use_score"),
    want_to_know_text: readOptionalText(body, "want_to_know_text"),
    free_comment: readOptionalText(body, "free_comment"),
    self_type_text: readOptionalText(body, "self_type_text"),
    others_say_text: readOptionalText(body, "others_say_text"),
    hard_question_text: readOptionalText(body, "hard_question_text"),
    neutral_reason_text: readOptionalText(body, "neutral_reason_text"),
    matching_resistance: readOptionalText(body, "matching_resistance"),
  };
}

export async function POST(req: NextRequest) {
  let row: ValidationRow;

  try {
    row = parseValidationRow(await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "validation_error" }, { status: 400 });
  }

  try {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase
      .from("icebreak_centered_validation_feedback")
      .insert(row);

    if (error) {
      return NextResponse.json({ ok: false, error: "save_failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
