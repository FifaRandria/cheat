// Base de données de la Boîte à outils (SQLite en mémoire, intégré à Node).
// Ce fichier n'est pas en cause : il crée une base neuve, déjà remplie, à chaque appel.
//
//   const db = creerBase();
//   db.prepare("SELECT * FROM outils WHERE id = ?").get(1);
//   db.requetes   → nombre de requêtes exécutées depuis la création
import { DatabaseSync } from "node:sqlite";

const SCHEMA = `
  CREATE TABLE membres (
    id    INTEGER PRIMARY KEY,
    nom   TEXT NOT NULL,
    jeton TEXT NOT NULL UNIQUE
  );
  CREATE TABLE outils (
    id        INTEGER PRIMARY KEY,
    nom       TEXT NOT NULL,
    categorie TEXT NOT NULL
  );
  CREATE TABLE prets (
    id         INTEGER PRIMARY KEY,
    outil_id   INTEGER NOT NULL REFERENCES outils(id),
    membre_id  INTEGER NOT NULL REFERENCES membres(id),
    debut      TEXT NOT NULL,          -- date ISO : 2026-11-20
    fin_prevue TEXT NOT NULL,
    rendu_le   TEXT                    -- NULL tant que l'outil n'est pas rendu
  );

  INSERT INTO membres (id, nom, jeton) VALUES
    (1, 'Ada', 'jeton-ada'), (2, 'Bob', 'jeton-bob'), (3, 'Eve', 'jeton-eve');
  INSERT INTO outils (id, nom, categorie) VALUES
    (1, 'Perceuse', 'electro'), (2, 'Scie sauteuse', 'electro'), (3, 'Escabeau', 'echelle'),
    (4, 'Ponceuse', 'electro'), (5, 'Brouette', 'jardin');
  INSERT INTO prets (id, outil_id, membre_id, debut, fin_prevue, rendu_le) VALUES
    (1, 2, 2, '2026-11-01', '2026-11-08', NULL),
    (2, 3, 1, '2026-10-01', '2026-10-08', '2026-10-04');
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
