## Cause racine

Le découpage `liste[debut:fin]` inclut `debut` et **exclut** `fin`. Donc :

- `exemples[:coupure]` contient les index `0` à `coupure - 1` ;
- `exemples[coupure + 1:]` commence à `coupure + 1`.

L'exemple d'index `coupure` n'était dans **aucune** des deux listes. Sur 1 000 exemples avec un
ratio de 0,8, c'est l'exemple n° 800 qui disparaissait.

## Correctif

```python
train = exemples[:coupure]
validation = exemples[coupure:]   # reprend exactement là où train s'arrête
```

Les deux découpages partagent la même borne : ce qui est exclu de l'un est le premier
élément de l'autre.

## Le réflexe à garder

- Pour couper une liste en deux sans rien perdre : `liste[:k]` et `liste[k:]`, avec le
  **même** `k`.
- En IA, une séparation ratée peut faire bien pire que perdre un exemple : si un exemple se
  retrouve **à la fois** en entraînement et en validation (une « fuite »), la loss de
  validation devient trop optimiste et cache le sur-apprentissage.
- Vérifie toujours : `len(train) + len(validation) == len(dataset)`.
