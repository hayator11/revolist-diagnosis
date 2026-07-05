import { NextRequest, NextResponse } from "next/server";
import { ONOKUN_SATOOYA_11_META } from "@/data/researchProjects";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ShareEventName = "share_copy_assigned" | "share_button_clicked" | "open_chat_clicked";
type ShareVariantKind = "normal" | "lucky" | "funny";
type ShareChannel = "x" | "line" | "native" | "copy" | "open_chat";

interface ShareEventRequest {
  eventName?: unknown;
  diagnosisId?: unknown;
  resultUrl?: unknown;
  clientSessionId?: unknown;
  eventId?: unknown;
  payloadSchemaVersion?: unknown;
  pagePath?: unknown;
  device?: unknown;
  mainTypeKey?: unknown;
  mainTypeName?: unknown;
  mainRevoTypeKey?: unknown;
  shareVariantId?: unknown;
  shareVariantKind?: unknown;
  openingCopyId?: unknown;
  callToActionCopyId?: unknown;
  specialCopyId?: unknown;
  shareChannel?: unknown;
}

const VALID_EVENT_NAMES = new Set<ShareEventName>([
  "share_copy_assigned",
  "share_button_clicked",
  "open_chat_clicked",
]);

const VALID_VARIANT_KINDS = new Set<ShareVariantKind>(["normal", "lucky", "funny"]);
const VALID_SHARE_CHANNELS = new Set<ShareChannel>(["x", "line", "native", "copy", "open_chat"]);

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function asNullableString(value: unknown) {
  const stringValue = asString(value);
  return stringValue || null;
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
    const body = (await req.json()) as ShareEventRequest;
    const eventName = asString(body.eventName) as ShareEventName;
    const shareVariantKind = asString(body.shareVariantKind) as ShareVariantKind;
    const shareChannel = asString(body.shareChannel) as ShareChannel;

    if (!VALID_EVENT_NAMES.has(eventName)) {
      return NextResponse.json(
        { result: "error", saved: false, reason: "invalid_event_name" },
        { status: 400 },
      );
    }

    if (!VALID_VARIANT_KINDS.has(shareVariantKind)) {
      return NextResponse.json(
        { result: "error", saved: false, reason: "invalid_share_variant_kind" },
        { status: 400 },
      );
    }

    if (shareChannel && !VALID_SHARE_CHANNELS.has(shareChannel)) {
      return NextResponse.json(
        { result: "error", saved: false, reason: "invalid_share_channel" },
        { status: 400 },
      );
    }

    const { error } = await supabase.from("onokun_satooya_share_events").insert({
      project_key: ONOKUN_SATOOYA_11_META.project,
      event_name: eventName,
      diagnosis_id: asString(body.diagnosisId),
      result_url: asNullableString(body.resultUrl),
      created_at: new Date().toISOString(),
      client_session_id: asNullableString(body.clientSessionId),
      event_id: asNullableString(body.eventId),
      payload_schema_version: asNullableString(body.payloadSchemaVersion),
      page_path: asNullableString(body.pagePath),
      device: asNullableString(body.device),
      main_type_key: asString(body.mainTypeKey),
      main_type_name: asString(body.mainTypeName),
      main_revo_type_key: asNullableString(body.mainRevoTypeKey),
      share_variant_id: asString(body.shareVariantId),
      share_variant_kind: shareVariantKind,
      opening_copy_id: asString(body.openingCopyId),
      call_to_action_copy_id: asString(body.callToActionCopyId),
      special_copy_id: asNullableString(body.specialCopyId),
      share_channel: shareChannel || null,
    });

    if (error) {
      return NextResponse.json(
        { result: "error", saved: false, reason: "database_save_failed" },
        { status: 500 },
      );
    }

    return NextResponse.json({ result: "success", saved: true });
  } catch {
    return NextResponse.json(
      { result: "error", saved: false, reason: "unexpected_error" },
      { status: 500 },
    );
  }
}
