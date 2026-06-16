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
  addIcebreakParticipant,
  createIcebreakEvent,
  generateIcebreakEventSeating,
  getIcebreakEventSnapshot,
  resetIcebreakEvent,
} = jiti("../src/lib/icebreakEventStore.ts");
const {
  ICEBREAK_TOTAL_QUESTIONS,
} = jiti("../src/data/icebreakQuestions.ts");

const event = createIcebreakEvent({
  eventName: "テストイベント",
  eventDate: "2026-06-14",
  layoutType: "island",
  tableCapacity: 4,
});

assert.equal(event.eventCode.length, 6);
assert.ok(event.hostKey.length >= 32);

const joined = addIcebreakParticipant({
  eventCode: event.eventCode,
  nickname: "テスト参加者",
  answers: Array.from({ length: ICEBREAK_TOTAL_QUESTIONS }, (_, index) => (index % 5) + 1),
});

assert.ok(joined);
const snapshot = getIcebreakEventSnapshot(event.hostKey);
assert.equal(snapshot?.participants.length, 1);
assert.equal(snapshot?.participants[0].nickname, "テスト参加者");

const seating = generateIcebreakEventSeating(event.hostKey);
assert.equal(seating?.participants.length, 1);
assert.equal(seating?.participants[0].tableNo, 1);

const reset = resetIcebreakEvent(event.hostKey);
assert.ok(reset);
assert.equal(JSON.stringify(reset.anonymousSummary).includes("テスト参加者"), false);
assert.equal(JSON.stringify(reset.anonymousSummary).includes(event.hostKey), false);
assert.equal(getIcebreakEventSnapshot(event.hostKey), null);

console.log("icebreak event store tests passed");
