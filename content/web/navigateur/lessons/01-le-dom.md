---
id: navigateur-01
title: "Le DOM : quand JavaScript modifie la page"
minutes: 14
summary: Trouver un élément de la page, changer son texte, ses classes, en créer de nouveaux, et pourquoi textContent est plus sûr qu'innerHTML.
check:
  - prompt: "Que renvoie `document.querySelector(\"#panier\")` si aucun élément n'a cet id ?"
    choices:
      - "Une erreur"
      - "`null` : la ligne suivante qui l'utilise plantera avec « Cannot read properties of null »"
      - "Un élément vide"
    answer: 1
  - prompt: "Pour afficher le nom tapé par un utilisateur, que choisir ?"
    choices:
      - "`element.innerHTML = nom`"
      - "`element.textContent = nom` : le texte reste du texte, jamais du HTML"
    answer: 1
  - prompt: "Comment cacher un message d'erreur sans le supprimer ?"
    choices:
      - "`message.hidden = true`, ou une classe CSS"
      - "`message.remove()`"
    answer: 0
---

## Le lien entre HTML et JavaScript

Dans le module « HTML et CSS », tu as écrit des pages. Dans les modules JavaScript, tu as écrit
des programmes qui tournaient dans une console. Il manque le pont : **JavaScript qui modifie la
page sous les yeux de l'utilisateur**. Ce pont s'appelle le **DOM** (*Document Object Model*).

Quand le navigateur lit ton HTML, il construit un **arbre d'objets** : un objet par balise,
imbriqués comme les balises. JavaScript peut lire et modifier cet arbre, et l'écran se met à
jour aussitôt.

```html
<main>
  <h1 id="titre">Mon panier</h1>
  <p class="total">Total : 0 €</p>
</main>
<script type="module" src="panier.js"></script>
```

> **Astuce** : place le `<script>` à la fin du `body`, ou ajoute `type="module"` (qui attend que
> la page soit lue). Sinon le script s'exécute avant que les éléments existent, et tous tes
> `querySelector` renvoient `null`.

## Trouver un élément

```js
const titre = document.querySelector("#titre");          // par id
const total = document.querySelector(".total");          // le premier de cette classe
const lignes = document.querySelectorAll("#panier li");  // tous, sous forme de liste
```

`querySelector` utilise les **sélecteurs CSS** que tu connais déjà. S'il ne trouve rien, il
renvoie `null` : vérifie l'orthographe de l'id ou de la classe quand tu vois
`TypeError: Cannot read properties of null`.

## Modifier le texte, les classes, les attributs

```js
total.textContent = "Total : 42,00 €";      // le texte
titre.classList.add("important");           // ajouter une classe CSS
titre.classList.remove("important");        // la retirer
bouton.disabled = true;                      // désactiver un bouton
message.hidden = true;                       // cacher un élément
lien.setAttribute("href", "/panier");        // n'importe quel attribut
```

Le **style** se change de préférence avec des **classes** : le CSS décrit l'apparence, et
JavaScript ne fait qu'ajouter ou retirer une classe.

## Créer des éléments

```js
const liste = document.querySelector("#outils");

for (const outil of ["Perceuse", "Escabeau"]) {
  const li = document.createElement("li");
  li.textContent = outil;
  liste.appendChild(li);
}
```

Résultat dans la page :

```html
<ul id="outils">
  <li>Perceuse</li>
  <li>Escabeau</li>
</ul>
```

Pour vider une liste avant de la redessiner : `liste.replaceChildren()` (ou
`liste.textContent = ""`).

## textContent ou innerHTML ?

```js
commentaire.innerHTML = texteDeLUtilisateur;     // DANGER : le texte devient du HTML
commentaire.textContent = texteDeLUtilisateur;   // le texte reste du texte
```

Tu as vu dans le module « Sécurité web » ce qui arrive quand le texte d'un utilisateur devient
du HTML : une faille XSS. `textContent` l'empêche par construction.

> **À retenir** : `innerHTML` seulement pour du HTML que **tu** as écrit, jamais avec une donnée
> venue d'un utilisateur ou d'une API. Partout ailleurs, `textContent` et `createElement`.

## Dans les niveaux

Le bac à sable n'a pas de navigateur. Les tests te fournissent une **fausse page** qui se
comporte comme la vraie, et ta fonction la reçoit en paramètre :

```js
export function initialiser(document) {
  document.querySelector("#titre").textContent = "Bonjour";
}
```

Dans un vrai site, `document` est une variable globale fournie par le navigateur ; tu
appellerais simplement `initialiser(document)` à la fin de ton script.

## Ce que tu sais faire maintenant

- Expliquer ce qu'est le DOM, et quand un script peut y accéder.
- Trouver des éléments avec `querySelector` et `querySelectorAll`.
- Modifier un texte, des classes, des attributs, et créer des éléments.
- Choisir `textContent` plutôt qu'`innerHTML` pour les données.
