---
id: pilotage-01
title: Mesurer l'avancement, vélocité et burndown
minutes: 13
summary: Savoir où en est vraiment un projet, prévoir une date de fin à partir de la vélocité, et lire un burndown.
check:
  - prompt: "Vélocités des trois derniers sprints : 18, 22, 20 points. Il reste 100 points. Combien de sprints environ ?"
    choices: ["3", "5", "10"]
    answer: 1
    explain: "Vélocité moyenne : 20 points par sprint. 100 / 20 = 5 sprints."
  - prompt: "Sur un burndown, la courbe réelle reste au-dessus de la ligne idéale depuis une semaine. Que signifie-t-elle ?"
    choices:
      - L'équipe est en avance
      - L'équipe est en retard sur le rythme prévu
      - Rien de particulier
    answer: 1
  - prompt: Peut-on comparer la vélocité de deux équipes ?
    choices:
      - Oui, l'équipe à la plus grande vélocité est la meilleure
      - Non, chaque équipe a sa propre échelle de points
    answer: 1
---

## « On en est où ? »

C'est la question que tout le monde pose au chef de projet. « Ça avance bien » n'est pas une
réponse. Il faut des **indicateurs** : des chiffres simples, mis à jour régulièrement, qui
montrent la réalité.

## La vélocité

En Scrum, chaque story est estimée en **points** (une unité d'effort relative, pas des
heures). La **vélocité** est le nombre de points **terminés** pendant un sprint, selon la
définition du terminé.

| Sprint | Points terminés |
|---|---|
| 1 | 18 |
| 2 | 22 |
| 3 | 20 |

Vélocité moyenne : **20 points par sprint**. S'il reste 100 points au backlog, il faut
environ **5 sprints**, soit 10 semaines avec des sprints de 2 semaines.

> **À retenir** : la vélocité sert à **prévoir**, pas à juger l'équipe. Elle ne se compare pas
> entre équipes : chacune a sa propre échelle de points.

> **Attention** : une story « presque finie » compte **zéro** point. Compter des stories à
> moitié faites gonfle la vélocité, et la prévision devient fausse.

## Le burndown

Le **burndown** (graphique « qui descend ») montre, jour après jour, le travail **restant**
dans le sprint ou le projet.

| Jour | Restant prévu | Restant réel |
|---|---|---|
| 1 | 40 | 40 |
| 3 | 32 | 38 |
| 5 | 24 | 35 |
| 7 | 16 | 30 |
| 10 | 0 | ? |

- la **ligne idéale** descend régulièrement jusqu'à zéro à la fin ;
- la **courbe réelle** est **au-dessus** : l'équipe est en retard ;
- un **plateau** (le restant ne baisse pas) signale un blocage, ou des stories qui ne se
  terminent pas ;
- une **remontée** signale du travail **ajouté** en cours de route.

Ici, au jour 7, il reste 30 points pour 3 jours, alors que l'équipe en termine environ 1,7 par
jour : le sprint ne sera pas terminé. Mieux vaut le dire **maintenant**, et décider avec le
Product Owner ce qu'on retire.

## Quelques autres indicateurs utiles

| Indicateur | Ce qu'il montre |
|---|---|
| **Délai de traitement** (*lead time*) | temps entre la demande et la mise en production |
| **Travail en cours** | nombre de tâches commencées et pas finies (trop = dispersion) |
| **Bugs ouverts** | la qualité, et la dette qui s'accumule |
| **Taux de stories terminées** | stories finies / stories engagées dans le sprint |

> **Astuce** : choisis **peu** d'indicateurs, trois ou quatre, et suis-les régulièrement. Un
> tableau de bord de vingt chiffres n'est lu par personne.

## Ce que tu sais faire maintenant

- Calculer une vélocité moyenne et prévoir un nombre de sprints.
- Lire un burndown : retard, plateau, remontée.
- Annoncer un retard tôt, chiffres à l'appui.
- Choisir quelques indicateurs utiles.
