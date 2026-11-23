---
id: n8n-03
title: L'idempotence, ou comment ne pas facturer deux fois
minutes: 12
summary: Pourquoi un même événement arrive parfois plusieurs fois, et comment traiter chaque événement une seule fois.
check:
  - prompt: Qu'est-ce qu'une opération idempotente ?
    choices:
      - Une opération qui donne le même résultat qu'on l'exécute une fois ou plusieurs fois
      - Une opération très rapide
      - Une opération qui ne fait rien
    answer: 0
  - prompt: Pourquoi un webhook peut-il recevoir deux fois le même événement ?
    choices:
      - Parce que l'émetteur réessaie quand il n'a pas reçu de confirmation à temps
      - C'est impossible
    answer: 0
  - prompt: Comment rendre le traitement d'un paiement idempotent ?
    choices:
      - Enregistrer l'identifiant unique de chaque événement traité, et ignorer un événement déjà vu
      - Traiter les paiements plus vite
      - Désactiver les réessais
    answer: 0
---

## Le même événement, deux fois

Un service de paiement envoie un webhook « paiement reçu » à ton workflow. Ton workflow met
3 secondes à répondre. Le service, n'ayant pas reçu de réponse à temps, considère l'envoi comme
échoué… et **réessaie**. Ton workflow reçoit donc le même événement **deux fois**.

Résultat, sans précaution : deux factures, deux e-mails de confirmation, deux lignes dans le
tableau des ventes.

C'est le prix des réessais (leçon précédente) : la plupart des services garantissent qu'un
événement est livré **au moins une fois**, jamais **exactement une fois**.

## L'idempotence

Une opération est **idempotente** si l'exécuter plusieurs fois donne le **même résultat**
qu'une seule fois.

| Idempotent | Non idempotent |
|---|---|
| « mettre le statut de la commande 42 à *payée* » | « ajouter 50 € au solde » |
| « enregistrer le client ada@ex.com s'il n'existe pas » | « créer un nouveau client » |
| supprimer la ligne 42 | envoyer un e-mail |

## La technique : retenir les événements traités

Chaque événement porte presque toujours un **identifiant unique** (`evt_8f2a…`). On garde la
liste des identifiants déjà traités, et on ignore les doublons :

```python
deja_traites = set()

def traiter(evenement):
    if evenement["id"] in deja_traites:
        return "ignoré (doublon)"
    deja_traites.add(evenement["id"])
    return f"facture créée pour {evenement['montant']} €"

e = {"id": "evt_1", "montant": 49}
print(traiter(e))
print(traiter(e))
```

```output
facture créée pour 49 €
ignoré (doublon)
```

> **À retenir** : tout workflow déclenché par un webhook doit supposer qu'il recevra **un jour**
> le même événement deux fois. Retiens les identifiants traités, dans une vraie base (et pas en
> mémoire, qui disparaît au redémarrage).

> **Attention** : l'identifiant à utiliser est celui de l'**événement** (fourni par l'émetteur),
> pas l'heure de réception ni un identifiant que tu génères toi-même : un doublon aurait sinon
> un identifiant différent.

## Répondre vite

Autre bonne pratique : répondre **immédiatement** au webhook (« reçu »), puis faire le
traitement long ensuite. L'émetteur ne croit plus à un échec, et réessaie beaucoup moins.

## Ce que tu sais faire maintenant

- Expliquer pourquoi un même événement peut arriver plusieurs fois.
- Distinguer opérations idempotentes et non idempotentes.
- Dédoublonner les événements avec leur identifiant unique.
- Répondre vite à un webhook avant un long traitement.
