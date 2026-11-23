// Petites fonctions de dates, au format ISO « AAAA-MM-JJ ».
// Ce fichier n'est pas en cause.

/** ajouterJours("2026-11-20", 7) → "2026-11-27" */
export function ajouterJours(date, jours) {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + jours);
  return d.toISOString().slice(0, 10);
}

/** joursEntre("2026-11-08", "2026-11-20") → 12 */
export function joursEntre(debut, fin) {
  return Math.round((Date.parse(`${fin}T00:00:00Z`) - Date.parse(`${debut}T00:00:00Z`)) / 86_400_000);
}
