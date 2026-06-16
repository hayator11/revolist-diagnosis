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
  calculateIcebreakResult,
  createIcebreakDiagnosisId,
  decodeIcebreakAnswers,
  isValidIcebreakAnswers,
} = jiti("../src/lib/calculateIcebreakResult.ts");
const {
  icebreakQuestions,
  ICEBREAK_TOTAL_QUESTIONS,
} = jiti("../src/data/icebreakQuestions.ts");

function answersForRole(role) {
  return icebreakQuestions.map((question) => (question.role === role ? 5 : 1));
}

{
  const result = calculateIcebreakResult(answersForRole("revolist"));
  assert.equal(result.mainTypeKey, "revolist");
  assert.equal(result.centerForce, "ignite");
  assert.notEqual(result.partnerTypeKey, "revolist");
}

{
  const result = calculateIcebreakResult(answersForRole("communicator"));
  assert.equal(result.mainTypeKey, "communicator");
  assert.equal(result.centerForce, "connect");
}

{
  const result = calculateIcebreakResult(Array(ICEBREAK_TOTAL_QUESTIONS).fill(3));
  assert.equal(result.roleJudgment.mode, "low_confidence");
  assert.ok(result.movementStyle.balanceGap < 3);
}

{
  const sampleAnswers = Array.from({ length: ICEBREAK_TOTAL_QUESTIONS }, (_, index) => (index % 5) + 1);
  const id = createIcebreakDiagnosisId(sampleAnswers);
  const answers = decodeIcebreakAnswers(id);
  assert.equal(isValidIcebreakAnswers(answers), true);
  assert.deepEqual(answers, sampleAnswers);
}

console.log("icebreak scoring tests passed");
