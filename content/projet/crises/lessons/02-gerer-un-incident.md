---
id: crises-02
title: Gérer un incident en production
minutes: 14
summary: Qualifier la gravité, répartir les rôles, rétablir le service avant de chercher le coupable, puis clore proprement.
check:
  - prompt: Le site est en panne depuis une mise en production il y a 10 minutes. Quelle est la priorité ?
    choices:
      - Trouver la ligne de code fautive
      - Rétablir le service, par exemple en revenant à la version précédente (rollback)
      - Trouver qui a fait la mise en production
    answer: 1
  - prompt: À quoi sert le responsable d'incident ?
    choices:
      - À corriger lui-même le bug
      - À coordonner, décider et faire circuler l'information, pendant que d'autres réparent
      - À rédiger le compte rendu une semaine plus tard
    answer: 1
  - prompt: Quand l'incident est-il terminé ?
    choices:
      - Quand le bug est trouvé
      - Quand le service est rétabli, vérifié, que la fin est communiquée et qu'un post-mortem est planifié
    answer: 1
---

## Un incident, ce n'est pas un bug comme les autres

Un **incident** est une interruption ou une dégradation du service **en production** : le site
ne répond plus, les paiements échouent, les données sont fausses. Chaque minute coûte : clients
perdus, chiffre d'affaires, réputation.

Face à un incident, la priorité change : il ne s'agit plus de comprendre parfaitement, mais
de **rétablir le service le plus vite possible**.

## Qualifier la gravité

On attribue tout de suite une **sévérité**, qui décide de la mobilisation :

| Sévérité | Exemple | Réaction |
|---|---|---|
| **SEV1** | site inaccessible, paiements impossibles, fuite de données | tout le monde mobilisé, immédiatement |
| **SEV2** | fonctionnalité importante cassée, contournement possible | équipe d'astreinte, dans l'heure |
| **SEV3** | défaut gênant mais limité | traité dans le flux normal |

## Trois rôles distincts

Même dans une petite équipe, on sépare les rôles :

- **le responsable d'incident** coordonne : il décide, répartit le travail, garde la vue
  d'ensemble. Il ne répare pas lui-même ;
- **les techniciens** diagnostiquent et réparent ;
- **le communicant** informe la direction, le support et les clients, à intervalles réguliers.

> **À retenir** : sans responsable d'incident, cinq personnes cherchent la même chose, deux
> font des modifications contradictoires en production, et personne ne prévient les clients.

## Les étapes

1. **Détecter** : une alerte de supervision, ou un client qui appelle.
2. **Qualifier** : quelle sévérité ? qui est touché ?
3. **Mobiliser** : désigner le responsable d'incident, ouvrir un canal dédié.
4. **Communiquer** un premier message : « nous sommes au courant, nous enquêtons ».
5. **Stabiliser** : revenir à la version précédente, désactiver une fonctionnalité, ajouter
   des serveurs… tout ce qui **arrête l'hémorragie**.
6. **Vérifier** que le service est réellement rétabli.
7. **Communiquer la fin** de l'incident.
8. **Planifier le post-mortem**.

> **Attention** : la tentation est de chercher la cause pendant que le site est en panne.
> Si une mise en production récente est suspecte, **revenir en arrière d'abord**, comprendre
> ensuite. On a tout le temps d'analyser une fois le service rétabli.

## Tenir une chronologie

Pendant l'incident, quelqu'un note **tout**, avec l'heure : alertes, décisions, actions,
résultats. Cette chronologie est précieuse pour le post-mortem, et évite de refaire deux fois
la même vérification.

```output
21:02  alerte : taux d'erreur 5xx à 40 %
21:05  SEV1 déclarée, Léa responsable d'incident
21:07  message de statut publié
21:09  mise en production de 20:55 identifiée comme suspecte
21:11  rollback lancé
21:14  taux d'erreur revenu à 0,2 %
21:20  rétablissement confirmé, fin d'incident communiquée
```

## Ce que tu sais faire maintenant

- Qualifier la sévérité d'un incident.
- Distinguer les rôles de responsable d'incident, de technicien et de communicant.
- Dérouler les étapes d'un incident, en stabilisant avant de chercher la cause.
- Tenir une chronologie utile au post-mortem.
