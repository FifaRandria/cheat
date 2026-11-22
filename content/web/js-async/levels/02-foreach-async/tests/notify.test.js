import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { notifyAll } from "../src/notify.js";
import { outbox } from "../src/mailer.js";

const users = [
  { email: "ada@example.com" },
  { email: "grace@example.com" },
  { email: "linus@example.com" },
];

beforeEach(() => {
  outbox.length = 0;
});

test("renvoie le nombre d'e-mails envoyés", async () => {
  assert.equal(await notifyAll(users), 3);
});

test("attend la fin de tous les envois avant de rendre la main", async () => {
  await notifyAll(users);
  assert.equal(outbox.length, 3, "certains e-mails partent après la fin de notifyAll");
});

test("une liste vide n'envoie rien", async () => {
  assert.equal(await notifyAll([]), 0);
  assert.equal(outbox.length, 0);
});
