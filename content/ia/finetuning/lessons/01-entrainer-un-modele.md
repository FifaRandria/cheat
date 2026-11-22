---
id: ia-ft-01
title: Comment un modèle apprend
minutes: 15
summary: Dataset, epochs, batch, learning rate, loss. Et le piège n°1 de l'entraînement, le sur-apprentissage, expliqué avec un élève qui révise.
check:
  - prompt: "La loss d'entraînement baisse toujours, mais la loss de validation remonte depuis l'epoch 4. Que se passe-t-il ?"
    choices:
      - Le modèle apprend de mieux en mieux
      - "Le modèle sur-apprend (overfitting) : il mémorise les exemples d'entraînement"
      - Le dataset est trop grand
    answer: 1
    explain: "Il devient meilleur sur ce qu'il a déjà vu, et moins bon sur ce qu'il n'a jamais vu : c'est la définition du sur-apprentissage."
  - prompt: "La loss fait des bonds énormes et finit par valoir NaN. Quel réglage soupçonner en premier ?"
    choices: ["Un learning rate trop grand", "Trop peu d'epochs", "Un dataset de validation trop petit"]
    answer: 0
  - prompt: "Que représente une epoch ?"
    choices:
      - Un exemple du dataset
      - Un passage complet sur tout le dataset d'entraînement
      - Une heure de calcul
    answer: 1
---

## L'élève et ses fiches de révision

Imagine un élève qui prépare un examen avec un paquet de **fiches** : une question au recto,
la réponse au verso.

1. Il lit une question et propose une réponse.
2. Il retourne la fiche et **compare** avec la bonne réponse.
3. Plus il s'est trompé, plus il **corrige** sa façon de penser.
4. Il recommence avec la fiche suivante.

Entraîner un modèle d'IA, c'est exactement ça, répété des millions de fois. Le modèle est une
énorme fonction mathématique avec des milliards de petits réglages, les **paramètres** (ou
*poids*). Apprendre, c'est ajuster ces réglages pour que ses réponses se rapprochent des
bonnes.

## Le vocabulaire de l'entraînement

| Terme | Dans l'analogie | En vrai |
|---|---|---|
| **Dataset** | le paquet de fiches | les exemples (entrée, réponse attendue) |
| **Loss** | l'ampleur de l'erreur sur une fiche | un nombre qui mesure à quel point le modèle se trompe |
| **Epoch** | un passage sur tout le paquet | un passage complet sur tout le dataset |
| **Batch** | quelques fiches révisées d'un coup | un groupe d'exemples traités ensemble avant une correction |
| **Learning rate** | l'intensité de la correction | la taille du pas d'ajustement des paramètres |

> **À retenir** : la **loss** est le chiffre à surveiller. Elle doit **baisser** au fil de
> l'entraînement : c'est le signe que le modèle se trompe de moins en moins.

## Le learning rate : ni trop, ni trop peu

Le **learning rate** règle la force de chaque correction.

- **Trop petit** : l'élève corrige à peine ses erreurs. La loss baisse, mais si lentement qu'il
  faudrait des semaines.
- **Trop grand** : l'élève sur-corrige à chaque erreur et passe d'un extrême à l'autre. La loss
  fait des bonds, remonte, et peut **exploser** jusqu'à valoir `NaN`.
- **Bien réglé** : la loss baisse franchement, puis se stabilise.

Ordres de grandeur courants pour adapter un modèle de langage : entre `1e-5` et `2e-4`
(c'est-à-dire entre 0,00001 et 0,0002).

## Le piège : le sur-apprentissage

Un élève qui révise **trop longtemps les mêmes fiches** finit par apprendre les réponses
**par cœur**, sans comprendre. Le jour de l'examen, face à une question nouvelle, il échoue.

Un modèle fait pareil. C'est le **sur-apprentissage** (*overfitting*). Pour le détecter, on met
de côté une partie du dataset que le modèle ne voit **jamais** pendant l'entraînement : le
jeu de **validation**, l'examen blanc.

On suit alors deux courbes :

| Epoch | Loss d'entraînement | Loss de validation |
|---|---|---|
| 1 | 2.10 | 2.15 |
| 2 | 1.40 | 1.52 |
| 3 | 0.95 | 1.20 |
| 4 | 0.60 | **1.18** ← le meilleur moment |
| 5 | 0.32 | 1.31 |
| 6 | 0.12 | 1.58 |

Jusqu'à l'epoch 4, les deux baissent : le modèle apprend vraiment. Ensuite, la loss
d'entraînement continue de baisser, mais la loss de **validation remonte** : le modèle
mémorise ses fiches et devient moins bon sur ce qu'il n'a jamais vu.

> **Attention** : une loss d'entraînement très basse n'est **pas** une bonne nouvelle en soi.
> Seule la loss de **validation** dit si le modèle généralise.

## Les remèdes

Quand la validation remonte :

- **Arrêt anticipé** (*early stopping*) : on garde le modèle de l'epoch où la validation était
  la plus basse (ici, la 4).
- **Moins d'epochs** : 2 à 4 suffisent souvent pour adapter un modèle déjà pré-entraîné.
- **Plus de données**, et plus variées : plus il y a de fiches différentes, plus il est
  difficile de toutes les apprendre par cœur.
- **Un learning rate plus petit**, pour des corrections plus douces.

## Et si la loss ne baisse pas du tout ?

Les deux courbes restent hautes : le modèle n'apprend presque rien. C'est le
**sous-apprentissage**. Pistes : learning rate trop petit, trop peu d'epochs, ou des données
de mauvaise qualité (réponses incohérentes, mauvais format).

> **Astuce** : en pratique, beaucoup de problèmes d'entraînement viennent des **données**,
> pas des réglages. Avant de toucher au learning rate, relis une vingtaine d'exemples de ton
> dataset, à la main.

## Ce que tu sais faire maintenant

- Expliquer dataset, loss, epoch, batch et learning rate.
- Reconnaître un learning rate trop grand (loss qui explose) ou trop petit (loss qui stagne).
- Lire deux courbes de loss et repérer le sur-apprentissage.
- Proposer un remède : arrêt anticipé, moins d'epochs, plus de données.
