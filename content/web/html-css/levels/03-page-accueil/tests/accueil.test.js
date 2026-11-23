import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { byTag, elementChildren, parseHTML, text } from "./mini-html.js";

const doc = parseHTML(readFileSync(new URL("../src/index.html", import.meta.url), "utf8"));
const body = byTag(doc, "body")[0];
const main = byTag(doc, "main");

test("la page s'adapte aux téléphones (meta viewport)", () => {
  const meta = byTag(doc, "meta").find((m) => m.attrs.name === "viewport");
  assert.ok(meta, "aucune balise <meta name=\"viewport\"> dans le head");
  assert.match(meta.attrs.content ?? "", /width=device-width/, "content doit contenir width=device-width");
});

test("le body contient un en-tête, un contenu principal et un pied de page, dans cet ordre", () => {
  const ordre = elementChildren(body).map((e) => e.tag).filter((t) => ["header", "main", "footer"].includes(t));
  assert.deepEqual(ordre, ["header", "main", "footer"], `balises trouvées : ${ordre.join(", ") || "aucune"}`);
});

test("l'en-tête contient une navigation : une liste d'au moins 3 liens", () => {
  const nav = byTag(byTag(doc, "header")[0] ?? { children: [] }, "nav")[0];
  assert.ok(nav, "aucun <nav> dans le <header>");
  const liens = byTag(nav, "li").filter((li) => byTag(li, "a").some((a) => a.attrs.href));
  assert.ok(byTag(nav, "ul", "ol").length > 0, "les liens de navigation se mettent dans une liste (ul)");
  assert.ok(liens.length >= 3, `${liens.length} éléments de liste avec un lien (au moins 3 attendus)`);
});

test("un seul contenu principal, avec un h1 qui parle de Rustine", () => {
  assert.equal(main.length, 1, `${main.length} élément(s) <main>`);
  const h1 = byTag(doc, "h1");
  assert.equal(h1.length, 1, `${h1.length} élément(s) <h1>`);
  assert.match(text(h1[0]), /rustine/i);
});

test("au moins deux sections, chacune avec un h2 et un paragraphe", () => {
  const sections = byTag(main[0] ?? { children: [] }, "section");
  assert.ok(sections.length >= 2, `${sections.length} section(s) dans le main`);
  for (const s of sections) {
    assert.equal(byTag(s, "h2").length, 1, "chaque section a exactement un titre h2");
    assert.ok(byTag(s, "p").some((p) => text(p).length > 0), `la section « ${text(byTag(s, "h2")[0] ?? s)} » n'a pas de paragraphe`);
  }
});

test("une image avec un texte alternatif", () => {
  const imgs = byTag(main[0] ?? { children: [] }, "img");
  assert.ok(imgs.length >= 1, "aucune image dans le contenu principal");
  for (const img of imgs) assert.ok((img.attrs.alt ?? "").trim().length > 0, `image ${img.attrs.src} sans alt`);
});

test("un pied de page avec le symbole ©", () => {
  const footer = byTag(doc, "footer")[0];
  assert.ok(footer && text(footer).includes("©"), "le footer doit contenir ©");
});
