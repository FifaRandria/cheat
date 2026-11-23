## Les réflexes d'astreinte

- **Force brute** : limiter les tentatives par IP et par compte, ralentir après plusieurs échecs,
  surveiller les connexions anormales.
- **Énumération** : un message d'erreur unique pour la connexion et la réinitialisation.
- **Secret exposé** : révoquer d'abord, nettoyer ensuite. Un secret publié est un secret perdu.
- **Dépendances** : `npm audit` (ou Dependabot) dans la CI, et des mises à jour régulières.
- **Logs** : jamais de mots de passe, de jetons, ni de numéros de carte. Masquer ces champs à la
  source.
