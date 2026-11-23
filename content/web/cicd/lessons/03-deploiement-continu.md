---
id: cicd-03
title: Déploiement continu et retour arrière
minutes: 12
summary: Déployer automatiquement ce qui est vert, passer par un environnement de test, et toujours savoir revenir en arrière.
check:
  - prompt: Quelle est la différence entre livraison continue et déploiement continu ?
    choices:
      - En livraison continue, la mise en production reste un clic humain ; en déploiement continu, elle est automatique
      - Aucune
    answer: 0
  - prompt: À quoi sert un environnement de préproduction (staging) ?
    choices:
      - À tester la nouvelle version dans des conditions proches de la production, avant les vrais utilisateurs
      - À stocker les sauvegardes
    answer: 0
  - prompt: Qu'est-ce qui doit toujours exister avant de déployer ?
    choices:
      - Un moyen rapide de revenir à la version précédente
      - Une réunion de deux heures
    answer: 0
---

## Après la CI, la CD

Le CI vérifie chaque modification. La **CD** va plus loin :

- **livraison continue** (*Continuous Delivery*) : chaque version verte est **prête** à partir en
  production ; un humain clique pour déployer ;
- **déploiement continu** (*Continuous Deployment*) : chaque version verte part en production
  **automatiquement**.

L'objectif : des mises en production **petites et fréquentes**. Une petite modification est
facile à vérifier, et facile à annuler.

## Les environnements

| Environnement | Pour qui | Données |
|---|---|---|
| **Développement** | le développeur, sur sa machine | fictives |
| **Préproduction** (*staging*) | l'équipe et le client, pour la recette | proches de la réalité |
| **Production** | les vrais utilisateurs | réelles |

Un pipeline de déploiement typique :

```yaml
jobs:
  tests:
    runs-on: ubuntu-latest
    steps: [ … ]

  deployer-staging:
    needs: tests                   # seulement si les tests sont verts
    runs-on: ubuntu-latest
    steps: [ … ]

  deployer-production:
    needs: deployer-staging
    environment: production        # peut exiger une validation humaine
    runs-on: ubuntu-latest
    steps: [ … ]
```

## Toujours savoir revenir en arrière

Même avec un pipeline parfait, une version peut se comporter mal en production. Avant chaque
déploiement, il faut savoir **revenir à la version précédente en quelques minutes** :

- garder les images Docker des versions précédentes, avec un numéro de version ;
- redéployer l'ancienne version d'une commande ;
- faire des migrations de base **compatibles** avec l'ancienne version du code.

> **À retenir** : un déploiement sans retour arrière possible est un pari. C'est ce qui permet
> de stabiliser en deux minutes pendant un incident (module GP2).

> **Attention** : la base de données est le point délicat. Une migration qui supprime une
> colonne empêche l'ancienne version de fonctionner : on procède en plusieurs étapes, en gardant
> la compatibilité.

## Surveiller après le déploiement

Un déploiement n'est pas fini quand le pipeline est vert : on surveille les erreurs, les temps
de réponse et les indicateurs métier (réservations, paiements) pendant les minutes qui suivent.

## Ce que tu sais faire maintenant

- Distinguer CI, livraison continue et déploiement continu.
- Organiser des environnements et un pipeline de déploiement avec `needs`.
- Prévoir systématiquement un retour arrière, y compris pour la base de données.
