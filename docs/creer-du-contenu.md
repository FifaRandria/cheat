# Créer du contenu : leçons et niveaux

Tout le contenu pédagogique vit dans `content/`, versionné dans Git. Aucune ligne de code de
la plateforme n'est à modifier pour ajouter une leçon ou un niveau.

```
content/
  parcours.yml                         les parcours et leurs modules
  web/                                 un dossier par parcours
    js-bases/                          un dossier par module
      lessons/
        01-premier-programme.md        une leçon = un fichier Markdown
      levels/
        01-panier-constant/            un niveau = un dossier
          level.yml
          starter/  tests/  solution/  postmortem.md
  ia/…
  projet/…
```

En développement, l'API surveille `content/` : enregistre un fichier, recharge la page,
c'est à jour. Avant de committer, lance toujours :

```bash
npm run levels:check   # vérifie tout le contenu (runner requis pour les niveaux de code)
```

## La méthode : apprendre, puis réparer

Chaque module suit la même logique :

1. des **leçons** courtes qui expliquent une notion avec des exemples simples ;
2. des **niveaux** qui mettent cette notion à l'épreuve, dans une situation réaliste ;
3. chaque niveau **renvoie** vers les leçons qui l'expliquent (`lessons:` dans `level.yml`).

Un niveau ne doit jamais exiger une notion qui n'a pas été enseignée avant lui.

---

## Écrire une leçon

```markdown
---
id: js-bases-03                  # unique sur toute la plateforme
title: Prendre des décisions avec if
minutes: 10                      # temps de lecture estimé
summary: Une phrase qui dit ce qu'on saura faire à la fin.
xp: 10                           # facultatif, 10 par défaut
check:                           # auto-évaluation en fin de leçon (facultatif)
  - prompt: "Que fait `if (role = \"admin\")` ?"
    choices:
      - Il compare role et "admin"
      - "Il range \"admin\" dans role : la condition est toujours vraie"
    answer: 1                    # index de la bonne réponse, à partir de 0
    explain: Explication affichée après la réponse.
---

## Premier titre de section

Le texte de la leçon…
```

L'ordre des leçons vient du numéro du fichier (`01-`, `02-`…).

### Règles d'écriture

- **Une idée par section** (`##`). Les sections sont numérotées automatiquement.
- **Partir du concret** : une analogie ou une situation, puis la règle, puis le piège.
- **Un exemple court après chaque idée**, que le lecteur peut deviner avant de l'exécuter.
- **Montrer le bug** que les niveaux du module feront réparer, avec son message d'erreur exact.
- **Finir par « Ce que tu sais faire maintenant »** : 3 à 5 compétences concrètes.
- Tutoyer, phrases courtes, pas de jargon non expliqué.

### Blocs spéciaux

| Syntaxe | Rendu |
|---|---|
| ` ```js run ` | exemple JavaScript **exécutable et modifiable** dans la page |
| ` ```js ` ou ` ```python ` | code coloré, non exécutable |
| ` ```output ` | la sortie d'un programme (pour les exemples Python) |
| `> **À retenir** : …` | encadré vert, l'idée clé |
| `> **Attention** : …` | encadré rouge, le piège |
| `> **Astuce** : …` ou `> **Analogie** : …` | encadré ambre |

Les exemples `js run` s'exécutent dans un Web Worker isolé, coupé au bout de 5 secondes.
Python ne s'exécute pas dans le navigateur : fais suivre chaque exemple d'un bloc `output`.

> En YAML, une valeur qui contient `: ` doit être entre guillemets, sinon elle est lue comme
> un objet. `levels:check` signale l'erreur avec le fichier et le champ concernés.

---

## Les trois types de niveaux

Champs communs à tous les `level.yml` :

```yaml
id: js-bases-01
title: Le panier qui refuse de compter
order: 1                         # position dans le module
type: bug-hunt                   # bug-hunt | quiz | ordering
difficulty: 1                    # 1 à 5
xp: 30
blackout: false                  # true : aucun indice
hintCost: 5                      # XP retirée par indice ouvert
bugType: const-reassign          # famille de bug, regroupée dans le musée de bugs
lessons: [js-bases-02]           # leçons à relire, affichées dans le dossier
brief: |                         # énoncé en Markdown
  …
logs: |                          # facultatif : « logs de production »
  …
hints:                           # du plus vague au plus précis
  - …
```

### 1. `bug-hunt` : du code cassé à réparer

```yaml
type: bug-hunt
runtime: node                    # node ou python
entry: panier.js                 # fichier ouvert par défaut
```

- `starter/` : le code de départ, avec le bug. Tous ses fichiers sont modifiables par le joueur.
- `tests/` : les tests de validation, jamais visibles ni modifiables par le joueur.
- `solution/` : la correction de référence, utilisée par `levels:check`.
- `postmortem.md` : `## Cause racine`, `## Correctif`, `## Le réflexe à garder`.

**JavaScript** : les fichiers sont des modules ES. Les tests utilisent `node:test` :

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { totalPanier } from "../src/panier.js";   // le code du joueur est dans src/

test("un panier de trois articles additionne les prix", () => {
  assert.equal(totalPanier([10, 5, 2.5]), 17.5);
});
```

**Python** : fichiers `tests/test_*.py`, fonctions `test_*`. La première ligne de la
docstring devient le nom affiché au joueur. Le code du joueur s'importe directement :

```python
from accueil import message_accueil

def test_ada():
    """salue Ada avec son âge"""
    resultat = message_accueil("Ada", 36)
    assert resultat == "Bienvenue Ada ! Tu as 36 ans.", f"obtenu : {resultat!r}"
```

Le message de l'assertion est affiché au joueur en cas d'échec : utilise-le pour guider.
Quand une exception survient, le joueur voit aussi la ligne fautive de **son** fichier.

### 2. `quiz` : des mises en situation

Idéal pour la gestion de projet et les concepts d'IA. Les bonnes réponses ne quittent jamais
le serveur.

```yaml
type: quiz
questions:
  - prompt: |
      Une situation réaliste, en Markdown (tableaux et code acceptés).
    choices:
      - Réponse A
      - Réponse B
    answer: 1
    hint: Piste affichée en cas d'erreur, sans donner la réponse.
    explain: Explication affichée dans le post-mortem.
```

Le post-mortem est **généré** à partir des questions, des bonnes réponses et des `explain`.
Un `postmortem.md`, s'il existe, est ajouté à la suite.

Conseils : des distracteurs plausibles (les erreurs que font vraiment les débutants), et
varie la position de la bonne réponse.

### 3. `ordering` : remettre des étapes dans l'ordre

```yaml
type: ordering
steps:                           # dans le BON ordre ; le joueur les reçoit mélangées
  - label: Préparer le dataset
    detail: Facultatif, une précision affichée sous l'étape.
  - label: Charger le modèle de base
  - label: Entraîner
```

Au moins trois étapes. Le mélange est toujours le même pour un niveau donné, et n'est jamais
déjà dans le bon ordre.

---

## Ajouter un module ou un parcours

Dans `content/parcours.yml`, ajoute une entrée :

```yaml
    - id: express              # = nom du dossier content/<parcours>/express/
      code: W3
      title: Backend Express et API REST
      tagline: Routes, middlewares, validation, JWT.
      notions: [Routes, Middlewares, Validation, JWT]
      phase: V1
```

Un module sans leçon ni niveau apparaît « en chantier » sur la carte. Il s'ouvre dès que
son dossier contient du contenu.
