## Ce qu'il fallait écrire

Trois fonctions, comme un composant :

- `afficher()` dessine la liste à partir de l'état ;
- `charger()` lit l'API, avec les états de chargement et d'erreur ;
- `emprunter(id)` envoie le `POST`, traduit le code de réponse en message, puis **recharge**.

Et un seul écouteur sur la liste, qui retrouve le bouton cliqué avec
`event.target.closest("button[data-id]")`.

## Ce que tu viens de faire

Ton interface a parlé à **la vraie API** des étapes précédentes : la requête est passée par le
middleware d'authentification, le dépôt a vérifié la règle du double prêt, la base a enregistré
le prêt, et la réponse 201 ou 409 est revenue jusqu'à l'écran. C'est une application
fullstack complète, du clic jusqu'à la base de données.

## Le réflexe à garder

- Chaque code du contrat a son message pour l'utilisateur.
- Après une action, on recharge l'état réel du serveur.
- Les mêmes fonctions (état, rendu, chargement) se retrouvent dans un composant React :
  `useState`, le JSX, et un `useEffect` pour le premier chargement.
