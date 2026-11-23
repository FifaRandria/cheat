export function annulerCommande(db, id) {
  const resultat = db.prepare("UPDATE commandes SET statut = 'annulee' WHERE id = ?").run(id);
  return resultat.changes > 0;
}
