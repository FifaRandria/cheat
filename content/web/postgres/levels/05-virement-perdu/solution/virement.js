export function virement(db, de, vers, montant) {
  if (!(montant > 0)) {
    throw new Error("Montant invalide");
  }

  db.exec("BEGIN");
  try {
    const debit = db.prepare("UPDATE comptes SET solde = solde - ? WHERE id = ?").run(montant, de);
    if (debit.changes === 0) {
      throw new Error(`Compte ${de} introuvable`);
    }
    const credit = db.prepare("UPDATE comptes SET solde = solde + ? WHERE id = ?").run(montant, vers);
    if (credit.changes === 0) {
      throw new Error(`Compte ${vers} introuvable`);
    }
    db.exec("COMMIT");
  } catch (erreur) {
    db.exec("ROLLBACK");
    throw erreur;
  }
}
