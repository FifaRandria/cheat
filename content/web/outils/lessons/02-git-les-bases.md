---
id: outils-02
title: Git, les bases
minutes: 14
summary: Commits, historique et différences. Git est la machine à remonter le temps de ton code.
check:
  - prompt: "Que fait `git add fichier.js` ?"
    choices:
      - Il enregistre définitivement le fichier dans l'historique
      - Il prépare le fichier pour le prochain commit (zone d'index)
      - Il envoie le fichier sur GitHub
    answer: 1
  - prompt: "Comment voir ce qui a changé dans tes fichiers depuis le dernier commit ?"
    choices: ["git log", "git diff", "git push"]
    answer: 1
  - prompt: Quel est le meilleur message de commit ?
    choices:
      - « modifs »
      - « Corriger le calcul de la TVA quand le panier est vide »
      - « wip »
    answer: 1
---

## Pourquoi Git ?

Sans Git, on finit avec `site-final.zip`, `site-final-v2.zip`, `site-final-VRAIMENT.zip`. Avec
Git, chaque étape importante du projet est enregistrée dans un **historique** : on peut voir
qui a changé quoi, quand, pourquoi, et revenir en arrière.

C'est aussi un outil de **diagnostic** : quand quelque chose casse, l'historique dit ce qui a
changé.

## Les trois zones

| Zone | Ce qu'elle contient | Commande pour y passer |
|---|---|---|
| **Répertoire de travail** | tes fichiers, tels que tu les modifies | — |
| **Index** (*staging*) | les changements prêts pour le prochain commit | `git add` |
| **Historique** | les commits enregistrés | `git commit` |

```bash
git status                       # où en sont mes fichiers ?
git add src/panier.js            # préparer ce fichier
git commit -m "Corriger le total du panier vide"
git log --oneline                # l'historique, une ligne par commit
```

```output
$ git log --oneline
a3f9c21 Corriger le total du panier vide
7be04d2 Ajouter la page de paiement
1c88e90 Créer le panier
```

Chaque commit a un **identifiant** (`a3f9c21`), un auteur, une date et un message.

## Voir les différences

```bash
git diff                 # changements pas encore ajoutés
git diff --staged        # changements ajoutés, pas encore commités
git show a3f9c21         # le contenu d'un commit précis
```

```output
-  const total = 0;
+  let total = 0;
```

Les lignes en `-` ont été retirées, celles en `+` ajoutées.

> **À retenir** : `git status` et `git diff` avant chaque commit. Tu commites ce que tu crois
> commiter, et pas un `console.log` oublié.

## De bons messages de commit

Un message de commit sert à quelqu'un qui, dans six mois, cherchera **pourquoi** une ligne a
changé. Ce quelqu'un sera souvent toi.

- une phrase courte, à l'impératif : « Corriger… », « Ajouter… » ;
- **un** changement logique par commit ;
- si besoin, un paragraphe qui explique le **pourquoi**.

## Travailler avec un dépôt distant

```bash
git clone https://github.com/equipe/projet.git   # copier un dépôt
git pull                                         # récupérer les changements des autres
git push                                         # envoyer tes commits
```

## Revenir en arrière

```bash
git restore fichier.js       # annuler les modifications non commitées d'un fichier
git revert a3f9c21           # créer un nouveau commit qui annule a3f9c21
```

> **Attention** : `git revert` **ajoute** un commit d'annulation, sans réécrire l'historique :
> c'est la méthode sûre sur une branche partagée. Les commandes qui réécrivent l'historique
> (`git reset --hard`, `git push --force`) peuvent faire perdre le travail des autres.

## Ce que tu sais faire maintenant

- Expliquer répertoire de travail, index et historique.
- Faire un commit avec `git add` et `git commit`, après `git status` et `git diff`.
- Lire l'historique et le contenu d'un commit.
- Annuler proprement avec `git restore` et `git revert`.
