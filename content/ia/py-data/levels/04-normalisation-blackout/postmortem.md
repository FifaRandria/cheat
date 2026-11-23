## Cause racine

La formule était fausse dans les deux branches :

- cas normal : `v / mx` au lieu de `(v - mn) / (mx - mn)`. Le minimum ne valait pas 0
  (`20 / 200 = 0.1`), et des valeurs négatives sortaient de l'intervalle [0, 1] ;
- cas « toutes les valeurs égales » : la condition était **inversée**, et c'est précisément
  là qu'on divisait par `mx - mn`, qui vaut 0. D'où le plantage une nuit sur deux, selon les
  données du jour.

Et une liste vide faisait planter `min()`.

## Correctif

```python
if not valeurs:
    return []
mn, mx = min(valeurs), max(valeurs)
if mx == mn:
    return [0.0 for _ in valeurs]
return [(v - mn) / (mx - mn) for v in valeurs]
```

## Le réflexe à garder

- Vérifie une formule sur ses **bornes** : le minimum doit donner 0, le maximum 1. Les logs
  montraient `0.1` pour le minimum.
- Une division par `max - min` appelle toujours la question : « et si toutes les valeurs sont
  égales ? ».
- Un pipeline qui plante « une nuit sur deux » dépend des **données**, pas du code : cherche
  quelle donnée déclenche le cas limite.
