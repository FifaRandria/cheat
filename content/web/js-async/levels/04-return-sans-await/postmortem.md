## Cause racine

Un `try` / `catch` n'attrape que les erreurs qui se produisent **pendant** qu'on est dans le
bloc `try`. Or ici :

1. `enregistrer(panier)` renvoie immédiatement une promesse, sans erreur ;
2. `return enregistrement.then(...)` rend cette promesse à l'appelant, et la fonction
   **sort du `try`** ;
3. quelques millisecondes plus tard, la promesse est rejetée… mais on n'est plus dans le
   `try`. Le `catch` ne voit rien, et le rejet remonte jusqu'au serveur, qui plante.

## Correctif

Attendre la promesse **à l'intérieur** du `try` :

```js
try {
  const r = await enregistrer(panier);
  return { ok: true, id: r.id };
} catch (erreur) {
  return { ok: false, erreur: erreur.message };
}
```

C'est aussi pour cela qu'on écrit parfois `return await promesse` dans un `try` : sans le
`await`, l'erreur s'échappe.

## Le réflexe à garder

- Un `catch` qui « ne s'exécute jamais » alors que l'erreur a bien lieu signe une promesse
  qui n'est pas attendue dans le `try`.
- Dans une fonction `async`, préfère `await` à `.then()` : le flux reste lisible de haut en
  bas, et les erreurs passent par le `catch` comme on l'attend.
