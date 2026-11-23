import { test } from "node:test";
import assert from "node:assert/strict";
import { ajouter, retirer } from "../src/panier.js";

const clavier = { id: 1, nom: "Clavier" };
const souris = { id: 2, nom: "Souris" };

test("ajouter renvoie un nouveau tableau et ne modifie pas l'ancien", () => {
  const avant = [];
  const apres = ajouter(avant, clavier);
  assert.notEqual(apres, avant, "même tableau renvoyé : React ignorera la mise à jour");
  assert.deepEqual(avant, []);
  assert.deepEqual(apres, [{ id: 1, nom: "Clavier", qte: 1 }]);
});

test("ajouter un produit déjà présent crée un nouvel article", () => {
  const avant = [{ id: 1, nom: "Clavier", qte: 1 }];
  const apres = ajouter(avant, clavier);
  assert.equal(apres[0].qte, 2);
  assert.equal(avant[0].qte, 1, "l'article d'origine a été modifié");
  assert.notEqual(apres[0], avant[0]);
});

test("retirer renvoie un nouveau tableau sans le produit", () => {
  const avant = [{ ...clavier, qte: 1 }, { ...souris, qte: 1 }];
  const apres = retirer(avant, 1);
  assert.deepEqual(apres, [{ id: 2, nom: "Souris", qte: 1 }]);
  assert.equal(avant.length, 2, "le panier d'origine a été modifié");
});
