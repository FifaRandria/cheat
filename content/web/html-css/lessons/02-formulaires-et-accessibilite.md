---
id: html-css-02
title: Formulaires, images, liens et accessibilité
minutes: 14
summary: Écrire des formulaires utilisables par tous, des images décrites et des liens explicites.
check:
  - prompt: Comment relier un label à son champ ?
    choices:
      - "Le placer juste avant le champ suffit"
      - "`<label for=\"email\">` et `<input id=\"email\">` : le for du label vaut l'id du champ"
      - "`<label name=\"email\">`"
    answer: 1
  - prompt: "Que doit contenir l'attribut alt d'une image purement décorative ?"
    choices:
      - "Rien : alt=\"\", pour que le lecteur d'écran l'ignore"
      - "Le nom du fichier"
      - "Le mot « image »"
    answer: 0
  - prompt: Pourquoi un bouton doit-il être un vrai button, et pas une div cliquable ?
    choices:
      - C'est plus joli
      - "Un button est atteignable au clavier, s'active avec Entrée, et est annoncé comme bouton"
      - Il n'y a aucune différence
    answer: 1
---

## L'accessibilité, c'est pour tout le monde

En France, environ une personne sur cinq vit avec un handicap. Certaines naviguent **au
clavier**, d'autres avec un **lecteur d'écran** qui lit la page à voix haute, d'autres
zooment fortement. Pour elles, une page mal écrite est tout simplement inutilisable.

Bonne nouvelle : 80 % de l'accessibilité vient de **HTML bien choisi**, sans effort
supplémentaire. Et c'est une obligation légale pour de nombreux sites.

## Un formulaire bien construit

```html
<form action="/inscription" method="post">
  <label for="email">Adresse e-mail</label>
  <input id="email" name="email" type="email" required>

  <label for="mdp">Mot de passe</label>
  <input id="mdp" name="motdepasse" type="password" required minlength="8">

  <button type="submit">Créer mon compte</button>
</form>
```

| Détail | Ce qu'il apporte |
|---|---|
| `<label for="email">` relié à `id="email"` | cliquer sur le texte active le champ ; le lecteur d'écran annonce « Adresse e-mail » |
| `name="email"` | le nom sous lequel la valeur est **envoyée au serveur** |
| `type="email"` | clavier adapté sur mobile, vérification du format |
| `type="password"` | les caractères sont masqués |
| `required`, `minlength` | le navigateur bloque l'envoi d'un champ vide ou trop court |
| `<button type="submit">` | envoie le formulaire, au clic **et** avec la touche Entrée |

> **Attention** : `id` et `name` sont deux choses différentes. `id` sert au `label` (et au CSS) ;
> `name` sert au serveur. Changer un `name` casse le backend qui l'attend.

Une autre façon valable de relier un label : mettre le champ **dans** le label.

```html
<label>Nom <input name="nom" required></label>
```

## Le faux bouton

```html
<div class="bouton" onclick="envoyer()">Envoyer</div>
```

Il ressemble à un bouton, mais : impossible à atteindre avec la touche Tab, ne réagit pas à
Entrée, et le lecteur d'écran l'annonce comme du texte. Un `<button>` fait tout cela
gratuitement.

## Les images : l'attribut alt

`alt` est le texte qui **remplace** l'image quand on ne la voit pas : lecteur d'écran, image qui
ne charge pas, moteur de recherche.

```html
<img src="graphique-ventes.png" alt="Les ventes ont doublé entre janvier et juin">
<img src="vague-deco.svg" alt="">
```

- Une image **informative** : `alt` décrit l'information, pas l'image (« graphique » n'aide
  personne, « les ventes ont doublé » oui).
- Une image **décorative** : `alt=""`, vide mais présent. Le lecteur d'écran la saute.
- Sans attribut `alt` du tout, le lecteur d'écran lit… le nom du fichier.

## Des liens qui ont du sens

Les lecteurs d'écran permettent de lister tous les liens d'une page. Imagine la liste :
« cliquez ici, cliquez ici, en savoir plus ». Inutile.

```html
<!-- Mauvais -->
Pour nos tarifs, <a href="/tarifs">cliquez ici</a>.

<!-- Bon -->
Consulte <a href="/tarifs">nos tarifs</a>.
```

> **À retenir** : chaque champ a son label, chaque image son alt, chaque bouton est un
> `<button>`, chaque lien dit où il mène. Avec ces quatre règles, tu évites la majorité des
> problèmes d'accessibilité.

## Ce que tu sais faire maintenant

- Construire un formulaire avec labels, types de champs et validation.
- Distinguer `id` (label, CSS) et `name` (serveur).
- Écrire un `alt` utile, ou vide pour une image décorative.
- Remplacer les faux boutons et les liens « cliquez ici ».
