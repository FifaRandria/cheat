export function commandesParClient(db) {
  return db
    .prepare(
      `SELECT clients.nom AS nom, COUNT(commandes.id) AS nb
       FROM clients
       LEFT JOIN commandes ON commandes.client_id = clients.id
       GROUP BY clients.id
       ORDER BY clients.id`,
    )
    .all();
}
