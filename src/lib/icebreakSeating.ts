import { FORCE_KEYS, FORCE_LABELS, type ForceKey } from "@/lib/diagnosisCore/forces";

export interface SeatingParticipant {
  id: string;
  nickname: string;
  centerForce: ForceKey;
  joinedAt: string;
}

export interface SeatedParticipant extends SeatingParticipant {
  tableNo: number;
  seatNo: number;
  reason: string;
}

export interface SeatingTable {
  tableNo: number;
  tableName: string;
  members: SeatedParticipant[];
  isCompleteForceSet: boolean;
}

export interface SeatingResult {
  tables: SeatingTable[];
}

const FORCE_TABLE_NAMES: Record<ForceKey, string> = {
  ignite: "火種テーブル",
  design: "構想テーブル",
  connect: "つながりテーブル",
  structure: "設計テーブル",
  care: "安心テーブル",
};

function countForce(members: SeatingParticipant[], force: ForceKey) {
  return members.filter((member) => member.centerForce === force).length;
}

function createReason(member: SeatingParticipant, members: SeatingParticipant[]) {
  const index = members.findIndex((candidate) => candidate.id === member.id);
  const next = members[(index + 1) % members.length];
  if (!next || next.id === member.id) {
    return `${FORCE_LABELS[member.centerForce]}を入口に、今日の会話を始めてみてください。`;
  }

  return `隣は${next.nickname}さん。${FORCE_LABELS[member.centerForce]}と${FORCE_LABELS[next.centerForce]}が近くにあることで、会話が次の一歩へ流れやすくなります。`;
}

export function createIcebreakTableName(members: SeatingParticipant[]) {
  const forceCounts = FORCE_KEYS.map((force) => ({
    force,
    count: countForce(members, force),
  })).sort((a, b) => b.count - a.count || FORCE_KEYS.indexOf(a.force) - FORCE_KEYS.indexOf(b.force));

  return FORCE_TABLE_NAMES[forceCounts[0]?.force ?? "ignite"];
}

export function hasCompleteForceSet(members: SeatingParticipant[]) {
  const forceSet = new Set(members.map((member) => member.centerForce));
  return FORCE_KEYS.every((force) => forceSet.has(force));
}

export function generateIcebreakSeating(
  participants: SeatingParticipant[],
  tableCapacity: number,
): SeatingResult {
  const safeCapacity = Math.max(2, tableCapacity || 4);
  const tableCount = Math.max(1, Math.ceil(participants.length / safeCapacity));
  const tables: SeatingParticipant[][] = Array.from({ length: tableCount }, () => []);
  const byForce = Object.fromEntries(FORCE_KEYS.map((force) => [force, [] as SeatingParticipant[]])) as Record<
    ForceKey,
    SeatingParticipant[]
  >;

  participants
    .slice()
    .sort((a, b) => a.joinedAt.localeCompare(b.joinedAt))
    .forEach((participant) => {
      byForce[participant.centerForce].push(participant);
    });

  for (const force of FORCE_KEYS) {
    let tableIndex = 0;
    for (const participant of byForce[force]) {
      const rankedTables = tables
        .map((members, index) => ({ members, index }))
        .filter(({ members }) => members.length < safeCapacity)
        .sort((a, b) => {
          const forceDiff = countForce(a.members, force) - countForce(b.members, force);
          if (forceDiff !== 0) return forceDiff;

          const sizeDiff = a.members.length - b.members.length;
          if (sizeDiff !== 0) return sizeDiff;

          return ((a.index - tableIndex + tableCount) % tableCount) - ((b.index - tableIndex + tableCount) % tableCount);
        });
      const target = rankedTables[0] ?? { members: tables[tableIndex % tableCount], index: tableIndex % tableCount };
      target.members.push(participant);
      tableIndex = target.index + 1;
    }
  }

  return {
    tables: tables.map((members, tableIndex) => {
      const orderedMembers = members
        .slice()
        .sort(
          (a, b) =>
            FORCE_KEYS.indexOf(a.centerForce) - FORCE_KEYS.indexOf(b.centerForce) ||
            a.joinedAt.localeCompare(b.joinedAt),
        );
      return {
        tableNo: tableIndex + 1,
        tableName: createIcebreakTableName(orderedMembers),
        isCompleteForceSet: hasCompleteForceSet(orderedMembers),
        members: orderedMembers.map((member, memberIndex) => ({
          ...member,
          tableNo: tableIndex + 1,
          seatNo: memberIndex + 1,
          reason: createReason(member, orderedMembers),
        })),
      };
    }),
  };
}

export function findBestTableForLateParticipant(
  participant: SeatingParticipant,
  currentTables: SeatingTable[],
  tableCapacity: number,
) {
  const safeCapacity = Math.max(2, tableCapacity || 4);
  const candidates = currentTables
    .filter((table) => table.members.length < safeCapacity)
    .map((table) => {
      const sameForceCount = table.members.filter((member) => member.centerForce === participant.centerForce).length;
      const hasForce = table.members.some((member) => member.centerForce === participant.centerForce);
      const sizeScore = table.members.length / safeCapacity;

      return {
        table,
        score: sameForceCount * 10 + (hasForce ? 4 : 0) + sizeScore,
      };
    })
    .sort((a, b) => a.score - b.score || a.table.tableNo - b.table.tableNo);

  return candidates[0]?.table ?? currentTables[0] ?? null;
}
