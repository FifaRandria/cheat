---
id: navigateur-02
title: Réagir aux actions de l'utilisateur
minutes: 14
summary: Écouter les clics, la saisie et l'envoi des formulaires, et le piège du formulaire qui recharge la page.
check:
  - prompt: "Que fait `bouton.addEventListener(\"click\", ajouter())` ?"
    choices:
      - "Il appelle ajouter à chaque clic"
      - "Il appelle ajouter UNE fois, tout de suite, et passe son résultat (souvent undefined) comme écouteur"
    answer: 1
  - prompt: Pourquoi appeler event.preventDefault() dans un écouteur submit ?
    choices:
      - "Pour empêcher le navigateur de recharger la page (son comportement par défaut), et traiter le formulaire en JavaScript"
      - Pour empêcher l'utilisateur de cliquer deux fois
    answer: 0
  - prompt: "Dans un écouteur, que contient `event.target` ?"
    choices:
      - "L'élément sur lequel l'action a eu lieu (par exemple le bouton cliqué)"
      - Toujours le document
    answer: 0
---

## Écouter un événement

Une page interactive **attend** : un clic, une touche, un envoi de formulaire. On lui dit quoi
faire avec `addEventListener` :

```js
const bouton = document.querySelector("#ajouter");
let quantite = 0;

bouton.addEventListener("click", () => {
  quantite += 1;
  document.querySelector("#quantite").textContent = String(quantite);
});
```

Tu reconnais le **callback** du module « JavaScript asynchrone » : une fonction donnée
maintenant, appelée plus tard.

## Le piège des parenthèses

```js
bouton.addEventListener("click", ajouter);     // juste : on DONNE la fonction
bouton.addEventListener("click", ajouter());   // faux : on l'APPELLE tout de suite
```

Avec les parenthèses, `ajouter` s'exécute une seule fois au chargement, et c'est son **résultat**
(souvent `undefined`) qui est donné comme écouteur. Le bouton ne fait plus rien.

> **Attention** : le nom de l'événement est `"click"`, pas `"onclick"`. Avec `"onclick"`,
> aucune erreur, et aucun effet : l'écouteur attend un événement qui n'existe pas.

## Les événements utiles

| Événement | Quand | Sur |
|---|---|---|
| `click` | un clic (ou Entrée sur un bouton) | boutons, liens, n'importe quel élément |
| `input` | à chaque caractère tapé | `input`, `textarea` |
| `change` | quand la valeur est validée | `select`, cases à cocher |
| `submit` | quand le formulaire est envoyé | `form` |
| `keydown` | une touche enfoncée | la page, un champ |

## Le formulaire qui recharge la page

```js
const formulaire = document.querySelector("#inscription");

formulaire.addEventListener("submit", (event) => {
  event.preventDefault();                     // pas de rechargement
  const email = formulaire.querySelector("#email").value.trim();
  envoyer(email);
});
```

Par défaut, envoyer un formulaire **recharge la page** (c'est le fonctionnement historique du
web). Si ton code veut traiter l'envoi lui-même, il doit l'empêcher avec
`event.preventDefault()`. Sinon le traitement démarre… et la page disparaît.

> **Astuce** : écoute `submit` sur le **formulaire**, pas `click` sur le bouton. Ainsi la touche
> Entrée dans un champ fonctionne aussi, comme le veut l'accessibilité vue dans le module HTML.

Lis aussi la valeur **au moment de l'envoi**, dans l'écouteur, pas au chargement de la page :
au chargement, le champ est encore vide.

## event.target et la délégation

```js
document.querySelector("#outils").addEventListener("click", (event) => {
  const bouton = event.target.closest("button[data-id]");
  if (!bouton) return;                       // clic ailleurs dans la liste
  emprunter(Number(bouton.dataset.id));
});
```

Un événement **remonte** de l'élément cliqué jusqu'au document (*bubbling*). Un seul écouteur
sur la liste suffit donc pour tous ses boutons, même ceux ajoutés plus tard. `event.target` est
l'élément réellement cliqué, et `data-id` (lu avec `dataset.id`) transporte l'identifiant.

## Ce que tu sais faire maintenant

- Écouter un clic, une saisie, un envoi de formulaire.
- Éviter les pièges des parenthèses et de `"onclick"`.
- Empêcher le rechargement de la page avec `preventDefault`.
- Utiliser `event.target` et la délégation pour une liste de boutons.
