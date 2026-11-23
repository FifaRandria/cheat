## Cause racine

Deux habitudes Python transposées telles quelles en JavaScript :

1. `sorted(scores)` trie des nombres en Python. En JavaScript, `scores.sort()` **sans
   comparateur** convertit en texte : `"100"` < `"87"` < `"9"`.
2. `sorted` renvoie une **nouvelle** liste en Python ; `sort` **modifie** le tableau en
   JavaScript.

Et un troisième bug, caché : retrouver un participant par son score (`find`) donnait deux fois
le même nom en cas d'égalité.

## Correctif

```js
[...scores].sort((a, b) => a - b);                    // copie + tri numérique
[...participants].sort((a, b) => b.score - a.score);  // trier les objets eux-mêmes
```

## Le réflexe à garder

- Toujours un comparateur pour trier des nombres en JavaScript.
- Savoir si une fonction **modifie** ses données ou en renvoie une copie : c'est écrit dans la
  documentation, et ça change d'un langage à l'autre.
- Tester avec des valeurs aux limites : 9, 10 et 100 n'ont pas le même nombre de chiffres.
