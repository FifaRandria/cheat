---
id: gp-etapes-01
title: Le cycle de vie d'un projet web
minutes: 12
summary: Les sept grandes étapes d'un projet, du premier rendez-vous à la maintenance, suivies sur un exemple concret.
check:
  - prompt: À quel moment écrit-on le cahier des charges ?
    choices:
      - Après le développement, pour documenter ce qui a été fait
      - Pendant le cadrage, avant de concevoir et de coder
      - Il n'est jamais nécessaire
    answer: 1
  - prompt: Le site est en ligne. Le projet est-il terminé ?
    choices:
      - Oui, le travail est livré
      - Non, commence la maintenance, avec corrections, mises à jour et améliorations à partir des retours
    answer: 1
  - prompt: Pourquoi est-il dangereux de commencer à coder dès le premier rendez-vous ?
    choices:
      - Parce qu'on risque de construire très bien… la mauvaise chose
      - Parce que le code serait trop rapide
      - Ce n'est pas dangereux
    answer: 0
---

## Notre projet fil rouge

Tout au long de ce module, on suit un projet réel : **« Table Ronde »**, un site de
réservation en ligne pour un restaurant de quartier. La gérante, Sofia, en a assez de répondre
au téléphone pendant le service.

Un projet web, même petit, passe toujours par les mêmes grandes étapes. Les sauter, c'est
la meilleure façon de livrer en retard, hors budget, ou à côté du besoin.

> **Déjà vu** : tu appliqueras chaque étape dans les projets finaux web et IA, la Boîte à outils
> et son assistant : leurs énoncés portent un encadré « Côté chef de projet ».

## Les sept étapes

| # | Étape | La question à laquelle elle répond |
|---|---|---|
| 1 | **Cadrage** | Pourquoi ce projet, pour qui, et qu'est-ce qui est inclus ? |
| 2 | **Conception** | À quoi ça va ressembler, et comment ce sera construit ? |
| 3 | **Planification** | Qui fait quoi, dans quel ordre, pour quand ? |
| 4 | **Développement** | On construit, par petits morceaux. |
| 5 | **Tests et recette** | Est-ce que ça marche, et est-ce que ça correspond à la demande ? |
| 6 | **Mise en production** | On ouvre au public. |
| 7 | **Maintenance et évolution** | On corrige, on mesure, on améliore. |

### 1. Le cadrage

On rencontre Sofia et on pose des questions avant de proposer quoi que ce soit : quel
problème veut-elle résoudre ? Qui réservera ? Combien de tables ? Que se passe-t-il si un
client ne vient pas ?

Le résultat est un document : le **cahier des charges**. Il fixe les objectifs, le
**périmètre** (ce qui est inclus et ce qui ne l'est pas), le budget et les délais.

### 2. La conception

On imagine la solution : des **maquettes** des écrans (choisir une date, un créneau, un nombre
de personnes), le **parcours utilisateur**, puis l'architecture technique (quel framework,
quelle base de données, quel hébergement).

### 3. La planification

On découpe le travail en tâches, on estime leur durée et on les ordonne. On obtient un
**backlog** : la liste priorisée de tout ce qu'il reste à faire.

### 4. Le développement

On construit, **par petites livraisons**, en montrant régulièrement l'avancement à Sofia
plutôt que de disparaître trois mois.

### 5. Les tests et la recette

Les développeurs testent (tests automatiques, vérifications manuelles). Puis vient la
**recette** : Sofia elle-même vérifie que le site fait ce qui était prévu dans le cahier des
charges.

### 6. La mise en production

On déploie le site sur un serveur, on configure le nom de domaine, on vérifie que tout
fonctionne en conditions réelles, et on prévoit un plan de retour en arrière si ça se passe mal.

### 7. La maintenance et l'évolution

Le site vit. Des bugs apparaissent, les clients demandent un rappel par SMS, une mise à jour
de sécurité tombe. Un projet web n'est jamais vraiment « fini ».

> **À retenir** : plus une erreur est découverte tard, plus elle coûte cher. Un malentendu
> corrigé pendant le cadrage coûte une conversation. Le même malentendu découvert après la
> mise en production peut coûter des semaines de travail.

## Ce n'est pas une ligne droite

Dans la réalité, ces étapes se chevauchent et se répètent. Les méthodes **agiles** (voir la
leçon 4) font tourner les étapes 2 à 6 en **cycles courts** de une à quatre semaines. Mais
même en agile, on ne saute jamais le cadrage, et on ne livre jamais sans tester.

## Ce que tu sais faire maintenant

- Citer les sept étapes d'un projet web dans l'ordre.
- Expliquer le rôle du cahier des charges et de la recette.
- Comprendre pourquoi une erreur coûte plus cher quand elle est découverte tard.
