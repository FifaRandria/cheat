---
id: sql-01
title: Tables et requêtes SELECT
minutes: 12
summary: Ce qu'est une base relationnelle, et comment lire des données avec SELECT, WHERE, ORDER BY et LIMIT.
check:
  - prompt: "Que renvoie `SELECT nom FROM clients WHERE ville = 'Paris'` ?"
    choices:
      - Tous les clients
      - Le nom des clients dont la ville est Paris
      - Le nombre de clients à Paris
    answer: 1
  - prompt: À quoi sert une clé primaire (PRIMARY KEY) ?
    choices:
      - À trier la table
      - À identifier chaque ligne de façon unique
      - À chiffrer les données
    answer: 1
  - prompt: "Comment obtenir les 3 commandes les plus chères ?"
    choices:
      - "SELECT * FROM commandes LIMIT 3"
      - "SELECT * FROM commandes ORDER BY total DESC LIMIT 3"
      - "SELECT * FROM commandes ORDER BY total LIMIT 3"
    answer: 1
---

## Une base de données, des tableaux reliés

Une base de données **relationnelle** (PostgreSQL, MySQL, SQLite…) range les informations
dans des **tables**, comme des feuilles de tableur :

- chaque **colonne** a un nom et un type (`nom TEXT`, `total REAL`) ;
- chaque **ligne** est un enregistrement (un client, une commande) ;
- chaque table a une **clé primaire** (`id`) qui identifie chaque ligne de façon unique.

La table `clients` des exercices :

| id | nom | ville |
|---|---|---|
| 1 | Ada | Paris |
| 2 | Bob | Lyon |
| 3 | Eve | Paris |
| 4 | Linus | Nantes |

Pour parler à la base, on utilise le langage **SQL**. Les exercices de ce module tournent sur
**SQLite**, intégré à Node. Les requêtes de base sont les mêmes qu'avec PostgreSQL, que tu
utiliseras en production.

> **Déjà vu** : une table ressemble aux tableaux d'objets du module « Bases de JavaScript » :
> une ligne est un objet, une colonne une propriété.

## Lire avec SELECT

```sql
SELECT nom, ville FROM clients;
```

```output
nom   | ville
Ada   | Paris
Bob   | Lyon
Eve   | Paris
Linus | Nantes
```

`SELECT` dit **quelles colonnes**, `FROM` dit **dans quelle table**. `SELECT *` prend toutes
les colonnes.

## Filtrer avec WHERE

```sql
SELECT nom FROM clients WHERE ville = 'Paris';
```

```output
nom
Ada
Eve
```

Les textes s'écrivent entre **apostrophes** simples. On combine les conditions avec `AND`,
`OR` et `NOT`, et on compare avec `=`, `<>` (différent), `<`, `>`, `<=`, `>=`.

```sql
SELECT * FROM commandes WHERE total > 20 AND statut = 'payee';
```

## Trier et limiter

```sql
SELECT id, total FROM commandes ORDER BY total DESC LIMIT 2;
```

```output
id | total
3  | 189
1  | 49
```

- `ORDER BY total` trie par total croissant ; `DESC` inverse l'ordre ;
- `LIMIT 2` ne garde que les deux premières lignes.

## Compter et résumer

Les fonctions d'agrégation résument plusieurs lignes en une valeur :

```sql
SELECT COUNT(*) AS nombre, SUM(total) AS chiffre, AVG(total) AS panier_moyen
FROM commandes;
```

```output
nombre | chiffre | panier_moyen
4      | 275     | 68.75
```

`AS` donne un nom à la colonne du résultat.

## Depuis JavaScript

Avec `node:sqlite` (et c'est très proche avec les autres bibliothèques) :

```js
const clients = db.prepare("SELECT nom FROM clients WHERE ville = ?").all("Paris");
// [{ nom: "Ada" }, { nom: "Eve" }]

const ada = db.prepare("SELECT * FROM clients WHERE id = ?").get(1);
// { id: 1, nom: "Ada", ville: "Paris" }   (ou undefined si introuvable)
```

- `.all(...)` renvoie **toutes** les lignes, dans un tableau ;
- `.get(...)` renvoie **la première** ligne, ou `undefined` ;
- le `?` est un **paramètre**, remplacé par la valeur passée. On verra dans la leçon suivante
  pourquoi c'est vital.

## Ce que tu sais faire maintenant

- Expliquer tables, lignes, colonnes et clé primaire.
- Lire des données avec `SELECT`, les filtrer avec `WHERE`, les trier et les limiter.
- Résumer avec `COUNT`, `SUM` et `AVG`.
- Exécuter une requête depuis JavaScript avec `.all` et `.get`.
