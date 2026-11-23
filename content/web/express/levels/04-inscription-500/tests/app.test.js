import { test } from "node:test";
import assert from "node:assert/strict";
import { app, comptes } from "../src/app.js";

const post = (body) => app.handle({ method: "POST", path: "/inscriptions", body });

test("une inscription valide répond 201 sans renvoyer le mot de passe", async () => {
  const res = await post({ email: "ada@ex.com", motDePasse: "s3cret-long" });
  assert.equal(res.status, 201);
  assert.deepEqual(res.body, { email: "ada@ex.com" });
});

test("un e-mail absent répond 400 au lieu de 500", async () => {
  const res = await post({ motDePasse: "s3cret-long" });
  assert.equal(res.status, 400, `code reçu : ${res.status}`);
  assert.deepEqual(res.body.details, ["email invalide"]);
});

test("un mot de passe trop court est refusé", async () => {
  const avant = comptes.length;
  const res = await post({ email: "bob@ex.com", motDePasse: "ab" });
  assert.equal(res.status, 400);
  assert.equal(comptes.length, avant, "le compte a quand même été créé");
});

test("toutes les erreurs sont listées", async () => {
  const res = await post({ email: "pas-un-email", motDePasse: "" });
  assert.equal(res.status, 400);
  assert.equal(res.body.details.length, 2, `détails : ${JSON.stringify(res.body.details)}`);
});

test("un corps absent répond 400", async () => {
  const res = await post(undefined);
  assert.equal(res.status, 400, `code reçu : ${res.status}`);
});
