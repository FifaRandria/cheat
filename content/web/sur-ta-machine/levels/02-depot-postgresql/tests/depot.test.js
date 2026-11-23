import { test } from "node:test";
import assert from "node:assert/strict";
import { emprunter, listerOutils, trouverOutil } from "../src/depot.js";
import { creerPool } from "./faux-pg.js";

test("listerOutils renvoie tous les outils, triés", async () => {
  const outils = await listerOutils(creerPool());
  assert.ok(Array.isArray(outils), `résultat : ${outils}`);
  assert.equal(outils.length, 5);
  assert.deepEqual(outils[0], { id: 1, nom: "Perceuse", categorie: "electro" });
});

test("listerOutils filtre par catégorie", async () => {
  const outils = await listerOutils(creerPool(), "electro");
  assert.deepEqual(outils.map((o) => o.id), [1, 2, 4]);
});

test("trouverOutil renvoie l'outil, ou null", async () => {
  const pool = creerPool();
  assert.deepEqual(await trouverOutil(pool, 3), { id: 3, nom: "Escabeau", categorie: "echelle" });
  assert.equal(await trouverOutil(pool, 99), null);
});

test("trouverOutil utilise un paramètre, jamais la valeur dans le texte SQL", async () => {
  const pool = creerPool();
  assert.equal(await trouverOutil(pool, "1 OR 1=1"), null, "l'injection a renvoyé un outil");
  for (const { texte } of pool.requetes) {
    assert.ok(!texte.includes("1 OR 1=1"), `valeur collée dans la requête : ${texte}`);
  }
});

test("emprunter insère le prêt et renvoie son id", async () => {
  const pool = creerPool();
  const id = await emprunter(pool, 1, 4, "2026-11-20", "2026-11-27");
  assert.equal(id, 2);
  const { rows } = await pool.query("SELECT outil_id, membre_id, fin_prevue FROM prets WHERE id = $1", [id]);
  assert.deepEqual(rows[0], { outil_id: 4, membre_id: 1, fin_prevue: "2026-11-27" }, "l'outil et le membre sont-ils dans le bon ordre ?");
});
