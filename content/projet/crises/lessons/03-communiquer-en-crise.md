---
id: crises-03
title: Communiquer pendant une crise
minutes: 11
summary: Prévenir tôt, dire ce qu'on sait et ce qu'on ne sait pas, donner un rendez-vous plutôt qu'une promesse.
check:
  - prompt: Le site est en panne depuis 5 minutes. On ne connaît pas encore la cause. Faut-il communiquer ?
    choices:
      - Non, on attend d'avoir la cause
      - Oui, tout de suite, pour dire qu'on est au courant et quand viendra la prochaine information
    answer: 1
  - prompt: "Lequel de ces messages est le meilleur ?"
    choices:
      - « Tout sera réparé dans 10 minutes. »
      - « Nous constatons des échecs de paiement depuis 21 h 02. Nos équipes travaillent à les corriger. Prochain point à 21 h 30. »
      - « Problème technique. »
    answer: 1
  - prompt: Pourquoi éviter d'annoncer une heure de résolution précise ?
    choices:
      - Parce qu'on ne la connaît généralement pas, et qu'une promesse non tenue détruit la confiance
      - C'est interdit
    answer: 0
---

## Le silence est la pire communication

Pendant une panne, les clients, le support et la direction se posent la même question :
« est-ce qu'ils sont au courant ? ». Sans nouvelles, ils imaginent le pire, appellent le
support, et se plaignent publiquement.

> **À retenir** : communique **tôt**, même sans tout savoir. « Nous sommes au courant, nous
> enquêtons » vaut infiniment mieux que le silence.

## Un bon message de crise

Il répond à quatre questions, en termes simples :

1. **Que se passe-t-il ?** Du point de vue de l'utilisateur, pas du serveur.
2. **Depuis quand, et qui est touché ?**
3. **Que faisons-nous ?**
4. **Quand aura-t-on des nouvelles ?**

```output
21 h 07 · Paiements indisponibles
Depuis 21 h 02, les paiements par carte échouent sur le site et l'application.
Les réservations sans paiement fonctionnent normalement.
Nos équipes sont mobilisées pour rétablir le service.
Prochain point à 21 h 30 au plus tard.
```

## Ce qu'il faut éviter

| À éviter | Pourquoi | Plutôt |
|---|---|---|
| « Réparé dans 10 minutes » | promesse rarement tenue | « prochain point à 21 h 30 » |
| « Problème technique » | ne dit rien | décrire l'impact pour l'utilisateur |
| « Erreur 502 du load balancer » | jargon incompréhensible | « le site ne répond plus » |
| Accuser un prestataire ou un collègue | crée une polémique, et on se trompe souvent | rester factuel |
| Minimiser | les clients voient bien ce qui se passe | reconnaître l'impact |

## Deux publics, deux messages

- **En interne** (direction, support, commerciaux) : plus de détails, l'impact estimé, ce que
  le support peut répondre aux clients.
- **En externe** (clients) : l'impact pour eux, ce qu'ils peuvent faire en attendant, le
  prochain rendez-vous.

Beaucoup d'entreprises utilisent une **page de statut** publique, mise à jour pendant
l'incident : les clients savent où regarder, et le support reçoit moins d'appels.

## Après la crise

Un dernier message annonce le **retour à la normale**, rappelle brièvement l'impact, et, pour
un incident grave, promet un retour d'expérience. Un geste commercial peut accompagner les
clients les plus touchés.

> **Astuce** : prépare des **modèles de messages** à l'avance, à froid. En pleine crise, à
> 21 h un samedi, personne n'écrit bien.

## Ce que tu sais faire maintenant

- Communiquer tôt, même sans connaître la cause.
- Rédiger un message qui dit quoi, depuis quand, ce qu'on fait et quand viendra la suite.
- Éviter les promesses, le jargon et les accusations.
- Adapter le message au public interne ou externe.
