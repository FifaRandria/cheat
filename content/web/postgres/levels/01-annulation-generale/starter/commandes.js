// Annule une commande. Renvoie true si elle existait.
export function annulerCommande(db, id) {
  const resultat = db.prepare("UPDATE commandes SET statut = 'annulee'").run();
  return resultat.changes > 0;
}
