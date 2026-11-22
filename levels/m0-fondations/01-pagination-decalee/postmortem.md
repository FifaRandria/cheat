## Cause racine

Le code mélangeait deux façons de compter : les **pages commencent à 1** pour
l'utilisateur, alors que les **index des tableaux commencent à 0**.

- `page * perPage` donne 10 pour la page 1 : on saute les dix premiers articles.
- `Math.floor(23 / 10)` donne 2 : la dernière page, incomplète, n'est jamais comptée.

## Correctif

```js
const start = (page - 1) * perPage;      // la page 1 commence à l'index 0
return Math.ceil(items.length / perPage); // une page incomplète reste une page
```

## Le réflexe à garder

C'est une erreur **off-by-one** (décalage de un), l'une des plus fréquentes.
Quand un calcul dépend d'une borne, teste trois valeurs à la main : **la première,
la dernière et celle juste après**. Ici, la page 1, la page 3 et la page 4.
