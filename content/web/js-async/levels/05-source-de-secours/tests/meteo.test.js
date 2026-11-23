import { test } from "node:test";
import assert from "node:assert/strict";
import { chargerAvecSecours } from "../src/meteo.js";

const attendre = (ms) => new Promise((r) => setTimeout(r, ms));

function source(nom, resultat, journal) {
  return {
    nom,
    charger: async () => {
      journal.push(nom);
      await attendre(5);
      if (resultat instanceof Error) throw resultat;
      return resultat;
    },
  };
}

test("la première source répond", async () => {
  const journal = [];
  const r = await chargerAvecSecours([source("principal", { temp: 21 }, journal)]);
  assert.deepEqual(r, { source: "principal", donnees: { temp: 21 } });
});

test("si la première échoue, on passe à la suivante", async () => {
  const journal = [];
  const r = await chargerAvecSecours([
    source("principal", new Error("503"), journal),
    source("secours", { temp: 20 }, journal),
  ]);
  assert.deepEqual(r, { source: "secours", donnees: { temp: 20 } });
});

test("on n'appelle pas les sources suivantes après un succès", async () => {
  const journal = [];
  await chargerAvecSecours([
    source("principal", { temp: 21 }, journal),
    source("secours", { temp: 20 }, journal),
    source("dernier-recours", { temp: 19 }, journal),
  ]);
  assert.deepEqual(journal, ["principal"], `sources appelées : ${journal.join(", ")}`);
});

test("les sources sont essayées l'une après l'autre, dans l'ordre", async () => {
  const journal = [];
  await chargerAvecSecours([
    source("a", new Error("panne"), journal),
    source("b", new Error("panne"), journal),
    source("c", { temp: 18 }, journal),
  ]);
  assert.deepEqual(journal, ["a", "b", "c"]);
});

test("si toutes échouent, l'erreur est explicite", async () => {
  const journal = [];
  await assert.rejects(
    chargerAvecSecours([source("a", new Error("panne"), journal), source("b", new Error("panne"), journal)]),
    { message: "toutes les sources ont échoué" },
  );
});

test("sans aucune source, l'erreur est la même", async () => {
  await assert.rejects(chargerAvecSecours([]), { message: "toutes les sources ont échoué" });
});
