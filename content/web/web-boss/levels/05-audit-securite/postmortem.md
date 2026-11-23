## Cause racine

Quatre failles, deux familles :

1. **Injection SQL** : le jeton était collé dans la requête. `' OR '1'='1` transformait la
   condition en « toujours vrai », et la base renvoyait le premier membre.
2. **Contrôle d'accès manquant** (IDOR, *Insecure Direct Object Reference*) : les routes
   vérifiaient que l'utilisateur était **connecté**, jamais que la ressource était **à lui**.
   Changer un numéro dans l'URL suffisait.
3. **Fuite d'informations** : la pile d'appels et le message SQL révélaient la structure du
   code et de la base, précieuse pour un attaquant.

## Correctif

```js
// depot.js : une requête préparée
db.prepare("SELECT id, nom FROM membres WHERE jeton = ?").get(jeton);

// app.js : la ressource appartient-elle au membre connecté ?
if (pret && pret.membreId !== req.membre.id) return res.status(403).json({ … });

// gestionnaire d'erreurs : le détail dans les logs, rien chez le client
console.error(err);
res.status(500).json({ erreur: "Erreur interne" });
```

## Le réflexe à garder

- **Authentification** (qui es-tu ?) et **autorisation** (as-tu le droit ?) sont deux contrôles
  distincts. Chaque route qui touche une ressource privée fait les deux.
- Tester les droits avec **deux comptes** : tout ce que A peut faire sur les données de B est
  une faille.
- Ces failles figurent chaque année en tête du classement OWASP Top 10.
