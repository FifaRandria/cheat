## Ce qu'il fallait écrire

Une seule ligne suffisait, en enchaînant trois opérations :

```js
export function formaterPrix(montant) {
  return montant.toFixed(2).replace(".", ",") + " €";
}
```

1. `toFixed(2)` arrondit et garde **toujours** deux décimales : `3` devient `"3.00"`.
2. `replace(".", ",")` change le séparateur.
3. On ajoute l'espace et le symbole.

## Le piège évité

`0.1 + 0.2` vaut `0.30000000000000004` en JavaScript : les nombres à virgule ne sont pas exacts
en mémoire. `toFixed(2)` règle l'affichage. Pour **calculer** des montants, on arrondit à chaque
étape, ou on compte en centimes entiers.

## Le réflexe à garder

- Lire tous les tests avant d'écrire, puis les faire passer un par un.
- Chercher d'abord si une méthode toute faite existe (`toFixed`, `replace`…).
- En vrai projet, `Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" })` gère les
  formats de chaque pays, y compris les séparateurs de milliers.
