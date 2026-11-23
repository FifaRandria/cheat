## Cause racine

Chaque relevé illisible était compté comme **0 °C** (`total += 0`), et la moyenne divisait
par le nombre **total** de relevés. Avec 412 relevés manquants sur 744, plus de la moitié des
« mesures » étaient des zéros inventés : la moyenne tombait à 9 °C.

Et le nombre de valeurs manquantes, qui aurait alerté immédiatement, n'était jamais calculé
(toujours `0`).

## Correctif

```python
valeurs = [float(str(r).strip()) for r in releves if not est_manquante(r)]
manquantes = len(releves) - len(valeurs)
moyenne = round(sum(valeurs) / len(valeurs), 1) if valeurs else None
```

## Le réflexe à garder

- Une valeur manquante n'est **pas** un zéro. L'inventer fausse tous les calculs, et
  l'entraînement d'un modèle.
- Divise par le nombre de valeurs **utilisées**.
- Affiche **toujours** le nombre de valeurs manquantes : 412 sur 744 est une information
  essentielle (ici, un problème d'alimentation des capteurs).
- Distingue bien « manquant » et « zéro » : 0 °C est une température tout à fait réelle.
