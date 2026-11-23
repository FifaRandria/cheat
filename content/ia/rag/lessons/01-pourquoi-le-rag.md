---
id: rag-01
title: Pourquoi le RAG ?
minutes: 12
summary: Les limites d'un modèle de langage seul, et comment le RAG lui donne accès à tes documents, étape par étape.
check:
  - prompt: Pourquoi un modèle de langage ne connaît-il pas le règlement intérieur de ton entreprise ?
    choices:
      - Parce qu'il est mal entraîné
      - Parce que ce document ne faisait pas partie de ses données d'entraînement
      - Parce qu'il refuse de répondre
    answer: 1
  - prompt: Dans un système RAG, que se passe-t-il AVANT que le modèle génère sa réponse ?
    choices:
      - On le ré-entraîne sur les documents
      - On recherche les passages pertinents et on les ajoute au prompt
      - Rien
    answer: 1
  - prompt: "RAG ou fine-tuning : que choisir pour répondre à partir d'une documentation qui change chaque semaine ?"
    choices:
      - Le fine-tuning, pour que le modèle apprenne la documentation
      - Le RAG, car il suffit de mettre à jour les documents indexés, sans réentraîner
    answer: 1
---

## Les limites d'un modèle seul

Un grand modèle de langage (LLM) a appris à partir d'énormes quantités de textes, jusqu'à une
certaine date. Il a trois limites quand on veut l'utiliser dans une entreprise :

1. **Il ne connaît pas tes documents** : contrats, procédures internes, catalogue produit.
2. **Ses connaissances sont figées** à la date de son entraînement.
3. **Il peut inventer** une réponse plausible mais fausse : on parle d'**hallucination**.

## L'idée du RAG

**RAG** signifie *Retrieval-Augmented Generation* : génération augmentée par la recherche.

> **Analogie** : un examen à livre ouvert. Au lieu de compter sur sa mémoire, l'étudiant
> cherche d'abord les bonnes pages dans le manuel, puis rédige sa réponse en s'appuyant dessus.

Concrètement, quand l'utilisateur pose une question :

1. on **recherche** dans les documents de l'entreprise les passages les plus pertinents ;
2. on les **ajoute au prompt**, avec la question ;
3. le modèle **génère** une réponse en s'appuyant sur ces passages, et peut citer ses sources.

## Le pipeline complet

Le RAG a deux phases.

**Une fois, à l'avance : l'indexation**

| Étape | Ce qu'on fait |
|---|---|
| Charger | lire les documents (PDF, pages web, base de connaissances) |
| Découper | les couper en morceaux de taille raisonnable, les *chunks* |
| Vectoriser | transformer chaque morceau en vecteur de nombres, un *embedding* |
| Stocker | ranger les vecteurs dans une **base vectorielle** |

**À chaque question : la réponse**

| Étape | Ce qu'on fait |
|---|---|
| Vectoriser la question | avec le même modèle d'embeddings |
| Rechercher | trouver les *k* morceaux les plus proches de la question |
| Construire le prompt | consignes, passages trouvés, question |
| Générer | le LLM rédige la réponse |

Les trois leçons suivantes détaillent les étapes où naissent presque tous les bugs : la
similarité, le découpage, la recherche et le prompt.

## RAG ou fine-tuning ?

| Besoin | Meilleur outil |
|---|---|
| Répondre à partir de documents qui changent souvent | **RAG** : on met à jour l'index, sans réentraîner |
| Citer ses sources | **RAG** |
| Changer le **style** ou le **format** des réponses du modèle | **Fine-tuning** |
| Apprendre une tâche très spécifique | **Fine-tuning** |

Les deux se combinent souvent : un modèle fine-tuné pour le ton de l'entreprise, alimenté
par un RAG pour les faits.

> **À retenir** : le RAG ne rend pas le modèle plus intelligent. Il lui donne les **bonnes
> pages à lire** au bon moment. Si la recherche ramène les mauvais passages, même le meilleur
> modèle répondra à côté.

## Ce que tu sais faire maintenant

- Citer les trois limites d'un modèle de langage seul.
- Décrire les deux phases d'un système RAG et leurs étapes.
- Choisir entre RAG et fine-tuning selon le besoin.
