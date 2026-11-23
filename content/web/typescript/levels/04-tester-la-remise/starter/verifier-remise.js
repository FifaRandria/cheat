// Les tests de la remise fidélité.
import assert from "node:assert/strict";

/**
 * Reçoit une version de remiseFidelite(total, anciennete).
 * Doit lever une erreur si cette version ne respecte pas la règle métier.
 */
export function verifierRemise(remiseFidelite) {
  // Exemple : un nouveau client n'a pas de remise.
  assert.equal(remiseFidelite(100, 0), 0);

  // À toi : ajoute les vérifications qui protègent toute la règle.
}
