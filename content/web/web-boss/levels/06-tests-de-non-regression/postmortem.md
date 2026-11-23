## Ce qu'il fallait écrire

Une vérification par règle, chacune sur une application neuve :

```js
const app = nouvelleApp();
const premier = await app.handle({ method: "POST", path: "/prets", headers: ADA, body: { outilId: 1 } });
assert.equal(premier.status, 201);
const second = await app.handle({ method: "POST", path: "/prets", headers: ADA, body: { outilId: 1 } });
assert.equal(second.status, 409, "le double emprunt doit répondre 409");
```

## Tester les tests

Les quatre API sabotées sont des **mutants** : des copies de l'application avec un bug
volontaire. Un bon test **tue** le mutant, c'est-à-dire qu'il échoue. Cette technique, le
*mutation testing*, mesure la vraie valeur d'une suite de tests : 100 % des lignes exécutées
ne veut rien dire si aucun `assert` ne vérifie le résultat.

## Le réflexe à garder

- Chaque bug corrigé et chaque faille fermée méritent leur test : sinon ils reviendront.
- Un test vérifie un **comportement** précis, avec un message qui explique la règle.
- Une base neuve par test : des tests qui dépendent les uns des autres échouent au hasard.
