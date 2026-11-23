---
id: pilotage-02
title: Suivre le budget
minutes: 13
summary: Construire un budget en jours, comparer le consommé à l'avancement, et détecter une dérive avant qu'elle ne soit irrattrapable.
check:
  - prompt: "Un projet de 40 jours au TJM de 500 € coûte…"
    choices: ["5 000 €", "20 000 €", "40 500 €"]
    answer: 1
  - prompt: "60 % du budget est consommé, et 40 % du travail est fait. Le projet est…"
    choices: ["dans les clous", "en dérive : il coûte plus que prévu pour ce qui est fait", "en avance"]
    answer: 1
  - prompt: Pourquoi « consommé 50 %, donc on est à mi-parcours » est-il faux ?
    choices:
      - Parce que l'argent dépensé ne dit pas combien de travail est réellement terminé
      - C'est vrai
    answer: 0
---

## Un budget en jours

Dans un projet web, l'essentiel du coût est le **temps des personnes**. On raisonne donc en
**jours-homme** (une personne pendant une journée), puis on convertit en euros avec un
**TJM** (taux journalier moyen).

| Poste | Jours |
|---|---|
| Cadrage et maquettes | 5 |
| Développement | 25 |
| Tests et recette | 6 |
| Mise en production | 2 |
| Gestion de projet | 4 |
| **Total** | **42** |

À 500 € par jour : 42 × 500 = **21 000 €**.

> **Astuce** : on oublie souvent la gestion de projet, les réunions, les tests et la
> mise en production. Ils représentent couramment 20 à 30 % du total.

## Consommé n'est pas avancé

Erreur classique : « on a consommé la moitié du budget, donc on est à mi-parcours ». Faux.
L'argent dépensé dit combien on a **travaillé**, pas combien de travail est **terminé**.

Il faut comparer deux chiffres :

| | Valeur |
|---|---|
| Budget consommé | 60 % (25 jours sur 42) |
| Travail réellement terminé | 40 % (selon le backlog) |

On a dépensé 60 % pour produire 40 % : à ce rythme, le projet coûtera
42 × 60 / 40 = **63 jours** au lieu de 42. C'est une **dérive** de 50 %.

> **À retenir** : la question n'est pas « combien a-t-on dépensé ? », mais « combien reste-t-il
> à faire, et combien cela va-t-il coûter ? ». C'est le **reste à faire**.

## Le reste à faire

À chaque point d'étape, on demande à l'équipe d'estimer le travail **restant** (et non de
déduire le reste du budget initial) :

```output
Prévision à terminaison = consommé + reste à faire estimé
                        = 25 jours + 30 jours
                        = 55 jours   (budget : 42)
```

L'écart (13 jours) doit être **annoncé** avec des options :

- réduire le périmètre (retirer des « Could » ou des « Should ») ;
- décaler la date ;
- augmenter le budget ;
- souvent, un mélange des trois, décidé avec le client.

## Les signaux d'alerte

- le consommé avance plus vite que l'avancement ;
- le reste à faire **ne diminue pas** d'une semaine à l'autre ;
- les mêmes stories « presque finies » d'un sprint à l'autre ;
- la réserve pour imprévus est déjà entamée en début de projet.

> **Attention** : une dérive annoncée à 20 % du projet laisse le temps de réagir. La même,
> annoncée à 90 %, est une crise.

## Ce que tu sais faire maintenant

- Construire un budget en jours et le convertir en euros.
- Comparer le budget consommé au travail réellement terminé.
- Calculer une prévision à terminaison avec le reste à faire.
- Repérer une dérive et proposer des options.
