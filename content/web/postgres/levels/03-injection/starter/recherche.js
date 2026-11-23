// Recherche des clients par nom exact
export function rechercherClient(db, nom) {
  const sql = "SELECT id, nom, ville FROM clients WHERE nom = '" + nom + "' ORDER BY id";
  return db.prepare(sql).all();
}
