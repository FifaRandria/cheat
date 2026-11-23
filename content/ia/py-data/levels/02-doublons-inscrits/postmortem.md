## Cause racine

`set()` supprime les doublons **exacts**. Or `"Ada@Ex.com"`, `" ada@ex.com"` et
`"ada@ex.com"` sont trois textes différents pour Python, alors qu'il s'agit de la même
personne. Résultat : 1 200 adresses avant, 1 200 après. Le dédoublonnage ne faisait rien.

En prime, `set()` mélangeait l'ordre, et les entrées vides passaient.

## Correctif

Normaliser **avant** de comparer, et garder l'ordre avec un ensemble de valeurs déjà vues :

```python
propre = (email or "").strip().lower()
if propre and propre not in vus:
    vus.add(propre)
    resultat.append(propre)
```

## Le réflexe à garder

- **Normalise d'abord, compare ensuite** : espaces, casse, accents selon les cas.
- Un nettoyage qui ne change rien (1 200 avant, 1 200 après) doit éveiller les soupçons.
- En pandas : `df["email"].str.strip().str.lower().drop_duplicates()`.
