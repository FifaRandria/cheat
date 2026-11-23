## Ce qu'il fallait écrire

Trois étapes, dans cet ordre :

```python
texte = texte.lower()                  # 1. uniformiser la casse
for signe in ".,;:!?":
    texte = texte.replace(signe, " ")  # 2. neutraliser la ponctuation

resultat = {}
for mot in texte.split():              # 3. découper et compter
    resultat[mot] = resultat.get(mot, 0) + 1
```

Remplacer la ponctuation par une **espace**, et pas par rien, évite de coller deux mots :
`"rapide.Merci"` donne bien `rapide` et `merci`. Et `split()` sans argument ignore les espaces
multiples.

## Le lien avec l'IA

Tu viens d'écrire un **tokenizer** très simple : la première étape de tout traitement de texte.
Les vrais modèles découpent plus finement (en morceaux de mots), mais l'idée est la même :
nettoyer, découper, compter.

## Le réflexe à garder

- Nettoyer les données **avant** de les compter.
- Compter avec `get(cle, 0) + 1`. La bibliothèque standard propose aussi
  `collections.Counter`, qui fait la même chose en une ligne.
