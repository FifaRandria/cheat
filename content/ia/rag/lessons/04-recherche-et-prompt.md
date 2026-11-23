---
id: rag-04
title: Rechercher les k meilleurs passages et construire le prompt
minutes: 14
summary: Le top-k, le seuil de pertinence, et un prompt qui empêche le modèle d'inventer.
check:
  - prompt: "Pour garder les 3 passages les plus similaires, comment trier ?"
    choices:
      - Par score croissant, et garder les 3 premiers
      - Par score décroissant, et garder les 3 premiers
    answer: 1
  - prompt: Aucun passage n'a un score suffisant. Que doit faire le système ?
    choices:
      - Envoyer quand même la question au modèle, sans contexte
      - Dire honnêtement qu'il ne trouve pas l'information dans les documents
    answer: 1
  - prompt: Pourquoi numéroter les passages dans le prompt ([1], [2]…) ?
    choices:
      - Pour que le modèle puisse citer ses sources, et que l'utilisateur vérifie
      - C'est purement décoratif
    answer: 0
---

## Le top-k

Une fois la question vectorisée, on calcule sa similarité avec **chaque** morceau, puis on
garde les *k* meilleurs : c'est le **top-k**.

```python
scores = [("FAQ livraison", 0.91), ("CGV", 0.42), ("Recrutement", 0.08), ("Suivi colis", 0.77)]

meilleurs = sorted(scores, key=lambda s: s[1], reverse=True)[:2]
print(meilleurs)
```

```output
[('FAQ livraison', 0.91), ('Suivi colis', 0.77)]
```

`reverse=True` trie du **plus grand au plus petit**. Sans lui, `[:2]` garderait les deux
passages les **moins** pertinents.

Choisir *k* est un compromis : trop petit, on rate des informations ; trop grand, on noie le
modèle dans du bruit, et le prompt coûte plus cher.

## Le seuil de pertinence

Si la question porte sur un sujet absent des documents, le top-k renvoie quand même *k*
passages, les « moins mauvais ». On ajoute donc un **seuil** : en dessous d'un certain score,
un passage est ignoré.

```python
SEUIL = 0.5
pertinents = [s for s in meilleurs if s[1] >= SEUIL]
```

## Un prompt qui n'invente pas

Le prompt final contient trois parties, dans cet ordre :

1. des **consignes** claires ;
2. le **contexte** : les passages, numérotés ;
3. la **question**.

```python
def construire_prompt(question, passages):
    contexte = "\n".join(f"[{i}] {p}" for i, p in enumerate(passages, start=1))
    return (
        "Réponds uniquement à partir des documents ci-dessous. "
        "Si la réponse n'y figure pas, dis que tu ne sais pas. "
        "Cite les numéros des documents utilisés.\n\n"
        f"Documents :\n{contexte}\n\n"
        f"Question : {question}"
    )

print(construire_prompt("Quel est le délai de livraison ?", ["Livraison en 48 h.", "Retour sous 14 jours."]))
```

```output
Réponds uniquement à partir des documents ci-dessous. Si la réponse n'y figure pas, dis que tu ne sais pas. Cite les numéros des documents utilisés.

Documents :
[1] Livraison en 48 h.
[2] Retour sous 14 jours.

Question : Quel est le délai de livraison ?
```

> **À retenir** : la consigne « réponds uniquement à partir des documents, sinon dis que tu
> ne sais pas » est la meilleure protection contre les hallucinations. Sans elle, le modèle
> comble les trous avec ce qu'il croit savoir.

## Diagnostiquer un RAG qui répond à côté

Quand un chatbot RAG répond mal, le problème vient presque toujours de l'une de ces étapes.
Pour le trouver, **affiche les passages retrouvés** avant d'accuser le modèle :

| Ce que tu observes | Étape suspecte |
|---|---|
| Les bons documents existent, mais ne sont pas retrouvés | embeddings, similarité, top-k |
| Le passage retrouvé est coupé juste avant la réponse | chunking (taille, chevauchement) |
| Les bons passages sont dans le prompt, mais la réponse les ignore ou invente | prompt (consignes, ordre) |
| Le modèle répond avec assurance hors sujet | seuil absent, consigne « je ne sais pas » absente |

## Ce que tu sais faire maintenant

- Garder les *k* passages les plus pertinents, triés du plus au moins similaire.
- Écarter les passages sous un seuil de pertinence.
- Construire un prompt avec consignes, contexte numéroté et question.
- Localiser l'étape fautive d'un RAG qui répond à côté.
