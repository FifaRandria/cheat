## Cause racine

Deux fautes de frappe sur des noms de propriétés :

- `client.Premium` au lieu de `client.premium` : JavaScript distingue les majuscules. La
  propriété `Premium` n'existe pas, elle vaut donc `undefined`, et `undefined === true` est
  toujours faux. Personne n'était considéré comme premium.
- `client.mail` au lieu de `client.email` : même cause. Une fois le premier bug corrigé, la
  liste aurait contenu des `undefined` au lieu des adresses.

Le piège : lire une propriété qui n'existe pas **ne provoque aucune erreur**. JavaScript
renvoie silencieusement `undefined`.

## Correctif

```js
if (client.premium === true) {
  emails.push(client.email);
}
```

## Le réflexe à garder

- Quand une condition n'est jamais vraie, affiche la valeur testée : un `undefined` trahit
  presque toujours un nom de propriété mal écrit.
- Copie les noms de propriétés depuis la donnée réelle (les logs, la réponse de l'API) plutôt
  que de les retaper de mémoire.
- TypeScript (module W6) détecte ce bug avant même l'exécution.
