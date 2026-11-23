import { test } from "node:test";
import assert from "node:assert/strict";
import { creerApp } from "../src/app.js";

const ADA = { authorization: "Bearer jeton-ada" };
const ROOT = { authorization: "Bearer jeton-root" };
const montre = (r) => `code ${r.status}, corps ${JSON.stringify(r.body)}`;

test("Ada lit sa propre facture", async () => {
  const r = await creerApp().handle({ method: "GET", path: "/factures/41", headers: ADA });
  assert.equal(r.status, 200, montre(r));
  assert.equal(r.body.montant, 120);
});

test("Ada ne peut pas lire la facture de Bob (404)", async () => {
  const r = await creerApp().handle({ method: "GET", path: "/factures/42", headers: ADA });
  assert.equal(r.status, 404, montre(r));
  assert.ok(!JSON.stringify(r.body).includes("560"), "le montant de Bob a fuité");
});

test("modifier son nom et son e-mail fonctionne", async () => {
  const r = await creerApp().handle({ method: "PUT", path: "/profil", headers: ADA, body: { nom: "Ada L.", email: "ada@new.example" } });
  assert.equal(r.status, 200, montre(r));
  assert.equal(r.body.nom, "Ada L.");
  assert.equal(r.body.email, "ada@new.example");
});

test("le rôle, l'id et le jeton ne sont pas modifiables", async () => {
  const app = creerApp();
  const r = await app.handle({ method: "PUT", path: "/profil", headers: ADA, body: { nom: "Ada", role: "admin", id: 3, jeton: "x" } });
  assert.equal(r.body.role, "membre", `rôle après modification : ${r.body.role}`);
  assert.equal(r.body.id, 1);
  const encore = await app.handle({ method: "GET", path: "/factures/41", headers: ADA });
  assert.equal(encore.status, 200, "le jeton d'Ada ne doit pas avoir changé");
  const admin = await app.handle({ method: "GET", path: "/admin/utilisateurs", headers: ADA });
  assert.equal(admin.status, 403, `après la tentative, /admin : ${montre(admin)}`);
});

test("un en-tête X-Role ne donne aucun droit", async () => {
  const r = await creerApp().handle({ method: "GET", path: "/admin/utilisateurs", headers: { ...ADA, "x-role": "admin" } });
  assert.equal(r.status, 403, montre(r));
});

test("un vrai administrateur voit la liste, sans les jetons", async () => {
  const r = await creerApp().handle({ method: "GET", path: "/admin/utilisateurs", headers: ROOT });
  assert.equal(r.status, 200, montre(r));
  assert.equal(r.body.length, 3);
  assert.ok(!JSON.stringify(r.body).includes("jeton-"), "les jetons ne doivent jamais sortir de l'API");
});
