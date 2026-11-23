// Tests de non-régression de l'API : ils protègent les règles de l'association.
import assert from "node:assert/strict";

/**
 * nouvelleApp() renvoie une application neuve, avec une base neuve (données de départ).
 * La fonction doit LEVER UNE ERREUR (un assert qui échoue) si l'API ne respecte pas une règle.
 *
 * Rappel : app.handle({ method, path, headers, body, query }) → { status, body }
 */
export async function verifierApi(nouvelleApp) {
  // Exemple de vérification : le catalogue est public et répond 200.
  const app = nouvelleApp();
  const res = await app.handle({ method: "GET", path: "/outils", query: {} });
  assert.equal(res.status, 200);

  // À toi : écris les quatre vérifications demandées dans l'énoncé.
}
