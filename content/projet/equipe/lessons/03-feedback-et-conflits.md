---
id: gp-equipe-03
title: Feedback, conflits et difficultés
minutes: 15
summary: Donner un feedback utile avec la méthode SBI, désamorcer un conflit, et accompagner une personne en difficulté.
check:
  - prompt: Lequel de ces feedbacks suit la méthode SBI ?
    choices:
      - Tu n'es jamais concentré en réunion.
      - "Ce matin, pendant la revue de code, tu as répondu à tes messages pendant que Léa présentait. Elle s'est arrêtée deux fois, et la revue a duré deux fois plus longtemps."
      - Tu devrais faire plus attention.
    answer: 1
    explain: "Situation précise, comportement observable, impact concret. Aucun jugement sur la personne."
  - prompt: Un développeur rate ses délais depuis trois sprints. Quelle est la première chose à faire ?
    choices:
      - Le signaler à la direction
      - Lui retirer ses tâches importantes
      - En parler en tête-à-tête pour comprendre ce qui se passe
    answer: 2
  - prompt: Deux développeurs s'opposent sur le choix d'une bibliothèque. Que fait le lead ?
    choices:
      - Il tranche immédiatement pour son préféré
      - Il ramène la discussion aux critères du projet, et tranche si besoin en expliquant pourquoi
      - Il les laisse se débrouiller
    answer: 1
---

## Le feedback, un cadeau mal emballé

Le feedback est l'outil le plus puissant pour faire progresser quelqu'un, et le plus souvent
mal utilisé : trop vague, trop tard, ou transformé en jugement sur la personne.

### La méthode SBI

**SBI** signifie **Situation – Behavior – Impact** (situation, comportement, impact) :

1. **Situation** : quand et où, précisément.
2. **Comportement** : ce que la personne a fait, de façon **observable**. Pas une
   interprétation.
3. **Impact** : la conséquence concrète, sur toi, l'équipe ou le projet.

| Mauvais feedback | Feedback SBI |
|---|---|
| « Tu bâcles tes revues de code. » | « Sur la demande de fusion d'hier (S), tu as approuvé sans commentaire en deux minutes (B). Un bug de paiement est passé en production (I). » |
| « Super boulot ! » | « Ta présentation de la démo vendredi (S), avec le parcours client de bout en bout (B), a convaincu Sofia de valider la V1 sur place (I). » |

Puis on **ouvre la discussion** : « Comment tu le vois, de ton côté ? ». La personne a
peut-être une information qui te manque.

> **À retenir** : critique le **comportement**, jamais la **personne**. « Tu as approuvé sans
> relire » se corrige. « Tu es négligent » ne laisse aucune porte de sortie.

Quelques règles :

- **vite** : un feedback trois semaines après les faits ne sert plus à grand-chose ;
- **en privé** pour une critique, **en public** si la personne apprécie les félicitations ;
- **souvent positif** : on oublie de dire ce qui marche, alors que c'est ce qui donne envie
  de recommencer.

## Désamorcer un conflit

Dans une équipe, les désaccords sont normaux et souvent utiles. Ils deviennent des
**conflits** quand ils glissent du sujet vers les personnes.

Face à un conflit entre deux membres de l'équipe :

1. **Écoute chacun séparément**, sans prendre parti.
2. **Ramène aux faits** : qu'est-ce qui s'est passé, concrètement ?
3. **Cherche l'objectif commun** : les deux veulent que le projet réussisse. Sur quels
   **critères** juger les options ? Performance, simplicité, délai, sécurité ?
4. **Décide** si nécessaire, en expliquant tes raisons, et demande à chacun de s'engager
   sur la décision, même s'il n'était pas d'accord.

> **Attention** : laisser pourrir un conflit en espérant qu'il se règle seul ne marche
> presque jamais. Il gagne toute l'équipe.

## Une personne en difficulté

Un développeur rate ses délais depuis plusieurs sprints, son code est moins soigné, il parle
moins au daily. Le réflexe à éviter : conclure qu'il est « moins bon ».

La démarche :

1. **En parler tôt, en tête-à-tête**, avec des faits : « J'ai remarqué que les trois
   dernières stories ont pris deux fois plus de temps que prévu. »
2. **Comprendre avant de juger** : tâches mal découpées ? Technologie inconnue ? Problème
   personnel ? Démotivation ? Surcharge ?
3. **Construire ensemble un plan** : découper autrement, binômer avec un collègue, une
   formation, alléger temporairement la charge.
4. **Faire un point régulier**, et reconnaître les progrès.

Dans la grande majorité des cas, la cause est **dans l'environnement** (organisation,
clarté, charge), pas dans la personne.

## Ce que tu sais faire maintenant

- Donner un feedback précis et utile avec SBI, positif comme correctif.
- Désamorcer un conflit en revenant aux faits et aux critères.
- Accompagner une personne en difficulté en cherchant d'abord à comprendre.
