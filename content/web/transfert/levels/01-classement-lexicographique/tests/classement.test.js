import { test } from "node:test";
import assert from "node:assert/strict";
import { podium, scoresTries } from "../src/classement.js";

test("les scores sont triés comme des nombres", () => {
  assert.deepEqual(scoresTries([100, 95, 9, 87]), [9, 87, 95, 100]);
});

test("la liste d'origine n'est pas modifiée", () => {
  const scores = [3, 1, 2];
  scoresTries(scores);
  assert.deepEqual(scores, [3, 1, 2]);
});

test("le podium va du meilleur au moins bon", () => {
  const p = podium([
    { nom: "Ada", score: 100 },
    { nom: "Linus", score: 95 },
    { nom: "Grace", score: 9 },
    { nom: "Margaret", score: 87 },
  ]);
  assert.deepEqual(p, ["Ada", "Linus", "Margaret"]);
});

test("deux participants à égalité figurent tous les deux", () => {
  const p = podium([
    { nom: "Ada", score: 50 },
    { nom: "Linus", score: 50 },
    { nom: "Grace", score: 10 },
  ]);
  assert.deepEqual([...p].sort(), ["Ada", "Grace", "Linus"]);
});
