import { test } from "node:test";
import assert from "node:assert/strict";
import { buildDashboard } from "../src/dashboard.js";

const ok = (data) => async () => data;
const ko = (message) => async () => {
  throw new Error(message);
};

test("toutes les sources répondent", async () => {
  const board = await buildDashboard({ a: ok(1), b: ok(2) });
  assert.deepEqual(board, {
    a: { status: "up", data: 1 },
    b: { status: "up", data: 2 },
  });
});

test("une source en panne n'empêche pas les autres de s'afficher", async () => {
  const board = await buildDashboard({ weather: ok({ temp: 24 }), stocks: ko("ECONNREFUSED") });
  assert.deepEqual(board.weather, { status: "up", data: { temp: 24 } });
  assert.deepEqual(board.stocks, { status: "down", error: "ECONNREFUSED" });
});

test("toutes les sources en panne : aucun rejet", async () => {
  const board = await buildDashboard({ a: ko("timeout"), b: ko("503") });
  assert.equal(board.a.status, "down");
  assert.equal(board.b.error, "503");
});

test("les sources par défaut produisent un tableau de bord partiel", async () => {
  const board = await buildDashboard();
  assert.equal(board.weather.status, "up");
  assert.equal(board.stocks.status, "down");
  assert.equal(board.news.status, "up");
});
