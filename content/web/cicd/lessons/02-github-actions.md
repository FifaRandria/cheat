---
id: cicd-02
title: Lire et écrire un workflow GitHub Actions
minutes: 15
summary: L'anatomie d'un fichier de workflow, les pièges du YAML, les secrets, et comment lire un log rouge.
check:
  - prompt: "En YAML, qu'est-ce qui définit l'imbrication des éléments ?"
    choices: ["Les accolades", "L'indentation (les espaces)", "Les points-virgules"]
    answer: 1
  - prompt: Où stocker la clé d'API utilisée pour déployer ?
    choices:
      - Directement dans le fichier YAML
      - Dans les secrets du dépôt, lus avec secrets.NOM_DU_SECRET
    answer: 1
  - prompt: Dans le log d'un pipeline rouge, où chercher en premier ?
    choices:
      - Tout en haut du log
      - L'étape marquée en échec, puis les dernières lignes avant l'erreur
    answer: 1
---

## L'anatomie d'un workflow

Un workflow GitHub Actions est un fichier YAML dans `.github/workflows/` :

```yaml
name: CI

on:                              # quand le lancer
  push:
    branches: [main]
  pull_request:

jobs:
  tests:                         # un job = une machine
    runs-on: ubuntu-latest
    steps:                       # les étapes, dans l'ordre
      - uses: actions/checkout@v4        # récupérer le code
      - uses: actions/setup-node@v4      # installer Node
        with:
          node-version: 22
      - run: npm ci                      # une commande du terminal
      - run: npm test
```

| Mot-clé | Rôle |
|---|---|
| `on` | les événements déclencheurs (push, pull request, horaire…) |
| `jobs` | les tâches ; chacune tourne sur sa propre machine |
| `runs-on` | le système de la machine |
| `steps` | les étapes, exécutées dans l'ordre |
| `uses` | une action toute faite (récupérer le code, installer Node…) |
| `run` | une commande du terminal |
| `needs` | ce job attend la réussite d'un autre |

## Les pièges du YAML

Le YAML est lisible, mais strict :

- **l'indentation** définit la structure, avec des **espaces** (jamais de tabulations) ;
- un tiret `-` désigne un élément de liste ;
- un décalage d'un seul espace change le sens, ou rend le fichier invalide.

```yaml
steps:
  - run: npm ci
   - run: npm test     # un espace de trop : erreur de syntaxe
```

```output
Invalid workflow file: .github/workflows/ci.yml#L12
You have an error in your yaml syntax on line 12
```

## Les secrets

Un déploiement a besoin de clés et de mots de passe. On ne les écrit **jamais** dans le YAML :
on les ajoute dans les **secrets** du dépôt (Settings → Secrets), puis on les lit ainsi :

```yaml
      - run: ./deployer.sh
        env:
          CLE_SERVEUR: ${{ secrets.CLE_SERVEUR }}
```

GitHub masque automatiquement leur valeur dans les logs.

## Lire un log rouge

Quand un pipeline échoue :

1. ouvre le job en échec, puis l'**étape marquée d'une croix** ;
2. descends aux **dernières lignes** avant l'erreur : le message utile est presque toujours là ;
3. reproduis en local avec la **même commande** que celle de l'étape.

```output
Run npm test
  ✔ calcule le total du panier
  ✖ applique le code promo
    AssertionError: 80 !== 79.99
Error: Process completed with exit code 1.
```

Ici, le pipeline n'est pas « cassé » : il a fait son travail. Un test a détecté un bug.

> **À retenir** : un pipeline rouge est une **information**, pas un obstacle. Lis le log avant de
> relancer : relancer sans comprendre ne répare rien, sauf pour un test réellement instable.

## Ce que tu sais faire maintenant

- Lire un workflow : déclencheurs, jobs, étapes, `uses`, `run`, `needs`.
- Éviter les pièges d'indentation du YAML.
- Utiliser des secrets au lieu de clés en clair.
- Trouver la cause d'un pipeline rouge dans son log.
