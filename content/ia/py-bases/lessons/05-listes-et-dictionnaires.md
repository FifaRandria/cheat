---
id: py-bases-05
title: Listes et dictionnaires
minutes: 14
summary: Les deux structures qui servent partout en data et en IA, et comment éviter la KeyError.
check:
  - prompt: "`stock = {\"pomme\": 3}`. Que donne `stock[\"kiwi\"]` ?"
    choices: ["0", "None", "Une KeyError"]
    answer: 2
    explain: "Accéder avec des crochets à une clé absente lève une KeyError."
  - prompt: "Et `stock.get(\"kiwi\", 0)` ?"
    choices: ["0", "None", "Une KeyError"]
    answer: 0
    explain: "`.get(clé, défaut)` renvoie la valeur par défaut quand la clé n'existe pas."
  - prompt: "Que renvoie `[10, 20, 30, 40][1:3]` ?"
    choices: ["[10, 20]", "[20, 30]", "[20, 30, 40]"]
    answer: 1
---

## Les listes

Une **liste** est une suite ordonnée de valeurs, entre crochets. C'est l'équivalent des
tableaux de JavaScript.

```python
notes = [12, 15, 9]

print(notes[0])      # premier élément : index 0
print(notes[-1])     # dernier élément : index -1
print(len(notes))    # nombre d'éléments

notes.append(18)     # ajouter à la fin
print(notes)
```

```output
12
9
3
[12, 15, 9, 18]
```

Les index négatifs comptent depuis la fin : `-1` est le dernier, `-2` l'avant-dernier.

## Découper une liste

La syntaxe `liste[debut:fin]` extrait une partie, **fin exclue** :

```python
lettres = ["a", "b", "c", "d", "e"]

print(lettres[1:3])   # index 1 et 2
print(lettres[:2])    # depuis le début
print(lettres[3:])    # jusqu'à la fin
```

```output
['b', 'c']
['a', 'b']
['d', 'e']
```

En IA, on utilise ce découpage tout le temps, par exemple pour séparer un jeu de données en
une partie pour l'entraînement et une partie pour l'évaluation.

## Les dictionnaires

Un **dictionnaire** associe des **clés** à des **valeurs**, entre accolades. C'est l'équivalent
des objets de JavaScript.

```python
utilisateur = {
    "prenom": "Ada",
    "age": 36,
    "premium": True,
}

print(utilisateur["prenom"])
utilisateur["age"] = 37            # modifier
utilisateur["ville"] = "Londres"   # ajouter une clé
print(utilisateur)
```

```output
Ada
{'prenom': 'Ada', 'age': 37, 'premium': True, 'ville': 'Londres'}
```

Attention à la syntaxe : on lit une valeur avec `utilisateur["prenom"]`, entre crochets et
guillemets, et non avec un point comme en JavaScript.

## Le piège : la `KeyError`

Lire une clé qui **n'existe pas** provoque une erreur :

```python
stock = {"pomme": 3, "banane": 5}
print(stock["kiwi"])
```

```output
KeyError: 'kiwi'
```

Le piège est encore plus sournois quand on veut **incrémenter** :

```python
stock = {"pomme": 3}
stock["kiwi"] += 2      # « ajoute 2 au kiwi »... qui n'existe pas encore
```

```output
KeyError: 'kiwi'
```

`stock["kiwi"] += 2` signifie `stock["kiwi"] = stock["kiwi"] + 2` : Python doit d'abord
**lire** `stock["kiwi"]`, qui n'existe pas.

## La solution : `.get` avec une valeur par défaut

`dictionnaire.get(cle, defaut)` renvoie la valeur si la clé existe, et `defaut` sinon :

```python
stock = {"pomme": 3}

print(stock.get("pomme", 0))
print(stock.get("kiwi", 0))

stock["kiwi"] = stock.get("kiwi", 0) + 2
print(stock)
```

```output
3
0
{'pomme': 3, 'kiwi': 2}
```

On peut aussi tester la présence d'une clé avec `in` :

```python
if "kiwi" in stock:
    print("On a des kiwis")
```

> **À retenir** : avant de lire ou d'incrémenter une clé qui n'existe peut-être pas encore,
> utilise `dico.get(cle, 0)` ou teste `if cle in dico`.

## Parcourir un dictionnaire

```python
stock = {"pomme": 3, "banane": 5}

for produit, quantite in stock.items():
    print(f"{produit} : {quantite}")
```

```output
pomme : 3
banane : 5
```

## Une liste de dictionnaires

En data et en IA, un jeu de données ressemble très souvent à ceci : une **liste** de lignes,
chaque ligne étant un **dictionnaire**.

```python
exemples = [
    {"question": "Capitale de la France ?", "reponse": "Paris"},
    {"question": "2 + 2 ?", "reponse": "4"},
]

for ex in exemples:
    print(f"Q : {ex['question']} → R : {ex['reponse']}")
```

```output
Q : Capitale de la France ? → R : Paris
Q : 2 + 2 ? → R : 4
```

C'est exactement la forme d'un petit jeu de données de **fine-tuning**, que tu verras dans
le module IA2.

## Ce que tu sais faire maintenant

- Lire, ajouter et découper les éléments d'une liste.
- Créer un dictionnaire, lire et modifier ses valeurs.
- Éviter la `KeyError` avec `.get(cle, defaut)` ou `in`.
- Parcourir un dictionnaire avec `.items()`.
