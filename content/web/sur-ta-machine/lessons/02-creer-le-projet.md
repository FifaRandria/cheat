---
id: machine-02
title: Créer le projet et son dépôt Git
minutes: 15
summary: La structure du projet, le dépôt Git, le fichier .gitignore, et le premier push sur GitHub.
check:
  - prompt: Que mettre dans .gitignore dès le premier jour ?
    choices:
      - "node_modules (il se réinstalle avec npm install) et .env (il contient des secrets)"
      - Le code source
    answer: 0
  - prompt: "Que fait `git push -u origin main` ?"
    choices:
      - "Il envoie la branche main sur le dépôt distant origin (GitHub), et retient ce lien pour les prochains push"
      - Il supprime la branche distante
    answer: 0
---

## La structure

Tu vas reconstruire la Boîte à outils du projet final, en vrai. Un dossier, deux
applications :

```text
boite-a-outils/
  api/            le backend : Express et PostgreSQL
  web/            le frontend : React avec Vite
  docker-compose.yml
  .gitignore
  README.md
```

## Le dépôt

```bash
mkdir boite-a-outils
cd boite-a-outils
git init
```

Crée le fichier `.gitignore` **avant** le premier commit :

```text
node_modules/
dist/
.env
```

> **Attention** : un fichier `.env` commité, même une seule fois, reste dans l'historique Git.
> S'il contient un vrai secret, considère-le comme compromis et change-le. D'où le `.gitignore`
> dès le premier jour.

Un `README.md` minimal : ce qu'est le projet, et comment le lancer. Tu le compléteras au fil
des leçons.

```bash
git add .
git commit -m "Démarrer le projet"
```

## Sur GitHub

Sur GitHub, crée un dépôt **vide** (sans README ni .gitignore, tu les as déjà), puis :

```bash
git remote add origin https://github.com/ton-compte/boite-a-outils.git
git push -u origin main
```

Tu reconnais le module « Terminal, Git et HTTP » : à partir de maintenant, tu travailles comme
une équipe, avec des commits réguliers et des messages clairs.

## Ta mission

- [ ] Créer le dossier, le `.gitignore` et le `README.md`.
- [ ] Faire le premier commit.
- [ ] Créer le dépôt sur GitHub et y pousser `main`.

## Ce que tu sais faire maintenant

- Organiser un projet fullstack en deux applications.
- Créer un dépôt Git propre, avec un `.gitignore` adapté.
- Publier un dépôt sur GitHub.
