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
