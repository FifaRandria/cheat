import { test } from "node:test";
import assert from "node:assert/strict";
import { etiquette, prixTTC } from "../src/prix.js";

test("prixTTC renvoie le prix avec 20 % de TVA", () => {
  assert.equal(prixTTC(100), 120);
});

test("prixTTC fonctionne avec des centimes", () => {
  assert.ok(Math.abs(prixTTC(9.99) - 11.988) < 1e-9);
});

test("l'étiquette affiche le prix TTC avec deux décimales", () => {
  assert.equal(etiquette(100), "120.00 € TTC");
  assert.equal(etiquette(9.99), "11.99 € TTC");
});
