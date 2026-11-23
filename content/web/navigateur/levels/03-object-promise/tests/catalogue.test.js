import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { charger } from "../src/catalogue.js";
import { fetchFixe } from "./faux-fetch.js";
import { creerDocument } from "./mini-dom.js";

const OUTILS = [
  { id: 1, nom: "Perceuse", disponible: true },
  { id: 2, nom: "Scie sauteuse", disponible: false },
];
const page = () => creerDocument(readFileSync(new URL("../src/page.html", import.meta.url), "utf8"));
const lignes = (doc) => doc.querySelectorAll("#outils li").map((li) => li.textContent);
const etat = (doc) => doc.querySelector("#etat").textContent;

test("les outils s'affichent avec leur disponibilité", async () => {
  const doc = page();
  await charger(doc, fetchFixe({ "GET /api/outils": { corps: OUTILS } }));
  assert.deepEqual(lignes(doc), ["Perceuse (disponible)", "Scie sauteuse (prêtée)"]);
  assert.equal(etat(doc), "");
});

test("pendant le chargement : message et bouton désactivé", async () => {
  const doc = page();
  const enCours = charger(doc, fetchFixe({ "GET /api/outils": { corps: OUTILS } }, { delai: 20 }));
  assert.equal(etat(doc), "Chargement…");
  assert.equal(doc.querySelector("#recharger").disabled, true, "le bouton doit être désactivé pendant le chargement");
  await enCours;
  assert.equal(doc.querySelector("#recharger").disabled, false, "le bouton doit être réactivé à la fin");
});

test("une erreur de l'API affiche un message, pas de fausses lignes", async () => {
  const doc = page();
  await charger(doc, fetchFixe({ "GET /api/outils": { status: 503, corps: { erreur: "maintenance" } } }));
  assert.deepEqual(lignes(doc), []);
  assert.equal(etat(doc), "Impossible de charger les outils.");
  assert.equal(doc.querySelector("#recharger").disabled, false);
});

test("une coupure réseau affiche le même message", async () => {
  const doc = page();
  await charger(doc, fetchFixe({ "GET /api/outils": { reseau: true } }));
  assert.equal(etat(doc), "Impossible de charger les outils.");
  assert.equal(doc.querySelector("#recharger").disabled, false);
});

test("recharger remplace la liste au lieu de l'allonger", async () => {
  const doc = page();
  const fetch = fetchFixe({ "GET /api/outils": { corps: OUTILS } });
  await charger(doc, fetch);
  await charger(doc, fetch);
  assert.equal(lignes(doc).length, 2);
});
