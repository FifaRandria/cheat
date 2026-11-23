---
id: outils-04
title: HTTP en pratique, DevTools et curl
minutes: 13
summary: Observer les vraies requêtes d'une page, lire en-têtes et codes, rejouer une requête avec curl, et lire un log d'accès.
check:
  - prompt: Où voir les requêtes envoyées par une page web, avec leur code de statut et leur durée ?
    choices:
      - Dans l'onglet Réseau (Network) des outils de développement du navigateur
      - Dans le code source de la page
      - Nulle part
    answer: 0
  - prompt: "Que fait `curl -i https://api.exemple.com/produits/1` ?"
    choices:
      - Il installe l'API
      - Il envoie une requête GET et affiche la réponse avec ses en-têtes
      - Il supprime le produit 1
    answer: 1
  - prompt: "Dans un log d'accès, la ligne `GET /api/panier?page=2 503 1204ms` indique…"
    choices:
      - Une requête réussie
      - Une erreur côté serveur (5xx), qui a mis plus d'une seconde
      - Une erreur du client
    answer: 1
---

## L'onglet Réseau

Dans le navigateur, **F12** ouvre les outils de développement. L'onglet **Réseau** (*Network*)
liste toutes les requêtes de la page :

| Colonne | Ce qu'elle dit |
|---|---|
| Nom / URL | ce qui a été demandé |
| Méthode | `GET`, `POST`… |
| Statut | `200`, `404`, `500`… |
| Type | document, script, image, requête d'API (`fetch`) |
| Durée | combien de temps la réponse a mis |

En cliquant sur une requête, on voit ses **en-têtes**, le corps envoyé et la réponse reçue.

> **Astuce** : quand « la page ne marche pas », ouvre l'onglet Réseau **avant** de lire le code.
> Une requête en rouge (4xx ou 5xx) te dit immédiatement si le problème vient du frontend ou
> de l'API.

## Les en-têtes utiles

| En-tête | Sens |
|---|---|
| `Content-Type: application/json` | le corps est du JSON |
| `Authorization: Bearer …` | le jeton d'authentification |
| `Cache-Control: no-cache` | ne pas réutiliser une copie en cache |
| `Location: /commandes/42` | où se trouve la ressource créée, ou la redirection |

## Rejouer une requête avec curl

`curl` envoie des requêtes HTTP depuis le terminal. Parfait pour tester une API sans
navigateur, ou sur un serveur :

```bash
curl https://api.exemple.com/produits/1               # GET
curl -i https://api.exemple.com/produits/1            # avec les en-têtes de la réponse
curl -X POST https://api.exemple.com/produits \
     -H "Content-Type: application/json" \
     -d '{"nom": "Souris"}'                            # POST avec un corps JSON
```

```output
HTTP/1.1 201 Created
Content-Type: application/json
Location: /produits/3

{"id":3,"nom":"Souris"}
```

## Lire un log d'accès

Chaque requête reçue par un serveur est souvent enregistrée dans un **log d'accès**, une ligne
par requête :

```output
2026-11-23T21:02:14 GET /api/produits 200 12ms
2026-11-23T21:02:15 GET /api/panier?page=2 503 1204ms
2026-11-23T21:02:15 POST /api/commandes 500 88ms
2026-11-23T21:02:16 GET /api/produits/99 404 4ms
```

Pour l'analyser, on découpe chaque ligne en champs. Deux pièges classiques :

- la **query** (`?page=2`) fait apparaître la même route sous plusieurs formes : on la retire
  pour regrouper (`/api/panier`) ;
- « erreur serveur » signifie **tout** le `5xx`, de 500 à 599, **500 compris**.

```js run
const ligne = "2026-11-23T21:02:15 GET /api/panier?page=2 503 1204ms";
const [date, methode, url, statut, duree] = ligne.split(" ");
const route = url.split("?")[0];
console.log({ methode, route, statut: Number(statut), duree });
console.log("erreur serveur ?", Number(statut) >= 500 && Number(statut) <= 599);
```

## Ce que tu sais faire maintenant

- Observer les requêtes d'une page dans l'onglet Réseau.
- Lire les en-têtes et codes de statut utiles.
- Envoyer et rejouer une requête avec `curl`.
- Découper une ligne de log d'accès et regrouper les routes.
