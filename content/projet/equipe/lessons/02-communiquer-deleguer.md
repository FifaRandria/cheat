---
id: gp-equipe-02
title: Communiquer et déléguer
minutes: 14
summary: Des réunions qui servent à quelque chose, l'entretien individuel, l'écrit asynchrone, et les niveaux de délégation.
check:
  - prompt: À quoi sert d'abord un entretien individuel (one-to-one) hebdomadaire ?
    choices:
      - À contrôler l'avancement des tâches
      - À parler de la personne, de ses difficultés et de sa progression
      - À remplacer le daily
    answer: 1
    explain: "L'avancement se suit ailleurs (daily, tableau). Le one-to-one est le temps de la personne."
  - prompt: Une réunion se termine sans décision ni compte rendu. Que manquait-il ?
    choices:
      - Un objectif clair, une personne qui décide et une trace écrite
      - Plus de participants
      - Une salle plus grande
    answer: 0
  - prompt: "Tu délègues à une développeuse junior sa première mise en production. Quel niveau de délégation ?"
    choices:
      - « Fais comme tu veux, tiens-moi au courant si besoin »
      - « Propose-moi ton plan, on le valide ensemble, puis tu exécutes »
      - Tu le fais toi-même, c'est plus sûr
    answer: 1
---

## Des réunions qui servent

Une réunion coûte cher : une heure avec six personnes, c'est six heures de travail. Une
réunion utile a toujours :

1. un **objectif** écrit dans l'invitation (« décider du fournisseur d'e-mails », pas « point
   e-mails ») ;
2. les **bonnes personnes**, et seulement elles ;
3. une personne qui **décide** si le groupe ne converge pas ;
4. une **trace écrite** : décisions prises, qui fait quoi, pour quand.

> **À retenir** : si une réunion n'a pas d'objectif, annule-la. Si elle n'a pas produit de
> décision écrite, elle n'a servi à rien.

## Les rituels de l'équipe

| Rituel | Fréquence | Pour quoi faire |
|---|---|---|
| **Daily** | chaque jour, 15 min | se synchroniser, repérer les blocages |
| **One-to-one** | chaque semaine, 30 min | parler de la personne : difficultés, envies, progression |
| **Rétrospective** | chaque sprint | améliorer le fonctionnement de l'équipe |
| **Démo** | chaque sprint | montrer le travail, récolter des retours |

### Le one-to-one

C'est le rituel le plus important du manager, et le plus souvent sacrifié. Ce n'est **pas** un
point d'avancement : c'est le temps de la personne. Questions utiles :

- « Qu'est-ce qui t'a fait perdre du temps cette semaine ? »
- « Sur quoi aimerais-tu progresser ? »
- « Y a-t-il quelque chose que je fais et qui te gêne ? »

C'est souvent là que tu apprends, trois semaines à l'avance, qu'une personne est en
difficulté ou pense à partir.

## Écrire plutôt que répéter

Une décision prise à l'oral est oubliée ou déformée en une semaine. Les équipes efficaces
**écrivent** :

- les **décisions** importantes, avec leur raison (« on choisit PostgreSQL parce que… ») ;
- les **comptes rendus** de réunion, en cinq lignes ;
- les **procédures** répétées : comment déployer, comment ajouter un niveau.

L'écrit permet aussi de travailler en **asynchrone** : chacun lit quand il peut, au lieu
d'interrompre tout le monde par un appel.

## Déléguer, vraiment

Déléguer n'est pas « se débarrasser » d'une tâche. C'est confier une **responsabilité**, avec
le niveau d'autonomie adapté à la personne et à l'enjeu.

| Niveau | Ce que tu dis | Quand |
|---|---|---|
| 1 | « Fais exactement ceci. » | tâche critique, personne débutante |
| 2 | « Propose-moi un plan, on le valide ensemble. » | la personne apprend, l'enjeu est réel |
| 3 | « Décide, et tiens-moi informé. » | la personne est à l'aise sur le sujet |
| 4 | « C'est ton domaine, je te fais confiance. » | la personne est experte |

L'objectif est de **faire monter** chaque personne d'un niveau, sujet par sujet.

> **Attention** : déléguer puis reprendre la tâche au premier écart détruit la confiance. Mieux
> vaut choisir un niveau plus bas au départ, et l'élargir.

## Ce que tu sais faire maintenant

- Organiser une réunion avec objectif, décideur et trace écrite.
- Expliquer le rôle du daily, du one-to-one, de la rétro et de la démo.
- Documenter les décisions pour travailler en asynchrone.
- Choisir un niveau de délégation adapté à la personne et à l'enjeu.
