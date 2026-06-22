import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { IcebreakLayoutType, IcebreakEventStatus } from "@/lib/icebreakEventStore";

export type IcebreakOrganizerEventStatus = "draft" | "open" | "closed" | "deleted";

export interface IcebreakOrganizerEventRow {
  id: string;
  created_at: string;
  updated_at: string;
  event_code: string;
  host_key_hash: string | null;
  title: string;
  event_date: string | null;
  event_start_at: string | null;
  event_end_at: string | null;
  registration_open_at: string | null;
  registration_close_at: string | null;
  data_delete_at: string | null;
  expected_seats: number | null;
  table_count: number | null;
  seats_per_table: number | null;
  status: IcebreakOrganizerEventStatus;
  copy_variant: string;
}

export interface IcebreakOrganizerParticipantRow {
  id: string;
  event_id: string;
  created_at: string;
  display_name: string;
  answers: number[];
  main_type_key: string;
  partner_type_key: string | null;
  center_force: string | null;
  result_summary: Record<string, unknown> | null;
  joined_at: string;
  deleted_at: string | null;
}

export interface IcebreakOrganizerSeatingRow {
  id: string;
  event_id: string;
  created_at: string;
  generated_at: string;
  algorithm_version: string | null;
  tables: unknown;
  table_reasons: unknown | null;
  notes: string | null;
  deleted_at: string | null;
}

export interface IcebreakOrganizerAggregateStatsRow {
  id: string;
  created_at: string;
  event_hash: string | null;
  event_month: string | null;
  participant_count: number | null;
  main_type_distribution: Record<string, unknown> | null;
  partner_type_distribution: Record<string, unknown> | null;
  center_force_distribution: Record<string, unknown> | null;
  answer_summary: Record<string, unknown> | null;
  table_force_patterns: Record<string, unknown> | null;
  table_role_patterns: Record<string, unknown> | null;
  validation_fit_summary: Record<string, unknown> | null;
}

export interface CreateOrganizerEventInput {
  eventCode: string;
  hostKeyHash: string;
  title: string;
  eventDate?: string | null;
  eventStartAt?: string | null;
  eventEndAt?: string | null;
  registrationOpenAt?: string | null;
  registrationCloseAt?: string | null;
  dataDeleteAt?: string | null;
  expectedSeats?: number | null;
  tableCount?: number | null;
  seatsPerTable?: number | null;
  status?: IcebreakOrganizerEventStatus;
  copyVariant?: string;
}

export interface CreateOrganizerParticipantInput {
  eventId: string;
  displayName: string;
  answers: number[];
  mainTypeKey: string;
  partnerTypeKey: string;
  centerForce: string;
  resultSummary?: Record<string, unknown> | null;
  joinedAt?: string;
}

export interface CreateOrganizerSeatingInput {
  eventId: string;
  algorithmVersion: string;
  tables: unknown;
  tableReasons?: unknown | null;
  notes?: string | null;
  generatedAt?: string;
}

export interface IcebreakOrganizerApiEvent {
  id: string;
  eventCode: string;
  hostKey?: string;
  eventName: string;
  layoutType: IcebreakLayoutType;
  tableCapacity: number;
  copyVariant: string;
  createdAt: string;
  eventDate: string;
  status: IcebreakEventStatus;
  expiresAt: string;
}

const EVENTS_TABLE = "icebreak_events";
const PARTICIPANTS_TABLE = "icebreak_event_participants";
const SEATINGS_TABLE = "icebreak_event_seatings";

function toLegacyEventStatus(status: IcebreakOrganizerEventStatus): IcebreakEventStatus {
  return status === "open" ? "open" : "closed";
}

export function mapEventRowToApiEvent(
  row: IcebreakOrganizerEventRow,
  options: { hostKey?: string } = {},
): IcebreakOrganizerApiEvent {
  return {
    id: row.id,
    eventCode: row.event_code,
    hostKey: options.hostKey,
    eventName: row.title,
    layoutType: "island",
    tableCapacity: row.seats_per_table ?? 4,
    copyVariant: row.copy_variant,
    createdAt: row.created_at,
    eventDate: row.event_date ?? row.created_at.slice(0, 10),
    status: toLegacyEventStatus(row.status),
    expiresAt: row.data_delete_at ?? "",
  };
}

export async function createOrganizerEvent(input: CreateOrganizerEventInput) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from(EVENTS_TABLE)
    .insert({
      event_code: input.eventCode,
      host_key_hash: input.hostKeyHash,
      title: input.title,
      event_date: input.eventDate ?? null,
      event_start_at: input.eventStartAt ?? null,
      event_end_at: input.eventEndAt ?? null,
      registration_open_at: input.registrationOpenAt ?? null,
      registration_close_at: input.registrationCloseAt ?? null,
      data_delete_at: input.dataDeleteAt ?? null,
      expected_seats: input.expectedSeats ?? null,
      table_count: input.tableCount ?? null,
      seats_per_table: input.seatsPerTable ?? null,
      status: input.status ?? "open",
      copy_variant: input.copyVariant ?? "default",
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as IcebreakOrganizerEventRow;
}

export async function getOrganizerEventByHostKeyHash(hostKeyHash: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from(EVENTS_TABLE)
    .select("*")
    .eq("host_key_hash", hostKeyHash)
    .neq("status", "deleted")
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data ?? null) as IcebreakOrganizerEventRow | null;
}

export async function getPublicEventByEventCode(eventCode: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from(EVENTS_TABLE)
    .select("*")
    .eq("event_code", eventCode)
    .eq("status", "open")
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data ?? null) as IcebreakOrganizerEventRow | null;
}

export async function getJoinableEventByEventCode(eventCode: string) {
  return getPublicEventByEventCode(eventCode);
}

export async function createOrganizerParticipant(input: CreateOrganizerParticipantInput) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from(PARTICIPANTS_TABLE)
    .insert({
      event_id: input.eventId,
      display_name: input.displayName,
      answers: input.answers,
      main_type_key: input.mainTypeKey,
      partner_type_key: input.partnerTypeKey,
      center_force: input.centerForce,
      result_summary: input.resultSummary ?? null,
      joined_at: input.joinedAt ?? new Date().toISOString(),
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as IcebreakOrganizerParticipantRow;
}

export async function getOrganizerParticipantsByEventId(eventId: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from(PARTICIPANTS_TABLE)
    .select("*")
    .eq("event_id", eventId)
    .is("deleted_at", null)
    .order("joined_at", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as IcebreakOrganizerParticipantRow[];
}

export async function getLatestOrganizerSeatingByEventId(eventId: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from(SEATINGS_TABLE)
    .select("*")
    .eq("event_id", eventId)
    .is("deleted_at", null)
    .order("generated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data ?? null) as IcebreakOrganizerSeatingRow | null;
}

export async function createOrganizerSeating(input: CreateOrganizerSeatingInput) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from(SEATINGS_TABLE)
    .insert({
      event_id: input.eventId,
      generated_at: input.generatedAt ?? new Date().toISOString(),
      algorithm_version: input.algorithmVersion,
      tables: input.tables,
      table_reasons: input.tableReasons ?? null,
      notes: input.notes ?? null,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as IcebreakOrganizerSeatingRow;
}
