export function dernieresCommandes(db) {
  return db
    .prepare(
      `SELECT commandes.id AS id, commandes.total AS total, clients.nom AS client
       FROM commandes
       JOIN clients ON clients.id = commandes.client_id
       ORDER BY commandes.id`,
    )
    .all();
}
