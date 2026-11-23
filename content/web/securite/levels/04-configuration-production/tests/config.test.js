import { test } from "node:test";
import assert from "node:assert/strict";
import { chargerConfig } from "../src/config.js";

const SECRET = "x".repeat(40);
const PROD = { NODE_ENV: "production", JWT_SECRET: SECRET, ORIGINES: "https://rustine.fr, https://admin.rustine.fr" };

test("en production, un secret absent empêche le démarrage", () => {
  assert.throws(() => chargerConfig({ NODE_ENV: "production" }), /JWT_SECRET/);
});

test("en production, un secret trop court empêche le démarrage", () => {
  assert.throws(() => chargerConfig({ NODE_ENV: "production", JWT_SECRET: "dev-secret" }), /JWT_SECRET/);
});

test("en production, le secret fourni est utilisé", () => {
  assert.equal(chargerConfig(PROD).jwtSecret, SECRET);
});

test("en développement, un secret par défaut est toléré", () => {
  const c = chargerConfig({});
  assert.ok(typeof c.jwtSecret === "string" && c.jwtSecret.length > 0);
});

test("le cookie de session est httpOnly, sameSite lax, et secure en production", () => {
  const c = chargerConfig(PROD).cookie;
  assert.equal(c.httpOnly, true, "httpOnly");
  assert.equal(c.sameSite, "lax", "sameSite");
  assert.equal(c.secure, true, "secure en production");
});

test("une session dure 7 jours au plus", () => {
  const { maxAge } = chargerConfig(PROD).cookie;
  assert.ok(maxAge > 0 && maxAge <= 7 * 24 * 60 * 60 * 1000, `maxAge = ${maxAge} ms`);
});

test("CORS : les origines de la liste sont acceptées", () => {
  const c = chargerConfig(PROD);
  assert.equal(c.origineAutorisee("https://rustine.fr"), true);
  assert.equal(c.origineAutorisee("https://admin.rustine.fr"), true);
});

test("CORS : les origines qui ressemblent ne passent pas", () => {
  const c = chargerConfig(PROD);
  for (const o of ["https://rustine.fr.pirate.example", "https://pirate-rustine.fr", "http://rustine.fr", undefined, ""]) {
    assert.equal(c.origineAutorisee(o), false, `origine ${JSON.stringify(o)} acceptée`);
  }
});

test("CORS : sans liste, seul le frontend local est accepté", () => {
  const c = chargerConfig({});
  assert.equal(c.origineAutorisee("http://localhost:3000"), true);
  assert.equal(c.origineAutorisee("http://localhost:3000.pirate.example"), false);
});
