---
id: n8n-01
title: Automatiser avec n8n, webhooks et workflows
minutes: 13
summary: Ce qu'est un workflow d'automatisation, le rôle des déclencheurs et des webhooks, et comment les données circulent de nœud en nœud.
check:
  - prompt: Qu'est-ce qu'un webhook ?
    choices:
      - Une adresse web qu'un service externe appelle pour prévenir qu'un événement a eu lieu
      - Un virus
      - Une base de données
    answer: 0
  - prompt: Un workflow ne se déclenche jamais alors que le formulaire est bien envoyé. Que vérifier en premier ?
    choices:
      - Que le workflow est activé, et que le formulaire appelle bien l'URL de production du webhook (et non l'URL de test)
      - Le modèle de langage
      - La base de données
    answer: 0
  - prompt: Où ranger la clé d'API d'un service dans n8n ?
    choices:
      - Dans un credential, géré et chiffré par n8n
      - En clair dans un nœud Code
    answer: 0
---

## Automatiser, c'est quoi ?

Une entreprise répète chaque jour des tâches sans valeur : recopier un formulaire dans un
tableur, envoyer un e-mail de bienvenue, prévenir l'équipe sur la messagerie quand une commande
dépasse 1 000 €. L'**automatisation** confie ces enchaînements à un programme.

**n8n** est un outil d'automatisation visuel (et open source) : on assemble des **nœuds** sur un
canevas, chacun faisant une action, et les données circulent de l'un à l'autre.

## Anatomie d'un workflow

```output
[Webhook] → [Vérifier les données] → [LLM : résumer la demande] → [Base de données] → [Message à l'équipe]
```

| Élément | Rôle | Exemples |
|---|---|---|
| **Déclencheur** | démarre le workflow | webhook, horaire (cron), nouvel e-mail |
| **Nœuds d'action** | font quelque chose | requête HTTP, base de données, envoi d'e-mail, appel à un LLM |
| **Nœuds de logique** | orientent les données | IF, Switch, Merge |
| **Credentials** | stockent les accès aux services | clés d'API, mots de passe, OAuth |

## Les webhooks

Un **webhook** est une URL que n8n met à disposition. Quand un service externe (un formulaire,
un paiement Stripe, GitHub) envoie une requête HTTP à cette URL, le workflow démarre avec les
données reçues.

C'est l'inverse d'une API classique : au lieu de demander régulièrement « y a-t-il du nouveau ? »,
on est **prévenu** dès que quelque chose se produit.

> **Attention** : n8n propose une **URL de test** (active seulement pendant que tu cliques sur
> « écouter ») et une **URL de production** (active seulement quand le workflow est **activé**).
> Un formulaire branché sur l'URL de test, ou un workflow non activé, est la cause n°1 de
> « mon workflow ne se déclenche jamais ».

## Les données qui circulent

Chaque nœud reçoit des **items** (en JSON) et en produit d'autres. On fait référence aux données
d'un nœud précédent avec des **expressions** :

```output
{{ $json.email }}                     l'e-mail de l'item courant
{{ $('Webhook').item.json.nom }}      le nom reçu par le nœud Webhook
```

Une faute de frappe dans un nom de champ (`$json.mail` au lieu de `$json.email`) ne provoque pas
forcément d'erreur : la valeur est simplement **vide**, et le problème apparaît trois nœuds plus
loin.

> **À retenir** : pour diagnostiquer un workflow, ouvre l'**historique des exécutions** et
> regarde les données réellement reçues et produites par **chaque nœud**, dans l'ordre. C'est le
> `console.log` de l'automatisation.

## Les credentials

Les clés d'API et mots de passe se rangent dans les **credentials** de n8n, chiffrés, et jamais
en clair dans un nœud. Une clé expirée ou révoquée donne une erreur `401` au nœud qui l'utilise.

## Ce que tu sais faire maintenant

- Décrire un workflow : déclencheur, nœuds d'action et de logique, credentials.
- Expliquer le rôle d'un webhook, et la différence entre URL de test et de production.
- Référencer les données d'un nœud précédent.
- Diagnostiquer un workflow avec l'historique des exécutions.
