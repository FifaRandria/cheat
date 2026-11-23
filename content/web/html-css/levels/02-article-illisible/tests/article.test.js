import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { byTag, describe, findAll, parseHTML, text } from "./mini-html.js";

const doc = parseHTML(readFileSync(new URL("../src/article.html", import.meta.url), "utf8"));
const titres = findAll(doc, (el) => /^h[1-6]$/.test(el.tag));

test("un seul titre de niveau 1, celui de l'article", () => {
  const h1 = byTag(doc, "h1");
  assert.equal(h1.length, 1, `${h1.length} éléments <h1> trouvés : ${h1.map(text).join(" | ")}`);
  assert.match(text(h1[0]), /crevaison/i, "le h1 doit être le titre de l'article");
});

test("les titres se suivent sans sauter de niveau", () => {
  let precedent = 0;
  for (const t of titres) {
    const niveau = Number(t.tag[1]);
    assert.ok(niveau <= precedent + 1, `<${t.tag}> « ${text(t)} » arrive juste après un h${precedent}`);
    precedent = niveau;
  }
});

test("chaque image a un attribut alt", () => {
  for (const img of byTag(doc, "img")) assert.ok("alt" in img.attrs, `${describe(img)} n'a pas d'attribut alt`);
});

test("les images informatives ont un alt descriptif, la décorative un alt vide", () => {
  for (const img of byTag(doc, "img")) {
    const deco = (img.attrs.class ?? "").split(/\s+/).includes("deco");
    const alt = (img.attrs.alt ?? "").trim();
    if (deco) assert.equal(alt, "", `${describe(img)} est décorative : alt="" attendu`);
    else {
      assert.ok(alt.length >= 10, `${describe(img)} : un alt descriptif est attendu (au moins quelques mots)`);
      assert.ok(!/\.(png|jpe?g|svg)$|^image$|^photo$/i.test(alt), `${describe(img)} : décris l'information, pas le fichier`);
    }
  }
});

test("aucun lien « cliquez ici » ou « en savoir plus »", () => {
  const vagues = /^(clique[zr]? ici|ici|en savoir plus|lien|plus)$/i;
  for (const a of byTag(doc, "a")) {
    assert.ok(!vagues.test(text(a)), `le lien vers ${a.attrs.href} dit seulement « ${text(a)} »`);
  }
});

test("le contenu est conservé : mêmes liens, même nombre d'images et de paragraphes", () => {
  assert.deepEqual(byTag(doc, "a").map((a) => a.attrs.href), ["/boutique/kit", "/guides/entretien"]);
  assert.equal(byTag(doc, "img").length, 3);
  assert.ok(byTag(doc, "p").length >= 5);
});
