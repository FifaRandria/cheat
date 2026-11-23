---
id: sql-02
title: Modifier sans tout casser
minutes: 14
summary: INSERT, UPDATE et DELETE, le WHERE qu'il ne faut jamais oublier, et les requêtes préparées contre l'injection SQL.
check:
  - prompt: "Que fait `UPDATE commandes SET statut = 'annulee'` (sans WHERE) ?"
    choices:
      - Il annule la dernière commande
      - Il annule TOUTES les commandes de la table
      - Il provoque une erreur
    answer: 1
  - prompt: "Pourquoi le code `\"SELECT * FROM clients WHERE nom = '\" + nom + \"'\"` est-il dangereux ?"
    choices:
      - Il est lent
      - "Un utilisateur peut injecter du SQL dans `nom` et modifier le sens de la requête"
      - Il ne fonctionne pas avec les accents
    answer: 1
  - prompt: "Comment passer une valeur saisie par l'utilisateur à une requête ?"
    choices:
      - En la collant dans le texte SQL
      - "Avec un paramètre `?` dans une requête préparée"
    answer: 1
---

## Ajouter, modifier, supprimer

```sql
INSERT INTO clients (nom, ville) VALUES ('Grace', 'Lille');

UPDATE commandes SET statut = 'annulee' WHERE id = 3;

DELETE FROM commandes WHERE id = 4;
```

| Commande | Effet |
|---|---|
| `INSERT INTO … VALUES …` | ajoute une ligne |
| `UPDATE … SET … WHERE …` | modifie les lignes qui correspondent au `WHERE` |
| `DELETE FROM … WHERE …` | supprime les lignes qui correspondent au `WHERE` |

## Le WHERE oublié

`UPDATE` et `DELETE` s'appliquent à **toutes les lignes qui vérifient le `WHERE`**. Sans
`WHERE`, elles s'appliquent… à **toutes les lignes de la table**.

```sql
UPDATE commandes SET statut = 'annulee';   -- toutes les commandes annulées !
DELETE FROM clients;                        -- tous les clients supprimés !
```

Aucune erreur, aucune confirmation : la base fait exactement ce qu'on lui demande.

> **Attention** : c'est l'un des incidents de production les plus célèbres et les plus
> fréquents. Avant d'exécuter un `UPDATE` ou un `DELETE` à la main, lance d'abord le `SELECT`
> avec le même `WHERE`, pour voir quelles lignes seront touchées.

Depuis le code, on vérifie le nombre de lignes modifiées :

```js
const r = db.prepare("UPDATE commandes SET statut = 'annulee' WHERE id = ?").run(3);
console.log(r.changes); // 1 : une seule ligne touchée, comme prévu
```

## L'injection SQL

Imagine une recherche de client écrite ainsi :

```js
const sql = "SELECT * FROM clients WHERE nom = '" + nom + "'";
```

Avec `nom = "Ada"`, la requête est normale. Mais si un visiteur tape :

```output
' OR '1'='1
```

la requête devient :

```sql
SELECT * FROM clients WHERE nom = '' OR '1'='1'
```

La condition est toujours vraie : **tous** les clients sont renvoyés. Avec d'autres saisies,
un attaquant peut lire des tables entières, ou en supprimer. C'est l'**injection SQL**, l'une
des failles les plus exploitées du web depuis 25 ans.

## La parade : les requêtes préparées

On n'assemble **jamais** du SQL avec des données venant de l'utilisateur. On utilise des
**paramètres** :

```js
db.prepare("SELECT * FROM clients WHERE nom = ?").all(nom);
```

Le `?` n'est pas remplacé par du texte collé : la base reçoit séparément la requête et la
valeur. Quoi que contienne `nom`, ce sera toujours **une simple valeur**, jamais du code SQL.

> **À retenir** : toute valeur qui vient de l'extérieur (formulaire, URL, API) passe par un
> paramètre `?`. Sans exception, même « juste pour un petit script ».

Les ORM comme **Prisma** utilisent des requêtes préparées automatiquement : c'est l'une des
raisons de les utiliser.

## Ce que tu sais faire maintenant

- Ajouter, modifier et supprimer des lignes.
- Ne jamais lancer `UPDATE` ou `DELETE` sans `WHERE`, et vérifier `changes`.
- Expliquer une injection SQL et s'en protéger avec des paramètres.
