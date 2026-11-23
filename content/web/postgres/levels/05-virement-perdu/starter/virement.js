// Virement d'un compte à un autre (les soldes sont en euros entiers)
export function virement(db, de, vers, montant) {
  if (!(montant > 0)) {
    throw new Error("Montant invalide");
  }

  db.prepare("UPDATE comptes SET solde = solde - ? WHERE id = ?").run(montant, de);

  const credit = db.prepare("UPDATE comptes SET solde = solde + ? WHERE id = ?").run(montant, vers);
  if (credit.changes === 0) {
    throw new Error(`Compte ${vers} introuvable`);
  }
}
