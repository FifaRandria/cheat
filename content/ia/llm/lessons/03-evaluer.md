---
id: llm-03
title: Évaluer un système LLM
minutes: 13
summary: Remplacer « ça a l'air de marcher » par des chiffres, avec un jeu d'évaluation, des métriques et un suivi des régressions.
check:
  - prompt: Tu modifies ton prompt. Comment savoir s'il est meilleur ?
    choices:
      - Essayer deux ou trois exemples à la main
      - "Le relancer sur le même jeu d'évaluation que l'ancien prompt, et comparer les scores"
    answer: 1
  - prompt: Un classifieur obtient 95 % de bonnes réponses, mais 0 % sur les avis négatifs. Que révèle ce chiffre global ?
    choices:
      - Que tout va bien
      - "Rien de suffisant : il faut aussi mesurer la précision par catégorie, car les négatifs sont rares"
    answer: 1
---

## « Ça a l'air de marcher »

Un LLM donne des réponses plausibles, et c'est précisément le danger : essayer trois exemples
à la main ne dit rien des trois cents autres. Changer un mot dans le prompt peut améliorer un
cas et en casser dix. On **mesure**, comme pour l'entraînement des modèles du module IA2.

## Le jeu d'évaluation

Une liste de cas **représentatifs**, avec la réponse attendue :

```python
jeu = [
    {"id": "a1", "avis": "Réparation rapide, merci !", "attendu": "positif"},
    {"id": "a2", "avis": "Trois semaines d'attente pour un pneu.", "attendu": "negatif"},
    {"id": "a3", "avis": "Vous vendez des trottinettes ?", "attendu": "hors-sujet"},
    # … des dizaines à des centaines de cas, dont les cas difficiles
]
```

- Des cas **réels**, piochés dans les données de production.
- Les cas **difficiles** et les erreurs passées : chaque bug signalé devient un cas.
- Le jeu ne sert **qu'à évaluer**, jamais d'exemple dans le prompt : sinon le score ment,
  comme un modèle évalué sur ses données d'entraînement.

## Les métriques

```python
def precision(predictions, jeu):
    bonnes = sum(1 for p, cas in zip(predictions, jeu) if p == cas["attendu"])
    return round(bonnes / len(jeu), 2)
```

- La **précision** globale (*accuracy*) : la part de bonnes réponses.
- La précision **par catégorie** : un 95 % global peut cacher 0 % sur une catégorie rare.
- La **liste des erreurs** : la lire est souvent plus instructif que le score.
- Le **coût** et la **latence** : un prompt 2 % meilleur mais trois fois plus cher n'est pas
  forcément un progrès.

## Quand la réponse n'a pas d'attendu exact

Pour un résumé ou une réponse libre, on ne peut pas comparer mot à mot. Trois options :

| Méthode | Principe | Limite |
|---|---|---|
| **Règles** | le résumé fait moins de 50 mots, cite le nom du client… | ne juge pas la qualité |
| **LLM juge** | un second appel note la réponse selon une grille précise | à valider sur des cas notés par des humains |
| **Humains** | des experts notent un échantillon | lent et coûteux, mais la référence |

## Le cycle d'amélioration

1. Mesurer le système actuel : c'est la **référence**.
2. Changer **une seule chose** (le prompt, le modèle, l'effort).
3. Relancer **le même** jeu, comparer, lire les nouvelles erreurs.
4. Garder le changement seulement s'il améliore le score sans casser autre chose.

C'est la méthode de diagnostic, appliquée à l'IA : une hypothèse, un changement, une mesure.

## Ce que tu sais faire maintenant

- Construire un jeu d'évaluation représentatif, séparé des exemples du prompt.
- Calculer une précision globale et par catégorie, et lister les erreurs.
- Choisir une méthode d'évaluation pour les réponses libres.
- Améliorer un système LLM un changement à la fois.
