import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

const get = (path) => app.handle({ method: "GET", path });

test("une commande existante répond normalement", async () => {
  const res = await get("/commandes/7");
  assert.deepEqual(res.body, { id: 7, total: 42 });
});

test("une erreur 404 garde son code et son message", async () => {
  const res = await get("/commandes/abc");
  assert.equal(res.status, 404, `code reçu : ${res.status}`);
  assert.deepEqual(res.body, { error: "Commande introuvable" });
});

test("une erreur inattendue renvoie un message générique", async () => {
  const res = await get("/commandes/500");
  assert.equal(res.status, 500);
  assert.deepEqual(res.body, { error: "Erreur interne" });
});

test("aucune pile d'appels ni secret ne fuit vers le client", async () => {
  const res = await get("/commandes/500");
  const texte = JSON.stringify(res.body);
  assert.ok(!texte.includes("at "), "la pile d'appels est visible");
  assert.ok(!texte.includes("db-prod"), "un détail interne est visible");
});
