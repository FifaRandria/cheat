## Cause racine

Deux traductions approximatives de la division :

1. `debut = (numero - 1) * par_page / 1` : en Python, `/` donne **toujours** un nombre à
   virgule (`10.0`). Une tranche `elements[10.0:20.0]` est interdite.
2. `round(total / par_page)` à la place de `Math.ceil` : `round(2.5)` donne `2` en Python
   (arrondi « au pair »), et 25 articles ne tenaient plus que sur 2 pages.

## Correctif

```python
import math

def nombre_de_pages(total, par_page):
    return math.ceil(total / par_page)

debut = (numero - 1) * par_page   # que des entiers
```

## Le réflexe à garder

- Chaque fonction mathématique a un équivalent **exact** : `Math.ceil` → `math.ceil`,
  `Math.floor(a / b)` → `a // b`. `round` n'est pas un équivalent de `ceil`.
- Le traceback Python pointe la ligne exacte : lis-le jusqu'au bout.
- `round` en Python arrondit les `.5` au nombre pair le plus proche : `round(2.5)` donne 2,
  `round(3.5)` donne 4.
