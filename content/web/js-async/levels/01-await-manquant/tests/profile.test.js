import { test } from "node:test";
import assert from "node:assert/strict";
import { getProfile } from "../src/profile.js";

test("renvoie le nom et l'offre d'un utilisateur existant", async () => {
  assert.deepEqual(await getProfile(1), { name: "Ada", plan: "pro" });
});

test("fonctionne pour un autre utilisateur", async () => {
  assert.deepEqual(await getProfile(2), { name: "Linus", plan: "free" });
});

test("rejette quand l'utilisateur n'existe pas", async () => {
  await assert.rejects(() => getProfile(99), /introuvable/);
});
