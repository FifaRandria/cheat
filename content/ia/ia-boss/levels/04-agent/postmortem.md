## Cause racine

L'agent exécutait **tout ce que le modèle demandait**, tel quel :

- une réservation partait sans que le membre l'ait confirmée : il suffisait d'une question
  ambiguë, ou d'une injection dans un document, pour réserver à sa place ;
- les paramètres n'étaient pas vérifiés : un texte à la place d'un nombre, ou un paramètre
  `membre: "admin"` ajouté, arrivaient jusqu'au service de réservation ;
- rien n'était journalisé : impossible de comprendre après coup ce que l'agent avait fait.

## Correctif

Pour chaque demande d'outil : **valider** l'entrée, **confirmer** si l'action est sensible,
**exécuter** dans un `try`, et **journaliser** le résultat. Chaque refus devient un
`tool_result` en erreur : le modèle peut s'adapter et expliquer la situation au membre.

## Le réflexe à garder

- Le modèle **propose**, le code **dispose** : validation et confirmation sont dans le code.
- Les actions irréversibles demandent toujours l'accord d'un humain.
- Un journal des actions de l'agent est indispensable pour le support, la sécurité et le RGPD.
