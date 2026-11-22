## Cause racine

Le `return` était indenté **dans** la boucle `for`. Au premier tour, la fonction calculait
`correctes / len(predictions)` et s'arrêtait aussitôt.

- Si le premier exemple était juste, `correctes` valait 1 : la fonction renvoyait
  `1 / 200 = 0.005`, quels que soient les 199 autres exemples.
- Si le premier exemple était faux : `0 / 200 = 0.0`.
- Avec deux exemples dont le premier est juste, on obtenait `1 / 2 = 0.5`, le bon résultat…
  par pur hasard. C'est pour cela qu'un seul test ne suffit pas.

Aucun message d'erreur : le programme « marchait ». C'est le pire genre de bug, celui qui
donne un **résultat faux avec assurance**.

Il y avait aussi un second piège : avec une liste vide, la boucle ne tourne pas, la fonction
ne rencontre aucun `return` et renvoie `None`.

## Correctif

```python
    for i in range(len(predictions)):
        if predictions[i] == attendus[i]:
            correctes += 1
    return correctes / len(predictions)   # après la boucle
```

Sans oublier le cas vide, traité au début de la fonction.

## Le réflexe à garder

- En Python, **l'indentation est la logique**. Relis toujours à quel niveau se trouvent tes
  `return`.
- En IA, méfie-toi d'une métrique absurde, trop belle ou trop mauvaise : c'est plus souvent un
  bug du script d'évaluation qu'un problème du modèle. Vérifie à la main sur quelques exemples.
