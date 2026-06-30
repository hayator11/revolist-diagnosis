import { createSupabaseServerClient } from "@/lib/supabase/server";

const COUNTABLE_FEEDBACK_TYPES: Record<string, string> = {
  light_diagnosis: "light_diagnosis",
  research_light_result: "research_revolist_11_light_v1",
  energy_light_result: "research_revolist_energy_light_v1",
  icebreak_result: "research_icebreak_11_v1",
  revo111_result_log: "revo111_monitor_44",
};

const MONITOR_RESULT_TYPES: Record<string, string> = {
  role: "monitor_role",
  team: "monitor_team",
  match: "monitor_match",
  growth: "monitor_growth",
};

export const DIAGNOSIS_COUNTER_LABELS: Record<string, string> = {
  light_diagnosis: "レボリスト診断",
  research_revolist_11_light_v1: "リサーチ: レボリスト11",
  research_revolist_energy_light_v1: "リサーチ: エネルギーライト",
  research_icebreak_11_v1: "Icebreak 33",
  revo111_monitor_44: "Revo111 44問モニター",
  monitor_role: "Revo OS Monitor: Role",
  monitor_team: "Revo OS Monitor: Team",
  monitor_match: "Revo OS Monitor: Match",
  monitor_growth: "Revo OS Monitor: Growth",
};

export interface DiagnosisRunCounterRow {
  diagnosis_key: string;
  total_count: number;
  first_counted_at: string;
  last_counted_at: string;
  updated_at: string;
}

export interface DiagnosisRunCounterEventRow {
  id: string;
  diagnosis_key: string;
  event_type: string;
  source: string | null;
  counted_at: string;
}

export interface DiagnosisRunCounterDashboardData {
  counters: DiagnosisRunCounterRow[];
  recentEvents: DiagnosisRunCounterEventRow[];
  totalCount: number;
  todayCount: number;
  last24HoursCount: number;
}

function normalizeKey(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function getCountableDiagnosisKeyFromFeedback(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;

  const payload = body as Record<string, unknown>;
  const type = normalizeKey(payload.type);
  const formType = normalizeKey(payload.formType);

  return COUNTABLE_FEEDBACK_TYPES[type] ?? COUNTABLE_FEEDBACK_TYPES[formType] ?? null;
}

export function getCountableDiagnosisKeyFromMonitorType(type: unknown): string | null {
  return MONITOR_RESULT_TYPES[normalizeKey(type)] ?? null;
}

export async function incrementDiagnosisRunCounter({
  diagnosisKey,
  eventType,
  source,
  payload = {},
}: {
  diagnosisKey: string;
  eventType: string;
  source: string;
  payload?: Record<string, unknown>;
}) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.rpc("increment_diagnosis_run_counter", {
    p_diagnosis_key: diagnosisKey,
    p_event_type: eventType,
    p_source: source,
    p_payload: payload,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function incrementDiagnosisRunCounterSafely(args: {
  diagnosisKey: string;
  eventType: string;
  source: string;
  payload?: Record<string, unknown>;
}) {
  try {
    await incrementDiagnosisRunCounter(args);
  } catch (error) {
    console.error("Failed to increment diagnosis run counter.", error);
  }
}

function toNumber(value: unknown) {
  return typeof value === "number" ? value : Number(value ?? 0);
}

export async function getDiagnosisRunCounterDashboardData(): Promise<DiagnosisRunCounterDashboardData> {
  const supabase = createSupabaseServerClient();
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const { data: counters, error: countersError } = await supabase
    .from("diagnosis_run_counters")
    .select("diagnosis_key,total_count,first_counted_at,last_counted_at,updated_at")
    .order("total_count", { ascending: false });

  if (countersError) {
    throw new Error(countersError.message);
  }

  const { data: recentEvents, error: recentEventsError } = await supabase
    .from("diagnosis_run_counter_events")
    .select("id,diagnosis_key,event_type,source,counted_at")
    .order("counted_at", { ascending: false })
    .limit(50);

  if (recentEventsError) {
    throw new Error(recentEventsError.message);
  }

  const { count: todayCount, error: todayError } = await supabase
    .from("diagnosis_run_counter_events")
    .select("id", { count: "exact", head: true })
    .gte("counted_at", startOfToday.toISOString());

  if (todayError) {
    throw new Error(todayError.message);
  }

  const { count: last24HoursCount, error: last24HoursError } = await supabase
    .from("diagnosis_run_counter_events")
    .select("id", { count: "exact", head: true })
    .gte("counted_at", last24Hours.toISOString());

  if (last24HoursError) {
    throw new Error(last24HoursError.message);
  }

  const normalizedCounters = (counters ?? []).map((counter) => ({
    diagnosis_key: String(counter.diagnosis_key),
    total_count: toNumber(counter.total_count),
    first_counted_at: String(counter.first_counted_at),
    last_counted_at: String(counter.last_counted_at),
    updated_at: String(counter.updated_at),
  }));

  return {
    counters: normalizedCounters,
    recentEvents: (recentEvents ?? []) as DiagnosisRunCounterEventRow[],
    totalCount: normalizedCounters.reduce((sum, counter) => sum + counter.total_count, 0),
    todayCount: todayCount ?? 0,
    last24HoursCount: last24HoursCount ?? 0,
  };
}
