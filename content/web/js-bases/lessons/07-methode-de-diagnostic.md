---
id: js-bases-07
title: La méthode de diagnostic
minutes: 12
summary: Reproduire, observer, formuler une hypothèse, isoler, corriger, vérifier. La démarche qui marche pour tous les bugs, sans IA.
check:
  - prompt: Un utilisateur signale « le panier ne marche pas ». Quelle est la première étape ?
    choices:
      - Réécrire le module panier
      - Reproduire le bug, avec les mêmes données et les mêmes étapes
      - Demander à une IA de corriger
    answer: 1
  - prompt: Tu as une hypothèse sur la cause. Comment la vérifier ?
    choices:
      - Changer cinq choses à la fois et voir si ça marche
      - Faire une seule observation ou un seul changement qui confirme ou infirme l'hypothèse
      - Attendre que le bug disparaisse
    answer: 1
  - prompt: Le bug est corrigé. Qu'est-ce qui reste à faire ?
    choices:
      - Rien
      - Vérifier que le cas d'origine passe, et que rien d'autre n'est cassé (relancer tous les tests)
    answer: 1
---

## Pourquoi une méthode ?

Face à un bug, la tentation est de modifier du code au hasard « pour voir ». Parfois ça
marche, et on ne sait pas pourquoi. Souvent, ça casse autre chose.

Les bons développeurs ne sont pas ceux qui ne font jamais de bugs : ce sont ceux qui les
**trouvent vite**, grâce à une démarche presque scientifique. Elle tient en six étapes.

| # | Étape | La question |
|---|---|---|
| 1 | **Reproduire** | Est-ce que je vois le bug de mes propres yeux ? |
| 2 | **Observer** | Que disent l'erreur, les logs, les valeurs ? |
| 3 | **Hypothèse** | Quelle cause expliquerait **tout** ce que j'observe ? |
| 4 | **Isoler** | Où exactement le comportement devient-il faux ? |
| 5 | **Corriger** | Quel est le plus petit changement qui règle la cause ? |
| 6 | **Vérifier** | Le cas d'origine passe-t-il ? Rien d'autre n'est-il cassé ? |

## 1. Reproduire

Un bug qu'on ne sait pas reproduire ne se corrige pas : on ne saura jamais s'il est réglé.
Note les **données exactes** (quel utilisateur, quel panier, quelle date) et les **étapes**.

> **Astuce** : un test automatique qui échoue est la meilleure reproduction possible. Il
> rejoue le bug en une seconde, autant de fois que nécessaire. C'est exactement ce que font
> les tests des incidents de Rustine.

## 2. Observer, sans interpréter

Lis le message d'erreur **en entier**, puis regarde les valeurs réelles :

```js run
function remise(prix, code) {
  const taux = { BIENVENUE: 0.1, VIP: 0.2 }[code];
  return prix - prix * taux;
}

console.log(remise(100, "VIP"));
console.log(remise(100, "vip"));
```

Le second appel donne `NaN`. N'imagine pas encore pourquoi : observe d'abord. Affiche la
valeur intermédiaire suspecte.

```js run
const taux = { BIENVENUE: 0.1, VIP: 0.2 }["vip"];
console.log("taux =", taux);
```

## 3. Formuler une hypothèse

Une bonne hypothèse est **précise** et **vérifiable** : « le code promo est cherché en
respectant les majuscules, donc `"vip"` n'est pas trouvé, `taux` vaut `undefined`, et
`prix * undefined` donne `NaN`. »

Une mauvaise hypothèse est vague : « il y a un problème avec les remises ».

## 4. Isoler

Quand le programme est long, coupe-le en deux : la valeur est-elle déjà fausse au milieu ? Si
oui, le bug est avant ; sinon, il est après. Recommence. En quelques étapes, tu tiens la ligne
fautive. C'est le principe de la **recherche dichotomique**, celui de `git bisect`, que tu
verras dans le module « Terminal, Git et HTTP ».

## 5. Corriger la cause, pas le symptôme

```js run
function remise(prix, code) {
  const taux = { BIENVENUE: 0.1, VIP: 0.2 }[code.toUpperCase()] ?? 0;
  return prix - prix * taux;
}

console.log(remise(100, "vip"));
console.log(remise(100, "inconnu"));
```

Masquer le symptôme (« si le résultat est `NaN`, renvoyer `prix` ») cacherait le vrai problème.
Ici, on traite la cause (la casse du code) et le cas limite (un code inconnu).

## 6. Vérifier

Relance le cas d'origine, puis **tous** les tests : une correction qui casse autre chose n'est
pas une correction. Et demande-toi : « ce bug peut-il exister ailleurs ? »

> **À retenir** : reproduire, observer, supposer, isoler, corriger, vérifier. Et surtout, ne
> change qu'**une chose à la fois**, sinon tu ne sauras jamais ce qui a réglé le problème.

## Ce que tu sais faire maintenant

- Appliquer les six étapes du diagnostic à n'importe quel bug.
- Formuler une hypothèse précise et vérifiable.
- Isoler un bug en coupant le problème en deux.
- Corriger la cause plutôt que le symptôme, puis vérifier sans rien casser.
