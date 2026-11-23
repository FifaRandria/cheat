## Cause racine

Le traitement n'était pas **idempotent** : chaque webhook reçu créait une facture, sans vérifier
si cet événement avait déjà été traité. Or le prestataire **réémet** un webhook quand il ne
reçoit pas de réponse à temps. Aux heures de pointe, les réponses lentes déclenchaient des
réémissions, et donc des doubles factures.

## Correctif

Retenir l'identifiant de chaque événement traité, et ignorer ceux déjà vus :

```python
if e["id"] in deja_traites:
    continue
deja_traites.add(e["id"])
```

Dédoublonner sur `(client, montant)` aurait été une fausse bonne idée : deux achats légitimes du
même montant auraient été fusionnés. Seul l'identifiant de l'**événement** distingue une
réémission d'un nouvel achat.

## Le réflexe à garder

- Tout webhook peut arriver **plusieurs fois** : les traitements doivent être idempotents.
- En production, les identifiants traités se gardent dans une **base de données**, pas en
  mémoire.
- Répondre vite au webhook (« reçu »), puis traiter, réduit aussi les réémissions.
