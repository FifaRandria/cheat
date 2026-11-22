---
id: py-bases-02
title: Variables, types et f-strings
minutes: 12
summary: Ranger des valeurs, distinguer entiers, décimaux, textes et booléens, et assembler du texte sans erreur.
check:
  - prompt: "Que produit `\"J'ai \" + 25 + \" ans\"` en Python ?"
    choices:
      - "J'ai 25 ans"
      - Une TypeError
      - "J'ai  ans"
    answer: 1
    explain: "Contrairement à JavaScript, Python refuse d'additionner un texte et un nombre. Il faut convertir avec `str(25)`, ou utiliser une f-string."
  - prompt: "Que vaut `f\"{prenom} a {age} ans\"` si prenom = \"Ada\" et age = 36 ?"
    choices: ["\"{prenom} a {age} ans\"", "\"Ada a 36 ans\"", "Une erreur"]
    answer: 1
  - prompt: "Quel est le type de `3.5` ?"
    choices: ["int", "float", "str"]
    answer: 1
---

## Créer une variable

En Python, pas de `let` ni de `const` : on écrit directement le nom, `=`, puis la valeur.

```python
prenom = "Ada"
age = 36
age = age + 1    # on peut réassigner librement

print(prenom, age)
```

```output
Ada 37
```

Comme en JavaScript, `=` veut dire **« range dans »**, pas « est égal à ».

Par convention, les noms de variables Python s'écrivent en **minuscules avec des tirets bas** :
`nombre_de_vies`, `taux_tva`. C'est le style *snake_case*.

## Les types de base

| Type | Exemples | Sert à |
|---|---|---|
| `int` | `42`, `-7`, `0` | les nombres entiers |
| `float` | `3.14`, `0.5`, `2.0` | les nombres à virgule |
| `str` | `"Bonjour"`, `'Ada'` | le texte |
| `bool` | `True`, `False` | oui ou non (avec une majuscule !) |
| `None` | `None` | « rien », l'équivalent de `null` |

`type(...)` donne le type d'une valeur :

```python
print(type(42))
print(type(3.14))
print(type("42"))
print(type(True))
```

```output
<class 'int'>
<class 'float'>
<class 'str'>
<class 'bool'>
```

## Python est strict avec les types

En JavaScript, `"5" + 3` donne `"53"`. Python, lui, **refuse** de mélanger texte et nombre :

```python
age = 25
message = "J'ai " + age + " ans"
```

```output
TypeError: can only concatenate str (not "int") to str
```

Le message se lit ainsi : « on ne peut concaténer (coller) un `str` qu'avec un autre `str`,
pas avec un `int` ».

C'est une bonne chose : Python t'arrête au lieu de produire un résultat bizarre.

Deux solutions. Convertir le nombre en texte avec `str(...)` :

```python
age = 25
message = "J'ai " + str(age) + " ans"
print(message)
```

```output
J'ai 25 ans
```

Ou, beaucoup plus lisible, utiliser une **f-string**.

## Les f-strings

Une **f-string** est un texte précédé d'un `f`. Tout ce qui est entre accolades `{ }` est
remplacé par sa valeur, quel que soit son type :

```python
prenom = "Ada"
age = 36
taille = 1.68

print(f"{prenom} a {age} ans et mesure {taille} m.")
print(f"Dans 10 ans, elle aura {age + 10} ans.")
```

```output
Ada a 36 ans et mesure 1.68 m.
Dans 10 ans, elle aura 46 ans.
```

> **À retenir** : pour construire un texte qui contient des valeurs, utilise une f-string :
> `f"Bonjour {prenom}"`. N'oublie pas le `f` devant les guillemets : sans lui, les accolades
> s'affichent telles quelles.

## Convertir d'un type à l'autre

```python
print(int("42") + 1)      # texte vers entier
print(float("3.5") * 2)   # texte vers décimal
print(str(100) + "%")     # nombre vers texte
print(int(7.9))           # coupe la partie décimale : 7
```

```output
43
7.0
100%
7
```

> **Attention** : `input()` (la saisie au clavier) et les données lues dans un fichier CSV
> arrivent sous forme de **texte**. Convertis-les avant de calculer.

## Ce que tu sais faire maintenant

- Créer et modifier une variable.
- Reconnaître `int`, `float`, `str`, `bool` et `None`.
- Comprendre la `TypeError` texte + nombre.
- Construire un texte avec une f-string `f"... {valeur} ..."`.
- Convertir avec `int()`, `float()` et `str()`.
