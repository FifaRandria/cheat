---
id: docker-01
title: Images, conteneurs et Dockerfile
minutes: 14
summary: Pourquoi « ça marche sur ma machine » n'est plus une excuse, ce qu'est une image, et comment écrire un Dockerfile efficace.
check:
  - prompt: Quelle est la différence entre une image et un conteneur ?
    choices:
      - Aucune
      - L'image est le modèle figé ; le conteneur est une instance qui s'exécute à partir de cette image
      - Le conteneur est plus léger que l'image
    answer: 1
  - prompt: "Pourquoi copier `package.json` et lancer `npm install` AVANT de copier le reste du code ?"
    choices:
      - Pour profiter du cache de Docker, et ne pas réinstaller les dépendances à chaque changement de code
      - C'est obligatoire
      - Pour la sécurité
    answer: 0
  - prompt: Les modifications faites dans un conteneur sont-elles conservées après sa suppression ?
    choices:
      - Oui, toujours
      - Non, sauf si elles sont dans un volume
    answer: 1
---

## « Ça marche sur ma machine »

Une application dépend de beaucoup de choses : la version de Node, des bibliothèques système,
des variables d'environnement. Sur la machine du développeur, tout est installé. Sur le serveur,
une version diffère, et plus rien ne marche.

**Docker** emballe l'application **avec tout son environnement** dans une **image**. Cette image
s'exécute de façon identique partout : sur ton ordinateur, dans le CI, en production.

> **Déjà vu** : tu utiliseras Docker pour de vrai dans le module « Ton projet sur ta machine » :
> PostgreSQL en développement, puis l'image de production.

## Image et conteneur

| | Image | Conteneur |
|---|---|---|
| C'est | un modèle figé, en lecture seule | une instance en cours d'exécution |
| Analogie | une recette | le plat préparé à partir de la recette |
| Commande | `docker build` | `docker run` |

On peut lancer **plusieurs** conteneurs à partir d'une même image. Et un conteneur est
**jetable** : on le supprime et on en relance un neuf à tout moment.

> **Attention** : tout ce qui est écrit **dans** un conteneur (fichiers, base de données)
> disparaît quand il est supprimé. Pour conserver des données, il faut un **volume** (leçon
> suivante).

## Le Dockerfile

Un **Dockerfile** est la recette de l'image, une instruction par ligne :

```dockerfile
# Image de départ : un Linux minimal avec Node 22
FROM node:22-alpine
# Dossier de travail dans l'image
WORKDIR /app
# D'abord les fichiers de dépendances, puis leur installation
COPY package*.json ./
RUN npm ci
# Ensuite le code de l'application
COPY . .
# Le port utilisé (à titre de documentation)
EXPOSE 3000
# La commande lancée au démarrage du conteneur
CMD ["node", "server.js"]
```

> **Attention** : dans un Dockerfile, un commentaire `#` doit être **seul sur sa ligne**. Placé
> après une instruction, il serait lu comme faisant partie de ses arguments.

```bash
docker build -t mon-api .         # construire l'image
docker run -p 3000:3000 mon-api   # lancer un conteneur, port 3000 de l'hôte → 3000 du conteneur
```

## Le cache des couches

Chaque instruction crée une **couche**. Docker met les couches en **cache** : si une instruction
et tout ce qui la précède n'ont pas changé, il réutilise le résultat.

L'ordre des instructions compte donc énormément :

- le code change **à chaque modification** ;
- les dépendances (`package.json`) changent **rarement**.

En copiant `package.json` et en installant les dépendances **avant** de copier le code, une
modification du code ne réinstalle pas les dépendances : la construction passe de plusieurs
minutes à quelques secondes.

> **À retenir** : dans un Dockerfile, place ce qui change **rarement** en haut, et ce qui change
> **souvent** en bas.

## Le fichier .dockerignore

Comme `.gitignore`, il exclut des fichiers de l'image : `node_modules`, `.git`, et surtout
`.env`, qui contient des secrets.

```output
node_modules
.git
.env
```

## Ce que tu sais faire maintenant

- Expliquer le rôle de Docker et la différence entre image et conteneur.
- Lire et écrire un Dockerfile simple.
- Ordonner les instructions pour profiter du cache.
- Exclure les fichiers inutiles et les secrets avec `.dockerignore`.
