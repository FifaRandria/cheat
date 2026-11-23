---
id: machine-03
title: "Le backend en vrai : Express et PostgreSQL"
minutes: 25
summary: Lancer PostgreSQL avec Docker Compose, écrire le schéma, et porter l'API du projet final vers Express et le pilote pg.
check:
  - prompt: "Avec le pilote pg, comment écrit-on un paramètre dans une requête ?"
    choices:
      - "`?`, comme avec SQLite"
      - "`$1`, `$2`… numérotés, avec les valeurs dans un tableau"
    answer: 1
  - prompt: "Que renvoie `await pool.query(\"SELECT * FROM outils WHERE id = $1\", [3])` ?"
    choices:
      - "L'outil directement"
      - "Un objet résultat : les lignes sont dans `.rows` (ici `rows[0]`, ou undefined)"
    answer: 1
---

## La base : PostgreSQL dans un conteneur

À la racine du projet, `docker-compose.yml` (module « Docker ») :

```yaml
services:
  db:
    image: postgres:17
    environment:
      POSTGRES_USER: boite
      POSTGRES_PASSWORD: boite
      POSTGRES_DB: boite
    ports:
      - "5432:5432"
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
```

```bash
docker compose up -d
```

La base tourne en arrière-plan, et ses données survivent aux redémarrages grâce au volume.

## L'application Node

```bash
cd api
npm init -y
npm pkg set type=module
npm install express pg
```

- `type=module` : les fichiers utilisent `import` et `export`, comme dans tous les niveaux.
- `express` : le vrai framework. Le mini-express des niveaux a la **même** interface : tes routes
  du projet final fonctionnent presque telles quelles.
- `pg` : le pilote PostgreSQL pour Node.

Le fichier `api/.env` (ignoré par Git) :

```text
DATABASE_URL=postgresql://boite:boite@localhost:5432/boite
PORT=4000
```

## Le schéma

`api/schema.sql` reprend le modèle du projet final, en PostgreSQL :

```sql
CREATE TABLE IF NOT EXISTS membres (
  id    SERIAL PRIMARY KEY,
  nom   TEXT NOT NULL,
  jeton TEXT NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS outils (
  id        SERIAL PRIMARY KEY,
  nom       TEXT NOT NULL,
  categorie TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS prets (
  id         SERIAL PRIMARY KEY,
  outil_id   INTEGER NOT NULL REFERENCES outils(id),
  membre_id  INTEGER NOT NULL REFERENCES membres(id),
  debut      DATE NOT NULL,
  fin_prevue DATE NOT NULL,
  rendu_le   DATE
);
```

Et un petit script `api/migrer.js` qui l'exécute :

```js
import { readFile } from "node:fs/promises";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
await pool.query(await readFile(new URL("./schema.sql", import.meta.url), "utf8"));
console.log("Schéma appliqué.");
await pool.end();
```

```bash
node --env-file=.env migrer.js
```

## De SQLite à PostgreSQL

Trois différences avec les niveaux, et c'est tout :

| Niveaux (`node:sqlite`) | PostgreSQL (`pg`) |
|---|---|
| `db.prepare(sql).get(a, b)` | `await pool.query(sql, [a, b])` : **asynchrone** |
| paramètres `?` | paramètres **`$1`, `$2`**… |
| la ligne directement | le résultat : `.rows` (tableau), `.rows[0]`, `.rowCount` |

```js
// api/db.js
import pg from "pg";
export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// api/depot.js
import { pool } from "./db.js";

export async function membreParJeton(jeton) {
  const { rows } = await pool.query("SELECT id, nom FROM membres WHERE jeton = $1", [jeton]);
  return rows[0] ?? null;
}
```

Un niveau de ce module te fait réparer ce portage : c'est là que se glissent les oublis
d'`await` et les `?` restés en place.

## Le serveur

```js
// api/serveur.js
import express from "express";
import { routes } from "./routes.js";

const app = express();
app.use(express.json());          // lire les corps JSON
app.use("/api", routes);          // toutes les routes sous /api
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ erreur: "Erreur interne" });
});

const port = Number(process.env.PORT ?? 4000);
app.listen(port, () => console.log(`API prête sur http://localhost:${port}`));
```

```js
// api/routes.js
import express from "express";
import { listerOutils } from "./depot.js";

export const routes = express.Router();

routes.get("/outils", async (req, res) => {
  res.json(await listerOutils(req.query.categorie));
});
```

Express 5 transmet automatiquement les erreurs des fonctions `async` au gestionnaire
d'erreurs, comme le mini-express des niveaux.

Dans `package.json`, ajoute un script : `"dev": "node --watch --env-file=.env serveur.js"`.
`--watch` redémarre le serveur à chaque modification.

```bash
npm run dev
curl http://localhost:4000/api/outils
```

## Ta mission

- [ ] Lancer PostgreSQL avec Docker Compose.
- [ ] Créer `api/`, installer `express` et `pg`, écrire `.env` et `schema.sql`, appliquer le schéma.
- [ ] Insérer quelques membres et outils (un script, ou `docker compose exec db psql -U boite`).
- [ ] Porter le dépôt et les routes du projet final, puis tester chaque route avec `curl`.
- [ ] Commiter.

## Ce que tu sais faire maintenant

- Lancer une base PostgreSQL de développement avec Docker Compose.
- Créer une application Express, avec ses variables d'environnement.
- Porter du code SQLite vers PostgreSQL : `await`, `$1`, `.rows`.
