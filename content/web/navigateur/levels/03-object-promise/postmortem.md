## Cause racine

- `reponse.json()` sans `await` : `outils` était une **promesse**. `innerHTML = outils` affichait
  `[object Promise]`, et la boucle ne tournait pas (une promesse n'est pas un tableau).
- Aucun test de `reponse.ok` : un 503 était traité comme un succès, et son corps
  `{ "erreur": … }` comme une liste d'outils.
- Aucun état de chargement ni d'erreur, et un bouton toujours actif.

## Correctif

```js
etat.textContent = "Chargement…";
bouton.disabled = true;
try {
  const reponse = await fetch("/api/outils");
  if (!reponse.ok) throw new Error(`HTTP ${reponse.status}`);
  const outils = await reponse.json();
  …
} catch {
  etat.textContent = "Impossible de charger les outils.";
} finally {
  bouton.disabled = false;
}
```

## Le réflexe à garder

- `fetch` : deux `await`, et toujours `response.ok`.
- Trois états pour tout chargement : en cours, réussi, en erreur.
- `[object Promise]` à l'écran ou dans un log = un `await` oublié.
