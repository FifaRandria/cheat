import { test } from "node:test";
import assert from "node:assert/strict";
import { verifierRemise } from "../src/verifier-remise.js";
import { remiseFidelite } from "./ref-remise.js";

const arrondi = (x) => Math.round(x * 100) / 100;

const MUTANTS = {
  "la première borne est exclue (> 1 au lieu de >= 1)": (total, a) => {
    if (total <= 0) return 0;
    const taux = a >= 3 ? 0.1 : a > 1 ? 0.05 : 0;
    return Math.min(arrondi(total * taux), 50);
  },
  "la seconde borne est exclue (> 3 au lieu de >= 3)": (total, a) => {
    if (total <= 0) return 0;
    const taux = a > 3 ? 0.1 : a >= 1 ? 0.05 : 0;
    return Math.min(arrondi(total * taux), 50);
  },
  "le plafond de 50 € a disparu": (total, a) => {
    if (total <= 0) return 0;
    const taux = a >= 3 ? 0.1 : a >= 1 ? 0.05 : 0;
    return arrondi(total * taux);
  },
  "un total négatif donne une remise négative": (total, a) => {
    const taux = a >= 3 ? 0.1 : a >= 1 ? 0.05 : 0;
    return Math.min(arrondi(total * taux), 50);
  },
};

test("tes vérifications passent sur la vraie fonction", () => {
  verifierRemise(remiseFidelite);
});

for (const [nom, mutant] of Object.entries(MUTANTS)) {
  test(`tes vérifications détectent le mutant : ${nom}`, () => {
    assert.throws(() => verifierRemise(mutant), `aucune vérification n'a échoué alors que ${nom}`);
  });
}
