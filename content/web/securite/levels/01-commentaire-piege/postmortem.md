## Cause racine

Trois défauts, une seule faille XSS :

1. Le **texte** du commentaire était inséré sans échappement : la balise `<img onerror>`
   s'exécutait chez chaque visiteur et envoyait son cookie à l'attaquant.
2. L'**attribut** `data-auteur` n'était pas échappé : un pseudo contenant `"` pouvait fermer
   l'attribut et en ajouter un autre, comme `onmouseover`.
3. `echapperHTML` remplaçait `&` **en dernier** : les entités `&lt;` qu'elle venait de produire
   devenaient `&amp;lt;`. Et elle ignorait les guillemets.

## Correctif

```js
String(texte)
  .replaceAll("&", "&amp;")   // toujours en premier
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");
```

Et **chaque** donnée utilisateur passe par cette fonction, dans le texte comme dans les
attributs.

## Le réflexe à garder

- Toute donnée qui vient d'un utilisateur est hostile tant qu'elle n'est pas échappée.
- Préférer les outils qui échappent par défaut (React, moteurs de gabarits, `textContent`).
- Des cookies de session `httpOnly` auraient limité les dégâts : le script n'aurait pas pu les
  lire.
