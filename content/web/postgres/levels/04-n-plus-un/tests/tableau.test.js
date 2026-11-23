import { test } from "node:test";
import assert from "node:assert/strict";
import { creerBase } from "../src/base.js";
import { dernieresCommandes } from "../src/tableau.js";

test("renvoie les commandes avec le nom du client", () => {
  assert.deepEqual(dernieresCommandes(creerBase()), [
    { id: 1, total: 49, client: "Ada" },
    { id: 2, total: 25, client: "Ada" },
    { id: 3, total: 189, client: "Bob" },
    { id: 4, total: 12, client: "Eve" },
  ]);
});

test("au plus 2 requêtes, même avec beaucoup de commandes", () => {
  const db = creerBase();
  const ajout = db.prepare("INSERT INTO commandes (client_id, total) VALUES (?, ?)");
  for (let i = 0; i < 96; i++) ajout.run((i % 4) + 1, 10);
  const avant = db.requetes;
  const lignes = dernieresCommandes(db);
  const faites = db.requetes - avant;
  assert.equal(lignes.length, 100);
  assert.ok(faites <= 2, `${faites} requêtes exécutées pour 100 commandes`);
});
