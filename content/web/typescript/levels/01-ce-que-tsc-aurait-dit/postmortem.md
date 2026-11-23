## Le réflexe à garder

Chaque erreur du compilateur est un bug potentiel détecté **gratuitement**, avant tout test.
Lors d'une migration :

- on corrige les erreurs une par une, en commençant par les plus fréquentes ;
- on active `strict` dès le départ, quitte à migrer fichier par fichier ;
- on n'utilise ni `any`, ni `as`, ni `!` pour faire taire une erreur qu'on ne comprend pas.
