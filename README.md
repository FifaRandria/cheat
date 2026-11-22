# Rustine

> **Répare avant d'écrire.** Une plateforme web où l'on apprend le développement
> fullstack, l'IA et la gestion de projet : une leçon claire d'abord, puis un système
> cassé à remettre au vert.

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
content/    contenu pédagogique : parcours, leçons et niveaux
docs/       guide de création de contenu, sécurité du runner
```

```
navigateur ──► web (Next.js) ──/api/*──► api (Express) ──► PostgreSQL
                                             │
                                             └──► runner ──► conteneur éphémère
                                                             (sans réseau, lecture seule)
```

- Le navigateur ne parle qu'à Next.js : `/api/*` est relayé vers Express, donc
  le cookie de session httpOnly fonctionne sans configuration CORS.
- Le contenu (`content/`) est versionné dans Git. L'API le recopie en base au
  démarrage, et à chaque modification en développement, puis lit les fichiers sur le disque.
- Le code des joueurs n'est jamais exécuté par l'API : seul le runner le fait,
  dans un conteneur jetable (voir [docs/securite-runner.md](docs/securite-runner.md)).

## Démarrer en local

Prérequis : Node.js 22 ou plus, PostgreSQL, et Python 3 pour les niveaux Python en mode
local. Docker est recommandé pour le runner.

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
| `npm run levels:check` | vérifie tout le contenu : leçons, quiz, et niveaux de code via le runner |
| `npm run levels:sync` | recopie `content/` en base (automatique en développement) |
| `npm run test:escape` | tentatives d'évasion du bac à sable : toutes doivent être contenues |
| `npm run typecheck` | vérifie les types de tout le monorepo |
| `npm run build` | build de production de tous les paquets |

## Le contenu

Trois parcours indépendants, qui commencent tous par les bases :

| Parcours | Modules ouverts | Leçons | Niveaux |
|---|---|---|---|
| **Développeur web fullstack** | W0 Bases de JavaScript, W1 JavaScript asynchrone | 9 | 8 |
| **Intelligence artificielle** | IA0 Bases de Python, IA2 Entraînement et fine-tuning | 7 | 5 |
| **Gestion de projet** | GP0 Étapes d'un projet web, GP1 Diriger une équipe | 7 | 3 |

Les autres modules (Express, Docker, CI/CD, RAG, n8n, gestion de crise…) sont visibles sur
la carte, « en chantier ».

Chaque module suit la même méthode :

1. **Apprendre** : des leçons courtes, avec des exemples JavaScript exécutables et modifiables
   dans la page, des encadrés « À retenir » et un quiz d'auto-évaluation.
2. **Réparer** : des niveaux qui mettent la notion à l'épreuve. Trois types existent : du
   code cassé (JavaScript ou Python, exécuté dans le bac à sable), des quiz de mises en
   situation, et des étapes à remettre dans l'ordre.
3. **Comprendre** : un post-mortem après chaque réussite. Chaque niveau renvoie aussi vers
   les leçons qui l'expliquent.

## Fonctionnalités

- Comptes e-mail et mot de passe, et GitHub (OAuth). Suppression de compte.
- XP, rangs, séries de jours et insignes (leçons, niveaux, Blackout, modules terminés).
- Indices écrits à l'avance qui coûtent de l'XP, et mode Blackout sans indice.
- Musée de bugs : les échecs sont enregistrés, avec une date de révision (boîtes de Leitner).

## Prochaines étapes

- Compléter les modules ouverts, puis ouvrir W2 (Terminal, Git, HTTP) et IA1 (Python pour
  la data).
- Simulations interactives pour l'IA : courbes de loss, calculateur de VRAM.
- Terminal simulé pour Docker et CI/CD (xterm.js et scénarios scriptés).
- Page de révision du musée de bugs.
- File d'attente BullMQ et Redis si plusieurs runners sont nécessaires.

Pour écrire une leçon ou un niveau, voir [docs/creer-du-contenu.md](docs/creer-du-contenu.md).
