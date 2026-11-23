// Compte les erreurs serveur (5xx) par route dans un log d'accès.
// Format d'une ligne : "date méthode url statut durée"
export function erreursServeur(lignes) {
  const compte = {};
  for (const ligne of lignes) {
    const [, , url, statut] = ligne.split(" ");
    if (statut > 500) {
      compte[url] = (compte[url] ?? 0) + 1;
    }
  }
  return compte;
}
