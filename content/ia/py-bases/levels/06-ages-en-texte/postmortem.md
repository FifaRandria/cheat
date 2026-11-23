## Cause racine

Le code supposait des données **parfaites** : un âge toujours présent, toujours entier.
Le nouveau fichier CSV contenait quatre sortes d'âges :

| Valeur | Problème |
|---|---|
| `36` | aucun |
| `"41"` | texte : `int + str` donne une `TypeError` |
| `" 28 "` | texte avec des espaces |
| absent, `""` ou `"quarante"` | `KeyError` ou `ValueError` |

Et la moyenne divisait par **toutes** les personnes, y compris celles sans âge valide.

## Correctif

```python
valeur = p.get("age")          # pas de KeyError si la clé manque
try:
    ages.append(int(str(valeur).strip()))
except ValueError:
    continue                    # âge inutilisable : on l'ignore
...
return sum(ages) / len(ages) if ages else 0
```

## Le réflexe à garder

- Les données réelles sont **sales**. Avant de calculer, demande-toi : absent ? vide ? mauvais
  type ? espaces ?
- `repr` aurait montré le problème en une ligne : `36` contre `'41'`.
- On divise par le nombre de valeurs **utilisées**, pas par le nombre de lignes.

C'est le cœur du module IA1 : en data et en IA, nettoyer les données représente souvent la
plus grande partie du travail.
