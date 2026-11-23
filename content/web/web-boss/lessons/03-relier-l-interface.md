---
id: web-boss-04
title: Relier l'interface et l'API
minutes: 12
summary: Le contrat entre le frontend et le backend, où garder le jeton de connexion, et comment traduire chaque réponse de l'API en message pour l'utilisateur.
check:
  - prompt: L'API répond 409 quand un membre emprunte un outil déjà prêté. Que doit faire l'interface ?
    choices:
      - Afficher « Erreur 409 »
      - "Afficher un message compréhensible (« quelqu'un vient de l'emprunter »), puis recharger le catalogue pour montrer l'état réel"
      - Ne rien afficher
    answer: 1
  - prompt: Pourquoi recharger la liste après un emprunt réussi ?
    choices:
      - "Pour afficher l'état réel du serveur (l'outil est maintenant prêté), plutôt que de deviner"
      - Ce n'est pas utile
    answer: 0
---

## Deux programmes, un contrat

Le frontend et le backend sont deux programmes séparés, souvent écrits par des personnes
différentes. Ce qui les relie, c'est le **contrat de l'API** que tu as lu dans la première
leçon du projet : les routes, ce qu'elles reçoivent, ce qu'elles renvoient, et leurs codes
d'erreur. Tant que chacun respecte le contrat, chacun peut évoluer sans casser l'autre.

| L'API renvoie | L'interface affiche |
|---|---|
| 200 / 201 | le résultat, et met à jour l'écran |
| 400 | « vérifie ta saisie » (le message de l'API peut aider) |
| 401 | « connecte-toi » |
| 403 | « tu n'as pas le droit » |
| 404 | « introuvable » |
| 409 | le conflit, expliqué (« quelqu'un vient de l'emprunter ») |
| 500, réseau coupé | « une erreur est survenue, réessaie » |

> **À retenir** : l'utilisateur ne doit **jamais** voir un code HTTP brut ni un message
> technique. Chaque code du contrat a sa phrase.

## Le jeton de connexion

Pour une route protégée, la page envoie le jeton dans l'en-tête `Authorization`, comme dans
le projet : `Authorization: Bearer jeton-ada`.

Où garder ce jeton dans le navigateur ? Deux écoles :

| Stockage | Avantage | Risque |
|---|---|---|
| `localStorage` | simple à lire en JavaScript | une faille XSS peut le voler |
| cookie `httpOnly` | invisible pour JavaScript, envoyé automatiquement | demande de se protéger du CSRF (`sameSite`) |

Rustine utilise un cookie `httpOnly` : c'est le choix le plus sûr, vu dans le module
« Sécurité web ». Dans l'étape du projet, le jeton est simplement passé en paramètre.

## Toujours repartir de la vérité du serveur

Après une action (emprunter, rendre), deux options :

1. **deviner** le nouvel état (« l'outil est maintenant prêté ») et modifier l'écran ;
2. **recharger** les données depuis l'API.

La seconde est plus simple et toujours juste : si un autre membre a emprunté un outil entre
temps, l'écran le montrera. On ne passe à la première (on parle de mise à jour
« optimiste ») que si l'application doit être très réactive, et en gérant le retour arrière
en cas d'erreur.

## Le proxy de développement

En développement, le frontend tourne souvent sur un port (5173 pour Vite, 3000 pour Next.js)
et l'API sur un autre (4000). Pour éviter les erreurs CORS, le serveur du frontend **relaie**
les appels `/api/…` vers l'API : la page appelle `fetch("/api/outils")`, sans écrire l'adresse
de l'API. En production, un serveur web ou l'hébergeur fait le même travail. Tu le mettras en
place dans le module « Ton projet sur ta machine ».

## Ce que tu sais faire maintenant

- Traduire chaque code de réponse du contrat en message pour l'utilisateur.
- Envoyer le jeton de connexion, et choisir où le stocker.
- Recharger l'état réel après une action.
- Expliquer le rôle d'un proxy de développement.
