## Le réflexe à garder

Ces erreurs ne sont pas des bugs de ton code, mais de ton **environnement**. Elles se
diagnostiquent exactement pareil :

- lire le message **en entier** : il contient presque toujours le chemin, le port ou le nom
  du module en cause ;
- chercher le code d'erreur (`ENOENT`, `EADDRINUSE`, `ECONNREFUSED`) : chacun a un sens précis ;
- vérifier les évidences : suis-je dans le bon dossier ? le service est-il lancé ? ai-je
  installé les dépendances ?

| Code | Signification |
|---|---|
| `ENOENT` | fichier ou dossier introuvable |
| `EADDRINUSE` | le port est déjà pris |
| `ECONNREFUSED` | personne n'écoute à cette adresse |
| `MODULE_NOT_FOUND` | dépendance non installée, ou chemin d'import faux |
