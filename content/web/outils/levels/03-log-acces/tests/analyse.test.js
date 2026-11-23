import { test } from "node:test";
import assert from "node:assert/strict";
import { erreursServeur } from "../src/analyse.js";

const LOG = [
  "2026-11-23T21:02:14 GET /api/produits 200 12ms",
  "2026-11-23T21:02:15 POST /api/commandes 500 88ms",
  "2026-11-23T21:02:15 POST /api/commandes 500 91ms",
  "2026-11-23T21:02:16 GET /api/panier?page=2 503 1204ms",
  "2026-11-23T21:02:16 GET /api/panier?page=3 503 1187ms",
  "2026-11-23T21:02:17 GET /api/produits/99 404 4ms",
];

test("les erreurs 500 sont comptées", () => {
  assert.equal(erreursServeur(LOG)["/api/commandes"], 2, JSON.stringify(erreursServeur(LOG)));
});

test("la query est retirée pour regrouper les routes", () => {
  assert.equal(erreursServeur(LOG)["/api/panier"], 2, JSON.stringify(erreursServeur(LOG)));
});

test("le résultat complet ne contient que les 5xx", () => {
  assert.deepEqual(erreursServeur(LOG), { "/api/commandes": 2, "/api/panier": 2 });
});

test("un 404 n'est pas une erreur serveur", () => {
  assert.deepEqual(erreursServeur(["2026-11-23T21:00:00 GET /x 404 3ms"]), {});
});
