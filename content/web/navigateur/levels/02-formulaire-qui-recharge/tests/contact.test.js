import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { initialiser } from "../src/contact.js";
import { creerDocument } from "./mini-dom.js";

function page() {
  const doc = creerDocument(readFileSync(new URL("../src/page.html", import.meta.url), "utf8"));
  const envois = [];
  initialiser(doc, (donnees) => envois.push(donnees));
  const remplir = (nom, message) => {
    doc.querySelector("#nom").value = nom;
    doc.querySelector("#message").value = message;
  };
  return { doc, envois, remplir };
}

test("un clic sur Envoyer envoie le nom et le message saisis", () => {
  const { doc, envois, remplir } = page();
  remplir("  Ada ", " Bonjour ! ");
  doc.querySelector("#contact button").click();
  assert.deepEqual(envois, [{ nom: "Ada", message: "Bonjour !" }]);
});

test("la page ne se recharge pas", () => {
  const { doc, remplir } = page();
  remplir("Ada", "Bonjour");
  doc.querySelector("#contact button").click();
  assert.deepEqual(doc.rechargements, [], "le formulaire a rechargé la page");
});

test("la touche Entrée (soumission du formulaire) envoie aussi", () => {
  const { doc, envois, remplir } = page();
  remplir("Bob", "Une question");
  doc.querySelector("#contact").requestSubmit();
  assert.equal(envois.length, 1, "soumettre le formulaire n'a rien envoyé");
  assert.deepEqual(doc.rechargements, []);
});

test("un champ vide affiche une erreur et n'envoie rien", () => {
  const { doc, envois, remplir } = page();
  remplir("Ada", "   ");
  doc.querySelector("#contact button").click();
  assert.equal(envois.length, 0);
  assert.equal(doc.querySelector("#erreur").textContent, "Remplis tous les champs.");
});

test("après l'envoi : confirmation, erreur effacée, champs vidés", () => {
  const { doc, remplir } = page();
  remplir("", "");
  doc.querySelector("#contact button").click();
  remplir("Ada", "Bonjour");
  doc.querySelector("#contact button").click();
  assert.equal(doc.querySelector("#confirmation").textContent, "Merci Ada !");
  assert.equal(doc.querySelector("#erreur").textContent, "");
  assert.equal(doc.querySelector("#nom").value, "");
  assert.equal(doc.querySelector("#message").value, "");
});

test("un nom piégé s'affiche comme du texte", () => {
  const { doc, remplir } = page();
  remplir('<img src=x onerror="alert(1)">', "Coucou");
  doc.querySelector("#contact button").click();
  const confirmation = doc.querySelector("#confirmation");
  assert.equal(confirmation.querySelector("img"), null, "une balise <img> a été injectée dans la page");
  assert.ok(confirmation.textContent.includes("<img"), "le nom doit s'afficher tel quel");
});
