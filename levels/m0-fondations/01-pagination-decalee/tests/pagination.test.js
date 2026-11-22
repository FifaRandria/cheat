import { test } from "node:test";
import assert from "node:assert/strict";
import { paginate, pageCount } from "../src/pagination.js";

const articles = Array.from({ length: 23 }, (_, i) => `article-${i + 1}`);

test("la page 1 commence au premier article", () => {
  const page = paginate(articles, 1, 10);
  assert.equal(page[0], "article-1");
  assert.equal(page.length, 10);
});

test("la page 3 contient les 3 derniers articles", () => {
  assert.deepEqual(paginate(articles, 3, 10), ["article-21", "article-22", "article-23"]);
});

test("pageCount compte la dernière page incomplète", () => {
  assert.equal(pageCount(articles, 10), 3);
  assert.equal(pageCount(articles.slice(0, 20), 10), 2);
});

test("une page au-delà de la fin est vide", () => {
  assert.deepEqual(paginate(articles, 4, 10), []);
});
