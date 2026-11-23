---
id: web-boss-03
title: Livrer et maintenir
minutes: 10
summary: La checklist d'une mise en production sereine, et ce qu'on surveille ensuite.
check:
  - prompt: Où doit vivre le mot de passe de la base de données en production ?
    choices:
      - Dans le code, pour être sûr de ne pas le perdre
      - Dans l'image Docker
      - Dans une variable d'environnement ou un gestionnaire de secrets, jamais dans Git
    answer: 2
  - prompt: La nouvelle version provoque des erreurs 500 en production. Première action ?
    choices:
      - Chercher le bug pendant que les utilisateurs attendent
      - "Revenir à la version précédente (rollback), puis chercher le bug au calme"
    answer: 1
---

## « Ça marche sur ma machine »

Une application n'est **terminée** que quand elle tourne en production, et qu'on sait
qu'elle tourne. Voici la checklist qu'utilisent beaucoup d'équipes.

## Avant de livrer

| Point | Pourquoi |
|---|---|
| Tous les tests passent dans la **CI** | la machine du développeur n'est pas une preuve |
| La configuration vient de **variables d'environnement** | la même image tourne en test et en production |
| **Aucun secret** dans le code ni dans l'image | un dépôt Git ou une image se partagent, et fuient |
| Les **migrations** de base sont prêtes | le code qui attend une nouvelle colonne plante sans elle |
| Le **retour arrière** est possible | si la livraison casse tout, on revient en une commande |

## Pendant la livraison

1. La CI construit l'image Docker et lance les tests.
2. On applique les migrations de base de données.
3. On démarre la nouvelle version, et on vérifie qu'elle répond (le **healthcheck**).
4. Le trafic bascule vers elle.

> **À retenir** : une livraison qui se fait **en une commande**, sans étape manuelle, est une
> livraison qu'on ose faire souvent. Et des petites livraisons fréquentes cassent moins que de
> grosses livraisons rares.

## Après la livraison : surveiller

- **Les logs** : chaque erreur 500 laisse une trace, avec sa pile d'appels.
- **Les métriques** : taux d'erreurs, temps de réponse, nombre de requêtes SQL par page.
- **Les alertes** : être prévenu **avant** les utilisateurs.

Quand un incident arrive malgré tout : on rétablit le service d'abord (souvent par un retour
arrière), on cherche la cause ensuite, et on écrit un **post-mortem sans blâme**, comme ceux
que tu lis à la fin de chaque niveau.

## Ce que tu sais faire maintenant

- Vérifier qu'une application est prête à être livrée.
- Décrire les étapes d'une livraison automatisée.
- Réagir à une livraison ratée : rétablir d'abord, comprendre ensuite.
