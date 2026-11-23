---
id: n8n-02
title: Erreurs et réessais
minutes: 14
summary: Quand réessayer, quand abandonner, et pourquoi attendre de plus en plus longtemps entre deux tentatives.
check:
  - prompt: L'API d'un LLM répond 429 Too Many Requests. Que faire ?
    choices:
      - Abandonner définitivement
      - Réessayer un peu plus tard, avec un délai croissant
      - Réessayer immédiatement, en boucle
    answer: 1
  - prompt: L'API répond 400 Bad Request (données invalides). Faut-il réessayer ?
    choices:
      - Oui, plusieurs fois
      - Non, la même requête échouera toujours ; il faut corriger les données ou signaler l'erreur
    answer: 1
  - prompt: "Avec un délai de base de 1 s qui double à chaque tentative, combien d'attente avant la 4e tentative ?"
    choices: ["3 s", "4 s", "8 s"]
    answer: 1
    explain: "1 s avant la 2e, 2 s avant la 3e, 4 s avant la 4e."
---

## Tout échoue, un jour

Un workflow appelle des services externes : une API de paiement, un LLM, un CRM. Ils sont
parfois **lents**, **saturés** ou **en maintenance**. Un workflow robuste prévoit l'échec.

> **Déjà vu** : la règle est la même qu'avec une API de LLM (module « LLM par API ») : on ne
> réessaie que les erreurs passagères, avec une attente croissante.

## Les erreurs passagères et les erreurs définitives

Toutes les erreurs ne se valent pas :

| Code ou erreur | Signification | Réessayer ? |
|---|---|---|
| `429 Too Many Requests` | trop de requêtes, ralentis | **oui**, plus tard |
| `500`, `502`, `503`, `504` | le service a un problème | **oui**, plus tard |
| délai dépassé, connexion coupée | réseau instable | **oui** |
| `400 Bad Request` | tes données sont invalides | **non**, corriger |
| `401`, `403` | clé invalide ou droits insuffisants | **non**, corriger le credential |
| `404` | la ressource n'existe pas | **non** |

> **À retenir** : on réessaie les erreurs **passagères** (429, 5xx, réseau). Réessayer une
> erreur **définitive** (400, 401, 404) ne fait que perdre du temps et consommer des quotas.

## L'attente exponentielle

Réessayer immédiatement, en boucle, aggrave la situation : un service saturé reçoit encore plus
de requêtes. On attend donc de **plus en plus longtemps** entre les tentatives : c'est
l'**attente exponentielle** (*exponential backoff*).

```python
def delai(tentative, base=1.0):
    """Délai avant la tentative suivante : 1 s, 2 s, 4 s, 8 s…"""
    return base * 2 ** (tentative - 1)

for t in range(1, 5):
    print(f"après l'échec n°{t} : attendre {delai(t)} s")
```

```output
après l'échec n°1 : attendre 1.0 s
après l'échec n°2 : attendre 2.0 s
après l'échec n°3 : attendre 4.0 s
après l'échec n°4 : attendre 8.0 s
```

Et on fixe toujours un **nombre maximal** de tentatives : au-delà, on abandonne et on
**signale** l'échec.

> **Attention** : une boucle de réessais sans limite peut tourner indéfiniment, bloquer le
> workflow, et faire exploser une facture d'API.

## Dans n8n

- chaque nœud a des options **Retry On Fail** (nombre de tentatives et délai) ;
- un **Error Workflow** est déclenché quand un workflow échoue : on y envoie une alerte
  (e-mail, messagerie) avec le nom du workflow et l'erreur ;
- l'option **Continue On Fail** laisse passer l'erreur pour la traiter dans les nœuds suivants.

## Ce que tu sais faire maintenant

- Distinguer erreurs passagères et erreurs définitives.
- Calculer une attente exponentielle.
- Limiter le nombre de tentatives, puis signaler l'échec.
- Configurer les réessais et un workflow d'erreur dans n8n.
