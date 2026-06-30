import { NextRequest, NextResponse } from "next/server";
import {
  getOnokunSatooya11VersionFields,
  ONOKUN_SATOOYA_11_META,
} from "@/data/researchProjects";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  calculateOnokunSatooyaResult,
  isValidOnokunSatooyaAnswers,
} from "@/app/research/onokun-satooya-11-v1/_lib/calculateOnokunSatooyaResult";

interface OnokunResultLogRequest {
  diagnosisId?: unknown;
  answers?: unknown;
  resultUrl?: unknown;
  clientSessionId?: unknown;
  eventId?: unknown;
  payloadSchemaVersion?: unknown;
  pagePath?: unknown;
  device?: unknown;
}

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function asNumberArray(value: unknown) {
  return Array.isArray(value) ? value.map((item) => Number(item)) : [];
}

export async function POST(req: NextRequest) {
  let supabase;

  try {
    supabase = createSupabaseServerClient();
  } catch {
    return NextResponse.json({
      result: "skipped",
      saved: false,
      reason: "database_not_configured",
    });
  }

  try {
    const body = (await req.json()) as OnokunResultLogRequest;
    const answers = asNumberArray(body.answers);

    if (!isValidOnokunSatooyaAnswers(answers)) {
      return NextResponse.json(
        { result: "error", saved: false, reason: "invalid_answers" },
        { status: 400 },
      );
    }

    const resultState = calculateOnokunSatooyaResult(answers);
    const versionFields = getOnokunSatooya11VersionFields();
    const createdAt = new Date().toISOString();

    const resultPayload = {
      diagnosis_id: asString(body.diagnosisId),
      result_url: asString(body.resultUrl),
      created_at: createdAt,
      research_project: versionFields.researchProject,
      research_type: versionFields.researchType,
      diagnosis_version: versionFields.diagnosisVersion,
      question_version: versionFields.questionVersion,
      logic_version: versionFields.logicVersion,
      result_version: versionFields.resultVersion,
      client_session_id: asString(body.clientSessionId),
      event_id: asString(body.eventId),
      payload_schema_version: asString(body.payloadSchemaVersion),
      page_path: asString(body.pagePath),
      device: asString(body.device),
      answer_count: answers.length,
      answers,
      scores: resultState.scores,
      top_type_keys: resultState.topTypes.map((type) => type.key),
      main_type_key: resultState.mainType.key,
      main_type_name: resultState.mainType.name,
      sub_type_key: resultState.subType.key,
      sub_type_name: resultState.subType.name,
      support_type_key: resultState.supportType.key,
      support_type_name: resultState.supportType.name,
      cluster_key: resultState.cluster.key,
      cluster_name: resultState.cluster.name,
      partner_type_key: resultState.partnerType.key,
      partner_type_name: resultState.partnerType.name,
      evidence_highlights: resultState.evidenceHighlights,
    };

    const { data: savedRunNumber, error: saveError } = await supabase.rpc(
      "save_onokun_satooya_diagnosis_result",
      {
        p_project_key: ONOKUN_SATOOYA_11_META.project,
        p_payload: resultPayload,
      },
    );

    if (saveError) {
      return NextResponse.json(
        {
          result: "error",
          saved: false,
          reason: "database_save_failed",
        },
        { status: 500 },
      );
    }

    const diagnosisRunNumber =
      typeof savedRunNumber === "number" ? savedRunNumber : Number(savedRunNumber);

    if (!Number.isFinite(diagnosisRunNumber) || diagnosisRunNumber < 1) {
      return NextResponse.json(
        {
          result: "error",
          saved: false,
          reason: "invalid_counter_value",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      result: "success",
      saved: true,
      diagnosisRunNumber,
      totalDiagnosisCount: diagnosisRunNumber,
    });
  } catch {
    return NextResponse.json(
      { result: "error", saved: false, reason: "unexpected_error" },
      { status: 500 },
    );
  }
}
