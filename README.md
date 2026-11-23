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
| `npm test` | tests unitaires (Vitest) de l'API et du runner |
| `npm run typecheck` | vérifie les types de tout le monorepo |
| `npm run build` | build de production de tous les paquets |

## Intégration continue

À chaque push sur `main` et à chaque pull request, GitHub Actions lance le typecheck, les
tests unitaires et le build, puis vérifie tout le contenu avec le runner en **mode Docker**
et exécute les tests d'évasion du bac à sable (`.github/workflows/ci.yml`).

## Le contenu

Trois parcours indépendants, qui commencent tous par les bases :

| Parcours | Modules | Leçons | Niveaux |
|---|---|---|---|
| **Développeur web fullstack** | HTML et CSS, bases JS, JS asynchrone, Terminal/Git/HTTP, Express, SQL, React, TypeScript et tests, sécurité web, Docker, CI/CD, changer de langage, projet final | 52 | 68 |
| **IA et automatisation** | Bases Python, Python pour la data, fine-tuning, LLM par API et agents, RAG, n8n | 24 | 32 |
| **Gestion de projet** | Étapes d'un projet, diriger une équipe, risques et crises, piloter un projet | 15 | 20 |

Au total : 91 leçons et 120 niveaux, répartis dans 23 modules, tous ouverts. Le parcours web
se termine par un projet guidé en sept étapes, la Boîte à outils, qui réunit tous les modules.

Les exercices de code tournent dans le bac à sable sans aucune dépendance externe : un
mini-framework fidèle à Express pour les API, SQLite intégré à Node (`node:sqlite`) pour le
SQL, un mini-analyseur HTML et un mini-moteur de cascade CSS pour HTML et CSS, des fichiers
`.ts` exécutés directement par Node pour TypeScript, un faux LLM pour les agents, et la
bibliothèque standard de Python pour la data et le RAG.

Chaque module suit la même méthode :

1. **Apprendre** : des leçons courtes, avec des exemples JavaScript exécutables et modifiables
   dans la page, des encadrés « À retenir » et un quiz d'auto-évaluation.
2. **Réparer, puis écrire** : des niveaux qui mettent la notion à l'épreuve. Quatre types
   existent : du code cassé à réparer, du code à écrire à partir des tests (JavaScript,
   TypeScript ou Python, exécutés dans le bac à sable), des quiz de mises en situation, et des
   étapes à remettre dans l'ordre. Certains niveaux font même écrire les tests, vérifiés
   contre des versions sabotées du code.
3. **Comprendre** : un post-mortem après chaque réussite. Chaque niveau renvoie aussi vers
   les leçons qui l'expliquent.

## Fonctionnalités

- Comptes e-mail et mot de passe, et GitHub (OAuth). Suppression de compte.
- XP, rangs, séries de jours et insignes (leçons, niveaux, Blackout, modules terminés).
- Indices écrits à l'avance qui coûtent de l'XP, et mode Blackout sans indice.
- Musée de bugs et révision espacée : chaque niveau raté revient sur la page Révision le
  lendemain, puis à 3, 7, 14 et 30 jours une fois réparé (+10 XP par révision réussie). Le
  musée se range aussi par famille de bug, tous langages confondus.

## Prochaines étapes

- Ajouter des boss de module, et un suivi des points de blocage des apprenants.
- Simulations interactives pour l'IA : courbes de loss, calculateur de VRAM.
- Terminal simulé pour Docker et CI/CD (xterm.js et scénarios scriptés).
- File d'attente BullMQ et Redis si plusieurs runners sont nécessaires.

Pour écrire une leçon ou un niveau, voir [docs/creer-du-contenu.md](docs/creer-du-contenu.md).
