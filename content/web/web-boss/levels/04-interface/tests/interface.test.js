import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { monterBoite } from "../src/interface.js";
import { fetchDepuisApp, fetchFixe } from "./faux-fetch.js";
import { attendre, creerDocument } from "./mini-dom.js";
import { creerApp } from "./ref/app.js";
import { creerBase } from "./ref/boite.js";

const html = readFileSync(new URL("../src/page.html", import.meta.url), "utf8");
const stable = async () => {
  for (let i = 0; i < 30; i++) await attendre();
};

async function monter(jeton = "jeton-ada", { db = creerBase() } = {}) {
  const doc = creerDocument(html);
  const fetch = fetchDepuisApp(creerApp(db, () => "2026-11-20"));
  await monterBoite(doc, fetch, jeton);
  return { doc, fetch, db };
}
const lignes = (doc) => doc.querySelectorAll("#outils li");
const ligne = (doc, nom) => lignes(doc).find((li) => li.textContent.startsWith(nom));
const bouton = (doc, nom) => ligne(doc, nom)?.querySelector("button") ?? null;

test("le catalogue s'affiche, avec les outils prêtés marqués", async () => {
  const { doc } = await monter();
  assert.equal(lignes(doc).length, 5);
  assert.ok(ligne(doc, "Perceuse"), "une ligne commence par Perceuse");
  assert.ok(ligne(doc, "Scie sauteuse").querySelector("span")?.textContent.includes("Prêté"), "la scie est prêtée");
  assert.equal(bouton(doc, "Scie sauteuse"), null, "pas de bouton pour un outil prêté");
  assert.equal(doc.querySelector("#etat").textContent, "");
});

test("un outil disponible a un bouton Emprunter avec son id", async () => {
  const { doc } = await monter();
  const b = bouton(doc, "Perceuse");
  assert.ok(b, "pas de bouton sur la ligne Perceuse");
  assert.equal(b.textContent, "Emprunter");
  assert.equal(b.dataset.id, "1");
});

test("un visiteur sans jeton ne voit aucun bouton", async () => {
  const { doc } = await monter(null);
  assert.equal(doc.querySelectorAll("#outils button").length, 0);
});

test("pendant le chargement, un message s'affiche", async () => {
  const doc = creerDocument(html);
  const enCours = monterBoite(doc, fetchFixe({ "GET /api/outils": { corps: [] } }, { delai: 20 }), "jeton-ada");
  assert.equal(doc.querySelector("#etat").textContent, "Chargement…");
  await enCours;
  assert.equal(doc.querySelector("#etat").textContent, "");
});

test("un catalogue indisponible affiche une erreur", async () => {
  const doc = creerDocument(html);
  await monterBoite(doc, fetchFixe({ "GET /api/outils": { status: 500, corps: { erreur: "Erreur interne" } } }), "jeton-ada");
  assert.equal(doc.querySelector("#etat").textContent, "Impossible de charger le catalogue.");
  assert.equal(lignes(doc).length, 0);
});

test("emprunter envoie la bonne requête, affiche la date de retour et recharge", async () => {
  const { doc, fetch, db } = await monter();
  bouton(doc, "Perceuse").click();
  await stable();
  const post = fetch.appels.find((a) => a.methode === "POST");
  assert.ok(post, "aucun POST envoyé");
  assert.equal(post.url, "/api/prets");
  assert.equal(post.headers.authorization, "Bearer jeton-ada");
  assert.deepEqual(JSON.parse(post.corps), { outilId: 1 });
  assert.equal(doc.querySelector("#message").textContent, "Perceuse empruntée, à rendre le 2026-11-27.");
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM prets WHERE outil_id = 1").get().n, 1, "le prêt existe en base");
  assert.equal(bouton(doc, "Perceuse"), null, "après l'emprunt, la Perceuse doit apparaître comme prêtée");
});

test("si quelqu'un a emprunté entre temps : message clair, et catalogue à jour", async () => {
  const { doc, db } = await monter();
  db.prepare("INSERT INTO prets (outil_id, membre_id, debut, fin_prevue) VALUES (4, 2, '2026-11-20', '2026-11-27')").run();
  bouton(doc, "Ponceuse").click();
  await stable();
  assert.equal(doc.querySelector("#message").textContent, "Cet outil vient d'être emprunté par quelqu'un d'autre.");
  assert.equal(bouton(doc, "Ponceuse"), null, "le catalogue doit être rechargé");
});

test("un jeton invalide demande de se connecter", async () => {
  const { doc } = await monter("jeton-perime");
  bouton(doc, "Perceuse").click();
  await stable();
  assert.equal(doc.querySelector("#message").textContent, "Connecte-toi pour emprunter.");
});
