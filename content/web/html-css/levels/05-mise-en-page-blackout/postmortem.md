## Les réflexes de mise en page

- `box-sizing: border-box` partout, dès la première ligne du CSS.
- La balise `viewport` dans chaque page, sinon le responsive n'existe pas.
- Pas de largeur fixe plus grande qu'un téléphone : `max-width` + `width: 100%`.
- Flexbox en ligne : `justify-content` pour l'horizontal, `align-items` pour le vertical.
- `max-width` dans une media query : « jusqu'à cette largeur » (mobile) ; `min-width` : « à
  partir de cette largeur » (ordinateur).

Pour vérifier : les outils de développement du navigateur ont un **mode appareil** (Ctrl+Maj+M
dans Chrome et Firefox), qui simule un téléphone en un clic.
