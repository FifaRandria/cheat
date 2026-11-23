## Cause racine

La route faisait confiance aux données reçues :

1. **e-mail absent** : `undefined.includes("@")` lève une `TypeError`, d'où un **500**. Le
   serveur « plante » alors que c'est le client qui s'est trompé ;
2. **mot de passe** : sa longueur n'était jamais vérifiée ;
3. **fuite** : la réponse renvoyait le mot de passe en clair.

Le formulaire du site validait tout côté navigateur, ce qui masquait le problème. Mais l'API
était appelée directement par un partenaire : la validation du navigateur ne protège rien.

## Correctif

Une fonction de validation qui ne plante jamais (`typeof`, `?.`), qui accumule **toutes** les
erreurs, et un 400 **avant** toute action :

```js
const details = valider(req.body);
if (details.length > 0) {
  return res.status(400).json({ error: "Données invalides", details });
}
```

## Le réflexe à garder

- Toute donnée venant du client peut être absente, vide ou du mauvais type.
- Une erreur de **saisie** est un 400, jamais un 500.
- Ne renvoie jamais un mot de passe, même haché. Dans une vraie application, il serait aussi
  **haché** (avec bcrypt ou argon2) avant d'être enregistré.
- En production, on utilise une bibliothèque de validation comme **zod**, mais le principe
  reste le même.
