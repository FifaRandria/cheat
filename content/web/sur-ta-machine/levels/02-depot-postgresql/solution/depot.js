// Le dépôt de la Boîte à outils, porté vers PostgreSQL (pilote pg).

export async function listerOutils(pool, categorie) {
  const { rows } = await pool.query(
    "SELECT id, nom, categorie FROM outils WHERE $1::text IS NULL OR categorie = $1 ORDER BY id",
    [categorie ?? null],
  );
  return rows;
}

export async function trouverOutil(pool, id) {
  const { rows } = await pool.query("SELECT id, nom, categorie FROM outils WHERE id = $1", [id]);
  return rows[0] ?? null;
}

export async function emprunter(pool, membreId, outilId, debut, finPrevue) {
  const { rows } = await pool.query(
    "INSERT INTO prets (outil_id, membre_id, debut, fin_prevue) VALUES ($1, $2, $3, $4) RETURNING id",
    [outilId, membreId, debut, finPrevue],
  );
  return rows[0].id;
}
