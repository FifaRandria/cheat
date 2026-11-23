---
id: html-css-01
title: La structure d'une page HTML
minutes: 14
summary: Balises, attributs, imbrication, et les balises sémantiques qui donnent du sens à une page.
check:
  - prompt: À quoi sert le HTML ?
    choices:
      - À décrire le contenu et la structure d'une page (titres, paragraphes, liens…)
      - À choisir les couleurs et la mise en page
      - À rendre la page interactive
    answer: 0
    explain: "Le HTML décrit le contenu, le CSS son apparence, le JavaScript son comportement."
  - prompt: Combien de balises h1 une page devrait-elle avoir ?
    choices:
      - Autant que de sections
      - Une seule, pour le titre principal de la page
      - Aucune, on utilise des div
    answer: 1
  - prompt: "Quelle balise entoure le contenu principal, unique, de la page ?"
    choices:
      - "`<div id=\"principal\">`"
      - "`<main>`"
      - "`<section>`"
    answer: 1
---

## Trois langages, trois rôles

Une page web est faite de trois couches :

| Langage | Rôle | Analogie |
|---|---|---|
| **HTML** | le contenu et sa structure | les murs et les pièces d'une maison |
| **CSS** | l'apparence | la peinture et la décoration |
| **JavaScript** | le comportement | l'électricité, les interrupteurs |

Tout ce que tu as appris en JavaScript finit, un jour, par modifier du HTML. Ce module pose ces
bases.

## Balises et attributs

Le HTML entoure le contenu de **balises** : une ouvrante, une fermante avec `/`.

```html
<p>Bienvenue sur la boutique.</p>
<a href="/panier">Voir mon panier</a>
<img src="logo.png" alt="Logo de la boutique">
```

- `<p>…</p>` : un paragraphe.
- `href="/panier"` est un **attribut** : une information supplémentaire sur la balise.
- `<img>` n'a pas de balise fermante : c'est une balise **vide**, comme `<input>` ou `<br>`.

Les balises s'**imbriquent** comme des poupées russes, et se ferment dans l'ordre inverse :

```html
<p>Livraison <strong>offerte</strong> dès 50 €.</p>
```

> **Attention** : `<p><strong>offerte</p></strong>` est mal imbriqué. Le navigateur essaie de
> deviner, et le résultat est imprévisible.

## Le squelette d'une page

Toute page commence par le même squelette :

```html
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Atelier Rustine</title>
  </head>
  <body>
    <!-- le contenu visible -->
  </body>
</html>
```

| Ligne | Pourquoi |
|---|---|
| `<!doctype html>` | « page moderne » : sans lui, le navigateur passe en mode de compatibilité |
| `lang="fr"` | la langue : les lecteurs d'écran prononcent correctement, Google indexe mieux |
| `charset="utf-8"` | les accents s'affichent correctement |
| `viewport` | la page s'adapte aux téléphones, au lieu d'afficher une version minuscule |
| `<title>` | le titre de l'onglet et des résultats de recherche |

## Les balises sémantiques

On peut tout construire avec des `<div>`, des boîtes sans signification. Mais les balises
**sémantiques** disent **ce qu'est** chaque partie :

```html
<body>
  <header>
    <nav>
      <ul>
        <li><a href="/">Accueil</a></li>
        <li><a href="/cours">Cours</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <h1>Apprendre en réparant</h1>
    <section>
      <h2>Nos parcours</h2>
      <p>…</p>
    </section>
  </main>

  <footer>© 2026 Atelier Rustine</footer>
</body>
```

| Balise | Contenu |
|---|---|
| `<header>` | l'en-tête : logo, navigation |
| `<nav>` | les liens de navigation principaux |
| `<main>` | le contenu principal, **une seule fois** par page |
| `<section>` | une partie thématique, avec son titre |
| `<article>` | un contenu autonome : un billet, une fiche produit |
| `<footer>` | le pied de page |

Pourquoi c'est important ? Les lecteurs d'écran, utilisés par les personnes aveugles,
proposent de « sauter au contenu principal » ou de « lister les titres ». Google comprend mieux
la page. Et le code se lit plus facilement.

## La hiérarchie des titres

Les titres vont de `<h1>` à `<h6>`, comme le plan d'un exposé :

```html
<h1>Guide du vélo</h1>        <!-- un seul : le sujet de la page -->
  <h2>Choisir son vélo</h2>
    <h3>Vélo de ville</h3>
    <h3>Vélo électrique</h3>
  <h2>Entretenir son vélo</h2>
```

> **À retenir** : un seul `<h1>`, et on ne saute pas de niveau (pas de `<h4>` juste après un
> `<h2>`). On choisit un titre pour sa place dans le plan, jamais pour sa taille : la taille se
> règle en CSS.

## Ce que tu sais faire maintenant

- Écrire des balises, des attributs, et les imbriquer correctement.
- Écrire le squelette complet d'une page.
- Structurer une page avec `header`, `nav`, `main`, `section` et `footer`.
- Construire une hiérarchie de titres cohérente.
