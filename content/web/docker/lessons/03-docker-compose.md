---
id: docker-03
title: Docker Compose et diagnostic
minutes: 13
summary: Décrire toute une application dans un fichier, la démarrer d'une commande, et diagnostiquer un conteneur qui ne démarre pas.
check:
  - prompt: À quoi sert docker compose ?
    choices:
      - À décrire et lancer plusieurs conteneurs ensemble (API, base, frontend), avec leurs réseaux et volumes
      - À compiler du code
      - À remplacer le Dockerfile
    answer: 0
  - prompt: Un conteneur s'arrête dès son démarrage. Quelle commande regarder en premier ?
    choices: ["docker logs <conteneur>", "docker build", "docker pull"]
    answer: 0
  - prompt: "`depends_on: [db]` garantit-il que PostgreSQL est prêt à accepter des connexions ?"
    choices:
      - Oui
      - Non, seulement que son conteneur a démarré ; il faut un healthcheck pour attendre qu'il soit prêt
    answer: 1
---

## Une application, plusieurs conteneurs

Une application web, c'est souvent une API, une base de données, un frontend, parfois un cache.
Les lancer un par un avec les bons réseaux, volumes et variables serait fastidieux. **Docker
Compose** décrit tout dans un fichier `docker-compose.yml` :

```yaml
services:
  db:
    image: postgres:17
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - donnees-db:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s

  api:
    build: ./api
    environment:
      DATABASE_URL: postgresql://postgres:secret@db:5432/postgres
    ports:
      - "4000:4000"
    depends_on:
      db:
        condition: service_healthy

volumes:
  donnees-db:
```

Les services sont automatiquement placés sur **le même réseau** : `api` joint la base sur `db`.

```bash
docker compose up -d        # tout démarrer en arrière-plan
docker compose ps           # l'état des services
docker compose logs -f api  # suivre les logs de l'API
docker compose down         # tout arrêter (les volumes sont conservés)
```

## Attendre que la base soit prête

`depends_on` démarre `db` avant `api`… mais un conteneur **démarré** n'est pas un service
**prêt**. PostgreSQL met quelques secondes à accepter les connexions, et l'API plante si elle
essaie trop tôt.

Le **healthcheck** vérifie régulièrement que le service répond, et
`condition: service_healthy` fait attendre l'API jusqu'à ce que la base soit vraiment prête.

## Diagnostiquer un conteneur

| Commande | Ce qu'elle montre |
|---|---|
| `docker compose ps` | quels services tournent, lesquels sont arrêtés |
| `docker compose logs api` | la sortie de l'application : erreurs, stack traces |
| `docker exec -it <conteneur> sh` | un terminal **à l'intérieur** du conteneur |
| `docker inspect <conteneur>` | toute la configuration : réseaux, variables, volumes |

```output
$ docker compose ps
NAME   STATUS
db     Up 2 minutes (healthy)
api    Exited (1) 3 seconds ago

$ docker compose logs api
api  | Error: connect ECONNREFUSED 127.0.0.1:5432
```

> **À retenir** : un conteneur qui s'arrête aussitôt démarré a presque toujours écrit la raison
> dans ses logs. `docker compose logs` d'abord, hypothèses ensuite.

> **Attention** : ne mets jamais de vrais secrets en clair dans `docker-compose.yml` s'il est
> versionné. Utilise un fichier `.env` exclu de Git, ou les secrets de ta plateforme.

## Ce que tu sais faire maintenant

- Décrire une application à plusieurs services dans `docker-compose.yml`.
- Démarrer, arrêter et suivre les services avec `docker compose`.
- Attendre qu'une base soit prête avec un healthcheck.
- Diagnostiquer un conteneur avec `ps`, `logs` et `exec`.
