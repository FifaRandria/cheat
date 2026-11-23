---
id: data-03
title: Valeurs manquantes et statistiques
minutes: 13
summary: Reconnaître une valeur manquante, ne jamais la remplacer par zéro sans réfléchir, et choisir entre moyenne et médiane.
check:
  - prompt: "Températures : 20, 22, (vide), 21. Que donne une moyenne qui remplace le vide par 0 ?"
    choices: ["21", "15.75", "Une erreur"]
    answer: 1
    explain: "(20 + 22 + 0 + 21) / 4 = 15,75 : un zéro inventé fait chuter la moyenne."
  - prompt: Quelle statistique résiste le mieux à une valeur aberrante ?
    choices: ["La moyenne", "La médiane"]
    answer: 1
  - prompt: Pourquoi compter les valeurs manquantes ?
    choices:
      - Pour savoir si le résultat est fiable, et repérer un problème de collecte
      - Ce n'est pas utile
    answer: 0
---

## À quoi ressemble une valeur manquante ?

Une cellule vide n'a pas toujours la même forme. Selon l'outil qui a produit le fichier, tu
peux trouver :

| Forme | Origine fréquente |
|---|---|
| `""` | cellule vide dans un CSV |
| `"NA"`, `"N/A"`, `"null"` | exports de logiciels statistiques ou de bases |
| `None` | données venant d'une API ou de Python |
| `"-"`, `"?"` | saisie humaine |

Avant tout calcul, décide quelles formes signifient « manquant » dans **ton** fichier.

```python
MANQUANTES = {"", "na", "n/a", "null", "-"}

def est_manquante(v):
    return v is None or str(v).strip().lower() in MANQUANTES

print([est_manquante(v) for v in ["21", "", "NA", None, "0"]])
```

```output
[False, True, True, True, False]
```

Remarque : `"0"` **n'est pas** une valeur manquante. Zéro est une vraie mesure.

## Le piège : remplacer par zéro

```python
releves = ["20", "22", "", "21"]
fausse_moyenne = sum(float(v) if v else 0 for v in releves) / len(releves)
print(fausse_moyenne)
```

```output
15.75
```

Le vide a été remplacé par 0 °C, une température **inventée**. La moyenne tombe de 21 à
15,75. Un modèle entraîné sur ces données apprendrait n'importe quoi.

La bonne approche, dans la plupart des cas : **ignorer** les valeurs manquantes dans le
calcul, et les **compter**.

```python
valeurs = [float(v) for v in releves if not est_manquante(v)]
print(sum(valeurs) / len(valeurs), "| manquantes :", len(releves) - len(valeurs))
```

```output
21.0 | manquantes : 1
```

> **À retenir** : ne remplace jamais une valeur manquante par 0 « pour que ça marche ».
> Ignore-la, ou remplace-la par une valeur **justifiée** (la médiane de la colonne, par
> exemple), et garde la trace du nombre de valeurs manquantes.

## Moyenne ou médiane ?

```python
import statistics

salaires = [2100, 2300, 2250, 2400, 48000]
print("moyenne :", statistics.mean(salaires))
print("médiane :", statistics.median(salaires))
```

```output
moyenne : 11410
médiane : 2300
```

Un seul salaire très élevé fait exploser la moyenne. La **médiane** (la valeur du milieu,
une fois les valeurs triées) n'est presque pas affectée.

- **moyenne** : utile quand les valeurs sont homogènes ;
- **médiane** : plus fiable en présence de valeurs extrêmes.

## Ce que tu sais faire maintenant

- Reconnaître les différentes formes d'une valeur manquante, sans confondre avec zéro.
- Calculer une statistique en ignorant les valeurs manquantes, et les compter.
- Choisir entre moyenne et médiane.
