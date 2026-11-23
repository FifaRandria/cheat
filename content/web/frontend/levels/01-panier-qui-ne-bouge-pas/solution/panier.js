export function ajouter(panier, produit) {
  const existant = panier.some((a) => a.id === produit.id);
  if (existant) {
    return panier.map((a) => (a.id === produit.id ? { ...a, qte: a.qte + 1 } : a));
  }
  return [...panier, { ...produit, qte: 1 }];
}

export function retirer(panier, id) {
  return panier.filter((a) => a.id !== id);
}
