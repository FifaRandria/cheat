# Créer un niveau

Un niveau est un dossier autonome dans `levels/<module>/<niveau>/`. Aucune
ligne de code de la plateforme n'est à modifier.

```
levels/
  modules.yml                     carte du parcours (M0 à M12)
  m1-async/
    01-await-manquant/
      level.yml                   métadonnées, énoncé, logs, indices
      starter/                    code de départ, avec le bug
      tests/                      tests de validation (*.test.js)
      solution/                   correction de référence
      postmortem.md               cause racine, affichée après la réussite
```

## 1. Le scénario avant le code

Un bon niveau raconte **un incident** :

- un **symptôme** observable (« la page profil est vide », « 0 e-mail envoyé ») ;
- des **logs** qui contiennent l'indice principal, pour qui sait les lire ;
- **une seule cause racine** : le joueur doit pouvoir l'isoler.

Évite les bugs « cachés » sans rapport avec la notion du module : on veut
entraîner un diagnostic, pas une chasse au trésor.

## 2. `level.yml`

```yaml
id: m1-async-01            # unique sur toute la plateforme
title: Le await oublié
module: m1-async           # doit exister dans modules.yml
order: 1                   # position dans le module
type: bug-hunt
runtime: node              # node (python arrive avec M8)
difficulty: 1              # 1 à 5, affiché en « gravité »
xp: 50
blackout: false            # true : aucun indice, ambiance Blackout
hintCost: 10               # XP retirée par indice ouvert
bugType: async-await       # famille de bug, regroupée dans le musée
entry: profile.js          # fichier ouvert par défaut
brief: |                   # énoncé en Markdown
  La page profil affiche un avatar vide…
logs: |                    # facultatif : « logs de production »
  [api] GET /api/profile/1 → 200 (3 ms)
hints:                     # du plus vague au plus précis
  - Ajoute un console.log(user)…
  - Une fonction async renvoie toujours une promesse…
tests: tests/
```

Règles :

- **Les indices sont progressifs.** Le premier oriente le regard, le dernier
  nomme presque la solution. Ils ne donnent jamais le code.
- En **Blackout**, laisse `hints: []`. Mets plutôt un lien vers la
  documentation officielle dans l'énoncé.
- La récompense ne descend jamais sous 25 % de `xp`, quel que soit le nombre
  d'indices ouverts.

## 3. Le code de départ (`starter/`)

- Tous les fichiers de `starter/` sont modifiables par le joueur ; aucun autre
  fichier ne peut être ajouté.
- Les fichiers sont exécutés comme des **modules ES** (`import`/`export`).
- Garde-le court : 15 à 40 lignes par fichier. Un fichier « décor », comme
  `db.js`, peut simuler une dépendance ; dis dans l'énoncé qu'il n'est pas en
  cause.

## 4. Les tests (`tests/`)

Les tests utilisent le test runner intégré de Node, sans aucune dépendance :

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { getProfile } from "../src/profile.js"; // le code du joueur est dans src/

test("renvoie le nom et l'offre d'un utilisateur existant", async () => {
  assert.deepEqual(await getProfile(1), { name: "Ada", plan: "pro" });
});
```

- **Le nom du test est affiché au joueur** : écris-le comme une exigence
  lisible, en français.
- Le message d'une assertion apparaît en cas d'échec : utilise-le pour guider
  (`assert.equal(outbox.length, 3, "certains e-mails partent après la fin")`).
- Les tests n'ont pas accès au réseau et doivent finir en moins de 8 secondes.
- Teste le comportement, pas l'implémentation : toute correction valide doit
  passer.

## 5. Le post-mortem (`postmortem.md`)

Trois sections, toujours dans cet ordre :

```markdown
## Cause racine
Ce qui se passait vraiment, et pourquoi les symptômes avaient cette forme.

## Correctif
Le changement minimal, en code.

## Le réflexe à garder
Comment reconnaître ce bug la prochaine fois, en une ou deux phrases.
```

Le ton est bienveillant : le joueur vient de réussir.

## 6. Vérifier

```bash
npm run dev:runner                    # dans un terminal
npm run levels:check                  # tous les niveaux
npm run levels:check m1-async-01      # un seul
```

Le script vérifie que **le code de départ échoue** à au moins un test et que
**la solution les passe tous**. En développement, l'API relit les fichiers à
chaque requête : recharge simplement la page du niveau.
