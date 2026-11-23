import { test } from "node:test";
import assert from "node:assert/strict";
import { carteCommentaire, echapperHTML } from "../src/commentaires.js";

test("les chevrons sont échappés", () => {
  assert.equal(echapperHTML("<b>gras</b>"), "&lt;b&gt;gras&lt;/b&gt;");
});

test("l'esperluette est échappée une seule fois", () => {
  assert.equal(echapperHTML("Tom & Jerry"), "Tom &amp; Jerry");
  assert.equal(echapperHTML("1 < 2 & 3"), "1 &lt; 2 &amp; 3");
});

test("les guillemets et les apostrophes sont échappés", () => {
  assert.equal(echapperHTML(`"l'atelier"`), "&quot;l&#39;atelier&quot;");
});

test("un nombre est accepté", () => {
  assert.equal(echapperHTML(42), "42");
});

test("le texte piégé reste du texte", () => {
  const html = carteCommentaire({ auteur: "visiteur", texte: `<img src="x" onerror="alert(1)">` });
  assert.ok(!html.includes("<img"), `une balise <img> a été injectée :\n${html}`);
  assert.ok(html.includes("&lt;img"), "le texte doit s'afficher, échappé");
});

test("un auteur piégé ne peut pas sortir de l'attribut", () => {
  const html = carteCommentaire({ auteur: `Ada" onmouseover="alert(1)`, texte: "bonjour" });
  assert.ok(!html.includes(`" onmouseover="`), `l'attribut a été cassé :\n${html}`);
  assert.ok(html.includes(`data-auteur="Ada&quot; onmouseover=&quot;alert(1)"`));
});

test("un commentaire normal s'affiche normalement", () => {
  const html = carteCommentaire({ auteur: "Ada", texte: "Super atelier" });
  assert.ok(html.includes("<h3>Ada</h3>"));
  assert.ok(html.includes("<p>Super atelier</p>"));
});
