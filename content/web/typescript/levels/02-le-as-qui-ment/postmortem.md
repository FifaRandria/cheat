## Cause racine

Deux mensonges faits au compilateur :

1. `donnees as Profil` : « crois-moi, c'est un Profil ». Aucune vérification n'avait lieu, et
   Node efface même cette ligne à l'exécution. Les profils de l'ancien système (`name` au lieu
   de `nom`, adresse sans ville) passaient tels quels.
2. `profil.adresse!` : le `!` affirme « ce n'est jamais undefined », alors que le type dit
   justement le contraire (`adresse?`).

## Correctif

Une vraie vérification de la forme, champ par champ, à partir de `unknown` ; puis `?.` et `??`
là où le type annonce une valeur facultative.

```ts
return profil.adresse?.ville.toUpperCase() ?? "Ville inconnue";
```

## Le réflexe à garder

- `as` et `!` ne sont pas des corrections, ce sont des promesses. Chacun doit être justifié.
- Aux frontières de l'application, on part de `unknown` et on valide (à la main ou avec zod).
- Un compilateur silencieux ne prouve rien sur les données qui viennent de l'extérieur.
