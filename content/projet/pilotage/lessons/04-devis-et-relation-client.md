---
id: pilotage-04
title: Devis, changements et relation client
minutes: 14
summary: Estimer et chiffrer un devis, choisir entre forfait et régie, gérer une demande de changement, et faire valider la livraison.
check:
  - prompt: Au forfait, qui porte le risque d'un dépassement de temps ?
    choices: ["Le client", "Le prestataire"]
    answer: 1
  - prompt: Le client demande une fonctionnalité non prévue au devis initial. Que faire ?
    choices:
      - La développer gratuitement pour garder une bonne relation
      - L'estimer et proposer un avenant (coût et délai), que le client accepte ou non
      - Refuser
    answer: 1
  - prompt: À quoi sert le procès-verbal de recette ?
    choices:
      - À formaliser que le client a vérifié et accepté la livraison
      - À facturer plus
    answer: 0
---

## Du besoin au devis

Un devis sérieux se construit, il ne se devine pas :

1. **Comprendre le besoin** : objectifs, utilisateurs, périmètre (le cadrage du module GP0).
2. **Découper** en fonctionnalités, puis en tâches.
3. **Estimer** chaque tâche en jours, avec l'équipe qui la réalisera.
4. **Ajouter** gestion de projet, tests, recette, mise en production.
5. **Ajouter une marge pour risques**, selon les incertitudes (10 à 30 %).
6. **Chiffrer** : jours × TJM.
7. **Rédiger** le périmètre inclus **et exclu**, les hypothèses, le planning et les conditions.

> **Attention** : le périmètre **exclu** et les **hypothèses** (« le client fournit les textes
> et les photos », « un seul aller-retour sur les maquettes ») protègent autant que le prix.

## Forfait ou régie ?

| | Forfait | Régie |
|---|---|---|
| Principe | un prix fixe pour un résultat défini | le client paie le temps passé |
| Risque de dépassement | porté par le **prestataire** | porté par le **client** |
| Idéal quand | le besoin est clair et stable | le besoin est flou ou évolutif |
| Changement de périmètre | avenant obligatoire | simple repriorisation |

Au forfait, une estimation trop optimiste se paie **sur la marge du prestataire**. D'où
l'importance de la marge pour risques.

## Gérer les demandes de changement

Les besoins évoluent, c'est normal. Ce qui crée les conflits, ce sont les changements **non
formalisés**. Pour chaque demande :

1. la noter ;
2. l'**estimer** (coût, délai, impact sur le reste) ;
3. proposer les options : l'ajouter avec un **avenant**, l'échanger contre une autre
   fonctionnalité de même taille, ou la reporter en V2 ;
4. obtenir une **décision écrite** du client.

> **À retenir** : « oui, c'est possible, voici ce que ça coûte et ce que ça décale » est
> toujours meilleur qu'un « oui » gratuit qui fera déraper le projet, ou qu'un « non » sec.

## La recette et le procès-verbal

À la livraison, le client teste le produit selon les critères convenus (la **recette**). Il
signe ensuite un **procès-verbal de recette** :

- **sans réserve** : la livraison est acceptée ;
- **avec réserves** : liste des défauts à corriger, avec un délai ;
- **refus** : les défauts empêchent l'utilisation.

Le PV marque souvent le début de la **garantie** et déclenche la dernière facture.

## Une bonne relation client

- **Pas de surprise** : les mauvaises nouvelles arrivent tôt, avec des options (leçon
  précédente).
- **Un interlocuteur** de chaque côté, qui a le pouvoir de décider.
- **Des décisions écrites**, même par un simple e-mail récapitulatif après une réunion.
- **Montrer souvent** le produit, plutôt que tout dévoiler à la fin.

## Ce que tu sais faire maintenant

- Construire un devis : découpage, estimation, marge, périmètre exclu et hypothèses.
- Choisir entre forfait et régie.
- Traiter une demande de changement avec un avenant ou un échange.
- Organiser la recette et le procès-verbal.
