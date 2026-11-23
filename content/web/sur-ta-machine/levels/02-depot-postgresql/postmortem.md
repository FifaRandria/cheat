## Cause racine

Un portage « à l'identique » qui transportait les habitudes de SQLite :

1. des paramètres `?`, que PostgreSQL ne comprend pas (`$1`, `$2`…) ;
2. un `await` oublié : `resultat` était une promesse, sans `.rows` ;
3. le résultat renvoyé tel quel au lieu de `rows[0]` ;
4. un id collé dans le texte de la requête : une injection SQL ;
5. `RETURNING id` absent, et l'outil et le membre inversés dans l'`INSERT`.

## Correctif

```js
const { rows } = await pool.query("SELECT id, nom, categorie FROM outils WHERE id = $1", [id]);
return rows[0] ?? null;
```

Avec PostgreSQL, un même paramètre peut servir deux fois : `$1::text IS NULL OR categorie = $1`.
Le `::text` précise son type, que PostgreSQL ne peut pas deviner quand la valeur est `null`.

## Le réflexe à garder

- Changer de base, c'est changer de **dialecte** : paramètres, types, fonctions de date.
- Un pilote de base de données moderne est asynchrone : `await` partout.
- Lire la forme exacte du résultat dans la documentation du pilote (`rows`, `rowCount`).
