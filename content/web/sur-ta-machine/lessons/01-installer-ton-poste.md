---
id: machine-01
title: Installer ton poste de développeur
minutes: 20
summary: Installer Node.js, Python, Git, un éditeur et Docker, vérifier que tout marche, et savoir quoi faire quand une commande est introuvable.
check:
  - prompt: "Le terminal répond « node : commande introuvable » juste après l'installation de Node.js. Que faire d'abord ?"
    choices:
      - Réinstaller Windows
      - "Fermer et rouvrir le terminal : il lit la liste des programmes (le PATH) à son ouverture"
    answer: 1
  - prompt: "Pourquoi configurer `git config --global user.name` et `user.email` ?"
    choices:
      - "Chaque commit enregistre son auteur : sans cette configuration, Git refuse de commiter ou devine mal"
      - Pour se connecter à GitHub
    answer: 0
---

## Sortir du bac à sable

Jusqu'ici, tout s'est passé dans Rustine : le code tournait dans un bac à sable préparé pour
toi. Un développeur autonome sait **tout faire sur sa propre machine** : installer ses outils,
créer un projet, le lancer, le tester, le mettre en ligne. C'est l'objet de ce module.

Chaque leçon se termine par une **mission** à faire chez toi. Les niveaux du module, eux,
t'entraînent à réparer les erreurs que tu vas rencontrer en chemin.

> **À retenir** : tu vas rencontrer des erreurs d'installation. Tout le monde en rencontre. Ce
> sont des bugs comme les autres : lis le message en entier, cherche-le tel quel, applique la
> méthode de diagnostic.

## Les outils

| Outil | Pour quoi | Où |
|---|---|---|
| **Node.js** (version LTS, 22 ou plus) | exécuter JavaScript hors du navigateur, et `npm` | nodejs.org |
| **Python** (3.12 ou plus) | le parcours IA | python.org (sous Windows, coche « Add python.exe to PATH ») |
| **Git** | l'historique du code | git-scm.com |
| **Visual Studio Code** | l'éditeur | code.visualstudio.com |
| **Docker Desktop** | la base PostgreSQL, puis l'image de production | docker.com |

LTS signifie *Long Term Support* : la version stable, maintenue longtemps. Évite les versions
« Current » pour travailler.

Dans VS Code, installe deux extensions : **ESLint** (signale les erreurs) et **Prettier**
(met en forme le code automatiquement).

## Vérifier que tout marche

Ouvre un **nouveau** terminal (dans VS Code : menu Terminal, puis Nouveau terminal) :

```bash
node --version
npm --version
python --version
git --version
docker --version
```

Chaque commande doit afficher un numéro de version. Sous macOS et Linux, Python s'appelle
souvent `python3`.

## Configurer Git une fois pour toutes

```bash
git config --global user.name "Ton Nom"
git config --global user.email "ton-adresse@exemple.fr"
git config --global init.defaultBranch main
```

Crée ensuite un compte sur **GitHub** (ou GitLab) : c'est là que vivra ton code, et que
tournera ta CI.

## Quand une commande est introuvable

| Message | Cause probable | Réparation |
|---|---|---|
| `node : commande introuvable` / `'node' n'est pas reconnu` | le terminal a été ouvert avant l'installation | fermer et rouvrir le terminal |
| même chose après redémarrage | le dossier du programme n'est pas dans le PATH | réinstaller en cochant l'option PATH |
| `python` ouvre le Microsoft Store (Windows) | un raccourci de Windows prend la place | installer Python depuis python.org, désactiver l'alias dans les paramètres |
| `docker: Cannot connect to the Docker daemon` | Docker Desktop n'est pas lancé | ouvrir Docker Desktop et attendre qu'il soit prêt |

## Ta mission

- [ ] Installer Node.js LTS, Python, Git, VS Code et Docker Desktop.
- [ ] Afficher les cinq versions dans un terminal.
- [ ] Configurer ton nom et ton adresse dans Git.
- [ ] Créer ton compte GitHub.

## Ce que tu sais faire maintenant

- Installer et vérifier les outils d'un développeur web et IA.
- Configurer Git.
- Réparer une commande introuvable.
