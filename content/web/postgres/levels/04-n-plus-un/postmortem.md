## Cause racine

Une requête **dans une boucle** : 1 requête pour la liste des commandes, puis 1 par commande
pour retrouver le client. Pour 100 commandes, **101** allers-retours vers la base.

Chacune ne prenait qu'une milliseconde en local. Mais en production, avec la latence du
réseau entre le serveur et la base, chaque aller-retour coûte bien plus : la page dépassait
les 8 secondes. C'est le **problème N+1**, l'un des plus fréquents dans les applications web.

## Correctif

Une seule requête, avec une jointure :

```sql
SELECT commandes.id AS id, commandes.total AS total, clients.nom AS client
FROM commandes
JOIN clients ON clients.id = commandes.client_id
ORDER BY commandes.id
```

## Le réflexe à garder

- Une requête dans une boucle (`for`, `map`, `forEach`) doit t'alerter immédiatement.
- Mesure le **nombre** de requêtes par page, pas seulement leur durée : beaucoup de requêtes
  rapides font une page lente.
- Avec un ORM : charger la relation avec la requête (`include` dans Prisma) plutôt que dans
  une boucle.
