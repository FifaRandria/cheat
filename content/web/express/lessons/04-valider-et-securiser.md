---
id: express-04
title: Valider, sécuriser, gérer les erreurs
minutes: 15
summary: Ne jamais faire confiance aux données reçues, répondre 400 plutôt que 500, et ne jamais montrer la pile d'appels au client.
check:
  - prompt: "Un client envoie `POST /inscriptions` sans e-mail. Le serveur plante avec une TypeError. Quel code aurait-il fallu renvoyer ?"
    choices: ["500", "400, avec un message qui explique ce qui manque", "200"]
    answer: 1
  - prompt: Pourquoi ne jamais renvoyer la pile d'appels (stack trace) au client ?
    choices:
      - Parce qu'elle est trop longue
      - Parce qu'elle révèle des détails internes (chemins, bibliothèques, code) utiles à un attaquant
      - Ce n'est pas un problème
    answer: 1
  - prompt: Où vérifier les droits d'un utilisateur ?
    choices:
      - Uniquement dans le frontend, en cachant les boutons
      - Côté serveur, à chaque requête
    answer: 1
    explain: Le frontend peut être contourné en une ligne de commande. Seul le serveur fait foi.
---

## Ne jamais faire confiance au client

Tout ce qui arrive dans `req.body`, `req.params` ou `req.query` peut être **absent, vide, du
mauvais type ou malveillant**. Un formulaire bien fait côté navigateur ne protège rien : on
peut appeler une API directement, avec n'importe quelles données.

> **À retenir** : la validation côté navigateur sert le confort de l'utilisateur. La
> validation côté serveur sert la **sécurité**. Seule la seconde est obligatoire.

## Valider avant de travailler

```js run
function validerInscription(body) {
  const erreurs = [];
  if (typeof body?.email !== "string" || !body.email.includes("@")) {
    erreurs.push("email invalide");
  }
  if (typeof body?.motDePasse !== "string" || body.motDePasse.length < 8) {
    erreurs.push("mot de passe : 8 caractères minimum");
  }
  return erreurs;
}

console.log(validerInscription({ email: "ada@ex.com", motDePasse: "secret123" }));
console.log(validerInscription({ email: "ada" }));
console.log(validerInscription(undefined));
```

Dans la route, on répond **400** avec la liste des erreurs, avant tout traitement :

```js
app.post("/inscriptions", (req, res) => {
  const erreurs = validerInscription(req.body);
  if (erreurs.length > 0) {
    return res.status(400).json({ error: "Données invalides", details: erreurs });
  }
  // … créer le compte
});
```

Remarque `body?.email` : l'opérateur `?.` évite la `TypeError` quand `body` est absent.
Sans validation, une donnée manquante fait planter le serveur (500), alors que c'est le
**client** qui s'est trompé (400).

## Authentifier : les jetons JWT

Après la connexion, le serveur remet au client un **jeton** (souvent un **JWT**, *JSON Web
Token*) signé avec une clé secrète. Le client le renvoie à chaque requête, dans l'en-tête
`Authorization`. Le serveur vérifie la **signature** : si quelqu'un modifie le jeton, la
signature ne correspond plus.

- jeton absent ou invalide → **401** ;
- jeton valide, mais droits insuffisants → **403**.

> **Attention** : le contenu d'un JWT est **lisible** par n'importe qui (il est seulement
> encodé, pas chiffré). N'y mets jamais de mot de passe ni de donnée sensible.

## Gérer les erreurs proprement

Une erreur inattendue doit :

1. être **journalisée** côté serveur, avec tous les détails, pour les développeurs ;
2. renvoyer au client un message **générique**, sans détail interne.

```js
app.use((err, req, res, next) => {
  console.error(err); // détails complets dans les logs
  const status = err.status ?? 500;
  res.status(status).json({
    error: status === 500 ? "Erreur interne" : err.message,
  });
});
```

On peut créer des erreurs « attendues » qui portent leur code :

```js
const erreur = new Error("Produit introuvable");
erreur.status = 404;
throw erreur;
```

> **Attention** : sans gestionnaire d'erreurs correct, Express renvoie la **pile d'appels**
> au client. Elle révèle les chemins des fichiers, les bibliothèques utilisées et parfois des
> extraits de code : une mine d'or pour un attaquant.

## Ce que tu sais faire maintenant

- Valider les données reçues côté serveur, et répondre 400 avec des détails utiles.
- Expliquer le principe d'un jeton JWT, et la différence entre 401 et 403.
- Écrire un gestionnaire d'erreurs qui journalise tout et ne révèle rien.
