import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { monterCatalogue } from "../src/catalogue.js";
import { creerDocument, Evenement, saisir } from "./mini-dom.js";

const OUTILS = [
  { id: 1, nom: "Perceuse", categorie: "electro" },
  { id: 2, nom: "Scie sauteuse", categorie: "electro" },
  { id: 3, nom: "Escabeau", categorie: "echelle" },
  { id: 4, nom: "Ponceuse", categorie: "electro" },
  { id: 5, nom: "Brouette", categorie: "jardin" },
];

function page() {
  const doc = creerDocument(readFileSync(new URL("../src/page.html", import.meta.url), "utf8"));
  monterCatalogue(doc, OUTILS);
  return {
    noms: () => doc.querySelectorAll("#outils li").map((li) => li.textContent),
    compteur: () => doc.querySelector("#compteur").textContent,
    taper: (texte) => saisir(doc.querySelector("#filtre"), texte),
    choisir: (valeur) => {
      const select = doc.querySelector("#categorie");
      select.value = valeur;
      select.dispatchEvent(new Evenement("change"));
    },
  };
}

test("au départ, tous les outils sont affichés", () => {
  const p = page();
  assert.deepEqual(p.noms(), ["Perceuse", "Scie sauteuse", "Escabeau", "Ponceuse", "Brouette"]);
  assert.equal(p.compteur(), "5 outils");
});

test("la recherche filtre par nom, sans tenir compte des majuscules", () => {
  const p = page();
  p.taper("  CEUSE ");
  assert.deepEqual(p.noms(), ["Perceuse", "Ponceuse"]);
  assert.equal(p.compteur(), "2 outils");
});

test("la catégorie filtre, et la valeur vide les remet toutes", () => {
  const p = page();
  p.choisir("jardin");
  assert.deepEqual(p.noms(), ["Brouette"]);
  assert.equal(p.compteur(), "1 outil");
  p.choisir("");
  assert.equal(p.noms().length, 5);
});

test("les deux filtres se combinent", () => {
  const p = page();
  p.choisir("electro");
  p.taper("s");
  assert.deepEqual(p.noms(), ["Perceuse", "Scie sauteuse", "Ponceuse"]);
  p.taper("scie");
  assert.deepEqual(p.noms(), ["Scie sauteuse"]);
  p.choisir("echelle");
  assert.deepEqual(p.noms(), []);
  assert.equal(p.compteur(), "Aucun outil");
});
