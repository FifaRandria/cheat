import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { initialiser } from "../src/panier.js";
import { creerDocument } from "./mini-dom.js";

function page() {
  const doc = creerDocument(readFileSync(new URL("../src/page.html", import.meta.url), "utf8"));
  initialiser(doc);
  return {
    quantite: () => doc.querySelector("#quantite").textContent,
    ajouter: () => doc.querySelector("#btn-ajouter").click(),
    vider: () => doc.querySelector("#btn-vider").click(),
  };
}

test("au chargement, la quantité vaut 0", () => {
  assert.equal(page().quantite(), "0");
});

test("chaque clic sur Ajouter augmente la quantité", () => {
  const p = page();
  p.ajouter();
  assert.equal(p.quantite(), "1");
  p.ajouter();
  p.ajouter();
  assert.equal(p.quantite(), "3");
});

test("Vider remet la quantité à 0, à l'écran", () => {
  const p = page();
  p.ajouter();
  p.ajouter();
  p.vider();
  assert.equal(p.quantite(), "0");
  p.ajouter();
  assert.equal(p.quantite(), "1", "après Vider, Ajouter repart de 0");
});
