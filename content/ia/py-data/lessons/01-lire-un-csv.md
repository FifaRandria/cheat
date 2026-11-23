---
id: data-01
title: Lire un fichier CSV avec Python
minutes: 12
summary: Le format CSV, le module csv, les lignes en dictionnaires, et le piège des exports Excel français.
check:
  - prompt: "Avec `csv.DictReader`, de quel type est la valeur `ligne[\"prix\"]` ?"
    choices: ["float", "int", "str (texte)"]
    answer: 2
    explain: "Le module csv lit tout comme du texte. C'est à toi de convertir."
  - prompt: "Un export Excel français contient `Clavier;12,50`. Quel est le séparateur, et que faut-il faire avant `float` ?"
    choices:
      - "Séparateur `,` ; rien de spécial"
      - "Séparateur `;` ; remplacer la virgule décimale par un point"
      - "Séparateur `;` ; rien de spécial"
    answer: 1
  - prompt: "Que donne `float(\"12,50\")` en Python ?"
    choices: ["12.5", "Une ValueError", "1250.0"]
    answer: 1
---

## Le format CSV

Un fichier **CSV** (*Comma-Separated Values*) est un tableau écrit en texte : une ligne par
enregistrement, des valeurs séparées par un caractère, et souvent une première ligne d'en-tête.

```output
produit,quantite,prix
Clavier,2,49.90
Souris,5,19.50
```

C'est le format d'échange le plus courant en data : exports de tableurs, de bases de données,
d'outils marketing. Et c'est la première source de données que tu manipuleras avant
d'entraîner un modèle.

## Le module csv

Python sait lire les CSV sans rien installer. `csv.DictReader` transforme chaque ligne en
**dictionnaire**, avec les noms de colonnes comme clés :

```python
import csv
import io

texte = """produit,quantite,prix
Clavier,2,49.90
Souris,5,19.50"""

for ligne in csv.DictReader(io.StringIO(texte)):
    print(ligne)
```

```output
{'produit': 'Clavier', 'quantite': '2', 'prix': '49.90'}
{'produit': 'Souris', 'quantite': '5', 'prix': '19.50'}
```

`io.StringIO(texte)` fait passer une chaîne pour un fichier. Avec un vrai fichier, on écrit
`open("ventes.csv", encoding="utf-8", newline="")`.

## Tout est du texte

Regarde bien la sortie : `'2'` et `'49.90'` sont entre apostrophes. Ce sont des **textes**.

```python
total = 0
for ligne in csv.DictReader(io.StringIO(texte)):
    total += int(ligne["quantite"]) * float(ligne["prix"])
print(round(total, 2))
```

```output
197.3
```

> **À retenir** : le module `csv` ne devine jamais les types. Chaque nombre doit être converti
> explicitement avec `int(...)` ou `float(...)`.

## Le piège des exports Excel français

En France (et dans de nombreux pays), la virgule sert de **séparateur décimal**. Excel
exporte donc les CSV avec un **point-virgule** comme séparateur de colonnes :

```output
produit;quantite;prix
Clavier;2;49,90
Souris;5;19,50
```

Deux conséquences :

```python
texte_fr = "produit;quantite;prix\nClavier;2;49,90"

print(next(csv.DictReader(io.StringIO(texte_fr))))
```

```output
{'produit;quantite;prix': 'Clavier;2;49', None: ['90']}
```

Avec le séparateur par défaut (`,`), l'en-tête devient **une seule colonne** au nom bizarre,
et la virgule décimale de `49,90` est prise pour un séparateur : le prix est coupé en deux.
Il faut préciser le séparateur :

```python
ligne = next(csv.DictReader(io.StringIO(texte_fr), delimiter=";"))
print(ligne)
print(float(ligne["prix"].replace(",", ".")))
```

```output
{'produit': 'Clavier', 'quantite': '2', 'prix': '49,90'}
49.9
```

> **Attention** : `float("49,90")` lève une `ValueError`. Pour un nombre au format français,
> remplace la virgule par un point avant de convertir.

> **Astuce** : avant de traiter un fichier, affiche toujours la première ligne lue. Une clé
> comme `'produit;quantite;prix'` révèle immédiatement un mauvais séparateur.

## Ce que tu sais faire maintenant

- Lire un CSV ligne par ligne avec `csv.DictReader`.
- Convertir explicitement les valeurs numériques.
- Reconnaître et lire un export Excel français (`;` et virgule décimale).
- Vérifier la première ligne lue avant de lancer un traitement.
