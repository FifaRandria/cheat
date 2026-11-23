---
id: react-03
title: useEffect et la boucle de rendu infinie
minutes: 14
summary: Charger des données au bon moment, comprendre le tableau de dépendances, et éviter les boucles infinies.
check:
  - prompt: "Un `useEffect` sans tableau de dépendances s'exécute…"
    choices:
      - Une seule fois, au premier affichage
      - Après chaque rendu
      - Jamais
    answer: 1
  - prompt: "`useEffect(() => { setCompteur(compteur + 1); }, [compteur]);` provoque…"
    choices:
      - Un seul incrément
      - Une boucle infinie de rendus
      - Une erreur de syntaxe
    answer: 1
    explain: "L'effet modifie compteur, ce qui relance l'effet, qui modifie compteur…"
  - prompt: Pour charger des données une seule fois au montage, quel tableau de dépendances ?
    choices: ["aucun", "[]", "[donnees]"]
    answer: 1
---

## Les effets

Un composant React calcule ce qu'il faut afficher. Mais il doit parfois agir sur l'**extérieur** :
charger des données depuis une API, démarrer un minuteur, écouter le clavier. Ce sont des
**effets**, déclarés avec `useEffect` :

```js
import { useEffect, useState } from "react";

function Commandes() {
  const [commandes, setCommandes] = useState([]);

  useEffect(() => {
    fetch("/api/commandes")
      .then((r) => r.json())
      .then(setCommandes);
  }, []); // [] : seulement au premier affichage

  return <ul>{commandes.map((c) => <li key={c.id}>{c.total} €</li>)}</ul>;
}
```

## Le tableau de dépendances

Le second argument de `useEffect` dit **quand** relancer l'effet :

| Tableau | L'effet s'exécute |
|---|---|
| absent | après **chaque** rendu |
| `[]` | une seule fois, au premier affichage |
| `[id]` | au premier affichage, puis chaque fois que `id` change |

## La boucle infinie

Le bug classique : un effet qui **modifie** une valeur dont il **dépend**.

```js
useEffect(() => {
  setFiltres({ ...filtres, page: 1 }); // crée un nouvel objet à chaque fois
}, [filtres]); // … qui relance l'effet, qui crée un nouvel objet…
```

1. l'effet s'exécute et met à jour `filtres` ;
2. `filtres` a changé (nouvel objet), donc l'effet se relance ;
3. retour à l'étape 1. Pour toujours.

Symptômes : la page se fige, le ventilateur s'emballe, l'onglet Réseau montre la même requête
envoyée des centaines de fois par seconde.

> **À retenir** : un effet qui met à jour une valeur présente dans ses propres dépendances est
> presque toujours une boucle infinie. Demande-toi : « cet effet doit-il vraiment se relancer
> quand cette valeur change ? ».

Autre forme fréquente : un **objet ou un tableau créé pendant le rendu** et placé dans les
dépendances. Il est nouveau à chaque rendu, donc l'effet se relance à chaque fois.

```js
const options = { tri: "prix" };           // nouvel objet à chaque rendu
useEffect(() => { charger(options); }, [options]); // relancé à chaque rendu
```

Solution : dépendre de valeurs simples (`options.tri`), ou déclarer l'objet hors du composant.

## Les solutions

- dépendre du **minimum** : l'identifiant, pas l'objet entier ;
- ne pas recalculer dans un effet ce qui peut être **calculé pendant le rendu** ;
- utiliser la forme fonctionnelle : `setCompteur((c) => c + 1)`, qui évite de dépendre de
  `compteur`.

## Ce que tu sais faire maintenant

- Charger des données avec `useEffect`.
- Choisir le bon tableau de dépendances.
- Reconnaître et corriger une boucle de rendu infinie.
