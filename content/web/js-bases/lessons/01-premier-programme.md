---
id: js-bases-01
title: Ton premier programme
minutes: 8
summary: Ce qu'est un programme, comment afficher un message, et comment lire une erreur sans paniquer.
check:
  - prompt: Dans quel ordre l'ordinateur exécute-t-il les lignes d'un programme ?
    choices:
      - Dans un ordre aléatoire
      - De haut en bas, une ligne après l'autre
      - De la plus courte à la plus longue
    answer: 1
    explain: Comme une recette de cuisine, les instructions sont suivies dans l'ordre où elles sont écrites.
  - prompt: "Ton programme affiche `ReferenceError: consol is not defined`. Que s'est-il passé ?"
    choices:
      - L'ordinateur est en panne
      - "JavaScript ne connaît pas le mot « consol » : il y a une faute de frappe"
      - Il faut redémarrer la page
    answer: 1
    explain: Le message dit exactement ce qui ne va pas. « consol » n'existe pas, c'est « console » qu'il fallait écrire.
---

## Un programme, c'est une recette

Un programme est une **liste d'instructions** que l'ordinateur exécute **dans l'ordre**,
de haut en bas. Exactement comme une recette :

1. Casser deux œufs.
2. Ajouter le sucre.
3. Mélanger.

Si tu inverses les étapes, le résultat change. En programmation, c'est pareil.

**JavaScript** est le langage du web. Il fait fonctionner les boutons, les formulaires et
les animations des sites, et il tourne aussi sur les serveurs grâce à **Node.js**.
C'est le langage de tout le parcours web.

## Afficher un message

La première chose à savoir faire : demander à l'ordinateur d'**afficher** quelque chose.
En JavaScript, on utilise `console.log(...)`.

Clique sur **Exécuter** :

```js run
console.log("Bonjour !");
console.log("Je suis ton premier programme.");
```

Le texte entre guillemets s'affiche dans la **console**, la zone noire sous le code.
Modifie le message, puis exécute à nouveau : c'est ton code maintenant.

> **À retenir** : `console.log` sera ton meilleur outil de diagnostic. Quand quelque chose
> ne marche pas, la première question est toujours : « que vaut cette valeur, à ce moment-là ? ».
> `console.log` te donne la réponse.

On peut aussi afficher des nombres et des calculs :

```js run
console.log(2 + 3);
console.log(10 * 4);
console.log("Le résultat est", 7 * 6);
```

## Les commentaires

Tout ce qui suit `//` est un **commentaire** : l'ordinateur l'ignore. Il sert aux humains
qui liront le code, dont toi dans trois semaines.

```js run
// Ce programme salue l'utilisateur
console.log("Salut !"); // ceci est aussi un commentaire
```

## Une erreur n'est pas un échec : c'est un indice

Tu vas faire des erreurs. Tout le temps. Les développeurs expérimentés aussi. La différence,
c'est qu'ils **lisent le message d'erreur** au lieu de le fuir.

Exécute ce code, qui contient une faute de frappe :

```js run
console.log("Avant l'erreur");
consol.log("Je ne m'afficherai jamais");
console.log("Moi non plus");
```

Le message ressemble à :

```output
ReferenceError: consol is not defined
```

Il se lit en deux parties :

- **`ReferenceError`** : le **type** d'erreur. Ici, un nom que JavaScript ne connaît pas.
- **`consol is not defined`** : le **détail**. « consol » n'est défini nulle part.

Remarque aussi que la première ligne s'est affichée, mais pas la troisième : le programme
**s'arrête** à la première erreur. C'est un indice précieux pour savoir *où* ça casse.

> **Astuce** : quand une erreur apparaît, lis-la à voix haute, en entier, avant de toucher
> au code. La moitié des bugs se résolvent à cette étape.

## Ce que tu sais faire maintenant

- Un programme s'exécute de haut en bas, ligne après ligne.
- `console.log(...)` affiche une valeur dans la console.
- `//` écrit un commentaire.
- Un message d'erreur donne son **type** et son **détail**, et le programme s'arrête là où il casse.
