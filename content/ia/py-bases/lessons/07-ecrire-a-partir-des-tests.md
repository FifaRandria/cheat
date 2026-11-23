---
id: py-bases-07
title: Écrire une fonction à partir des tests
minutes: 12
summary: Lire des tests Python comme un cahier des charges, puis écrire la fonction un test à la fois.
check:
  - prompt: "Un test contient `assert compter([]) == 0`. Qu'est-ce qu'il t'apprend ?"
    choices:
      - "Un cas limite : une liste vide doit donner 0"
      - Que la fonction doit lever une exception
      - Rien, ce test ne sert à rien
    answer: 0
  - prompt: Quelle est la bonne façon d'avancer ?
    choices:
      - Écrire toute la fonction, puis lancer les tests une seule fois à la fin
      - Faire passer un test, relancer, puis passer au suivant
      - Modifier les tests qui échouent
    answer: 1
  - prompt: "Que renvoie `\"Bonjour, Ada !\".lower().split()` ?"
    choices:
      - "`[\"bonjour\", \"ada\"]`"
      - "`[\"bonjour,\", \"ada\", \"!\"]`"
      - "`\"bonjour, ada !\"`"
    answer: 1
---

## Réparer, puis écrire

Réparer t'a appris à **lire** du Python. Il faut maintenant apprendre à **écrire**. Dans les
niveaux marqués **À écrire**, tu reçois une fonction vide et des **tests** : ils forment le
cahier des charges.

## Lire un test Python

```python
def test_liste_vide():
    """une liste vide donne une moyenne de 0"""
    assert moyenne([]) == 0
```

Trois informations : la fonction (`moyenne`), ce qu'on lui donne (`[]`), ce qu'on attend (`0`).
La docstring, entre triples guillemets, dit la même chose en français.

> **À retenir** : lis les docstrings de **tous** les tests avant d'écrire. Ensemble, elles
> décrivent le comportement complet, cas pièges compris.

## Un test à la fois

| Étape | Ce que tu fais |
|---|---|
| **Rouge** | Choisis le test le plus simple qui échoue |
| **Vert** | Écris le minimum pour le faire passer |
| **Nettoyer** | Simplifie, relance tout, passe au suivant |

Exemple : `initiales("Ada Lovelace")` doit donner `"A.L."`.

```python
def initiales(nom):
    resultat = ""
    for mot in nom.split():
        resultat += mot[0].upper() + "."
    return resultat

print(initiales("Ada"))
print(initiales("grace brewster hopper"))
```

```output
A.
G.B.H.
```

## Les outils qui servent souvent

| Outil | Exemple | Résultat |
|---|---|---|
| `texte.split()` | `"a  b".split()` | `['a', 'b']` |
| `texte.strip()` | `"  ok ".strip()` | `'ok'` |
| `texte.lower()` | `"VIP".lower()` | `'vip'` |
| `texte.replace(a, b)` | `"a-b".replace("-", " ")` | `'a b'` |
| `sum(liste)` | `sum([2, 3])` | `5` |
| `min(liste)`, `max(liste)` | `max([3, 9, 4])` | `9` |
| `round(x, 1)` | `round(12.345, 1)` | `12.3` |
| `d.get(cle, defaut)` | `{}.get("a", 0)` | `0` |

Le dernier est précieux pour **compter** : on lit le compteur actuel (0 s'il n'existe pas
encore), et on ajoute 1.

```python
compteur = {}
for fruit in ["pomme", "kiwi", "pomme"]:
    compteur[fruit] = compteur.get(fruit, 0) + 1
print(compteur)
```

```output
{'pomme': 2, 'kiwi': 1}
```

## Penser aux cas limites

Pour chaque entrée, demande-toi : « et si elle est vide ? et si elle contient des majuscules,
des espaces, de la ponctuation ? ». `min([])` et `max([])` lèvent une `ValueError` : une liste
vide se traite **avant**.

```python
notes = []
if not notes:
    print("aucune note")
```

```output
aucune note
```

> **Attention** : ne modifie jamais un test pour qu'il passe. C'est le code qui doit s'adapter.

## Quand tu bloques

1. Le message d'échec affiche ce qui était **attendu** et ce qui a été **obtenu**.
2. Ajoute un `print(repr(valeur))` dans ta fonction pour voir les valeurs intermédiaires.
3. Fais d'abord marcher un exemple minuscule, puis généralise.

## Ce que tu sais faire maintenant

- Lire des tests Python comme un cahier des charges.
- Écrire une fonction un test à la fois.
- Compter avec un dictionnaire et `get`.
- Traiter les cas limites avant qu'ils ne plantent.
