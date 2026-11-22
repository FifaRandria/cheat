---
id: js-bases-04
title: Répéter avec les boucles
minutes: 12
summary: Répéter une action sans copier-coller, compter à partir de zéro, et éviter le tour de boucle en trop.
check:
  - prompt: "Combien de fois s'affiche « tour » ?\n\n```js\nfor (let i = 0; i < 3; i++) {\n  console.log(\"tour\");\n}\n```"
    choices: ["2", "3", "4"]
    answer: 1
    explain: "i vaut 0, puis 1, puis 2. À 3, la condition `i < 3` devient fausse : 3 tours."
  - prompt: "Un tableau a 4 éléments. Quel est l'index du dernier ?"
    choices: ["4", "3", "5"]
    answer: 1
    explain: "Les index commencent à 0 : 0, 1, 2, 3. Le dernier index vaut toujours `length - 1`."
  - prompt: "Avec `i <= notes.length`, que lit le dernier tour de boucle ?"
    choices:
      - Le dernier élément
      - "Une case qui n'existe pas, donc undefined"
      - Le premier élément
    answer: 1
---

## Pourquoi répéter ?

Afficher les nombres de 1 à 5, tu peux l'écrire à la main. De 1 à 1 000, non.
Une **boucle** répète un bloc de code tant qu'une condition est vraie.

## La boucle `for`, pièce par pièce

```js run
for (let i = 1; i <= 5; i++) {
  console.log("Tour numéro", i);
}
```

La ligne `for (...)` a trois parties, séparées par des `;` :

| Partie | Ici | Rôle |
|---|---|---|
| départ | `let i = 1` | crée le compteur, une seule fois |
| condition | `i <= 5` | testée **avant** chaque tour ; si fausse, on sort |
| pas | `i++` | exécuté **après** chaque tour (`i++` veut dire `i = i + 1`) |

Déroulons-la à la main, c'est le meilleur exercice qui soit :

| Tour | `i` | `i <= 5` ? | Affiche |
|---|---|---|---|
| 1 | 1 | oui | Tour numéro 1 |
| 2 | 2 | oui | Tour numéro 2 |
| … | … | … | … |
| 5 | 5 | oui | Tour numéro 5 |
| — | 6 | **non** | on sort |

> **Astuce** : quand une boucle se comporte bizarrement, fais exactement ce tableau sur une
> feuille. C'est lent, et c'est imbattable.

## Parcourir un tableau

Un **tableau** est une liste de valeurs (on le détaille dans une prochaine leçon) :

```js
const notes = [12, 15, 9, 18];
```

Chaque élément a une position, son **index**, qui commence à **0** :

| index | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| valeur | 12 | 15 | 9 | 18 |

`notes.length` vaut 4 (le nombre d'éléments), mais le dernier index vaut **3**.

```js run
const notes = [12, 15, 9, 18];

for (let i = 0; i < notes.length; i++) {
  console.log("index", i, "→ note", notes[i]);
}
```

## Le tour en trop

Remplace `<` par `<=` dans l'exemple ci-dessus et exécute.

Tu obtiens un cinquième tour avec `notes[4]`… qui n'existe pas. JavaScript ne plante pas :
il renvoie `undefined`. Et si on additionne avec `undefined`, on obtient `NaN`
(*Not a Number*, « pas un nombre ») :

```js run
const notes = [12, 15, 9, 18];
let somme = 0;

for (let i = 0; i <= notes.length; i++) {
  somme = somme + notes[i];
}

console.log(somme); // NaN : un tour de trop a ajouté undefined
```

> **À retenir** : pour parcourir un tableau, la condition est `i < tableau.length`,
> avec un `<` strict. Un `NaN` qui sort de nulle part vient souvent d'un `undefined`
> ajouté par un tour de boucle en trop.

## Plus simple : `for...of`

Quand tu n'as pas besoin de l'index, `for...of` donne directement chaque élément,
sans risque de tour en trop :

```js run
const notes = [12, 15, 9, 18];
let somme = 0;

for (const note of notes) {
  somme = somme + note;
}

console.log("Somme :", somme);
console.log("Moyenne :", somme / notes.length);
```

## La boucle `while`

`while` répète **tant que** la condition est vraie :

```js run
let bocal = 10;
while (bocal > 0) {
  console.log("Il reste", bocal, "bonbons");
  bocal = bocal - 4;
}
```

> **Attention** : si la condition ne devient jamais fausse, la boucle tourne pour toujours
> et le programme se fige : c'est une **boucle infinie**. Vérifie toujours que quelque chose
> change à chaque tour.

## Ce que tu sais faire maintenant

- Écrire une boucle `for` et la dérouler à la main.
- Parcourir un tableau de l'index `0` à `length - 1`.
- Reconnaître le symptôme `undefined` / `NaN` d'un tour en trop.
- Utiliser `for...of` et `while`.
