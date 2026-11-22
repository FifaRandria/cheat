import { test } from "node:test";
import assert from "node:assert/strict";
import { peutSupprimer } from "../src/acces.js";

test("un administrateur peut supprimer", () => {
  assert.equal(peutSupprimer({ nom: "Ada", role: "admin" }), true);
});

test("un invité ne peut pas supprimer", () => {
  assert.equal(peutSupprimer({ nom: "Bob", role: "invite" }), false);
});

test("un lecteur ne peut pas supprimer", () => {
  assert.equal(peutSupprimer({ nom: "Eve", role: "lecteur" }), false);
});

test("la vérification ne modifie pas le rôle de l'utilisateur", () => {
  const invite = { nom: "Bob", role: "invite" };
  peutSupprimer(invite);
  assert.equal(invite.role, "invite", "le rôle a été modifié pendant la vérification !");
});
