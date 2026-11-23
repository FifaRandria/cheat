---
id: web-boss-02
title: "Organiser le code : routes, règles métier, données"
minutes: 12
summary: Séparer le code en couches, transformer les erreurs métier en codes HTTP, et rendre l'application testable.
check:
  - prompt: Où doit se trouver la règle « un outil déjà prêté ne peut pas être emprunté » ?
    choices:
      - Dans la route Express, juste avant de répondre
      - Dans la couche métier (le dépôt), pour qu'elle s'applique quel que soit l'appelant
      - Dans le frontend
    answer: 1
  - prompt: Pourquoi passer la base de données et la date du jour en paramètres de creerApp(db, aujourdhui) ?
    choices:
      - Pour que les tests puissent utiliser une base neuve et une date fixe
      - Pour aller plus vite
      - C'est obligatoire en JavaScript
    answer: 0
---

## Trois couches, trois responsabilités

Mettre tout le code dans les routes marche… jusqu'à 300 lignes. Ensuite, chaque modification
casse autre chose. On sépare donc le code en **couches** :

| Couche | Fichier | Elle s'occupe de | Elle ignore |
|---|---|---|---|
| **HTTP** | `app.js` | lire la requête, vérifier les droits, choisir le code HTTP | le SQL |
| **Métier et données** | `depot.js` | appliquer les règles, exécuter le SQL | HTTP, les codes 404 ou 409 |
| **Infrastructure** | `boite.js`, `mini-express.js` | la base, le framework | les règles de l'association |

Avantage : la règle « pas de double prêt » est écrite **une seule fois**, dans le dépôt. Une
future application mobile ou un script d'import la respectera aussi.

## Les erreurs métier

Le dépôt ne connaît pas HTTP. Quand une règle est violée, il lève une erreur avec un **code** :

```js
export class ErreurMetier extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

throw new ErreurMetier("DEJA_PRETE", "L'outil 3 est déjà prêté");
```

C'est le gestionnaire d'erreurs de l'API qui traduit, en **un seul endroit** :

```js
const STATUTS = { OUTIL_INCONNU: 404, PRET_INCONNU: 404, DEJA_PRETE: 409, DEJA_RENDU: 409 };

app.use((err, req, res, next) => {
  if (err instanceof ErreurMetier) {
    return res.status(STATUTS[err.code] ?? 400).json({ erreur: err.message, code: err.code });
  }
  console.error(err);                               // le détail va dans les logs…
  res.status(500).json({ erreur: "Erreur interne" }); // …jamais chez le client
});
```

> **Attention** : n'oublie pas les **quatre** paramètres. Avec trois, Express le prend pour un
> middleware ordinaire, et tes erreurs tombent dans la page d'erreur par défaut.

## Rendre l'application testable

```js
export function creerApp(db, aujourdhui = () => new Date().toISOString().slice(0, 10)) {
  …
}
```

L'application **reçoit** sa base et son horloge, au lieu de les créer elle-même. En
production, on lui passe la vraie base et la vraie date. Dans les tests, une base neuve à
chaque test et une date fixe : les tests deviennent **reproductibles**. Un test qui dépend de
la date du jour finit toujours par échouer un matin, sans raison apparente.

On appelle cela l'**injection de dépendances** : un nom savant pour « passer en paramètre ce
dont on a besoin ».

## Les requêtes préparées, toujours

```js
db.prepare("SELECT id, nom FROM membres WHERE jeton = ?").get(jeton);   // sûr
db.prepare(`SELECT id, nom FROM membres WHERE jeton = '${jeton}'`).get(); // injection SQL
```

Le `?` garantit que la valeur reste une **valeur**, jamais du code SQL.

## Ce que tu sais faire maintenant

- Répartir le code entre la couche HTTP et la couche métier et données.
- Lever des erreurs métier et les traduire en codes HTTP en un seul endroit.
- Rendre une application testable en lui passant sa base et son horloge.
