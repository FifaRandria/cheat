---
id: outils-03
title: Branches, conflits et git bisect
minutes: 14
summary: Travailler en parallèle avec les branches, résoudre un conflit, et retrouver en quelques étapes le commit qui a tout cassé.
check:
  - prompt: "500 commits séparent la version qui marche de celle qui est cassée. Combien d'étapes faut-il environ à git bisect ?"
    choices: ["500", "250", "9"]
    answer: 2
    explain: "Chaque étape divise l'intervalle par deux : 2⁹ = 512, donc environ 9 étapes."
  - prompt: "Que signifient les lignes `<<<<<<<`, `=======` et `>>>>>>>` dans un fichier ?"
    choices:
      - Un conflit de fusion à résoudre à la main
      - Un fichier corrompu
      - Un commentaire de Git
    answer: 0
  - prompt: Pourquoi créer une branche pour chaque fonctionnalité ?
    choices:
      - Pour travailler sans casser la branche principale, puis fusionner une fois prêt et relu
      - Pour aller plus vite
    answer: 0
---

## Les branches

Une **branche** est une ligne de développement parallèle. On garde `main` toujours stable, et on
développe chaque fonctionnalité sur sa propre branche :

```bash
git switch -c paiement-en-ligne      # créer une branche et s'y placer
# … commits …
git switch main                      # revenir sur main
git merge paiement-en-ligne          # fusionner la fonctionnalité terminée
```

En équipe, la fusion passe par une **pull request** sur GitHub : un collègue relit le code, le
CI vérifie que les tests passent, puis on fusionne.

## Les conflits

Si deux branches ont modifié **les mêmes lignes**, Git ne peut pas choisir : c'est un
**conflit**. Il marque l'endroit dans le fichier :

```output
<<<<<<< HEAD
const TVA = 0.2;
=======
const TVA = 0.055;
>>>>>>> taux-reduit
```

- entre `<<<<<<<` et `=======` : la version de ta branche ;
- entre `=======` et `>>>>>>>` : la version de la branche fusionnée.

Pour le résoudre : choisir (ou combiner) le bon code, **supprimer les marqueurs**, puis
`git add` et `git commit`.

> **Attention** : ne résous jamais un conflit « au hasard ». Si tu ne sais pas quelle version est
> la bonne, demande à la personne qui a écrit l'autre.

## git bisect : trouver le commit coupable

Le site marchait il y a deux semaines, il est cassé aujourd'hui, et 200 commits ont été faits
entre-temps. Lequel a cassé quoi ?

`git bisect` fait une **recherche dichotomique** : il te place au milieu de l'intervalle, tu
testes, tu dis « bon » ou « mauvais », et il recommence sur la moitié restante.

```bash
git bisect start
git bisect bad                  # la version actuelle est cassée
git bisect good v1.4            # la v1.4 marchait
# Git se place au milieu : on teste…
git bisect bad                  # … encore cassé ici
# Git se place au milieu de la moitié restante : on teste…
git bisect good                 # … ça marche ici
# … quelques étapes plus tard :
# a3f9c21 is the first bad commit
git bisect reset                # revenir où on était
```

200 commits → environ **8 étapes** (2⁸ = 256). 1 000 commits → environ 10.

> **À retenir** : c'est la méthode « isoler en coupant en deux » de la leçon sur le
> diagnostic, automatisée par Git. Avec un test automatique, `git bisect run npm test` fait
> tout tout seul.

## Ce que tu sais faire maintenant

- Créer une branche, y travailler, et la fusionner.
- Lire et résoudre un conflit de fusion.
- Retrouver le commit fautif avec `git bisect`, et estimer le nombre d'étapes.
