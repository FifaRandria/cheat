import { test } from "node:test";
import assert from "node:assert/strict";
import { scryptSync } from "node:crypto";
import { readFileSync } from "node:fs";
import { hacherMotDePasse, verifierMotDePasse } from "../src/comptes.js";

const MDP = "correct cheval pile agrafe";

test("le format est sel:empreinte (16 octets de sel, 64 octets d'empreinte)", () => {
  const stocke = hacherMotDePasse(MDP);
  assert.match(stocke, /^[0-9a-f]{32}:[0-9a-f]{128}$/, `valeur stockée : ${stocke}`);
});

test("l'empreinte est calculée avec scrypt et le sel stocké", () => {
  const [sel, empreinte] = hacherMotDePasse(MDP).split(":");
  assert.equal(empreinte, scryptSync(MDP, sel, 64).toString("hex"));
});

test("deux mots de passe identiques donnent deux valeurs différentes", () => {
  assert.notEqual(hacherMotDePasse(MDP), hacherMotDePasse(MDP));
});

test("le bon mot de passe est accepté, un autre est refusé", () => {
  const stocke = hacherMotDePasse(MDP);
  assert.equal(verifierMotDePasse(MDP, stocke), true);
  assert.equal(verifierMotDePasse("Correct cheval pile agrafe", stocke), false);
  assert.equal(verifierMotDePasse("", stocke), false);
});

test("une valeur stockée mal formée donne false, sans planter", () => {
  for (const stocke of ["", "pas-de-separateur", "abc:", ":def", "abc:zz", "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"]) {
    assert.equal(verifierMotDePasse(MDP, stocke), false, `valeur ${JSON.stringify(stocke)}`);
  }
});

test("la comparaison se fait en temps constant (timingSafeEqual)", () => {
  const source = readFileSync(new URL("../src/comptes.js", import.meta.url), "utf8");
  assert.ok(source.includes("timingSafeEqual"), "utilise timingSafeEqual pour comparer les empreintes");
  assert.ok(!/createHash\(\s*["']sha256/.test(source), "sha256 ne doit plus servir aux mots de passe");
});
