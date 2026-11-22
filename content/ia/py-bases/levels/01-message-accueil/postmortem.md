## Cause racine

`age` est un **entier** (`int`), et Python refuse de le coller à un texte avec `+` :
`TypeError: can only concatenate str (not "int") to str`.

En JavaScript, `"Tu as " + 36` aurait donné `"Tu as 36"` sans broncher. Python est plus
strict, et c'est une protection : il préfère s'arrêter que deviner ce que tu voulais dire.

## Correctif

Une f-string, qui convertit automatiquement chaque valeur entre accolades :

```python
return f"Bienvenue {prenom} ! Tu as {age} ans."
```

Ou une conversion explicite, moins lisible :

```python
return "Bienvenue " + prenom + " ! Tu as " + str(age) + " ans."
```

## Le réflexe à garder

- Pour assembler du texte et des valeurs en Python : **f-string**, toujours.
- Une `TypeError` signifie qu'une opération reçoit un type qu'elle n'accepte pas. Le message
  te dit lesquels : ici `str` et `int`.
