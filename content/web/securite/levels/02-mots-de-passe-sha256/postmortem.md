## Cause racine

Les mots de passe étaient stockés avec `sha256`, sans sel :

- **sans sel**, un même mot de passe donne la même empreinte : les 37 comptes « password »
  se repéraient d'un coup d'œil, et des tables précalculées donnaient la réponse instantanément ;
- **sha256 est rapide** : une carte graphique en calcule des milliards par seconde. Tous les
  mots de passe courts ou courants tombent en quelques heures.

## Correctif

```js
const sel = randomBytes(16).toString("hex");
const empreinte = scryptSync(mdp, sel, 64).toString("hex");
return `${sel}:${empreinte}`;
```

scrypt est volontairement **lent et gourmand en mémoire** : quelques millisecondes pour un
utilisateur qui se connecte, des années pour un attaquant qui teste des milliards de
combinaisons. La vérification compare avec `timingSafeEqual`, en temps constant.

## Le réflexe à garder

- Jamais de mot de passe en clair, chiffré ou haché avec md5 / sha : scrypt, bcrypt ou argon2.
- Un sel aléatoire par utilisateur, stocké à côté de l'empreinte.
- Lors d'une migration, on ne peut pas retrouver les anciens mots de passe : on rehache au
  prochain login réussi, ou on demande une réinitialisation.
