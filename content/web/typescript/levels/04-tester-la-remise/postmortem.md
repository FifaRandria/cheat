## Ce qu'il fallait écrire

Des vérifications **aux bornes** de chaque règle :

```js
assert.equal(remiseFidelite(100, 0.9), 0);   // juste avant 1 an
assert.equal(remiseFidelite(100, 1), 5);     // pile sur 1 an
assert.equal(remiseFidelite(100, 2.9), 5);   // juste avant 3 ans
assert.equal(remiseFidelite(100, 3), 10);    // pile sur 3 ans
assert.equal(remiseFidelite(1000, 5), 50);   // le plafond
assert.equal(remiseFidelite(-100, 5), 0);    // un total négatif
```

## Pourquoi ces quatre mutants ?

Ce sont les erreurs que font vraiment les développeurs : une borne `>` au lieu de `>=`, une
règle oubliée lors d'une réécriture (le plafond), un cas limite jamais imaginé (le total
négatif, par exemple après un avoir). Une suite de tests qui ne les voit pas donnerait une
fausse impression de sécurité.

## Le réflexe à garder

- Pour chaque règle, se demander : « si quelqu'un la cassait, quel test échouerait ? ».
- Tester **sur** les bornes et **juste à côté**.
- Un test vaut par ce qu'il détecte, pas par le nombre de lignes qu'il exécute.
