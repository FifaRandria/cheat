---
id: securite-04
title: Mots de passe, secrets et cookies
minutes: 15
summary: Stocker un mot de passe correctement, garder les secrets hors du code, et configurer les cookies de session.
check:
  - prompt: Pourquoi un sel aléatoire par utilisateur ?
    choices:
      - Pour que deux mots de passe identiques donnent deux empreintes différentes, ce qui empêche les tables précalculées
      - Pour pouvoir retrouver le mot de passe
      - Pour accélérer la vérification
    answer: 0
  - prompt: Pourquoi utiliser scrypt (ou bcrypt, argon2) plutôt que sha256 pour les mots de passe ?
    choices:
      - "sha256 est trop rapide : un attaquant en teste des milliards par seconde. scrypt est volontairement lent et gourmand en mémoire"
      - sha256 n'existe pas en Node
    answer: 0
  - prompt: "Que fait l'option `sameSite: \"lax\"` d'un cookie ?"
    choices:
      - Elle chiffre le cookie
      - "Elle empêche l'envoi du cookie lors des requêtes POST venant d'un autre site, ce qui bloque l'essentiel des attaques CSRF"
    answer: 1
---

## On ne stocke jamais un mot de passe

Ni en clair, ni « chiffré » (ce qui se déchiffre peut fuiter). On stocke une **empreinte** :
le résultat d'une fonction à sens unique. Pour vérifier, on recalcule l'empreinte du mot de
passe saisi et on compare.

| Méthode | Verdict |
|---|---|
| en clair | une fuite de la base = tous les comptes compromis |
| `md5`, `sha256` | trop rapides : des milliards d'essais par seconde sur une carte graphique |
| `sha256` sans sel | deux mots de passe identiques ont la même empreinte : visible dans la base |
| **scrypt, bcrypt, argon2** + sel | lents **exprès**, avec un sel unique : la bonne réponse |

## scrypt en Node, sans dépendance

```js
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

function hacher(motdepasse) {
  const sel = randomBytes(16).toString("hex");
  const empreinte = scryptSync(motdepasse, sel, 64).toString("hex");
  return `${sel}:${empreinte}`;          // on stocke le sel AVEC l'empreinte
}

function verifier(motdepasse, stocke) {
  const [sel, empreinte] = stocke.split(":");
  const attendu = Buffer.from(empreinte, "hex");
  const calcule = scryptSync(motdepasse, sel, 64);
  return calcule.length === attendu.length && timingSafeEqual(calcule, attendu);
}

const stocke = hacher("correct cheval pile agrafe");
console.log(stocke.slice(0, 50) + "…");
console.log(verifier("correct cheval pile agrafe", stocke));
console.log(verifier("Correct cheval pile agrafe", stocke));
```

Cet exemple utilise `node:crypto`, qui n'existe pas dans le navigateur : il n'est donc pas
exécutable dans la page, mais il fonctionne tel quel dans Node, et dans les niveaux.

- Le **sel** n'est pas secret : il rend chaque empreinte unique.
- `timingSafeEqual` compare en temps constant : un `===` s'arrête au premier caractère
  différent, et ce temps de réponse peut renseigner un attaquant.

## Les secrets restent hors du code

Clé d'API, mot de passe de base, secret de signature des jetons : **jamais** dans le code ni
dans Git. Un dépôt se partage, se clone, devient parfois public, et l'historique garde tout.

```js
const secret = process.env.JWT_SECRET;
if (!secret && process.env.NODE_ENV === "production") {
  throw new Error("JWT_SECRET manquant : refus de démarrer");
}
```

> **Attention** : `process.env.JWT_SECRET ?? "dev"` est pratique en développement, et
> catastrophique en production : si la variable manque, tout le monde peut signer de faux
> jetons avec « dev ». Une application doit **refuser de démarrer** sans ses secrets.

## Les cookies de session

| Option | Effet |
|---|---|
| `httpOnly: true` | invisible pour JavaScript : une XSS ne peut pas le lire |
| `secure: true` | envoyé uniquement en HTTPS |
| `sameSite: "lax"` | pas envoyé par les POST venant d'autres sites : bloque le **CSRF** |
| `maxAge` | la durée de vie : une session ne doit pas durer éternellement |

Le **CSRF** (*Cross-Site Request Forgery*) : un site piégé envoie un formulaire vers ta banque,
et ton navigateur y joint automatiquement ton cookie de session. `sameSite` l'empêche.

## CORS : qui peut appeler ton API depuis un navigateur

Par défaut, une page de `pirate.example` ne peut pas lire les réponses de ton API. L'en-tête
`Access-Control-Allow-Origin` assouplit cette règle pour des sites précis. Deux erreurs
classiques :

- `Access-Control-Allow-Origin: *` avec des cookies : interdit par les navigateurs, et
  dangereux dans l'intention ;
- vérifier l'origine avec `includes("monsite.fr")` : `https://monsite.fr.pirate.example` passe.
  On compare l'origine **exacte** à une liste.

## Ce que tu sais faire maintenant

- Stocker un mot de passe avec scrypt et un sel, et le vérifier en temps constant.
- Garder les secrets hors du code, et refuser de démarrer sans eux.
- Configurer un cookie de session : `httpOnly`, `secure`, `sameSite`.
- Écrire une liste d'origines CORS exactes.
