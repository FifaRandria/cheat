## Cause racine

Le type `Paiement` avait été complété, mais pas les fonctions qui l'utilisent :

- `libelle` n'avait pas de `case "especes"`, et un `return undefined as unknown as string`
  final faisait taire le compilateur (un double mensonge) ;
- `frais` laissait `taux` à `undefined` pour les espèces : `montant * undefined` vaut `NaN`.

## Correctif

Un `case` par variante, et un `default` qui appelle une fonction acceptant `never` :

```ts
function inconnu(p: never): never {
  throw new Error(`type de paiement inconnu : ${(p as { type?: unknown }).type}`);
}
```

Si quelqu'un ajoute `{ type: "cheque" }` au type sans le traiter, la compilation échoue. Et si
une donnée inattendue arrive de l'API, l'erreur est explicite au lieu d'un `undefined`.

## Le réflexe à garder

- Une union discriminée se parcourt avec un `switch` complet et un `default` exhaustif.
- Ajouter une variante à un type, c'est demander au compilateur la liste de tout ce qu'il faut
  mettre à jour : laisse-le faire ce travail.
