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

const { calculateEnergyLightResult } = jiti("../src/lib/calculateEnergyLightResult.ts");

const order = ["wood", "fire", "earth", "metal", "water"];

function valuesFromEnergyBase(base) {
  const byEnergy = {
    wood: [1, 1, 1, 1],
    fire: [1, 1, 1, 1],
    earth: [1, 1, 1, 1],
    metal: [1, 1, 1, 1],
    water: [1, 1, 1, 1],
  };

  for (const energy of order) {
    const total = base[energy];
    const low = Math.floor(total / 4);
    let rest = total - low * 4;
    byEnergy[energy] = Array.from({ length: 4 }, () => {
      const value = low + (rest > 0 ? 1 : 0);
      rest -= 1;
      return value;
    });
  }

  const counters = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  const questionOrder = [
    "wood",
    "fire",
    "earth",
    "metal",
    "water",
    "fire",
    "wood",
    "metal",
    "earth",
    "water",
    "earth",
    "water",
    "fire",
    "wood",
    "metal",
    "water",
    "metal",
    "fire",
    "earth",
    "wood",
  ];

  return questionOrder.map((energy) => byEnergy[energy][counters[energy]++]);
}

function run(baseScores, sceneChoice) {
  return calculateEnergyLightResult({
    values: valuesFromEnergyBase(baseScores),
    sceneChoice,
  });
}

{
  const result = run({ wood: 18, fire: 17, earth: 10, metal: 8, water: 14 }, "wood");
  assert.equal(result.scores.wood, 20);
  assert.equal(result.typeId, "11");
  assert.equal(result.secondaryEnergy, "fire");
}

{
  const result = run({ wood: 16, fire: 15, earth: 12, metal: 9, water: 11 }, "fire");
  assert.equal(result.scores.fire, 17);
  assert.equal(result.typeId, "01");
}

{
  const result = run({ wood: 8, fire: 10, earth: 16, metal: 15, water: 9 }, "earth");
  assert.equal(result.scores.earth, 18);
  assert.equal(result.typeId, "10");
}

{
  const result = run({ wood: 8, fire: 10, earth: 15, metal: 15, water: 9 }, "metal");
  assert.equal(result.scores.metal, 17);
  assert.equal(result.typeId, "07");
}

{
  const result = run({ wood: 8, fire: 10, earth: 16, metal: 15, water: 9 }, "metal");
  assert.equal(result.scores.metal, 17);
  assert.equal(result.typeId, "07");
}

{
  const result = run({ wood: 16, fire: 9, earth: 15, metal: 10, water: 9 }, "wood");
  assert.equal(result.typeId, "11");
}

{
  const result = run({ wood: 15, fire: 9, earth: 15, metal: 10, water: 9 }, "earth");
  assert.equal(result.scores.earth, 17);
  assert.equal(result.typeId, "10");
  assert.equal(result.secondaryEnergy, "wood");
}

{
  const result = run({ wood: 15, fire: 15, earth: 10, metal: 10, water: 10 }, "fire");
  assert.equal(result.typeId, "01");
}

{
  const result = run({ wood: 14, fire: 14, earth: 10, metal: 10, water: 10 }, "water");
  assert.equal(result.primaryEnergy, "wood");
  assert.equal(result.secondaryEnergy, "fire");
  assert.equal(result.typeId, "01");
}

console.log("energy light scoring tests passed");
