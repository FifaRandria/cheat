---
id: transfert-01
title: Apprendre un nouveau langage, la méthode
minutes: 12
summary: Ce qui se transfère d'un langage à l'autre, ce qui change, et une méthode pour être productif en quelques jours.
check:
  - prompt: Qu'est-ce qui se transfère le mieux d'un langage à l'autre ?
    choices:
      - La syntaxe
      - "Les concepts (variables, boucles, fonctions, erreurs) et les familles de bugs"
      - Les noms des bibliothèques
    answer: 1
  - prompt: Tu découvres Go. Quelle première étape est la plus efficace ?
    choices:
      - Lire toute la spécification du langage avant d'écrire une ligne
      - "Faire le tutoriel officiel, puis réécrire en Go un petit programme que tu connais déjà"
      - Commencer directement un gros projet
    answer: 1
---

## Tu ne repars pas de zéro

Ton deuxième langage s'apprend **beaucoup plus vite** que le premier. Le premier t'a appris
deux choses : une syntaxe, et surtout une façon de penser. La seconde se transfère presque
entièrement.

| Ce qui se transfère | Ce qui change |
|---|---|
| variables, conditions, boucles, fonctions | la syntaxe (accolades ou indentation…) |
| listes, dictionnaires, objets | les noms : `push` ou `append`, `length` ou `len` |
| découper un problème, lire une erreur | les **idiomes** : la façon « naturelle » d'écrire |
| SQL, HTTP, Git, Docker, tests | l'écosystème : gestionnaire de paquets, frameworks |
| **les familles de bugs** | les **pièges propres** au langage |

## Les familles de bugs sont universelles

Les bugs que tu as réparés dans Rustine ne sont pas des bugs « JavaScript » ou « Python ». Ce
sont des **familles** qu'on retrouve partout :

| Famille | En JavaScript | En Python | En Java, Go, PHP… |
|---|---|---|---|
| Décalage de un | `i <= tab.length` | `range(1, len(l))` | partout où il y a des indices |
| Valeur absente | `undefined` | `None`, `KeyError` | `null`, `NullPointerException`, `nil` |
| Attente oubliée | `await` manquant | `await` manquant (asyncio) | `await`, `Future`, goroutines |
| Requêtes N+1 | une requête dans une boucle | pareil | pareil, dans tous les ORM |
| Injection SQL | concaténation | f-string dans la requête | concaténation |

> **À retenir** : quand tu lis du code dans un langage inconnu, cherche d'abord les familles
> que tu connais. Tu trouveras souvent le bug avant de maîtriser la syntaxe.

## La méthode en cinq étapes

1. **Le tutoriel officiel**, en entier, en tapant les exemples (Python : docs.python.org ;
   Go : go.dev/tour). Une à trois soirées.
2. **Ta table d'équivalences** : pour chaque notion que tu connais, comment l'écrit-on ici ?
   La leçon suivante en donne une, de JavaScript vers Python.
3. **Porter un programme que tu connais** : réécrire un exercice déjà résolu. Tu sais ce qu'il
   doit faire ; tu ne te bats qu'avec le langage.
4. **Apprendre les pièges** propres au langage : ce qui marchait chez toi et casse ici.
5. **Lire du vrai code** : une petite bibliothèque populaire, les exemples de la documentation.
   C'est là qu'on apprend les idiomes.

## Les outils à trouver le premier jour

- Comment **exécuter** un fichier, et ouvrir une console interactive (REPL).
- Comment **installer** une dépendance (`npm`, `pip`, `go get`, `composer`…).
- Comment **lancer les tests**.
- Comment **afficher** une valeur pour déboguer (`console.log`, `print`, `fmt.Println`…).

Avec ces quatre outils et la méthode de diagnostic, tu peux déjà réparer des bugs dans le
nouveau langage.

## Ce que tu sais faire maintenant

- Distinguer ce qui se transfère d'un langage à l'autre et ce qui change.
- Reconnaître une famille de bug dans un langage que tu ne connais pas.
- Suivre une méthode en cinq étapes pour apprendre un nouveau langage.
