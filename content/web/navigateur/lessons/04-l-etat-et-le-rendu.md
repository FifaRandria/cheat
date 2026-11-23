---
id: navigateur-04
title: Organiser une interface, l'état et le rendu
minutes: 13
summary: Une seule source de vérité, une fonction qui redessine, et pourquoi c'est exactement l'idée de React.
check:
  - prompt: L'utilisateur filtre la liste, puis un outil est emprunté. La liste affiche à nouveau tous les outils. Cause probable ?
    choices:
      - "Le filtre n'était stocké que dans l'affichage : au rendu suivant, il a été perdu. Il doit faire partie de l'état"
      - Un bug du navigateur
    answer: 0
  - prompt: Quel est le lien avec React ?
    choices:
      - Aucun
      - "React applique la même idée : l'interface est une fonction de l'état, et chaque changement d'état redessine"
    answer: 1
---

## Le code spaghetti

Quand une page grandit, on finit souvent par modifier le DOM un peu partout : un écouteur
ajoute une ligne, un autre change un compteur, un troisième cache un bouton. Au bout de
quelques semaines, personne ne sait plus pourquoi l'écran affiche ce qu'il affiche.

## Une seule source de vérité

La solution : garder toutes les données de l'interface dans **un objet**, l'**état**, et
écrire **une** fonction qui dessine la page à partir de lui.

```js
const etat = {
  outils: [],
  filtre: "",
  chargement: false,
  erreur: null,
};

function afficher(document, etat) {
  const liste = document.querySelector("#outils");
  liste.replaceChildren();
  const visibles = etat.outils.filter((o) => o.nom.toLowerCase().includes(etat.filtre.toLowerCase()));
  for (const outil of visibles) {
    const li = document.createElement("li");
    li.textContent = outil.nom;
    liste.appendChild(li);
  }
  document.querySelector("#etat").textContent = etat.chargement ? "Chargement…" : etat.erreur ?? "";
}
```

Chaque action suit alors le même chemin :

1. un événement arrive (saisie, clic, réponse d'API) ;
2. on **modifie l'état** ;
3. on appelle **`afficher`**.

```js
champFiltre.addEventListener("input", (event) => {
  etat.filtre = event.target.value;
  afficher(document, etat);
});
```

> **À retenir** : l'écran est une **conséquence** de l'état, jamais une source d'information.
> Si une donnée compte (le filtre, la page courante, l'utilisateur connecté), elle est dans
> l'état.

## C'est exactement React

Dans le module « Frontend avec React », un composant est une fonction qui reçoit des données
et renvoie ce qu'il faut afficher ; `useState` stocke l'état, et React redessine quand il
change. Tu viens d'écrire la même idée à la main.

| Ici, à la main | En React |
|---|---|
| l'objet `etat` | `useState` |
| `afficher(document, etat)` | le composant qui renvoie du JSX |
| appeler `afficher` après chaque changement | automatique quand on appelle `setEtat` |
| `replaceChildren` puis tout recréer | React ne modifie que ce qui a changé |

Comprendre la version manuelle rend React beaucoup moins magique, et aide à déboguer ses
erreurs (comme la boucle de rendu infinie du module React).

## Ce que tu sais faire maintenant

- Regrouper les données d'une interface dans un état unique.
- Écrire une fonction de rendu qui redessine à partir de l'état.
- Faire passer chaque action par « modifier l'état, puis afficher ».
- Relier cette organisation à React.
