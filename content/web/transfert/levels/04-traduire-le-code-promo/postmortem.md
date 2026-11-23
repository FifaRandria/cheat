## Ce qu'il fallait écrire

```python
def total_avec_promo(prix, code=None):
    cle = (code or "").strip().upper()
    taux = REMISES.get(cle, 0)
    return round(prix * (1 - taux), 2)
```

| JavaScript | Python |
|---|---|
| `code ?? ""` | `code or ""` |
| `.trim().toUpperCase()` | `.strip().upper()` |
| `REMISES[cle] ?? 0` | `REMISES.get(cle, 0)` |
| `Math.round(x * 100) / 100` | `round(x, 2)` |

## Une nuance

`??` ne remplace que `null` et `undefined` ; `or` remplace **toute** valeur fausse (`""`, `0`,
`[]`). Ici, c'est équivalent, car un code vide et un code absent doivent se comporter pareil.
Ce n'est pas toujours le cas : `quantite or 1` transformerait une quantité de `0` en `1`.

## Le réflexe à garder

- Porter un programme qu'on connaît est le meilleur exercice pour apprendre un langage : on
  sait ce qu'il doit faire, on ne lutte qu'avec la syntaxe.
- Porter les **tests** avec le code : ils prouvent que la traduction est fidèle.
- Vérifier les équivalences « presque identiques » (`??` et `or`) : c'est là que naissent les
  bugs de portage.
