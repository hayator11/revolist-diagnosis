import { NextResponse } from "next/server";
import { createIcebreakHostKeyHash } from "@/lib/icebreakHostKey";
import {
  getLatestOrganizerSeatingByEventId,
  getOrganizerEventByHostKeyHash,
  getOrganizerParticipantsByEventId,
  mapEventRowToApiEvent,
  type IcebreakOrganizerParticipantRow,
} from "@/lib/icebreakSupabaseRepository";
import type { ForceKey } from "@/lib/diagnosisCore/forces";

interface RouteContext {
  params: Promise<{ hostKey: string }>;
}

function readResultSummaryForce(row: IcebreakOrganizerParticipantRow, key: "subForce") {
  const summary = row.result_summary;
  const value = summary && typeof summary[key] === "string" ? summary[key] : null;
  return (value ?? row.center_force ?? "ignite") as ForceKey;
}

function mapParticipantRow(row: IcebreakOrganizerParticipantRow) {
  return {
    id: row.id,
    nickname: row.display_name,
    centerForce: (row.center_force ?? "ignite") as ForceKey,
    subForce: readResultSummaryForce(row, "subForce"),
    tableNo: null,
    seatNo: null,
    seatReason: null,
    joinedAt: row.joined_at,
  };
}

function readTables(value: unknown) {
  return Array.isArray(value) ? value : [];
}

export async function GET(_req: Request, context: RouteContext) {
  const { hostKey } = await context.params;
  try {
    const hostKeyHash = createIcebreakHostKeyHash(hostKey);
    const row = await getOrganizerEventByHostKeyHash(hostKeyHash);
    if (!row) {
      return NextResponse.json({ result: "not_found" }, { status: 404 });
    }

    const [participantRows, seatingRow] = await Promise.all([
      getOrganizerParticipantsByEventId(row.id),
      getLatestOrganizerSeatingByEventId(row.id),
    ]);

    return NextResponse.json({
      result: "success",
      event: mapEventRowToApiEvent(row, { hostKey }),
      participants: participantRows.map(mapParticipantRow),
      tables: readTables(seatingRow?.tables),
    });
  } catch {
    return NextResponse.json({ result: "error" }, { status: 500 });
  }
}
