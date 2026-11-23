---
id: transfert-02
title: De JavaScript à Python, la table d'équivalences
minutes: 15
summary: Tout ce que tu sais faire en JavaScript, écrit en Python, côte à côte.
check:
  - prompt: "Comment écrit-on `tab.push(x)` en Python ?"
    choices:
      - "`liste.push(x)`"
      - "`liste.append(x)`"
      - "`liste.add(x)`"
    answer: 1
  - prompt: "Quel est l'équivalent Python de `null` et `undefined` ?"
    choices:
      - "`None`"
      - "`null`"
      - "`nil`"
    answer: 0
  - prompt: "Que donne `objet.cle` en Python sur un dictionnaire ?"
    choices:
      - "La valeur, comme en JavaScript"
      - "Une erreur : on écrit `dico[\"cle\"]` ou `dico.get(\"cle\")`"
    answer: 1
---

## Les bases

| Notion | JavaScript | Python |
|---|---|---|
| afficher | `console.log("Bonjour", nom)` | `print("Bonjour", nom)` |
| variable | `let total = 0` / `const TAUX = 0.2` | `total = 0` / `TAUX = 0.2` (convention) |
| commentaire | `// …` | `# …` |
| texte avec valeurs | `` `Bonjour ${nom}` `` | `f"Bonjour {nom}"` |
| vrai, faux, rien | `true`, `false`, `null` | `True`, `False`, `None` |
| et, ou, non | `&&`, `\|\|`, `!` | `and`, `or`, `not` |
| égalité | `===` | `==` |

## Les blocs : accolades contre indentation

```js
if (age >= 18) {
  console.log("majeur");
} else if (age >= 16) {
  console.log("presque");
} else {
  console.log("mineur");
}
```

```python
if age >= 18:
    print("majeur")
elif age >= 16:
    print("presque")
else:
    print("mineur")
```

En Python, l'**indentation fait partie de la syntaxe** : quatre espaces délimitent le bloc.

## Boucles et fonctions

| Notion | JavaScript | Python |
|---|---|---|
| parcourir | `for (const x of liste) { … }` | `for x in liste:` |
| compter | `for (let i = 0; i < 5; i++)` | `for i in range(5):` |
| avec l'indice | `liste.forEach((x, i) => …)` | `for i, x in enumerate(liste):` |
| tant que | `while (n > 0) { … }` | `while n > 0:` |
| fonction | `function aire(l, h) { return l * h; }` | `def aire(l, h):` puis `return l * h` |
| fonction courte | `const double = (x) => x * 2` | `double = lambda x: x * 2` |

## Listes et dictionnaires

| Notion | JavaScript | Python |
|---|---|---|
| liste | `const l = [1, 2, 3]` | `l = [1, 2, 3]` |
| taille | `l.length` | `len(l)` |
| ajouter | `l.push(4)` | `l.append(4)` |
| dernier élément | `l.at(-1)` | `l[-1]` |
| extrait | `l.slice(1, 3)` | `l[1:3]` |
| transformer | `l.map((x) => x * 2)` | `[x * 2 for x in l]` |
| filtrer | `l.filter((x) => x > 1)` | `[x for x in l if x > 1]` |
| objet / dictionnaire | `const u = { nom: "Ada" }` | `u = {"nom": "Ada"}` |
| lire une clé | `u.nom` ou `u["nom"]` | `u["nom"]` |
| clé absente | `u.age` donne `undefined` | `u["age"]` lève `KeyError` ; `u.get("age")` donne `None` |
| clés | `Object.keys(u)` | `u.keys()` |

La « compréhension de liste » `[x * 2 for x in l]` est l'idiome Python par excellence :
elle remplace `map` et `filter`.

```python
prix = [12, 5, 30]
ttc = [round(p * 1.2, 2) for p in prix if p > 10]
print(ttc)
```

```output
[14.4, 36.0]
```

## Erreurs et modules

| Notion | JavaScript | Python |
|---|---|---|
| lever | `throw new Error("stock vide")` | `raise ValueError("stock vide")` |
| attraper | `try { … } catch (e) { … }` | `try:` … `except ValueError as e:` |
| importer | `import { aire } from "./geo.js"` | `from geo import aire` |
| paquets | `npm install`, `package.json` | `pip install`, `requirements.txt` |
| tests | `node --test`, `assert.equal(a, b)` | `pytest`, `assert a == b` |

## Ce que tu sais faire maintenant

- Traduire les bases, les blocs, les boucles et les fonctions de JavaScript en Python.
- Manipuler listes et dictionnaires avec les équivalents Python.
- Écrire une compréhension de liste à la place de `map` et `filter`.
- Lever et attraper des erreurs, importer un module.
