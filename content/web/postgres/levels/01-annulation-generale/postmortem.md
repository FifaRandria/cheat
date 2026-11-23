## Cause racine

La requête n'avait **pas de `WHERE`** :

```sql
UPDATE commandes SET statut = 'annulee'
```

Un `UPDATE` s'applique à toutes les lignes qui vérifient son `WHERE`. Sans `WHERE`, il
s'applique à **toute la table**. Aucune erreur, aucune confirmation : la base a fait
exactement ce qu'on lui demandait.

Le paramètre `id` était bien reçu par la fonction… mais jamais utilisé.

## Correctif

```js
db.prepare("UPDATE commandes SET statut = 'annulee' WHERE id = ?").run(id);
```

## Le réflexe à garder

- Relis tout `UPDATE` et tout `DELETE` en cherchant d'abord le `WHERE`.
- Vérifie `changes` : un nombre de lignes modifiées inattendu (4 au lieu de 1) est une alarme.
- Un paramètre de fonction inutilisé est souvent le signe d'un bug.
- En production : sauvegardes régulières, et droits restreints pour les comptes applicatifs.
