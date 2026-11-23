import { test } from "node:test";
import assert from "node:assert/strict";
import { resumePanier } from "../src/resume.js";

test("un panier vide", () => {
  assert.deepEqual(resumePanier([]), { nbArticles: 0, total: 0, plusCher: null });
});

test("un seul article", () => {
  assert.deepEqual(resumePanier([{ nom: "Souris", prix: 20, quantite: 1 }]), {
    nbArticles: 1,
    total: 20,
    plusCher: "Souris",
  });
});

test("les quantités comptent dans le nombre d'articles et le total", () => {
  const r = resumePanier([
    { nom: "Clavier", prix: 49.9, quantite: 2 },
    { nom: "Tapis", prix: 9.9, quantite: 1 },
  ]);
  assert.equal(r.nbArticles, 3);
  assert.equal(r.total, 109.7);
});

test("le plus cher se juge au prix unitaire, pas au total de la ligne", () => {
  const r = resumePanier([
    { nom: "Câble", prix: 5, quantite: 30 },
    { nom: "Écran", prix: 129, quantite: 1 },
  ]);
  assert.equal(r.plusCher, "Écran");
});

test("le total est arrondi au centime", () => {
  const r = resumePanier([
    { nom: "A", prix: 0.1, quantite: 1 },
    { nom: "B", prix: 0.2, quantite: 1 },
  ]);
  assert.equal(r.total, 0.3);
});
