## Cause racine

Le script supposait un CSV « à l'anglaise ». L'Excel français exporte avec :

- **`;`** comme séparateur de colonnes ;
- **`,`** comme séparateur décimal.

Avec le séparateur par défaut, `csv` ne voyait qu'une colonne nommée `'produit;quantite;prix'`,
d'où la `KeyError: 'quantite'`. Et même avec le bon séparateur, `float("49,90")` aurait levé
une `ValueError`.

## Correctif

```python
separateur = ";" if ";" in entete else ","
for ligne in csv.DictReader(io.StringIO(texte_csv), delimiter=separateur):
    prix = float(ligne["prix"].strip().replace(",", "."))
```

## Le réflexe à garder

- Affiche **la première ligne lue** avant tout calcul : une clé bizarre trahit un mauvais
  séparateur.
- Les formats de nombres et de dates dépendent de la **langue** du logiciel qui les a
  produits.
- En pandas : `pd.read_csv(fichier, sep=";", decimal=",")`.
