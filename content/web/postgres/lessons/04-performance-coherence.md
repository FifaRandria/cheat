---
id: sql-04
title: Index, problème N+1 et transactions
minutes: 15
summary: Pourquoi une page fait 101 requêtes, comment un index accélère une recherche, et comment une transaction évite l'argent perdu.
check:
  - prompt: Une page affiche 100 commandes et fait une requête par commande pour trouver le client. Combien de requêtes au total ?
    choices: ["2", "100", "101"]
    answer: 2
    explain: "1 pour les commandes, puis 100 pour les clients : c'est le problème N+1."
  - prompt: Un virement débite le compte A, puis plante avant de créditer le compte B. Que garantit une transaction ?
    choices:
      - Que le crédit sera retenté plus tard
      - "Que le débit est annulé (ROLLBACK) : tout ou rien"
      - Rien de plus
    answer: 1
  - prompt: À quoi sert un index ?
    choices:
      - À accélérer les recherches sur une colonne, comme l'index d'un livre
      - À trier l'affichage
      - À sauvegarder la table
    answer: 0
---

## Le problème N+1

Une page affiche les 100 dernières commandes, avec le nom du client. Une façon naïve de
l'écrire :

```js
const commandes = db.prepare("SELECT * FROM commandes").all();   // 1 requête
for (const c of commandes) {
  c.client = db.prepare("SELECT nom FROM clients WHERE id = ?").get(c.client_id); // +1 par commande
}
```

Une requête pour la liste, puis **une par commande** : 1 + N requêtes. Avec 100 commandes,
101 allers-retours vers la base. Chacun ne prend que quelques millisecondes… mais ensemble,
la page met des secondes à s'afficher.

> **À retenir** : une requête **dans une boucle** est le signe classique du problème N+1. La
> solution : récupérer tout en **une** requête, avec une jointure.

```js
const commandes = db.prepare(`
  SELECT commandes.id, commandes.total, clients.nom AS client
  FROM commandes
  JOIN clients ON clients.id = commandes.client_id
`).all(); // 1 seule requête
```

Avec un ORM comme Prisma, le même piège existe : charger une relation dans une boucle au lieu
d'utiliser `include`.

## Les index

Pour trouver les commandes d'un client, sans index, la base lit **toute** la table, ligne par
ligne. Avec 10 millions de lignes, c'est long.

Un **index** est comme l'index à la fin d'un livre : il permet d'aller directement aux bonnes
pages.

```sql
CREATE INDEX idx_commandes_client ON commandes (client_id);
```

- On indexe les colonnes souvent utilisées dans `WHERE`, `JOIN` et `ORDER BY` ;
- la clé primaire est indexée automatiquement ;
- chaque index **ralentit un peu les écritures** et prend de la place : on n'indexe pas tout.

## Les transactions

Un virement de 50 € d'Ada vers Bob, c'est **deux** opérations :

```sql
UPDATE comptes SET solde = solde - 50 WHERE id = 1;  -- débit
UPDATE comptes SET solde = solde + 50 WHERE id = 2;  -- crédit
```

Si le programme plante entre les deux, Ada a perdu 50 € que Bob n'a jamais reçus. L'argent a
disparu.

Une **transaction** regroupe plusieurs opérations en un **tout ou rien** :

```js
db.exec("BEGIN");
try {
  db.prepare("UPDATE comptes SET solde = solde - ? WHERE id = ?").run(50, 1);
  db.prepare("UPDATE comptes SET solde = solde + ? WHERE id = ?").run(50, 2);
  db.exec("COMMIT");   // tout est validé d'un coup
} catch (erreur) {
  db.exec("ROLLBACK"); // tout est annulé, comme si rien ne s'était passé
  throw erreur;
}
```

> **Attention** : `UPDATE … WHERE id = 99` sur un compte qui n'existe pas ne lève **aucune
> erreur** : il modifie simplement zéro ligne. Vérifie `changes` pour détecter ce cas, et
> annule la transaction.

> **Astuce** : une contrainte comme `CHECK (solde >= 0)` fait refuser par la base elle-même un
> débit qui rendrait le solde négatif. La base devient un filet de sécurité.

## Ce que tu sais faire maintenant

- Reconnaître et corriger un problème N+1 avec une jointure.
- Expliquer à quoi sert un index et quand en créer un.
- Écrire une transaction avec `BEGIN`, `COMMIT` et `ROLLBACK`.
- Détecter une mise à jour qui n'a touché aucune ligne.
