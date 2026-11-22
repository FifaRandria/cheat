/**
 * Renvoie les éléments de la page demandée.
 * Les pages sont numérotées à partir de 1.
 */
export function paginate(items, page, perPage) {
  const start = page * perPage;
  const end = start + perPage;
  return items.slice(start, end);
}

/** Nombre total de pages nécessaires pour afficher tous les éléments. */
export function pageCount(items, perPage) {
  return Math.floor(items.length / perPage);
}
