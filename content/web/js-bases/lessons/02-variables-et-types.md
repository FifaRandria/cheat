---
id: js-bases-02
title: Variables et types
minutes: 12
summary: Ranger des valeurs dans des boîtes nommées, choisir entre let et const, et reconnaître nombres, textes et booléens.
check:
  - prompt: "Que se passe-t-il avec ce code ?\n\n```js\nconst score = 10;\nscore = 15;\n```"
    choices:
      - score vaut 15
      - "Une erreur : on ne peut pas réassigner une constante"
      - score vaut 25
    answer: 1
    explain: "`const` crée une boîte scellée. Pour une valeur qui change, il faut `let`."
  - prompt: "Que vaut `\"5\" + 3` en JavaScript ?"
    choices:
      - "8"
      - "\"53\""
      - Une erreur
    answer: 1
    explain: Dès qu'un des deux côtés est un texte, `+` colle les textes au lieu d'additionner.
  - prompt: Quel type a la valeur `true` ?
    choices:
      - string
      - number
      - boolean
    answer: 2
---

## Une variable, c'est une boîte avec une étiquette

Un programme a besoin de **retenir** des choses : le nom de l'utilisateur, le total du panier,
le nombre de vies restantes. On les range dans des **variables**.

Imagine une boîte avec une étiquette :

- l'**étiquette**, c'est le nom de la variable (`prenom`) ;
- le **contenu**, c'est sa valeur (`"Ada"`).

```js run
let prenom = "Ada";
let age = 36;

console.log(prenom);
console.log(age);
```

On **crée** la boîte avec `let`, on lui donne un nom, puis on y range une valeur avec `=`.

## Changer le contenu de la boîte

Avec `let`, on peut remplacer le contenu plus tard :

```js run
let vies = 3;
console.log("Vies au départ :", vies);

vies = vies - 1; // on perd une vie
console.log("Après un coup :", vies);
```

Lis `vies = vies - 1` de **droite à gauche** : « prends la valeur actuelle de `vies`, enlève 1,
et range le résultat dans `vies` ». Le `=` ne veut pas dire « est égal », il veut dire
**« range dans »**.

## `const` : une boîte scellée

`const` crée une variable qu'on ne peut **plus réassigner** :

```js run
const tauxTVA = 0.2;
console.log(tauxTVA);

tauxTVA = 0.1; // essaie de changer la valeur...
```

Résultat :

```output
TypeError: Assignment to constant variable.
```

> **À retenir** : utilise `const` par défaut. Passe à `let` seulement si la valeur doit
> changer (un compteur, un total qui s'accumule). Si tu vois `Assignment to constant variable`,
> une valeur que tu voulais modifier a été déclarée avec `const`.

## Les types de valeurs

Toutes les valeurs ne sont pas de la même nature. Les trois types que tu croiseras partout :

| Type | Exemples | Sert à |
|---|---|---|
| `number` | `42`, `3.14`, `-7` | compter, calculer |
| `string` | `"Bonjour"`, `'Ada'` | du texte, toujours entre guillemets |
| `boolean` | `true`, `false` | oui ou non |

Et deux valeurs spéciales qui signifient « rien » :

- `undefined` : la boîte existe mais on n'y a **jamais rien mis** ;
- `null` : on y a mis « rien » **exprès**.

`typeof` te dit le type d'une valeur :

```js run
console.log(typeof 42);
console.log(typeof "42");
console.log(typeof true);

let pasEncoreRempli;
console.log(pasEncoreRempli, typeof pasEncoreRempli);
```

Remarque : `42` et `"42"` ne sont **pas** la même chose. L'un est un nombre, l'autre un texte
qui contient des chiffres.

## Assembler du texte

Pour coller des textes, on peut utiliser `+` :

```js run
const prenom = "Ada";
console.log("Bonjour " + prenom + " !");
```

Mais il existe plus lisible : les **gabarits**, avec des accents graves `` ` `` et `${...}` :

```js run
const prenom = "Ada";
const age = 36;
console.log(`Bonjour ${prenom}, tu as ${age} ans.`);
```

Tout ce qui est dans `${...}` est remplacé par sa valeur.

## Le piège du `+`

`+` additionne les nombres, mais **colle** les textes. Et si on mélange les deux, le texte gagne :

```js run
console.log(5 + 3);     // 8
console.log("5" + 3);   // "53" !
console.log(Number("5") + 3); // 8 : on a converti le texte en nombre
```

> **Attention** : les valeurs qui viennent d'un formulaire sont **toujours des textes**, même si
> l'utilisateur a tapé des chiffres. Convertis-les avec `Number(...)` avant de calculer.

## Ce que tu sais faire maintenant

- Créer une variable avec `let` (modifiable) ou `const` (scellée).
- Lire `x = x + 1` comme « range dans `x` la valeur de `x` plus 1 ».
- Distinguer `number`, `string`, `boolean`, `undefined` et `null`.
- Construire un texte avec `` `Bonjour ${prenom}` ``.
