import { test } from "node:test";
import assert from "node:assert/strict";
import { moyenne } from "../src/notes.js";

test("la moyenne de quatre notes", () => {
  assert.equal(moyenne([12, 15, 9, 18]), 13.5);
});

test("la moyenne d'une seule note est cette note", () => {
  assert.equal(moyenne([10]), 10);
});

test("un bulletin sans note a une moyenne de 0", () => {
  assert.equal(moyenne([]), 0);
});
