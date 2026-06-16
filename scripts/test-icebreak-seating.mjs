import assert from "node:assert/strict";
import { createJiti } from "jiti";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const jiti = createJiti(import.meta.url, {
  alias: {
    "@": path.join(root, "src"),
  },
});

const {
  generateIcebreakSeating,
  findBestTableForLateParticipant,
} = jiti("../src/lib/icebreakSeating.ts");

const forces = ["ignite", "design", "connect", "structure", "care"];

function participant(index, centerForce) {
  return {
    id: `p${index}`,
    nickname: `P${index}`,
    centerForce,
    joinedAt: new Date(2026, 0, index).toISOString(),
  };
}

{
  const participants = Array.from({ length: 15 }, (_, index) => participant(index + 1, forces[index % forces.length]));
  const seating = generateIcebreakSeating(participants, 5);
  assert.equal(seating.tables.length, 3);

  for (const table of seating.tables) {
    const counts = new Map();
    for (const member of table.members) {
      counts.set(member.centerForce, (counts.get(member.centerForce) ?? 0) + 1);
    }
    for (const count of counts.values()) {
      assert.ok(count <= 2, "same center force should not appear 3+ times at a table");
    }
    const orderedIndexes = table.members.map((member) => forces.indexOf(member.centerForce));
    assert.deepEqual(orderedIndexes, orderedIndexes.slice().sort((a, b) => a - b));
  }
}

{
  const participants = [
    participant(1, "ignite"),
    participant(2, "ignite"),
    participant(3, "design"),
    participant(4, "connect"),
    participant(5, "structure"),
    participant(6, "care"),
  ];
  const seating = generateIcebreakSeating(participants, 4);
  const late = participant(7, "care");
  const table = findBestTableForLateParticipant(late, seating.tables, 4);
  assert.ok(table);
  assert.equal(table.members.some((member) => member.centerForce === "care"), false);
}

console.log("icebreak seating tests passed");
