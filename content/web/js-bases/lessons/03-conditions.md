---
id: js-bases-03
title: Prendre des décisions avec if
minutes: 10
summary: Exécuter du code seulement si une condition est vraie, comparer des valeurs, et éviter le piège du = au lieu de ===.
check:
  - prompt: "Que fait `if (role = \"admin\")` ?"
    choices:
      - Il vérifie si role vaut "admin"
      - "Il range \"admin\" dans role, et la condition est toujours vraie"
      - Il provoque une erreur
    answer: 1
    explain: "Un seul `=` range une valeur. Pour comparer, il faut `===`."
  - prompt: "Que vaut `age >= 18 && aUnBillet` si age vaut 20 et aUnBillet vaut false ?"
    choices:
      - "true"
      - "false"
    answer: 1
    explain: "`&&` exige que les deux côtés soient vrais. Ici, il manque le billet."
---

## Le programme qui choisit

Jusqu'ici, toutes les lignes s'exécutaient. Souvent, on veut exécuter du code **seulement dans
certains cas** : afficher « Bienvenue » si l'utilisateur est connecté, refuser un paiement si
le solde est insuffisant…

C'est le rôle de `if` (« si ») :

```js run
const temperature = 32;

if (temperature > 30) {
  console.log("Il fait chaud, pense à boire de l'eau.");
}

console.log("Fin du programme.");
```

La structure :

```js
if (condition) {
  // exécuté seulement si la condition est vraie
}
```

Change `32` en `20` et exécute : le message disparaît.

## Sinon : `else`

```js run
const solde = 15;
const prix = 40;

if (solde >= prix) {
  console.log("Paiement accepté");
} else {
  console.log("Solde insuffisant");
}
```

Et pour plus de deux cas, `else if` :

```js run
const note = 13;

if (note >= 16) {
  console.log("Très bien");
} else if (note >= 10) {
  console.log("Validé");
} else {
  console.log("À retravailler");
}
```

JavaScript teste les conditions **dans l'ordre** et s'arrête à la **première** qui est vraie.

## Comparer des valeurs

| Opérateur | Signifie | Exemple vrai |
|---|---|---|
| `===` | est égal à | `3 === 3` |
| `!==` | est différent de | `3 !== 4` |
| `>` / `<` | plus grand / plus petit | `5 > 2` |
| `>=` / `<=` | plus grand ou égal / plus petit ou égal | `5 >= 5` |

Une comparaison produit toujours un **booléen** : `true` ou `false`.

```js run
console.log(3 === 3);
console.log("3" === 3); // texte et nombre : pas égaux
console.log(10 <= 9);
```

## Le piège n°1 : `=` au lieu de `===`

C'est l'un des bugs les plus fréquents chez les débutants, et parfois chez les autres :

```js run
let role = "invite";

if (role = "admin") {
  console.log("Accès administrateur accordé !");
}

console.log("role vaut maintenant :", role);
```

Avec un seul `=`, on ne **compare** pas : on **range** `"admin"` dans `role`. Résultat :

1. la condition est toujours vraie, donc tout le monde devient administrateur ;
2. la variable `role` a été **modifiée** au passage.

> **À retenir** : `=` range une valeur, `===` compare deux valeurs. Dans un `if`, tu veux
> presque toujours `===`.

Pourquoi trois `=` et pas deux ? `==` existe aussi, mais il convertit les types avant de
comparer (`"3" == 3` est vrai !), ce qui cause des surprises. Utilise toujours `===`.

## Combiner des conditions

- `&&` (« et ») : vrai si **les deux** côtés sont vrais ;
- `||` (« ou ») : vrai si **au moins un** côté est vrai ;
- `!` (« non ») : inverse une valeur.

```js run
const age = 20;
const aUnBillet = true;

if (age >= 18 && aUnBillet) {
  console.log("Entrée autorisée");
}

const estWeekend = false;
const estFerie = true;
if (estWeekend || estFerie) {
  console.log("Pas de travail aujourd'hui");
}

console.log(!true);
```

## Ce que tu sais faire maintenant

- Exécuter du code sous condition avec `if`, `else if` et `else`.
- Comparer avec `===`, `!==`, `<`, `>`, `<=`, `>=`.
- Repérer le piège `if (x = ...)`.
- Combiner des conditions avec `&&`, `||` et `!`.
