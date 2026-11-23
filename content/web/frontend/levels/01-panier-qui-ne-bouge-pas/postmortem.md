## Cause racine

Les fonctions **modifiaient** le panier reçu (`push`, `splice`, `existant.qte += 1`) et le
renvoyaient. Pour React, l'ancien et le nouveau panier étaient **le même tableau** : en
comparant les références, il concluait que rien n'avait changé, et sautait le rendu.

Les données étaient bien mises à jour en mémoire, d'où les bons articles après un
rechargement. Seul l'affichage était en retard.

## Correctif

```js
export function ajouter(panier, produit) {
  if (panier.some((a) => a.id === produit.id)) {
    return panier.map((a) => (a.id === produit.id ? { ...a, qte: a.qte + 1 } : a));
  }
  return [...panier, { ...produit, qte: 1 }];
}

export function retirer(panier, id) {
  return panier.filter((a) => a.id !== id);
}
```

## Le réflexe à garder

- En React, on ne modifie jamais l'état : on renvoie une **nouvelle copie**.
- `push`, `splice`, `sort`, `obj.prop = …` sur l'état sont des signaux d'alarme.
- Un affichage qui ne se met à jour qu'après un rechargement trahit presque toujours une
  mutation.
