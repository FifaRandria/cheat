## Ce qu'il fallait écrire

```python
def bulletin(notes):
    if not notes:
        return None
    moyenne = round(sum(notes) / len(notes), 1)
    return {"moyenne": moyenne, "min": min(notes), "max": max(notes),
            "mention": mention(moyenne)}
```

Séparer le calcul de la mention dans sa **propre fonction** rend le code plus lisible et plus
facile à tester.

## Les pièges évités

- **La liste vide** : `sum([]) / len([])` lève une `ZeroDivisionError`, et `min([])` une
  `ValueError`. On la traite en premier.
- **Les bornes** : avec `<=` au lieu de `<`, une moyenne de 12 tombait en « Passable ». Les
  erreurs de borne sont parmi les bugs les plus fréquents : les tests de bornes existent pour ça.

## Le réflexe à garder

- Traiter les cas limites en haut de la fonction (« clause de garde »).
- Une chaîne de `if / elif` se lit de la valeur la plus basse à la plus haute.
- Tester **exactement sur les bornes** : 10, 12, 14, 16.
