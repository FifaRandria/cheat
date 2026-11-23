import { test } from "node:test";
import assert from "node:assert/strict";
import { creerBase } from "../src/base.js";
import { rechercherClient } from "../src/recherche.js";

test("une recherche normale fonctionne", () => {
  assert.deepEqual(rechercherClient(creerBase(), "Ada"), [{ id: 1, nom: "Ada", ville: "Paris" }]);
});

test("l'injection ' OR '1'='1 ne renvoie rien", () => {
  const r = rechercherClient(creerBase(), "' OR '1'='1");
  assert.deepEqual(r, [], `${r.length} client(s) renvoyé(s) par l'injection`);
});

test("un nom avec une apostrophe ne fait pas planter", () => {
  assert.deepEqual(rechercherClient(creerBase(), "O'Brien"), []);
});

test("une tentative de suppression reste une simple recherche", () => {
  const db = creerBase();
  try {
    rechercherClient(db, "x'; DELETE FROM clients; --");
  } catch {
    // une erreur ne suffit pas : il ne faut surtout pas que la table soit vidée
  }
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM clients").get().n, 4);
});
