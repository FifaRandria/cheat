---
id: rag-03
title: Découper les documents (chunking)
minutes: 13
summary: Pourquoi on coupe les documents en morceaux, comment choisir la taille, et à quoi sert le chevauchement.
check:
  - prompt: Pourquoi ne pas vectoriser un document de 80 pages d'un seul bloc ?
    choices:
      - Parce que son vecteur mélangerait tous les sujets, et serait proche de rien en particulier
      - Parce que c'est interdit
      - Parce que le fichier serait trop lourd à stocker
    answer: 0
  - prompt: "Morceaux de 100 mots avec un chevauchement de 20 : de combien de mots avance-t-on entre deux débuts de morceaux ?"
    choices: ["100", "80", "120"]
    answer: 1
  - prompt: À quoi sert le chevauchement entre deux morceaux ?
    choices:
      - À ne pas couper en deux une information qui se trouve à la frontière
      - À faire plus de morceaux pour remplir la base
      - À rien
    answer: 0
---

## Pourquoi découper ?

Un embedding résume **tout** un texte en un seul vecteur. Pour un contrat de 80 pages qui
parle de tarifs, de résiliation et de données personnelles, ce vecteur serait une moyenne
floue de tous les sujets, proche de rien en particulier.

On découpe donc les documents en **morceaux** (*chunks*) de quelques centaines de mots, et on
vectorise **chaque morceau**. La recherche peut alors retrouver précisément le paragraphe sur
la résiliation.

## La taille des morceaux

| Morceaux trop petits | Morceaux trop grands |
|---|---|
| une phrase seule perd son contexte | plusieurs sujets mélangés |
| « Il est de 30 jours. » : quoi donc ? | vecteur flou, recherche moins précise |
| beaucoup de morceaux à chercher | moins de place dans le prompt pour d'autres sources |

En pratique, on commence souvent entre **200 et 500 mots** (ou *tokens*), puis on ajuste en
testant sur de vraies questions.

## Le problème des frontières

Imagine ce texte coupé tous les 8 mots, sans précaution :

```output
morceau 1 : « Le délai de rétractation pour tout achat en ligne »
morceau 2 : « est de 14 jours à compter de la réception. »
```

La question « Quel est le délai de rétractation ? » retrouve le morceau 1… qui ne contient
pas la réponse. Le morceau 2 contient la réponse, mais plus le sujet.

## Le chevauchement

La solution : faire **se chevaucher** les morceaux. Chaque morceau reprend les derniers mots
du précédent.

```python
def decouper(mots, taille, chevauchement):
    pas = taille - chevauchement
    morceaux = []
    debut = 0
    while debut < len(mots):
        morceaux.append(" ".join(mots[debut:debut + taille]))
        if debut + taille >= len(mots):
            break
        debut += pas
    return morceaux

texte = "a b c d e f g h i j".split()
for m in decouper(texte, taille=4, chevauchement=1):
    print(m)
```

```output
a b c d
d e f g
g h i j
```

Avec une taille de 4 et un chevauchement de 1, on avance de **3** mots à chaque fois : le
« d » et le « g » apparaissent dans deux morceaux.

> **À retenir** : le **pas** (l'écart entre deux débuts de morceaux) vaut
> `taille - chevauchement`. Et le dernier morceau, souvent plus court, ne doit jamais être
> oublié : c'est souvent là que se trouve la conclusion d'un document.

> **Attention** : un chevauchement supérieur ou égal à la taille donnerait un pas nul ou
> négatif, et une boucle infinie. Vérifie toujours `0 <= chevauchement < taille`.

## Découper intelligemment

Couper au nombre de mots est simple, mais coupe parfois au milieu d'une phrase. Les outils
avancés découpent de préférence aux **frontières naturelles** : titres, paragraphes, phrases.
Le principe du chevauchement reste le même.

## Ce que tu sais faire maintenant

- Expliquer pourquoi on découpe les documents avant de les vectoriser.
- Choisir une taille de morceau et en connaître les compromis.
- Calculer le pas à partir de la taille et du chevauchement.
- Écrire un découpage qui n'oublie pas le dernier morceau.
