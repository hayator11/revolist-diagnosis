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
  calculateResearchLightResult,
} = jiti("../src/lib/calculateResearchLightResult.ts");

function approx(actual, expected, delta = 0.11) {
  assert.ok(
    Math.abs(actual - expected) <= delta,
    `expected ${actual} to be within ${delta} of ${expected}`,
  );
}

function answerSet(defaultValue, overrides) {
  const answers = Array.from({ length: 21 }, () => defaultValue);
  for (const [questionNumber, value] of Object.entries(overrides)) {
    answers[Number(questionNumber) - 1] = value;
  }
  return answers;
}

{
  const result = calculateResearchLightResult(Array.from({ length: 21 }, () => 5));
  assert.equal(result.mode, "broad");
  assert.equal(result.centerForce, "ignite");
  assert.equal(result.slotForce, "ignite");
  for (const force of ["ignite", "design", "connect", "structure", "care"]) {
    assert.equal(result.forcePct[force], 100);
    assert.equal(result.dev[force], 0);
  }
}

{
  const result = calculateResearchLightResult([
    5, 5, 5, 5, 5, 5, 4, 3, 3, 3, 5, 5, 5, 5, 5, 5, 5, 3, 3, 3, 5,
  ]);
  approx(result.forcePct.ignite, 100);
  approx(result.forcePct.design, 100);
  approx(result.forcePct.connect, 66.67);
  approx(result.forcePct.structure, 84);
  approx(result.forcePct.care, 86.67);
  approx(result.personalMean, 87.47);
  approx(result.dev.ignite, 12.53);
  approx(result.dev.design, 12.53);
  approx(result.dev.connect, -20.8);
  approx(result.dev.structure, -3.47);
  approx(result.dev.care, -0.8);
  assert.equal(result.centerForce, "ignite");
  assert.equal(result.subForce, "design");
  assert.equal(result.slotForce, "connect");
  assert.equal(result.mode, "dual");
  assert.equal(result.mainType.key, "revolist");
  assert.equal(result.dualType?.key, "maxdesigner");
  assert.equal(result.partnerSlotTypeKey, "communicator");
}

{
  const result = calculateResearchLightResult(Array.from({ length: 21 }, () => 3));
  assert.equal(result.mode, "broad");
  assert.equal(result.centerForce, "ignite");
  for (const force of ["ignite", "design", "connect", "structure", "care"]) {
    assert.equal(result.forcePct[force], 60);
    assert.equal(result.dev[force], 0);
  }
}

{
  const result = calculateResearchLightResult(answerSet(2, {
    9: 5,
    10: 5,
    15: 5,
    16: 5,
    17: 5,
  }));
  assert.equal(result.mode, "focused");
  assert.equal(result.centerForce, "structure");
  assert.equal(result.mainType.key, "inforader");
  assert.equal(result.slotForce, "ignite");
  assert.equal(result.partnerSlotTypeKey, "revolist");
}

{
  const connect = calculateResearchLightResult(answerSet(2, {
    7: 3,
    8: 3,
    17: 5,
    18: 5,
  }));
  assert.equal(connect.centerForce, "connect");
  assert.equal(
    connect.familyDetail.connect.candidates.some((candidate) => candidate.roleKey === "arranger"),
    true,
  );

  const structure = calculateResearchLightResult(answerSet(2, {
    9: 5,
    10: 5,
    15: 5,
    16: 5,
    17: 5,
    18: 2,
  }));
  assert.equal(structure.centerForce, "structure");
  assert.equal(
    structure.familyDetail.structure.candidates.some((candidate) => candidate.roleKey === "arranger"),
    true,
  );
}

{
  const result = calculateResearchLightResult(Array.from({ length: 21 }, () => 5));
  assert.equal(result.mainType.key, "revolist");
  assert.equal(result.slotForce, "ignite");
  assert.equal(result.partnerSlotTypeKey, "crazist");
}

console.log("research light scoring tests passed");
