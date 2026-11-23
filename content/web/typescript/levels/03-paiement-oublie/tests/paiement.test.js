import { test } from "node:test";
import assert from "node:assert/strict";
import { frais, libelle } from "../src/paiement.ts";

const carte = { type: "carte", numero: "4970101234564242" };
const virement = { type: "virement", iban: "FR7630006000011234567890189" };
const especes = { type: "especes" };

test("libellés de la carte et du virement", () => {
  assert.equal(libelle(carte), "Carte •••• 4242");
  assert.equal(libelle(virement), "Virement FR76…");
});

test("libellé des espèces", () => {
  assert.equal(libelle(especes), "Espèces");
});

test("frais : 1,5 % pour la carte, arrondis au centime", () => {
  assert.equal(frais(carte, 100), 1.5);
  assert.equal(frais(carte, 33.33), 0.5);
  assert.equal(frais(virement, 100), 0);
});

test("frais des espèces : 0", () => {
  assert.equal(frais(especes, 100), 0);
});

test("un type inconnu lève une erreur explicite", () => {
  assert.throws(() => libelle({ type: "cheque" }), /cheque/);
  assert.throws(() => frais({ type: "cheque" }, 100), /cheque/);
});
