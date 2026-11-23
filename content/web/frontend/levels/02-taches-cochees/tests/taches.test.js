import { test } from "node:test";
import assert from "node:assert/strict";
import { basculer, trierParTitre } from "../src/taches.js";

const initiales = () => [
  { id: 1, titre: "Courses", fait: false },
  { id: 2, titre: "Appeler Sofia", fait: false },
];

test("basculer inverse la tâche demandée", () => {
  const apres = basculer(initiales(), 1);
  assert.equal(apres[0].fait, true);
  assert.equal(apres[1].fait, false);
});

test("l'historique n'est pas modifié par basculer", () => {
  const etape1 = initiales();
  basculer(etape1, 1);
  assert.equal(etape1[0].fait, false, "la tâche de l'étape précédente a été cochée aussi");
});

test("les tâches non concernées gardent leur référence", () => {
  const avant = initiales();
  const apres = basculer(avant, 1);
  assert.equal(apres[1], avant[1]);
  assert.notEqual(apres[0], avant[0]);
});

test("trierParTitre ne modifie pas la liste d'origine", () => {
  const avant = initiales();
  const triee = trierParTitre(avant);
  assert.deepEqual(triee.map((t) => t.titre), ["Appeler Sofia", "Courses"]);
  assert.equal(avant[0].titre, "Courses", "la liste d'origine a été triée sur place");
});
