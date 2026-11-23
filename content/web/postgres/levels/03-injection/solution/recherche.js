export function rechercherClient(db, nom) {
  return db.prepare("SELECT id, nom, ville FROM clients WHERE nom = ? ORDER BY id").all(nom);
}
