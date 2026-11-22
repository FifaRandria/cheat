# Sécurité du runner

Le runner (`apps/runner`) exécute du code écrit par des inconnus. C'est la
partie la plus sensible de la plateforme.

## Ce que fait chaque job

1. Le code du joueur est écrit dans `src/` et les tests du niveau dans `tests/`,
   dans un dossier temporaire unique.
2. Un conteneur éphémère est lancé avec :

| Option | Effet |
|---|---|
| `--network none` | aucun accès réseau |
| `--memory 128m --memory-swap 128m` | mémoire plafonnée, pas de swap |
| `--cpus 0.5` | un demi-cœur au maximum |
| `--pids-limit 64` | protège contre les fork bombs |
| `--read-only` + `-v …:/work:ro` | système de fichiers en lecture seule |
| `--tmpfs /tmp:noexec,size=16m` | seul espace inscriptible, petit et non exécutable |
| `--cap-drop ALL`, `no-new-privileges` | aucune capacité Linux |
| `--user 1000:1000` | jamais root dans le conteneur |
| délai de `RUNNER_TIMEOUT_MS` | `docker kill` au-delà |

3. Le dossier temporaire est supprimé, que le job réussisse ou non.

Le conteneur ne reçoit **aucune variable d'environnement** du runner : aucun
secret n'y est visible.

## Vérifier l'isolation

```bash
RUNNER_MODE=docker npm run test:escape
```

Le script tente six attaques : réseau, écriture disque, lecture de secrets,
boucle infinie, épuisement de la mémoire et fork bomb. Toutes doivent être
**contenues**. Lance-le à chaque mise à jour de Docker ou de l'image.

## Mode `unsafe-local`

`RUNNER_MODE=unsafe-local` exécute les tests directement avec Node, **sans
aucune isolation**. Il sert uniquement à développer sur une machine sans
Docker. Ne l'active jamais sur un serveur.

## Points d'attention en production

- **Socket Docker** : dans `docker-compose.yml`, le runner monte
  `/var/run/docker.sock`, ce qui équivaut à un accès root à l'hôte. Le runner
  ne doit donc être joignable que par l'API (réseau interne, jeton
  `RUNNER_TOKEN`). Pour aller plus loin : une VM dédiée au runner, Docker
  rootless, ou gVisor (`--runtime=runsc`).
- **Charge** : la file d'attente en mémoire (`RUNNER_CONCURRENCY`,
  `RUNNER_MAX_QUEUE`) suffit pour une instance. Avec plusieurs instances,
  remplace-la par BullMQ et Redis.
- **Quotas** : l'API limite le nombre de soumissions par utilisateur et par
  minute.
