---
id: react-02
title: L'état et l'immuabilité
minutes: 15
summary: useState, pourquoi React ne voit pas un tableau modifié avec push, et comment créer de nouvelles copies.
check:
  - prompt: "`panier.push(article); setPanier(panier);` : que se passe-t-il ?"
    choices:
      - L'écran se met à jour
      - L'écran peut ne pas se mettre à jour, car c'est le même tableau (même référence)
      - Une erreur
    answer: 1
  - prompt: Comment ajouter un article sans modifier le tableau d'origine ?
    choices: ["panier.push(article)", "[...panier, article]", "panier[panier.length] = article"]
    answer: 1
  - prompt: "Pour modifier une tâche dans une liste, quelle écriture est immuable ?"
    choices:
      - "taches.find(t => t.id === id).fait = true"
      - "taches.map(t => t.id === id ? { ...t, fait: true } : t)"
    answer: 1
---

## L'état d'un composant

L'**état** (*state*) contient les données qui **changent** pendant que l'utilisateur utilise la
page : le contenu d'un panier, une case cochée, un texte saisi.

```js
import { useState } from "react";

function Compteur() {
  const [nombre, setNombre] = useState(0);
  return <button onClick={() => setNombre(nombre + 1)}>Cliqué {nombre} fois</button>;
}
```

`useState(0)` renvoie la valeur actuelle et une fonction pour la **remplacer**. À chaque appel
de `setNombre`, React redessine le composant avec la nouvelle valeur.

## Comment React sait-il que l'état a changé ?

Pour aller vite, React compare l'ancienne et la nouvelle valeur **par référence** : est-ce le
**même objet** en mémoire ? Si oui, il considère que rien n'a changé.

```js run
const panier = ["clavier"];
const meme = panier;
meme.push("souris");

console.log(panier);          // le tableau d'origine a changé aussi !
console.log(meme === panier); // true : c'est le même tableau
```

Avec `push`, on modifie le tableau **existant**. Pour React, c'est toujours le même tableau :
il peut ignorer la mise à jour, et l'écran ne bouge pas.

> **À retenir** : en React, on ne **modifie** jamais l'état. On en crée une **nouvelle copie**
> modifiée. C'est l'**immuabilité**.

## Les copies immuables

```js run
const panier = [{ id: 1, nom: "Clavier", qte: 1 }];

// Ajouter
const ajoute = [...panier, { id: 2, nom: "Souris", qte: 1 }];

// Modifier un élément
const modifie = panier.map((a) => (a.id === 1 ? { ...a, qte: a.qte + 1 } : a));

// Supprimer
const retire = panier.filter((a) => a.id !== 1);

console.log(panier);    // inchangé
console.log(ajoute.length, modifie[0].qte, retire.length);
console.log(modifie !== panier, modifie[0] !== panier[0]);
```

| Opération | Mutable (à éviter) | Immuable |
|---|---|---|
| ajouter | `push` | `[...tableau, element]` |
| modifier | `obj.prop = …` | `map` + `{ ...obj, prop: … }` |
| supprimer | `splice` | `filter` |
| trier | `sort` (trie sur place !) | `[...tableau].sort()` ou `toSorted()` |

> **Attention** : `{ ...obj }` est une copie **superficielle**. Si l'objet contient un autre
> objet ou un tableau, il faut le copier aussi avant de le modifier.

## Une logique d'état testable

On écrit souvent la logique de mise à jour dans des **fonctions pures**, testables sans React :

```js
function ajouterAuPanier(panier, produit) {
  return [...panier, { ...produit, qte: 1 }];
}

// dans le composant :
setPanier((ancien) => ajouterAuPanier(ancien, produit));
```

C'est exactement ce que tu répareras dans les exercices.

## Ce que tu sais faire maintenant

- Déclarer et mettre à jour un état avec `useState`.
- Expliquer pourquoi une mutation peut empêcher React de redessiner.
- Ajouter, modifier, supprimer et trier sans muter.
- Écrire la logique d'état dans des fonctions pures.
