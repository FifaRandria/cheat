## Ce qu'il fallait écrire

Une seule boucle, qui compte globalement **et** par catégorie :

```python
for cas in jeu:
    attendu = cas["attendu"]
    total_cat[attendu] = total_cat.get(attendu, 0) + 1
    if classer(cas["avis"]) == attendu:
        bonnes += 1
        bonnes_cat[attendu] = bonnes_cat.get(attendu, 0) + 1
    else:
        erreurs.append(cas["id"])
```

## Ce que montre le test « optimiste »

Un classifieur qui répond toujours « positif » obtient 50 % ici, et bien plus sur un jeu où
90 % des avis sont positifs. La précision par catégorie (0 % sur les négatifs) révèle
immédiatement qu'il ne sert à rien.

## Le réflexe à garder

- Mesurer **avant** de changer un prompt, puis après, sur le même jeu.
- Toujours regarder la précision par catégorie et la liste des erreurs, pas seulement le
  chiffre global.
- Un appel au LLM par cas, pas plus : l'évaluation aussi a un coût.
