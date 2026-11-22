---
id: js-bases-05
title: Les fonctions
minutes: 12
summary: Donner un nom à un bloc de code, lui passer des valeurs, et surtout ne pas oublier de renvoyer le résultat.
check:
  - prompt: "Que renvoie une fonction qui ne contient aucun `return` ?"
    choices: ["0", "undefined", "Une erreur"]
    answer: 1
    explain: "Sans `return`, la fonction calcule peut-être des choses, mais elle ne rend rien : `undefined`."
  - prompt: "Dans `function saluer(prenom) { ... }`, que représente `prenom` ?"
    choices:
      - Une valeur fixe
      - Un paramètre, rempli au moment de l'appel
      - Le nom de la fonction
    answer: 1
  - prompt: "Quelle est la différence entre `console.log(x)` et `return x` ?"
    choices:
      - Aucune
      - "console.log affiche pour un humain ; return rend la valeur au code qui a appelé la fonction"
      - return affiche en plus gros
    answer: 1
---

## Une machine avec une entrée et une sortie

Une **fonction** est un bloc de code auquel on donne un **nom**, pour pouvoir le réutiliser.
Imagine une machine à jus :

- tu mets des fruits dedans (l'**entrée**, les *paramètres*) ;
- elle travaille (le **corps** de la fonction) ;
- elle te **rend** un verre de jus (la **sortie**, avec `return`).

```js run
function doubler(nombre) {
  return nombre * 2;
}

console.log(doubler(4));
console.log(doubler(21));
```

- `function doubler(nombre)` **déclare** la fonction : son nom est `doubler`, elle attend une valeur appelée `nombre`.
- `return nombre * 2` **renvoie** le résultat.
- `doubler(4)` **appelle** la fonction : `nombre` vaut 4 pendant cet appel.

## Plusieurs paramètres

```js run
function prixTotal(prixUnitaire, quantite) {
  return prixUnitaire * quantite;
}

const total = prixTotal(12.5, 3);
console.log("Total :", total);
```

Les valeurs sont associées **dans l'ordre** : `12.5` va dans `prixUnitaire`, `3` dans `quantite`.

## `return` : la fonction rend la main

Le `return` fait deux choses :

1. il **renvoie** une valeur au code qui a appelé la fonction ;
2. il **arrête** la fonction immédiatement.

```js run
function categorie(age) {
  if (age < 18) {
    return "mineur";
  }
  return "majeur"; // jamais atteint si age < 18
}

console.log(categorie(12));
console.log(categorie(30));
```

## Le piège : oublier le `return`

Une fonction qui calcule sans `return` ne rend **rien**, c'est-à-dire `undefined` :

```js run
function prixTTC(prixHT) {
  const ttc = prixHT * 1.2; // le calcul est fait...
  // ... mais personne ne le renvoie
}

const prix = prixTTC(100);
console.log(prix); // undefined
```

Et si on essaie d'utiliser ce résultat, l'erreur apparaît plus loin, parfois loin du vrai problème :

```js run
function prixTTC(prixHT) {
  const ttc = prixHT * 1.2;
}

console.log(prixTTC(100).toFixed(2));
```

```output
TypeError: Cannot read properties of undefined (reading 'toFixed')
```

> **À retenir** : quand tu vois `Cannot read properties of undefined`, demande-toi d'où
> vient la valeur `undefined`. Très souvent, c'est une fonction qui a **oublié son `return`**.

## `console.log` n'est pas `return`

C'est une confusion très courante :

- `console.log(x)` **affiche** `x` pour un humain, dans la console ;
- `return x` **rend** `x` au code qui a appelé la fonction, pour qu'il continue à travailler avec.

Une fonction qui fait `console.log` du résultat sans le `return` semble marcher (tu vois le bon
nombre s'afficher), mais le reste du programme reçoit `undefined`.

## L'écriture courte : les fonctions fléchées

Tu verras souvent cette syntaxe, qui fait la même chose :

```js run
const tripler = (n) => n * 3;

console.log(tripler(5));
```

Avec une seule expression après `=>`, le `return` est implicite. Avec des accolades
`{ ... }`, il faut à nouveau écrire `return`.

## Ce que tu sais faire maintenant

- Déclarer une fonction, avec des paramètres, et l'appeler.
- Renvoyer un résultat avec `return`, qui arrête aussi la fonction.
- Relier `undefined` et `Cannot read properties of undefined` à un `return` oublié.
- Lire une fonction fléchée `(n) => n * 3`.
