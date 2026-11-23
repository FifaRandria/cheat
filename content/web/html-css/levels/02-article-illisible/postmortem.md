## Cause racine

La page était belle, mais son **plan** était faux :

- deux `<h1>` (le nom du blog et le titre de l'article) : Google et les lecteurs d'écran ne
  savaient pas quel était le sujet ;
- un `<h4>` directement sous un `<h2>`, choisi pour sa petite taille ;
- trois images sans `alt` : le lecteur d'écran lisait « kit tiret réparation point jpg » ;
- des liens « Cliquez ici » et « en savoir plus », vides de sens hors contexte.

## Correctif

Un seul `h1` pour le sujet, un plan `h2` → `h3` sans saut, des `alt` qui décrivent
l'**information**, `alt=""` pour la vague décorative, et des liens qui disent où ils mènent.

## Le réflexe à garder

- On choisit un titre pour sa **place dans le plan**, et sa taille en CSS.
- Une image : « que perdrait quelqu'un qui ne la voit pas ? ». La réponse est le `alt`.
- Un lien doit se comprendre **seul**, lu dans une liste de liens.
- Ce qui aide les lecteurs d'écran aide aussi le référencement : les deux lisent le HTML.
