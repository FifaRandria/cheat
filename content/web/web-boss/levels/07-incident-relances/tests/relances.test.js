import { test } from "node:test";
import assert from "node:assert/strict";
import { creerBase } from "../src/boite.js";
import { listerRelances } from "../src/relances.js";

// Les données de départ, plus quelques prêts du matin de l'incident.
function baseDuJour() {
  const db = creerBase();
  db.exec(`
    INSERT INTO prets (outil_id, membre_id, debut, fin_prevue, rendu_le) VALUES
      (1, 3, '2026-11-13', '2026-11-20', NULL),          -- Eve : à rendre aujourd'hui
      (4, 1, '2026-11-08', '2026-11-15', NULL),          -- Ada : 5 jours de retard
      (5, 3, '2026-11-08', '2026-11-15', NULL),          -- Eve : 5 jours de retard
      (3, 2, '2026-11-02', '2026-11-09', '2026-11-12')   -- Bob : rendu en retard, mais rendu
  `);
  return db;
}

test("les outils rendus ne sont jamais relancés", () => {
  const r = listerRelances(baseDuJour(), "2026-11-20");
  assert.ok(!r.some((x) => x.outil === "Escabeau"), `relance pour un outil rendu : ${JSON.stringify(r)}`);
});

test("un outil à rendre aujourd'hui n'est pas encore en retard", () => {
  const r = listerRelances(baseDuJour(), "2026-11-20");
  assert.ok(!r.some((x) => x.joursDeRetard <= 0), `relance sans retard : ${JSON.stringify(r)}`);
});

test("la liste complète, du plus gros retard au plus petit", () => {
  assert.deepEqual(listerRelances(baseDuJour(), "2026-11-20"), [
    { membre: "Bob", outil: "Scie sauteuse", joursDeRetard: 12 },
    { membre: "Ada", outil: "Ponceuse", joursDeRetard: 5 },
    { membre: "Eve", outil: "Brouette", joursDeRetard: 5 },
  ]);
});

test("le nombre de requêtes ne dépend pas du nombre de prêts", () => {
  const db = baseDuJour();
  const avant = db.requetes;
  listerRelances(db, "2026-11-20");
  const n = db.requetes - avant;
  assert.ok(n <= 2, `${n} requêtes SQL pour 3 relances (problème N+1)`);
});

test("aucun retard : liste vide", () => {
  assert.deepEqual(listerRelances(creerBase(), "2026-11-01"), []);
});
