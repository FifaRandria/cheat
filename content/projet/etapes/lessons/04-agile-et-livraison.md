---
id: gp-etapes-04
title: Construire en agile, livrer, maintenir
minutes: 15
summary: Scrum et Kanban sans jargon, la définition du « terminé », la recette, la mise en production et la vie après le lancement.
check:
  - prompt: "À quoi sert la rétrospective en fin de sprint ?"
    choices:
      - À montrer le travail au client
      - À améliorer la façon de travailler de l'équipe
      - À attribuer les tâches du sprint suivant
    answer: 1
    explain: "La revue de sprint montre le produit. La rétrospective améliore le processus."
  - prompt: Un développeur dit qu'une fonctionnalité est « finie », mais elle n'est ni testée ni relue. Que manque-t-il à l'équipe ?
    choices:
      - Une définition du « terminé » partagée
      - Un développeur de plus
      - Un sprint plus long
    answer: 0
  - prompt: Quel est le meilleur moment pour mettre en production une nouvelle version d'un site de restaurant ?
    choices:
      - Le vendredi à 19 h, juste avant le service
      - Un mardi matin, avec un plan de retour en arrière prêt
      - Le plus tard possible, en livrant tout d'un coup
    answer: 1
---

## Pourquoi l'agilité ?

Dans l'approche traditionnelle « en cascade », on fait tout le cadrage, puis toute la
conception, puis tout le développement… et le client découvre le produit à la fin. S'il ne
correspond pas, c'est trop tard.

Les méthodes **agiles** font l'inverse : on livre **un petit morceau utile toutes les une à
quatre semaines**, on le montre, on récolte les retours, et on ajuste.

## Scrum en pratique

**Scrum** est la méthode agile la plus répandue. Elle découpe le temps en **sprints** de
durée fixe (souvent deux semaines), rythmés par quatre rendez-vous :

| Rituel | Quand | Durée | À quoi ça sert |
|---|---|---|---|
| **Planification de sprint** | début du sprint | 1 à 2 h | choisir les stories du sprint dans le haut du backlog |
| **Daily** | chaque matin | 15 min max | se synchroniser et repérer les blocages |
| **Revue de sprint** | fin du sprint | 1 h | montrer ce qui marche au client, récolter ses retours |
| **Rétrospective** | fin du sprint | 1 h | améliorer la façon de travailler de l'équipe |

Au daily, chacun répond en une minute : qu'ai-je fait hier, que fais-je aujourd'hui,
**qu'est-ce qui me bloque** ? Ce n'est pas un compte rendu au chef : c'est le moment où un
collègue dit « je peux t'aider ».

Trois rôles :

- le **Product Owner** décide **quoi** construire et dans quel ordre (il tient le backlog) ;
- l'**équipe de développement** décide **comment** le construire ;
- le **Scrum Master** protège le processus et aide à lever les blocages.

## Kanban : le flux continu

**Kanban** est plus simple : un tableau avec des colonnes (À faire, En cours, En revue,
Terminé), et une règle clé : **limiter le nombre de tâches « En cours »**. Mieux vaut finir
deux tâches que d'en commencer six.

Kanban convient bien à la **maintenance**, où les demandes arrivent en continu.

## La définition du « terminé »

« C'est fini » ne veut pas dire la même chose pour tout le monde. L'équipe écrit une
**définition du terminé** (*Definition of Done*) commune, par exemple :

- le code est relu par un autre développeur ;
- les tests automatiques passent (le CI est vert) ;
- les critères d'acceptation de la story sont vérifiés ;
- la fonctionnalité est déployée sur l'environnement de test.

> **À retenir** : une story qui ne respecte pas la définition du terminé n'est **pas**
> terminée, même si « il ne reste qu'un petit truc ». C'est ce petit truc qui fait déraper
> les plannings.

## Recette et mise en production

Avant d'ouvrir au public :

1. **Recette** : le client (Sofia) teste lui-même, sur un environnement de test, avec des cas
   réels. Il valide ou liste les écarts.
2. **Préparer la mise en production** : sauvegarde de la base, liste des étapes, et surtout
   un **plan de retour en arrière** si quelque chose casse.
3. **Choisir le bon moment** : jamais juste avant un pic d'activité. Pour un restaurant,
   pas le vendredi soir.
4. **Surveiller** juste après : logs, erreurs, premières réservations.

> **Attention** : « On met en prod vendredi à 18 h et on rentre chez nous » est la recette
> classique d'un week-end gâché.

## La vie après le lancement

Une fois en ligne :

- on **mesure** les objectifs du cadrage : quelle part des réservations passe par le site ?
  Combien de clients absents ?
- on **corrige** les bugs remontés ;
- on **fait évoluer** le produit à partir des retours réels, en reprenant les « Should » et
  les « Could » du backlog.

C'est là que la boucle se referme : les retours des utilisateurs alimentent le backlog, qui
alimente les sprints suivants.

## Ce que tu sais faire maintenant

- Expliquer l'intérêt de livrer par petits incréments.
- Décrire les rituels et les rôles de Scrum, et le principe de Kanban.
- Rédiger une définition du terminé.
- Préparer une recette et une mise en production sans risque inutile.
