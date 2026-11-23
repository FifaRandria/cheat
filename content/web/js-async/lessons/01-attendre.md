---
id: js-async-01
title: Pourquoi attendre ? L'asynchrone
minutes: 10
summary: Certaines opérations prennent du temps. JavaScript ne les attend pas, et c'est ce qui rend l'ordre d'exécution surprenant.
check:
  - prompt: "Dans quel ordre s'affichent les lettres ?\n\n```js\nconsole.log(\"A\");\nsetTimeout(() => console.log(\"B\"), 0);\nconsole.log(\"C\");\n```"
    choices: ["A, B, C", "A, C, B", "B, A, C"]
    answer: 1
    explain: "Même avec un délai de 0, le callback de setTimeout passe après tout le code en cours : A, C, puis B."
  - prompt: Pourquoi JavaScript n'attend-il pas la fin d'une requête réseau avant de continuer ?
    choices:
      - Pour ne pas figer la page pendant l'attente
      - Parce qu'il est trop lent
      - C'est un bug du langage
    answer: 0
---

## Le serveur du restaurant

Imagine un serveur de restaurant. Il prend ta commande, la transmet en cuisine… et
**n'attend pas** devant le four que ton plat soit prêt. Il va prendre d'autres commandes.
Quand le plat est prêt, la cuisine l'appelle et il te l'apporte.

JavaScript fonctionne ainsi. Il exécute ton code **ligne après ligne**, mais certaines opérations
prennent du temps :

- interroger une base de données ;
- appeler une API sur Internet ;
- lire un fichier ;
- attendre un délai.

Pour ces opérations **asynchrones**, JavaScript lance la demande, **continue** le reste du code,
et revient s'en occuper quand le résultat arrive. Sinon, la page entière se figerait à chaque
requête.

> **Déjà vu** : le module « JavaScript dans le navigateur » s'appuie sur ce chapitre : chaque
> clic, chaque saisie et chaque `fetch` est asynchrone.

## Voir l'asynchrone en action

`setTimeout(fonction, délai)` exécute une fonction **plus tard**, après un délai en millisecondes :

```js run
console.log("1. Je commande");

setTimeout(() => {
  console.log("3. Le plat arrive");
}, 1000);

console.log("2. Je discute en attendant");
```

L'ordre affiché n'est **pas** l'ordre des lignes. C'est la clé de tout ce module.

Même avec un délai de `0`, la fonction passe **après** le code en cours :

```js run
console.log("A");
setTimeout(() => console.log("B"), 0);
console.log("C");
```

## Le problème : utiliser un résultat qui n'est pas encore là

```js run
let meteo = "inconnue";

setTimeout(() => {
  meteo = "ensoleillé";
}, 500);

console.log("Aujourd'hui :", meteo); // trop tôt !
```

On affiche `meteo` **avant** que la réponse n'arrive. C'est exactement la famille de bugs de
ce module : du code qui lit une valeur **avant qu'elle n'existe**.

> **À retenir** : avec de l'asynchrone, l'ordre des lignes dans le fichier n'est pas l'ordre
> d'exécution. Quand une valeur est vide ou `undefined` « alors qu'elle devrait exister »,
> demande-toi si tu la lis trop tôt.

## Les callbacks

La fonction passée à `setTimeout` s'appelle un **callback** (« rappel ») : une fonction qu'on
donne à quelqu'un pour qu'il **nous rappelle** quand c'est prêt.

```js run
function commanderPlat(nom, quandPret) {
  console.log(`Commande de ${nom} envoyée en cuisine`);
  setTimeout(() => quandPret(`${nom} chaud`), 800);
}

commanderPlat("pizza", (plat) => {
  console.log("Servi :", plat);
});

console.log("Le serveur prend d'autres commandes...");
```

Les callbacks fonctionnent, mais quand on enchaîne plusieurs étapes, on obtient des callbacks
dans des callbacks dans des callbacks. C'est illisible. La leçon suivante présente la solution
moderne : les **promesses** et `async`/`await`.

## Ce que tu sais faire maintenant

- Expliquer pourquoi JavaScript n'attend pas les opérations lentes.
- Prévoir l'ordre d'affichage d'un code avec `setTimeout`.
- Reconnaître le bug « valeur lue trop tôt ».
- Dire ce qu'est un callback.
