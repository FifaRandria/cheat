// Les tests de la remise fidélité.
import assert from "node:assert/strict";

export function verifierRemise(remiseFidelite) {
  // Moins d'un an : rien, jusqu'à la borne exclue
  assert.equal(remiseFidelite(100, 0), 0);
  assert.equal(remiseFidelite(100, 0.9), 0);

  // Pile sur la première borne, et juste avant la seconde : 5 %
  assert.equal(remiseFidelite(100, 1), 5);
  assert.equal(remiseFidelite(100, 2.9), 5);

  // Pile sur la seconde borne : 10 %
  assert.equal(remiseFidelite(100, 3), 10);

  // Arrondi au centime
  assert.equal(remiseFidelite(33.33, 3), 3.33);

  // Plafond à 50 €
  assert.equal(remiseFidelite(1000, 5), 50);

  // Total nul ou négatif
  assert.equal(remiseFidelite(0, 5), 0);
  assert.equal(remiseFidelite(-100, 5), 0);
}
