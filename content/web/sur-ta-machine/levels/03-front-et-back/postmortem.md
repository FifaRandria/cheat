## Le réflexe à garder

- En développement, la page appelle des adresses **relatives** (`/api/…`), et le proxy relaie.
- `localhost` dans le code du frontend est presque toujours un bug en production.
- Un `useEffect` qui charge des données a un tableau de dépendances.
- Ce qui vient du DOM (champs, `data-*`) est une chaîne : on convertit avant d'envoyer.
- L'onglet Réseau répond à la question « où est partie ma requête, et qu'a dit le serveur ? ».
