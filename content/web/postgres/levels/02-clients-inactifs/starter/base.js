// Base de données de démonstration (SQLite en mémoire, intégré à Node).
// Ce fichier n'est pas en cause dans les incidents.
//
//   const db = creerBase();
//   db.prepare("SELECT * FROM clients WHERE id = ?").get(1);
//   db.requetes   → nombre de requêtes exécutées depuis la création
import { DatabaseSync } from "node:sqlite";

const SCHEMA = `
  CREATE TABLE clients (
    id    INTEGER PRIMARY KEY,
    nom   TEXT NOT NULL,
    ville TEXT NOT NULL
  );
  CREATE TABLE commandes (
    id        INTEGER PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES clients(id),
    total     REAL NOT NULL,
    statut    TEXT NOT NULL DEFAULT 'payee'
  );
  CREATE TABLE comptes (
    id        INTEGER PRIMARY KEY,
    titulaire TEXT NOT NULL,
    solde     INTEGER NOT NULL CHECK (solde >= 0)
  );

  INSERT INTO clients (id, nom, ville) VALUES
    (1, 'Ada', 'Paris'), (2, 'Bob', 'Lyon'), (3, 'Eve', 'Paris'), (4, 'Linus', 'Nantes');
  INSERT INTO commandes (id, client_id, total, statut) VALUES
    (1, 1, 49, 'payee'), (2, 1, 25, 'payee'), (3, 2, 189, 'payee'), (4, 3, 12, 'payee');
  INSERT INTO comptes (id, titulaire, solde) VALUES
    (1, 'Ada', 500), (2, 'Bob', 100);
`;

export function creerBase() {
  const db = new DatabaseSync(":memory:");
  db.exec(SCHEMA);

  // Compteur de requêtes, pour repérer les pages qui en font trop.
  const compteur = { requetes: 0 };
  const prepare = db.prepare.bind(db);
  const exec = db.exec.bind(db);
  return {
    get requetes() {
      return compteur.requetes;
    },
    exec(sql) {
      compteur.requetes++;
      return exec(sql);
    },
    prepare(sql) {
      const stmt = prepare(sql);
      const compter =
        (fn) =>
        (...args) => {
          compteur.requetes++;
          return fn(...args);
        };
      // Lignes converties en objets ordinaires, plus simples à afficher et à comparer.
      const plain = (row) => (row ? { ...row } : row);
      return {
        all: compter((...a) => stmt.all(...a).map(plain)),
        get: compter((...a) => plain(stmt.get(...a))),
        run: compter((...a) => stmt.run(...a)),
      };
    },
  };
}
