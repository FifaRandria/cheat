---
id: typescript-03
title: "null, any et as : les trous dans la coque"
minutes: 14
summary: Le mode strict, les trois façons de désactiver TypeScript sans s'en rendre compte, et comment valider les données qui viennent de l'extérieur.
check:
  - prompt: "Que vérifie TypeScript sur une variable de type `any` ?"
    choices:
      - Tout, comme d'habitude
      - "Rien : any désactive toute vérification, et se propage aux valeurs qui en dérivent"
    answer: 1
  - prompt: "`const profil = (await res.json()) as Profil;` vérifie-t-il que la réponse a la forme d'un Profil ?"
    choices:
      - Oui, à l'exécution
      - "Non : as dit au compilateur « crois-moi », sans aucune vérification"
    answer: 1
  - prompt: "Quel type donner à une donnée dont on ignore encore la forme ?"
    choices:
      - "`any`"
      - "`unknown` : il oblige à vérifier la forme avant de l'utiliser"
    answer: 1
---

## Le mode strict

Le fichier `tsconfig.json` d'un projet contient presque toujours :

```json
{ "compilerOptions": { "strict": true } }
```

En mode strict, `null` et `undefined` ne sont plus acceptés partout. Une fonction qui peut ne
rien trouver le dit dans son type, et l'appelant **doit** traiter le cas :

```ts
function trouverClient(id: number): Client | undefined { … }

const c = trouverClient(42);
c.nom;            // error TS18048: 'c' is possibly 'undefined'.
c?.nom;           // OK : undefined si le client n'existe pas
c?.nom ?? "Anonyme";
```

C'est la famille « valeur absente », éliminée à la compilation.

## Trou n°1 : any

```ts
function traiter(donnees: any) {
  return donnees.client.adresse.ville.toUpperCase();   // aucune erreur signalée
}
```

`any` désactive **toute** vérification, et contamine ce qui en découle. Un projet plein de
`any` n'a de TypeScript que le nom.

## Trou n°2 : as

```ts
const profil = (await reponse.json()) as Profil;
profil.adresse.ville;   // compile… et plante si l'API n'a pas renvoyé d'adresse
```

`as` est une **affirmation** : « crois-moi, c'est un Profil ». Le compilateur te croit, et
rien n'est vérifié à l'exécution.

## Trou n°3 : // @ts-ignore

Ce commentaire fait taire l'erreur de la ligne suivante. Il cache le bug au lieu de le
corriger. À n'utiliser qu'avec une explication, et le moins possible.

## La bonne méthode : unknown et une garde de type

Pour une donnée externe, on part de `unknown` (« je ne sais pas encore ce que c'est »), et on
**vérifie** sa forme avec une fonction de garde :

```ts
interface Profil {
  nom: string;
  email: string;
}

function estProfil(x: unknown): x is Profil {
  return (
    typeof x === "object" && x !== null &&
    typeof (x as Record<string, unknown>).nom === "string" &&
    typeof (x as Record<string, unknown>).email === "string"
  );
}

const donnees: unknown = await reponse.json();
if (!estProfil(donnees)) throw new Error("Réponse inattendue de l'API");
donnees.nom;   // ici, donnees est un Profil : vérifié pour de vrai
```

Le type de retour `x is Profil` dit au compilateur : « si cette fonction renvoie vrai, `x` est
un Profil ». La vérification a lieu **à l'exécution**, et le typage suit. Dans un vrai projet,
une bibliothèque comme **zod** écrit ces gardes pour toi.

> **À retenir** : aux frontières de l'application (requêtes, fichiers, API externes), les types
> ne prouvent rien. On valide, puis on fait confiance au type.

## Ce que tu sais faire maintenant

- Traiter les valeurs possiblement absentes en mode strict, avec `?.` et `??`.
- Reconnaître `any`, `as` et `@ts-ignore` comme des trous dans la vérification.
- Valider une donnée externe avec `unknown` et une garde de type.
