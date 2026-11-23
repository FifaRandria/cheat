---
id: crises-04
title: Le post-mortem sans blâme
minutes: 13
summary: Comprendre ce qui s'est passé pour que ça ne se reproduise pas, sans chercher de coupable, avec la méthode des 5 pourquoi.
check:
  - prompt: Quel est le but d'un post-mortem ?
    choices:
      - Trouver le coupable
      - Comprendre les causes et améliorer le système pour que l'incident ne se reproduise pas
      - Remplir un document pour la direction
    answer: 1
  - prompt: "« Cause racine : erreur humaine de Tom. » Pourquoi est-ce une mauvaise conclusion ?"
    choices:
      - Parce qu'elle ne dit pas pourquoi le système a permis cette erreur, ni comment l'empêcher
      - Parce que Tom n'est pas d'accord
    answer: 0
  - prompt: Que doit contenir chaque action d'un post-mortem ?
    choices:
      - Un responsable et une échéance
      - Le nom de la personne fautive
      - Rien de particulier
    answer: 0
---

## Pourquoi « sans blâme » ?

Après un incident, la tentation est de chercher **qui** a fait l'erreur. C'est
contre-productif :

- les gens cachent leurs erreurs, et l'équipe arrête d'apprendre ;
- on corrige une personne au lieu de corriger le **système** qui a permis l'erreur ;
- la même erreur sera refaite par quelqu'un d'autre.

> **À retenir** : un post-mortem sans blâme part du principe que chacun a agi au mieux avec
> les informations qu'il avait. La question n'est pas « qui ? », mais « **comment le système
> a-t-il rendu cette erreur possible, et comment l'en empêcher ?** ».

## La structure d'un post-mortem

1. **Résumé** : quoi, quand, quel impact (durée, clients touchés, chiffre d'affaires perdu).
2. **Chronologie** : la timeline notée pendant l'incident.
3. **Causes** : la cause déclenchante, et la cause racine.
4. **Ce qui a bien marché** : la détection, le rollback, la communication…
5. **Ce qui a moins bien marché**.
6. **Actions** : chacune avec un **responsable** et une **échéance**.

C'est exactement la logique des post-mortems de Rustine, après chaque incident réparé.

## Les 5 pourquoi

Pour remonter du symptôme à la cause racine, on demande « pourquoi ? » plusieurs fois :

| Question | Réponse |
|---|---|
| Pourquoi les paiements ont-ils échoué ? | La clé de l'API de paiement était invalide. |
| Pourquoi était-elle invalide ? | La mise en production a utilisé la clé de test. |
| Pourquoi la clé de test ? | Le fichier de configuration de production a été écrasé par celui de test. |
| Pourquoi a-t-il pu être écrasé ? | Le déploiement copie les fichiers à la main, sans vérification. |
| Pourquoi à la main ? | Le déploiement automatisé n'a jamais été prioritaire. |

La cause racine n'est pas « Tom s'est trompé de fichier ». C'est **un déploiement manuel
sans vérification**. L'action utile : automatiser le déploiement et vérifier la configuration
au démarrage.

> **Attention** : « erreur humaine » n'est jamais une cause racine. C'est le point de départ
> de la question suivante : pourquoi le système a-t-il permis cette erreur ?

## Des actions concrètes

| Action vague | Action utile |
|---|---|
| « Faire plus attention » | « Automatiser le déploiement (Léa, d'ici le 15) » |
| « Mieux tester » | « Ajouter un test qui vérifie la clé de paiement au démarrage (Tom, sprint 12) » |
| « Améliorer la communication » | « Créer un modèle de message de crise (Sofia, vendredi) » |

Une action sans responsable ni date ne sera jamais faite.

## Ce que tu sais faire maintenant

- Expliquer pourquoi un post-mortem doit être sans blâme.
- Structurer un post-mortem, de la chronologie aux actions.
- Remonter à la cause racine avec les 5 pourquoi.
- Écrire des actions concrètes, avec un responsable et une échéance.
