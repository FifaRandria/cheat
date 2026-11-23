## Cause racine

Trois variantes d'un même oubli : faire confiance au client.

1. **IDOR** : la route vérifiait que la facture existait, pas qu'elle appartenait à
   l'utilisateur connecté.
2. **Affectation de masse** : `Object.assign(utilisateur, req.body)` copiait tous les champs
   envoyés, y compris `role` et `jeton`.
3. **Rôle lu dans un en-tête** : `X-Role` est écrit par le client, il peut y mettre ce qu'il
   veut.

## Correctif

```js
if (!facture || facture.clientId !== req.utilisateur.id) return res.status(404)…;

const { nom, email } = req.body ?? {};      // liste blanche des champs modifiables

if (req.utilisateur.role !== "admin") return res.status(403)…;  // rôle côté serveur
```

## Le réflexe à garder

- Tester chaque route avec **deux comptes** et un compte sans droits.
- Ne jamais copier un corps de requête tel quel dans un objet stocké.
- Les droits se lisent dans les données du serveur, jamais dans ce qu'envoie le client.
