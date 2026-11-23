---
id: ia-boss-01
title: "Le projet : l'assistant de la Boîte à outils"
minutes: 13
summary: Décider si un LLM est la bonne solution, concevoir l'architecture d'un assistant (RAG, outils, évaluation), et le plan pour le construire.
check:
  - prompt: Quelle est la première question à se poser avant de construire un assistant IA ?
    choices:
      - Quel modèle choisir
      - "Quel problème réel il résout, et si une solution plus simple (une FAQ, un formulaire) ne suffirait pas"
    answer: 1
  - prompt: Pourquoi construire le jeu d'évaluation AVANT le prototype ?
    choices:
      - "Pour savoir dès le premier essai si l'assistant répond bien, et mesurer chaque amélioration"
      - Ce n'est pas utile avant la mise en production
    answer: 0
---

## Le besoin

Depuis la mise en ligne de la Boîte à outils (le projet final web), les bénévoles reçoivent des
dizaines de questions par semaine : « combien coûte l'adhésion ? », « est-ce que je peux
prolonger mon prêt ? », « la perceuse est-elle disponible ? ». Les réponses sont dans le
règlement ou dans la base, mais personne ne les lit.

L'association veut un **assistant** qui répond à ces questions, et qui peut réserver un outil
pour un membre.

## Un LLM est-il la bonne solution ?

Avant d'écrire une ligne de code, on vérifie que l'IA est utile :

| Question | Ici |
|---|---|
| Les questions sont-elles variées et formulées librement ? | oui : une FAQ figée ne couvre pas tout |
| Les réponses existent-elles quelque part ? | oui : le règlement et la base de données |
| Une erreur est-elle grave ? | une mauvaise réponse sur le règlement est gênante, une mauvaise réservation l'est plus |
| Le coût est-il raisonnable ? | quelques centaines de questions par mois : quelques euros |

> **À retenir** : beaucoup de projets d'IA échouent parce qu'ils résolvent un problème qui
> n'existe pas, ou qu'un simple formulaire aurait résolu. L'IA se justifie par le besoin, pas
> par la mode.

## L'architecture

Tu as appris chaque brique dans les modules précédents :

| Brique | Rôle ici | Module |
|---|---|---|
| **RAG** | retrouver les passages du règlement qui répondent à la question | RAG |
| **Prompt** | consigne, documents délimités, historique limité | LLM par API |
| **Outils** | consulter la disponibilité, réserver avec confirmation | LLM par API (agents) |
| **Évaluation** | mesurer la qualité avant et après chaque changement | LLM par API |
| **Automatisation** | prévenir un bénévole quand l'assistant ne sait pas | Automatisation avec n8n |

## Le plan

1. **Planifier** : l'ordre des étapes d'un projet d'IA.
2. **La recherche** : découper le règlement et retrouver les bons passages.
3. **La requête** : construire le prompt avec les documents et l'historique.
4. **L'agent** : les outils, avec confirmation et validation (un audit à corriger).
5. **L'évaluation** : l'outil qui mesure l'assistant complet.
6. **La production** : les décisions d'un assistant en ligne, en mode Blackout.

Le bac à sable n'ayant pas de réseau, les étapes utilisent un faux modèle et un « embedding »
simplifié. Le code que tu écris, lui, est celui que tu brancherais sur une vraie API.

## Ce que tu sais faire maintenant

- Décider si un LLM est la bonne réponse à un besoin.
- Décrire l'architecture d'un assistant : RAG, prompt, outils, évaluation.
- Planifier la construction d'un assistant, évaluation comprise.
