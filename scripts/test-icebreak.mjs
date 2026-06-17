import assert from "node:assert/strict";
import fs from "node:fs";
import { createJiti } from "jiti";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const feedbackRoutePath = path.join(root, "src/app/api/feedback/route.ts");
const jiti = createJiti(import.meta.url, {
  alias: {
    "@": path.join(root, "src"),
  },
});

const {
  adaptIcebreakQuestionsToCentered,
  calculateIcebreakParallelResult,
  calculateIcebreakResult,
  createCenteredResultSummary,
  createIcebreakDiagnosisId,
  decodeIcebreakAnswers,
  isValidIcebreakAnswers,
} = jiti("../src/lib/calculateIcebreakResult.ts");
const {
  icebreakQuestions,
  ICEBREAK_TOTAL_QUESTIONS,
} = jiti("../src/data/icebreakQuestions.ts");
const {
  answerToCentered,
} = jiti("../src/lib/diagnosisCore/multiAxis.ts");
const {
  calculateMultiAxisRoleResultCentered,
} = jiti("../src/lib/calculateMultiAxisRoleResult.ts");
const {
  ICEBREAK_CENTERED_WEIGHT_OVERRIDES,
} = jiti("../src/lib/diagnosisCore/icebreakCenteredWeights.ts");

function answersForRole(role) {
  return icebreakQuestions.map((question) => (question.role === role ? 5 : 1));
}

function answersWithOnly(questionId, value) {
  return icebreakQuestions.map((question) => (question.id === questionId ? value : 3));
}

function answersWithQuestionSet(questionIds, targetValue, otherValue) {
  const targetIds = new Set(questionIds);
  return icebreakQuestions.map((question) => (targetIds.has(question.id) ? targetValue : otherValue));
}

function allScoresNearZero(scores) {
  return Object.values(scores).every((score) => Math.abs(score) < 0.000001);
}

function assertCenteredSummaryShape(summary) {
  const expectedSummaryKeys = [
    "centeredAnswerMean",
    "centeredAnswerSpread",
    "zeroAnswerCount",
    "hasNegativeScore",
    "centeredTopRole",
    "centeredBottomRole",
    "centeredTopForce",
    "centeredBottomForce",
  ];

  assert.deepEqual(Object.keys(summary), expectedSummaryKeys);
  assert.equal(typeof summary.centeredAnswerMean, "number");
  assert.equal(typeof summary.centeredAnswerSpread, "number");
  assert.equal(typeof summary.zeroAnswerCount, "number");
  assert.equal(typeof summary.hasNegativeScore, "boolean");
  assert.equal(typeof summary.centeredTopRole.key, "string");
  assert.equal(typeof summary.centeredTopRole.score, "number");
  assert.equal(typeof summary.centeredBottomRole.key, "string");
  assert.equal(typeof summary.centeredBottomRole.score, "number");
  assert.equal(typeof summary.centeredTopForce.key, "string");
  assert.equal(typeof summary.centeredTopForce.score, "number");
  assert.equal(typeof summary.centeredBottomForce.key, "string");
  assert.equal(typeof summary.centeredBottomForce.score, "number");
}

const experimentalWeightExpectations = {
  ice33_q01: {
    positiveAxis: "socialBridge",
    opposingAxis: "evidenceSeeking",
    positiveRole: "communicator",
    opposingRole: "logicalmaister",
    positiveForce: "connect",
    opposingForce: "structure",
  },
  ice33_q03: {
    positiveAxis: "executionDrive",
    opposingAxis: "maintenanceDrive",
    positiveRole: "revolist",
    opposingRole: "premiercrafter",
    positiveForce: "ignite",
    opposingForce: "care",
  },
  ice33_q04: {
    positiveAxis: "psychologicalSafety",
    positiveRole: "soulowner",
    positiveForce: "care",
    additionalPositiveAxes: ["encouragement"],
    noAdditionalNegativeWeights: true,
  },
  ice33_q05: {
    positiveAxis: "possibilityDesign",
    opposingAxis: "maintenanceDrive",
    positiveRole: "maxdesigner",
    opposingRole: "premiercrafter",
    additionalOpposingRoles: ["inforader"],
    positiveForce: "design",
    opposingForce: "care",
  },
  ice33_q06: {
    positiveAxis: "systemizing",
    opposingAxis: "socialBridge",
    positiveRole: "logicalmaister",
    opposingRole: "communicator",
    positiveForce: "structure",
    opposingForce: "connect",
  },
  ice33_q07: {
    positiveAxis: "encouragement",
    opposingAxis: "systemizing",
    positiveRole: "movmentor",
    opposingRole: "inforader",
    additionalOpposingRoles: ["logicalmaister"],
    positiveForce: "care",
    opposingForce: "structure",
  },
  ice33_q08: {
    positiveAxis: "coordination",
    positiveRole: "arranger",
    positiveForce: "connect",
    additionalPositiveAxes: ["socialBridge"],
    noAdditionalNegativeWeights: true,
  },
  ice33_q10: {
    positiveAxis: "nonconformity",
    opposingAxis: "coordination",
    positiveRole: "crazist",
    opposingRole: "arranger",
    positiveForce: "ignite",
    opposingForce: "structure",
  },
  ice33_q11: {
    positiveAxis: "expressionDrive",
    opposingAxis: "evidenceSeeking",
    positiveRole: "imagemaister",
    opposingRole: "inforader",
    positiveForce: "design",
    opposingForce: "structure",
  },
  ice33_q12: {
    positiveAxis: "socialBridge",
    opposingAxis: "expressionDrive",
    positiveRole: "communicator",
    opposingRole: "imagemaister",
    additionalPositiveAxes: ["coordination"],
    positiveForce: "connect",
    opposingForce: "design",
  },
  ice33_q15: {
    positiveAxis: "psychologicalSafety",
    positiveRole: "soulowner",
    positiveForce: "care",
    additionalPositiveAxes: ["socialBridge", "encouragement"],
    noAdditionalNegativeWeights: true,
  },
  ice33_q16: {
    positiveAxis: "possibilityDesign",
    opposingAxis: "socialBridge",
    positiveRole: "maxdesigner",
    opposingRole: "communicator",
    positiveForce: "design",
    opposingForce: "connect",
  },
  ice33_q17: {
    positiveAxis: "systemizing",
    positiveRole: "logicalmaister",
    positiveForce: "structure",
    additionalPositiveAxes: ["expressionDrive"],
    noAdditionalNegativeWeights: true,
  },
  ice33_q18: {
    positiveAxis: "encouragement",
    opposingAxis: "craftQuality",
    positiveRole: "movmentor",
    opposingRole: "premiercrafter",
    additionalPositiveAxes: ["socialBridge"],
    additionalOpposingRoles: ["logicalmaister"],
    positiveForce: "care",
    opposingForce: "structure",
  },
  ice33_q22: {
    positiveAxis: "expressionDrive",
    opposingAxis: "coordination",
    positiveRole: "imagemaister",
    opposingRole: "arranger",
    positiveForce: "design",
    opposingForce: "connect",
  },
  ice33_q23: {
    positiveAxis: "socialBridge",
    opposingAxis: "possibilityDesign",
    positiveRole: "communicator",
    opposingRole: "maxdesigner",
    additionalPositiveAxes: ["psychologicalSafety", "encouragement"],
    positiveForce: "connect",
    opposingForce: "design",
  },
  ice33_q24: {
    positiveAxis: "evidenceSeeking",
    opposingAxis: "publicVisibility",
    positiveRole: "inforader",
    opposingRole: "revolist",
    additionalOpposingRoles: ["crazist"],
    positiveForce: "structure",
    opposingForce: "ignite",
  },
  ice33_q26: {
    positiveAxis: "psychologicalSafety",
    opposingAxis: "publicVisibility",
    positiveRole: "soulowner",
    opposingRole: "revolist",
    positiveForce: "care",
    opposingForce: "ignite",
  },
  ice33_q27: {
    positiveAxis: "possibilityDesign",
    positiveRole: "maxdesigner",
    positiveForce: "design",
    additionalPositiveAxes: ["expressionDrive"],
    noAdditionalNegativeWeights: true,
  },
  ice33_q29: {
    positiveAxis: "encouragement",
    positiveRole: "movmentor",
    positiveForce: "care",
    additionalPositiveAxes: ["executionDrive"],
    noAdditionalNegativeWeights: true,
  },
  ice33_q30: {
    positiveAxis: "coordination",
    opposingAxis: "nonconformity",
    positiveRole: "arranger",
    opposingRole: "crazist",
    additionalOpposingRoles: ["revolist"],
    positiveForce: "connect",
    opposingForce: "ignite",
  },
  ice33_q31: {
    positiveAxis: "craftQuality",
    opposingAxis: "executionDrive",
    positiveRole: "premiercrafter",
    opposingRole: "revolist",
    positiveForce: "care",
    opposingForce: "ignite",
  },
  ice33_q32: {
    positiveAxis: "nonconformity",
    positiveRole: "crazist",
    positiveForce: "ignite",
    noAdditionalNegativeWeights: true,
  },
  ice33_q33: {
    positiveAxis: "expressionDrive",
    positiveRole: "imagemaister",
    positiveForce: "design",
    additionalPositiveAxes: ["possibilityDesign", "socialBridge"],
    noAdditionalNegativeWeights: true,
  },
};

const experimentalQuestionIds = Object.keys(experimentalWeightExpectations);

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

{
  assert.equal(answerToCentered(1), -2);
  assert.equal(answerToCentered(2), -1);
  assert.equal(answerToCentered(3), 0);
  assert.equal(answerToCentered(4), 1);
  assert.equal(answerToCentered(5), 2);
  assert.equal(answerToCentered(2.5), 0);
  assert.equal(answerToCentered(0), 0);
  assert.equal(answerToCentered(Number.NaN), 0);
}

{
  const result = calculateMultiAxisRoleResultCentered(
    [
      {
        id: "centered_test_positive",
        text: "positive",
        weights: [{ axis: "noveltyDrive", weight: 1 }],
        roleWeights: [{ role: "revolist", weight: 1 }],
        forceWeights: [{ force: "ignite", weight: 1 }],
      },
      {
        id: "centered_test_negative",
        text: "negative",
        weights: [{ axis: "systemizing", weight: -2 }],
        roleWeights: [{ role: "logicalmaister", weight: -1 }],
        forceWeights: [{ force: "structure", weight: -1 }],
      },
      {
        id: "centered_test_zero",
        text: "zero",
        weights: [{ axis: "socialBridge", weight: 3 }],
        roleWeights: [{ role: "communicator", weight: 2 }],
        forceWeights: [{ force: "connect", weight: 2 }],
      },
    ],
    [5, 5, 3],
  );

  assert.deepEqual(result.rawAnswers, [5, 5, 3]);
  assert.deepEqual(result.centeredAnswers, [2, 2, 0]);
  assert.equal(result.axisScores.noveltyDrive, 2);
  assert.equal(result.axisScores.systemizing, -4);
  assert.equal(result.axisScores.socialBridge, 0);
  assert.equal(result.roleScores.logicalmaister, -2);
  assert.equal(result.forceScores.structure, -2);
  assert.equal(result.zeroAnswerIndexes.length, 1);
  assert.equal(result.zeroAnswerIndexes[0], 2);
  assert.equal(result.zeroAnswerCount, 1);
  assert.equal(result.centeredAnswerMean, 4 / 3);
  assert.ok(result.centeredAnswerSpread > 0);
  assert.equal(result.hasNegativeScore, true);
  assert.equal(result.invalidAnswerCount, 0);
}

{
  const answers = answersForRole("revolist");
  const { legacyResult, centeredResult } = calculateIcebreakParallelResult(answers);
  assert.equal(legacyResult.mainTypeKey, "revolist");
  assert.equal(legacyResult.centerForce, "ignite");
  assert.equal(centeredResult.rawAnswers.length, ICEBREAK_TOTAL_QUESTIONS);
  assert.equal(centeredResult.centeredAnswers.length, ICEBREAK_TOTAL_QUESTIONS);
  assert.equal(typeof centeredResult.zeroAnswerCount, "number");
  assert.equal(typeof centeredResult.centeredAnswerMean, "number");
  assert.equal(typeof centeredResult.centeredAnswerSpread, "number");
}

{
  const centeredQuestions = adaptIcebreakQuestionsToCentered();
  assert.equal(centeredQuestions.length, ICEBREAK_TOTAL_QUESTIONS);
  assert.deepEqual(centeredQuestions[0].weights, icebreakQuestions[0].weights);
  assert.equal(centeredQuestions[0].role, icebreakQuestions[0].role);
  assert.equal(centeredQuestions[0].force, icebreakQuestions[0].force);
}

{
  const normalQuestions = adaptIcebreakQuestionsToCentered();
  const experimentalQuestions = adaptIcebreakQuestionsToCentered({ includeExperimentalWeights: true });

  assert.equal(Object.keys(ICEBREAK_CENTERED_WEIGHT_OVERRIDES).length, 24);
  assert.deepEqual(Object.keys(ICEBREAK_CENTERED_WEIGHT_OVERRIDES), experimentalQuestionIds);

  for (const targetId of Object.keys(experimentalWeightExpectations)) {
    const normalQuestion = normalQuestions.find((question) => question.id === targetId);
    const experimentalQuestion = experimentalQuestions.find((question) => question.id === targetId);
    assert.ok(normalQuestion);
    assert.ok(experimentalQuestion);
    assert.equal(
      normalQuestion.weights.length,
      icebreakQuestions.find((question) => question.id === targetId)?.weights.length,
    );
    assert.equal(
      experimentalQuestion.weights.length,
      normalQuestion.weights.length + ICEBREAK_CENTERED_WEIGHT_OVERRIDES[targetId].axisWeights.length,
    );
    assert.equal(experimentalQuestion.roleWeights.length, ICEBREAK_CENTERED_WEIGHT_OVERRIDES[targetId].roleWeights.length);
    assert.equal(experimentalQuestion.forceWeights.length, ICEBREAK_CENTERED_WEIGHT_OVERRIDES[targetId].forceWeights.length);
  }

  for (const targetId of ["ice33_q05", "ice33_q07", "ice33_q12", "ice33_q16", "ice33_q18", "ice33_q22", "ice33_q23"]) {
    const override = ICEBREAK_CENTERED_WEIGHT_OVERRIDES[targetId];
    assert.equal(override.roleWeights?.some((item) => item.weight < 0 && ["revolist", "crazist"].includes(item.role)), false);
    assert.equal(override.forceWeights?.some((item) => item.weight < 0 && item.force === "ignite"), false);
  }

  for (const targetId of ["ice33_q04", "ice33_q12", "ice33_q16", "ice33_q22", "ice33_q23", "ice33_q33"]) {
    const override = ICEBREAK_CENTERED_WEIGHT_OVERRIDES[targetId];
    assert.equal(
      override.roleWeights?.some(
        (item) =>
          item.weight < 0 &&
          ["revolist", "crazist", "inforader", "logicalmaister", "premiercrafter"].includes(item.role),
      ),
      false,
    );
    assert.equal(
      override.forceWeights?.some((item) => item.weight < 0 && ["ignite", "structure", "care"].includes(item.force)),
      false,
    );
  }

  for (const targetId of ["ice33_q04", "ice33_q08", "ice33_q15", "ice33_q17", "ice33_q27", "ice33_q29", "ice33_q32", "ice33_q33"]) {
    const override = ICEBREAK_CENTERED_WEIGHT_OVERRIDES[targetId];
    assert.equal(override.axisWeights.length, 0);
    assert.equal(override.roleWeights.length, 0);
    assert.equal(override.forceWeights.length, 0);
  }

  assert.deepEqual(ICEBREAK_CENTERED_WEIGHT_OVERRIDES.ice33_q16.axisWeights, [
    { axis: "socialBridge", weight: -0.1 },
  ]);
  assert.deepEqual(ICEBREAK_CENTERED_WEIGHT_OVERRIDES.ice33_q16.roleWeights, [
    { role: "communicator", weight: -0.1 },
  ]);
  assert.deepEqual(ICEBREAK_CENTERED_WEIGHT_OVERRIDES.ice33_q16.forceWeights, [
    { force: "connect", weight: -0.1 },
  ]);
}

{
  const emptyOverrideQuestionIds = ["ice33_q04", "ice33_q08", "ice33_q15", "ice33_q17", "ice33_q27", "ice33_q29", "ice33_q32", "ice33_q33"];
  assert.equal(emptyOverrideQuestionIds.length, 8);
  const positive = calculateIcebreakParallelResult(answersWithQuestionSet(emptyOverrideQuestionIds, 5, 3));
  const negative = calculateIcebreakParallelResult(answersWithQuestionSet(emptyOverrideQuestionIds, 1, 3));

  assert.deepEqual(positive.legacyResult, calculateIcebreakResult(answersWithQuestionSet(emptyOverrideQuestionIds, 5, 3)));
  assert.equal(positive.centeredResult.hasNegativeScore, false);
  assert.equal(positive.centeredResult.minAxisScore, 0);
  assert.equal(positive.centeredResult.minRoleScore, 0);
  assert.ok(positive.centeredResult.minForceScore >= 0);
  assert.ok(positive.centeredResult.forceScores.care > 0);
  assert.ok(positive.centeredResult.forceScores.connect > 0);
  assert.ok(positive.centeredResult.forceScores.design > 0);
  assert.ok(positive.centeredResult.forceScores.ignite > 0);
  assert.ok(positive.centeredResult.forceScores.structure > 0);

  assert.deepEqual(negative.legacyResult, calculateIcebreakResult(answersWithQuestionSet(emptyOverrideQuestionIds, 1, 3)));
  assert.equal(negative.centeredResult.hasNegativeScore, true);
  assert.ok(negative.centeredResult.forceScores.care < 0);
  assert.ok(negative.centeredResult.forceScores.design < 0);
}

{
  const { legacyResult, centeredResult } = calculateIcebreakParallelResult(
    Array(ICEBREAK_TOTAL_QUESTIONS).fill(3),
  );
  const summary = createCenteredResultSummary(centeredResult);

  assert.equal(legacyResult.roleJudgment.mode, "low_confidence");
  assert.equal(centeredResult.zeroAnswerCount, ICEBREAK_TOTAL_QUESTIONS);
  assert.equal(centeredResult.centeredAnswerMean, 0);
  assert.equal(centeredResult.centeredAnswers.every((answer) => answer === 0), true);
  assert.equal(allScoresNearZero(centeredResult.axisScores), true);
  assert.equal(allScoresNearZero(centeredResult.roleScores), true);
  assert.equal(allScoresNearZero(centeredResult.forceScores), true);
  assert.equal(centeredResult.hasNegativeScore, false);
  assertCenteredSummaryShape(summary);
  assert.equal(summary.centeredAnswerMean, 0);
  assert.equal(summary.zeroAnswerCount, ICEBREAK_TOTAL_QUESTIONS);
  assert.equal(summary.hasNegativeScore, false);
  assert.equal("rawAnswers" in summary, false);
  assert.equal("centeredAnswers" in summary, false);
  assert.equal("axisScores" in summary, false);
  assert.equal("roleScores" in summary, false);
  assert.equal("forceScores" in summary, false);
}

{
  const answers = answersWithOnly("ice33_q32", 5);
  const { legacyResult, centeredResult } = calculateIcebreakParallelResult(answers);
  const summary = createCenteredResultSummary(centeredResult);

  assert.deepEqual(legacyResult, calculateIcebreakResult(answers));
  assert.equal(summary.centeredTopRole.key, "crazist");
  assert.equal(summary.centeredTopForce.key, "ignite");
  assert.ok(summary.centeredTopRole.score > 0);
  assert.ok(summary.centeredTopForce.score > 0);
}

{
  const representativeAnswers = [
    Array(ICEBREAK_TOTAL_QUESTIONS).fill(3),
    answersWithQuestionSet(experimentalQuestionIds, 5, 3),
    answersWithQuestionSet(experimentalQuestionIds, 1, 3),
    icebreakQuestions.map((_, index) => ((index + 1) % 2 === 1 ? 5 : 1)),
  ];

  for (const answers of representativeAnswers) {
    const { legacyResult, centeredResult } = calculateIcebreakParallelResult(answers);
    const summary = createCenteredResultSummary(centeredResult);

    assert.deepEqual(legacyResult, calculateIcebreakResult(answers));
    assertCenteredSummaryShape(summary);
    assert.equal(summary.centeredTopRole.key.length > 0, true);
    assert.equal(summary.centeredBottomRole.key.length > 0, true);
    assert.equal(summary.centeredTopForce.key.length > 0, true);
    assert.equal(summary.centeredBottomForce.key.length > 0, true);
  }
}

{
  const feedbackRouteSource = fs.readFileSync(feedbackRoutePath, "utf8");
  assert.equal(feedbackRouteSource.includes("icebreak_centered_summary"), false);
  assert.equal(feedbackRouteSource.includes("centeredResultSummary"), false);
}

{
  for (const [targetId, expectation] of Object.entries(experimentalWeightExpectations)) {
    const positive = calculateIcebreakParallelResult(answersWithOnly(targetId, 5)).centeredResult;
    const negative = calculateIcebreakParallelResult(answersWithOnly(targetId, 1)).centeredResult;

    assert.ok(positive.axisScores[expectation.positiveAxis] > 0);
    for (const axis of expectation.additionalPositiveAxes ?? []) {
      assert.ok(positive.axisScores[axis] > 0);
    }
    assert.ok(positive.roleScores[expectation.positiveRole] > 0);
    assert.ok(positive.forceScores[expectation.positiveForce] > 0);
    if (expectation.opposingAxis) {
      assert.ok(positive.axisScores[expectation.opposingAxis] < 0);
    }
    if (expectation.opposingRole) {
      assert.ok(positive.roleScores[expectation.opposingRole] < 0);
    }
    if (expectation.opposingForce) {
      assert.ok(positive.forceScores[expectation.opposingForce] < 0);
    }
    for (const role of expectation.additionalOpposingRoles ?? []) {
      assert.ok(positive.roleScores[role] < 0);
    }
    assert.equal(positive.hasNegativeScore, !expectation.noAdditionalNegativeWeights);

    assert.ok(negative.axisScores[expectation.positiveAxis] < 0);
    assert.ok(negative.roleScores[expectation.positiveRole] < 0);
    assert.ok(negative.forceScores[expectation.positiveForce] < 0);
    if (expectation.opposingAxis) {
      assert.ok(negative.axisScores[expectation.opposingAxis] > 0);
    }
    if (expectation.opposingRole) {
      assert.ok(negative.roleScores[expectation.opposingRole] > 0);
    }
    if (expectation.opposingForce) {
      assert.ok(negative.forceScores[expectation.opposingForce] > 0);
    }
    for (const role of expectation.additionalOpposingRoles ?? []) {
      assert.ok(negative.roleScores[role] > 0);
    }
    assert.equal(negative.hasNegativeScore, true);
  }
}

{
  const positiveAnswers = answersWithQuestionSet(experimentalQuestionIds, 5, 3);
  const negativeAnswers = answersWithQuestionSet(experimentalQuestionIds, 1, 3);
  const positive = calculateIcebreakParallelResult(positiveAnswers);
  const negative = calculateIcebreakParallelResult(negativeAnswers);

  assert.deepEqual(positive.legacyResult, calculateIcebreakResult(positiveAnswers));
  assert.deepEqual(negative.legacyResult, calculateIcebreakResult(negativeAnswers));

  assert.equal(positive.centeredResult.hasNegativeScore, true);
  assert.ok(positive.centeredResult.minAxisScore < 0);

  assert.equal(negative.centeredResult.hasNegativeScore, true);
  assert.ok(negative.centeredResult.minAxisScore < 0);
  assert.ok(negative.centeredResult.minRoleScore < 0);
  assert.ok(negative.centeredResult.minForceScore < 0);
}

console.log("icebreak scoring tests passed");
