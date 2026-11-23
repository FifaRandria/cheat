---
id: express-02
title: Routes, paramètres et réponses
minutes: 12
summary: Déclarer des routes, lire les paramètres, la query et le corps, et répondre avec le bon code.
check:
  - prompt: "Pour la route `/commandes/:id`, comment lire 17 dans `/commandes/17` ?"
    choices: ["req.query.id", "req.params.id", "req.body.id"]
    answer: 1
  - prompt: "Comment lire `page` dans `/produits?page=2` ?"
    choices: ["req.params.page", "req.query.page", "req.headers.page"]
    answer: 1
  - prompt: Quel code renvoyer après la création réussie d'une ressource ?
    choices: ["200", "201", "204"]
    answer: 1
---

## Déclarer une route

Une **route** associe une méthode et un chemin à une fonction, le **handler** :

```js
app.get("/produits", (req, res) => {
  res.json(produits);
});
```

- `req` (*request*) contient tout ce que le client a envoyé ;
- `res` (*response*) sert à répondre.

## Trois façons de recevoir des données

| Source | Exemple d'URL ou de requête | Lecture |
|---|---|---|
| **Paramètre de chemin** | `/produits/42` sur la route `/produits/:id` | `req.params.id` → `"42"` |
| **Query** | `/produits?page=2&tri=prix` | `req.query.page` → `"2"` |
| **Corps** (JSON) | `POST /produits` avec `{ "nom": "Souris" }` | `req.body.nom` → `"Souris"` |

> **Attention** : les paramètres et la query arrivent **toujours sous forme de texte**.
> `req.params.id` vaut `"42"`, pas `42`. Pour comparer avec un identifiant numérique, convertis
> avec `Number(req.params.id)`.

```js run
const produits = [{ id: 42, nom: "Clavier" }];
const params = { id: "42" }; // ce que donnerait req.params

console.log(produits.find((p) => p.id === params.id));          // undefined !
console.log(produits.find((p) => p.id === Number(params.id)));  // trouvé
```

## Répondre

```js
res.json({ id: 42 });              // 200 par défaut, corps JSON
res.status(201).json(nouveau);     // création
res.status(404).json({ error: "Produit introuvable" });
res.status(204).send();            // succès, sans corps (après une suppression)
```

`res.status(...)` choisit le code ; il se **chaîne** avec `.json(...)`.

## Un CRUD complet

```js
app.get("/produits/:id", (req, res) => {
  const produit = produits.find((p) => p.id === Number(req.params.id));
  if (!produit) {
    return res.status(404).json({ error: "Produit introuvable" });
  }
  res.json(produit);
});

app.post("/produits", (req, res) => {
  const produit = { id: prochainId++, ...req.body };
  produits.push(produit);
  res.status(201).json(produit);
});
```

> **À retenir** : le `return` devant `res.status(404)…` est important. Sans lui, le code
> continue et tente de répondre une **deuxième** fois, ce qui provoque l'erreur
> `Cannot set headers after they are sent`.

## Une seule réponse par requête

Chaque requête reçoit **exactement une** réponse :

- **zéro** réponse : le client attend… jusqu'à l'expiration du délai (*timeout*) ;
- **deux** réponses : erreur côté serveur.

C'est l'une des premières choses à vérifier quand une requête « reste pendue ».

## Ce que tu sais faire maintenant

- Déclarer des routes `GET`, `POST`, `PUT` et `DELETE`.
- Lire `req.params`, `req.query` et `req.body`, en sachant que les deux premiers sont des textes.
- Répondre avec `res.status(...).json(...)` et le bon code.
- Garantir une, et une seule, réponse par requête.
