import { test } from "node:test";
import assert from "node:assert/strict";
import { app, journal } from "../src/app.js";

test("GET /sante répond", async () => {
  const res = await app.handle({ method: "GET", path: "/sante" });
  assert.equal(res.status, 200, `réponse : ${res.status} ${res.body}`);
  assert.deepEqual(res.body, { ok: true });
});

test("GET /produits répond la liste", async () => {
  const res = await app.handle({ method: "GET", path: "/produits" });
  assert.equal(res.status, 200, `réponse : ${res.status} ${res.body}`);
  assert.equal(res.body.length, 2);
});

test("chaque requête est journalisée", async () => {
  journal.length = 0;
  await app.handle({ method: "GET", path: "/sante" });
  assert.deepEqual(journal, ["GET /sante"]);
});

test("une route inconnue répond 404 au lieu de rester pendue", async () => {
  const res = await app.handle({ method: "GET", path: "/rapports/annuel" });
  assert.equal(res.status, 404);
});
