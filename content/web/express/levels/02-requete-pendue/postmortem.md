## Cause racine

Le `next()` du journaliseur était **dans** le `if` : il n'était appelé que pour les chemins
commençant par `/rapports`. Pour toutes les autres requêtes, le middleware ne répondait pas
et ne passait pas la main. La requête restait **pendue**, jusqu'à ce que le répartiteur de
charge abandonne avec une erreur `504`.

Côté serveur, rien d'anormal : pas d'exception, pas de plantage. C'est ce qui rend ce bug si
sournois.

## Correctif

```js
app.use((req, res, next) => {
  journal.push(`${req.method} ${req.path}`);
  if (req.path.startsWith("/rapports")) {
    journal.push("attention : requête potentiellement lente");
  }
  next(); // dans tous les cas
});
```

## Le réflexe à garder

- Une requête qui « tourne dans le vide » sans erreur côté serveur : cherche un middleware qui
  n'appelle pas `next()` dans **toutes** ses branches.
- Relis chaque middleware avec cette question : « pour chaque chemin possible, est-ce que je
  réponds ou est-ce que j'appelle `next()` ? ».
