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
  sub_type_name: string;
  support_type_name: string;
  cluster_name: string;
  partner_type_name: string;
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

export async function GET(req: NextRequest) {
  if (!isOnokunAdminRequest(req)) {
    return NextResponse.json(
      { result: "error", authenticated: false, reason: "unauthorized" },
      { status: 401 },
    );
  }

  let supabase;

  try {
    supabase = createSupabaseServerClient();
  } catch {
    return NextResponse.json(
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
    return NextResponse.json(
      { result: "error", authenticated: true, reason: "counter_fetch_failed" },
      { status: 500 },
    );
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
        "sub_type_name",
        "support_type_name",
        "cluster_name",
        "partner_type_name",
        "device",
        "result_url",
      ].join(","),
    )
    .eq("project_key", ONOKUN_SATOOYA_11_META.project)
    .order("created_at", { ascending: false })
    .limit(500);

  if (rowsError) {
    return NextResponse.json(
      { result: "error", authenticated: true, reason: "results_fetch_failed" },
      { status: 500 },
    );
  }

  const resultRows = ((rows ?? []) as unknown) as OnokunResultRow[];

  return NextResponse.json({
    result: "success",
    authenticated: true,
    project: ONOKUN_SATOOYA_11_META.project,
    totalDiagnosisCount: Number(counter?.total_count ?? 0),
    counterUpdatedAt: counter?.updated_at ?? null,
    sampledResultCount: resultRows.length,
    typeCounts: aggregateTypeCounts(resultRows),
    deviceCounts: aggregateDeviceCounts(resultRows),
    latestResults: resultRows.slice(0, 50),
  });
}
