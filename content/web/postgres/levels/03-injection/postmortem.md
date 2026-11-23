## Cause racine

La saisie de l'utilisateur était **collée** dans le texte de la requête. Avec la saisie
`' OR '1'='1`, la requête devenait :

```sql
SELECT id, nom, ville FROM clients WHERE nom = '' OR '1'='1' ORDER BY id
```

La condition `'1'='1'` est toujours vraie : tous les clients sortaient. Et avec `O'Brien`,
l'apostrophe cassait la syntaxe, d'où l'erreur 500. Les deux symptômes avaient la même cause.

C'est une **injection SQL** : l'utilisateur ne fournit plus une valeur, il réécrit la requête.

## Correctif

Une requête préparée, avec un paramètre :

```js
db.prepare("SELECT id, nom, ville FROM clients WHERE nom = ? ORDER BY id").all(nom);
```

La base reçoit la requête et la valeur **séparément**. Quoi que contienne `nom`, c'est une
simple chaîne de caractères à comparer, jamais du SQL.

## Le réflexe à garder

- Toute valeur qui vient de l'extérieur passe par un paramètre `?`. Aucune exception.
- « Échapper les apostrophes à la main » n'est pas une solution : il existe toujours un cas
  oublié.
- Un nom propre comme `O'Brien` qui fait planter une recherche doit immédiatement faire penser
  à une injection possible.
