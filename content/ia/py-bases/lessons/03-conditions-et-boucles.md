---
id: py-bases-03
title: Conditions et boucles
minutes: 14
summary: if, elif, else, puis répéter avec for et range. Et pourquoi range(5) s'arrête à 4.
check:
  - prompt: "Que contient `list(range(1, 5))` ?"
    choices: ["[1, 2, 3, 4, 5]", "[1, 2, 3, 4]", "[0, 1, 2, 3, 4]"]
    answer: 1
    explain: "range s'arrête juste avant la borne de fin : 5 est exclu."
  - prompt: Comment écrit-on « sinon si » en Python ?
    choices: ["else if", "elif", "elseif"]
    answer: 1
  - prompt: "Quelle est la différence entre `=` et `==` ?"
    choices:
      - Aucune
      - "`=` range une valeur, `==` compare deux valeurs"
      - "`==` est plus rapide"
    answer: 1
---

## Les conditions : `if`, `elif`, `else`

```python
note = 13

if note >= 16:
    print("Très bien")
elif note >= 10:
    print("Validé")
else:
    print("À retravailler")
```

```output
Validé
```

Trois choses à remarquer :

1. les deux points `:` à la fin de chaque ligne de condition ;
2. l'**indentation** de 4 espaces pour le contenu de chaque bloc ;
3. `elif`, la contraction de « else if ».

## Comparer

| Opérateur | Signifie |
|---|---|
| `==` | est égal à |
| `!=` | est différent de |
| `<`, `>`, `<=`, `>=` | comparaisons |
| `and`, `or`, `not` | et, ou, non |

```python
age = 20
a_un_billet = True

if age >= 18 and a_un_billet:
    print("Entrée autorisée")

print(3 == 3, "3" == 3, not True)
```

```output
Entrée autorisée
True False False
```

En Python, on écrit `and`, `or` et `not` en toutes lettres, là où JavaScript utilise
`&&`, `||` et `!`.

## La boucle `for` sur une liste

La boucle `for` de Python parcourt directement les éléments d'une collection :

```python
fruits = ["pomme", "banane", "kiwi"]

for fruit in fruits:
    print(f"J'aime la {fruit}")

print("Terminé")
```

```output
J'aime la pomme
J'aime la banane
J'aime la kiwi
Terminé
```

Lis-la comme « **pour chaque** `fruit` **dans** `fruits` ». Pas d'index, pas de risque de
déborder.

## Compter avec `range`

Pour répéter un nombre précis de fois, on utilise `range` :

```python
for i in range(5):
    print("tour", i)
```

```output
tour 0
tour 1
tour 2
tour 3
tour 4
```

`range(5)` produit `0, 1, 2, 3, 4` : **cinq** nombres, en commençant à 0 et en s'arrêtant
**juste avant** 5.

Avec deux nombres, on choisit le départ : `range(1, 5)` donne `1, 2, 3, 4`.

> **À retenir** : la borne de fin de `range` est **exclue**. `range(1, 11)` va de 1 à 10.
> C'est la même logique que les index qui commencent à 0 : `range(len(liste))` donne
> exactement tous les index valides.

## Accumuler dans une boucle

Un motif que tu écriras des centaines de fois : partir de zéro et ajouter à chaque tour.

```python
notes = [12, 15, 9, 18]
somme = 0

for note in notes:
    somme = somme + note    # ou : somme += note

print("Somme :", somme)
print("Moyenne :", somme / len(notes))
```

```output
Somme : 54
Moyenne : 13.5
```

`len(notes)` donne le nombre d'éléments de la liste.

> **Attention** : l'indentation décide de ce qui est **dans** la boucle. Si le `print` de la
> somme était indenté de 4 espaces, il s'exécuterait à **chaque tour**, au lieu d'une seule
> fois à la fin.

## La boucle `while`

```python
bocal = 10
while bocal > 0:
    print(f"Il reste {bocal} bonbons")
    bocal = bocal - 4
```

```output
Il reste 10 bonbons
Il reste 6 bonbons
Il reste 2 bonbons
```

Comme en JavaScript, vérifie que la condition finit par devenir fausse, sinon la boucle ne
s'arrête jamais.

## Ce que tu sais faire maintenant

- Écrire `if`, `elif`, `else` avec `:` et indentation.
- Combiner des conditions avec `and`, `or`, `not`.
- Parcourir une liste avec `for element in liste`.
- Compter avec `range`, en sachant que la fin est exclue.
- Accumuler une somme et la placer **après** la boucle.
