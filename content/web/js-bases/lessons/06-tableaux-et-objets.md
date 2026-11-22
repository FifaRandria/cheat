---
id: js-bases-06
title: Tableaux et objets
minutes: 14
summary: Ranger des listes et des fiches, les parcourir, en extraire une partie, et arrondir correctement.
check:
  - prompt: "Que renvoie `[\"a\", \"b\", \"c\", \"d\"].slice(1, 3)` ?"
    choices: ['["a", "b"]', '["b", "c"]', '["b", "c", "d"]']
    answer: 1
    explain: "`slice(début, fin)` prend de l'index `début` inclus jusqu'à l'index `fin` exclu : 1 et 2."
  - prompt: "Comment lire l'e-mail de `const user = { nom: \"Ada\", email: \"ada@ex.com\" }` ?"
    choices: ["user[email]", "user.email", "user->email"]
    answer: 1
  - prompt: "23 articles, 10 par page : combien de pages ?"
    choices:
      - "Math.floor(23 / 10), soit 2"
      - "Math.ceil(23 / 10), soit 3"
      - "23 / 10, soit 2.3"
    answer: 1
    explain: "Une page à moitié remplie reste une page : on arrondit vers le haut avec `Math.ceil`."
---

## Les tableaux : des listes

Un **tableau** range plusieurs valeurs dans un ordre précis, entre crochets :

```js run
const fruits = ["pomme", "banane", "kiwi"];

console.log(fruits[0]);       // le premier (index 0)
console.log(fruits[2]);       // le troisième (index 2)
console.log(fruits.length);   // le nombre d'éléments
```

Rappel de la leçon sur les boucles : les index commencent à **0**, le dernier vaut `length - 1`.

## Modifier un tableau

```js run
const panier = ["pain"];

panier.push("lait");     // ajoute à la fin
panier.push("œufs");
console.log(panier);

panier[0] = "baguette";  // remplace l'élément d'index 0
console.log(panier);
```

Remarque : `panier` est déclaré avec `const`, et pourtant on peut le modifier. `const` empêche
de **remplacer** la boîte par une autre (`panier = [...]`), pas de changer ce qu'il y a dedans.

## Extraire une partie : `slice`

`slice(debut, fin)` renvoie un **nouveau** tableau, de l'index `debut` **inclus** à l'index `fin` **exclu** :

```js run
const lettres = ["a", "b", "c", "d", "e", "f"];

console.log(lettres.slice(0, 2)); // index 0 et 1
console.log(lettres.slice(2, 5)); // index 2, 3 et 4
console.log(lettres.slice(4, 99)); // pas d'erreur si on dépasse : on obtient ce qui existe
```

C'est exactement ce qu'il faut pour **paginer** : afficher 10 articles par page.

```js run
const articles = ["a1", "a2", "a3", "a4", "a5", "a6", "a7"];
const parPage = 3;

const page = 2;                    // les pages commencent à 1 pour l'utilisateur
const debut = (page - 1) * parPage; // mais les index commencent à 0 !
console.log(articles.slice(debut, debut + parPage));
```

> **À retenir** : les humains comptent à partir de 1 (« page 1 »), les tableaux à partir de 0.
> Le passage de l'un à l'autre, `(page - 1)`, est une source classique de décalage de un.

## Arrondir

Diviser donne souvent un nombre à virgule. Trois façons d'arrondir :

```js run
console.log(Math.floor(2.7)); // vers le bas : 2
console.log(Math.ceil(2.1));  // vers le haut : 3
console.log(Math.round(2.5)); // au plus proche : 3
```

Combien de pages pour 7 articles, 3 par page ? `7 / 3 = 2.33…`. Il en faut **3** : la dernière
page n'est pas pleine, mais elle existe. On arrondit donc vers le haut, avec `Math.ceil`.

## Les objets : des fiches

Un **objet** regroupe des informations sur une même chose, sous forme de paires
**clé : valeur**, entre accolades :

```js run
const utilisateur = {
  prenom: "Ada",
  age: 36,
  premium: true,
};

console.log(utilisateur.prenom);
console.log(utilisateur.age);

utilisateur.age = 37;           // modifier
utilisateur.ville = "Londres";  // ajouter
console.log(utilisateur);
```

On lit une valeur avec un **point** : `utilisateur.prenom`. Une clé qui n'existe pas donne
`undefined`, sans erreur :

```js run
const utilisateur = { prenom: "Ada" };
console.log(utilisateur.telephone); // undefined
```

## Des tableaux d'objets

Dans une vraie application, tu manipuleras surtout des **listes de fiches** : des produits,
des commandes, des utilisateurs.

```js run
const produits = [
  { nom: "Clavier", prix: 49 },
  { nom: "Souris", prix: 25 },
  { nom: "Écran", prix: 189 },
];

let total = 0;
for (const produit of produits) {
  console.log(`${produit.nom} : ${produit.prix} €`);
  total = total + produit.prix;
}
console.log("Total :", total, "€");
```

## Ce que tu sais faire maintenant

- Lire, ajouter et modifier des éléments d'un tableau.
- Extraire une partie avec `slice(debut, fin)`, fin exclue.
- Passer d'un numéro de page à un index avec `(page - 1) * parPage`.
- Arrondir avec `Math.floor`, `Math.ceil` et `Math.round`.
- Créer un objet, lire ses valeurs avec un point, et parcourir un tableau d'objets.
