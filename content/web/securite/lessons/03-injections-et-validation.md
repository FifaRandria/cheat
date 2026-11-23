---
id: securite-03
title: Injections et validation des entrées
minutes: 12
summary: Pourquoi on ne colle jamais une donnée dans du code, et comment valider ce qui entre dans l'application.
check:
  - prompt: "Que devient `SELECT * FROM membres WHERE jeton = '${jeton}'` si jeton vaut `' OR '1'='1` ?"
    choices:
      - "Une requête qui cherche un jeton bizarre"
      - "SELECT * FROM membres WHERE jeton = '' OR '1'='1' : la condition est toujours vraie"
    answer: 1
  - prompt: Où valider les données reçues par une API ?
    choices:
      - Seulement dans le formulaire du navigateur
      - "Sur le serveur, à l'entrée de chaque route, même si le navigateur valide déjà"
    answer: 1
---

## Le principe de toute injection

Une injection se produit quand une **donnée** est collée dans du **code** : SQL, commande
shell, HTML (c'est la XSS). La donnée peut alors changer le sens du code.

```js
db.prepare(`SELECT id, nom FROM membres WHERE jeton = '${jeton}'`).get();
```

Avec `jeton = "' OR '1'='1"`, la requête devient :

```sql
SELECT id, nom FROM membres WHERE jeton = '' OR '1'='1'
```

La condition est toujours vraie : l'attaquant est connecté en tant que premier membre, souvent
l'administrateur.

## La correction : séparer le code et les données

```js
db.prepare("SELECT id, nom FROM membres WHERE jeton = ?").get(jeton);
```

Avec une **requête préparée**, la base reçoit le code SQL et la donnée **séparément**. Quoi
que contienne `jeton`, il reste une valeur à comparer. Tous les langages et toutes les
bibliothèques sérieuses l'offrent (`?`, `$1`, `:nom`).

> **Attention** : échapper « à la main » les apostrophes est une fausse bonne idée. Il y a
> toujours un cas oublié. La requête préparée n'oublie rien.

## Valider ce qui entre

Le navigateur peut valider un formulaire pour le confort de l'utilisateur, mais un attaquant
appelle l'API directement. La validation **côté serveur** est la seule qui compte :

```js
function validerInscription(corps) {
  const erreurs = [];
  if (typeof corps?.email !== "string" || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(corps.email)) {
    erreurs.push("email invalide");
  }
  if (typeof corps?.motdepasse !== "string" || corps.motdepasse.length < 12) {
    erreurs.push("mot de passe : 12 caractères minimum");
  }
  return erreurs;
}
```

- **Liste blanche** : décrire ce qui est **autorisé** (un entier positif, un e-mail, une valeur
  parmi `["carte", "virement"]`), plutôt que chercher ce qui est dangereux.
- **Limiter les tailles** : un champ « nom » de 5 Mo n'est pas un nom.
- Des bibliothèques comme **zod** décrivent ces règles en quelques lignes.

## Ce que tu sais faire maintenant

- Reconnaître une injection : une donnée collée dans du code.
- Utiliser des requêtes préparées en toutes circonstances.
- Valider les entrées côté serveur, en liste blanche.
