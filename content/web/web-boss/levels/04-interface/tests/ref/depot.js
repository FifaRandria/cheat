// Dépôt de données : toutes les requêtes SQL de la Boîte à outils sont ici.
import { ajouterJours } from "./dates.js";

export const DUREE_PRET = 7; // jours

/** Une erreur « métier » : une règle de l'association n'est pas respectée. */
export class ErreurMetier extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

/** Le membre qui possède ce jeton de connexion, ou null. */
export function membreParJeton(db, jeton) {
  return db.prepare("SELECT id, nom FROM membres WHERE jeton = ?").get(jeton) ?? null;
}

/** Un prêt par son id, ou null. */
export function trouverPret(db, pretId) {
  return (
    db
      .prepare(
        `SELECT id, outil_id AS outilId, membre_id AS membreId, debut, fin_prevue AS finPrevue, rendu_le AS renduLe
         FROM prets WHERE id = ?`,
      )
      .get(pretId) ?? null
  );
}

/** Les outils, avec leur disponibilité, éventuellement filtrés par catégorie. Une seule requête. */
export function listerOutils(db, categorie) {
  const lignes = db
    .prepare(
      `SELECT o.id, o.nom, o.categorie,
              NOT EXISTS (SELECT 1 FROM prets p WHERE p.outil_id = o.id AND p.rendu_le IS NULL) AS disponible
       FROM outils o
       WHERE ? IS NULL OR o.categorie = ?
       ORDER BY o.id`,
    )
    .all(categorie ?? null, categorie ?? null);
  return lignes.map((o) => ({ ...o, disponible: o.disponible === 1 }));
}

/** Enregistre un prêt de DUREE_PRET jours. */
export function emprunter(db, membreId, outilId, aujourdhui) {
  const outil = db.prepare("SELECT id FROM outils WHERE id = ?").get(outilId);
  if (!outil) throw new ErreurMetier("OUTIL_INCONNU", `L'outil ${outilId} n'existe pas`);

  const enCours = db.prepare("SELECT id FROM prets WHERE outil_id = ? AND rendu_le IS NULL").get(outilId);
  if (enCours) throw new ErreurMetier("DEJA_PRETE", `L'outil ${outilId} est déjà prêté`);

  const finPrevue = ajouterJours(aujourdhui, DUREE_PRET);
  const r = db
    .prepare("INSERT INTO prets (outil_id, membre_id, debut, fin_prevue) VALUES (?, ?, ?, ?)")
    .run(outilId, membreId, aujourdhui, finPrevue);
  return { id: Number(r.lastInsertRowid), outilId, membreId, debut: aujourdhui, finPrevue, renduLe: null };
}

/** Enregistre le retour d'un outil. */
export function rendre(db, pretId, aujourdhui) {
  const pret = trouverPret(db, pretId);
  if (!pret) throw new ErreurMetier("PRET_INCONNU", `Le prêt ${pretId} n'existe pas`);
  if (pret.renduLe) throw new ErreurMetier("DEJA_RENDU", `Le prêt ${pretId} est déjà rendu`);

  db.prepare("UPDATE prets SET rendu_le = ? WHERE id = ?").run(aujourdhui, pretId);
  return { ...pret, renduLe: aujourdhui };
}

/** L'historique des prêts d'un membre, avec le nom des outils. */
export function pretsDuMembre(db, membreId) {
  return db
    .prepare(
      `SELECT p.id, o.nom AS outil, p.debut, p.fin_prevue AS finPrevue, p.rendu_le AS renduLe
       FROM prets p JOIN outils o ON o.id = p.outil_id
       WHERE p.membre_id = ?
       ORDER BY p.id`,
    )
    .all(membreId);
}
