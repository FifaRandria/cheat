## Ce qu'il fallait écrire

La pièce maîtresse est `listerOutils`, qui calcule la disponibilité **en une seule requête** :

```sql
SELECT o.id, o.nom, o.categorie,
       NOT EXISTS (SELECT 1 FROM prets p
                   WHERE p.outil_id = o.id AND p.rendu_le IS NULL) AS disponible
FROM outils o
WHERE ? IS NULL OR o.categorie = ?
ORDER BY o.id
```

Une boucle qui interroge les prêts de chaque outil aurait fait 6 requêtes pour 5 outils, et
2 001 pour 2 000 outils : le problème N+1.

## Les règles métier

`emprunter` et `rendre` vérifient les règles **avant** d'écrire, et lèvent une `ErreurMetier`
avec un code. Le dépôt ne connaît pas HTTP : c'est l'API, à l'étape suivante, qui transformera
`DEJA_PRETE` en 409.

## Le réflexe à garder

- Déduire une information (la disponibilité) plutôt que la stocker en double.
- Toujours des requêtes préparées avec `?`.
- Compter ses requêtes : une liste doit coûter une requête, pas une par ligne.
- En production, `emprunter` serait dans une **transaction** : deux membres qui empruntent le
  même outil à la même milliseconde ne doivent pas réussir tous les deux.
