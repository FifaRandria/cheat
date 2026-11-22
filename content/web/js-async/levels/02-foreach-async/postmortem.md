## Cause racine

`forEach` **ignore la valeur renvoyée** par son callback. Avec un callback
`async`, chaque tour de boucle crée une promesse que personne n'attend :

1. `forEach` lance les trois envois puis rend la main immédiatement ;
2. `return sent` s'exécute alors que `sent` vaut encore `0` ;
3. les e-mails partent *après* la fin de la fonction, d'où les logs dans le désordre.

## Correctif

Envois en parallèle, en attendant qu'ils soient tous terminés :

```js
await Promise.all(users.map((user) => sendEmail(user.email, subject)));
return users.length;
```

Ou bien envois l'un après l'autre, si le service limite le débit :

```js
for (const user of users) {
  await sendEmail(user.email, subject);
}
```

## Le réflexe à garder

`forEach`, `map` ou `filter` avec un callback `async` est presque toujours
suspect. **Lis l'ordre des logs** : une tâche qui se termine avant ses propres
sous-tâches signale une promesse qui n'est pas attendue.
