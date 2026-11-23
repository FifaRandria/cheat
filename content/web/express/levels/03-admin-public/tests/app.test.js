import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

const get = (path, authorization) =>
  app.handle({ method: "GET", path, headers: authorization ? { authorization } : {} });

test("le catalogue reste public", async () => {
  assert.equal((await get("/catalogue")).status, 200);
});

test("sans connexion, /admin/stats répond 401", async () => {
  const res = await get("/admin/stats");
  assert.equal(res.status, 401, `code reçu : ${res.status}, corps : ${JSON.stringify(res.body)}`);
});

test("avec un jeton non administrateur, /admin/stats répond 403", async () => {
  assert.equal((await get("/admin/stats", "Bearer jeton-client")).status, 403);
});

test("un administrateur voit les statistiques", async () => {
  const res = await get("/admin/stats", "Bearer jeton-admin");
  assert.equal(res.status, 200);
  assert.equal(res.body.chiffreAffaires, 128400);
});
