// Faux pilote « pg » pour les tests : même interface que pg.Pool (query asynchrone, paramètres
// $1, $2…, résultat { rows, rowCount }), avec une base SQLite en mémoire derrière.
// Comme PostgreSQL, il refuse les paramètres « ? ». Ce fichier n'est pas en cause.
import { DatabaseSync } from "node:sqlite";

const SCHEMA = `
  CREATE TABLE membres (id INTEGER PRIMARY KEY, nom TEXT NOT NULL, jeton TEXT NOT NULL UNIQUE);
  CREATE TABLE outils (id INTEGER PRIMARY KEY, nom TEXT NOT NULL, categorie TEXT NOT NULL);
  CREATE TABLE prets (
    id INTEGER PRIMARY KEY, outil_id INTEGER NOT NULL, membre_id INTEGER NOT NULL,
    debut TEXT NOT NULL, fin_prevue TEXT NOT NULL, rendu_le TEXT
  );
  INSERT INTO membres VALUES (1, 'Ada', 'jeton-ada'), (2, 'Bob', 'jeton-bob');
  INSERT INTO outils VALUES (1, 'Perceuse', 'electro'), (2, 'Scie sauteuse', 'electro'),
    (3, 'Escabeau', 'echelle'), (4, 'Ponceuse', 'electro'), (5, 'Brouette', 'jardin');
  INSERT INTO prets VALUES (1, 2, 2, '2026-11-01', '2026-11-08', NULL);
`;

export function creerPool() {
  const db = new DatabaseSync(":memory:");
  db.exec(SCHEMA);
  const pool = {
    requetes: [],
    async query(texte, valeurs = []) {
      pool.requetes.push({ texte, valeurs });
      const sansChaines = texte.replace(/'[^']*'/g, "''");
      if (sansChaines.includes("?")) {
        throw new Error('syntax error at or near "?" (PostgreSQL utilise $1, $2…)');
      }
      const numeros = [...sansChaines.matchAll(/\$(\d+)/g)].map((m) => Number(m[1]));
      const attendus = numeros.length ? Math.max(...numeros) : 0;
      if (attendus !== valeurs.length) {
        throw new Error(`bind message supplies ${valeurs.length} parameters, but prepared statement requires ${attendus}`);
      }
      // Traduction vers SQLite : $1 devient ?1, et les conversions PostgreSQL (::text) sont retirées.
      const stmt = db.prepare(texte.replace(/\$(\d+)/g, "?$1").replace(/::[a-z]+/gi, ""));
      if (/^\s*(select|with)\b/i.test(texte) || /\breturning\b/i.test(texte)) {
        const rows = stmt.all(...valeurs).map((r) => ({ ...r }));
        return { rows, rowCount: rows.length };
      }
      const r = stmt.run(...valeurs);
      return { rows: [], rowCount: Number(r.changes) };
    },
  };
  return pool;
}
