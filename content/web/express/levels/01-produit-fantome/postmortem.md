## Cause racine

Quand aucun produit ne correspond, `find` renvoie `undefined`. La route faisait alors
`res.json(undefined)` : un `200 OK` avec un corps vide. Pour l'application mobile, la
requête avait **réussi**, d'où une fiche remplie de `undefined`.

Au passage, la comparaison `p.id == req.params.id` fonctionnait « par chance » grâce au `==`,
qui convertit les types. On compare un nombre à un texte : mieux vaut le rendre explicite.

## Correctif

```js
const produit = produits.find((p) => p.id === Number(req.params.id));
if (!produit) {
  return res.status(404).json({ error: "Produit introuvable" });
}
res.json(produit);
```

## Le réflexe à garder

- Le code de statut fait partie du **contrat** de l'API : un client lit d'abord le code,
  ensuite le corps.
- Chaque recherche qui peut échouer (`find`, une requête en base) doit avoir sa branche
  « introuvable ».
- Les paramètres d'URL sont des textes : convertis-les explicitement.
