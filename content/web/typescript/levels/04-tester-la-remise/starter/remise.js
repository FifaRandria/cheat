// Remise fidélité : la règle métier (référence).
export function remiseFidelite(total, anciennete) {
  if (total <= 0) return 0;
  const taux = anciennete >= 3 ? 0.1 : anciennete >= 1 ? 0.05 : 0;
  return Math.min(Math.round(total * taux * 100) / 100, 50);
}
