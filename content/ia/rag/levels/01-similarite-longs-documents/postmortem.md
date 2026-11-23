## Cause racine

La fonction `similarite` renvoyait le **produit scalaire brut**. Or le produit scalaire
grandit avec la **longueur** des vecteurs : un document de 24 000 mots a un vecteur énorme,
qui écrase n'importe quelle FAQ, même parfaitement pertinente. D'où un chatbot qui citait
toujours les CGV.

Indice qui ne trompait pas : des « similarités » de 187, alors qu'une similarité cosinus est
toujours comprise entre -1 et 1.

## Correctif

```python
def similarite(a, b):
    na, nb = norme(a), norme(b)
    if na == 0 or nb == 0:
        return 0.0
    return produit_scalaire(a, b) / (na * nb)
```

## Le réflexe à garder

- Pour comparer des embeddings : similarité **cosinus**, ou produit scalaire seulement si les
  vecteurs sont déjà normalisés.
- Vérifie les **ordres de grandeur** : une métrique qui sort de son intervalle attendu signale
  un bug de formule.
- Un RAG qui renvoie toujours le même document, quelle que soit la question, souffre presque
  toujours d'un problème de similarité.
