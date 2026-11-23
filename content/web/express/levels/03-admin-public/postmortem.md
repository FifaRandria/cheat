## Cause racine

Express parcourt les middlewares et les routes **dans l'ordre de déclaration**. La route
`/admin/stats` était déclarée **avant** `app.use("/admin", exigerAdmin)` : elle était trouvée
en premier et répondait directement. Le contrôle d'accès, placé après, ne s'exécutait jamais
pour elle.

Le code du middleware était correct. C'est sa **position** qui créait la faille.

## Correctif

```js
app.get("/catalogue", …);          // public
app.use("/admin", exigerAdmin);    // le contrôle d'abord
app.get("/admin/stats", …);        // puis les routes protégées
```

## Le réflexe à garder

- En Express, l'ordre des déclarations **est** la logique de sécurité.
- Pour chaque route sensible, teste l'accès **sans** jeton et avec un **mauvais** jeton, pas
  seulement le cas où tout va bien.
- 401 : « je ne sais pas qui tu es » ; 403 : « je sais qui tu es, et c'est non ».
