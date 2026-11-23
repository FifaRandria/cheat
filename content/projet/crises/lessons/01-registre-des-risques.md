---
id: crises-01
title: Anticiper avec le registre des risques
minutes: 12
summary: Identifier ce qui peut mal tourner, le prioriser avec probabilité et impact, et choisir une réponse avant que ça arrive.
check:
  - prompt: Comment calcule-t-on la criticité d'un risque ?
    choices:
      - Probabilité × impact
      - Coût du projet ÷ durée
      - Nombre de personnes concernées
    answer: 0
  - prompt: "Le seul développeur qui connaît le module de paiement part en congés pendant la mise en production. Quelle réponse est une RÉDUCTION du risque ?"
    choices:
      - Ne rien faire et espérer
      - Organiser une passation et documenter le module avant son départ
      - Annuler le projet
    answer: 1
  - prompt: Un risque a une probabilité très faible et un impact très faible. Que faire ?
    choices:
      - Mobiliser toute l'équipe dessus
      - L'accepter, en le gardant dans le registre
    answer: 1
---

## Un risque n'est pas un problème… pas encore

Un **problème** est déjà arrivé. Un **risque** est un événement **incertain** qui, s'il se
produit, aura un impact sur le projet : retard, surcoût, qualité, sécurité.

Gérer les risques, c'est les traiter **pendant qu'ils sont encore bon marché** : avant qu'ils
ne deviennent des problèmes, puis des crises.

## Le registre des risques

Un simple tableau, tenu à jour tout au long du projet :

| Risque | Probabilité (1-3) | Impact (1-3) | Criticité | Réponse | Responsable |
|---|---|---|---|---|---|
| Le prestataire de paiement change son API | 1 | 3 | 3 | surveiller les annonces, prévoir 2 jours de marge | Léa |
| Le seul expert du paiement est absent au lancement | 2 | 3 | **6** | passation et documentation avant ses congés | Karim |
| Pic de trafic le soir du lancement | 3 | 2 | **6** | test de charge, serveur dimensionné | Tom |
| Changement de logo demandé par le client | 2 | 1 | 2 | accepter | Sofia |

La **criticité** = probabilité × impact. On s'occupe d'abord des risques à forte criticité.

> **À retenir** : un risque sans **responsable** et sans **réponse** n'est pas géré, il est
> seulement noté.

## Les quatre réponses possibles

| Réponse | Principe | Exemple |
|---|---|---|
| **Éviter** | supprimer la cause | ne pas utiliser une technologie que personne ne maîtrise |
| **Réduire** | diminuer la probabilité ou l'impact | tests, documentation, sauvegardes |
| **Transférer** | confier l'impact à un tiers | assurance, hébergeur avec garantie de service |
| **Accepter** | le garder sous surveillance | risques faibles, ou trop coûteux à traiter |

## Identifier les risques

Les sources classiques, à passer en revue à chaque début de projet :

- **humaines** : départs, absences, une personne indispensable (le « facteur bus » : combien
  de personnes peuvent être renversées par un bus avant que le projet s'arrête ?) ;
- **techniques** : technologie nouvelle, dépendance externe, performances ;
- **client** : exigences floues, décideur indisponible, changements fréquents ;
- **planning** : estimations optimistes, dépendances entre tâches ;
- **sécurité et données** : fuite, perte, conformité au RGPD.

> **Astuce** : demande à l'équipe « qu'est-ce qui pourrait nous faire échouer ? ». Les
> développeurs connaissent souvent les risques techniques bien avant le chef de projet.

## Faire vivre le registre

Le registre se relit régulièrement, par exemple en début de sprint : de nouveaux risques
apparaissent, d'autres disparaissent, des probabilités changent. Un registre écrit au lancement
puis oublié dans un dossier ne protège de rien.

## Ce que tu sais faire maintenant

- Distinguer un risque d'un problème.
- Remplir un registre avec probabilité, impact, criticité, réponse et responsable.
- Choisir entre éviter, réduire, transférer et accepter.
- Faire vivre le registre tout au long du projet.
