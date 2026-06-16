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
const { calculateIcebreakResult } = require("../src/lib/calculateIcebreakResult.ts");

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

const allNeutralAnswers = Array(ICEBREAK_TOTAL_QUESTIONS).fill(3);
const allNeutral = calculateIcebreakResult(allNeutralAnswers);

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
};

console.log(JSON.stringify(report, null, 2));
