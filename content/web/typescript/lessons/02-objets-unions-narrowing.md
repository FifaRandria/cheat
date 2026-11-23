---
id: typescript-02
title: Types d'objets, unions et rétrécissement
minutes: 14
summary: Décrire la forme des objets, modéliser des alternatives avec des unions, et laisser TypeScript vérifier que tous les cas sont traités.
check:
  - prompt: "Que signifie `email?: string` dans une interface ?"
    choices:
      - "Le champ est facultatif : il vaut une chaîne ou undefined"
      - Le champ peut être de n'importe quel type
    answer: 0
  - prompt: "À quoi sert la ligne `const impossible: never = p;` dans le `default` d'un switch ?"
    choices:
      - À rien
      - "À obtenir une erreur de compilation si un cas de l'union n'est pas traité"
    answer: 1
---

## Décrire la forme d'un objet

```ts
interface Produit {
  id: number;
  nom: string;
  prix: number;
  description?: string;        // facultatif : string ou undefined
  readonly reference: string;  // lecture seule après création
}
```

On peut aussi écrire `type Produit = { … }`. Les deux se valent pour décrire un objet.

## Les unions : « ceci ou cela »

```ts
type Statut = "brouillon" | "publie" | "archive";

let statut: Statut = "publie";
statut = "supprime";   // error TS2322: Type '"supprime"' is not assignable to type 'Statut'.
```

Une faute de frappe dans un statut, invisible en JavaScript, devient une erreur de compilation.

## Les unions discriminées

Pour des objets de formes différentes, on ajoute un champ commun, le **discriminant** :

```ts
type Paiement =
  | { type: "carte"; derniersChiffres: string }
  | { type: "virement"; iban: string }
  | { type: "especes" };
```

## Le rétrécissement (narrowing)

En testant le discriminant, TypeScript **rétrécit** le type dans chaque branche :

```ts
function libelle(p: Paiement): string {
  switch (p.type) {
    case "carte":
      return `Carte •••• ${p.derniersChiffres}`;   // ici, p est une carte
    case "virement":
      return `Virement depuis ${p.iban.slice(0, 4)}…`;
    case "especes":
      return "Espèces";
    default: {
      const impossible: never = p;
      throw new Error(`Moyen de paiement inconnu : ${JSON.stringify(impossible)}`);
    }
  }
}
```

La ligne `const impossible: never = p` est une **vérification d'exhaustivité**. Si un
développeur ajoute `{ type: "cheque" }` à l'union sans le traiter, `p` n'est plus « rien » dans
le `default`, et le compilateur refuse :

```output
error TS2322: Type '{ type: "cheque"; }' is not assignable to type 'never'.
```

Et à l'exécution, si une donnée inattendue arrive malgré tout (depuis une API), le `throw`
donne une erreur claire au lieu d'un `undefined` silencieux.

> **Astuce** : les autres formes de rétrécissement sont `typeof x === "string"`, `"champ" in x`,
> `x instanceof Date` et `if (x !== null)`.

## Ce que tu sais faire maintenant

- Décrire un objet avec une interface, des champs facultatifs et en lecture seule.
- Limiter une valeur à quelques possibilités avec une union de littéraux.
- Modéliser des alternatives avec une union discriminée.
- Garantir que tous les cas d'un switch sont traités grâce à `never`.
