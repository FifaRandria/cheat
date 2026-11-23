import { test } from "node:test";
import assert from "node:assert/strict";
import { lireProfil, villeAffichee } from "../src/profil.ts";

test("un profil complet est accepté", () => {
  const p = lireProfil({ nom: "Ada", email: "ada@ex.fr", adresse: { ville: "Paris" } });
  assert.deepEqual(p, { nom: "Ada", email: "ada@ex.fr", adresse: { ville: "Paris" } });
});

test("un profil sans adresse est accepté", () => {
  assert.deepEqual(lireProfil({ nom: "Ada", email: "ada@ex.fr" }), { nom: "Ada", email: "ada@ex.fr" });
});

test("des données qui ne sont pas un objet donnent null", () => {
  for (const d of [null, undefined, "Ada", 42, []]) {
    assert.equal(lireProfil(d), null, `données ${JSON.stringify(d)}`);
  }
});

test("des champs manquants ou mal typés donnent null", () => {
  const cas = [
    { name: "Eve", mail: "eve@ex.fr" },
    { nom: "", email: "eve@ex.fr" },
    { nom: 42, email: "eve@ex.fr" },
    { nom: "Eve", email: "pas-un-email" },
    { nom: "Bob", email: "bob@ex.fr", adresse: { cp: "69001" } },
    { nom: "Bob", email: "bob@ex.fr", adresse: "Lyon" },
  ];
  for (const d of cas) assert.equal(lireProfil(d), null, `données ${JSON.stringify(d)}`);
});

test("la ville s'affiche en majuscules", () => {
  assert.equal(villeAffichee({ nom: "Ada", email: "ada@ex.fr", adresse: { ville: "Lyon" } }), "LYON");
});

test("sans adresse, la ville est inconnue", () => {
  assert.equal(villeAffichee({ nom: "Ada", email: "ada@ex.fr" }), "Ville inconnue");
});
