## Cause racine

`compteur[mot] += 1` est un raccourci pour `compteur[mot] = compteur[mot] + 1`. Python doit
donc d'abord **lire** `compteur[mot]`. Pour le tout premier mot, le dictionnaire est vide :
la clé n'existe pas, d'où `KeyError: 'le'`.

Le texte vide fonctionnait, parce que la boucle ne faisait aucun tour. Encore un bug qui se
cache dans un cas que l'on teste rarement : la **première fois**.

## Correctif

```python
compteur[mot] = compteur.get(mot, 0) + 1
```

`.get(mot, 0)` renvoie le compte actuel, ou `0` si le mot n'a jamais été vu.

Pour aller plus loin, la bibliothèque standard propose exactement cet outil :

```python
from collections import Counter

Counter("le chat et le chien".split())
```

## Le réflexe à garder

- Avant d'incrémenter une clé, demande-toi : « existe-t-elle déjà la première fois ? ».
- `KeyError: 'x'` te donne la clé manquante. Cherche **pourquoi** elle n'existe pas encore,
  plutôt que d'entourer le code d'un `try` qui masquerait le problème.
- Compter des mots est la toute première étape du traitement du langage : c'est ainsi qu'on
  construit un vocabulaire avant de découper un texte en *tokens*.
