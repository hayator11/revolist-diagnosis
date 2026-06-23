import { NextRequest, NextResponse } from "next/server";
import type { RevoTypeKey } from "@/data/revotypes";
import type { ForceKey } from "@/lib/diagnosisCore/forces";
import { createIcebreakHostKeyHash } from "@/lib/icebreakHostKey";
import { generateIcebreakRoleAwareSeating, type SeatingResult } from "@/lib/icebreakSeating";
import {
  createOrganizerSeating,
  getOrganizerEventByHostKeyHash,
  getOrganizerParticipantsByEventId,
  mapEventRowToApiEvent,
  type IcebreakOrganizerParticipantRow,
} from "@/lib/icebreakSupabaseRepository";

const SEATING_ALGORITHM_VERSION = "icebreak-seating-role-aware-v1";

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
    mainTypeKey: row.main_type_key as RevoTypeKey,
    partnerTypeKey: row.partner_type_key as RevoTypeKey | null,
    tableNo: null as number | null,
    seatNo: null as number | null,
    seatReason: null as string | null,
    joinedAt: row.joined_at,
  };
}

function addSeatingToParticipants(
  participants: ReturnType<typeof mapParticipantRow>[],
  seating: SeatingResult,
) {
  const seatByParticipantId = new Map(
    seating.tables.flatMap((table) =>
      table.members.map((member) => [
        member.id,
        {
          tableNo: member.tableNo,
          seatNo: member.seatNo,
          seatReason: member.reason,
        },
      ]),
    ),
  );

  return participants.map((participant) => ({
    ...participant,
    ...(seatByParticipantId.get(participant.id) ?? {}),
  }));
}

function createTableReasons(seating: SeatingResult) {
  return seating.tables.map((table) => ({
    tableNo: table.tableNo,
    tableName: table.tableName,
    isCompleteForceSet: table.isCompleteForceSet,
    memberCount: table.members.length,
  }));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const hostKey = String(body?.hostKey ?? "").trim();

    if (!hostKey) {
      return NextResponse.json({ result: "not_found" }, { status: 404 });
    }

    const hostKeyHash = createIcebreakHostKeyHash(hostKey);
    const eventRow = await getOrganizerEventByHostKeyHash(hostKeyHash);

    if (!eventRow) {
      return NextResponse.json({ result: "not_found" }, { status: 404 });
    }

    const participantRows = await getOrganizerParticipantsByEventId(eventRow.id);

    if (participantRows.length === 0) {
      return NextResponse.json({ result: "validation_error" }, { status: 400 });
    }

    const participants = participantRows.map(mapParticipantRow);
    const seating = generateIcebreakRoleAwareSeating(
      participants.map((participant) => ({
        id: participant.id,
        nickname: participant.nickname,
        centerForce: participant.centerForce,
        mainTypeKey: participant.mainTypeKey,
        partnerTypeKey: participant.partnerTypeKey,
        subForce: participant.subForce,
        joinedAt: participant.joinedAt,
      })),
      eventRow.seats_per_table ?? 4,
    );

    await createOrganizerSeating({
      eventId: eventRow.id,
      algorithmVersion: SEATING_ALGORITHM_VERSION,
      tables: seating.tables,
      tableReasons: createTableReasons(seating),
    });

    return NextResponse.json({
      result: "success",
      event: mapEventRowToApiEvent(eventRow, { hostKey }),
      participants: addSeatingToParticipants(participants, seating),
      seating,
    });
  } catch {
    return NextResponse.json({ result: "error" }, { status: 500 });
  }
}
