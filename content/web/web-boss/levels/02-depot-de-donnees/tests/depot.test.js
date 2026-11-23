import { test } from "node:test";
import assert from "node:assert/strict";
import { creerBase } from "../src/boite.js";
import { emprunter, ErreurMetier, listerOutils, rendre } from "../src/depot.js";

const erreur = (code) => (e) => {
  assert.ok(e instanceof ErreurMetier, `une ErreurMetier est attendue, obtenu : ${e}`);
  assert.equal(e.code, code);
  return true;
};

test("listerOutils renvoie tous les outils avec leur disponibilité", () => {
  const outils = listerOutils(creerBase());
  assert.equal(outils.length, 5);
  assert.deepEqual(outils[0], { id: 1, nom: "Perceuse", categorie: "electro", disponible: true });
  assert.equal(outils[1].disponible, false, "la scie sauteuse est prêtée à Bob (prêt non rendu)");
  assert.equal(outils[2].disponible, true, "l'escabeau a été rendu : il est disponible");
});

test("listerOutils filtre par catégorie", () => {
  const outils = listerOutils(creerBase(), "electro");
  assert.deepEqual(outils.map((o) => o.id), [1, 2, 4]);
});

test("listerOutils ne fait qu'une seule requête SQL", () => {
  const db = creerBase();
  const avant = db.requetes;
  listerOutils(db);
  assert.equal(db.requetes - avant, 1, `${db.requetes - avant} requêtes pour lister les outils`);
});

test("emprunter enregistre un prêt de 7 jours", () => {
  const db = creerBase();
  const pret = emprunter(db, 1, 4, "2026-11-20");
  assert.deepEqual(pret, { id: 3, outilId: 4, membreId: 1, debut: "2026-11-20", finPrevue: "2026-11-27", renduLe: null });
  assert.equal(listerOutils(db)[3].disponible, false, "après l'emprunt, la ponceuse n'est plus disponible");
});

test("emprunter refuse un outil inconnu ou déjà prêté", () => {
  const db = creerBase();
  assert.throws(() => emprunter(db, 1, 99, "2026-11-20"), erreur("OUTIL_INCONNU"));
  assert.throws(() => emprunter(db, 1, 2, "2026-11-20"), erreur("DEJA_PRETE"));
});

test("rendre enregistre le retour et libère l'outil", () => {
  const db = creerBase();
  const pret = rendre(db, 1, "2026-11-20");
  assert.equal(pret.renduLe, "2026-11-20");
  assert.equal(pret.outilId, 2);
  assert.equal(listerOutils(db)[1].disponible, true);
});

test("rendre refuse un prêt inconnu ou déjà rendu", () => {
  const db = creerBase();
  assert.throws(() => rendre(db, 99, "2026-11-20"), erreur("PRET_INCONNU"));
  assert.throws(() => rendre(db, 2, "2026-11-20"), erreur("DEJA_RENDU"));
});
