## Cause racine

Deux erreurs, la seconde cachée derrière la première :

1. **`JOIN` (INNER JOIN)** ne garde que les clients qui ont **au moins une** commande. Linus,
   précisément celui qu'on cherchait, était éliminé avant même le comptage.
2. Une fois passé en `LEFT JOIN`, **`COUNT(*)`** aurait compté **1** pour Linus : la ligne
   existe, remplie de `NULL` côté commandes. Il faut compter `COUNT(commandes.id)`, qui
   ignore les `NULL`.

## Correctif

```sql
SELECT clients.nom AS nom, COUNT(commandes.id) AS nb
FROM clients
LEFT JOIN commandes ON commandes.client_id = clients.id
GROUP BY clients.id
ORDER BY clients.id
```

## Le réflexe à garder

- Avant d'écrire une jointure, demande-toi : « les lignes **sans** correspondance doivent-elles
  apparaître ? ». Si oui : `LEFT JOIN`.
- Après un `LEFT JOIN`, compte une colonne de la table de droite, pas `*`.
- Vérifie toujours le **nombre de lignes** d'un rapport : 3 lignes pour 4 clients était un
  signal évident.
