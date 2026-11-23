import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { computed, parseCSS } from "./mini-css.js";
import { byTag, parseHTML, text } from "./mini-html.js";

const css = readFileSync(new URL("../src/style.css", import.meta.url), "utf8");
const doc = parseHTML(readFileSync(new URL("../src/compte.html", import.meta.url), "utf8"));
const rules = parseCSS(css);
const bouton = (libelle) => byTag(doc, "button").find((b) => text(b).includes(libelle));

function valeur(libelle, prop) {
  const el = bouton(libelle);
  assert.ok(el, `bouton « ${libelle} » introuvable dans compte.html`);
  return computed(el, prop, rules);
}

test("le bouton Supprimer a un fond crimson", () => {
  const r = valeur("Supprimer", "background");
  assert.equal(r?.value, "crimson", `fond obtenu : ${r?.value} (règle gagnante : ${r?.selector})`);
});

test("le bouton Supprimer a un texte blanc", () => {
  const r = valeur("Supprimer", "color");
  assert.equal(r?.value, "white", `couleur obtenue : ${r?.value} (règle gagnante : ${r?.selector})`);
});

test("le bouton Enregistrer reste steelblue", () => {
  const r = valeur("Enregistrer", "background");
  assert.equal(r?.value, "steelblue", `fond obtenu : ${r?.value} (règle gagnante : ${r?.selector})`);
});

test("le bouton Aide, hors du formulaire, reste lightgray", () => {
  const r = valeur("Aide", "background");
  assert.equal(r?.value, "lightgray", `fond obtenu : ${r?.value} (règle gagnante : ${r?.selector})`);
});

test("sans !important", () => {
  assert.ok(!/!\s*important/i.test(css), "!important est interdit : corrige la spécificité");
});

test("le HTML n'a pas été modifié", () => {
  assert.equal(byTag(doc, "form")[0]?.attrs.id, "formulaire");
  assert.equal(bouton("Supprimer")?.attrs.class, "btn btn-danger");
});
