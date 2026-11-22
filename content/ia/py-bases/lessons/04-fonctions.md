---
id: py-bases-04
title: Les fonctions avec def
minutes: 12
summary: Définir une fonction, renvoyer un résultat, et le bug du return placé dans la boucle.
check:
  - prompt: "Que renvoie une fonction Python sans `return` ?"
    choices: ["0", "None", "Une erreur"]
    answer: 1
  - prompt: "Un `return` est indenté à l'intérieur d'une boucle `for`. Que se passe-t-il ?"
    choices:
      - La fonction renvoie la valeur après tous les tours
      - La fonction s'arrête et renvoie la valeur dès le premier tour
      - Python affiche une erreur
    answer: 1
    explain: "return arrête immédiatement la fonction. Dans la boucle, il est exécuté dès le premier tour."
---

## Définir une fonction

```python
def doubler(nombre):
    return nombre * 2

print(doubler(4))
print(doubler(21))
```

```output
8
42
```

- `def` (pour *define*) déclare la fonction ;
- `doubler` est son nom, `nombre` son **paramètre** ;
- les deux points `:` et l'indentation délimitent son corps ;
- `return` renvoie le résultat à celui qui a appelé la fonction.

## Plusieurs paramètres, valeurs par défaut

```python
def prix_ttc(prix_ht, taux=0.2):
    return prix_ht * (1 + taux)

print(prix_ttc(100))          # taux par défaut : 20 %
print(prix_ttc(100, 0.055))   # taux réduit : 5,5 %
```

```output
120.0
105.5
```

`taux=0.2` donne une **valeur par défaut** : si on ne précise pas le taux, il vaut 0.2.

## Sans `return`, la fonction renvoie `None`

```python
def prix_ttc(prix_ht):
    resultat = prix_ht * 1.2
    print("calculé :", resultat)

prix = prix_ttc(100)
print("prix vaut :", prix)
```

```output
calculé : 120.0
prix vaut : None
```

Comme en JavaScript : **afficher** n'est pas **renvoyer**. Le `print` montre le bon nombre,
mais la fonction rend `None`.

## `return` arrête la fonction

Dès que Python rencontre un `return`, il **quitte** la fonction. Tout ce qui suit est ignoré :

```python
def categorie(age):
    if age < 18:
        return "mineur"
    return "majeur"

print(categorie(12), categorie(30))
```

```output
mineur majeur
```

## Le bug du `return` dans la boucle

Voici une fonction qui devrait calculer la somme d'une liste :

```python
def somme(nombres):
    total = 0
    for n in nombres:
        total = total + n
        return total        # indenté dans la boucle !

print(somme([10, 20, 30]))
```

```output
10
```

Le `return` est indenté de 8 espaces : il est **dans** la boucle. Au premier tour,
`total` vaut 10, et la fonction s'arrête immédiatement en renvoyant 10. Les autres
nombres ne sont jamais additionnés.

La correction : retirer 4 espaces, pour que le `return` soit **après** la boucle.

```python
def somme(nombres):
    total = 0
    for n in nombres:
        total = total + n
    return total            # au niveau du for : après la boucle

print(somme([10, 20, 30]))
```

```output
60
```

> **À retenir** : quand une fonction ne traite que le **premier** élément d'une liste,
> vérifie l'indentation de son `return`. Un décalage de 4 espaces suffit à tout changer,
> sans aucun message d'erreur.

## Ce que tu sais faire maintenant

- Définir une fonction avec `def`, des paramètres et des valeurs par défaut.
- Renvoyer un résultat avec `return`, et savoir que sans lui on obtient `None`.
- Repérer un `return` mal indenté qui s'exécute dès le premier tour de boucle.
