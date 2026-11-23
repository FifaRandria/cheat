import { test } from "node:test";
import assert from "node:assert/strict";
import { creerApp } from "../src/app.js";
import { creerBase } from "../src/boite.js";

const ADA = { authorization: "Bearer jeton-ada" };
const BOB = { authorization: "Bearer jeton-bob" };
const montre = (r) => `code ${r.status}, corps ${JSON.stringify(r.body)}`;
const silence = async (fn) => {
  const original = console.error;
  console.error = () => {};
  try {
    return await fn();
  } finally {
    console.error = original;
  }
};

test("un jeton piégé (injection SQL) ne connecte personne", async () => {
  const app = creerApp(creerBase(), () => "2026-11-20");
  for (const jeton of ["' OR '1'='1", "x' OR 1=1 --"]) {
    const r = await silence(() =>
      app.handle({ method: "POST", path: "/prets", headers: { authorization: `Bearer ${jeton}` }, body: { outilId: 1 } }),
    );
    assert.equal(r.status, 401, `jeton ${jeton} : ${montre(r)}`);
  }
});

test("un membre ne peut pas rendre le prêt d'un autre (403), et le prêt n'est pas modifié", async () => {
  const db = creerBase();
  const app = creerApp(db, () => "2026-11-20");
  const r = await app.handle({ method: "POST", path: "/prets/1/retour", headers: ADA });
  assert.equal(r.status, 403, montre(r));
  const pret = db.prepare("SELECT rendu_le FROM prets WHERE id = 1").get();
  assert.equal(pret.rendu_le, null, "le prêt de Bob a quand même été marqué comme rendu");
});

test("l'emprunteur peut toujours rendre son prêt", async () => {
  const app = creerApp(creerBase(), () => "2026-11-20");
  const r = await app.handle({ method: "POST", path: "/prets/1/retour", headers: BOB });
  assert.equal(r.status, 200, montre(r));
});

test("un membre ne voit pas l'historique d'un autre (403)", async () => {
  const app = creerApp(creerBase(), () => "2026-11-20");
  const r = await app.handle({ method: "GET", path: "/membres/2/prets", headers: ADA });
  assert.equal(r.status, 403, montre(r));
});

test("un membre voit son propre historique", async () => {
  const app = creerApp(creerBase(), () => "2026-11-20");
  const r = await app.handle({ method: "GET", path: "/membres/1/prets", headers: ADA });
  assert.equal(r.status, 200, montre(r));
  assert.deepEqual(r.body.map((p) => p.outil), ["Escabeau"]);
});

test("une erreur inattendue renvoie 500 sans aucun détail technique", async () => {
  const db = creerBase();
  db.exec("DROP TABLE prets");
  const app = creerApp(db, () => "2026-11-20");
  const r = await silence(() => app.handle({ method: "GET", path: "/outils", query: {} }));
  assert.equal(r.status, 500, montre(r));
  assert.deepEqual(r.body, { erreur: "Erreur interne" }, `le client reçoit : ${JSON.stringify(r.body)}`);
});

test("le parcours normal fonctionne toujours", async () => {
  const app = creerApp(creerBase(), () => "2026-11-20");
  const pret = await app.handle({ method: "POST", path: "/prets", headers: ADA, body: { outilId: 1 } });
  assert.equal(pret.status, 201, montre(pret));
  const retour = await app.handle({ method: "POST", path: `/prets/${pret.body.id}/retour`, headers: ADA });
  assert.equal(retour.status, 200, montre(retour));
});
