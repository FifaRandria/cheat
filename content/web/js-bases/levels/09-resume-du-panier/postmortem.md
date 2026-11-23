## Ce qu'il fallait écrire

Une boucle qui calcule trois choses en même temps :

```js
let nbArticles = 0;
let total = 0;
let plusCher = null;

for (const article of articles) {
  nbArticles += article.quantite;
  total += article.prix * article.quantite;
  if (plusCher === null || article.prix > plusCher.prix) plusCher = article;
}
```

C'est un schéma à connaître par cœur : **accumuler** (somme, compteur) et **garder le meilleur**
(maximum, minimum) pendant un seul parcours.

## Les pièges évités

- **Le panier vide** : sans le `plusCher === null`, on compare avec rien et on plante.
- **Le prix unitaire** : 30 câbles à 5 € coûtent plus que l'écran, mais l'écran reste l'article
  le plus cher. Lire attentivement le nom du test évitait la confusion.
- **L'arrondi** : `0.1 + 0.2` ne vaut pas exactement `0.3`.

## Le réflexe à garder

- Commencer par le cas le plus simple (vide, un seul élément), puis généraliser.
- Pour chaque valeur à calculer, se demander : quelle est sa valeur de départ ?
- Les méthodes `reduce` et `Math.max` font la même chose en plus court ; tu les croiseras
  souvent. La boucle reste la version la plus facile à déboguer.
