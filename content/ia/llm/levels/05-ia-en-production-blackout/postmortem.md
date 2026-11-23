## Les réflexes d'une IA en production

- **Coût** : surveiller les jetons par conversation, limiter l'historique, utiliser le cache.
- **Sécurité** : le modèle conseille, le code décide. Toute action à valeur passe par un outil
  contrôlé.
- **Vérité** : un modèle sans la donnée l'invente. Les faits viennent d'outils ou de documents
  (RAG, module suivant).
- **Qualité** : aucun changement de prompt sans passage sur le jeu d'évaluation.
- **Disponibilité** : réessais avec attente croissante, et un message de repli.
