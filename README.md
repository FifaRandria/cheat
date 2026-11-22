# Rustine

> **Répare avant d'écrire.** Une plateforme web où l'on apprend le développement
> fullstack, Docker, le CI/CD et l'IA en remettant des systèmes cassés au vert.

*Rustine* est un nom de travail : le nom définitif reste une question ouverte du
cahier des charges.

## Architecture

```
apps/
  web/      Next.js 15 · React 19 · Tailwind 4 · Monaco      → :3000
  api/      Express 5 · Prisma · PostgreSQL · JWT            → :4000
  runner/   exécution isolée du code (conteneurs Docker)     → :4100
packages/
  shared/   types TypeScript partagés
levels/     contenu pédagogique (un dossier par niveau)
docs/       guide de création de niveaux, sécurité du runner
```

```
navigateur ──► web (Next.js) ──/api/*──► api (Express) ──► PostgreSQL
                                             │
                                             └──► runner ──► conteneur éphémère
                                                             (sans réseau, lecture seule)
```

- Le navigateur ne parle qu'à Next.js : `/api/*` est relayé vers Express, donc
  le cookie de session httpOnly fonctionne sans configuration CORS.
- Le contenu (`levels/`) est versionné dans Git. L'API le recopie en base au
  démarrage (`levels:sync`) et lit les fichiers des niveaux sur le disque.
- Le code des joueurs n'est jamais exécuté par l'API : seul le runner le fait,
  dans un conteneur jetable (voir [docs/securite-runner.md](docs/securite-runner.md)).

## Démarrer en local

Prérequis : Node.js 22 ou plus et PostgreSQL. Docker est recommandé pour le
runner.

```bash
npm install
cp .env.example .env          # puis complète DATABASE_URL, JWT_SECRET, RUNNER_TOKEN
npm run db:migrate            # crée les tables
```

Lance les trois services, dans trois terminaux :

```bash
npm run dev:runner
npm run dev:api
npm run dev:web
```

Ouvre ensuite <http://localhost:3000>.

**Sans Docker ?** Mets `RUNNER_MODE="unsafe-local"` dans `.env`. Le code
s'exécutera alors directement avec Node, **sans aucune isolation**. À réserver
à ta machine de développement.

**Avec Docker**, tout l'environnement démarre d'une commande :

```bash
docker compose up --build
```

## Commandes utiles

| Commande | Effet |
|---|---|
| `npm run levels:check` | vérifie que chaque niveau échoue au départ et passe avec sa solution (runner requis) |
| `npm run levels:sync` | recopie `levels/` en base sans redémarrer l'API |
| `npm run test:escape` | tentatives d'évasion du bac à sable : toutes doivent être contenues |
| `npm run typecheck` | vérifie les types de tout le monorepo |
| `npm run build` | build de production de tous les paquets |

## Ce que contient le MVP

- Comptes e-mail et mot de passe, et GitHub (OAuth). Suppression de compte.
- Catalogue M0 à M12, avec 4 niveaux jouables (M0 et M1), dont un en Blackout.
- Éditeur Monaco, tests exécutés dans le bac à sable, retour test par test.
- XP, rangs, séries de jours, 7 badges et un badge par module terminé.
- Indices écrits à l'avance qui coûtent de l'XP, et mode Blackout sans indice.
- Post-mortem après chaque réussite.
- Musée de bugs : les échecs sont enregistrés, avec une date de révision
  (boîtes de Leitner).

## Prochaines étapes

- Compléter M0 et M1 jusqu'à 10 niveaux (critère d'acceptation du MVP).
- Niveaux non codés pour le module IA (quiz, ordre d'étapes, courbes) : le type
  `LevelType` les prévoit déjà.
- Terminal simulé pour Docker et CI/CD (xterm.js et scénarios scriptés).
- Page de révision du musée de bugs.
- File d'attente BullMQ et Redis si plusieurs runners sont nécessaires.

Pour écrire un niveau, voir [docs/creer-un-niveau.md](docs/creer-un-niveau.md).
