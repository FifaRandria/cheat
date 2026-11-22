export function prixTTC(prixHT) {
  return prixHT * 1.2;
}

export function etiquette(prixHT) {
  return `${prixTTC(prixHT).toFixed(2)} € TTC`;
}
