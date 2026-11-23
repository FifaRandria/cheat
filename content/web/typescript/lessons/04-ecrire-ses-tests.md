---
id: typescript-04
title: Écrire ses propres tests
minutes: 15
summary: Choisir quoi tester, écrire des tests lisibles, viser les bornes, et vérifier que ses tests détectent vraiment les bugs.
check:
  - prompt: "Une remise s'applique à partir de 3 ans d'ancienneté. Quelles valeurs tester en priorité ?"
    choices:
      - "1 et 10"
      - "Juste autour de la borne : 2 (pas de remise) et 3 (remise)"
      - Seulement 3
    answer: 1
  - prompt: "Un test sans aucun assert…"
    choices:
      - "…passe toujours, et ne protège de rien"
      - "…échoue toujours"
    answer: 0
  - prompt: Que signifie « tuer un mutant » ?
    choices:
      - Supprimer du code mort
      - "Un test échoue sur une version volontairement modifiée (bugguée) du code : il a détecté le bug"
    answer: 1
---

## Pourquoi écrire des tests ?

Dans les niveaux, les tests étaient fournis. Dans un vrai projet, c'est toi qui les écris.
Ils servent à trois choses :

1. **Vérifier** que le code fait ce qui est demandé.
2. **Protéger** : quand quelqu'un modifie le code dans six mois, les tests crient si une règle
   est cassée. On parle de tests de **non-régression**.
3. **Documenter** : un test bien nommé explique le comportement mieux qu'un commentaire.

## La structure d'un test : préparer, agir, vérifier

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { ajouterAuPanier } from "./panier.js";

test("ajouter un article déjà présent augmente sa quantité", () => {
  // Préparer
  const panier = [{ id: 1, quantite: 1 }];
  // Agir
  const resultat = ajouterAuPanier(panier, 1);
  // Vérifier
  assert.deepEqual(resultat, [{ id: 1, quantite: 2 }]);
});
```

- **Un comportement par test**, avec un nom qui le décrit en français.
- `assert.equal` pour une valeur simple, `assert.deepEqual` pour un objet ou un tableau.
- `assert.throws(() => …)` pour vérifier qu'une erreur est levée, `assert.rejects` pour une
  promesse.

## Quoi tester ? Les bornes d'abord

Les bugs se cachent **aux frontières**. Pour la règle « 5 % de remise à partir d'un an,
10 % à partir de trois ans », les valeurs qui comptent sont :

| Valeur | Pourquoi |
|---|---|
| 0 | le cas de base |
| 0,9 et 1 | juste avant et sur la première borne |
| 2,9 et 3 | juste avant et sur la seconde borne |
| une grosse valeur | pour vérifier un éventuel plafond |
| une valeur absurde (négative) | pour vérifier la robustesse |

Tester 1 et 10 ne dit rien de ce qui se passe à 3 : un `>` à la place de `>=` passerait
inaperçu.

## Tester ses tests

Un test qui ne vérifie rien passe toujours. Comment savoir si tes tests sont bons ? On
**sabote** volontairement le code (un `>=` devient `>`, un plafond disparaît) et on regarde si
au moins un test échoue. Chaque version sabotée s'appelle un **mutant**, et un test qui échoue
dessus le **tue**.

```js run
function remise(anciennete) {
  return anciennete >= 3 ? 0.1 : 0;
}
function mutant(anciennete) {
  return anciennete > 3 ? 0.1 : 0;        // la borne a bougé
}

// Un test faible : 10 ans
console.log(remise(10) === mutant(10));   // true : le mutant survit
// Un test sur la borne : 3 ans
console.log(remise(3) === mutant(3));     // false : le mutant est tué
```

Des outils (Stryker pour JavaScript et TypeScript, mutmut pour Python) génèrent ces mutants
automatiquement. Le taux de couverture (« 90 % des lignes exécutées ») ne suffit pas : une
ligne exécutée par un test sans `assert` est « couverte », mais pas vérifiée.

> **À retenir** : un bon test échoue quand le code est faux. Écris d'abord les cas aux bornes,
> puis demande-toi pour chaque règle : « si quelqu'un cassait ça, quel test le verrait ? ».

## Ce que tu sais faire maintenant

- Écrire un test lisible : préparer, agir, vérifier.
- Choisir les valeurs à tester en partant des bornes.
- Vérifier une erreur levée avec `assert.throws`.
- Évaluer la qualité de tes tests en pensant aux mutants.
