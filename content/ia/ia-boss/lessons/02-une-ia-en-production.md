---
id: ia-boss-02
title: Mettre une IA en production
minutes: 13
summary: Les garde-fous, les données personnelles, les coûts, la surveillance et l'amélioration continue d'un assistant en ligne.
check:
  - prompt: Un membre écrit son numéro de téléphone et son adresse à l'assistant. Que dit le RGPD ?
    choices:
      - Rien, ce n'est pas un problème
      - "Ces données personnelles doivent être minimisées, protégées, et leur conservation limitée (journaux compris), et les membres informés"
    answer: 1
  - prompt: Comment améliorer l'assistant une fois en ligne ?
    choices:
      - "Collecter les retours (pouce levé ou baissé), ajouter les questions ratées au jeu d'évaluation, puis améliorer en mesurant"
      - Changer de modèle chaque mois
    answer: 0
---

## Les garde-fous

Un assistant en production reçoit des questions imprévues, parfois malveillantes. Les
garde-fous se placent **dans le code**, pas seulement dans le prompt :

- les **actions** passent par des outils dont les paramètres sont **validés**, et les actions
  sensibles (réserver, annuler, payer) demandent une **confirmation** humaine ;
- les **documents** sont délimités et présentés comme des données (injection de prompt) ;
- le nombre de **tours** de l'agent est limité ;
- si l'API du fournisseur est en panne, un **message de repli** s'affiche.

## Les données personnelles

En Europe, le **RGPD** s'applique dès qu'on traite des données personnelles : nom, e-mail,
historique de prêts, et tout ce qu'un membre écrit à l'assistant.

- **Minimiser** : n'envoyer au modèle que ce qui est nécessaire à la réponse.
- **Informer** : dire aux membres qu'ils parlent à une IA, et ce que deviennent leurs messages.
- **Limiter la conservation** : les journaux de conversation sont des données personnelles ;
  ils ont une durée de vie, puis sont supprimés.
- **Vérifier le fournisseur** : où les données sont traitées, si elles servent à
  l'entraînement, quelle durée de conservation (les fournisseurs proposent des options pour
  les entreprises).

## Les coûts

| Levier | Effet |
|---|---|
| limiter l'historique renvoyé | moins de jetons d'entrée à chaque message |
| le cache de prompt (consigne et documents stables) | les jetons répétés coûtent beaucoup moins cher |
| un effort ou un modèle plus léger pour les questions simples | moins cher et plus rapide |
| surveiller le coût **par conversation** | détecter une boucle ou un abus |

## Surveiller et améliorer

Un assistant n'est jamais « fini ». Le cycle :

1. **Journaliser** chaque échange (sans données sensibles inutiles) : question, passages
   trouvés, outils appelés, réponse, jetons, durée.
2. **Collecter les retours** : un pouce levé ou baissé sous chaque réponse.
3. **Ajouter** les questions ratées au jeu d'évaluation.
4. **Améliorer** (le découpage, le prompt, les outils), un changement à la fois, en
   **mesurant** sur le jeu d'évaluation.
5. **Versionner** les prompts comme du code : on sait quelle version a produit quelle
   réponse, et on peut revenir en arrière.

## Ce que tu sais faire maintenant

- Placer les garde-fous d'un assistant dans le code.
- Appliquer les principes du RGPD à un assistant.
- Maîtriser les coûts d'un assistant en ligne.
- Faire vivre un assistant : journaux, retours, évaluation, versions.
