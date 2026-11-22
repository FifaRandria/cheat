import { test } from "node:test";
import assert from "node:assert/strict";
import { totalPanier } from "../src/panier.js";

test("un panier vide vaut 0", () => {
  assert.equal(totalPanier([]), 0);
});

test("un panier d'un article vaut le prix de cet article", () => {
  assert.equal(totalPanier([12]), 12);
});

test("un panier de trois articles additionne les prix", () => {
  assert.equal(totalPanier([10, 5, 2.5]), 17.5);
});
