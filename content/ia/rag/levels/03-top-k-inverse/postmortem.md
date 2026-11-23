## Cause racine

`sorted` trie par ordre **croissant** par défaut. `tries[:k]` gardait donc les *k* passages
les **moins** similaires : exactement l'inverse du but recherché.

Et le paramètre `seuil` était reçu… mais jamais utilisé. Sans seuil, le chatbot recevait
toujours *k* passages, même sans aucun rapport, et inventait une réponse à partir d'eux.

## Correctif

```python
pertinents = [s for s in scores if s[1] >= seuil]
tries = sorted(pertinents, key=lambda s: s[1], reverse=True)
return [passage for passage, score in tries[:k]]
```

## Le réflexe à garder

- Après tout tri, vérifie le **sens** : le premier élément est-il bien le meilleur ?
- Quand un RAG répond à côté, **affiche les passages envoyés au modèle**. Le problème est
  presque toujours visible à cette étape, avant même de regarder le modèle.
- Un résultat vide est une réponse valable : il permet au chatbot de dire « je ne sais pas »
  au lieu d'halluciner.
