import { test } from "node:test";
import assert from "node:assert/strict";
import { creerBase } from "../src/base.js";
import { commandesParClient } from "../src/rapport.js";

test("tous les clients apparaissent dans le rapport", () => {
  const lignes = commandesParClient(creerBase());
  assert.deepEqual(
    lignes.map((l) => l.nom),
    ["Ada", "Bob", "Eve", "Linus"],
  );
});

test("un client sans commande a nb = 0", () => {
  const linus = commandesParClient(creerBase()).find((l) => l.nom === "Linus");
  assert.ok(linus, "Linus n'apparaît pas dans le rapport");
  assert.equal(linus.nb, 0, `nb de Linus : ${linus.nb}`);
});

test("les comptes des autres clients sont justes", () => {
  const lignes = commandesParClient(creerBase());
  assert.deepEqual(
    lignes.filter((l) => l.nom !== "Linus"),
    [
      { nom: "Ada", nb: 2 },
      { nom: "Bob", nb: 1 },
      { nom: "Eve", nb: 1 },
    ],
  );
});
