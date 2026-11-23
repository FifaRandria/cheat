import { test } from "node:test";
import assert from "node:assert/strict";
import { totalAvecPromo } from "../src/promo.js";

test("un code en majuscules fonctionne", () => {
  assert.equal(totalAvecPromo(100, "VIP"), 80);
});

test("la casse du code est ignorée", () => {
  assert.equal(totalAvecPromo(100, "vip"), 80);
  assert.equal(totalAvecPromo(100, "Soldes"), 70);
});

test("les espaces autour du code sont ignorés", () => {
  assert.equal(totalAvecPromo(50, " BIENVENUE "), 45);
});

test("un code inconnu ne retire rien", () => {
  assert.equal(totalAvecPromo(100, "GRATUIT"), 100);
});

test("sans code, le prix est inchangé", () => {
  assert.equal(totalAvecPromo(100, undefined), 100);
});

test("le total est arrondi au centime", () => {
  assert.equal(totalAvecPromo(19.99, "vip"), 15.99);
});
