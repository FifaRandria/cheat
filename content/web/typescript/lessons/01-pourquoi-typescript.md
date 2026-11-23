---
id: typescript-01
title: Pourquoi TypeScript ?
minutes: 12
summary: Des annotations de type qui attrapent une famille entière de bugs avant même d'exécuter le code.
check:
  - prompt: Quand TypeScript détecte-t-il une erreur de type ?
    choices:
      - Pendant l'exécution, comme JavaScript
      - "Avant l'exécution, quand le compilateur (tsc) ou l'éditeur analyse le code"
    answer: 1
  - prompt: Que deviennent les types à l'exécution ?
    choices:
      - "Ils disparaissent : le code exécuté est du JavaScript, sans aucune vérification de type"
      - Ils vérifient chaque valeur pendant l'exécution
    answer: 0
  - prompt: "Faut-il annoter `const total = 0;` ?"
    choices:
      - "Oui, toujours : `const total: number = 0;`"
      - "Non : TypeScript déduit (infère) le type number tout seul"
    answer: 1
---

## Les bugs que tu as déjà réparés

Repense aux niveaux de JavaScript : une propriété mal orthographiée (`client.premuim`), une
fonction appelée avec un texte au lieu d'un nombre, un `undefined` qui se propage… Tous ont
un point commun : JavaScript ne les signale **qu'à l'exécution**, parfois loin de la cause, et
parfois jamais (le résultat est juste faux).

**TypeScript** est du JavaScript avec des **types**. Un programme, le compilateur `tsc`,
vérifie le code **avant** de l'exécuter, et l'éditeur souligne l'erreur pendant que tu tapes.

```ts
interface Client {
  nom: string;
  premium: boolean;
}

function remise(client: Client): number {
  return client.premuim ? 0.1 : 0;
}
```

```output
error TS2551: Property 'premuim' does not exist on type 'Client'. Did you mean 'premium'?
```

Le bug est trouvé avant d'avoir lancé le moindre test.

## Annoter, et laisser déduire

```ts
function prixTTC(prixHT: number, taux: number): number {
  return prixHT * (1 + taux);
}

const total = prixTTC(100, 0.2);   // total : number, déduit tout seul
prixTTC("100", 0.2);               // error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
```

- On annote les **paramètres** des fonctions et ce qu'elles **renvoient**.
- Pour les variables, TypeScript **infère** le type à partir de la valeur : inutile de
  l'écrire.

## Les types disparaissent à l'exécution

C'est le point le plus important, et le plus mal compris :

```ts
function double(x: number): number {
  return x * 2;
}
```

devient, une fois compilé ou exécuté :

```js
function double(x) {
  return x * 2;
}
```

Les types sont **effacés**. Node 22 sait d'ailleurs exécuter un fichier `.ts` directement, en
supprimant simplement les types. Conséquence : TypeScript protège ton code contre **ton
propre code**, mais il ne vérifie **rien** de ce qui arrive de l'extérieur (une requête HTTP,
un fichier JSON, une base de données). Pour ces données-là, il faut toujours une
**validation à l'exécution**, que tu verras dans la troisième leçon.

> **À retenir** : TypeScript vérifie avant l'exécution, puis disparaît. Il élimine une famille
> entière de bugs (fautes de frappe, mauvais types, oublis de cas), mais il ne remplace ni les
> tests ni la validation des données externes.

## Ce que tu sais faire maintenant

- Expliquer ce que TypeScript vérifie, et à quel moment.
- Annoter les paramètres et le retour d'une fonction, et laisser inférer le reste.
- Savoir que les types disparaissent à l'exécution.
