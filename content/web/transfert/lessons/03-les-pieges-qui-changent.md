---
id: transfert-03
title: Les pièges qui changent d'un langage à l'autre
minutes: 14
summary: Ce qui marchait en JavaScript et casse en Python, et inversement. Les pièges qui piègent même les développeurs expérimentés.
check:
  - prompt: "Que donne `[10, 9, 100].sort()` en JavaScript ?"
    choices:
      - "`[9, 10, 100]`"
      - "`[10, 100, 9]` : sans comparateur, JavaScript trie comme du texte"
      - Une erreur
    answer: 1
  - prompt: "En Python, que se passe-t-il avec `def ajouter(x, liste=[])` appelée deux fois sans liste ?"
    choices:
      - Chaque appel reçoit une liste neuve, comme en JavaScript
      - "Les deux appels partagent la MÊME liste : elle est créée une seule fois, à la définition"
    answer: 1
  - prompt: "Que donne `7 / 2` en Python 3 ?"
    choices:
      - "`3`"
      - "`3.5` ; pour la division entière, on écrit `7 // 2`"
    answer: 1
---

## Le tri des nombres en JavaScript

```js run
const scores = [10, 9, 100, 25];
scores.sort();
console.log(scores);
```

Sans comparateur, `sort` convertit tout en **texte** et compare les caractères : `"100"`
passe avant `"25"`, qui passe avant `"9"`. En Python, `sorted([10, 9, 100, 25])` trie bien des
nombres. Celui qui passe de Python à JavaScript se fait piéger.

```js run
const scores = [10, 9, 100, 25];
scores.sort((a, b) => a - b);   // croissant ; b - a pour décroissant
console.log(scores);
```

## L'argument par défaut mutable en Python

```js run
function ajouter(article, panier = []) {
  panier.push(article);
  return panier;
}
console.log(ajouter("pomme"));
console.log(ajouter("kiwi"));
```

En JavaScript, `[]` est recréé **à chaque appel**. Le même code en Python :

```python
def ajouter(article, panier=[]):
    panier.append(article)
    return panier

print(ajouter("pomme"))
print(ajouter("kiwi"))
```

```output
['pomme']
['pomme', 'kiwi']
```

En Python, la valeur par défaut est créée **une seule fois**, quand la fonction est définie.
Tous les appels partagent la même liste. La correction idiomatique :

```python
def ajouter(article, panier=None):
    if panier is None:
        panier = []
    panier.append(article)
    return panier
```

## La division

| Calcul | JavaScript | Python |
|---|---|---|
| `7 / 2` | `3.5` | `3.5` |
| division entière | `Math.floor(7 / 2)` → `3` | `7 // 2` → `3` |
| arrondi supérieur | `Math.ceil(7 / 2)` → `4` | `math.ceil(7 / 2)` → `4` |

Piège courant d'un portage : `nb_pages = total / par_page` donne `2.5` en Python, et
`liste[0:2.5]` lève `TypeError: slice indices must be integers`.

## Le vrai et le faux

| Valeur | JavaScript | Python |
|---|---|---|
| `[]` (liste vide) | **vrai** | faux |
| `{}` (objet ou dictionnaire vide) | **vrai** | faux |
| `""`, `0`, `null` / `None` | faux | faux |
| `"0"` | vrai | vrai |

```js run
const panier = [];
if (panier) console.log("JavaScript : un tableau vide est vrai !");
if (panier.length === 0) console.log("la bonne façon de tester un tableau vide");
```

## Indices négatifs et clés absentes

| Code | JavaScript | Python |
|---|---|---|
| `liste[-1]` | `undefined` | le dernier élément |
| `dico["absente"]` | `undefined`, le programme continue | `KeyError`, le programme s'arrête |
| `"a" + 1` | `"a1"` | `TypeError` |

JavaScript est **permissif** : il continue avec `undefined` ou `NaN`, et le bug éclate plus
loin. Python est **strict** : il s'arrête tout de suite, à l'endroit exact du problème. Aucun
n'est meilleur ; il faut savoir lequel on utilise.

> **À retenir** : à chaque nouveau langage, cherche « *nom du langage* gotchas » ou
> « pièges courants ». Une liste de dix pièges, lue en vingt minutes, évite des heures de
> débogage.

## Ce que tu sais faire maintenant

- Trier des nombres correctement en JavaScript.
- Éviter l'argument par défaut mutable en Python.
- Choisir entre `/`, `//`, `Math.floor` et `math.ceil`.
- Anticiper les différences sur le vrai et le faux, les indices négatifs et les clés absentes.
