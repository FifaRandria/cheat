import { test } from "node:test";
import assert from "node:assert/strict";
import { verifierApi } from "../src/scenarios.js";
import { creerApp } from "./ref/app.js";
import { creerBase } from "./ref/boite.js";

const vraie = () => creerApp(creerBase(), () => "2026-11-20");

/** Une API sabotée : elle relaie la vraie, sauf dans le cas que `saboter` modifie. */
const sabotee = (saboter) => () => {
  const app = vraie();
  return { handle: async (req) => (await saboter(app, req)) ?? app.handle(req) };
};

const SABOTAGES = {
  "le filtre par catégorie est ignoré": sabotee((app, req) =>
    req.method === "GET" && req.path === "/outils" ? app.handle({ ...req, query: {} }) : null,
  ),
  "l'emprunt sans connexion est accepté": sabotee((app, req) =>
    req.method === "POST" && req.path === "/prets" && !req.headers?.authorization
      ? app.handle({ ...req, headers: { authorization: "Bearer jeton-eve" } })
      : null,
  ),
  "le double emprunt est accepté": sabotee(async (app, req) => {
    if (req.method !== "POST" || req.path !== "/prets") return null;
    const r = await app.handle(req);
    return r.status === 409 ? { status: 201, body: { id: 999, outilId: req.body?.outilId }, headers: {} } : r;
  }),
  "on peut rendre le prêt d'un autre": sabotee(async (app, req) => {
    if (req.method !== "POST" || !/^\/prets\/\d+\/retour$/.test(req.path)) return null;
    const r = await app.handle(req);
    return r.status === 403 ? { status: 200, body: { id: 1, renduLe: "2026-11-20" }, headers: {} } : r;
  }),
};

test("tes vérifications passent sur la vraie API", async () => {
  await verifierApi(vraie);
});

for (const [nom, api] of Object.entries(SABOTAGES)) {
  test(`tes vérifications détectent le sabotage : ${nom}`, async () => {
    let detecte = false;
    try {
      await verifierApi(api);
    } catch {
      detecte = true;
    }
    assert.ok(detecte, `verifierApi n'a rien vu alors que ${nom}`);
  });
}
