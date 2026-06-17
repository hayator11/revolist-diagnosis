import fs from "node:fs";
import Module from "node:module";
import path from "node:path";
import { createRequire } from "node:module";
import ts from "typescript";

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const originalResolveFilename = Module._resolveFilename;

Module._resolveFilename = function resolveAlias(request, parent, isMain, options) {
  if (request.startsWith("@/")) {
    return originalResolveFilename.call(this, path.join(repoRoot, "src", request.slice(2)), parent, isMain, options);
  }

  return originalResolveFilename.call(this, request, parent, isMain, options);
};

Module._extensions[".ts"] = function loadTs(module, filename) {
  const source = fs.readFileSync(filename, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: filename,
  }).outputText;
  module._compile(output, filename);
};

const ROLES = [
  "revolist",
  "maxdesigner",
  "imagemaister",
  "communicator",
  "inforader",
  "movmentor",
  "premiercrafter",
  "logicalmaister",
  "arranger",
  "soulowner",
  "crazist",
];

const FORCES = ["ignite", "design", "connect", "structure", "care"];
const RUNS = Number(process.env.RUNS ?? 20000);

const { icebreakQuestions, ICEBREAK_TOTAL_QUESTIONS } = require("../src/data/icebreakQuestions.ts");
const { researchLightQuestions } = require("../src/data/researchLightQuestions.ts");
const { calculateIcebreakParallelResult, calculateIcebreakResult } = require("../src/lib/calculateIcebreakResult.ts");
const { ICEBREAK_CENTERED_WEIGHT_OVERRIDES } = require("../src/lib/diagnosisCore/icebreakCenteredWeights.ts");

const FIFTH_SET_QUESTION_IDS = new Set(["ice33_q12", "ice33_q22", "ice33_q23"]);
const SIXTH_SET_QUESTION_IDS = new Set(["ice33_q04", "ice33_q16", "ice33_q33"]);
const EIGHTH_SET_QUESTION_IDS = new Set(["ice33_q08", "ice33_q17", "ice33_q32"]);

const PREVIOUS_9_NEGATIVE_TOTALS = {
  axis: {
    executionDrive: -0.8,
    publicVisibility: -0.8,
    maintenanceDrive: -0.6,
    evidenceSeeking: -0.45,
    nonconformity: -0.4,
    psychologicalSafety: -0.4,
    socialBridge: -0.4,
    noveltyDrive: -0.4,
    systemizing: -0.35,
    coordination: -0.25,
    uncertaintyTolerance: -0.3,
    craftQuality: -0.15,
  },
  role: {
    revolist: -0.7,
    crazist: -0.65,
    premiercrafter: -0.45,
    communicator: -0.4,
    inforader: -0.4,
    logicalmaister: -0.4,
    arranger: -0.25,
    soulowner: -0.2,
  },
  force: {
    ignite: -0.85,
    structure: -0.55,
    care: -0.4,
    connect: -0.15,
  },
};

function round(value, digits = 3) {
  return Number(value.toFixed(digits));
}

function formatScoreList(items) {
  return items.map((item) => `${item.key}:${item.score}`).join(", ");
}

function topBottomScores(scores, count = 3) {
  const ranked = Object.entries(scores)
    .map(([key, value]) => ({ key, score: round(value) }))
    .sort((a, b) => {
      const diff = b.score - a.score;
      if (diff !== 0) return diff;
      return a.key.localeCompare(b.key);
    });

  return {
    top: ranked.slice(0, count),
    bottom: ranked.slice(-count).reverse(),
  };
}

function summarizeNegativeWeights(items) {
  const summary = {};

  for (const item of items) {
    if (item.weight >= 0) continue;
    const current = summary[item.key] ?? { count: 0, total: 0, average: 0 };
    current.count += 1;
    current.total += item.weight;
    current.average = current.total / current.count;
    summary[item.key] = current;
  }

  return Object.fromEntries(
    Object.entries(summary)
      .map(([key, value]) => [
        key,
        {
          count: value.count,
          total: round(value.total),
          average: round(value.average),
        },
      ])
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB)),
  );
}

function mostNegative(summary, count = 5) {
  return Object.entries(summary)
    .map(([key, value]) => ({ key, ...value }))
    .sort((a, b) => a.total - b.total || b.count - a.count || a.key.localeCompare(b.key))
    .slice(0, count);
}

function compareWithPreviousBaseline(summary, baseline) {
  const keys = new Set([...Object.keys(summary), ...Object.keys(baseline)]);
  return [...keys]
    .map((key) => {
      const current = summary[key]?.total ?? 0;
      const previous = baseline[key] ?? 0;
      return {
        key,
        previous: round(previous),
        current: round(current),
        delta: round(current - previous),
      };
    })
    .filter((item) => item.delta !== 0)
    .sort((a, b) => a.delta - b.delta || a.key.localeCompare(b.key));
}

function summarizeOverrideNegativeTotals(overrides) {
  const axisItems = [];
  const roleItems = [];
  const forceItems = [];

  for (const [questionId, override] of Object.entries(overrides)) {
    for (const item of override.axisWeights ?? []) {
      axisItems.push({ questionId, key: item.axis, weight: item.weight });
    }
    for (const item of override.roleWeights ?? []) {
      roleItems.push({ questionId, key: item.role, weight: item.weight });
    }
    for (const item of override.forceWeights ?? []) {
      forceItems.push({ questionId, key: item.force, weight: item.weight });
    }
  }

  const axis = summarizeNegativeWeights(axisItems);
  const role = summarizeNegativeWeights(roleItems);
  const force = summarizeNegativeWeights(forceItems);

  return { axis, role, force };
}

function hasNegativeOverrideWeights(override) {
  return [
    ...(override.axisWeights ?? []),
    ...(override.roleWeights ?? []),
    ...(override.forceWeights ?? []),
  ].some((item) => item.weight < 0);
}

function summarizeOverrideNegativeWeights(overrides) {
  const { axis, role, force } = summarizeOverrideNegativeTotals(overrides);
  const previous12Overrides = Object.fromEntries(
    Object.entries(overrides).filter(([questionId]) => !FIFTH_SET_QUESTION_IDS.has(questionId)),
  );
  const previous12 = summarizeOverrideNegativeTotals(previous12Overrides);
  const previous15Overrides = Object.fromEntries(
    Object.entries(overrides).filter(([questionId]) => !SIXTH_SET_QUESTION_IDS.has(questionId)),
  );
  const previous15 = summarizeOverrideNegativeTotals(previous15Overrides);
  const previous21Overrides = Object.fromEntries(
    Object.entries(overrides).filter(([questionId]) => !EIGHTH_SET_QUESTION_IDS.has(questionId)),
  );
  const previous21 = summarizeOverrideNegativeTotals(previous21Overrides);
  const emptyOverrideQuestionIds = Object.entries(overrides)
    .filter(([, override]) => !hasNegativeOverrideWeights(override))
    .map(([questionId]) => questionId);
  const negativeOverrideQuestionIds = Object.entries(overrides)
    .filter(([, override]) => hasNegativeOverrideWeights(override))
    .map(([questionId]) => questionId);

  return {
    overrideQuestionCount: Object.keys(overrides).length,
    overrideQuestionIds: Object.keys(overrides),
    negativeOverrideQuestionCount: negativeOverrideQuestionIds.length,
    negativeOverrideQuestionIds,
    emptyOverrideQuestionCount: emptyOverrideQuestionIds.length,
    emptyOverrideQuestionIds,
    axis,
    role,
    force,
    mostNegative: {
      axis: mostNegative(axis),
      role: mostNegative(role),
      force: mostNegative(force),
    },
    deltaFromPrevious9: {
      axis: compareWithPreviousBaseline(axis, PREVIOUS_9_NEGATIVE_TOTALS.axis),
      role: compareWithPreviousBaseline(role, PREVIOUS_9_NEGATIVE_TOTALS.role),
      force: compareWithPreviousBaseline(force, PREVIOUS_9_NEGATIVE_TOTALS.force),
    },
    deltaFromPrevious12: {
      axis: compareWithPreviousBaseline(axis, Object.fromEntries(Object.entries(previous12.axis).map(([key, value]) => [key, value.total]))),
      role: compareWithPreviousBaseline(role, Object.fromEntries(Object.entries(previous12.role).map(([key, value]) => [key, value.total]))),
      force: compareWithPreviousBaseline(force, Object.fromEntries(Object.entries(previous12.force).map(([key, value]) => [key, value.total]))),
    },
    deltaFromPrevious15: {
      axis: compareWithPreviousBaseline(axis, Object.fromEntries(Object.entries(previous15.axis).map(([key, value]) => [key, value.total]))),
      role: compareWithPreviousBaseline(role, Object.fromEntries(Object.entries(previous15.role).map(([key, value]) => [key, value.total]))),
      force: compareWithPreviousBaseline(force, Object.fromEntries(Object.entries(previous15.force).map(([key, value]) => [key, value.total]))),
    },
    deltaFromPrevious21: {
      axis: compareWithPreviousBaseline(axis, Object.fromEntries(Object.entries(previous21.axis).map(([key, value]) => [key, value.total]))),
      role: compareWithPreviousBaseline(role, Object.fromEntries(Object.entries(previous21.role).map(([key, value]) => [key, value.total]))),
      force: compareWithPreviousBaseline(force, Object.fromEntries(Object.entries(previous21.force).map(([key, value]) => [key, value.total]))),
    },
  };
}

function countBy(items, key) {
  return items.reduce((acc, item) => {
    acc[item[key]] = (acc[item[key]] ?? 0) + 1;
    return acc;
  }, {});
}

function createCounters(keys) {
  return Object.fromEntries(keys.map((key) => [key, 0]));
}

function summarizeRuns({ length, runs, generator, calculator }) {
  const counts = createCounters(ROLES);
  for (let index = 0; index < runs; index += 1) {
    counts[calculator(generator(length))] += 1;
  }
  return Object.fromEntries(Object.entries(counts).map(([key, value]) => [key, Number(((value / runs) * 100).toFixed(1))]));
}

function randomUniform(length) {
  return Array.from({ length }, () => 1 + Math.floor(Math.random() * 5));
}

function mostlyNeutral(length) {
  return Array.from({ length }, () => {
    const roll = Math.random();
    if (roll < 0.12) return 2;
    if (roll < 0.88) return 3;
    return 4;
  });
}

function lowNoveltyJapaneseTendency(length) {
  return icebreakQuestions.map((question) => {
    const noveltyAxes = new Set(["noveltyDrive", "nonconformity", "uncertaintyTolerance", "publicVisibility"]);
    const hasNovelty = question.weights.some((item) => noveltyAxes.has(item.axis));
    if (!hasNovelty) return mostlyNeutral(1)[0];
    const roll = Math.random();
    if (roll < 0.55) return 2;
    if (roll < 0.9) return 3;
    return 4;
  }).slice(0, length);
}

function mainType(answers) {
  return calculateIcebreakResult(answers).mainTypeKey;
}

function movementStyle(answers) {
  return calculateIcebreakResult(answers).movementStyle.primaryStyle.key;
}

function summarizeMovement({ length, runs, generator }) {
  const styles = ["emergent", "resonant", "grounded", "structural"];
  const counts = createCounters(styles);
  for (let index = 0; index < runs; index += 1) {
    counts[movementStyle(generator(length))] += 1;
  }
  return Object.fromEntries(Object.entries(counts).map(([key, value]) => [key, Number(((value / runs) * 100).toFixed(1))]));
}

function compareRepresentative(name, answers) {
  const { legacyResult, centeredResult } = calculateIcebreakParallelResult(answers);
  return {
    name,
    legacy: {
      mainType: legacyResult.mainTypeKey,
      partnerType: legacyResult.partnerTypeKey,
      thirdType: legacyResult.thirdTypeKey,
      centerForce: legacyResult.centerForce,
      subForce: legacyResult.subForce,
      slotForce: legacyResult.slotForce,
      movementStyle: legacyResult.movementStyle.primaryStyle.key,
      mode: legacyResult.roleJudgment.mode,
      personalMean: round(legacyResult.personalMean),
      forceScores: topBottomScores(legacyResult.forceScores),
      roleScores: topBottomScores(legacyResult.roleScores),
    },
    centered: {
      centeredAnswerMean: round(centeredResult.centeredAnswerMean),
      centeredAnswerSpread: round(centeredResult.centeredAnswerSpread),
      zeroAnswerCount: centeredResult.zeroAnswerCount,
      hasNegativeScore: centeredResult.hasNegativeScore,
      minAxisScore: round(centeredResult.minAxisScore),
      minRoleScore: round(centeredResult.minRoleScore),
      minForceScore: round(centeredResult.minForceScore),
      axisScores: topBottomScores(centeredResult.axisScores),
      roleScores: topBottomScores(centeredResult.roleScores),
      forceScores: topBottomScores(centeredResult.forceScores),
    },
  };
}

function answersWithOnly(questionId, value) {
  return icebreakQuestions.map((question) => (question.id === questionId ? value : 3));
}

function answersWithQuestionSet(questionIds, targetValue, otherValue) {
  const targetIds = new Set(questionIds);
  return icebreakQuestions.map((question) => (targetIds.has(question.id) ? targetValue : otherValue));
}

const allNeutralAnswers = Array(ICEBREAK_TOTAL_QUESTIONS).fill(3);
const allNeutral = calculateIcebreakResult(allNeutralAnswers);
const experimentalQuestionIds = Object.keys(ICEBREAK_CENTERED_WEIGHT_OVERRIDES);
const negativeWeightSummary = summarizeOverrideNegativeWeights(ICEBREAK_CENTERED_WEIGHT_OVERRIDES);
const overrideLabel = `override対象${experimentalQuestionIds.length}問`;
const emptyOverrideQuestionIds = negativeWeightSummary.emptyOverrideQuestionIds;
const representativeCases = [
  ["全回答5", Array(ICEBREAK_TOTAL_QUESTIONS).fill(5)],
  ["全回答4", Array(ICEBREAK_TOTAL_QUESTIONS).fill(4)],
  ["全回答3", Array(ICEBREAK_TOTAL_QUESTIONS).fill(3)],
  ["全回答2", Array(ICEBREAK_TOTAL_QUESTIONS).fill(2)],
  ["全回答1", Array(ICEBREAK_TOTAL_QUESTIONS).fill(1)],
  [`${overrideLabel}だけ5、他は3`, answersWithQuestionSet(experimentalQuestionIds, 5, 3)],
  [`${overrideLabel}だけ1、他は3`, answersWithQuestionSet(experimentalQuestionIds, 1, 3)],
  [`${overrideLabel}だけ5、その他は4`, answersWithQuestionSet(experimentalQuestionIds, 5, 4)],
  [`${overrideLabel}だけ1、その他は2`, answersWithQuestionSet(experimentalQuestionIds, 1, 2)],
  [`空override${emptyOverrideQuestionIds.length}問だけ5、他は3`, answersWithQuestionSet(emptyOverrideQuestionIds, 5, 3)],
  [`空override${emptyOverrideQuestionIds.length}問だけ1、他は3`, answersWithQuestionSet(emptyOverrideQuestionIds, 1, 3)],
  ...experimentalQuestionIds.flatMap((questionId) => [
    [`${questionId}だけ5、他は3`, answersWithOnly(questionId, 5)],
    [`${questionId}だけ1、他は3`, answersWithOnly(questionId, 1)],
  ]),
];

const report = {
  generatedAt: new Date().toISOString(),
  runs: RUNS,
  questionCounts: {
    icebreak33: {
      total: ICEBREAK_TOTAL_QUESTIONS,
      byRole: countBy(icebreakQuestions, "role"),
      byForce: countBy(icebreakQuestions, "force"),
    },
    researchLight21: {
      total: researchLightQuestions.length,
      byRole: countBy(researchLightQuestions, "role"),
      byForce: countBy(researchLightQuestions, "force"),
    },
  },
  allNeutral: {
    mainType: allNeutral.mainTypeKey,
    centerForce: allNeutral.centerForce,
    movementStyle: allNeutral.movementStyle.primaryStyle.key,
    mode: allNeutral.roleJudgment.mode,
  },
  negativeWeightSummary,
  distributions: {
    icebreak33Uniform: summarizeRuns({
      length: ICEBREAK_TOTAL_QUESTIONS,
      runs: RUNS,
      generator: randomUniform,
      calculator: mainType,
    }),
    icebreak33MostlyNeutral: summarizeRuns({
      length: ICEBREAK_TOTAL_QUESTIONS,
      runs: RUNS,
      generator: mostlyNeutral,
      calculator: mainType,
    }),
    icebreak33LowNoveltyTendency: summarizeRuns({
      length: ICEBREAK_TOTAL_QUESTIONS,
      runs: RUNS,
      generator: lowNoveltyJapaneseTendency,
      calculator: mainType,
    }),
  },
  movementDistributions: {
    icebreak33Uniform: summarizeMovement({
      length: ICEBREAK_TOTAL_QUESTIONS,
      runs: RUNS,
      generator: randomUniform,
    }),
    icebreak33MostlyNeutral: summarizeMovement({
      length: ICEBREAK_TOTAL_QUESTIONS,
      runs: RUNS,
      generator: mostlyNeutral,
    }),
    icebreak33LowNoveltyTendency: summarizeMovement({
      length: ICEBREAK_TOTAL_QUESTIONS,
      runs: RUNS,
      generator: lowNoveltyJapaneseTendency,
    }),
  },
  centeredRepresentativeComparisons: representativeCases.map(([name, answers]) => compareRepresentative(name, answers)),
};

function printRepresentativeComparison(comparison) {
  console.log(`\n## ${comparison.name}`);
  console.log(
    [
      `Legacy: role=${comparison.legacy.mainType}`,
      `force=${comparison.legacy.centerForce}`,
      `movement=${comparison.legacy.movementStyle}`,
      `mode=${comparison.legacy.mode}`,
      `partner=${comparison.legacy.partnerType}`,
      `third=${comparison.legacy.thirdType}`,
      `personalMean=${comparison.legacy.personalMean}`,
    ].join(" / "),
  );
  console.log(`Legacy force top: ${formatScoreList(comparison.legacy.forceScores.top)}`);
  console.log(`Legacy role top: ${formatScoreList(comparison.legacy.roleScores.top)}`);
  console.log(
    [
      `Centered: mean=${comparison.centered.centeredAnswerMean}`,
      `spread=${comparison.centered.centeredAnswerSpread}`,
      `zero=${comparison.centered.zeroAnswerCount}`,
      `hasNegativeScore=${comparison.centered.hasNegativeScore}`,
      `minAxis=${comparison.centered.minAxisScore}`,
      `minRole=${comparison.centered.minRoleScore}`,
      `minForce=${comparison.centered.minForceScore}`,
    ].join(" / "),
  );
  console.log(`Axis top: ${formatScoreList(comparison.centered.axisScores.top)}`);
  console.log(`Axis bottom: ${formatScoreList(comparison.centered.axisScores.bottom)}`);
  console.log(`Role top: ${formatScoreList(comparison.centered.roleScores.top)}`);
  console.log(`Role bottom: ${formatScoreList(comparison.centered.roleScores.bottom)}`);
  console.log(`Force top: ${formatScoreList(comparison.centered.forceScores.top)}`);
  console.log(`Force bottom: ${formatScoreList(comparison.centered.forceScores.bottom)}`);
}

function printNegativeWeightSummary(summary) {
  console.log("=== Centered override negative weight summary ===");
  console.log(`Override questions: ${summary.overrideQuestionCount} (${summary.overrideQuestionIds.join(", ")})`);
  console.log(`Questions with negative weights: ${summary.negativeOverrideQuestionCount} (${summary.negativeOverrideQuestionIds.join(", ")})`);
  console.log(`Empty override questions: ${summary.emptyOverrideQuestionCount} (${summary.emptyOverrideQuestionIds.join(", ")})`);
  console.log(`Axis most negative: ${formatScoreList(summary.mostNegative.axis.map((item) => ({ key: item.key, score: item.total })))}`);
  console.log(`Role most negative: ${formatScoreList(summary.mostNegative.role.map((item) => ({ key: item.key, score: item.total })))}`);
  console.log(`Force most negative: ${formatScoreList(summary.mostNegative.force.map((item) => ({ key: item.key, score: item.total })))}`);
  console.log(`Axis delta from 9-question baseline: ${formatScoreList(summary.deltaFromPrevious9.axis.map((item) => ({ key: item.key, score: item.delta })))}`);
  console.log(`Role delta from 9-question baseline: ${formatScoreList(summary.deltaFromPrevious9.role.map((item) => ({ key: item.key, score: item.delta })))}`);
  console.log(`Force delta from 9-question baseline: ${formatScoreList(summary.deltaFromPrevious9.force.map((item) => ({ key: item.key, score: item.delta })))}`);
  console.log(`Axis delta from 12-question baseline: ${formatScoreList(summary.deltaFromPrevious12.axis.map((item) => ({ key: item.key, score: item.delta })))}`);
  console.log(`Role delta from 12-question baseline: ${formatScoreList(summary.deltaFromPrevious12.role.map((item) => ({ key: item.key, score: item.delta })))}`);
  console.log(`Force delta from 12-question baseline: ${formatScoreList(summary.deltaFromPrevious12.force.map((item) => ({ key: item.key, score: item.delta })))}`);
  console.log(`Axis delta from 15-question baseline: ${formatScoreList(summary.deltaFromPrevious15.axis.map((item) => ({ key: item.key, score: item.delta })))}`);
  console.log(`Role delta from 15-question baseline: ${formatScoreList(summary.deltaFromPrevious15.role.map((item) => ({ key: item.key, score: item.delta })))}`);
  console.log(`Force delta from 15-question baseline: ${formatScoreList(summary.deltaFromPrevious15.force.map((item) => ({ key: item.key, score: item.delta })))}`);
  console.log(`Axis delta from 21-question baseline: ${formatScoreList(summary.deltaFromPrevious21.axis.map((item) => ({ key: item.key, score: item.delta })))}`);
  console.log(`Role delta from 21-question baseline: ${formatScoreList(summary.deltaFromPrevious21.role.map((item) => ({ key: item.key, score: item.delta })))}`);
  console.log(`Force delta from 21-question baseline: ${formatScoreList(summary.deltaFromPrevious21.force.map((item) => ({ key: item.key, score: item.delta })))}`);
}

printNegativeWeightSummary(report.negativeWeightSummary);
console.log("");
console.log("=== Icebreak 33 legacy / centered representative comparison ===");
for (const comparison of report.centeredRepresentativeComparisons) {
  printRepresentativeComparison(comparison);
}

console.log("\n=== Distribution summary JSON ===");
console.log(JSON.stringify(report, null, 2));

const auditOutputPath = process.env.ICEBREAK_AUDIT_JSON_PATH ?? "/private/tmp/icebreak-centered-audit.json";
fs.writeFileSync(auditOutputPath, JSON.stringify(report, null, 2));
console.log(`\nJSON saved: ${auditOutputPath}`);
