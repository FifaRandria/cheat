// Relances automatiques : la liste des outils rendus en retard, envoyée chaque matin.
import { joursEntre } from "./dates.js";

/**
 * Les prêts en retard au jour donné : [{ membre, outil, joursDeRetard }],
 * du plus gros retard au plus petit.
 */
export function listerRelances(db, aujourdhui) {
  const prets = db.prepare("SELECT * FROM prets WHERE fin_prevue <= ?").all(aujourdhui);

  const relances = [];
  for (const p of prets) {
    const membre = db.prepare("SELECT nom FROM membres WHERE id = ?").get(p.membre_id);
    const outil = db.prepare("SELECT nom FROM outils WHERE id = ?").get(p.outil_id);
    relances.push({ membre: membre.nom, outil: outil.nom, joursDeRetard: joursEntre(p.fin_prevue, aujourdhui) });
  }

  return relances.sort((a, b) => a.joursDeRetard - b.joursDeRetard);
}
