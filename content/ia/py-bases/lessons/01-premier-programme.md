---
id: py-bases-01
title: Ton premier programme Python
minutes: 10
summary: Pourquoi Python est le langage de l'IA, afficher avec print, et la règle qui surprend tout le monde, l'indentation.
check:
  - prompt: "Que fait `print(\"Bonjour\")` ?"
    choices:
      - Il imprime sur une imprimante
      - Il affiche Bonjour à l'écran
      - Il crée une variable Bonjour
    answer: 1
  - prompt: "En Python, à quoi servent les espaces en début de ligne (l'indentation) ?"
    choices:
      - À rien, c'est décoratif
      - À indiquer quelles lignes font partie d'un bloc (une condition, une boucle, une fonction)
      - À ralentir le programme
    answer: 1
    explain: "En Python, l'indentation fait partie de la syntaxe. Là où JavaScript utilise des accolades `{ }`, Python utilise des espaces."
  - prompt: "Le programme affiche `NameError: name 'prnt' is not defined`. Quelle est la cause ?"
    choices:
      - Une faute de frappe dans print
      - Python n'est pas installé
      - Il manque une ligne vide
    answer: 0
---

## Pourquoi Python ?

Python est **le** langage de l'intelligence artificielle. Les outils pour entraîner des
modèles (PyTorch), manipuler des données (pandas, numpy) ou adapter un modèle de langage
(Hugging Face, PEFT) sont écrits pour Python.

Bonne nouvelle : c'est aussi l'un des langages les plus lisibles. Un programme Python
ressemble souvent à de l'anglais simplifié.

> **À retenir** : comme en JavaScript, un programme Python est une liste d'instructions
> exécutées **de haut en bas**, une ligne après l'autre.

## Afficher un message : `print`

```python
print("Bonjour !")
print("Je suis ton premier programme Python.")
print(2 + 3)
print("Le résultat est", 6 * 7)
```

```output
Bonjour !
Je suis ton premier programme Python.
5
Le résultat est 42
```

`print(...)` affiche ce qu'on lui donne. Avec plusieurs valeurs séparées par des virgules,
il les affiche côte à côte, séparées par un espace.

Dans ce module, les exemples Python sont suivis de leur **sortie**, ce qu'ils affichent.
Dans les incidents, ton code est réellement exécuté.

## Les commentaires

Tout ce qui suit `#` est un commentaire, ignoré par Python :

```python
# Ce programme calcule une surface
largeur = 4
hauteur = 3
print(largeur * hauteur)  # affiche 12
```

## L'indentation n'est pas décorative

C'est **la** grande différence avec JavaScript. En JavaScript, un bloc de code est délimité
par des accolades `{ }`. En Python, il est délimité par l'**indentation** : les espaces en
début de ligne.

```python
temperature = 32

if temperature > 30:
    print("Il fait chaud")      # 4 espaces : dans le if
    print("Pense à boire")      # 4 espaces : dans le if

print("Fin du programme")       # 0 espace : après le if
```

```output
Il fait chaud
Pense à boire
Fin du programme
```

Les deux points `:` à la fin du `if` annoncent un bloc. Toutes les lignes indentées de
**4 espaces** en dessous font partie de ce bloc. La première ligne non indentée marque la fin.

> **Attention** : décaler une ligne de 4 espaces, ou en retirer, change le **sens** du
> programme. C'est une source de bugs fréquente : une instruction se retrouve dans une boucle,
> ou en sort, sans qu'aucune erreur ne s'affiche.

## Lire une erreur Python

Python affiche ses erreurs sous forme de **traceback** (le chemin de l'erreur). On le lit
**de bas en haut** : la dernière ligne contient le type et le message.

```python
print("Avant")
prnt("Après")
```

```output
Avant
Traceback (most recent call last):
  File "main.py", line 2, in <module>
    prnt("Après")
NameError: name 'prnt' is not defined
```

- **`NameError`** : le type d'erreur, ici un nom inconnu ;
- **`name 'prnt' is not defined`** : le détail, « prnt » n'existe pas ;
- **`line 2`** : la ligne fautive, recopiée juste au-dessus.

> **Astuce** : quand une erreur apparaît, va directement à la **dernière ligne** du traceback,
> puis remonte pour trouver le numéro de ligne dans *ton* fichier.

## Ce que tu sais faire maintenant

- Afficher des valeurs avec `print`.
- Écrire un commentaire avec `#`.
- Comprendre que l'indentation (4 espaces) délimite les blocs.
- Lire un traceback en partant de la dernière ligne.
