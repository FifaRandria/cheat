## Cause racine

`total` était déclaré avec `const`, c'est-à-dire comme une boîte scellée. Au premier tour de
boucle, `total = total + p` essaie de la modifier : JavaScript refuse et lève
`TypeError: Assignment to constant variable.`

Le panier vide fonctionnait parce que la boucle ne faisait **aucun tour** : personne
n'essayait de modifier `total`. Un bug qui n'apparaît que dans certains cas est souvent caché
dans un bloc qui ne s'exécute pas toujours.

## Correctif

```js
let total = 0;
```

## Le réflexe à garder

- `const` par défaut, `let` pour ce qui change (compteurs, totaux, accumulateurs).
- Le message d'erreur donnait le nom du problème **et** la ligne : `panier.js:6`.
  Lis toujours l'emplacement indiqué avant de chercher ailleurs.
