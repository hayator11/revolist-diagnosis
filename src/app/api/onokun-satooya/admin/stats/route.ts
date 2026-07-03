import { NextRequest, NextResponse } from "next/server";
import { ONOKUN_SATOOYA_11_META } from "@/data/researchProjects";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isOnokunAdminRequest } from "../../_lib/adminAuth";

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
    typeCounts: [],
    deviceCounts: [],
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

  return createAdminStatsResponse({
    result: "success",
    authenticated: true,
    project: ONOKUN_SATOOYA_11_META.project,
    setupRequired: false,
    setupReason: null,
    totalDiagnosisCount: Number(counter?.total_count ?? 0),
    counterUpdatedAt: counter?.updated_at ?? null,
    sampledResultCount: resultRows.length,
    typeCounts: aggregateTypeCounts(resultRows),
    deviceCounts: aggregateDeviceCounts(resultRows),
    latestResults: resultRows.slice(0, 50),
  });
}
