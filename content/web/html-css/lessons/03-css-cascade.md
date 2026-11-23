---
id: html-css-03
title: "CSS : sélecteurs, cascade et spécificité"
minutes: 15
summary: Cibler des éléments, et comprendre pourquoi une règle l'emporte sur une autre.
check:
  - prompt: "Quelle règle gagne pour un bouton `<button class=\"danger\">` dans `<form id=\"f\">` ?\n\n```css\n#f button { color: blue; }\n.danger { color: red; }\n```"
    choices:
      - "`.danger`, car elle est écrite après"
      - "`#f button`, car un id pèse plus lourd que n'importe quel nombre de classes"
    answer: 1
  - prompt: Quelle est la spécificité de `nav ul li.actif a` ?
    choices:
      - "(0, 1, 4) : aucun id, une classe, quatre balises"
      - "(0, 0, 5)"
      - "(1, 1, 4)"
    answer: 0
  - prompt: Pourquoi éviter !important pour régler un conflit ?
    choices:
      - Il ne fonctionne pas
      - "Il gagne contre tout : la prochaine règle qui voudra l'emporter devra aussi utiliser !important, et ainsi de suite"
    answer: 1
---

## Une règle CSS

```css
.prix-promo {
  color: crimson;
  font-weight: bold;
}
```

- `.prix-promo` est le **sélecteur** : à quels éléments s'applique la règle.
- `color: crimson;` est une **déclaration** : une propriété et sa valeur.

## Les sélecteurs de base

| Sélecteur | Cible | Exemple HTML |
|---|---|---|
| `p` | toutes les balises `p` | `<p>` |
| `.alerte` | les éléments avec la classe `alerte` | `<div class="alerte">` |
| `#panier` | l'élément d'id `panier` (unique) | `<section id="panier">` |
| `button.primaire` | les `button` **qui ont** la classe `primaire` | `<button class="primaire">` |
| `nav a` | les `a` situés **quelque part dans** un `nav` | `<nav><ul><li><a>` |
| `ul > li` | les `li` **enfants directs** d'un `ul` | `<ul><li>` |

Un élément peut avoir plusieurs classes : `class="btn btn-danger"`.

## La cascade : quand deux règles se contredisent

```css
button { background: lightgray; }
.btn-danger { background: crimson; }
```

Un `<button class="btn-danger">` est visé par les deux règles. Laquelle gagne ? Le navigateur
compare dans cet ordre :

1. **`!important`** : une déclaration marquée `!important` gagne contre les autres.
2. **La spécificité** : le sélecteur le plus précis gagne.
3. **L'ordre** : à spécificité égale, la règle écrite **en dernier** gagne.

## Calculer la spécificité

On compte trois nombres, comparés de gauche à droite, comme un score :

| Sélecteur | ids | classes | balises | Score |
|---|---|---|---|---|
| `button` | 0 | 0 | 1 | (0, 0, 1) |
| `.btn-danger` | 0 | 1 | 0 | (0, 1, 0) |
| `button.btn-danger` | 0 | 1 | 1 | (0, 1, 1) |
| `#formulaire button` | 1 | 0 | 1 | (1, 0, 1) |

`(1, 0, 1)` bat `(0, 1, 0)` : **un seul id l'emporte sur n'importe quel nombre de classes**.
C'est la source du bug le plus fréquent en CSS : « ma règle est écrite, mais elle ne s'applique
pas ».

```css
.btn-danger { background: crimson; }          /* (0, 1, 0) */
#formulaire button { background: steelblue; } /* (1, 0, 1) : gagne */
```

Le bouton « Supprimer » du formulaire reste bleu, même s'il a la classe `btn-danger`.

## Corriger proprement

| Solution | Verdict |
|---|---|
| Ajouter `!important` | rapide, mais déclenche une escalade : à éviter |
| Écrire une règle aussi précise : `#formulaire .btn-danger` | correct, ciblé |
| Éviter les id en CSS, utiliser des classes partout | la meilleure prévention |

> **À retenir** : quand une règle ne s'applique pas, ouvre les outils de développement du
> navigateur (F12, onglet « Éléments »). Les règles **barrées** ont perdu, et la règle gagnante
> est affichée au-dessus. C'est la méthode de diagnostic appliquée au CSS.

## Ce que tu sais faire maintenant

- Écrire des sélecteurs de balise, de classe, d'id, composés, descendants et enfants.
- Prévoir quelle règle gagne grâce à la cascade.
- Calculer une spécificité et diagnostiquer une règle qui « ne marche pas ».
- Corriger un conflit sans `!important`.
