---
id: py-bases-06
title: Déboguer en Python
minutes: 12
summary: Lire un traceback jusqu'au bout, afficher les bonnes valeurs avec print et repr, et isoler un bug dans un script de données.
check:
  - prompt: Dans un traceback Python, où se trouve le type d'erreur ?
    choices:
      - Sur la première ligne
      - Sur la dernière ligne
      - Il n'est jamais affiché
    answer: 1
  - prompt: "Pourquoi utiliser `print(repr(x))` plutôt que `print(x)` ?"
    choices:
      - C'est plus rapide
      - "repr montre la valeur exacte : les guillemets d'un texte, les espaces invisibles, la différence entre \"42\" et 42"
      - Il n'y a aucune différence
    answer: 1
  - prompt: Un script plante sur la ligne 5 000 d'un fichier CSV. Comment isoler le problème ?
    choices:
      - Relire les 5 000 lignes à la main
      - Afficher la ligne fautive (son numéro et son contenu) au moment de l'erreur
      - Supprimer le fichier
    answer: 1
---

## Le traceback, de bas en haut

Tu connais déjà la règle de la leçon 1 : un traceback se lit **en partant du bas**.

```python
def age_moyen(personnes):
    total = 0
    for p in personnes:
        total += p["age"]
    return total / len(personnes)

donnees = [{"nom": "Ada", "age": 36}, {"nom": "Bob", "age": "41"}]
print(age_moyen(donnees))
```

```output
Traceback (most recent call last):
  File "main.py", line 8, in <module>
    print(age_moyen(donnees))
  File "main.py", line 4, in age_moyen
    total += p["age"]
TypeError: unsupported operand type(s) for +=: 'int' and 'str'
```

Trois informations, dans l'ordre de lecture :

1. **le type et le message** : on additionne un `int` et un `str` ;
2. **la ligne fautive** : la ligne 4, `total += p["age"]` ;
3. **le chemin** pour y arriver : la ligne 8 a appelé `age_moyen`.

Le message dit **ce qui** ne va pas. Il reste à trouver **quelle donnée** le provoque.

## `print` et `repr` : voir la vraie valeur

`print` affiche une version « jolie » des valeurs, qui peut tromper :

```python
a = 41
b = "41"
c = "41 "
print(a, b, c)
print(repr(a), repr(b), repr(c))
```

```output
41 41 41
41 '41' '41 '
```

Avec `print`, les trois semblent identiques. Avec `repr`, on voit que `b` est un **texte** et
que `c` contient un **espace** en trop. Dans une f-string, `!r` fait la même chose :

```python
for p in donnees:
    print(f"{p['nom']} : {p['age']!r}")
```

```output
Ada : 36
Bob : '41'
```

Voilà le coupable : l'âge de Bob a été enregistré comme du texte.

> **À retenir** : pour déboguer, affiche avec `repr` (ou `!r`). Les espaces invisibles, les
> guillemets et les types deviennent visibles.

## Isoler dans un gros fichier

Avec des milliers de lignes, on ne cherche pas à la main. On fait dire au programme **où**
il échoue :

```python
lignes = ["36", "41", "quarante", "28"]

for numero, valeur in enumerate(lignes, start=1):
    try:
        age = int(valeur)
    except ValueError:
        print(f"ligne {numero} invalide : {valeur!r}")
```

```output
ligne 3 invalide : 'quarante'
```

`enumerate(liste, start=1)` donne à la fois le numéro et la valeur. Le `try` / `except` ne
sert pas à cacher l'erreur, mais à **signaler** précisément la donnée fautive.

> **Attention** : un `except` qui ne fait rien (`except: pass`) est l'un des pires réflexes.
> Il fait disparaître l'erreur… et le moyen de la comprendre.

## La méthode, en Python comme ailleurs

1. **Reproduire** avec les mêmes données.
2. **Observer** : traceback complet, valeurs avec `repr`.
3. **Supposer** : « l'âge de certaines lignes est un texte ».
4. **Isoler** : quelle ligne exactement ?
5. **Corriger la cause** : convertir à la lecture, ou corriger la donnée.
6. **Vérifier** sur tout le fichier.

## Ce que tu sais faire maintenant

- Lire un traceback complet et en tirer le type, la ligne et le chemin.
- Afficher la vraie valeur d'une variable avec `repr` ou `!r`.
- Localiser la ligne fautive d'un gros fichier avec `enumerate`.
- Utiliser `try` / `except` pour signaler, et non pour cacher.
