// Dernières commandes, avec le nom du client
export function dernieresCommandes(db) {
  const commandes = db.prepare("SELECT id, client_id, total FROM commandes ORDER BY id").all();

  return commandes.map((commande) => {
    const client = db.prepare("SELECT nom FROM clients WHERE id = ?").get(commande.client_id);
    return { id: commande.id, total: commande.total, client: client.nom };
  });
}
