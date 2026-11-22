---
id: js-async-02
title: Promesses et async/await
minutes: 14
summary: Une promesse est un ticket de retrait. await attend le résultat ; sans lui, tu tiens le ticket, pas le plat.
check:
  - prompt: "Que contient `user` ?\n\n```js\nasync function charger() {\n  const user = trouverUtilisateur(1); // fonction async\n  console.log(user);\n}\n```"
    choices:
      - L'utilisateur
      - "Une promesse : Promise { <pending> }"
      - undefined
    answer: 1
    explain: "Sans `await`, on récupère la promesse elle-même (le ticket), pas sa valeur."
  - prompt: "Où peut-on utiliser `await` ?"
    choices:
      - N'importe où
      - "Dans une fonction déclarée `async` (ou au niveau principal d'un module)"
      - Seulement dans une boucle
    answer: 1
  - prompt: Comment intercepter l'erreur d'une promesse qui échoue avec await ?
    choices:
      - "Avec un bloc try { … } catch (erreur) { … }"
      - Avec un if
      - On ne peut pas
    answer: 0
---

## Une promesse, c'est un ticket de retrait

Au comptoir d'un fast-food, on te donne un **ticket** avec un numéro. Ce ticket n'est pas ton
repas : c'est la **promesse** que tu l'auras. Plus tard, le ticket est :

- **tenu** (*fulfilled*) : ton repas est prêt ;
- ou **rompu** (*rejected*) : il n'y a plus de frites.

En JavaScript, une opération asynchrone renvoie un objet `Promise`, ce ticket. Au début, il
est « en attente » (*pending*).

## Une fonction `async` renvoie toujours une promesse

```js run
async function trouverUtilisateur(id) {
  // on simule une base de données lente
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { id, nom: "Ada" };
}

const resultat = trouverUtilisateur(1);
console.log(resultat); // un ticket, pas l'utilisateur !
```

Le mot-clé `async` devant `function` signifie : « cette fonction renvoie une promesse ».
Même si elle fait `return { nom: "Ada" }`, l'appelant reçoit un **ticket** vers cet objet.

## `await` : attendre le résultat

Pour obtenir la valeur, on **attend** le ticket avec `await` :

```js run
async function trouverUtilisateur(id) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { id, nom: "Ada" };
}

async function afficherProfil() {
  const user = await trouverUtilisateur(1);
  console.log("Bonjour", user.nom);
}

afficherProfil();
```

`await` met la fonction **en pause** jusqu'à ce que la promesse soit tenue, puis donne sa valeur.

> **À retenir** : `await` ne s'utilise que dans une fonction `async`. Et une fonction `async`
> renvoie toujours une promesse, donc celui qui l'appelle doit lui aussi l'attendre.

## Le bug classique : le `await` oublié

```js run
async function trouverUtilisateur(id) {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return { id, nom: "Ada" };
}

async function afficherProfil() {
  const user = trouverUtilisateur(1); // pas de await !
  console.log(user);
  console.log(user.nom);              // undefined : un ticket n'a pas de nom
}

afficherProfil();
```

Symptômes typiques d'un `await` oublié :

- `console.log` affiche `Promise { <pending> }` ;
- les propriétés valent `undefined` ;
- `if (!user)` ne détecte jamais l'absence d'utilisateur, car une promesse est toujours un objet.

## Quand la promesse échoue : `try` / `catch`

Une promesse peut être **rejetée** (erreur réseau, utilisateur introuvable…). Avec `await`, on
intercepte l'erreur avec `try { … } catch { … }` :

```js run
async function payer(montant) {
  await new Promise((resolve) => setTimeout(resolve, 100));
  if (montant > 100) {
    throw new Error("Plafond dépassé");
  }
  return "paiement accepté";
}

async function main() {
  try {
    console.log(await payer(50));
    console.log(await payer(500));
    console.log("jamais affiché");
  } catch (erreur) {
    console.log("Échec :", erreur.message);
  }
}

main();
```

`throw new Error(...)` **lève** une erreur. Dans une fonction `async`, cela **rejette** la
promesse. Le `catch` la récupère.

## Ce que tu sais faire maintenant

- Expliquer qu'une promesse est un ticket vers une valeur future.
- Savoir qu'une fonction `async` renvoie toujours une promesse.
- Obtenir la valeur avec `await`, et reconnaître les symptômes d'un `await` oublié.
- Gérer une promesse rejetée avec `try` / `catch`.
