// Logique du panier, appelée par setPanier(...) dans les composants React.
// Doit toujours renvoyer un NOUVEAU panier.

export function ajouter(panier, produit) {
  const existant = panier.find((a) => a.id === produit.id);
  if (existant) {
    existant.qte += 1;
  } else {
    panier.push({ ...produit, qte: 1 });
  }
  return panier;
}

export function retirer(panier, id) {
  const index = panier.findIndex((a) => a.id === id);
  if (index !== -1) panier.splice(index, 1);
  return panier;
}
