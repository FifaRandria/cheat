## Ce qu'il fallait écrire

```js
export async function chargerAvecSecours(sources) {
  for (const source of sources) {
    try {
      const donnees = await source.charger();
      return { source: source.nom, donnees };
    } catch {
      // en panne : on essaie la suivante
    }
  }
  throw new Error("toutes les sources ont échoué");
}
```

Le `return` au milieu de la boucle arrête tout dès le premier succès : les sources suivantes
ne sont jamais appelées.

## Pourquoi pas `Promise.all` ?

`Promise.all` lancerait **toutes** les sources en même temps : on paierait trois appels au lieu
d'un. Ici, l'ordre compte et chaque essai dépend de l'échec du précédent : c'est un cas
typique de traitement **séquentiel** avec `for…of` et `await`.

## Le réflexe à garder

- Séquentiel quand chaque étape dépend de la précédente, parallèle quand elles sont
  indépendantes.
- Un message d'erreur final **explicite** fait gagner du temps à celui qui lira les logs.
- En production, on journalise aussi l'erreur de chaque source en panne au lieu de l'ignorer.
