import { test } from "node:test";
import assert from "node:assert/strict";
import { emailsPremium } from "../src/clients.js";

const clients = [
  { nom: "Ada", email: "ada@ex.com", premium: true },
  { nom: "Bob", email: "bob@ex.com", premium: false },
  { nom: "Eve", email: "eve@ex.com", premium: true },
];

test("renvoie les e-mails des clients premium, dans l'ordre", () => {
  assert.deepEqual(emailsPremium(clients), ["ada@ex.com", "eve@ex.com"]);
});

test("aucun client premium : liste vide", () => {
  assert.deepEqual(emailsPremium([clients[1]]), []);
});

test("ne renvoie jamais de valeur undefined", () => {
  assert.ok(!emailsPremium(clients).includes(undefined), "la liste contient undefined");
});
