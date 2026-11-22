## Cause racine

`Promise.all` est **fail-fast** : dès qu'une promesse rejette, `Promise.all`
rejette avec cette erreur et les autres résultats sont perdus. Un seul service
en panne suffisait donc à faire renvoyer une erreur 500 à toute la page.

## Correctif

`Promise.allSettled` attend **toutes** les promesses et décrit le sort de
chacune, sans jamais rejeter :

```js
const results = await Promise.allSettled(names.map((name) => sources[name]()));
// [{ status: "fulfilled", value }, { status: "rejected", reason }, …]
```

Chaque résultat devient ensuite un widget `up` ou `down`.

## Le réflexe à garder

Avant d'écrire `Promise.all`, pose-toi la question : *si une seule de ces
opérations échoue, est-ce que tout doit échouer ?*

- Oui (par exemple une transaction) : `Promise.all`.
- Non (des widgets indépendants) : `Promise.allSettled`.

C'est le principe de **dégradation progressive** : une panne partielle ne doit
pas devenir une panne totale.

Tu l'as trouvé sans indice : c'est exactement la compétence du mode Blackout.
