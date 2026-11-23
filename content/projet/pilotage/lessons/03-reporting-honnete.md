---
id: pilotage-03
title: Un reporting honnête
minutes: 11
summary: La météo du projet, le piège du reporting « pastèque », et la structure d'un point d'avancement qui aide à décider.
check:
  - prompt: Qu'est-ce qu'un reporting « pastèque » ?
    choices:
      - Un projet vert à l'extérieur (dans les rapports), rouge à l'intérieur (dans la réalité)
      - Un rapport en couleurs
      - Un rapport hebdomadaire
    answer: 0
  - prompt: Le projet risque d'avoir 3 semaines de retard. Quand le dire au client ?
    choices:
      - À la fin, si on n'a pas réussi à rattraper
      - Dès qu'on le sait, avec les options possibles
    answer: 1
  - prompt: Que doit contenir un point d'avancement ?
    choices:
      - Ce qui a été fait, ce qui est prévu, les risques et problèmes, et les décisions attendues
      - Uniquement les bonnes nouvelles
    answer: 0
---

## La météo du projet

Beaucoup d'organisations résument l'état d'un projet par une couleur :

| Couleur | Signification |
|---|---|
| 🟢 **Vert** | dans les délais, le budget et le périmètre |
| 🟠 **Orange** | un risque ou un écart, sous contrôle, avec un plan |
| 🔴 **Rouge** | écart important : une **décision** est nécessaire |

Utile… à condition d'être honnête.

## Le reporting pastèque

Un projet **pastèque** est **vert à l'extérieur, rouge à l'intérieur**. Semaine après semaine,
le rapport dit « vert », parce que personne n'ose annoncer une mauvaise nouvelle, ou parce
qu'on espère rattraper. Puis, deux semaines avant la date, le projet passe brutalement au
rouge, quand il n'y a plus d'options.

> **À retenir** : une mauvaise nouvelle annoncée tôt est une information. Annoncée tard,
> c'est une crise. Le rôle du chef de projet n'est pas d'avoir un projet toujours vert, mais
> de montrer la réalité assez tôt pour qu'on puisse **décider**.

## Un point d'avancement utile

Il tient en une page, toujours dans le même ordre :

1. **Météo** et une phrase de résumé ;
2. **Fait** depuis le dernier point ;
3. **Prévu** d'ici le prochain point ;
4. **Indicateurs** : avancement, budget consommé, prévision à terminaison ;
5. **Risques et problèmes**, avec leurs actions ;
6. **Décisions attendues** : ce que tu demandes, à qui, pour quand.

```output
Table Ronde · semaine 6 · 🟠 ORANGE
Le paiement en ligne prend plus de temps que prévu (intégration du prestataire).

Fait      : réservation en ligne, confirmation par e-mail (recette validée)
Prévu     : rappel la veille, page du personnel
Chiffres  : 55 % du travail terminé · 60 % du budget consommé · fin prévue : +1 semaine
Risque    : API du prestataire mal documentée → contact technique demandé
Décision  : reporter le paiement en ligne en V2, ou accepter +1 semaine ?
            → réponse de Sofia attendue vendredi
```

Remarque : le rapport ne cache pas le problème, mais il **apporte les options**. C'est ce qui
transforme une mauvaise nouvelle en décision.

## Les faits, pas les impressions

| Impression | Fait |
|---|---|
| « Ça avance bien » | « 12 stories sur 20 terminées » |
| « Petit retard » | « Fin prévue le 18 au lieu du 11 » |
| « Quelques bugs » | « 7 bugs ouverts, dont 2 bloquants » |

## Ce que tu sais faire maintenant

- Attribuer une météo honnête à un projet.
- Reconnaître et éviter le reporting pastèque.
- Rédiger un point d'avancement factuel qui se termine par les décisions attendues.
