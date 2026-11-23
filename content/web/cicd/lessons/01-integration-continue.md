---
id: cicd-01
title: L'intégration continue
minutes: 11
summary: Pourquoi faire vérifier chaque modification par une machine, et ce qu'on met dans un pipeline.
check:
  - prompt: Qu'est-ce que l'intégration continue (CI) ?
    choices:
      - Vérifier automatiquement chaque modification (tests, types, build) dès qu'elle est poussée
      - Travailler sans jamais s'arrêter
      - Fusionner toutes les branches chaque soir à la main
    answer: 0
  - prompt: Dans quel ordre placer les étapes d'un pipeline ?
    choices:
      - Les plus rapides et les plus susceptibles d'échouer en premier
      - Les plus longues en premier
      - L'ordre n'a pas d'importance
    answer: 0
  - prompt: Le CI est rouge sur une pull request. Peut-on la fusionner ?
    choices:
      - Oui, si c'est urgent
      - Non, on corrige d'abord ; un CI rouge ignoré n'a plus aucune valeur
    answer: 1
---

## Le problème

Cinq développeurs poussent chacun leurs modifications. Personne n'a relancé tous les tests
avant de pousser. Vendredi, au moment de livrer, plus rien ne marche, et personne ne sait quelle
modification a cassé quoi.

L'**intégration continue** (*Continuous Integration*, CI) règle ce problème : à **chaque**
modification poussée, une machine récupère le code et lance automatiquement toutes les
vérifications. En quelques minutes, on sait si la modification casse quelque chose, et
**laquelle**.

## Le pipeline

Les vérifications s'enchaînent dans un **pipeline** :

| Étape | Ce qu'elle vérifie | Durée typique |
|---|---|---|
| Installation | les dépendances s'installent | 30 s |
| Lint | le style et les erreurs évidentes | 10 s |
| Typecheck | les types (TypeScript) | 20 s |
| Tests unitaires | la logique | 1 min |
| Build | l'application se construit | 1 à 3 min |
| Tests d'intégration | les morceaux fonctionnent ensemble (avec une base, par exemple) | plusieurs min |

Si une étape échoue, le pipeline s'arrête et devient **rouge**.

> **À retenir** : place en premier les étapes **rapides** et **qui échouent souvent**. Une faute
> de type doit être signalée en 20 secondes, pas après 5 minutes de build.

## Vert ou rouge

- **vert** : la modification peut être relue et fusionnée ;
- **rouge** : on corrige **avant** tout le reste.

> **Attention** : un CI rouge que tout le monde ignore (« oh, ce test échoue toujours ») ne
> protège plus de rien. Un test instable doit être réparé ou supprimé, jamais ignoré.

## Où tourne la CI ?

Sur des services comme **GitHub Actions**, GitLab CI ou CircleCI. Le pipeline est décrit dans un
fichier versionné avec le code (en YAML), donc relu, testé et amélioré comme le reste.

Rustine elle-même a un pipeline : à chaque modification, il vérifie les types, lance les tests,
construit l'application, et vérifie que chaque niveau échoue au départ et passe avec sa solution.

## Ce que tu sais faire maintenant

- Expliquer le rôle de l'intégration continue.
- Composer un pipeline et ordonner ses étapes.
- Réagir correctement à un CI rouge.
