import { test } from "node:test";
import assert from "node:assert/strict";
import { passerCommande } from "../src/commande.js";

test("une commande en stock est enregistrée", async () => {
  const r = await passerCommande(["clavier", "souris"]);
  assert.equal(r.ok, true);
  assert.equal(typeof r.id, "number");
});

test("une rupture de stock renvoie une erreur lisible au lieu de rejeter", async () => {
  let r;
  try {
    r = await passerCommande(["écran-4k"]);
  } catch (e) {
    assert.fail(`passerCommande a rejeté : ${e.message}`);
  }
  assert.deepEqual(r, { ok: false, erreur: "Stock insuffisant pour écran-4k" });
});

test("un panier mixte échoue proprement", async () => {
  const r = await passerCommande(["clavier", "écran-4k"]).catch((e) => ({ rejet: e.message }));
  assert.equal(r.ok, false, "la promesse a été rejetée au lieu de renvoyer { ok: false }");
});
