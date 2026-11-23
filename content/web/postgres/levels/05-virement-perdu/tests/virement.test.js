import { test } from "node:test";
import assert from "node:assert/strict";
import { creerBase } from "../src/base.js";
import { virement } from "../src/virement.js";

const soldes = (db) => db.prepare("SELECT id, solde FROM comptes ORDER BY id").all().map((c) => c.solde);

test("un virement valide déplace l'argent", () => {
  const db = creerBase();
  virement(db, 1, 2, 50);
  assert.deepEqual(soldes(db), [450, 150]);
});

test("vers un compte inexistant : erreur et aucun débit", () => {
  const db = creerBase();
  assert.throws(() => virement(db, 1, 99, 50));
  assert.deepEqual(soldes(db), [500, 100], "le compte 1 a été débité malgré l'erreur");
});

test("solde insuffisant : erreur et rien ne bouge", () => {
  const db = creerBase();
  assert.throws(() => virement(db, 2, 1, 1000));
  assert.deepEqual(soldes(db), [500, 100]);
});

test("depuis un compte inexistant : erreur et aucun crédit", () => {
  const db = creerBase();
  assert.throws(() => virement(db, 99, 1, 50));
  assert.deepEqual(soldes(db), [500, 100], "le compte 1 a été crédité à partir de rien");
});

test("la somme des soldes ne change jamais", () => {
  const db = creerBase();
  for (const [de, vers, m] of [[1, 2, 30], [2, 99, 10], [1, 2, 9999], [2, 1, 5]]) {
    try {
      virement(db, de, vers, m);
    } catch {
      // erreurs attendues
    }
  }
  assert.equal(soldes(db).reduce((a, b) => a + b, 0), 600);
});
