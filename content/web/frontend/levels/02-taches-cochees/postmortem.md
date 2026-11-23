## Cause racine

Deux mutations plus subtiles que `push` :

1. **`map` créait bien un nouveau tableau**, mais la fonction **modifiait l'objet tâche**
   (`t.fait = !t.fait`) avant de le renvoyer. Le nouveau tableau et l'historique partageaient
   le **même objet** : cocher dans l'un cochait dans l'autre. D'où un « Annuler » sans effet.
2. **`sort` trie le tableau sur place** et renvoie… le même tableau. Trier l'affichage
   réordonnait aussi l'état d'origine.

## Correctif

```js
export function basculer(taches, id) {
  return taches.map((t) => (t.id === id ? { ...t, fait: !t.fait } : t));
}

export function trierParTitre(taches) {
  return [...taches].sort((a, b) => a.titre.localeCompare(b.titre));
}
```

Les tâches non concernées gardent leur référence : React sait ainsi qu'elles n'ont pas changé,
et ne les redessine pas.

## Le réflexe à garder

- Un nouveau tableau ne suffit pas : l'élément modifié doit lui aussi être un **nouvel objet**.
- `sort` et `reverse` modifient le tableau sur place : copie d'abord (`[...t].sort()`), ou
  utilise `toSorted()`.
- Un historique ou un « Annuler » cassé est un excellent détecteur de mutations.
