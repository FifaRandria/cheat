## Cause racine

Il y avait **deux** bugs, avec le même symptôme : `NaN`.

**1. Un tour de boucle en trop.** Avec `i <= notes.length`, la boucle va jusqu'à
`i = 4` pour un tableau de 4 notes. Or `notes[4]` n'existe pas : il vaut `undefined`.
Et `nombre + undefined` donne `NaN`, qui « contamine » ensuite tout le calcul.

| i | notes[i] | somme |
|---|---|---|
| 0 | 12 | 12 |
| 1 | 15 | 27 |
| 2 | 9 | 36 |
| 3 | 18 | 54 |
| 4 | **undefined** | **NaN** |

**2. Une division par zéro.** Pour un tableau vide, on calcule `0 / 0`, qui vaut aussi `NaN`.

## Correctif

```js
if (notes.length === 0) {
  return 0;
}

for (let i = 0; i < notes.length; i++) { // < et non <=
```

## Le réflexe à garder

- Un `NaN` vient presque toujours d'un calcul avec `undefined` ou d'une division `0 / 0`.
- Pour parcourir un tableau : `i < tableau.length`. Ou mieux, `for (const note of notes)`,
  qui ne peut pas déborder.
- Pense toujours au **cas vide** : liste vide, texte vide, zéro. C'est là que les bugs se cachent.
