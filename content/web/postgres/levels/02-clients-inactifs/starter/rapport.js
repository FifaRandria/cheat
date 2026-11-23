// Nombre de commandes de chaque client, triés par id
export function commandesParClient(db) {
  return db
    .prepare(
      `SELECT clients.nom AS nom, COUNT(*) AS nb
       FROM clients
       JOIN commandes ON commandes.client_id = clients.id
       GROUP BY clients.id
       ORDER BY clients.id`,
    )
    .all();
}
