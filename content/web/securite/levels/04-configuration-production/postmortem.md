## Cause racine

Une configuration pensée pour le développement, qui serait partie telle quelle en production :

- `JWT_SECRET ?? "dev-secret"` : si la variable manquait sur le serveur, l'API signait ses
  jetons avec un secret écrit dans le code, donc connu de tous ;
- `httpOnly: false` et `sameSite: "none"` : cookie lisible par une XSS et envoyé depuis
  n'importe quel site (CSRF) ;
- une session d'un an ;
- `origine.includes(…)` : `https://rustine.fr.pirate.example` contient bien `rustine.fr`.

## Correctif

```js
if (production && (!jwtSecret || jwtSecret.length < 32)) {
  throw new Error("JWT_SECRET manquant ou trop court : refus de démarrer");
}
cookie: { httpOnly: true, secure: production, sameSite: "lax", maxAge: SEPT_JOURS },
origineAutorisee: (origine) => origines.includes(origine),   // égalité exacte
```

## Le réflexe à garder

- Une application **refuse de démarrer** plutôt que de tourner avec une configuration
  dangereuse : l'erreur est visible tout de suite, au lieu d'une faille silencieuse.
- Les valeurs par défaut sont pour le développement ; la production ne doit en avoir aucune
  pour les secrets.
- Comparer des origines, des domaines ou des rôles par **égalité exacte**, jamais par
  `includes` ou `startsWith`.
