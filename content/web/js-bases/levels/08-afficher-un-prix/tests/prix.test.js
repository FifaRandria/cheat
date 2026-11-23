import { test } from "node:test";
import assert from "node:assert/strict";
import { formaterPrix } from "../src/prix.js";

test("un prix entier affiche deux zéros", () => {
  assert.equal(formaterPrix(3), "3,00 €");
});

test("le séparateur décimal est une virgule", () => {
  assert.equal(formaterPrix(12.5), "12,50 €");
});

test("le prix est arrondi au centime", () => {
  assert.equal(formaterPrix(19.999), "20,00 €");
  assert.equal(formaterPrix(0.1 + 0.2), "0,30 €");
});

test("un remboursement garde son signe", () => {
  assert.equal(formaterPrix(-4.2), "-4,20 €");
});
