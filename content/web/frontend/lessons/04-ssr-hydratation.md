---
id: react-04
title: Rendu serveur et erreurs d'hydratation
minutes: 13
summary: Ce que fait Next.js côté serveur, pourquoi l'hydratation échoue, et comment écrire un composant qui affiche la même chose des deux côtés.
check:
  - prompt: Qu'est-ce que l'hydratation ?
    choices:
      - Le moment où React, dans le navigateur, reprend la main sur le HTML généré par le serveur
      - Le chargement des images
      - La compression des fichiers
    answer: 0
  - prompt: "Un composant affiche `new Date().toLocaleTimeString()` directement dans son rendu. Que risque-t-on ?"
    choices:
      - Rien
      - Une erreur d'hydratation, car l'heure diffère entre le serveur et le navigateur
    answer: 1
  - prompt: "Où lire `window.innerWidth` ou `localStorage` sans erreur ?"
    choices:
      - Directement dans le rendu
      - Dans un useEffect, qui ne s'exécute que dans le navigateur
    answer: 1
---

## Le rendu côté serveur

Avec **Next.js**, une page React est d'abord calculée **sur le serveur** : il envoie au
navigateur du HTML déjà rempli. Avantages : la page s'affiche vite, même sur une connexion
lente, et les moteurs de recherche voient son contenu.

Ensuite, React se charge dans le navigateur et **reprend la main** sur ce HTML pour le rendre
interactif (boutons, formulaires). C'est l'**hydratation**.

## L'erreur d'hydratation

Pour hydrater, React recalcule le rendu dans le navigateur et le compare au HTML reçu. S'ils
**diffèrent**, c'est une **erreur d'hydratation** :

```output
Error: Hydration failed because the server rendered text didn't match the client.
```

Selon les cas, React refait tout le rendu (la page « clignote ») ou laisse un affichage
incohérent.

## Les causes classiques

Tout ce qui donne un résultat **différent** sur le serveur et dans le navigateur :

| Cause | Exemple |
|---|---|
| L'heure ou la date | `new Date().toLocaleTimeString()` |
| Le hasard | `Math.random()` pour un identifiant |
| Ce qui n'existe que dans le navigateur | `window`, `localStorage`, `navigator` |
| Le fuseau horaire ou la langue | formatage d'une date, serveur en UTC et navigateur en UTC+3 |
| HTML invalide | un `<div>` dans un `<p>` |

```js
function Horloge() {
  return <p>Il est {new Date().toLocaleTimeString()}</p>; // serveur ≠ navigateur
}
```

## La solution : un effet

Un `useEffect` ne s'exécute **que dans le navigateur**, après l'hydratation. On affiche donc
d'abord une valeur **identique** des deux côtés, puis on la remplace :

```js
function Horloge() {
  const [heure, setHeure] = useState(null);

  useEffect(() => {
    setHeure(new Date().toLocaleTimeString());
  }, []);

  return <p>Il est {heure ?? "…"}</p>;
}
```

Même principe pour `localStorage` ou la largeur de l'écran : on les lit dans un effet.

> **À retenir** : le premier rendu doit être **identique** sur le serveur et dans le
> navigateur. Tout ce qui dépend du navigateur, de l'heure ou du hasard se lit **après**, dans
> un `useEffect`.

> **Astuce** : pour des identifiants stables entre serveur et navigateur, React fournit
> `useId()`, à utiliser à la place de `Math.random()`.

## Ce que tu sais faire maintenant

- Expliquer le rendu serveur et l'hydratation.
- Reconnaître les causes d'une erreur d'hydratation.
- Déplacer dans un `useEffect` ce qui dépend du navigateur, de l'heure ou du hasard.
