## Cause racine

`findUserById` est une fonction `async` : elle renvoie **une promesse**, pas
l'utilisateur. Sans `await`, la variable `user` contient un objet `Promise`.

- `user.name` vaut `undefined`, car une promesse n'a pas de propriété `name`.
- `!user` est toujours faux, car une promesse est un objet, donc « vraie ».
  L'utilisateur 99 ne déclenchait jamais l'erreur.
- `JSON.stringify({ name: undefined })` donne `{}` : d'où le corps vide côté API.

## Correctif

```js
const user = await findUserById(id);
```

## Le réflexe à garder

Quand une valeur est `undefined` alors que « la donnée existe », affiche-la avec
`console.log`. Si tu vois `Promise { <pending> }`, il manque un `await`.

En TypeScript, ce bug est détecté à la compilation : `Promise<User>` n'a pas de
propriété `name`. C'est l'un des objectifs du module M5.
