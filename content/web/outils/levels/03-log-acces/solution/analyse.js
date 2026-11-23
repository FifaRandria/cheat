export function erreursServeur(lignes) {
  const compte = {};
  for (const ligne of lignes) {
    const [, , url, statut] = ligne.trim().split(/\s+/);
    const code = Number(statut);
    if (code >= 500 && code <= 599) {
      const route = url.split("?")[0];
      compte[route] = (compte[route] ?? 0) + 1;
    }
  }
  return compte;
}
