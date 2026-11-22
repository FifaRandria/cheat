---
id: gp-etapes-03
title: Planifier, découper et estimer
minutes: 14
summary: Transformer un cahier des charges en tâches concrètes, écrire de bonnes user stories, estimer sans se mentir et construire un backlog.
check:
  - prompt: Laquelle est une user story bien écrite ?
    choices:
      - Faire la base de données
      - En tant que client, je veux recevoir un e-mail de confirmation, afin d'être sûr que ma table est réservée
      - Le site doit être bien
    answer: 1
  - prompt: Une tâche est estimée à « 3 semaines ». Que faire ?
    choices:
      - La garder telle quelle
      - La découper en tâches plus petites, de quelques jours au plus
      - Doubler l'équipe
    answer: 1
    explain: "Plus une tâche est grosse, plus son estimation est fausse. Découper rend l'estimation plus fiable et l'avancement visible."
  - prompt: Pourquoi garder une marge dans le planning ?
    choices:
      - Pour se reposer
      - Parce que les imprévus arrivent toujours (bugs, absences, demandes en plus)
      - Ce n'est pas utile si l'équipe est bonne
    answer: 1
---

## Du cahier des charges aux tâches

« Réservation en ligne » n'est pas une tâche : c'est beaucoup trop gros pour être estimé ou
attribué à quelqu'un. On découpe en trois niveaux :

| Niveau | Taille | Exemple pour Table Ronde |
|---|---|---|
| **Epic** | une grande fonctionnalité | Réservation en ligne |
| **User story** | un besoin utilisateur, livrable en quelques jours | Le client choisit une date et un créneau |
| **Tâche** | une action technique, de quelques heures | Créer la table `reservations` en base |

## Écrire une user story

Une **user story** décrit un besoin du point de vue de celui qui l'a :

> En tant que **[qui]**, je veux **[quoi]**, afin de **[pourquoi]**.

Exemples :

- En tant que **client**, je veux **voir les créneaux encore libres**, afin de **ne pas
  choisir une heure déjà complète**.
- En tant que **serveur**, je veux **voir les réservations du soir sur une seule page**,
  afin de **préparer la salle avant le service**.

Le « afin de » est le plus important : il dit **pourquoi**, et donc ce qui compte vraiment.

Chaque story a des **critères d'acceptation**, les conditions pour la considérer terminée :

- un créneau complet n'apparaît pas ;
- on ne peut pas réserver dans le passé ;
- au-delà de 8 personnes, on affiche « Appelez-nous ».

> **À retenir** : une user story n'est prête que si l'équipe sait **comment vérifier** qu'elle
> est terminée. Sans critères d'acceptation, chacun a sa propre idée du « fini ».

## Estimer sans se mentir

Estimer, c'est difficile, et tout le monde se trompe, surtout dans le sens de l'optimisme.
Quelques règles :

1. **Découper** : une tâche de deux jours s'estime bien mieux qu'une tâche de trois semaines.
2. **Comparer** plutôt qu'estimer dans l'absolu : « c'est à peu près deux fois plus gros que le
   formulaire de contact ». C'est le principe des **points** et des tailles de t-shirt
   (S, M, L, XL).
3. **Faire estimer ceux qui feront le travail**, pas le chef de projet seul.
4. **Garder une marge** de 20 à 30 % pour l'imprévu : bugs, absences, demandes en plus.

> **Attention** : une estimation n'est pas un engagement gravé dans le marbre. Quand la
> réalité diverge, on le dit tôt, au lieu de le cacher jusqu'à la date de livraison.

## Le backlog

Le **backlog** est la liste de toutes les stories restantes, **triée par priorité**. En haut,
ce qui apporte le plus de valeur et doit être fait en premier ; en bas, le « peut-être un jour ».

Pour Table Ronde :

1. Le client réserve une table (date, heure, nombre de personnes).
2. Le client reçoit un e-mail de confirmation.
3. Le personnel voit les réservations du jour.
4. Le client reçoit un rappel la veille.
5. Le client annule en un clic.
6. *(plus tard)* Le client choisit sa table sur un plan.

Le backlog est **vivant** : on le réordonne à chaque fois qu'on apprend quelque chose de
nouveau.

## Les dépendances

Certaines tâches en bloquent d'autres : impossible d'envoyer l'e-mail de confirmation tant
que la réservation n'est pas enregistrée en base. Repérer ces **dépendances** tôt évite qu'un
développeur attende, les bras croisés, qu'un autre ait fini.

## Ce que tu sais faire maintenant

- Découper un projet en epics, user stories et tâches.
- Écrire une user story avec ses critères d'acceptation.
- Estimer par comparaison, en découpant et en gardant une marge.
- Construire et prioriser un backlog, en repérant les dépendances.
