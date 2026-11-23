// Le dépôt de la Boîte à outils, porté vers PostgreSQL (pilote pg).

export async function listerOutils(pool, categorie) {
  const resultat = pool.query(
    "SELECT id, nom, categorie FROM outils WHERE ? IS NULL OR categorie = ? ORDER BY id",
    [categorie ?? null, categorie ?? null],
  );
  return resultat.rows;
}

export async function trouverOutil(pool, id) {
  const resultat = await pool.query(`SELECT id, nom, categorie FROM outils WHERE id = ${id}`);
  return resultat;
}

export async function emprunter(pool, membreId, outilId, debut, finPrevue) {
  const resultat = await pool.query(
    "INSERT INTO prets (outil_id, membre_id, debut, fin_prevue) VALUES ($1, $2, $3, $4)",
    [membreId, outilId, debut, finPrevue],
  );
  return resultat.rows[0].id;
}
