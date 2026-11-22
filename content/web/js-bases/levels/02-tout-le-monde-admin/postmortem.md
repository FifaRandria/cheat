## Cause racine

`if (utilisateur.role = "admin")` ne **compare** pas : avec un seul `=`, il **range**
`"admin"` dans `utilisateur.role`. Deux conséquences :

1. la valeur rangée, `"admin"`, est un texte non vide, donc considérée comme vraie :
   la condition passe **toujours**, et tout le monde peut supprimer ;
2. le rôle de l'utilisateur est **réellement modifié** : d'où les invités devenus « admin »
   dans les logs d'audit.

Un seul caractère manquant, et c'est une faille de sécurité complète.

## Correctif

```js
if (utilisateur.role === "admin") {
```

On peut même écrire plus court, puisque la comparaison produit déjà `true` ou `false` :

```js
return utilisateur.role === "admin";
```

## Le réflexe à garder

- `=` range, `===` compare. Dans un `if`, c'est presque toujours `===`.
- Quand une donnée change « toute seule », cherche une affectation `=` cachée là où
  tu attendais une simple lecture.
- Les outils de qualité (lint, vus dans le module TypeScript) signalent ce piège automatiquement.
