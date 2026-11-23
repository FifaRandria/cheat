---
id: rag-02
title: Embeddings et similarité cosinus
minutes: 15
summary: Représenter un texte par un vecteur, mesurer la proximité de deux textes, et pourquoi il faut normaliser.
check:
  - prompt: Que mesure la similarité cosinus entre deux vecteurs ?
    choices:
      - Leur longueur
      - L'angle entre eux, donc leur direction, indépendamment de leur longueur
      - Le nombre de mots communs
    answer: 1
  - prompt: "Que vaut la similarité cosinus entre [1, 0] et [3, 0] ?"
    choices: ["1", "3", "0"]
    answer: 0
    explain: "Les deux vecteurs pointent exactement dans la même direction : la similarité vaut 1, même si l'un est trois fois plus long."
  - prompt: "Pourquoi ne pas classer les documents par simple produit scalaire ?"
    choices:
      - Parce qu'il favorise les vecteurs les plus longs, donc souvent les documents les plus longs
      - Parce qu'il est trop lent
      - Il n'y a aucun problème
    answer: 0
---

## Des textes transformés en nombres

Un ordinateur ne compare pas des idées : il compare des **nombres**. Un **embedding** est une
liste de nombres (un **vecteur**) qui représente le sens d'un texte. Des textes au sens proche
ont des vecteurs proches.

Les vrais modèles d'embeddings produisent des vecteurs de plusieurs centaines de dimensions.
Pour comprendre le principe, on peut en fabriquer une version très simple : compter les mots
d'un vocabulaire.

```python
VOCABULAIRE = ["remboursement", "livraison", "délai", "colis"]

def vecteur(texte):
    mots = texte.lower().split()
    return [mots.count(m) for m in VOCABULAIRE]

print(vecteur("délai de livraison du colis"))
print(vecteur("demande de remboursement"))
```

```output
[0, 1, 1, 1]
[1, 0, 0, 0]
```

Les vrais embeddings sont bien plus fins (ils savent que « remboursement » et « avoir » sont
proches), mais les calculs de proximité sont exactement les mêmes.

## Le produit scalaire

Le **produit scalaire** multiplie les composantes une à une, puis additionne :

```python
def produit_scalaire(a, b):
    return sum(x * y for x, y in zip(a, b))

print(produit_scalaire([1, 2, 0], [2, 1, 0]))
```

```output
4
```

Plus il est grand, plus les vecteurs « vont dans le même sens »… mais il dépend aussi de leur
**longueur**.

## Le piège de la longueur

Prenons une question sur la livraison, et deux documents :

```python
question = [0, 1, 1, 0]        # « délai de livraison »
court    = [0, 1, 1, 0]        # une FAQ courte, exactement sur le sujet
long     = [5, 2, 1, 6]        # un long document qui parle surtout d'autre chose

print(produit_scalaire(question, court))
print(produit_scalaire(question, long))
```

```output
2
3
```

Le long document gagne, simplement parce qu'il contient **plus de mots**. Un RAG qui classe
ainsi remonte toujours les documents les plus longs, pas les plus pertinents.

## La similarité cosinus

La solution : diviser par la **longueur** (la *norme*) des deux vecteurs. On ne mesure plus
que leur **direction**.

```python
import math

def norme(v):
    return math.sqrt(sum(x * x for x in v))

def cosinus(a, b):
    if norme(a) == 0 or norme(b) == 0:
        return 0.0
    return produit_scalaire(a, b) / (norme(a) * norme(b))

print(round(cosinus(question, court), 3))
print(round(cosinus(question, long), 3))
```

```output
1.0
0.261
```

Le document court, exactement sur le sujet, gagne enfin.

| Valeur du cosinus | Signification |
|---|---|
| 1 | même direction : sens très proche |
| 0 | directions sans rapport |
| -1 | directions opposées (rare avec des embeddings de texte) |

> **À retenir** : pour comparer des embeddings, utilise la **similarité cosinus**, pas le
> produit scalaire brut. Et protège-toi de la division par zéro pour un vecteur vide.

> **Astuce** : beaucoup de modèles d'embeddings renvoient des vecteurs déjà **normalisés**
> (de norme 1). Dans ce cas, produit scalaire et cosinus donnent le même résultat. Vérifie
> toujours la documentation du modèle.

## Ce que tu sais faire maintenant

- Expliquer ce qu'est un embedding.
- Calculer un produit scalaire et une norme.
- Expliquer pourquoi le produit scalaire brut favorise les longs documents.
- Calculer une similarité cosinus, sans division par zéro.
