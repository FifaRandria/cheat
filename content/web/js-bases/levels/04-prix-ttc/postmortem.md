## Cause racine

`prixTTC` **calculait** bien le prix, et l'**affichait** même avec `console.log`, mais ne le
**renvoyait** pas. Sans `return`, une fonction renvoie `undefined`.

`etiquette` recevait donc `undefined` et appelait `undefined.toFixed(2)` : d'où
`Cannot read properties of undefined (reading 'toFixed')`.

Le piège : l'erreur apparaissait dans `etiquette` (ligne 9), alors que le bug était dans
`prixTTC`. **L'endroit où ça casse n'est pas toujours l'endroit où c'est faux.**

## Correctif

```js
export function prixTTC(prixHT) {
  return prixHT * 1.2;
}
```

## Le réflexe à garder

- `console.log` affiche pour toi ; `return` rend la valeur au programme. Le `console.log`
  donnait l'illusion que tout marchait.
- Face à `Cannot read properties of undefined`, remonte le fil : **d'où vient** cette valeur
  `undefined` ? Souvent d'une fonction sans `return`.
