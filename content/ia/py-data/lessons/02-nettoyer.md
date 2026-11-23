---
id: data-02
title: Nettoyer les données
minutes: 13
summary: Espaces, majuscules, doublons, valeurs aberrantes. Pourquoi les données réelles sont toujours sales, et comment les normaliser.
check:
  - prompt: "`\"Ada@Ex.com \"` et `\"ada@ex.com\"` sont-ils des doublons pour `set()` ?"
    choices: ["Oui", "Non, les textes diffèrent (majuscules et espace)"]
    answer: 1
  - prompt: Avant de dédoublonner des e-mails, que faut-il faire ?
    choices:
      - Rien, set() suffit
      - "Les normaliser : supprimer les espaces (strip) et mettre en minuscules (lower)"
      - Les trier
    answer: 1
  - prompt: Un âge vaut 312 dans un fichier d'inscrits. Que faire ?
    choices:
      - Le garder tel quel
      - Le considérer comme une valeur aberrante, le signaler et l'écarter des calculs
      - Le remplacer par 0
    answer: 1
---

## Les données réelles sont sales

Dans un tutoriel, les données sont parfaites. Dans la vraie vie, elles ont été saisies par
des humains, exportées par trois logiciels différents et fusionnées à la main. On estime que
le nettoyage représente souvent **la majorité du temps** d'un projet de data ou d'IA.

Les défauts les plus fréquents :

| Défaut | Exemple |
|---|---|
| Espaces en trop | `" Paris"`, `"Paris "` |
| Casse incohérente | `"PARIS"`, `"paris"`, `"Paris"` |
| Doublons | le même client inscrit deux fois |
| Formats différents | `"2026-11-23"`, `"23/11/2026"` |
| Valeurs aberrantes | un âge de 312 ans |
| Valeurs manquantes | une cellule vide (leçon suivante) |

## Normaliser le texte

```python
villes = [" Paris", "PARIS", "paris ", "Lyon"]
propres = [v.strip().lower() for v in villes]
print(propres)
print(sorted(set(propres)))
```

```output
['paris', 'paris', 'paris', 'lyon']
['lyon', 'paris']
```

- `strip()` supprime les espaces au début et à la fin ;
- `lower()` met tout en minuscules ;
- `set(...)` ne garde qu'un exemplaire de chaque valeur.

> **À retenir** : **normalise d'abord, compare ensuite**. Sans normalisation, `set()` voit
> trois villes différentes là où il n'y en a qu'une.

## Dédoublonner en gardant l'ordre

`set()` perd l'ordre d'origine. Pour garder la première occurrence de chaque élément :

```python
def sans_doublons(valeurs):
    vus = set()
    resultat = []
    for v in valeurs:
        cle = v.strip().lower()
        if cle not in vus:
            vus.add(cle)
            resultat.append(cle)
    return resultat

print(sans_doublons(["Ada@ex.com", "bob@ex.com", " ada@EX.com"]))
```

```output
['ada@ex.com', 'bob@ex.com']
```

## Repérer les valeurs aberrantes

Une valeur **aberrante** est impossible ou très improbable : un âge négatif ou de 312 ans, un
prix de 0,0001 €, une température de 900 °C dans une ville. On fixe des **bornes
raisonnables** pour chaque colonne, et on écarte (en le signalant) ce qui en sort.

```python
ages = [34, 29, 312, 41, -2, 27]
valides = [a for a in ages if 0 < a < 120]
print(valides)
print("écartés :", [a for a in ages if not 0 < a < 120])
```

```output
[34, 29, 41, 27]
écartés : [312, -2]
```

> **Attention** : écarter une valeur aberrante sans le **signaler** peut cacher un vrai
> problème en amont (un formulaire défaillant, un export qui inverse deux colonnes). Garde
> toujours une trace de ce que tu écartes.

## Ce que tu sais faire maintenant

- Lister les défauts typiques des données réelles.
- Normaliser du texte avec `strip()` et `lower()` avant de comparer.
- Dédoublonner en conservant l'ordre.
- Repérer et écarter des valeurs aberrantes, en le signalant.
