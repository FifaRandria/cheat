import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

test("un produit existant répond 200 avec ses données", async () => {
  const res = await app.handle({ method: "GET", path: "/produits/1" });
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, { id: 1, nom: "Clavier", prix: 49 });
});

test("un produit inexistant répond 404", async () => {
  const res = await app.handle({ method: "GET", path: "/produits/999" });
  assert.equal(res.status, 404, `code reçu : ${res.status}`);
});

test("le 404 explique le problème en JSON", async () => {
  const res = await app.handle({ method: "GET", path: "/produits/999" });
  assert.deepEqual(res.body, { error: "Produit introuvable" });
});
