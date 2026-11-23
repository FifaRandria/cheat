---
id: express-03
title: Les middlewares et next()
minutes: 14
summary: La chaîne de traitement d'une requête, le rôle de next(), et pourquoi l'ordre de déclaration change tout.
check:
  - prompt: "Un middleware ne répond pas et n'appelle pas `next()`. Que se passe-t-il ?"
    choices:
      - Express passe automatiquement au suivant
      - La requête reste pendue jusqu'au timeout
      - Express renvoie 200
    answer: 1
  - prompt: "Le middleware d'authentification est déclaré APRÈS la route `/admin`. Conséquence ?"
    choices:
      - Aucune, l'ordre n'a pas d'importance
      - "La route /admin répond avant que l'authentification ne soit vérifiée : elle est publique"
      - Express refuse de démarrer
    answer: 1
  - prompt: À quoi Express reconnaît-il un gestionnaire d'erreurs ?
    choices:
      - À son nom
      - Il a exactement quatre paramètres (err, req, res, next)
      - Il est déclaré en premier
    answer: 1
---

## Une chaîne de postes de contrôle

Un **middleware** est une fonction qui reçoit la requête **avant** (ou à la place de) la
route finale. Imagine l'entrée d'un concert :

1. un agent vérifie le billet ;
2. un autre fouille les sacs ;
3. tu entres dans la salle.

Chaque agent peut **laisser passer** (`next()`) ou **refuser** (répondre directement).

```js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next(); // au suivant
});
```

## Le contrat d'un middleware

Un middleware doit faire **l'une** de ces deux choses :

- **répondre** (`res.status(401).json(...)`) : la chaîne s'arrête ;
- appeler **`next()`** : la requête passe au middleware ou à la route suivante.

> **Attention** : s'il ne fait ni l'un ni l'autre, la requête **reste pendue**. Le client
> attend, puis reçoit une erreur de délai dépassé. Aucun message d'erreur côté serveur : c'est
> un bug silencieux, et l'un des plus fréquents.

## L'ordre compte

Express parcourt les middlewares et les routes **dans l'ordre où ils sont déclarés**. Ce code
contient une faille :

```js
app.get("/admin/stats", (req, res) => res.json(statsSecretes));

app.use(exigerConnexion); // trop tard : /admin/stats a déjà répondu
```

La route `/admin/stats` est trouvée **avant** le contrôle, et répond. Le middleware
d'authentification ne s'exécute jamais pour elle.

```js
app.use(exigerConnexion);  // d'abord le contrôle
app.get("/admin/stats", (req, res) => res.json(statsSecretes));
```

> **À retenir** : déclare d'abord ce qui s'applique à tout (journalisation, lecture du JSON,
> authentification), puis les routes, puis les gestionnaires d'erreurs **en dernier**.

## Un middleware d'authentification

```js
function exigerConnexion(req, res, next) {
  const jeton = req.headers.authorization;
  if (!jeton) {
    return res.status(401).json({ error: "Connexion requise" });
  }
  req.utilisateur = verifierJeton(jeton); // on enrichit la requête pour la suite
  next();
}
```

Un middleware peut **ajouter** des informations à `req` (`req.utilisateur`) pour les routes
qui suivent.

## Les gestionnaires d'erreurs

Quand un handler lève une erreur, ou appelle `next(erreur)`, Express saute directement aux
**gestionnaires d'erreurs**. Il les reconnaît à un signe précis : **quatre paramètres**.

```js
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Erreur interne" });
});
```

Avec seulement trois paramètres, Express le prend pour un middleware ordinaire, et ton
gestionnaire n'est **jamais** appelé en cas d'erreur.

## Ce que tu sais faire maintenant

- Écrire un middleware qui répond ou appelle `next()`, jamais aucun des deux.
- Ordonner middlewares, routes et gestionnaires d'erreurs.
- Protéger des routes avec un middleware d'authentification.
- Écrire un gestionnaire d'erreurs à quatre paramètres.
