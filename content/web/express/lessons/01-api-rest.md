---
id: express-01
title: Une API REST, c'est quoi ?
minutes: 12
summary: Requêtes et réponses HTTP, ressources, méthodes et codes de statut. Le vocabulaire de tout backend.
check:
  - prompt: Quelle méthode HTTP utiliser pour créer une nouvelle réservation ?
    choices: ["GET", "POST", "DELETE"]
    answer: 1
  - prompt: Un client demande le produit 999, qui n'existe pas. Quel code renvoyer ?
    choices: ["200 OK, avec un corps vide", "404 Not Found", "500 Internal Server Error"]
    answer: 1
    explain: "500 signifie que le serveur a planté. Ici, le serveur fonctionne : c'est la ressource qui n'existe pas."
  - prompt: Que signifie un code de la famille 4xx ?
    choices:
      - Le serveur a planté
      - La requête du client pose problème (introuvable, non autorisée, invalide…)
      - Tout s'est bien passé
    answer: 1
---

## Le serveur, un guichet

Quand ton navigateur affiche une page ou qu'une application mobile charge tes messages, elle
envoie une **requête** à un serveur, qui répond par une **réponse**. C'est le protocole
**HTTP**.

Une **API** (*Application Programming Interface*) est un guichet que le serveur ouvre aux
autres programmes : au lieu de pages HTML, il échange des **données**, le plus souvent en
**JSON**.

> **Déjà vu** : les méthodes et les codes HTTP viennent du module « Terminal, Git et HTTP » ;
> l'autre côté de la requête, `fetch`, du module « JavaScript dans le navigateur ».

## Anatomie d'un échange

Une requête contient :

- une **méthode** : ce qu'on veut faire (`GET`, `POST`…) ;
- un **chemin** : sur quoi (`/produits/42`) ;
- des **en-têtes** : des informations annexes (`Authorization`, `Content-Type`) ;
- parfois un **corps** (*body*) : les données envoyées, en JSON.

La réponse contient :

- un **code de statut** : est-ce que ça s'est bien passé ? (`200`, `404`…) ;
- des en-têtes ;
- un corps : les données demandées, ou un message d'erreur.

```output
→ GET /produits/42
← 200 OK
  { "id": 42, "nom": "Clavier", "prix": 49 }
```

## REST : des ressources et des verbes

**REST** est une façon d'organiser une API autour de **ressources** (des produits, des
commandes, des utilisateurs), manipulées avec les **méthodes** HTTP :

| Méthode | Chemin | Action |
|---|---|---|
| `GET` | `/produits` | lister les produits |
| `GET` | `/produits/42` | lire le produit 42 |
| `POST` | `/produits` | créer un produit |
| `PUT` | `/produits/42` | modifier le produit 42 |
| `DELETE` | `/produits/42` | supprimer le produit 42 |

Le chemin désigne **quoi**, la méthode dit **quoi faire**. On évite donc les chemins comme
`/supprimerProduit?id=42`.

## Les codes de statut

Le premier chiffre donne la famille :

| Famille | Sens | Exemples |
|---|---|---|
| **2xx** | ça a marché | `200 OK`, `201 Created`, `204 No Content` |
| **4xx** | la requête du **client** pose problème | `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found` |
| **5xx** | le **serveur** a un problème | `500 Internal Server Error`, `503 Service Unavailable` |

> **À retenir** : le code de statut est une information pour les programmes qui appellent ton
> API. Un `200` qui contient `{ "error": "introuvable" }` est un mensonge : le client croit
> que tout va bien.

> **Attention** : `401` veut dire « je ne sais pas qui tu es » (pas connecté), `403` veut dire
> « je sais qui tu es, mais tu n'as pas le droit ». On les confond souvent.

## Le JSON

Le corps des requêtes et des réponses est presque toujours du **JSON**, un format texte qui
ressemble aux objets JavaScript :

```js run
const produit = { id: 42, nom: "Clavier", prix: 49, enStock: true };

const texte = JSON.stringify(produit);  // objet vers texte, pour l'envoyer
console.log(texte);

const relu = JSON.parse(texte);         // texte vers objet, à la réception
console.log(relu.nom);
```

## Express

**Express** est le framework le plus utilisé pour écrire une API en Node.js. Une API complète
tient en quelques lignes :

```js
import express from "express";
const app = express();

app.get("/produits/:id", (req, res) => {
  res.json({ id: req.params.id, nom: "Clavier" });
});

app.listen(3000);
```

Les leçons suivantes détaillent les routes, les middlewares et la gestion des erreurs.

## Ce que tu sais faire maintenant

- Décrire une requête et une réponse HTTP.
- Associer chaque action à la bonne méthode REST.
- Choisir le bon code de statut, en distinguant 4xx et 5xx, et 401 et 403.
- Convertir entre objet et JSON.
