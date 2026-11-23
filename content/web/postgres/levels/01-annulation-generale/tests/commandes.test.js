import { test } from "node:test";
import assert from "node:assert/strict";
import { creerBase } from "../src/base.js";
import { annulerCommande } from "../src/commandes.js";

const statuts = (db) => db.prepare("SELECT id, statut FROM commandes ORDER BY id").all();

test("la commande demandée est annulée", () => {
  const db = creerBase();
  annulerCommande(db, 3);
  assert.equal(db.prepare("SELECT statut FROM commandes WHERE id = 3").get().statut, "annulee");
});

test("les autres commandes ne sont pas touchées", () => {
  const db = creerBase();
  annulerCommande(db, 3);
  const touchees = statuts(db).filter((c) => c.statut === "annulee").map((c) => c.id);
  assert.deepEqual(touchees, [3], `commandes annulées : ${touchees.join(", ")}`);
});

test("renvoie true pour une commande existante, false sinon", () => {
  const db = creerBase();
  assert.equal(annulerCommande(db, 1), true);
  assert.equal(annulerCommande(db, 999), false);
});
