---
id: js-async-03
title: Attendre plusieurs promesses
minutes: 12
summary: Lancer plusieurs opérations en parallèle, les attendre toutes, et décider de ce qui se passe si l'une échoue.
check:
  - prompt: "`users.forEach(async (u) => { await envoyer(u); })` : quand la ligne suivante s'exécute-t-elle ?"
    choices:
      - Après tous les envois
      - Immédiatement, sans attendre les envois
      - Jamais
    answer: 1
    explain: "forEach ignore les promesses renvoyées par son callback : personne ne les attend."
  - prompt: "Promise.all reçoit trois promesses, la deuxième échoue. Que se passe-t-il ?"
    choices:
      - On obtient les deux résultats qui ont réussi
      - "Promise.all rejette immédiatement, et les autres résultats sont perdus"
      - Il réessaie la deuxième
    answer: 1
  - prompt: "Quelle fonction attend tout et décrit le sort de chaque promesse, sans jamais rejeter ?"
    choices: ["Promise.all", "Promise.allSettled", "Promise.race"]
    answer: 1
---

## L'un après l'autre, ou tous en même temps ?

Tu dois envoyer trois e-mails, chacun prend une seconde.

- **L'un après l'autre** : 3 secondes au total.
- **En parallèle** : 1 seconde, car les trois partent en même temps.

## L'un après l'autre : `for...of` avec `await`

```js run
const attendre = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function envoyer(email) {
  await attendre(300);
  console.log("envoyé à", email);
}

async function main() {
  const debut = Date.now();
  for (const email of ["ada@ex.com", "bob@ex.com", "eve@ex.com"]) {
    await envoyer(email);
  }
  console.log(`Terminé en ${Date.now() - debut} ms`);
}

main();
```

Chaque tour **attend** la fin de l'envoi avant de passer au suivant.

## Le piège : `forEach` avec `async`

On pourrait croire que ceci fait la même chose :

```js run
const attendre = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  let envoyes = 0;

  ["ada@ex.com", "bob@ex.com"].forEach(async (email) => {
    await attendre(300);
    envoyes++;
    console.log("envoyé à", email);
  });

  console.log("Total envoyés :", envoyes); // 0 !
}

main();
```

`forEach` appelle le callback pour chaque élément, mais **ignore** la promesse qu'il renvoie.
Personne n'attend les envois : `main` affiche `0` et termine, puis les e-mails partent après.

> **À retenir** : `forEach`, avec un callback `async`, n'attend rien. Utilise `for...of` avec
> `await` (l'un après l'autre) ou `Promise.all` (en parallèle).

## En parallèle : `Promise.all`

`Promise.all` reçoit un **tableau de promesses** et renvoie une promesse tenue quand **toutes**
le sont, avec le tableau des résultats, dans le même ordre :

```js run
const attendre = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function prix(produit) {
  await attendre(300);
  return { produit, prix: produit.length * 10 };
}

async function main() {
  const debut = Date.now();
  const resultats = await Promise.all([prix("clavier"), prix("souris"), prix("écran")]);
  console.log(resultats);
  console.log(`Terminé en ${Date.now() - debut} ms`); // ~300 ms, pas 900
}

main();
```

Avec `map`, on transforme une liste en liste de promesses :

```js
await Promise.all(emails.map((email) => envoyer(email)));
```

## Et si l'une échoue ?

`Promise.all` est **tout ou rien** : si une seule promesse est rejetée, `Promise.all` rejette
**immédiatement**, et les autres résultats sont perdus.

```js run
const ok = async (v) => v;
const ko = async () => { throw new Error("service boursier en panne"); };

async function main() {
  try {
    const r = await Promise.all([ok("météo"), ko(), ok("actualités")]);
    console.log(r);
  } catch (e) {
    console.log("Tout est perdu :", e.message);
  }
}

main();
```

C'est parfait quand tout doit réussir ensemble (un paiement et sa facture). C'est un désastre
pour un tableau de bord dont les widgets sont **indépendants**.

## `Promise.allSettled` : chacun son sort

`Promise.allSettled` attend **toutes** les promesses et ne rejette **jamais**. Il décrit le
résultat de chacune :

```js run
const ok = async (v) => v;
const ko = async () => { throw new Error("service boursier en panne"); };

async function main() {
  const resultats = await Promise.allSettled([ok("météo"), ko(), ok("actualités")]);

  for (const r of resultats) {
    if (r.status === "fulfilled") {
      console.log("✔", r.value);
    } else {
      console.log("✘", r.reason.message);
    }
  }
}

main();
```

> **À retenir** : avant d'écrire `Promise.all`, pose-toi la question : « si une seule de ces
> opérations échoue, est-ce que **tout** doit échouer ? ». Si non, utilise `Promise.allSettled`.

## Ce que tu sais faire maintenant

- Enchaîner des opérations avec `for...of` et `await`.
- Expliquer pourquoi `forEach` avec `async` n'attend rien.
- Lancer des opérations en parallèle avec `Promise.all`.
- Choisir entre `Promise.all` (tout ou rien) et `Promise.allSettled` (chacun son sort).
