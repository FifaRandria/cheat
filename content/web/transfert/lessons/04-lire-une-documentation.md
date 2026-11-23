---
id: transfert-04
title: Lire une documentation et du code inconnu
minutes: 10
summary: Trouver vite la bonne information dans une documentation, et s'orienter dans un code qu'on n'a pas écrit.
check:
  - prompt: Dans la documentation d'une fonction, que cherches-tu en premier ?
    choices:
      - L'histoire de la fonction
      - "Sa signature : ce qu'elle reçoit, ce qu'elle renvoie, et les erreurs qu'elle peut lever"
      - Le nom de son auteur
    answer: 1
  - prompt: Un assistant IA te propose une fonction qui n'existe pas dans la bibliothèque. Comment l'éviter ?
    choices:
      - "Vérifier chaque fonction proposée dans la documentation officielle, et l'essayer dans la console"
      - Lui faire confiance, il a raison la plupart du temps
    answer: 0
---

## Lire une page de documentation

Toutes les documentations de fonctions suivent à peu près le même plan. Exemple, la fonction
`sorted` de Python :

```text
sorted(iterable, /, *, key=None, reverse=False)
    Return a new sorted list from the items in iterable.
    key specifies a function of one argument that is used to extract
    a comparison key from each element.
```

Dans l'ordre, cherche :

1. **La signature** : ce qu'elle reçoit (`iterable`, `key`, `reverse`) et les valeurs par
   défaut.
2. **Ce qu'elle renvoie** : ici une **nouvelle** liste (l'originale n'est pas modifiée,
   contrairement à `liste.sort()`).
3. **Les erreurs** qu'elle peut lever.
4. **Un exemple**, souvent en bas de page : copie-le et essaie-le.

```python
membres = [{"nom": "Eve", "age": 31}, {"nom": "Ada", "age": 36}]
print(sorted(membres, key=lambda m: m["age"], reverse=True)[0]["nom"])
```

```output
Ada
```

> **Astuce** : la documentation officielle d'abord (MDN pour JavaScript, docs.python.org
> pour Python). Elle est à jour et exacte, ce qui n'est pas toujours le cas d'un vieux message
> de forum.

## S'orienter dans du code inconnu

Rejoindre un projet, c'est lire des milliers de lignes écrites par d'autres. Ne les lis pas
dans l'ordre : pars d'un **point d'entrée** et suis le fil.

1. Le **README** : comment lancer le projet et les tests.
2. Le **point d'entrée** : `index.js`, `main.py`, ou le script `start` du `package.json`.
3. **Une fonctionnalité** à la fois : pars de la route (`POST /prets`) et descends jusqu'à la
   requête SQL.
4. Les **tests** : ils montrent comment le code est censé être utilisé.
5. `git log` et `git blame` sur une ligne étrange : le message de commit explique souvent
   **pourquoi** elle existe.

C'est exactement ce que tu as fait dans chaque niveau de Rustine : comprendre un code que tu
n'avais pas écrit, assez pour le réparer.

## Les assistants IA

Un assistant IA est excellent pour expliquer un bout de code, traduire une syntaxe ou proposer
une piste. Mais il peut **inventer** une fonction qui n'existe pas, ou utiliser une version
périmée d'une bibliothèque.

- Vérifie chaque fonction proposée dans la documentation officielle.
- Exécute le code, et lance les tests.
- Ne colle jamais un code que tu ne pourrais pas expliquer.

## Ce que tu sais faire maintenant

- Lire une signature de fonction : paramètres, valeurs par défaut, retour, erreurs.
- Entrer dans un projet inconnu par le README, le point d'entrée et une fonctionnalité.
- Utiliser un assistant IA sans lui faire une confiance aveugle.
