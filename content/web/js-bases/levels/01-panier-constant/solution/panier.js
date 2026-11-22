export function totalPanier(prix) {
  let total = 0;

  for (const p of prix) {
    total = total + p;
  }

  return total;
}
