## Ce qu'il fallait écrire

```js
const etat = { filtre: "", categorie: "" };

function afficher() {
  const resultat = visibles();       // calculé à partir de l'état
  liste.replaceChildren();
  …
}

champFiltre.addEventListener("input", (e) => { etat.filtre = e.target.value; afficher(); });
choixCategorie.addEventListener("change", (e) => { etat.categorie = e.target.value; afficher(); });
```

## Pourquoi un état ?

Les filtres se **combinent** : quand la catégorie change, il faut se souvenir du texte tapé. Si
chaque écouteur modifiait la liste à sa façon, le second effacerait le travail du premier.
Avec un état unique et un seul rendu, les combinaisons marchent sans effort.

## Le réflexe à garder

- Un état, une fonction de rendu, des écouteurs qui modifient l'état puis appellent le rendu.
- C'est le modèle de React : `useState` pour l'état, le composant pour le rendu.
