## Cause racine

Quatre bugs dans huit lignes :

1. Les valeurs étaient lues **au chargement**, quand les champs étaient vides : chaque message
   partait vide.
2. L'écouteur était sur le **clic du bouton** : la touche Entrée déclenchait l'envoi natif du
   formulaire, sans passer par le code.
3. Aucun `preventDefault()` : le navigateur rechargeait la page, effaçant tout.
4. `innerHTML` avec le nom saisi : une faille XSS.

## Correctif

```js
formulaire.addEventListener("submit", (event) => {
  event.preventDefault();
  const nom = champNom.value.trim();
  …
  confirmation.textContent = `Merci ${nom} !`;
});
```

## Le réflexe à garder

- Un formulaire s'écoute sur `submit`, avec `preventDefault()` en première ligne.
- Une valeur de champ se lit au moment où on en a besoin.
- Les données d'un utilisateur s'affichent avec `textContent`.
