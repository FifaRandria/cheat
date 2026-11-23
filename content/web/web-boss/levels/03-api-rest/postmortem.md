## Ce qu'il fallait écrire

Des routes **courtes**, qui délèguent au dépôt :

```js
app.post("/prets", authentifier, (req, res) => {
  const outilId = req.body?.outilId;
  if (!Number.isInteger(outilId) || outilId <= 0) {
    return res.status(400).json({ erreur: "outilId doit être un entier positif" });
  }
  res.status(201).json(emprunter(db, req.membre.id, outilId, aujourdhui()));
});
```

Et un gestionnaire d'erreurs **unique**, qui traduit les codes métier en codes HTTP.

## Les pièges évités

- **Valider avant d'agir** : `"1"` (un texte) et `1.5` ne sont pas des identifiants.
  `Number.isInteger` les refuse tous les deux.
- **Pas de try/catch dans chaque route** : une erreur levée remonte toute seule au gestionnaire
  d'erreurs. Le code reste lisible, et aucune route n'oublie de gérer une erreur.
- **Le membre vient du jeton**, jamais du corps de la requête : sinon n'importe qui
  emprunterait au nom d'un autre.

## Le réflexe à garder

- Une route : valider, appeler le métier, répondre. Trois étapes, quelques lignes.
- Les codes HTTP font partie du contrat : 201 pour une création, 409 pour un conflit.
