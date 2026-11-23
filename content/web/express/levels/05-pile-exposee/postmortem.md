## Cause racine

Express distingue un gestionnaire d'erreurs d'un middleware ordinaire par **le nombre de ses
paramètres** : exactement quatre, `(err, req, res, next)`.

Le gestionnaire de l'équipe n'en avait que **trois** : `(err, req, res)`. Pour Express,
c'était donc un middleware normal, jamais appelé en cas d'erreur. Faute de gestionnaire,
Express appliquait son comportement par défaut : une page HTML avec la pile d'appels
complète… et, ici, le message d'erreur contenant un identifiant de la base de production.

Le contenu du gestionnaire était parfait. Il manquait **un paramètre inutilisé**.

## Correctif

```js
app.use((err, req, res, next) => {
  const status = err.status ?? 500;
  res.status(status).json({ error: status === 500 ? "Erreur interne" : err.message });
});
```

`next` n'est pas utilisé, mais il doit être **déclaré**. Les outils de lint signalent
souvent les paramètres inutilisés : c'est l'un des rares cas où il faut leur désobéir.

## Le réflexe à garder

- Un gestionnaire d'erreurs Express a **toujours** quatre paramètres.
- Teste ton API avec une erreur volontaire, et regarde ce que le **client** reçoit
  réellement.
- Les messages d'erreur internes peuvent contenir des secrets : ils vont dans les logs, jamais
  dans la réponse.

Tu l'as trouvé avec la seule documentation officielle : c'est l'esprit du mode Blackout.
