// Relances automatiques : la liste des outils rendus en retard, envoyée chaque matin.
import { joursEntre } from "./dates.js";

/**
 * Les prêts en retard au jour donné : [{ membre, outil, joursDeRetard }],
 * du plus gros retard au plus petit.
 */
export function listerRelances(db, aujourdhui) {
  // Une seule requête : la jointure ramène les noms, au lieu de deux requêtes par prêt.
  const prets = db
    .prepare(
      `SELECT m.nom AS membre, o.nom AS outil, p.fin_prevue AS finPrevue
       FROM prets p
       JOIN membres m ON m.id = p.membre_id
       JOIN outils o ON o.id = p.outil_id
       WHERE p.rendu_le IS NULL      -- un outil rendu n'est plus en retard
         AND p.fin_prevue < ?        -- rendu attendu aujourd'hui : pas encore en retard`,
    )
    .all(aujourdhui);

  return prets
    .map((p) => ({ membre: p.membre, outil: p.outil, joursDeRetard: joursEntre(p.finPrevue, aujourdhui) }))
    .sort((a, b) => b.joursDeRetard - a.joursDeRetard || a.membre.localeCompare(b.membre));
}
