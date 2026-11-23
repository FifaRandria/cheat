---
id: sql-03
title: Relier les tables avec JOIN
minutes: 14
summary: Clés étrangères, INNER JOIN et LEFT JOIN, GROUP BY. Et le client qui disparaît du rapport.
check:
  - prompt: "Un client n'a passé aucune commande. Apparaît-il dans `clients INNER JOIN commandes` ?"
    choices: ["Oui", "Non"]
    answer: 1
    explain: "INNER JOIN ne garde que les lignes qui ont une correspondance des deux côtés."
  - prompt: "Pour lister TOUS les clients avec leur nombre de commandes, y compris zéro, quelle jointure ?"
    choices: ["INNER JOIN", "LEFT JOIN depuis clients"]
    answer: 1
  - prompt: "Avec un LEFT JOIN, pourquoi compter `COUNT(commandes.id)` plutôt que `COUNT(*)` ?"
    choices:
      - C'est plus rapide
      - "COUNT(*) compterait 1 pour un client sans commande (la ligne existe, remplie de NULL)"
      - Aucune différence
    answer: 1
---

## Des tables reliées

Les commandes ne recopient pas le nom et la ville du client : elles stockent seulement son
identifiant, dans une **clé étrangère** (`client_id`) :

| commandes.id | client_id | total |
|---|---|---|
| 1 | 1 | 49 |
| 2 | 1 | 25 |
| 3 | 2 | 189 |
| 4 | 3 | 12 |

Si Ada déménage, on modifie **une** ligne dans `clients`, et toutes ses commandes sont à jour.
C'est le principe des bases **relationnelles** : chaque information à un seul endroit.

## INNER JOIN : les correspondances

Pour afficher les commandes avec le nom du client, on **joint** les deux tables :

```sql
SELECT commandes.id, clients.nom, commandes.total
FROM commandes
JOIN clients ON clients.id = commandes.client_id;
```

```output
id | nom | total
1  | Ada | 49
2  | Ada | 25
3  | Bob | 189
4  | Eve | 12
```

`JOIN` (ou `INNER JOIN`) associe chaque commande au client dont l'`id` correspond, selon la
condition `ON`.

## Le client disparu

On veut maintenant le nombre de commandes **par client** :

```sql
SELECT clients.nom, COUNT(commandes.id) AS nb
FROM clients
JOIN commandes ON commandes.client_id = clients.id
GROUP BY clients.id;
```

```output
nom | nb
Ada | 2
Bob | 1
Eve | 1
```

**Linus a disparu.** Il n'a aucune commande, donc aucune correspondance : un `INNER JOIN`
l'élimine. Pour un rapport « clients inactifs », c'est exactement celui qu'on cherchait.

## LEFT JOIN : garder tout le côté gauche

```sql
SELECT clients.nom, COUNT(commandes.id) AS nb
FROM clients
LEFT JOIN commandes ON commandes.client_id = clients.id
GROUP BY clients.id;
```

```output
nom   | nb
Ada   | 2
Bob   | 1
Eve   | 1
Linus | 0
```

`LEFT JOIN` garde **toutes** les lignes de la table de gauche (`clients`), même sans
correspondance. Les colonnes de droite valent alors `NULL`.

> **À retenir** : `INNER JOIN` = seulement les correspondances. `LEFT JOIN` = tout le côté
> gauche, complété quand c'est possible. Demande-toi toujours : « les lignes sans
> correspondance doivent-elles apparaître ? »

> **Attention** : avec un `LEFT JOIN`, compte `COUNT(commandes.id)` et non `COUNT(*)`. Pour
> Linus, la ligne existe (remplie de `NULL`) : `COUNT(*)` donnerait 1 au lieu de 0.

## GROUP BY

`GROUP BY` regroupe les lignes qui partagent une valeur, pour calculer un résumé par groupe :

```sql
SELECT ville, COUNT(*) AS clients FROM clients GROUP BY ville;
```

```output
ville  | clients
Lyon   | 1
Nantes | 1
Paris  | 2
```

## Ce que tu sais faire maintenant

- Expliquer clé primaire et clé étrangère.
- Joindre deux tables avec `JOIN … ON …`.
- Choisir entre `INNER JOIN` et `LEFT JOIN`.
- Résumer par groupe avec `GROUP BY`, et compter correctement après un `LEFT JOIN`.
