---
id: machine-05
title: Les tests et la CI de ton projet
minutes: 18
summary: Tester l'API avec node:test et fetch, et faire tourner ces tests à chaque push avec GitHub Actions et une vraie base PostgreSQL.
check:
  - prompt: Pourquoi démarrer l'API sur le port 0 dans les tests ?
    choices:
      - "Le système choisit un port libre : pas de conflit avec ton serveur de développement déjà lancé"
      - Pour aller plus vite
    answer: 0
  - prompt: D'où vient la base de données pendant la CI ?
    choices:
      - De ton ordinateur
      - "D'un service PostgreSQL déclaré dans le workflow, créé neuf à chaque exécution"
    answer: 1
---

## Rendre l'application testable

Sépare la **création** de l'application de son **démarrage** :

```js
// api/app.js
import express from "express";
import { routes } from "./routes.js";

export function creerApp() {
  const app = express();
  app.use(express.json());
  app.use("/api", routes);
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ erreur: "Erreur interne" });
  });
  return app;
}
```

`serveur.js` se contente alors de `creerApp().listen(port)`. Tu retrouves l'idée de
`creerApp(db)` du projet final.

## Un test d'API, sans dépendance

```js
// api/test/outils.test.js
import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { creerApp } from "../app.js";
import { pool } from "../db.js";

let serveur;
let base;

before(() => {
  serveur = creerApp().listen(0);              // un port libre, choisi par le système
  base = `http://localhost:${serveur.address().port}`;
});

after(async () => {
  serveur.close();
  await pool.end();
});

test("GET /api/outils renvoie le catalogue", async () => {
  const reponse = await fetch(`${base}/api/outils`);
  assert.equal(reponse.status, 200);
  assert.ok(Array.isArray(await reponse.json()));
});

test("POST /api/prets sans connexion répond 401", async () => {
  const reponse = await fetch(`${base}/api/prets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ outilId: 1 }),
  });
  assert.equal(reponse.status, 401);
});
```

Dans `package.json` : `"test": "node --env-file-if-exists=.env --test"`. Reprends aussi les
vérifications de l'étape 6 du projet final : chaque règle de l'association mérite son test.

## La CI avec GitHub Actions

`.github/workflows/ci.yml`, à la racine du dépôt :

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  api:
    runs-on: ubuntu-latest
    services:
      db:
        image: postgres:17
        env:
          POSTGRES_USER: boite
          POSTGRES_PASSWORD: boite
          POSTGRES_DB: boite
        ports: ["5432:5432"]
        options: >-
          --health-cmd "pg_isready -U boite"
          --health-interval 5s --health-timeout 5s --health-retries 10
    env:
      DATABASE_URL: postgresql://boite:boite@localhost:5432/boite
    defaults:
      run:
        working-directory: api
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: node migrer.js
      - run: npm test

  web:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: web
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npm run build
```

Le `healthcheck` fait attendre la CI jusqu'à ce que PostgreSQL soit prêt : sans lui, les
premiers tests échouent au hasard. C'est la CI de Rustine elle-même, en plus petit.

## Ta mission

- [ ] Séparer `app.js` et `serveur.js`.
- [ ] Écrire au moins un test par route, dont les cas d'erreur (401, 404, 409).
- [ ] Ajouter le workflow, pousser, et obtenir une CI verte.
- [ ] Protéger la branche `main` sur GitHub : fusion seulement si la CI est verte.

## Ce que tu sais faire maintenant

- Tester une API Express avec `node:test` et `fetch`, sur un port libre.
- Écrire un workflow GitHub Actions avec une base PostgreSQL de test.
- Faire de la CI un garde-fou avant chaque fusion.
