## Les réflexes de débogage dans le navigateur

- **Console** : la première erreur rouge, avec son fichier et sa ligne.
- **Réseau** : la requête est-elle partie ? avec quels en-têtes et quel corps ? qu'a répondu le
  serveur ?
- **Éléments** : l'élément existe-t-il ? quelles classes a-t-il ?
- CORS se règle côté serveur ; `401` = jeton manquant ; `body` = `JSON.stringify` ; un bug
  « déjà corrigé » qui persiste = le cache.
