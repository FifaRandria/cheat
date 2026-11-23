---
id: react-01
title: Composants et props
minutes: 12
summary: Découper une interface en composants, leur passer des données avec les props, et afficher des listes.
check:
  - prompt: Qu'est-ce qu'un composant React ?
    choices:
      - Une fonction qui reçoit des props et renvoie ce qu'il faut afficher
      - Un fichier CSS
      - Une requête vers l'API
    answer: 0
  - prompt: Un composant peut-il modifier ses props ?
    choices:
      - Oui, librement
      - Non, les props sont en lecture seule, c'est le parent qui les fournit
    answer: 1
  - prompt: "Pourquoi React demande-t-il une `key` sur chaque élément d'une liste ?"
    choices:
      - Pour identifier chaque élément d'un rendu à l'autre, et mettre à jour le bon
      - Pour la sécurité
      - Pour le style
    answer: 0
---

## Une interface, des briques

Une page web moderne, c'est des dizaines d'éléments qui se répètent : cartes produits, boutons,
lignes de tableau. **React** propose de découper l'interface en **composants** : des briques
réutilisables, chacune responsable d'un morceau de l'écran.

Un composant est une **fonction** qui renvoie ce qu'il faut afficher, écrit en **JSX** (du
HTML dans du JavaScript) :

```js
function CarteProduit({ nom, prix }) {
  return (
    <article className="carte">
      <h2>{nom}</h2>
      <p>{prix} €</p>
    </article>
  );
}
```

> **Déjà vu** : dans le module « JavaScript dans le navigateur », tu as organisé une interface
> autour d'un état et d'une fonction de rendu. React automatise exactement cette idée.

## Les props : les données d'entrée

Les **props** sont les paramètres d'un composant. Le parent les fournit, comme des attributs
HTML :

```js
<CarteProduit nom="Clavier" prix={49} />
<CarteProduit nom="Souris" prix={25} />
```

Entre accolades `{ }`, on insère n'importe quelle expression JavaScript : une variable, un
calcul, un appel de fonction.

> **À retenir** : un composant ne modifie **jamais** ses props. Elles appartiennent au parent.
> Pour des données qui changent, on utilise l'**état** (leçon suivante).

## Afficher une liste

On transforme un tableau de données en tableau de composants avec `map` :

```js
function Catalogue({ produits }) {
  return (
    <section>
      {produits.map((p) => (
        <CarteProduit key={p.id} nom={p.nom} prix={p.prix} />
      ))}
    </section>
  );
}
```

La `key` permet à React de reconnaître chaque élément d'un affichage à l'autre. Sans elle, ou
avec l'index du tableau comme clé, React peut mélanger les éléments quand la liste change
(un champ de saisie qui « saute » d'une ligne à l'autre, par exemple).

> **Attention** : utilise un identifiant **stable et unique** (`p.id`), pas l'index du tableau
> quand la liste peut être triée, filtrée ou modifiée.

## Afficher sous condition

```js
function Stock({ quantite }) {
  if (quantite === 0) {
    return <p className="alerte">Rupture de stock</p>;
  }
  return <p>{quantite} en stock {quantite < 5 && <strong>· bientôt épuisé</strong>}</p>;
}
```

## Un rendu = une fonction des données

C'est l'idée centrale de React : l'interface est **le résultat d'une fonction** appliquée aux
données. On ne modifie pas l'écran à la main : on change les données, et React redessine ce
qui doit l'être.

```js run
// La même idée, sans React : l'affichage est calculé à partir des données.
const rendu = (produits) => produits.map((p) => `• ${p.nom} : ${p.prix} €`).join("\n");

console.log(rendu([{ nom: "Clavier", prix: 49 }, { nom: "Souris", prix: 25 }]));
```

## Ce que tu sais faire maintenant

- Écrire un composant qui reçoit des props et renvoie du JSX.
- Afficher une liste avec `map` et une `key` stable.
- Afficher des éléments sous condition.
- Expliquer pourquoi l'interface est une fonction des données.
