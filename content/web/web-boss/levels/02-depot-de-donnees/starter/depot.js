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

// ---------------------------------------------------------------------------
// À toi d'écrire les trois fonctions suivantes. Les deux fonctions au-dessus
// sont des exemples : une requête préparée avec des « ? », jamais de concaténation.
// ---------------------------------------------------------------------------

/**
 * Les outils, avec leur disponibilité : [{ id, nom, categorie, disponible }].
 * Si categorie est fournie, seulement cette catégorie. Une seule requête SQL.
 */
export function listerOutils(db, categorie) {
  // À toi de jouer.
}

/**
 * Enregistre un prêt de DUREE_PRET jours et renvoie
 * { id, outilId, membreId, debut, finPrevue, renduLe: null }.
 * Erreurs : ErreurMetier("OUTIL_INCONNU") ou ErreurMetier("DEJA_PRETE").
 */
export function emprunter(db, membreId, outilId, aujourdhui) {
  // À toi de jouer.
}

/**
 * Enregistre le retour d'un outil et renvoie le prêt mis à jour.
 * Erreurs : ErreurMetier("PRET_INCONNU") ou ErreurMetier("DEJA_RENDU").
 */
export function rendre(db, pretId, aujourdhui) {
  // À toi de jouer.
}
