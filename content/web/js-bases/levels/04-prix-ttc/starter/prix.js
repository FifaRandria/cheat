// TVA de 20 %
export function prixTTC(prixHT) {
  const ttc = prixHT * 1.2;
  console.log("prix TTC calculé :", ttc);
}

// Texte affiché sur la page produit, par exemple "120.00 € TTC"
export function etiquette(prixHT) {
  return `${prixTTC(prixHT).toFixed(2)} € TTC`;
}
