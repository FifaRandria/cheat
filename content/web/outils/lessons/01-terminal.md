---
id: outils-01
title: Le terminal, sans peur
minutes: 13
summary: Se déplacer, lire des fichiers, chercher dans des logs et enchaîner des commandes. Le terminal est l'outil n°1 du diagnostic.
check:
  - prompt: "Que fait `grep \"ERROR\" app.log` ?"
    choices:
      - Supprime les erreurs du fichier
      - Affiche les lignes du fichier qui contiennent ERROR
      - Crée un fichier ERROR
    answer: 1
  - prompt: "Que fait le `|` dans `grep \"500\" acces.log | wc -l` ?"
    choices:
      - Il envoie la sortie de la première commande à l'entrée de la seconde
      - Il exécute les deux commandes en parallèle, sans lien
      - C'est une erreur de syntaxe
    answer: 0
  - prompt: "Comment voir les 20 dernières lignes d'un fichier de log ?"
    choices: ["head -n 20 app.log", "tail -n 20 app.log", "cat 20 app.log"]
    answer: 1
---

## Pourquoi le terminal ?

Sur un serveur en production, il n'y a ni souris ni fenêtres : seulement un **terminal**. C'est
là qu'on lit les logs, qu'on redémarre un service, qu'on lance Git ou Docker. Le maîtriser, c'est
pouvoir diagnostiquer n'importe où.

Le terminal attend une **commande**, l'exécute, affiche le résultat, puis attend la suivante.

## Se repérer et se déplacer

```bash
pwd                 # où suis-je ? (print working directory)
ls                  # que contient ce dossier ?
ls -la              # tout, y compris les fichiers cachés, avec les détails
cd projets/api      # entrer dans un dossier
cd ..               # remonter d'un niveau
cd ~                # revenir au dossier personnel
```

> **Astuce** : la touche **Tab** complète automatiquement les noms de fichiers et de dossiers.
> Et la flèche **haut** rappelle les commandes précédentes.

## Lire des fichiers

```bash
cat config.json         # tout le fichier
head -n 20 app.log      # les 20 premières lignes
tail -n 50 app.log      # les 50 dernières lignes
tail -f app.log         # suivre le fichier en direct (Ctrl+C pour arrêter)
less app.log            # parcourir un gros fichier (q pour quitter)
```

`tail -f` est le réflexe en cas d'incident : tu vois les nouvelles lignes de log apparaître en
temps réel.

## Chercher avec grep

`grep` affiche les lignes qui contiennent un motif :

```bash
grep "ERROR" app.log            # les lignes d'erreur
grep -i "timeout" app.log       # sans tenir compte des majuscules
grep -n "ERROR" app.log         # avec les numéros de ligne
grep -r "TODO" src/             # dans tous les fichiers d'un dossier
```

```output
$ grep -n "ERROR" app.log
128:2026-11-23 21:02:14 ERROR payment: invalid API key
131:2026-11-23 21:02:15 ERROR payment: invalid API key
```

## Enchaîner avec le pipe

Le `|` (*pipe*) envoie la sortie d'une commande à l'entrée de la suivante. C'est ce qui rend le
terminal si puissant :

```bash
grep "ERROR" app.log | wc -l                      # combien d'erreurs ?
grep " 500 " acces.log | tail -n 5                # les 5 dernières erreurs 500
cat acces.log | cut -d' ' -f7 | sort | uniq -c | sort -rn | head
```

La dernière ligne, lue de gauche à droite : prendre le 7e champ de chaque ligne (l'URL), trier,
compter les doublons, trier par nombre décroissant, garder les premiers. En une ligne : **les
URL les plus appelées**.

> **À retenir** : chaque commande fait une petite chose, et le `|` les assemble. Pour
> comprendre une longue commande, ajoute les étapes une par une et regarde le résultat à chaque
> fois.

## Les commandes dangereuses

```bash
rm fichier.txt      # supprime, sans corbeille
rm -rf dossier/     # supprime un dossier et tout son contenu, sans confirmation
```

> **Attention** : il n'y a **pas de corbeille** dans le terminal. Avant un `rm -rf`, vérifie
> deux fois où tu es (`pwd`) et ce que tu vas supprimer (`ls`).

## Ce que tu sais faire maintenant

- Te repérer et te déplacer avec `pwd`, `ls` et `cd`.
- Lire un fichier avec `cat`, `head`, `tail` et `tail -f`.
- Chercher dans des logs avec `grep`.
- Enchaîner des commandes avec le pipe `|`.
