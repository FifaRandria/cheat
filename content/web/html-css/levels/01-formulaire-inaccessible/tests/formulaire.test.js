import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { byTag, closest, describe, parseHTML, text } from "./mini-html.js";

const doc = parseHTML(readFileSync(new URL("../src/inscription.html", import.meta.url), "utf8"));
const form = byTag(doc, "form")[0];
const champ = (name) => byTag(doc, "input").find((i) => i.attrs.name === name);

function labelDe(input) {
  const englobant = closest(input, "label");
  if (englobant) return englobant;
  if (!input.attrs.id) return null;
  return byTag(doc, "label").find((l) => l.attrs.for === input.attrs.id) ?? null;
}

test("le formulaire et ses trois champs existent toujours (name inchangés)", () => {
  assert.ok(form, "aucun <form> trouvé");
  for (const name of ["nom", "email", "motdepasse"]) assert.ok(champ(name), `champ name="${name}" introuvable`);
});

test("chaque champ a un label relié, avec un texte", () => {
  for (const input of byTag(doc, "input")) {
    const label = labelDe(input);
    assert.ok(label, `${describe(input)} n'a aucun label relié (for = id, ou champ dans le label)`);
    assert.ok(text(label).length > 0, `le label de ${describe(input)} est vide`);
  }
});

test("l'e-mail est de type email, le mot de passe est masqué", () => {
  assert.equal(champ("email")?.attrs.type, "email", "le champ email doit avoir type=\"email\"");
  assert.equal(champ("motdepasse")?.attrs.type, "password", "le mot de passe doit avoir type=\"password\"");
});

test("les trois champs sont obligatoires", () => {
  for (const name of ["nom", "email", "motdepasse"]) {
    assert.ok("required" in (champ(name)?.attrs ?? {}), `le champ ${name} n'a pas l'attribut required`);
  }
});

test("le formulaire s'envoie avec un vrai bouton, atteignable au clavier", () => {
  const boutons = byTag(form, "button").filter((b) => (b.attrs.type ?? "submit") === "submit");
  assert.equal(boutons.length, 1, "il faut un <button> d'envoi (type submit) dans le formulaire");
  assert.match(text(boutons[0]), /inscri/i, "le bouton doit dire ce qu'il fait (S'inscrire)");
  const faux = byTag(doc, "div", "span").filter((e) => "onclick" in e.attrs);
  assert.equal(faux.length, 0, "il reste un élément cliquable qui n'est pas un bouton");
});
