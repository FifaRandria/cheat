---
id: navigateur-03
title: "fetch : la page parle à ton API"
minutes: 15
summary: Appeler une API depuis la page, vérifier la réponse, afficher le chargement et les erreurs, et comprendre les erreurs CORS.
check:
  - prompt: "Une API répond 404. Que fait `await fetch(url)` ?"
    choices:
      - "Il lève une erreur"
      - "Il réussit normalement : c'est à toi de vérifier `response.ok` (ou `response.status`)"
    answer: 1
  - prompt: "Que manque-t-il à `const outils = fetch(\"/api/outils\").json();` ?"
    choices:
      - "Rien"
      - "Deux await : `const r = await fetch(…); const outils = await r.json();`"
    answer: 1
  - prompt: La console affiche « blocked by CORS policy ». Où se corrige le problème ?
    choices:
      - Dans le code de la page
      - "Sur le serveur de l'API, qui doit autoriser l'origine de la page (en-tête Access-Control-Allow-Origin)"
    answer: 1
---

## Le chaînon manquant

Côté serveur, tu as écrit une API REST (modules Express et projet final). Côté page, tu sais
modifier le DOM. `fetch` relie les deux : la page envoie une requête HTTP, reçoit du JSON, et
l'affiche.

```js
const reponse = await fetch("/api/outils");
const outils = await reponse.json();
```

Deux `await` : le premier attend les **en-têtes** de la réponse, le second le **corps** et sa
conversion en objet. C'est l'asynchrone du module « JavaScript asynchrone », appliqué au réseau.

## Vérifier la réponse

```js
async function chargerOutils() {
  const reponse = await fetch("/api/outils");
  if (!reponse.ok) {
    throw new Error(`Erreur ${reponse.status}`);
  }
  return reponse.json();
}
```

> **Attention** : `fetch` ne lève une erreur **que** si le réseau est coupé. Une réponse 404 ou
> 500 est une réponse « réussie » pour `fetch`. Sans le test `response.ok`, ton code affiche le
> message d'erreur du serveur comme si c'étaient des données.

## Envoyer des données

```js
const reponse = await fetch("/api/prets", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jeton}`,
  },
  body: JSON.stringify({ outilId: 3 }),
});
```

- `method` : `GET` par défaut ; `POST`, `PUT`, `DELETE` pour modifier.
- `body` : un **texte**, d'où `JSON.stringify`.
- `Content-Type` dit au serveur que c'est du JSON.

## Les trois états d'un chargement

Une interface correcte montre toujours où elle en est :

```js
etat.textContent = "Chargement…";
bouton.disabled = true;
try {
  const outils = await chargerOutils();
  afficher(outils);
  etat.textContent = "";
} catch (erreur) {
  etat.textContent = "Impossible de charger les outils. Réessaie dans un instant.";
} finally {
  bouton.disabled = false;
}
```

| État | Ce que voit l'utilisateur |
|---|---|
| **chargement** | un message ou un indicateur, le bouton désactivé (pas de double clic) |
| **succès** | les données |
| **erreur** | un message compréhensible, et un moyen de réessayer |

## CORS : l'erreur que tout le monde rencontre

```output
Access to fetch at 'http://localhost:4000/outils' from origin 'http://localhost:5173'
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present.
```

Par sécurité, une page ne peut lire les réponses d'une **autre origine** (autre domaine, autre
port) que si ce serveur l'autorise. Tu as vu cet en-tête dans le module « Sécurité web ». Deux
solutions :

- l'API autorise l'origine exacte de la page (en-tête `Access-Control-Allow-Origin`) ;
- en développement, le serveur du frontend **relaie** les requêtes `/api` vers l'API (un
  *proxy*) : pour le navigateur, tout vient alors de la même origine. C'est ce que fait Rustine.

## L'onglet Réseau

Dans les outils de développement (F12), l'onglet **Réseau** montre chaque requête : l'URL, la
méthode, le code de réponse, les en-têtes et le corps. C'est le premier endroit où regarder
quand « la page n'affiche rien » : la requête est-elle partie ? qu'a répondu le serveur ?

## Ce que tu sais faire maintenant

- Appeler une API avec `fetch`, en GET et en POST avec du JSON.
- Vérifier `response.ok` avant d'utiliser les données.
- Afficher les états de chargement, de succès et d'erreur.
- Diagnostiquer une erreur CORS et une requête qui échoue avec l'onglet Réseau.
