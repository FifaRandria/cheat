---
id: data-04
title: Normaliser, et découvrir numpy et pandas
minutes: 15
summary: Mettre les colonnes à la même échelle avant d'entraîner un modèle, éviter la fuite de données, et ce que numpy et pandas font pour toi.
check:
  - prompt: "Normalisation min-max de [10, 20, 30] : que vaut 20 ?"
    choices: ["0.5", "20", "0.66"]
    answer: 0
  - prompt: Toutes les valeurs d'une colonne sont égales. Que pose la formule min-max ?
    choices:
      - Rien
      - Une division par zéro, puisque max - min vaut 0
    answer: 1
  - prompt: "Pourquoi calculer le min et le max sur les seules données d'entraînement ?"
    choices:
      - Pour aller plus vite
      - Pour que les données de validation restent vraiment « jamais vues » et éviter une fuite de données
    answer: 1
---

## Pourquoi normaliser ?

Imagine un modèle qui prédit le prix d'un appartement à partir de :

- la surface, entre 20 et 200 m² ;
- le nombre de pièces, entre 1 et 6.

Pour beaucoup d'algorithmes, la surface « pèse » beaucoup plus, simplement parce que ses
nombres sont plus grands. **Normaliser**, c'est ramener toutes les colonnes à une échelle
comparable.

## La normalisation min-max

Chaque valeur est ramenée entre 0 et 1 :

```output
valeur normalisée = (valeur - min) / (max - min)
```

```python
def min_max(valeurs):
    mn, mx = min(valeurs), max(valeurs)
    if mx == mn:
        return [0.0 for _ in valeurs]
    return [(v - mn) / (mx - mn) for v in valeurs]

print(min_max([20, 65, 110, 200]))
print(min_max([7, 7, 7]))
```

```output
[0.0, 0.25, 0.5, 1.0]
[0.0, 0.0, 0.0]
```

> **Attention** : si toutes les valeurs sont égales, `max - min` vaut 0 : sans précaution,
> c'est une `ZeroDivisionError`.

## La standardisation

Autre méthode courante : centrer sur la moyenne et diviser par l'écart-type. Les valeurs
obtenues ont une moyenne de 0 et un écart-type de 1.

```python
import statistics

def standardiser(valeurs):
    m = statistics.mean(valeurs)
    s = statistics.pstdev(valeurs)
    return [(v - m) / s for v in valeurs] if s else [0.0 for _ in valeurs]

print([round(x, 2) for x in standardiser([20, 65, 110, 200])])
```

```output
[-1.18, -0.51, 0.17, 1.52]
```

## La fuite de données

Le piège le plus sournois : calculer le min et le max sur **tout** le dataset, **avant** de
le séparer en entraînement et validation. Les données de validation ont alors influencé la
préparation : elles ne sont plus vraiment « jamais vues ».

> **À retenir** : sépare d'abord, puis calcule les paramètres de normalisation (min, max,
> moyenne…) **uniquement** sur l'entraînement, et applique-les tels quels à la validation.

## numpy et pandas

Tout ce que tu as fait à la main dans ce module, deux bibliothèques le font en une ligne, et
des centaines de fois plus vite :

- **numpy** manipule des tableaux de nombres. Les opérations s'appliquent à tous les
  éléments d'un coup, sans boucle : c'est la **vectorisation** ;
- **pandas** manipule des tableaux à colonnes nommées, les **DataFrames**, comme un tableur
  programmable.

```python
import numpy as np
import pandas as pd

surfaces = np.array([20, 65, 110, 200])
print((surfaces - surfaces.min()) / (surfaces.max() - surfaces.min()))

df = pd.read_csv("ventes.csv", sep=";", decimal=",")
df = df.drop_duplicates()
print(df["prix"].median(), df["prix"].isna().sum())
```

```output
[0.   0.25 0.5  1.  ]
19.5 3
```

| À la main (ce module) | pandas |
|---|---|
| `csv.DictReader(..., delimiter=";")` + `replace(",", ".")` | `pd.read_csv(..., sep=";", decimal=",")` |
| boucle de dédoublonnage | `df.drop_duplicates()` |
| compter les valeurs manquantes | `df["prix"].isna().sum()` |
| `statistics.median(...)` | `df["prix"].median()` |

Ces bibliothèques ne sont pas disponibles dans le bac à sable des exercices : c'est voulu.
En écrivant les opérations à la main, tu comprends ce que pandas fait pour toi, et tu sauras
diagnostiquer ses résultats.

## Ce que tu sais faire maintenant

- Normaliser une colonne avec min-max, sans division par zéro.
- Standardiser une colonne.
- Éviter la fuite de données en calculant les paramètres sur l'entraînement seulement.
- Reconnaître les équivalents numpy et pandas des opérations de ce module.
