---
id: web-boss-01
title: "Le projet : la Boîte à outils"
minutes: 12
summary: Le cahier des charges du projet final, son modèle de données, son API, et le plan pour le construire étape par étape.
check:
  - prompt: Pourquoi définir un MVP avant de coder ?
    choices:
      - Pour livrer vite une première version utile, et apprendre des vrais utilisateurs avant d'en faire plus
      - Pour éviter d'écrire des tests
      - Pour pouvoir tout livrer d'un coup à la fin
    answer: 0
  - prompt: Quelle colonne permet de savoir si un outil est actuellement prêté ?
    choices:
      - "`prets.debut`"
      - "`prets.rendu_le`, qui reste NULL tant que l'outil n'est pas rendu"
      - "`outils.categorie`"
    answer: 1
  - prompt: Un membre tente d'emprunter un outil déjà prêté. Quel code HTTP ?
    choices:
      - "500 : c'est une erreur"
      - "409 Conflict : la demande est valide, mais contredit l'état actuel"
      - "200, avec un message d'erreur dans le corps"
    answer: 1
---

## Le client

L'association **La Boîte à outils** prête du matériel de bricolage à ses membres : perceuse,
escabeau, brouette… Aujourd'hui, tout se fait sur un cahier papier. Résultat : des outils
« perdus », des membres qui attendent un outil déjà parti, et personne pour relancer les
retardataires.

Tu vas construire leur application, du plan jusqu'à la mise en production. Ce module réunit
tout ce que tu as appris : JavaScript, SQL, API REST, sécurité, tests, Docker et CI.

## Les besoins, en user stories

| En tant que… | je veux… | afin de… |
|---|---|---|
| visiteur | voir les outils et leur disponibilité | savoir s'il vaut la peine de passer |
| membre | emprunter un outil disponible | bricoler ce week-end |
| membre | rendre un outil | libérer l'outil pour les autres |
| membre | voir l'historique de **mes** prêts | savoir ce que je dois rendre |
| bénévole | recevoir chaque matin la liste des retards | relancer les retardataires |

Le **MVP** (première version utile) couvre ces cinq histoires. Les réservations, les photos et
les notifications par SMS attendront la version 2.

## Le modèle de données

```sql
CREATE TABLE membres (id INTEGER PRIMARY KEY, nom TEXT, jeton TEXT UNIQUE);
CREATE TABLE outils  (id INTEGER PRIMARY KEY, nom TEXT, categorie TEXT);
CREATE TABLE prets (
  id         INTEGER PRIMARY KEY,
  outil_id   INTEGER REFERENCES outils(id),
  membre_id  INTEGER REFERENCES membres(id),
  debut      TEXT,     -- '2026-11-20'
  fin_prevue TEXT,     -- debut + 7 jours
  rendu_le   TEXT      -- NULL tant que l'outil n'est pas rendu
);
```

> **À retenir** : la disponibilité d'un outil n'est **stockée nulle part**. Elle se **déduit** :
> un outil est disponible s'il n'a aucun prêt avec `rendu_le IS NULL`. Stocker la même
> information à deux endroits, c'est s'exposer à ce qu'ils se contredisent un jour.

## Le contrat de l'API

| Route | Accès | Succès | Erreurs |
|---|---|---|---|
| `GET /outils?categorie=…` | public | 200 | |
| `POST /prets` `{ outilId }` | connecté | 201 | 400 (données invalides), 401, 404 (outil inconnu), 409 (déjà prêté) |
| `POST /prets/:id/retour` | l'emprunteur | 200 | 401, 403, 404, 409 (déjà rendu) |
| `GET /membres/:id/prets` | le membre lui-même | 200 | 401, 403 |

La connexion se fait avec un en-tête `Authorization: Bearer <jeton>`.

## Le plan de construction

Le projet se construit en sept étapes, une par niveau :

1. **Planifier** : l'ordre des étapes d'un projet.
2. **Le dépôt de données** : écrire les requêtes SQL.
3. **L'API REST** : écrire les routes.
4. **L'audit de sécurité** : corriger les failles trouvées par un auditeur.
5. **Les tests de non-régression** : écrire les tests qui protègent les règles.
6. **L'incident de production** : en mode Blackout.
7. **La mise en production** : Docker, CI et retour arrière.

## Ce que tu sais faire maintenant

- Traduire des besoins en user stories et délimiter un MVP.
- Lire un modèle de données et en déduire une information (la disponibilité).
- Lire le contrat d'une API : routes, droits d'accès et codes de retour.
