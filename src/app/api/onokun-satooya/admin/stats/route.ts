import { NextRequest, NextResponse } from "next/server";
import { ONOKUN_SATOOYA_11_META } from "@/data/researchProjects";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isOnokunAdminRequest } from "../../_lib/adminAuth";
import {
  getOnokunSatooyaShareCallToActionCopy,
  getOnokunSatooyaShareOpeningCopy,
  getOnokunSatooyaShareSpecialCopy,
} from "@/app/research/onokun-satooya-11-v1/_data/onokunSatooyaShareCopy";

interface OnokunResultRow {
  diagnosis_run_number: number;
  diagnosis_id: string;
  created_at: string;
  main_type_key: string;
  main_type_name: string;
  main_revo_type_key: string | null;
  sub_type_name: string;
  sub_revo_type_key: string | null;
  support_type_name: string;
  support_revo_type_key: string | null;
  cluster_name: string;
  partner_type_name: string;
  partner_revo_type_key: string | null;
  device: string | null;
  result_url: string | null;
}

interface OnokunShareEventRow {
  event_name: string;
  diagnosis_id: string;
  created_at: string;
  main_type_key: string;
  main_type_name: string;
  share_variant_id: string;
  share_variant_kind: string;
  opening_copy_id: string;
  call_to_action_copy_id: string;
  special_copy_id: string | null;
  share_channel: string | null;
  device: string | null;
}

function createRate(numerator: number, denominator: number) {
  if (denominator < 1) return 0;
  return Math.round((numerator / denominator) * 1000) / 10;
}

function aggregateTypeCounts(rows: OnokunResultRow[]) {
  const counts = new Map<string, { typeKey: string; typeName: string; count: number }>();

  rows.forEach((row) => {
    const key = row.main_type_key;
    const current = counts.get(key) ?? {
      typeKey: key,
      typeName: row.main_type_name,
      count: 0,
    };
    current.count += 1;
    counts.set(key, current);
  });

  return Array.from(counts.values()).sort((a, b) => b.count - a.count);
}

function aggregateDeviceCounts(rows: OnokunResultRow[]) {
  const counts = new Map<string, number>();

  rows.forEach((row) => {
    const key = row.device || "unknown";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });

  return Array.from(counts.entries())
    .map(([device, count]) => ({ device, count }))
    .sort((a, b) => b.count - a.count);
}

function aggregateShareVariantStats(rows: OnokunShareEventRow[]) {
  const counts = new Map<
    string,
    {
      shareVariantId: string;
      shareVariantKind: string;
      openingCopyId: string;
      openingCopy: string;
      callToActionCopyId: string;
      callToActionCopy: string;
      specialCopyId: string | null;
      specialCopy: string;
      assignedCount: number;
      shareClickCount: number;
      openChatClickCount: number;
      shareRate: number;
      openChatRate: number;
    }
  >();

  rows.forEach((row) => {
    const key = row.share_variant_id || "unknown";
    const current = counts.get(key) ?? {
      shareVariantId: key,
      shareVariantKind: row.share_variant_kind || "unknown",
      openingCopyId: row.opening_copy_id || "-",
      openingCopy: getOnokunSatooyaShareOpeningCopy(row.opening_copy_id),
      callToActionCopyId: row.call_to_action_copy_id || "-",
      callToActionCopy: getOnokunSatooyaShareCallToActionCopy(row.call_to_action_copy_id),
      specialCopyId: row.special_copy_id,
      specialCopy: getOnokunSatooyaShareSpecialCopy(row.special_copy_id),
      assignedCount: 0,
      shareClickCount: 0,
      openChatClickCount: 0,
      shareRate: 0,
      openChatRate: 0,
    };

    if (row.event_name === "share_copy_assigned") current.assignedCount += 1;
    if (row.event_name === "share_button_clicked") current.shareClickCount += 1;
    if (row.event_name === "open_chat_clicked") current.openChatClickCount += 1;
    counts.set(key, current);
  });

  return Array.from(counts.values())
    .map((item) => ({
      ...item,
      shareRate: createRate(item.shareClickCount, item.assignedCount),
      openChatRate: createRate(item.openChatClickCount, item.assignedCount),
    }))
    .sort((a, b) => b.assignedCount - a.assignedCount);
}

function aggregateShareKindStats(rows: OnokunShareEventRow[]) {
  const counts = new Map<
    string,
    {
      shareVariantKind: string;
      assignedCount: number;
      shareClickCount: number;
      openChatClickCount: number;
      shareRate: number;
      openChatRate: number;
    }
  >();

  rows.forEach((row) => {
    const key = row.share_variant_kind || "unknown";
    const current = counts.get(key) ?? {
      shareVariantKind: key,
      assignedCount: 0,
      shareClickCount: 0,
      openChatClickCount: 0,
      shareRate: 0,
      openChatRate: 0,
    };

    if (row.event_name === "share_copy_assigned") current.assignedCount += 1;
    if (row.event_name === "share_button_clicked") current.shareClickCount += 1;
    if (row.event_name === "open_chat_clicked") current.openChatClickCount += 1;
    counts.set(key, current);
  });

  return Array.from(counts.values())
    .map((item) => ({
      ...item,
      shareRate: createRate(item.shareClickCount, item.assignedCount),
      openChatRate: createRate(item.openChatClickCount, item.assignedCount),
    }))
    .sort((a, b) => b.assignedCount - a.assignedCount);
}

function aggregateShareChannelStats(rows: OnokunShareEventRow[]) {
  const counts = new Map<string, number>();

  rows
    .filter((row) => row.event_name === "share_button_clicked")
    .forEach((row) => {
      const key = row.share_channel || "unknown";
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });

  return Array.from(counts.entries())
    .map(([shareChannel, count]) => ({ shareChannel, count }))
    .sort((a, b) => b.count - a.count);
}

function createEmptyStats(setupRequired: boolean, setupReason: string | null) {
  return {
    result: "success",
    authenticated: true,
    project: ONOKUN_SATOOYA_11_META.project,
    setupRequired,
    setupReason,
    totalDiagnosisCount: 0,
    counterUpdatedAt: null,
    sampledResultCount: 0,
    sampledShareEventCount: 0,
    shareAssignedCount: 0,
    shareClickCount: 0,
    openChatClickCount: 0,
    shareRate: 0,
    openChatRate: 0,
    typeCounts: [],
    deviceCounts: [],
    shareKindStats: [],
    shareVariantStats: [],
    shareChannelStats: [],
    latestResults: [],
  };
}

function createAdminStatsResponse(body: unknown, init?: ResponseInit) {
  const response = NextResponse.json(body, init);
  response.headers.set("Cache-Control", "no-store, max-age=0");
  return response;
}

export async function GET(req: NextRequest) {
  if (!isOnokunAdminRequest(req)) {
    return createAdminStatsResponse(
      { result: "error", authenticated: false, reason: "unauthorized" },
      { status: 401 },
    );
  }

  let supabase;

  try {
    supabase = createSupabaseServerClient();
  } catch {
    return createAdminStatsResponse(
      { result: "error", authenticated: true, reason: "database_not_configured" },
      { status: 503 },
    );
  }

  const { data: counter, error: counterError } = await supabase
    .from("onokun_satooya_diagnosis_counters")
    .select("total_count, updated_at")
    .eq("project_key", ONOKUN_SATOOYA_11_META.project)
    .maybeSingle();

  if (counterError) {
    return createAdminStatsResponse(createEmptyStats(true, "counter_fetch_failed"));
  }

  const { data: rows, error: rowsError } = await supabase
    .from("onokun_satooya_diagnosis_results")
    .select(
      [
        "diagnosis_run_number",
        "diagnosis_id",
        "created_at",
        "main_type_key",
        "main_type_name",
        "main_revo_type_key",
        "sub_type_name",
        "sub_revo_type_key",
        "support_type_name",
        "support_revo_type_key",
        "cluster_name",
        "partner_type_name",
        "partner_revo_type_key",
        "device",
        "result_url",
      ].join(","),
    )
    .eq("project_key", ONOKUN_SATOOYA_11_META.project)
    .order("created_at", { ascending: false })
    .limit(500);

  if (rowsError) {
    return createAdminStatsResponse(createEmptyStats(true, "results_fetch_failed"));
  }

  const resultRows = ((rows ?? []) as unknown) as OnokunResultRow[];
  const { data: shareRows, error: shareRowsError } = await supabase
    .from("onokun_satooya_share_events")
    .select(
      [
        "event_name",
        "diagnosis_id",
        "created_at",
        "main_type_key",
        "main_type_name",
        "share_variant_id",
        "share_variant_kind",
        "opening_copy_id",
        "call_to_action_copy_id",
        "special_copy_id",
        "share_channel",
        "device",
      ].join(","),
    )
    .eq("project_key", ONOKUN_SATOOYA_11_META.project)
    .order("created_at", { ascending: false })
    .limit(1000);

  const shareEventRows = shareRowsError
    ? []
    : (((shareRows ?? []) as unknown) as OnokunShareEventRow[]);
  const shareAssignedCount = shareEventRows.filter(
    (row) => row.event_name === "share_copy_assigned",
  ).length;
  const shareClickCount = shareEventRows.filter(
    (row) => row.event_name === "share_button_clicked",
  ).length;
  const openChatClickCount = shareEventRows.filter(
    (row) => row.event_name === "open_chat_clicked",
  ).length;

  return createAdminStatsResponse({
    result: "success",
    authenticated: true,
    project: ONOKUN_SATOOYA_11_META.project,
    setupRequired: Boolean(shareRowsError),
    setupReason: shareRowsError ? "share_events_fetch_failed" : null,
    totalDiagnosisCount: Number(counter?.total_count ?? 0),
    counterUpdatedAt: counter?.updated_at ?? null,
    sampledResultCount: resultRows.length,
    sampledShareEventCount: shareEventRows.length,
    shareAssignedCount,
    shareClickCount,
    openChatClickCount,
    shareRate: createRate(shareClickCount, shareAssignedCount),
    openChatRate: createRate(openChatClickCount, shareAssignedCount),
    typeCounts: aggregateTypeCounts(resultRows),
    deviceCounts: aggregateDeviceCounts(resultRows),
    shareKindStats: aggregateShareKindStats(shareEventRows),
    shareVariantStats: aggregateShareVariantStats(shareEventRows),
    shareChannelStats: aggregateShareChannelStats(shareEventRows),
    latestResults: resultRows.slice(0, 50),
  });
}
