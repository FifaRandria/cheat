import { test } from "node:test";
import assert from "node:assert/strict";
import { creerApp } from "../src/app.js";
import { creerBase } from "../src/boite.js";

const nouvelle = () => creerApp(creerBase(), () => "2026-11-20");
const ADA = { authorization: "Bearer jeton-ada" };
const montre = (r) => `code ${r.status}, corps ${JSON.stringify(r.body)}`;

test("GET /outils renvoie le catalogue", async () => {
  const r = await nouvelle().handle({ method: "GET", path: "/outils", query: {} });
  assert.equal(r.status, 200, montre(r));
  assert.equal(r.body.length, 5);
});

test("GET /outils?categorie=jardin filtre", async () => {
  const r = await nouvelle().handle({ method: "GET", path: "/outils", query: { categorie: "jardin" } });
  assert.deepEqual(r.body.map((o) => o.nom), ["Brouette"]);
});

test("POST /prets crée un prêt pour le membre connecté (201)", async () => {
  const r = await nouvelle().handle({ method: "POST", path: "/prets", headers: ADA, body: { outilId: 1 } });
  assert.equal(r.status, 201, montre(r));
  assert.equal(r.body.membreId, 1);
  assert.equal(r.body.finPrevue, "2026-11-27");
});

test("POST /prets sans connexion répond 401", async () => {
  const r = await nouvelle().handle({ method: "POST", path: "/prets", headers: {}, body: { outilId: 1 } });
  assert.equal(r.status, 401, montre(r));
});

test("POST /prets refuse un outilId invalide (400)", async () => {
  for (const outilId of [undefined, "1", 0, -3, 1.5]) {
    const r = await nouvelle().handle({ method: "POST", path: "/prets", headers: ADA, body: { outilId } });
    assert.equal(r.status, 400, `outilId ${JSON.stringify(outilId)} : ${montre(r)}`);
    assert.ok(r.body?.erreur, "la réponse 400 contient un champ erreur");
  }
});

test("les erreurs métier deviennent 404 et 409", async () => {
  const app = nouvelle();
  const inconnu = await app.handle({ method: "POST", path: "/prets", headers: ADA, body: { outilId: 99 } });
  assert.equal(inconnu.status, 404, montre(inconnu));
  assert.equal(inconnu.body.code, "OUTIL_INCONNU");
  const prete = await app.handle({ method: "POST", path: "/prets", headers: ADA, body: { outilId: 2 } });
  assert.equal(prete.status, 409, montre(prete));
  assert.equal(prete.body.code, "DEJA_PRETE");
});

test("POST /prets/:id/retour rend un outil, puis refuse un second retour", async () => {
  const app = nouvelle();
  const cree = await app.handle({ method: "POST", path: "/prets", headers: ADA, body: { outilId: 5 } });
  const ok = await app.handle({ method: "POST", path: `/prets/${cree.body.id}/retour`, headers: ADA });
  assert.equal(ok.status, 200, montre(ok));
  assert.equal(ok.body.renduLe, "2026-11-20");
  const encore = await app.handle({ method: "POST", path: `/prets/${cree.body.id}/retour`, headers: ADA });
  assert.equal(encore.status, 409, montre(encore));
  const inconnu = await app.handle({ method: "POST", path: "/prets/99/retour", headers: ADA });
  assert.equal(inconnu.status, 404, montre(inconnu));
});
