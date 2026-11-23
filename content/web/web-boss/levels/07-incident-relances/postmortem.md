## Cause racine

Quatre défauts dans une fonction de quinze lignes :

| Symptôme | Cause |
|---|---|
| Ada relancée pour un outil rendu | aucun filtre `rendu_le IS NULL` |
| Eve relancée avec « 0 jours de retard » | `fin_prevue <= ?` au lieu de `<` : une borne |
| Bob, le plus en retard, relancé en dernier | tri croissant au lieu de décroissant |
| 3 401 requêtes, 2,8 secondes | deux requêtes par prêt pour lire les noms : N+1 |

## Correctif

```sql
SELECT m.nom AS membre, o.nom AS outil, p.fin_prevue AS finPrevue
FROM prets p
JOIN membres m ON m.id = p.membre_id
JOIN outils o ON o.id = p.outil_id
WHERE p.rendu_le IS NULL AND p.fin_prevue < ?
```

Puis un tri `b.joursDeRetard - a.joursDeRetard`, et l'ordre alphabétique à égalité.

## Le réflexe à garder

- Chaque ligne de log est un indice : ici, chacune pointait vers un défaut différent.
- Les tests de l'étape 5 ne couvraient pas les relances : écrire un test pour chaque bug de
  production, c'est s'assurer qu'il ne revient pas.
- Bornes, filtres oubliés, tri inversé, N+1 : tu as déjà réparé chacun de ces bugs dans les
  modules précédents. En production, ils arrivent rarement seuls.
