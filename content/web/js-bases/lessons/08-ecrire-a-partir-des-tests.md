---
id: js-bases-08
title: Écrire une fonction à partir des tests
minutes: 12
summary: Lire des tests comme un cahier des charges, puis écrire le code pas à pas, un test à la fois.
check:
  - prompt: Tu reçois six tests et une fonction vide. Par quoi commencer ?
    choices:
      - Écrire toute la fonction d'un coup, puis lancer les tests
      - Lire les noms des tests, puis faire passer le plus simple d'abord
      - Modifier les tests pour qu'ils passent
    answer: 1
  - prompt: "Le test dit `assert.equal(moyenne([]), 0)`. Qu'est-ce que ça t'apprend ?"
    choices:
      - Rien d'utile
      - "Un cas limite : un tableau vide doit donner 0, et pas NaN"
      - Que la fonction doit lever une erreur
    answer: 1
  - prompt: Tous les tests passent, mais ton code est confus. Que faire ?
    choices:
      - Le laisser tel quel, il marche
      - Le simplifier, puis relancer les tests pour vérifier que rien n'est cassé
    answer: 1
---

## Réparer, puis écrire

Jusqu'ici, tu as réparé du code écrit par d'autres. C'est le meilleur entraînement pour
**lire** du code. Mais un développeur doit aussi **écrire** à partir d'une page presque blanche.

Bonne nouvelle : tu ne pars jamais vraiment de rien. Dans les niveaux marqués **À écrire**,
tu reçois une fonction vide et des **tests**. Les tests sont le cahier des charges : ils disent
exactement ce que ta fonction doit faire.

## Lire un test comme une phrase

```js
test("un panier vide coûte 0", () => {
  assert.equal(totalPanier([]), 0);
});
```

Ce test se lit : « quand j'appelle `totalPanier` avec un tableau vide, j'attends `0` ».
Trois informations : le **nom** de la fonction, ce qu'on lui **donne**, ce qu'on **attend**.

> **À retenir** : avant d'écrire une seule ligne, lis le nom de **tous** les tests. Ensemble, ils
> décrivent le comportement complet, y compris les cas pièges (vide, absent, négatif…).

## Un test à la fois

La méthode la plus sûre, utilisée par des milliers d'équipes, s'appelle souvent
« rouge, vert, nettoyer » :

| Étape | Ce que tu fais |
|---|---|
| **Rouge** | Choisis un test qui échoue, le plus simple |
| **Vert** | Écris le **minimum** de code pour le faire passer |
| **Nettoyer** | Simplifie ton code, relance les tests, puis passe au test suivant |

Essaie ici. On veut `initiales("Ada Lovelace")` qui donne `"A.L."`. Commence par le cas le plus
simple, un seul mot :

```js run
function initiales(nom) {
  return nom[0] + ".";
}

console.log(initiales("Ada"));          // attendu : "A."
console.log(initiales("Ada Lovelace")); // attendu : "A.L."
```

Le premier cas passe, le second non. On généralise : découper en mots, prendre la première
lettre de chacun.

```js run
function initiales(nom) {
  let resultat = "";
  for (const mot of nom.split(" ")) {
    resultat += mot[0].toUpperCase() + ".";
  }
  return resultat;
}

console.log(initiales("Ada"));
console.log(initiales("Ada Lovelace"));
console.log(initiales("grace brewster hopper"));
```

## Les outils qui servent souvent

Pour écrire, il faut connaître quelques méthodes toutes faites. Inutile de tout apprendre par
cœur : sache qu'elles existent, et cherche les détails dans la documentation quand il le faut.

| Méthode | Exemple | Résultat |
|---|---|---|
| `texte.split(sep)` | `"a b".split(" ")` | `["a", "b"]` |
| `texte.trim()` | `"  ok ".trim()` | `"ok"` |
| `texte.toUpperCase()` | `"vip".toUpperCase()` | `"VIP"` |
| `texte.replace(a, b)` | `"3.5".replace(".", ",")` | `"3,5"` |
| `nombre.toFixed(2)` | `(3.5).toFixed(2)` | `"3.50"` (un texte) |
| `Math.max(...nombres)` | `Math.max(...[3, 9, 4])` | `9` |
| `Math.round(x * 100) / 100` | arrondir `2.346` | `2.35` |

```js run
const prix = 7.5;
console.log(prix.toFixed(2).replace(".", ",") + " €");
```

## Penser aux cas limites

Les tests contiennent presque toujours des **cas limites** : tableau vide, valeur absente,
nombre négatif, majuscules… C'est là que se cachent les bugs que tu as réparés dans les
niveaux précédents. Quand tu écris, pose-toi la question pour chaque entrée : « et si elle est
vide ? et si elle manque ? »

> **Attention** : ne modifie jamais un test pour le faire passer. Le test décrit ce que les
> utilisateurs attendent ; c'est le code qui doit s'y plier.

## Quand tu bloques

1. Relis le message d'échec : il montre la valeur **attendue** et la valeur **obtenue**.
2. Ajoute un `console.log` dans ta fonction pour voir les valeurs intermédiaires.
3. Réduis le problème : fais d'abord marcher un exemple avec une seule entrée.

## Ce que tu sais faire maintenant

- Lire des tests comme un cahier des charges.
- Écrire une fonction un test à la fois : rouge, vert, nettoyer.
- Repérer les cas limites avant qu'ils ne deviennent des bugs.
- Utiliser les méthodes courantes sur les textes et les nombres.
