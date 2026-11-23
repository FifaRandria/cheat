## Cause racine

Deux erreurs, qui ensemble rendaient la supervision presque aveugle :

1. **`statut > 500`** excluait le code **500** lui-même, de loin le plus fréquent. Seules les
   erreurs 501 à 599 étaient comptées. La comparaison mélangeait aussi un texte (`"500"`) et un
   nombre : mieux vaut convertir explicitement.
2. **La query n'était pas retirée** : `/api/panier?page=2` et `/api/panier?page=3` étaient
   comptés comme deux routes différentes, chacune avec trop peu d'erreurs pour déclencher une
   alerte.

## Correctif

```js
const code = Number(statut);
if (code >= 500 && code <= 599) {
  const route = url.split("?")[0];
  compte[route] = (compte[route] ?? 0) + 1;
}
```

## Le réflexe à garder

- Une condition sur une plage de valeurs : vérifie les **deux bornes**, incluses ou exclues.
- Regroupe les URL par **route**, sans la query, sinon tes statistiques s'éparpillent.
- Une supervision qui ne voit rien pendant un incident est elle-même un incident.
